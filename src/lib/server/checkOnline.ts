import { MC_QUERY_PORT, SERVER_IP } from "$env/static/private";
import query from "@mcpedb/query";

export async function CheckOnline(pname: string) {
    if(!pname) return { type: false, code: 404, message: "กรุณาผูกบัญชีกับชื่อในเกมส์" }
    try {
        const data = await query(SERVER_IP, Number(MC_QUERY_PORT));
        if (!data.players.includes(pname)) {
            return { type: false, code: 404, message: "กรุณาออนไลน์ในเซิร์ฟเวอร์" }
        }
        return { type: true, code: 200, message: "สำเร็จ" }
    } catch (err) {
        return { type: false, code: 500, message: "เซิร์ฟเวอร์ออฟไลน์" }
    }
}

export async function CheckSumPlayers() {
    try {
        const data = await query(SERVER_IP, Number(MC_QUERY_PORT));
        return `${data.players.length} / ${data.online}`
    } catch (err) {
        return String("เซิร์ฟเวอร์ออฟไลน์")
    }
}