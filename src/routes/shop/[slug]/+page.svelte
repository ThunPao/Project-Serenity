<script lang="ts">
	import PrimeLayer from '$lib/Widgets/PrimeLayer.svelte';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import type { ActionData, PageData } from './$types';
	import { applyAction, enhance } from '$app/forms';
	import Icon from '@iconify/svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const { title, imageUrl, description } = data.colla;
	const tAlert = (msg: string, bgColor: string) => {
		if (msg) {
			const t: ToastSettings = {
				message: String(msg),
				background: bgColor
			};
			toastStore.trigger(t);
		}
	};
	const toastStore = getToastStore();
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
	<div
		class="badge gap-1 text-sm"
		class:variant-filled-success={!data.colla.checkOnline}
		class:variant-filled-warning={data.colla.checkOnline}
		class:animate-pulse={data.colla.checkOnline}
	>
		<Icon
			icon={data.colla.checkOnline ? 'mdi:information-box' : 'mdi:check-decagram'}
			width="1.5rem"
			height="1.5rem"
		/>
		{data.colla.checkOnline ? 'ไอเทมนี้ ต้องเข้าเซิฟก่อนซื้อ' : 'ไม่อยู่ในเซิฟก็ซื้อได้'}
	</div>
	<article class="prose py-2">
		<h1>
			{title}
		</h1>
	</article>
	<hr />
	<div class="p-2">
		{description}
	</div>
	<form
		action="?/buyItem"
		method="post"
		use:enhance={({ formElement, formData, action, cancel }) => {
			return async ({ result }) => {
				if (result.type === 'failure') {
					tAlert(String(result.data?.message), 'variant-filled-error');
				}
				if (result.type === 'success') {
					tAlert(String(result.data?.message), 'variant-filled-success');
				} else {
					console.error('Invalid data or fetch failure');
				}

				await applyAction(result);
			};
		}}
	>
		<div class="flex justify-center">
			<button type="submit" class="variant-filled-primary btn">Buy Item</button>
		</div>
	</form>
</PrimeLayer>
