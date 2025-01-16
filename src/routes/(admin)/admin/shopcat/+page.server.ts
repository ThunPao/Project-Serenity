import { db } from "$lib/db";
import { error, fail } from "@sveltejs/kit";
import { cacheFetch, clearCache } from "$lib/server/niceCache.ts";
import type { ShopCategories } from "@prisma/client";
import type { PageServerLoad } from "./$types.ts";
import { z } from "zod";
import { setCache } from "$lib/server/niceCache.ts";
import { valla } from "$lib/server/variableList.ts";

const shopCatSchema = z.object({
    id: z.number({ required_error: "กรุณาระบุตัวเลข" }).max(64),
    title: z.string({ required_error: "กรุณาระบุหัวข้อ" }).max(64)
})


export const load: PageServerLoad = async (e) => {
    e.depends("shopcat")
    const shopCat = await cacheFetch(`${valla.shop.ITEMCAT}`, () =>
        db.shopCategories.findMany({
            select: {
                id: true,
                title: true,
            }
        }), {
        sec: 120
    }
    );
    return { colla: shopCat }
}

export const actions = {
    addShopCat: async (e) => {
        const data = await e.request.formData();

        const title = String(data.get('title'));
        if (!title) return error(404, "ไม่พบtitle");
        console.log(title)

        await db.shopCategories.create({
            data: {
                title: title,
            }
        })
    },
    deleteShopCat: async (e) => {
        const data = await e.request.formData();
        const id = Number(data.get("catId"))
        if (!id) return error(404, "ไม่พบไอดี");
        const result = await db.shopCategories.delete({
            where: {
                id: id
            }
        })
        if (!result) return fail(404)
    },

    editShopCat: async (e) => {
        const data = await e.request.formData();

        const rawId = Number(data.get("catId"))
        const rawTitle = String(data.get("title"))

        const inputData = {
            id: rawId,
            title: rawTitle
        }

        const parseResult = shopCatSchema.safeParse(
            inputData
        );


        if (!parseResult.success) {
            throw error(400, {
                message: parseResult.error.message
            });
        }
        const formRequest = parseResult.data;

        try {
            const shopCat = await cacheFetch(`${valla.shop.ITEMCAT}`, () =>
                db.shopCategories.findMany({
                    select: {
                        id: true,
                        title: true,
                    }
                }), {
                sec: 120
            }
            )
            await db.shopCategories.update({
                where: {
                    id: formRequest.id
                }, data: {
                    title: formRequest.title
                }
            })
            const updatedCategories = shopCat.map(category =>
                category.id === formRequest.id
                    ? { ...category, title: formRequest.title }
                    : category
            );

            setCache(`${valla.shop.ITEMCAT}`, updatedCategories, {
                ttl: 3600,
                forceOverwrite: true
            });
        } catch (e) {
            error(500, {
                message: `เกิดข้อผิดพลาดบางอย่าง ${e}`
            })
        }
    }
}