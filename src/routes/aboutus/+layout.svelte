<script>
	import PrimeLayer from '$lib/Widgets/PrimeLayer.svelte';
	let { children } = $props();
</script>

<PrimeLayer
	title="History"
	subTitle="ประวัติความเป็นมา"
	linkPaths={[
		{
			title: 'ประวัติความเป็นมา',
			link: ''
		}
	]}
>
	{@render children()}
</PrimeLayer>
