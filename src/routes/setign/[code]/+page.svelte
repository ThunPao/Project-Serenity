<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	const { data } = $props();
	onMount(() => {
		invalidate('app:curSession');
	});
</script>

<div class="container mx-auto p-4">
	<div class="text-center">
		<h1 class="mb-4 text-2xl">Success!</h1>
		<p>Your reward has been sent to {data.playerName}</p>

		<p class="mb-4">You're about to receive: {data.reward}</p>
	</div>
</div>
