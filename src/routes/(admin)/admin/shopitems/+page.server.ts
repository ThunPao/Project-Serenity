import { db } from "$lib/db/index.js";
import { z } from "zod";
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from "../$types";
import { error, fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";


// Define outside the load function so the adapter can be cached
const purifyEditData = z.object({
	id: z.number({ required_error: "ไม่มีได้ไง" }),
	title: z.string({ required_error: "ต้องการชื่อสินค้า" }).max(64),
	price: z.number({ required_error: "กรอกราคา" }),
	// itemCommand: z.array(
	// 	z.object({
	// 		id: z.number(),
	// 		itemCommand: z.string().nullable(),
	// 		shopItemsId: z.number().nullable()
	// 	})
	// )
})


export const load: PageServerLoad = async () => {
	const shopItems = await db.shopItems.findMany({
		select: {
			id: true,
			title: true,
			price: true,
			// itemCommand: true,
		}
	});
	if (!shopItems) error(404, "NotFound")
	const form = await superValidate(zod(purifyEditData));
	return { colla: shopItems, form }
}

export const actions = {
	editItem: async ({ request }) => {
		const form = await superValidate(request, zod(purifyEditData));
		if (!form.valid) {
			return fail(400, { form });
		}
		try {
			const updatedData = await db.shopItems.update({
				data: {
					title: form.data.title,
					price: form.data.price
				},
				where: {
					id: form.data.id
				}
			});

			if (!updatedData) return fail(400, { form, message: 'Update Failed' });

			return { form, success: true, message: 'Updated successfully' };
		} catch (error) {
			console.error('Update Error:', error);
			return fail(500, { form, message: 'Database Error' });
		}
	},
	delItem: async ({ request }) => {
		const form = await superValidate(request, zod(purifyEditData));
		if (!form.valid) {
			return fail(400, { form });
		}
		try {
			await db.shopItems.delete({
				where: {
					id: form.data.id
				}
			})
		} catch (error) {
			fail(400, { message: 'Delete Failed' });
		}

	}
};