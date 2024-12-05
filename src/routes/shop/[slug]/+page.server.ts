import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { db } from '$lib/db';
import { valla } from '$lib/variableStore';
import { error } from '@sveltejs/kit';
import { cacheFetch } from '$lib/server/niceCache';

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

    const allItemIds = await cacheFetch<number[]>(
        'all_shop_items_Ids',
        async () => {
            console.log('🔍 Fetching all item titles from database');
            const ids = await db.shopItems.findMany({
                select: { id: true }
            });
            return ids.map((item) => item.id);
        },
        {
            ttl: 120000 // 2 minutes cache
        }
    );

    if (slug && !allItemIds.includes(slug)) {
        throw error(404, 'ไม่พบสินค้า');
    }

    const shopInfo = await cacheFetch(String(event.url), () => db.shopItems.findUnique({
        where: { id: slug },
        select: {
            id: true,
            title: true,
            imageUrl: true,
        },
    }))

    return { colla: shopInfo };
};
