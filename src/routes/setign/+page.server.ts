import { db } from "$lib/db";
import { cacheFetch } from "$lib/server/niceCache";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { z } from "zod";

export const load: PageServerLoad = async (e) => {



}

export const actions = {
    default: async (e) => {
        const formData = await e.request.formData();
        const pName = formData.get('playerName');

        const titleSchema = z.string().max(64);
        const parseResult = titleSchema.safeParse(pName);
        if (!parseResult.success) {
            throw error(400, 'รูปแบบของข้อมูลไม่ถูกต้อง');
        }
    
        const playerName = parseResult.data;

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
            data:{
                playerName: playerName
            }
        })
    }
}