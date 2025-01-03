import { Rcon } from "rcon-client";
import { RCON_PORT, RCON_PWD, SERVER_IP } from '$env/static/private';

class RconManager {
    private static instance: Rcon | null = null;
    private static isConnecting: boolean = false;

    /**
     * Establishes a connection to the RCON server
     * @returns {Promise<Rcon|null>} RCON client instance or null if connection fails
     */
    private static async connect(): Promise<Rcon | null> {
        if (this.instance?.authenticated) {
            return this.instance;
        }

        // if (this.isConnecting) {
        //     throw new Error('Connection attempt already in progress');
        // }

        this.isConnecting = true;

        try {
            const rcon = await Rcon.connect({
                host: SERVER_IP,
                port: Number(RCON_PORT),
                password: RCON_PWD,
                timeout: 5000 // 5 second timeout
            });

            this.instance = rcon;
            return rcon;
        } catch (error) {
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
        } catch (error) {
            console.error('Failed to execute RCON command:', error?.message);
            throw error;
        } finally {
            await this.disconnect();
        }
    }

    /**
     * Safely disconnects from the RCON server
     */
    static async disconnect(): Promise<void> {
        try {
            if (this.instance?.authenticated) {
                await this.instance.end();
            }
        } catch (error) {
            console.error('Error disconnecting from RCON:', error?.message);
        } finally {
            this.instance = null;
        }
    }
}

/**
 * Example usage:
 * 
 * try {
 *     const response = await RconManager.executeCommand('list'); // Lists online players
 *     console.log(response);
 * } catch (error) {
 *     console.error('Command failed:', error);
 * }
 */

export { RconManager };