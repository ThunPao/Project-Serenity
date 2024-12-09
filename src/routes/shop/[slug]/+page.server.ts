import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { db } from '$lib/db';
import { valla } from '$lib/server/variableList.ts';
import { error, fail } from '@sveltejs/kit';
import { cacheFetch, resetCache } from '$lib/server/niceCache';
import { Rcon } from "rcon-client"
import query from '@mcpedb/query';

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

    const shopInfo = await cacheFetch<{ id: number; title: string; imageUrl: string } | null>(
        `valla.shop.INFO:${title}`,
        () => db.shopItems.findFirst({
            where: { title: { contains: title, mode: "insensitive" } },
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
const rcon = await Rcon.connect({
    host: "192.168.1.134", port: 25575, password: "AWD7241"
})

async function CheckOnline(pname: string) {
    try {
        const data = await query("192.168.1.134", 25565);
        if (!data.players.includes(pname)) {
            return { type: false, code: 404, message: "กรุณาออนไลน์ในเซิร์ฟเวอร์" }
        }
        return { type: true, code: 200, message: "สำเร็จ" }
    } catch (err) {
        return { type: false, code: 500, message: "เซิร์ฟเวอร์ออฟไลน์" }
    }
}

export const actions = {

    buyItem: async (event) => {
        const rawShopTitle = event.params.slug;
        // Validate ID format
        const parseResult = titleSchema.safeParse(rawShopTitle);
        if (!parseResult.success) {
            throw error(400, 'รูปแบบของข้อมูลไม่ถูกต้อง');
        }
        const shopTitle = parseResult.data;
        const isOnline = await CheckOnline("I3a0")
        if (!isOnline.type) return error(isOnline.code, { message: isOnline.message })
        const shop = await db.shopItems.findFirst({
            where: {
                title: shopTitle
            },
            select: {
                itemCommand: true
            }
        })
        if (!shop) return error(404, { message: "Item not found" })
        shop.itemCommand.forEach((item) => {
            rcon.send(String(item.itemCommand))
        })
        console.log("Buy Item")
    }
}