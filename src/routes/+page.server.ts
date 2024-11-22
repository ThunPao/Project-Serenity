import type { PageServerLoad } from './$types';
import { db } from '$lib/db';
import { getCache, setCache } from '$lib/cache';

export const load: PageServerLoad = async (req) => {
    req.depends('shopitems');

    const cacheKey = 'shopitems';
    let data = await getCache(cacheKey);

    if (data) {
        // console.log('Cache hit: Data retrieved from cache');
    } else {
        console.log('Cache miss: Querying Prisma');
        data = await db.shopItems.findMany({
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
