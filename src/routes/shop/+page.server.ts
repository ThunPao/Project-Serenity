import type { PageServerLoad } from './$types';
import { db } from '$lib/db';
import { valla } from '$lib/variableStore';
import { error, fail, redirect } from '@sveltejs/kit';
import { cacheFetch } from '$lib/server/niceCache.js';

export const load: PageServerLoad = async (event) => {
    event.depends(valla.shop.ITEMS);

    const title = event.url.searchParams.get('title') || '';


    const allItemTitles = await cacheFetch<string[]>(
        'all_shop_items_titles',
        async () => {
            console.log('🔍 Fetching all item titles from database');
            const titles = await db.shopItems.findMany({
                select: { title: true }
            });
            return titles.map((item) => item.title.toLowerCase());
        },
        {
            ttl: 120000 // 2 minutes cache
        }
    );

    // Validate title if provided
    if (title && !allItemTitles.includes(title.toLowerCase())) {
        throw error(404, 'ไม่พบสินค้า');
    }



    const data = await cacheFetch(
        `shop_items_${title}`,
        async () => {
            const items = await db.shopItems.findMany({
                where: {
                    ...(title && { title: { contains: title } }), // Case-insensitive search
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

            if (items.length === 0) {
                throw error(404, 'ไม่พบสินค้า');
            }

            return items;
        },
        {
            ttl: 60000 // 1 minute cache
        }
    );
    const shopCat = await cacheFetch(String(event.url), () => db.shopCategories.findMany({
        select: {
            id: true,
            title: true,
            _count: {
                select: { shopItem: true }
            }
        }
    }));
    return {
        colla: data,
        catta: shopCat.map((cat) => ({
            title: cat.title,
            count: cat._count.shopItem,
        }))
    };
}

let filters = {
    title: "",
    page: 0,
}
export const actions = {
    searchItem: async (e) => {
        const formData = await e.request.formData();
        const title = String(formData.get('title')).toLowerCase();
        const allItemTitles = await cacheFetch<string[]>(
            'all_shop_items_titles',
            async () => {
                console.log('🔍 Fetching all item titles from database');
                const titles = await db.shopItems.findMany({
                    select: { title: true },
                });
                return titles.map((item) => item.title.toLowerCase());
            },
            { ttl: 120000 } //2 min cache
        );

        if (!title || !allItemTitles.includes(title)) {
            return fail(404, { notFound: true });
        }

        const result = await cacheFetch<{ id: number; title: string; price: number }[]>(
            `shopSearch${title}`,
            async () => {
                console.log(`🔍 Fetching search results for title: ${title}`);
                return await db.shopItems.findMany({
                    where: { title: { contains: title, mode: "insensitive" } },
                    select: {
                        id: true,
                        title: true,
                        price: true,
                    },
                });
            },
            { ttl: 60000 }
        );
        if (!result) return fail(404, { notFound: true });
        return result
    }
}