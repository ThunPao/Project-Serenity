import { db } from "$lib/db";
import { error, fail } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { getCache, setCache } from "$lib/cache";

export const load: PageServerLoad = async (req) => {

    const cacheKey = 'shopCategory';
    let data = await getCache(cacheKey);

    if (data) {
        console.log('Cache hit: Data retrieved from cache');
    } else {
        console.log('Cache miss: Querying Prisma');
        data = await db.shopCategories.findMany();
    }
    if (data) {
        await setCache(cacheKey, data, 60000); // Cache for 1 minute
    }
    if (!data) return error(404, "ไม่พบข้อมูล")
    return { colla: data }
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
        await db.shopCategories.delete({
            where: {
                id: id
            }
        })
    }
}