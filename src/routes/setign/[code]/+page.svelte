<script lang="ts">
    export let data;
    
    let claimed = false;
    let error = '';
    
    async function handleClaim() {
        const res = await fetch('?/redeem', {
            method: 'POST'
        });
        const result = await res.json();
        
        if (result.success) {
            claimed = true;
        } else {
            error = 'Failed to claim reward. Please try again.';
        }
    }
</script>

<div class="container mx-auto p-4">
    {#if !claimed}
        <div class="text-center">
            <h1 class="text-2xl mb-4">Reward for {data.playerName}</h1>
            <p class="mb-4">You're about to receive: {data.reward}</p>
            <button 
                class="bg-blue-500 text-white px-4 py-2 rounded"
                on:click={handleClaim}
            >
                Claim Reward
            </button>
            {#if error}
                <p class="text-red-500 mt-2">{error}</p>
            {/if}
        </div>
    {:else}
        <div class="text-center">
            <h1 class="text-2xl mb-4">Success!</h1>
            <p>Your reward has been sent to {data.playerName}</p>
        </div>
    {/if}
</div>