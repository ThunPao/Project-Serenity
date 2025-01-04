import { createClient } from 'redis';
import type { RedisClientType } from 'redis';

class RedisCache {
    private static client: RedisClientType;
    private static isInitialized = false;
    private static isConnecting = false;
    private static connectionError: Error | null = null;
    private static readonly RETRY_DELAY = 5000; // 5 seconds
    private static readonly MAX_RETRIES = 3; // Reduced max retries
    private static readonly CONNECTION_TIMEOUT = 5000; // 5 seconds timeout
    private static retryCount = 0;
    private static reconnectTimeout: NodeJS.Timeout | null = null;

    private static async initialize() {
        if (this.isInitialized) return;
        if (this.isConnecting) {
            await this.waitForConnection();
            return;
        }

        // If we have a connection error and haven't waited enough, throw the error
        if (this.connectionError && this.retryCount >= this.MAX_RETRIES) {
            throw this.connectionError;
        }

        this.isConnecting = true;

        try {
            if (this.client) {
                await this.client.quit().catch(() => {}); // Cleanup old client if exists
            }

            this.client = createClient({
                url: process.env.REDIS_URL || 'redis://192.168.1.134:6379',
                socket: {
                    connectTimeout: this.CONNECTION_TIMEOUT,
                    reconnectStrategy: (retries) => {
                        if (retries >= this.MAX_RETRIES) {
                            return new Error('Max reconnection attempts reached');
                        }
                        return this.RETRY_DELAY;
                    }
                }
            });

            // Handle connection events
            this.client.on('error', (err) => {
                console.error('Redis Client Error:', err);
                this.connectionError = err;
                this.isInitialized = false;
                this.scheduleReconnect();
            });

            this.client.on('connect', () => {
                console.log('🚀 Redis client connected');
                this.connectionError = null;
                this.retryCount = 0;
            });

            this.client.on('end', () => {
                console.log('Redis connection ended');
                this.isInitialized = false;
            });

            await this.connectWithRetry();

        } catch (error) {
            this.isConnecting = false;
            this.connectionError = error as Error;
            throw error;
        }
    }

    private static async connectWithRetry(): Promise<void> {
        try {
            await this.client.connect();
            this.isInitialized = true;
            this.isConnecting = false;
            this.retryCount = 0;
            if (this.reconnectTimeout) {
                clearTimeout(this.reconnectTimeout);
                this.reconnectTimeout = null;
            }
        } catch (error) {
            this.retryCount++;
            console.log(`🔄 Redis connection attempt ${this.retryCount}/${this.MAX_RETRIES} failed`);
            
            if (this.retryCount >= this.MAX_RETRIES) {
                this.isConnecting = false;
                const err = new Error(`Failed to connect to Redis after ${this.MAX_RETRIES} attempts`);
                this.connectionError = err;
                throw err;
            }

            this.scheduleReconnect();
        }
    }

    private static scheduleReconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }

        if (this.retryCount < this.MAX_RETRIES) {
            this.reconnectTimeout = setTimeout(() => {
                this.isConnecting = false;
                this.initialize().catch(console.error);
            }, this.RETRY_DELAY);
        }
    }

    private static async waitForConnection(): Promise<void> {
        const maxWaitTime = this.CONNECTION_TIMEOUT;
        const startTime = Date.now();

        while (this.isConnecting && Date.now() - startTime < maxWaitTime) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        if (!this.isInitialized) {
            throw new Error('Redis connection timeout');
        }
    }

    static async set(key: string, data: any, sec = 60) {
        try {
            await this.initialize();
            const serializedData = JSON.stringify({
                data,
                timestamp: Date.now()
            });

            await this.client.set(key, serializedData, {
                EX: sec
            });
            console.log(`🟢 Redis SET: ${key} (TTL: ${sec}s)`);
        } catch (e) {
            // console.error('Redis SET error:', e);
            return null;
            // throw error;
        }
    }

    static async get(key: string) {
        try {
            await this.initialize();
            const result = await this.client.get(key);

            if (!result) {
                console.log(`🔴 Redis MISS: ${key}`);
                return null;
            }

            const { data } = JSON.parse(result);
            return data;
        } catch (error) {
            // console.error('Redis GET error:', error);
            return null; // Return null on error instead of throwing
        }
    }

    static async clear(key?: string) {
        try {
            await this.initialize();
            if (key) {
                await this.client.del(key);
                console.log(`🗑️ Redis CLEARED: ${key}`);
            } else {
                await this.client.flushAll();
                console.log(`🗑️ All Redis Cache CLEARED`);
            }
        } catch (error) {
            console.error('Redis CLEAR error:', error);
            throw error;
        }
    }

    static async disconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }

        if (this.client) {
            try {
                await this.client.quit();
                this.isInitialized = false;
                this.isConnecting = false;
                this.retryCount = 0;
                this.connectionError = null;
                console.log('📴 Redis client disconnected');
            } catch (error) {
                console.error('Redis disconnect error:', error);
            }
        }
    }

    static async getTTL(key: string): Promise<number> {
        try {
            await this.initialize();
            return this.client.ttl(key);
        } catch (error) {
            console.error('Redis TTL error:', error);
            return -2; // Return -2 to indicate error (Redis convention)
        }
    }
}

// Export functions remain the same but with better error handling
export async function cacheFetch<T>(
    key: string,
    fetchCallback: () => Promise<T>,
    options?: {
        sec?: number
    }
): Promise<T> {
    const { sec = 300 } = options || {};

    try {
        const cachedData = await RedisCache.get(key);
        if (cachedData) {
            return cachedData as T;
        }

        const result = await fetchCallback();
        await RedisCache.set(key, result, sec).catch(console.error); // Don't throw if cache set fails
        return result;
    } catch (error) {
        console.error(`❌ Redis Cache Fetch Error for ${key}:`, error);
        return fetchCallback(); // Fallback to direct fetch if cache fails
    }
}

export const getCache = RedisCache.get.bind(RedisCache);
export const clearCache = RedisCache.clear.bind(RedisCache);
export const disconnectCache = RedisCache.disconnect.bind(RedisCache);
export const getCacheTTL = RedisCache.getTTL.bind(RedisCache);

export async function setCache<T>(
    key: string, 
    data: T, 
    options?: {
        ttl?: number;
        forceOverwrite?: boolean;
    }
): Promise<void> {
    const {
        ttl = 300,
        forceOverwrite = true
    } = options || {};

    try {
        if (!forceOverwrite) {
            const existingEntry = await RedisCache.get(key);
            if (existingEntry) {
                console.log(`🟠 Redis Cache NOT set: ${key} (already exists and forceOverwrite is false)`);
                return;
            }
        }

        await RedisCache.set(key, data, ttl);
    } catch (error) {
        console.error(`Failed to set cache for ${key}:`, error);
        // Don't throw, just log the error
    }
}