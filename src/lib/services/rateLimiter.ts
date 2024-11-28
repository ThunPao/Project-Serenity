import { COOKIE_SECRET } from '$env/static/private';
import { RateLimiter } from 'sveltekit-rate-limiter/server';

export const limiter = new RateLimiter({
    IP: [50, 'h'],       // Higher IP limit
    IPUA: [20, 'm'],     // Higher User Agent limit
    cookie: {
        name: 'limiterid',
        secret: COOKIE_SECRET,
        rate: [10, 'm'],  // Increased cookie rate limit
        preflight: true
    },
    plugins: [
        // Optional: Add domain-specific or custom limiting logic
    ]
});