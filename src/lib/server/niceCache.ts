export const cache = new Map();

class ServerCache {
    private static instance: Map<string, {
        data: any;
        timestamp: number;
        ttl: number;
    }> = new Map();

    static set(key: string, data: any, ttl = 300000) { // default 5 minutes
        this.instance.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        });
        console.log(`🟢 Cache SET: ${key}`);
    }

    static get(key: string) {
        const entry = this.instance.get(key);
        
        if (!entry) {
            console.log(`🔴 Cache MISS: ${key}`);
            return null;
        }

        // Check if cache has expired
        if (Date.now() - entry.timestamp > entry.ttl) {
            console.log(`⏰ Cache EXPIRED: ${key}`);
            this.instance.delete(key);
            return null;
        }

        console.log(`🟢 Cache HIT: ${key}`);
        return entry.data;
    }

    static clear(key?: string) {
        if (key) {
            this.instance.delete(key);
            console.log(`🗑️ Cache CLEARED: ${key}`);
        } else {
            this.instance.clear();
            console.log(`🗑️ All Cache CLEARED`);
        }
    }
}

// Typed cache fetch function
export async function cacheFetch<T>(
    key: string, 
    fetchCallback: () => Promise<T>,
    options?: { 
        ttl?: number 
    }
): Promise<T> {
    const { ttl = 300000 } = options || {}; // 5 minutes default

    // Try to get from cache
    const cachedData = ServerCache.get(key);
    if (cachedData) {
        return cachedData;
    }

    // Fetch and cache
    try {
        const result = await fetchCallback();
        ServerCache.set(key, result, ttl);
        return result;
    } catch (error) {
        console.error(`❌ Cache Fetch Error for ${key}:`, error);
        throw error;
    }
}