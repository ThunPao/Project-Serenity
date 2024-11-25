import type { PageServerLoad } from './$types';
import { db } from '$lib/db';
import { getCache, setCache,genCacheKey } from '$lib/cache';
import { valla } from '$lib/variableStore';

export const load: PageServerLoad = async (event) => {
    event.depends(valla.shop.ITEMS);
    const title = event.url.searchParams.get('title')
    if (title) {
        console.log(title)
    }

    const cacheKey = genCacheKey(valla.shop.ITEMS, { title });

    let data = await getCache(cacheKey);

    if (data) {
        // console.log('Cache hit: Data retrieved from cache');
    } else {
        console.log('Cache miss: Querying Prisma');
        data = await db.shopItems.findMany({
            where: {
                ...(title && { title: { contains: title } }),
            },
            orderBy: {
                saleCount: "desc"
            }
        });

        if (data) {
            await setCache(cacheKey, data, 60000); // Cache for 1 minute
        }
    }

    return {
        colla: data,
    };
};
