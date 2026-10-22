import { MC_QUERY_PORT, SERVER_IP } from "$env/static/private";
import net from "net";
import dns from "dns/promises";

interface MinecraftPingResult {
    version?: {
        name: string;
        protocol: number;
    };
    players?: {
        max?: number;
        online?: number;
        sample?: Array<{ name: string; id: string }>;
    };
    description?: any;
    favicon?: string;
}

function writeVarInt(value: number): Buffer {
    const bytes: number[] = [];
    while (true) {
        if ((value & ~0x7F) === 0) {
            bytes.push(value);
            return Buffer.from(bytes);
        }
        bytes.push((value & 0x7F) | 0x80);
        value >>>= 7;
    }
}

function readVarInt(buffer: Buffer, offset = 0): { value: number; size: number } | null {
    let value = 0;
    let size = 0;
    while (true) {
        if (offset + size >= buffer.length) return null;
        const byte = buffer[offset + size];
        value |= (byte & 0x7F) << (size * 7);
        size++;
        if ((byte & 0x80) === 0) break;
        if (size > 5) throw new Error("VarInt is too large");
    }
    return { value, size };
}

/**
 * Resolves Minecraft host and port using DNS SRV record (_minecraft._tcp.host)
 * if available, falling back to the original host and default port.
 */
export async function resolveMinecraftHost(host: string, defaultPort = 25565): Promise<{ host: string; port: number }> {
    try {
        const srv = await dns.resolveSrv(`_minecraft._tcp.${host}`);
        if (srv && srv.length > 0) {
            return { host: srv[0].name, port: srv[0].port };
        }
    } catch {
        // No SRV record found, fallback to direct host and port
    }
    return { host, port: defaultPort };
}

/**
 * Pings a Minecraft server using standard Java Server List Ping (SLP) over TCP.
 */
export async function pingMinecraftServer(host: string, port = 25565, timeoutMs = 4000): Promise<MinecraftPingResult> {
    const target = await resolveMinecraftHost(host, port);

    return new Promise((resolve, reject) => {
        const socket = new net.Socket();
        let timer = setTimeout(() => {
            socket.destroy();
            reject(new Error("Minecraft ping timed out"));
        }, timeoutMs);

        socket.connect(target.port, target.host, () => {
            const hostBuf = Buffer.from(target.host, "utf8");
            const packetId = writeVarInt(0x00);
            const protocol = writeVarInt(765);
            const hostLen = writeVarInt(hostBuf.length);
            const portBuf = Buffer.alloc(2);
            portBuf.writeUInt16BE(target.port, 0);
            const nextState = writeVarInt(1);

            const handshakeData = Buffer.concat([packetId, protocol, hostLen, hostBuf, portBuf, nextState]);
            const handshakePacket = Buffer.concat([writeVarInt(handshakeData.length), handshakeData]);

            const statusReqData = writeVarInt(0x00);
            const statusReqPacket = Buffer.concat([writeVarInt(statusReqData.length), statusReqData]);

            socket.write(Buffer.concat([handshakePacket, statusReqPacket]));
        });

        let received = Buffer.alloc(0);

        socket.on("data", (chunk) => {
            received = Buffer.concat([received, chunk]);
            try {
                let offset = 0;
                const packetLen = readVarInt(received, offset);
                if (!packetLen) return;
                offset += packetLen.size;

                if (received.length < offset + packetLen.value) return;

                const packetId = readVarInt(received, offset);
                if (!packetId) return;
                offset += packetId.size;

                const strLen = readVarInt(received, offset);
                if (!strLen) return;
                offset += strLen.size;

                const jsonStr = received.toString("utf8", offset, offset + strLen.value);
                clearTimeout(timer);
                socket.destroy();
                resolve(JSON.parse(jsonStr));
            } catch {
                // Wait for more data or handle parse error
            }
        });

        socket.on("error", (err) => {
            clearTimeout(timer);
            reject(err);
        });
    });
}

export async function CheckOnline(pname: string) {
    if (!pname) return { type: false, code: 404, message: "กรุณาผูกบัญชีกับชื่อในเกมส์" };
    try {
        const port = Number(MC_QUERY_PORT) || 25565;
        const data = await pingMinecraftServer(SERVER_IP, port);

        // Check if player is present in sample list
        const sample = data.players?.sample || [];
        const isOnline = sample.some((p) => p.name.toLowerCase() === pname.toLowerCase());

        if (isOnline) {
            return { type: true, code: 200, message: "สำเร็จ" };
        }

        return { type: false, code: 404, message: "กรุณาออนไลน์ในเซิร์ฟเวอร์" };
    } catch {
        return { type: false, code: 500, message: "เซิร์ฟเวอร์ออฟไลน์" };
    }
}

export async function CheckSumPlayers() {
    try {
        const port = Number(MC_QUERY_PORT) || 25565;
        const data = await pingMinecraftServer(SERVER_IP, port);
        const count = data.players?.online ?? 0;
        return `${count}`;
    } catch {
        return String("เซิร์ฟเวอร์ออฟไลน์");
    }
}