import { db } from "$lib/db/index.js";
import { z } from "zod";
import type { PageServerLoad } from "../$types";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async () => {
	const data = await db.shopItems.findMany({
		select: {
			id: true,
			title: true,
			price: true,
			itemCommand: true,
		}
	});
	return { colla: data }
}
const purifyEditData = z.object({
	id: z.number({ required_error: "ไม่มีได้ไง" }),
	title: z.string({ required_error: "ต้องการชื่อสินค้า" }).max(64),
})

export const actions = {
	editItem: async ({ request }) => {
		const formData = await request.formData();
		const shopId = Number(formData.get('shopId'));
		const sTitle = formData.get('title');

		// Validate input
		const parseZod = purifyEditData.safeParse({ id: shopId, title: sTitle });
		if (!parseZod.success) {
			return fail(400, { message: 'Parse Failed', errors: parseZod.error.format() });
		}

		try {
			// Update database
			const updatedData = await db.shopItems.update({
				data: {
					title: parseZod.data.title
				},
				where: {
					id: parseZod.data.id
				}
			});

			if (!updatedData) return fail(400, { message: 'Update Failed' });

			return { success: true, message: 'Updated successfully' };
		} catch (error) {
			console.error('Update Error:', error);
			return fail(500, { message: 'Database Error' });
		}
	},
	delItem: async (e) => {
		const formData = await e.request.formData();
		const shopId = Number(formData.get('shopId'));
		if (!shopId) {
			return fail(400, { message: 'ไม่มีได้ไง' })
		}
		const delData = await db.shopItems.delete({
			where: {
				id: shopId
			}
		})
		if (!delData) return fail(400, { message: 'Delete Failed' });

	}
};