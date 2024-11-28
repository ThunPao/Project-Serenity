import type { LayoutServerLoad } from './$types';
import { limiter } from '$lib/services/rateLimiter';

export const load: LayoutServerLoad = async (event) => {
    await limiter.cookieLimiter?.preflight(event);
};

// export const actions: = {
//     default: async (event) => {
//         if (await limiter.isLimited(event)) throw error(429);
//     }
// };