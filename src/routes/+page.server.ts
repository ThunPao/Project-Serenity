import type { PageServerLoad } from "./$types";
import { db } from '$lib/db';

export const load: PageServerLoad = async (req) => {
    const data = await db.shopItems.findMany();
    return {
        colla: data
    }
}