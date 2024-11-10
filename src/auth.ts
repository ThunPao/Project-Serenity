import { SvelteKitAuth, type DefaultSession } from '@auth/sveltekit';
import { DISCORD_ID, DISCORD_SECRET } from '$env/static/private';
import Discord from '@auth/sveltekit/providers/discord';
// import GitHub from "@auth/sveltekit/providers/github"
// import Google from "@auth/sveltekit/providers/google"
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '$lib/db';
declare module '@auth/sveltekit' {
	interface User {
		pname: string;
		points: number;
		coins: number;
	}
}

export const { handle, signIn, signOut } = SvelteKitAuth({
	adapter: PrismaAdapter(db),
	callbacks: {
		async session({ session, token }) {
			// Fetch custom user data from the database
			if (session.user) {
				const userData = await db.user.findUnique({
					where: {
						id: session.user.id
					},
					select: {
						UserInfo: {
							select: {
								playerName: true,
								points: true,
								coins: true
							}
						}
					}
				});

				if (userData?.UserInfo) {
					session.user.pname = userData.UserInfo.playerName;
					session.user.points = userData.UserInfo.points
					session.user.coins = userData.UserInfo.coins
				}
			}
			return session;
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