import { CheckSumPlayers } from "$lib/server/checkOnline";
import { cacheFetch } from "$lib/server/niceCache";
import { valla } from "$lib/server/variableList";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (e) => {

    const sumPlayers = await cacheFetch<string>(
        valla.server.PLAYER_COUNT,
        async () => {
            return await CheckSumPlayers();
        },
        {
            sec: 5
        }
    )


    return {
        pAll: String(sumPlayers)
    }
}