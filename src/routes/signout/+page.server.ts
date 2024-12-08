import { clearCache, resetCache } from "$lib/server/niceCache";
import { signOut } from "../../auth";
import type { Actions } from "./$types";

export const actions: Actions = {
    default: async (event) => {
        const isAuth = event.cookies.get('authjs.session-token');
        if (isAuth) {
            // event.cookies.delete("isAuth", {
            //     path: "/",
            // });
            clearCache("layout_session:anonymous")
            console.log("perform signout")
        }
        
        console.log("Do signout...")
        return await signOut(event);
    }
};
