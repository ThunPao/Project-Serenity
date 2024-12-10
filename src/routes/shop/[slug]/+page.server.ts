import { CheckOnline } from '$lib/server/checkOnline.ts';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { db } from '$lib/db';
import { valla } from '$lib/server/variableList.ts';
import { error, fail } from '@sveltejs/kit';
import { cacheFetch, resetCache } from '$lib/server/niceCache';
import { Rcon } from "rcon-client"
import { RCON_PORT, RCON_PWD, SERVER_IP } from '$env/static/private';

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

    const shopInfo = await cacheFetch<{ id: number; title: string; description: string | null; imageUrl: string; checkOnline: boolean, price: number } | null>(
        `valla.shop.INFO:${title}`,
        () => db.shopItems.findFirst({
            where: { title: { contains: title, mode: "insensitive" } },
            select: {
                id: true,
                title: true,
                description: true,
                imageUrl: true,
                checkOnline: true,
                price: true
            },
        }), {
        sec: 60
    }
    );
    if (!shopInfo) return error(404)
    return { colla: shopInfo }
}
const rcon = await Rcon.connect({
    host: SERVER_IP, port: Number(RCON_PORT), password: RCON_PWD
})



export const actions = {

    buyItem: async (event) => {
        const rawShopTitle = event.params.slug;
        // Validate ID format
        const parseResult = titleSchema.safeParse(rawShopTitle);
        if (!parseResult.success) {
            throw fail(400, { message: 'รูปแบบของข้อมูลไม่ถูกต้อง' });
        }
        const shopTitle = parseResult.data;

        const shop = await db.shopItems.findFirst({
            where: {
                title: shopTitle
            },
            select: {
                title: true,
                itemCommand: true,
                checkOnline: true,
            }
        })
        if (!shop) return fail(404, { message: "Item not found" })
        if (shop.checkOnline) {
            // Check Online
            const isOnline = await CheckOnline("I3a0")
            if (!isOnline.type) return fail(isOnline.code, { message: isOnline.message })
        }
        if (shop.itemCommand) {

            shop.itemCommand.forEach((item) => {
                rcon.send(String(item.itemCommand))
            })
        }
        console.log("Buy Item")

        return { status: 200, success: true, message: `ซื้อไอเทม ${shop.title} สำเร็จ` }

    }
}