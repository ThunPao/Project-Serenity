const cache: { [key: string]: { data: any, expiry: number } } = {};

// Function to get data from the cache
export async function getCache(key: string) {
    const cached = cache[key];
    if (cached && cached.expiry > Date.now()) {
        return cached.data;
    }
    return null; // Cache miss or expired
}

// Function to set data in the cache
export async function setCache(key: string, data: any, ttl = 60000) { // TTL in milliseconds
    cache[key] = {
        data,
        expiry: Date.now() + ttl
    };
}

// Function to clear cache (optional utility)
export function clearCache(key: string) {
    delete cache[key];
}
