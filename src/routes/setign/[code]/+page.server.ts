// routes/redeem/[code]/+page.server.ts
import { error } from '@sveltejs/kit';
import { getLink, useLink } from '$lib/server/linkStore';
import { db } from '$lib/db';
import { cacheFetch } from '$lib/server/niceCache.js';
import { setCache } from '$lib/server/niceCache.js';

export async function load(e) {
    const link = getLink(e.params.code);

    if (!link) {
        throw error(404, 'ไม่พบลิงก์');
    }

    if (link.isUsed) {
        throw error(410, 'ท่านเคยผูกบัญชีแล้ว');
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
    const updateUser = await db.user.update({
        where: {
            id: session.user?.id
        },
        data: {
            playerName: link.playerName
        }
    })
    if (!updateUser) return error(500, { message: "เกิดข้อผิดพลาดในการผูกบัญชี" })
    const updatedSession = {
        ...session,
        user: {
            ...session.user,
            pname: updateUser.playerName
        }
    };
    setCache(`layout_session:${isAuth}`, updatedSession, {
        ttl: 3600,
        forceOverwrite: true
    });
    useLink(e.params.code);
    return {
        playerName: link.playerName,
        reward: link.reward
    };
}
