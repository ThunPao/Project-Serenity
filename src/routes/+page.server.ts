import type { PageServerLoad } from './$types';
import { db } from '$lib/db';
import { getCache, setCache, genCacheKey } from '$lib/cache';
import { valla } from '$lib/variableStore';
import { error, fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
    event.depends(valla.shop.ITEMS);

    // Get the title from query parameters
    const title = event.url.searchParams.get('title') || '';
    // const shopCategory = event.url.searchParams.get('cat') || '';


    // console.log(`Requested title: ${title}`);

    // Cache key for all item titles
    const allTitlesCacheKey = genCacheKey(valla.shop.ALL_TITLES, {});
    let allItemTitles = await getCache(allTitlesCacheKey);

    // Fetch and cache all item titles if not cached
    if (!allItemTitles) {
        // console.log('Cache miss: Fetching all item titles');
        const titles = await db.shopItems.findMany({ select: { title: true } });
        allItemTitles = titles.map((item) => item.title.toLowerCase());
        await setCache(allTitlesCacheKey, allItemTitles, 60000); // Cache for 1 minute
    }

    // Check if the requested title exists in the cached titles
    if (title && !allItemTitles.includes(title.toLowerCase())) {
        throw error(404, 'ไม่พบสินค้า');
    }

    // Cache key for items matching the title
    const cacheKey = genCacheKey(valla.shop.ITEMS, { title });
    let data = await getCache(cacheKey);

    if (!data) {
        // console.log('Cache miss: Querying Prisma for items');
        data = await db.shopItems.findMany({
            where: {
                ...(title && { title: { contains: title } }), // Case-insensitive search
                // ...(shopCategory && {
                //     catty: {
                //         title: {
                //             contains: shopCategory
                //         }
                //     }
                // })
            },
            orderBy: {
                saleCount: 'desc',
            },
            select: {
                id: true,
                title: true,
                price: true
            }
        });

        if (data.length === 0) {
            throw error(404, 'ไม่พบสินค้า');
        }

        // Cache the queried items
        await setCache(cacheKey, data, 60000); // Cache for 1 minute
    }

    return {
        colla: data,
    };
};
let filters = {
    title: "",
    page: 0,
}
export const actions = {
    // doSearch: async (e) => {
    //     const data = await e.request.formData()
    //     const title = String(data.get("title"));
    //     filters = {
    //         ...filters,
    //         title: title
    //     }
    //     console.log(filters)
    //     if (e.url.searchParams.has('yeet')) {
    //         redirect(303, e.url.searchParams.get('yeet'));
    //     }
    // },
    searchItem: async (e) => {
        const formData = await e.request.formData();
        const title = String(formData.get('title'));

        const cacheKey = genCacheKey(valla.shop.ITEMS, { title });
        let result = await getCache(cacheKey);
        if (!result) {
            console.log("No Cache found")
            result = await db.shopItems.findMany({
                where: {
                    title: { contains: title }
                },
                select: {
                    id: true,
                    title: true,
                    price: true
                }
            })
            if (result.length === 0) {
                return fail(404, {notFound: true});
                // 'ไม่พบสินค้า'
            }
            await setCache(cacheKey, result, 60000); // Cache for 1 minute

        }

        if (!result) return fail(404, { notFound: true });
        return result
    }
}