import { clearCache } from "$lib/server/niceCache";
import { valla } from "$lib/server/variableList";
import { signOut } from "../../auth";
import type { Actions } from "./$types";

export const actions: Actions = {
    default: async (event) => {
        const isAuth = event.cookies.get('authjs.session-token');
        if (isAuth) {
            // event.cookies.delete("isAuth", {
            //     path: "/",
            // });
            clearCache(`${valla.user.SESSION}:${isAuth}`)
            console.log("perform signout")
        }
        
        console.log("Do signout...")
        return await signOut(event);
    }
};
