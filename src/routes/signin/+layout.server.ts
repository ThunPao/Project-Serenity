import { cacheFetch } from "$lib/server/niceCache";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
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
