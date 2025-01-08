import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async (e) => {
// topup rating
}

export const actions = {
    default: async (e) => {
        const getForm = await e.request.formData();
        const code = getForm.get('code');
        console.log(code)
        return {
            success: true,
            message: "Yay"
        }
    }
}