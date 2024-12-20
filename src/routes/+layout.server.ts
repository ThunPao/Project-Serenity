import type { LayoutServerLoad } from './$types';
import { limiter } from '$lib/services/rateLimiter';
import { cacheFetch, resetCache } from '$lib/server/niceCache';
import { CheckOnline } from '$lib/server/checkOnline.ts';
import { redirect } from '@sveltejs/kit';
export const load: LayoutServerLoad = async (event) => {
  await limiter.cookieLimiter?.preflight(event);
  event.depends("app:curSession")

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
    const playerInGameName = session?.user?.pname;
    const path = event.url.pathname;
    const isSetignPath = path === '/setign' || path.startsWith('/setign/');
    
    if (!playerInGameName) {
        if (!isSetignPath) {
            throw redirect(303, '/setign');
        }
        return {
            session: session,
            isOnline: false
        };
    }
    const isOnline = await CheckOnline(playerInGameName);
    return {
      session: session,
      isOnline: isOnline.type
    };
  }

  const session = await event.locals.auth();
  // const playerInGameName = session?.user?.pname;
  // if (!playerInGameName) return redirect(303, "/setign")
  // const isOnline = await CheckOnline(playerInGameName);
  return {
    session: session,
    isOnline: false
  };
};