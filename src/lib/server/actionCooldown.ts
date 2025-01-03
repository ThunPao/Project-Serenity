import { fail } from "@sveltejs/kit";

const cooldowns = new Map<string, number>();

async function withCooldown<T>(
    key: string,
    fn: () => Promise<T>,
    cooldownMs: number = 1000
): Promise<T> {
    const now = Date.now();
    const lastExecution = cooldowns.get(key);

    if (lastExecution && now - lastExecution < cooldownMs) {

        await sleep(cooldownMs - (now - lastExecution));
        throw fail(400, { message: "Cooldown" })
    }

    cooldowns.set(key, now);
    return fn();
}

async function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Usage example:
async function someAction() {
    return withCooldown('actionKey', async () => {
        // Your action here
        return 'result';
    });
}

export { withCooldown }