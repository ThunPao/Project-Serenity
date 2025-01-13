<script lang="ts">
	import PrimeLayer from '$lib/Widgets/PrimeLayer.svelte';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import type { ActionData, PageData } from './$types';
	import { applyAction, enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	import { invalidate } from '$app/navigation';

	const { data, form }: { data: PageData; form: ActionData } = $props();
	const { title, imageUrl, description, price } = data.colla;

	const toastStore = getToastStore();

	const tAlert = (msg: string, bgColor: string) => {
		if (msg) {
			const t: ToastSettings = {
				message: String(msg),
				background: bgColor,
				hoverable: true,
				classes: 'max-md:ml-40'
			};
			toastStore.trigger(t);
		}
	};
	let isCooldown = $state(false);
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
	<h3 class="text-xl font-bold">
		${price} Point
	</h3>

	<hr />

	<h5 class="p-6">
		{description}
	</h5>
	<form
		method="post"
		use:enhance={({ formElement, formData, action, cancel }) => {
			isCooldown = true;
			return async ({ result }) => {
				if (result.type === 'failure') {
					tAlert(String(result.data?.message), 'variant-filled-error');
					setTimeout(() => {
						isCooldown = false;
					}, 3000);
				}
				if (result.type === 'success') {
					invalidate('app:curSession');
					setTimeout(() => {
						isCooldown = false;
					}, 1050);
					tAlert(
						String(`✅ ${result.data?.message}`),
						'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white'
					);
				} else {
					console.error('Invalid data or fetch failure');
				}

				await applyAction(result);
			};
		}}
	>
		<div class="flex">
			<button
				disabled={isCooldown}
				title="ซื้อไอเทม"
				type="submit"
				class="variant-filled-success btn text-lg font-bold"
			>
				<span><Icon icon="mdi:coin" width="36" height="36" /></span>
				<span>BUY ITEM</span>
			</button>
			<!-- <button
				title="Refresh"
				type="button"
				class="btn btn-icon"
				class:hidden={!isCooldown}
				onclick={() => (isCooldown = false)}
			>
				<Icon icon="mdi:refresh" width="24" height="24" />
			</button> -->
		</div>
	</form>
</PrimeLayer>
