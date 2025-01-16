import type { LayoutServerLoad } from './$types';
import { limiter } from '$lib/services/rateLimiter';
import { cacheFetch, clearCache } from '$lib/server/niceCache';
import { CheckOnline } from '$lib/server/checkOnline.ts';
import { redirect } from '@sveltejs/kit';
import { valla } from '$lib/server/variableList';
export const load: LayoutServerLoad = async (event) => {
  await limiter.cookieLimiter?.preflight(event);
  event.depends("app:curSession")
  const isAuth = event.cookies.get('authjs.session-token');
  if (isAuth) {
    const session = await cacheFetch(
      `${valla.user.SESSION}:${isAuth}`,
      async () => {
        return await event.locals.auth();
      },
      {
        sec: 3600,
      }
    );
    const playerInGameName = session?.user.playerName;
    const path = event.url.pathname;
    const isSetignPath = path === '/setign' || path.startsWith('/setign/');

    if (!playerInGameName) {
      if (!isSetignPath) {
        throw redirect(303, '/setign');
      }
      return {
        session: session,
      };
    }
    // console.log(session)
    return {
      session: session,
    };
  }

};