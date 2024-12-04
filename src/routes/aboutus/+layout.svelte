<script>
	import PrimeLayer from '$lib/Widgets/PrimeLayer.svelte';
	let { children } = $props();
</script>

<PrimeLayer>
	{@render children()}
</PrimeLayer>
