import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { db } from '$lib/db';
import { getCache, setCache, genCacheKey } from '$lib/cache';
import { valla } from '$lib/variableStore';
import { error } from '@sveltejs/kit';

// Zod schema for ID validation
const IdSchema = z.coerce.number().int().positive();

export const load: PageServerLoad = async (event) => {
    const rawSlug = event.params.slug;

    // Validate ID format
    const parseResult = IdSchema.safeParse(rawSlug);
    if (!parseResult.success) {
        throw error(400, 'รูปแบบของข้อมูลไม่ถูกต้อง');
    }

    const slug = parseResult.data;
    event.depends(valla.shop.INFO);

    // Cache key for all item IDs
    const allIdsCacheKey = genCacheKey(valla.shop.ALL_IDS, {});
    let allItemIds = await getCache(allIdsCacheKey);

    // Fetch and cache all item IDs if not cached
    if (!allItemIds) {
        // console.log('Cache miss: Fetching all item IDs');
        const ids = await db.shopItems.findMany({ select: { id: true } });
        allItemIds = ids.map((item) => item.id);
        await setCache(allIdsCacheKey, allItemIds, 60000); // Cache for 1 minute
    }

    // Check if the provided ID exists in the list of item IDs
    if (!allItemIds.includes(slug)) {
        throw error(404, 'ไม่พบสินค้า');
    }

    // Cache key for individual item
    const itemCacheKey = genCacheKey(valla.shop.INFO, { slug });
    let cachedItem = await getCache(itemCacheKey);

    if (!cachedItem) {
        // console.log('Cache miss: Fetching item details');
        const dbData = await db.shopItems.findUnique({
            where: { id: slug },
            select: {
                id: true,
                title: true,
                imageUrl: true,
            },
        });

        if (!dbData) {
            throw error(404, 'ไม่พบสินค้า');
        }

        // Cache the item details
        await setCache(itemCacheKey, dbData, 60000); // Cache for 1 minute
        cachedItem = dbData;
    }

    return { colla: cachedItem };
};
