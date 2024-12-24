import { cacheFetch } from "$lib/server/niceCache";
import { valla } from "$lib/server/variableList";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
  const isAuth = event.cookies.get('authjs.session-token');
  if (isAuth) {
    const session = await cacheFetch(
      `${valla.user.SESSION}:${isAuth}`,
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
