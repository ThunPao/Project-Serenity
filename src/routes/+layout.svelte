<script lang="ts">
	import Navido from '$lib/Magic/Navido.svelte';
	import NaviNim from '$lib/Magic/NaviNim.svelte';
	// import FooterBar from '$lib/Widgets/FooterBar.svelte';
	import NavBottom from '$lib/Widgets/NavBottom.svelte';
	import NavTop from '$lib/Widgets/NavTop.svelte';
	import '../app.css';
	let { children } = $props();
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
</script>

<main data-theme="julia" class="bg-surface-50-900-token select-none font-noto">
	<Navido />
	<NaviNim />
	<NavTop />
	{@render children()}
	<NavBottom />
</main>
