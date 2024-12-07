import type { LayoutServerLoad } from './$types';
import { limiter } from '$lib/services/rateLimiter';
import { cacheFetch } from '$lib/server/niceCache';

export const load: LayoutServerLoad = async (event) => {
  await limiter.cookieLimiter?.preflight(event);
  const isAuth = event.cookies.get('isAuth');
  if (isAuth) {
    const session = await cacheFetch(
      `layout_session:${isAuth}`,
      async () => {
        return await event.locals.auth();
      },
      {
        sec: 3600,
      }
    );
    return {
      session: session,
    };
  }

  const session = await event.locals.auth();
  return {
    session: session,
  };
};