// routes/redeem/[code]/+page.server.ts
import { error } from '@sveltejs/kit';
import { getLink, useLink } from '$lib/server/linkStore';
import { db } from '$lib/db';
import { cacheFetch } from '$lib/server/niceCache.js';

export async function load(e) {
    const link = getLink(e.params.code);
    
    if (!link) {
        throw error(404, 'Link not found or expired');
    }
    
    if (link.isUsed) {
        throw error(410, 'Link already used');
    }
    const isAuth = e.cookies.get('authjs.session-token');
    const session = await cacheFetch(
        `layout_session:${isAuth}`,
        async () => {
            return await e.locals.auth();
        },
        {
            sec: 3600,
        }
    );
    if (!session) return error(500, { message: "กรุณาติดต่อแอดมิน" })
    await db.user.update({
        where: {
            id: session.user?.id
        },
        data: {
            playerName: link.playerName
        }
    })
    return {
        playerName: link.playerName,
        reward: link.reward
    };
}

export const actions = {
    redeem: async ({ params }) => {
        const success = useLink(params.code);
        if (!success) {
            return { success: false };
        }
        
        const link = getLink(params.code);
        if (!link) {
            return { success: false };
        }

        try {
            // Here you can add your game server communication
            // For example, using REST API or WebSocket to send reward
            
            // await giveRewardToPlayer(link.playerName, link.reward);
            
            return { 
                success: true,
                playerName: link.playerName,
                reward: link.reward
            };
        } catch (e) {
            return { success: false };
        }
    }
};