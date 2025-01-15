import { Rcon } from "rcon-client";
import { RCON_PORT, RCON_PWD, SERVER_IP } from '$env/static/private';

class RconManager {
    private static instance: Rcon | null = null;
    private static isConnecting: boolean = false;
    private static connectionTimeout: NodeJS.Timeout | null = null;
    private static reconnectAttempts: number = 0;
    private static readonly MAX_RECONNECT_ATTEMPTS = 3;
    private static readonly CONNECTION_TIMEOUT_MS = 5000;

    /**
     * Establishes a connection to the RCON server
     * @returns {Promise<Rcon|null>} RCON client instance or null if connection fails
     */
    private static async connect(): Promise<Rcon | null> {
        // If we already have an authenticated connection, use it
        if (this.instance?.authenticated) {
            return this.instance;
        }

        // If we're already trying to connect, wait for that attempt
        if (this.isConnecting) {
            await new Promise(resolve => setTimeout(resolve, 100));
            return this.connect();
        }

        this.isConnecting = true;
        this.reconnectAttempts++;

        try {
            // Clear any existing timeout
            if (this.connectionTimeout) {
                clearTimeout(this.connectionTimeout);
            }

            // Set up connection timeout
            const timeoutPromise = new Promise<null>((_, reject) => {
                this.connectionTimeout = setTimeout(() => {
                    reject(new Error(`Connection timed out after ${this.CONNECTION_TIMEOUT_MS}ms`));
                }, this.CONNECTION_TIMEOUT_MS);
            });

            // Attempt connection
            const connectionPromise = Rcon.connect({
                host: SERVER_IP,
                port: Number(RCON_PORT),
                password: RCON_PWD
            });

            // Race between connection and timeout
            const rcon = await Promise.race([connectionPromise, timeoutPromise]);

            // Clear timeout if connection succeeded
            if (this.connectionTimeout) {
                clearTimeout(this.connectionTimeout);
            }

            this.instance = rcon;
            this.reconnectAttempts = 0;
            return rcon;
        } catch (error: any) {
            console.error('RCON connection failed:', error?.message);
            
            // If we haven't exceeded max attempts, try again
            if (this.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
                this.isConnecting = false;
                return this.connect();
            }
            
            return null;
        } finally {
            this.isConnecting = false;
            if (this.connectionTimeout) {
                clearTimeout(this.connectionTimeout);
            }
        }
    }

    /**
     * Executes a command on the RCON server with connection management
     * @param {string} command - The command to execute
     * @returns {Promise<string>} The command response
     */
    static async executeCommand(command: string): Promise<string> {
        try {
            const rcon = await this.connect();
            if (!rcon) {
                throw new Error('Failed to establish RCON connection after multiple attempts');
            }

            const response = await rcon.send(command);
            return response;
        } catch (error: any) {
            console.error('Failed to execute RCON command:', error?.message);
            throw error;
        } finally {
            // Only disconnect if we're not planning to send more commands soon
            // You might want to implement a connection pool or keep-alive mechanism
            await this.disconnect();
        }
    }

    /**
     * Safely disconnects from the RCON server
     */
    static async disconnect(): Promise<void> {
        try {
            if (this.instance?.authenticated) {
                const instance = this.instance;
                this.instance = null;  // Clear instance before ending to prevent double-end
                await instance.end();
            }
        } catch (error: any) {
            console.error('Error disconnecting from RCON:', error?.message);
        }
    }
}

export { RconManager };