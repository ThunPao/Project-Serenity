import { db } from "$lib/db";
import { cacheFetch } from "$lib/server/niceCache";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { z } from "zod";
import { createLink } from "$lib/server/linkStore.ts";
import { CheckOnline } from "$lib/server/checkOnline.js";
import { fail } from "@sveltejs/kit";

import { RconManager } from "$lib/server/rconMinecraft";

export const load: PageServerLoad = async (e) => {
    // const { playerName, reward } = await e.request.json();
    // const code = createLink(playerName, reward);

    // return json({ 
    //     url: `/redeem/${code}` 
    // });

}

export const actions = {
    default: async (e) => {
        const formData = await e.request.formData();
        const pName = formData.get('playerName');

        const titleSchema = z.string()
            .min(3, "Username must be at least 3 characters")
            .max(16, "Username cannot be longer than 16 characters")
            .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores");

        const parseResult = titleSchema.safeParse(pName);
        if (!parseResult.success) {
            throw error(400, 'รูปแบบของข้อมูลไม่ถูกต้อง');
        }

        const playerName = parseResult.data;


        const isOnline = await CheckOnline(playerName)
        if (!isOnline) return fail(404, { message: "ไม่พบผู้เล่น" })
        if (!RconManager) return fail(404, {
            message: "เซิร์ฟเวอร์ออฟไลน์"
        })
        const code = createLink(playerName, "1234");
        const path = e.url;
        const fullUrl = `${path}/${code}`;
        // rcon.send(`say ${path}/${code}`)
        await RconManager.executeCommand(`tellraw ${playerName} {"text":" >> 🔑 CLICK HERE คลิกลิ้งที่นี่ เพื่อยืนยันตัวตน <<","color":"green","clickEvent":{"action":"open_url","value":"${fullUrl}"},"underlined":true}`);
        // await rcon.send(`tellraw ${playerName} [
        //     {"text":"➜ ","color":"yellow"},
        //     {"text":"คลิก เพื่อผูกบัญชีคุณกับเว็บไซต์ของเรา","color":"green","clickEvent":{"action":"open_url","value":"${fullUrl}"},"underlined":true},
        //     {"text":" [","color":"gray"},
        //     {"text":"LINK","color":"aqua"},
        //     {"text":"]","color":"gray"}
        // ]`);


        console.log(code)
    }
}