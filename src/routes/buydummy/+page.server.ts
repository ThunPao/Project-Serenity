import { db } from '$lib/db/index.js';
import { error } from '@sveltejs/kit';

export const actions = {
    default: async (event) => {

        const session = await event.locals.auth();
        if (!session) return error(404)
        const usrPoint = session.user?.points || 0;
        const remainingPoints = usrPoint - 20;
        const updateUser = await db.user.update({
            where: {
                id: "cm4cio32f00004h2z05gq6lbm"
            },
            data: {
                points: remainingPoints
            },
            select: {
                points: true
            }
        })
    }
}