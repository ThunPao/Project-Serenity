const cache: { [key: string]: { data: any; expiry: number } } = {};

// Function to get data from the cache
export async function getCache(key: string) {
    const cached = cache[key];
    if (cached && cached.expiry > Date.now()) {
        return cached.data;
    }
    return null; // Cache miss or expired
}

// Function to set data in the cache
export async function setCache(key: string, data: any, ttl = 60000) {
    cache[key] = {
        data,
        expiry: Date.now() + ttl,
    };
}

// Function to clear cache (optional utility)
export function clearCache(key: string) {
    delete cache[key];
}

// Utility to generate a unique cache key based on filters
export function genCacheKey(baseKey: string, filters: Record<string, any>) {
    const filterString = Object.entries(filters)
        .filter(([, value]) => value !== undefined && value !== null) // Exclude undefined/null values
        .map(([key, value]) => `${key}:${value}`)
        .sort() // Sort to ensure consistent key generation
        .join('|');
    return `${baseKey}${filterString ? `?${filterString}` : ''}`;
}
