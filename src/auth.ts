import { SvelteKitAuth, type DefaultSession } from '@auth/sveltekit';
import { DISCORD_ID, DISCORD_SECRET } from '$env/static/private';
import Discord from '@auth/sveltekit/providers/discord';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '$lib/db';
import { cacheFetch } from '$lib/server/niceCache';
declare module '@auth/sveltekit' {
	interface User {
		pname: string;
		points: number;
		coins: number;
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
		async session({ session, token }) {
			if (session.user) {
				const userData = await cacheFetch<{ playerName: string; points: number; coins: number; } | null>(
					`userInfo:${session.user.id}`,
					async () => {
						const userInfo = await db.userInfo.upsert({
							where: {
								playerName: session.user.name || 'Player'
							},
							update: {}, // No changes if already exists
							create: {
								playerName: session.user.name || 'Player',
								points: 0,
								coins: 0,
								User: {
									connect: {
										id: session.user.id
									}
								}
							},
							select: {
								playerName: true,
								points: true,
								coins: true
							}
						});

						console.log('User query result:', userInfo);
						return userInfo;
					},
					{
						sec: 60
					}
				);

				if (userData) {
					session.user.pname = userData.playerName;
					session.user.points = userData.points;
					session.user.coins = userData.coins;
				}
			}
			return session;
		},
		// ... other callbacks
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