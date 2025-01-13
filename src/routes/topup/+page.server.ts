import { fail } from "@sveltejs/kit";
// import type { PageServerLoad } from "../$types";
import { z } from "zod";
import { db } from "$lib/db/index.ts";
import { cacheFetch, setCache } from "$lib/server/niceCache.ts";
import { valla } from "$lib/server/variableList.ts";
const getLink = z.string()
    .min(3, "Topup Link must be at least 3 characters")
    .max(16, "Topup Link cannot be longer than 16 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Topup Link can only contain letters, numbers, and underscores");

// export const load: PageServerLoad = async (e) => {
//     // topup rating
// }

export const actions = {
    default: async (e) => {
        const getForm = await e.request.formData();
        const code = getForm.get('code');
        
        const topupCode = getLink.safeParse(code);
        if (!topupCode.success) return fail(400, {
            message: "กรุณาระบุโค๊ดให้ถูกต้อง"
        })

        const isAuth = e.cookies.get('authjs.session-token');
        if (!isAuth) return fail(401, {
            message: "กรุณาเข้าสู่ระบบ"
        })
        const session = await cacheFetch(
            `${valla.user.SESSION}:${isAuth}`,
            async () => {
                return await e.locals.auth();
            },
            {
                sec: 3600,
            }
        );
        if (!session) return fail(401, {
            message: "กรุณาเข้าสู่ระบบ"
        })
        //    
        const updateUsrPoint = await db.user.update({
            select: {
                points: true
            },
            where: {
                id: session.userId
            },
            data: {
                points: {
                    increment: 50
                }
            }
        })

        const updatedSession = {
            ...session,
            user: {
                ...session.user,
                points: updateUsrPoint.points
            }
        };
        await setCache(`${valla.user.SESSION}:${isAuth}`, updatedSession, {
            ttl: 3600,
            forceOverwrite: true
        });

        return { status: 200, success: true, message: `เติมเงินสำเร็จ คงเหลือ ${updateUsrPoint.points} พ้อยท์` }

    }
}