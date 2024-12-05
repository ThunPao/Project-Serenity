import { db } from "$lib/db";
import { error, fail } from "@sveltejs/kit";
import { cache, cacheFetch } from "$lib/server/niceCache.ts";
import type { ShopCategories } from "@prisma/client";
import type { PageServerLoad } from "./$types.ts";


export const load: PageServerLoad = async (e) => {

    e.depends("shopcat")

    const shopCat = await cacheFetch(String(e.url), () =>
        db.shopCategories.findMany({
            select: {
                id: true,
                title: true,
            }
        }), {
        ttl: 50000
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
    }
}