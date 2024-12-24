import { SvelteKitAuth, type DefaultSession } from '@auth/sveltekit';
import { DISCORD_ID, DISCORD_SECRET } from '$env/static/private';
import Discord from '@auth/sveltekit/providers/discord';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '$lib/db';
import { cacheFetch } from '$lib/server/niceCache';
import { valla } from '$lib/server/variableList';
declare module '@auth/sveltekit' {
	// interface User {
	// 	pname: string;
	// 	points: number;
	// 	coins: number;
	// }
	interface Session extends DefaultSession {
		userId: string;
        user: {
            pname: string
            points: number
            coins: number
        } & DefaultSession['user']
    }
}

// const originalSignOut = SvelteKitAuth.signOut;

// async function customSignOut(event) {
// 	console.log('Custom signOut triggered:', event);

// 	// Perform additional logic if needed before calling the original signOut
// 	const result = await originalSignOut(event);

// 	console.log('SignOut completed:', result);
// 	return result;
// }


export const { handle, signIn, signOut } = SvelteKitAuth({
    adapter: PrismaAdapter(db),
    callbacks: {
        async session({ session, user }) {
            const userData = await db.user.findUnique({
                        where: { id: user.id },
                        select: {
                            name: true,
                            image: true,
                            points: true,
                            coins: true,
                            playerName: true,
                        }
                    });
				if (userData) {
					return {
						...session,
						user: {
							name: userData.name,
							image: session.user.image,
							pname: userData.playerName || '',
							points: userData.points,
							coins: userData.coins
						}
					};
				}
				return session;
		},
	},
	providers: [
		Discord({
			clientId: DISCORD_ID,
			clientSecret: DISCORD_SECRET,
			allowDangerousEmailAccountLinking: true
		}),
	],
	trustHost: true
});