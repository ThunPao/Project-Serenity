import { SvelteKitAuth, type DefaultSession } from '@auth/sveltekit';
import { DISCORD_ID, DISCORD_SECRET } from '$env/static/private';
import Discord from '@auth/sveltekit/providers/discord';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '$lib/db';
import { cacheFetch } from '$lib/server/niceCache';
import { valla } from '$lib/server/variableList';
// declare module '@auth/sveltekit' {
// 	// interface User {
// 	// 	pname: string;
// 	// 	points: number;
// 	// 	coins: number;
// 	// }
// 	interface Session extends DefaultSession {
// 		userId: string;
// 		user: {
// 			name: string
// 			pname: string
// 			points: number
// 			coins: number
// 		} & DefaultSession['user']
// 	}
// }
declare module '@auth/sveltekit' {
	interface Session extends DefaultSession {
		userId: string;
		user: {
			name: string | null;
			playerName: string | null;
			image: string | null;
			points: number;
			coins: number;
		}
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
			return {
				userId: session.userId,
				user: {
					name: user.name,
					playerName: session.user?.playerName ?? "",
					image: session.user?.image ?? null,
					points: session.user?.points ?? 0,
					coins: session.user?.coins ?? 0
				},
				expires: session.expires
			};
		}
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