import { signIn } from "../../auth";
import type { Actions } from "./$types";

export const actions: Actions = {
    default: async (event) => {
        // Check if 'isAuth' cookie is already set
        const isAuth = event.cookies.get('isAuth');

        if (!isAuth) {
            // Set 'isAuth' cookie with a max age of 3600 seconds (1 hour)
            event.cookies.set('isAuth', 'true', {
                path: '/', // Make the cookie accessible throughout the site
                httpOnly: true, // Ensure it's not accessible from client-side scripts
                maxAge: 3600, // 3600 seconds = 1 hour
                secure: true, // Use `secure` only in production
                sameSite: 'strict', // Prevent CSRF
            });
            console.log("isAuth cookie set for 3600 seconds.");
        } else {
            console.log("isAuth cookie already exists.");
        }

        // Proceed with signIn logic
        return await signIn(event);
    },
};
