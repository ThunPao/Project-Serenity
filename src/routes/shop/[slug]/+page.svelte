<script lang="ts">
	import PrimeLayer from '$lib/Widgets/PrimeLayer.svelte';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import type { ActionData, PageData } from './$types';
	import { applyAction, enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	import { invalidate } from '$app/navigation';

	const { data, form }: { data: PageData; form: ActionData } = $props();
	const item = $derived(data.colla);

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
	icon="mdi:cart"
	title="รายละเอียดสินค้า"
	subTitle={item.title}
	linkPaths={[
		{
			title: 'ร้านค้า',
			link: '/shop'
		},
		{
			title: item.title,
			link: ''
		}
	]}
>
	<div class="space-y-6">
		<!-- Image Container with View Transition Key -->
		<div class="flex justify-center py-4">
			<div class="rounded-2xl bg-surface-100/60 p-6 shadow-inner dark:bg-surface-700/40">
				<img
					draggable="false"
					class="max-h-80 w-80 object-contain duration-200 active:scale-105"
					src={item.imageUrl
						? item.imageUrl.startsWith('/')
							? item.imageUrl
							: '/items/' + item.imageUrl
						: '/items/coalore.webp'}
					style="view-transition-name: shop-img-{item.id};"
					alt={item.title}
					onerror={(e) => {
						(e.currentTarget as HTMLImageElement).src = '/items/coalore.webp';
					}}
				/>
			</div>
		</div>

		<!-- Status Badge -->
		<div class="flex justify-center">
			<div
				class="badge gap-1.5 px-3 py-1.5 text-xs font-semibold"
				class:variant-filled-success={!item.checkOnline}
				class:variant-filled-warning={item.checkOnline}
				class:animate-pulse={item.checkOnline}
			>
				<Icon
					icon={item.checkOnline ? 'mdi:information-box' : 'mdi:check-decagram'}
					width="1.25rem"
					height="1.25rem"
				/>
				<span>{item.checkOnline ? 'ไอเทมนี้ ต้องเข้าเซิร์ฟเวอร์ก่อนซื้อ' : 'ไม่อยู่ในเซิร์ฟเวอร์ก็ซื้อได้'}</span>
			</div>
		</div>

		<!-- Title & Price -->
		<div class="text-center space-y-2">
			<h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50 sm:text-3xl">
				{item.title}
			</h1>
			<div class="inline-flex items-baseline gap-1 rounded-full bg-secondary-500/10 px-4 py-1 dark:bg-secondary-500/20">
				<span class="text-2xl font-black text-secondary-600 dark:text-secondary-400">
					${item.price.toLocaleString()}
				</span>
				<span class="text-xs font-semibold text-surface-500 dark:text-surface-400">Point</span>
			</div>
		</div>

		<hr class="border-surface-200 dark:border-surface-700/60" />

		<!-- Description -->
		{#if item.description}
			<div class="rounded-xl bg-surface-50/80 p-5 text-sm text-surface-700 dark:bg-surface-800/80 dark:text-surface-300">
				<p class="leading-relaxed">{item.description}</p>
			</div>
		{/if}

		<!-- Action Form -->
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
			<div class="flex justify-center pt-2">
				<button
					disabled={isCooldown}
					title="ซื้อไอเทม"
					type="submit"
					class="variant-filled-success btn btn-lg rounded-xl font-bold shadow-lg transition-transform active:scale-95"
				>
					<Icon icon="mdi:coin" width="28" height="28" />
					<span>ยืนยันการซื้อสินค้า</span>
				</button>
			</div>
		</form>
	</div>
</PrimeLayer>
