import type { LayoutServerLoad } from './$types';
import { limiter } from '$lib/services/rateLimiter';
import { cacheFetch, resetCache } from '$lib/server/niceCache';
import { CheckOnline } from '$lib/server/checkOnline.ts';
export const load: LayoutServerLoad = async (event) => {
  await limiter.cookieLimiter?.preflight(event);
  const isAuth = event.cookies.get('authjs.session-token');
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

    const isOnline = await CheckOnline("I3a0");
    return {
      session: session,
      isOnline: isOnline.type
    };
  }

  const session = await event.locals.auth();
  return {
    session: session,
  };
};