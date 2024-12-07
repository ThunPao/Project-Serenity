import type { LayoutServerLoad } from './$types';
import { limiter } from '$lib/services/rateLimiter';
import { cacheFetch } from '$lib/server/niceCache';

export const load: LayoutServerLoad = async (event) => {
    await limiter.cookieLimiter?.preflight(event);
    const isAuth = event.cookies.get('isAuth');
    if (isAuth) {
      const session = await cacheFetch(
        `layout_session:anonymous`,
        async () => {
          const authResult = await event.locals.auth();
          return authResult;
        },
        {
          sec: 3600,
        }
      );
      return {
        session: session ?? null,
      };
    }
    return {
      session: null
    };
};

// export const actions: = {
//     default: async (event) => {
//         if (await limiter.isLimited(event)) throw error(429);
//     }
// };