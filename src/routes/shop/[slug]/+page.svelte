<script lang="ts">
	import PrimeLayer from '$lib/Widgets/PrimeLayer.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const { title, imageUrl } = data.colla;
</script>

<PrimeLayer
	{title}
	subTitle="รายละเอียดสินค้า"
	linkPaths={[
		{
			title: 'ร้านค้า',
			link: '/shop'
		},
		{
			title: title,
			link: ''
		}
	]}
>
	<div class="flex justify-center py-2">
		<!-- src={'/items/' + imageUrl} -->
		<img
			draggable="false"
			class="w-96 duration-100 active:scale-105"
			src="/items/coalore.webp"
			alt="1"
		/>
	</div>

	{title}
	<form action="?/buyItem" method="post">
		<button type="submit" class="variant-filled-primary btn">Buy Item</button>
	</form>
</PrimeLayer>
