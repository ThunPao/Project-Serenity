<script lang="ts">
	import Navido from '$lib/Magic/Navido.svelte';
	import NaviNim from '$lib/Magic/NaviNim.svelte';
	import FooterBar from '$lib/Widgets/FooterBar.svelte';
	import NavTop from '$lib/Widgets/NavTop.svelte';
	import '../app.css';
	let { children } = $props();
</script>

<main data-theme="julia" class="bg-surface-50-900-token select-none font-noto">
	<Navido />
	<NaviNim />
	<NavTop />
	{@render children()}
	<!-- <FooterBar/> -->
</main>
