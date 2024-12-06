import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { db } from '$lib/db';
import { valla } from '$lib/server/variableList.ts';
import { error, fail } from '@sveltejs/kit';
import { cacheFetch } from '$lib/server/niceCache';

// Zod schema for ID validation
const titleSchema = z.string().max(64);

export const load: PageServerLoad = async (event) => {

    const rawSlug = event.params.slug;

    // Validate ID format
    const parseResult = titleSchema.safeParse(rawSlug);
    if (!parseResult.success) {
        throw error(400, 'รูปแบบของข้อมูลไม่ถูกต้อง');
    }

    const slug = parseResult.data;
    event.depends(valla.shop.INFO);
    const title = decodeURIComponent(slug.toLowerCase());
    const allItemTitles = await cacheFetch<string[]>(
        valla.shop.ALL_TITLES,
        async () => {
            console.log('🔍 Fetching all item titles from database');
            const titles = await db.shopItems.findMany({
                select: { title: true },
            });
            return titles.map((item) => item.title.toLowerCase());
        },
        { sec: 3600 } // 1 hour cache
    );
    if (!title || !allItemTitles.includes(title)) {
        return error(404);
    }

    const shopInfo = await cacheFetch<{ id: number; title: string;  imageUrl: string } | null>(
        `valla.shop.INFO:${title}`,
        () => db.shopItems.findFirst({
            where: { title: { contains: title,mode: "insensitive" } },
            select: {
                id: true,
                title: true,
                imageUrl: true,
            },
        }), {
        sec: 60
    }
    );
    if (!shopInfo) return error(404)
    return { colla: shopInfo }
}