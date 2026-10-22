import { db } from '$lib/db';
import { error, fail, redirect } from '@sveltejs/kit';
import { cacheFetch } from '$lib/server/niceCache.ts';
import { valla } from '$lib/server/variableList.ts';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async (event) => {
    event.depends(valla.shop.ITEMS);

    const title = event.url.searchParams.get('title') || '';

    const allItemTitles = await cacheFetch<string[]>(
        valla.shop.ALL_TITLES,
        async () => {
            console.log('🔍 Fetching all item titles from database');
            const titles = await db.shopItems.findMany({
                select: { title: true }
            });
            return titles.map((item) => item.title.toLowerCase());
        },
        {
            sec: 3600
        }
    );

    // Validate title if provided
    if (title && !allItemTitles.includes(title.toLowerCase())) {
        throw error(404, 'ไม่พบสินค้า');
    }

    const data = await cacheFetch(
        valla.shop.ITEMS,
        async () => {
            const items = await db.shopItems.findMany({
                orderBy: {
                    saleCount: 'desc',
                },
                select: {
                    id: true,
                    title: true,
                    price: true,
                    imageUrl: true,
                    catId: true
                }
            });

            if (items.length === 0) {
                throw error(404, 'ไม่พบสินค้า');
            }

            return items;
        },
    );
    const shopCat = await cacheFetch(valla.shop.ITEMCAT, () => db.shopCategories.findMany({
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
            id: cat.id,
            title: cat.title,
            count: cat._count.shopItem,
        }))
    };
}

export const actions = {
    searchItem: async (e) => {
        const formData = await e.request.formData();
        const title = String(formData.get('title')).toLowerCase();
        const allItemTitles = await cacheFetch<string[]>(
            valla.shop.ALL_TITLES,
            async () => {
                console.log('🔍 Fetching all item titles from database');
                const titles = await db.shopItems.findMany({
                    select: { title: true, catId: true },
                });
                return titles.map((item) => item.title.toLowerCase());
            },
            { sec: 3600 } // 1 hour cache
        );
        const hasMatch = allItemTitles.some(data =>
            data.includes(title)
        );
        if (!hasMatch) {
            return fail(404, { notFound: true });
        }

        const result = await cacheFetch<{ id: number; title: string; price: number; imageUrl?: string; catId?: number }[]>(
            `${valla.shop.SEARCH}:${title}`,
            async () => {
                console.log(`🔍 Fetching search results for title: ${title}`);
                return await db.shopItems.findMany({
                    where: { title: { contains: title, mode: "insensitive" } },
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        imageUrl: true,
                        catId: true
                    },
                });
            },
            { sec: 3600 }
        );
        if (!result) return fail(404, { notFound: true });
        return result;
    }
};
