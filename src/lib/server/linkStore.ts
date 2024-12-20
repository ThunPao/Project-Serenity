
type LinkData = {
    playerName: string;
    createdAt: number;
    expiresAt: number;
    isUsed: boolean;
    reward: string;
};

// In-memory store (you could also use Redis or similar for persistence)
const links = new Map<string, LinkData>();

export function createLink(playerName: string, reward: string) {
    const code = Math.random().toString(36).substring(2, 15);
    const now = Date.now();
    
    links.set(code, {
        playerName,
        reward,
        createdAt: now,
        expiresAt: now + (1 * 60 * 60 * 1000), // 1 hour expiry
        isUsed: false
    });
    
    return code;
}

export function getLink(code: string) {
    const link = links.get(code);
    if (!link) return null;
    
    // Check expiry
    if (Date.now() > link.expiresAt) {
        links.delete(code);
        return null;
    }
    
    return link;
}

export function useLink(code: string) {
    const link = links.get(code);
    if (!link || link.isUsed || Date.now() > link.expiresAt) {
        return false;
    }
    
    link.isUsed = true;
    return true;
}