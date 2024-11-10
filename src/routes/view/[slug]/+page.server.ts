import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/db";

export const load: PageServerLoad = async (req) => {

    const slug = req.params.slug;
    if (!slug) return redirect(303, "/")

    req.depends('shopitems');
    const data = await db.shopItems.findFirst({
        where: {
            id: Number(slug)
        }
    })
    if (!slug) return error(404, "ไม่พบสินค้า")
    return { data, slug }
}