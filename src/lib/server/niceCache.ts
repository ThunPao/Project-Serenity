export const cache = new Map();

class ServerCache {
    private static instance: Map<string, {
        data: any;
        timestamp: number;
        ttl: number;
    }> = new Map();

    static set(key: string, data: any, sec = 60) { // default 1 minute
        this.instance.set(key, {
            data,
            timestamp: Date.now(),
            ttl: sec * 1000, // Convert seconds to milliseconds for internal storage
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

        console.log(`🟢 GETC: ${key} ttl ${entry.ttl}`);
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

    // New purge method to remove all expired entries
    static purge() {
        let purgedCount = 0;
        const now = Date.now();

        // Iterate through all entries and remove expired ones
        for (const [key, entry] of this.instance.entries()) {
            if (now - entry.timestamp > entry.ttl) {
                this.instance.delete(key);
                purgedCount++;
            }
        }

        console.log(`🧹 Cache PURGED: ${purgedCount} expired entries removed`);
        return purgedCount;
    }

    static forceCleanup() {
        // Completely clear the cache
        this.instance.clear();
        console.log('🧹 FORCE Cleaned ALL Cache Entries');
    }
}

// Typed cache fetch function
export async function cacheFetch<T>(
    key: string,
    fetchCallback: () => Promise<T>,
    options?: {
        sec?: number
    }
): Promise<T> {
    const { sec = 300 } = options || {}; // 5 minutes default

    // Try to get from cache
    const cachedData = ServerCache.get(key);
    if (cachedData) {
        return cachedData;
    }

    // Fetch and cache
    try {
        const result = await fetchCallback();
        ServerCache.set(key, result, sec);
        return result;
    } catch (error) {
        console.error(`❌ Cache Fetch Error for ${key}:`, error);
        throw error;
    }
}

export function resetCache(force = true) {
    if (force) {
        ServerCache.forceCleanup();
    } else {
        const purgedCount = ServerCache.purge(); // Remove only expired
        console.log(`🧹 Purged ${purgedCount} expired cache entries`);
        return purgedCount;
    }
}