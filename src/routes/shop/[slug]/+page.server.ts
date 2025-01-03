import { CheckOnline } from '$lib/server/checkOnline.ts';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { db } from '$lib/db';
import { valla } from '$lib/server/variableList.ts';
import { error, fail } from '@sveltejs/kit';
import { cacheFetch, resetCache, setCache } from '$lib/server/niceCache';
import { RconManager } from '$lib/server/rconMinecraft';

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
        `${valla.shop.INFO}:${title}`,
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

interface QueueItem {
    userId: string;
    points: number;
    timestamp: number;
}

const updateQueue = new Map<string, QueueItem>();
const QUEUE_PROCESS_INTERVAL = 10000; // 10 seconds
let queueProcessorRunning = false;



const queueDatabaseUpdate = (userId: string, points: number) => {
    updateQueue.set(userId, {
        userId,
        points,
        timestamp: Date.now()
    });

    // Start queue processor if not running
    setTimeout(processQueue, QUEUE_PROCESS_INTERVAL);
};


const processQueue = async () => {
    if (queueProcessorRunning) return;
    queueProcessorRunning = true;

    try {
        const now = Date.now();
        const itemsToProcess = new Map<string, QueueItem>();

        // Get items older than QUEUE_PROCESS_INTERVAL
        updateQueue.forEach((item, key) => {
            if (now - item.timestamp >= QUEUE_PROCESS_INTERVAL) {
                itemsToProcess.set(key, item);
                updateQueue.delete(key);
            }
        });

        // Process queued items
        for (const [_, item] of itemsToProcess) {
            await db.user.update({
                where: { id: item.userId },
                data: { points: item.points },
                select: { points: true }
            });
        }
    } catch (error) {
        console.error('Queue processing error:', error);
    } finally {
        queueProcessorRunning = false;

        // Continue processing if queue not empty
        if (updateQueue.size > 0) {
            setTimeout(processQueue, 1000);
        }
    }
};


export const actions = {
    buyItem: async (event) => {
        const rawShopTitle = event.params.slug;
        // Validate ID format
        const parseResult = titleSchema.safeParse(rawShopTitle);
        if (!parseResult.success) {
            throw fail(400, { message: 'รูปแบบของข้อมูลไม่ถูกต้อง' });
        }
        const shopTitle = parseResult.data;

        const isAuth = event.cookies.get('authjs.session-token');
        const session = await cacheFetch(
            `${valla.user.SESSION}:${isAuth}`,
            async () => {
                return await event.locals.auth();
            },
            {
                sec: 3600,
            }
        );
        if (!session) return fail(401, { message: "กรุณาเข้าสู่ระบบ" })
        if (!RconManager) return fail(404, {
            message: "เซิร์ฟเวอร์ออฟไลน์"
        })


        interface CachedShopInfo {
            title: string;
            itemCommand: Array<{ itemCommand: string | null }>;
            checkOnline: boolean;
            price: number;
        }

        const shop = await cacheFetch<CachedShopInfo | null>(
            `${valla.shop.INFO}:${shopTitle}`,
            () => db.shopItems.findFirst({
                where: { title: { contains: shopTitle, mode: "insensitive" } },
                select: {
                    title: true,
                    itemCommand: true,
                    checkOnline: true,
                    price: true
                }
            }), {
            sec: 60
        }
        );

        if (!shop) return fail(404, { message: "Item not found" })
        if (shop.checkOnline) {
            // Check Online
            const isOnline = await CheckOnline("I3a0")
            if (!isOnline.type) return fail(isOnline.code, { message: isOnline.message })
        }

        const curPlayer = session.user;
        if (!curPlayer) return fail(401, { message: "ไม่พบบัญชี" })
        const playerPoints = curPlayer.points || 0;
        const shopPrice = shop.price;

        if (playerPoints < shopPrice) {
            return fail(400, {
                message: 'Point ไม่พอซื้อ กรุณาเติมเงิน',
                currentPoints: playerPoints,
                requiredPoints: shopPrice
            });
        }
        if (shop.itemCommand) {
            shop.itemCommand.forEach((item) => {
                RconManager.executeCommand(String(item.itemCommand))
            })
        }

        const remainingPoints = playerPoints - shopPrice;

        try {
            const updatedSession = {
                ...session,
                user: {
                    ...session.user,
                    points: remainingPoints
                }
            };
            // cachedData this data will be used
            setCache(`${valla.user.SESSION}:${isAuth}`, updatedSession, {
                ttl: 3600,
                forceOverwrite: true
            });
        } catch (cacheError) {
            console.error('Failed to update session cache:', cacheError);
        }
        // Store data into Server
        try {
            // implement this part to have queue of data so it will call it after period of time to prevent user from spamming server query
            // await db.user.update({
            //     where: {
            //         id: session.userId
            //     },
            //     data: {
            //         points: remainingPoints
            //     },
            //     select: {
            //         points: true
            //     }
            // })
            queueDatabaseUpdate(session.userId, remainingPoints);
        } catch (error) {
            return fail(500, { message: "เกิดข้อผิดพลาด" })
        }
        return { status: 200, success: true, message: `ซื้อไอเทม ${shop.title} สำเร็จ` }

    }
}