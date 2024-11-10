<script lang="ts">
	import { goto } from '$app/navigation';

	let { text, link = '', inActive = false } = $props();
</script>

<button
	disabled={inActive}
	onclick={() => (link ? goto('/view/1') : null)}
	class="btn h-full min-h-32 w-96 bg-surface-500 text-center shadow-md"
>
	<div class="flex h-full items-center justify-center font-bold text-white">{text}</div>
</button>
