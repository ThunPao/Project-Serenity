import { Rcon } from "rcon-client";
import { RCON_PORT, RCON_PWD, SERVER_IP } from '$env/static/private';

class RconManager {
    private static instance: Rcon | null = null;
    private static isConnecting: boolean = false;
    private static isDisconnecting: boolean = false;

    /**
     * Establishes a connection to the RCON server
     * @returns {Promise<Rcon|null>} RCON client instance or null if connection fails
     */
    private static async connect(): Promise<Rcon | null> {
        if (this.instance?.authenticated) {
            return this.instance;
        }

        if (this.isConnecting) {
            // Wait until the connection is established by another call
            while (this.isConnecting) {
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
            return this.instance;
        }

        this.isConnecting = true;

        try {
            const rcon = await Rcon.connect({
                host: SERVER_IP,
                port: Number(RCON_PORT),
                password: RCON_PWD,
                timeout: 5000, // 5 second timeout
            });

            this.instance = rcon;
            return rcon;
        } catch (error: any) {
            console.error('RCON connection failed:', error?.message);
            return null;
        } finally {
            this.isConnecting = false;
        }
    }

    /**
     * Executes a command on the RCON server
     * @param {string} command - The command to execute
     * @returns {Promise<string>} The command response
     */
    static async executeCommand(command: string): Promise<string> {
        try {
            const rcon = await this.connect();
            if (!rcon) {
                throw new Error('Failed to establish RCON connection');
            }

            const response = await rcon.send(command);
            return response;
        } catch (error: any) {
            console.error('Failed to execute RCON command:', error?.message);
            throw error;
        }
    }

    /**
     * Safely disconnects from the RCON server
     */
    static async disconnect(): Promise<void> {
        if (this.isDisconnecting || !this.instance) {
            return;
        }

        this.isDisconnecting = true;

        try {
            if (this.instance.authenticated) {
                await this.instance.end();
            }
        } catch (error: any) {
            console.error('Error disconnecting from RCON:', error?.message);
        } finally {
            this.instance = null;
            this.isDisconnecting = false;
        }
    }
}

export { RconManager };
