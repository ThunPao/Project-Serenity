<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import PrimeLayer from '$lib/Widgets/PrimeLayer.svelte';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	let isCooldown = $state(true);
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
</script>

<PrimeLayer
	title="Topup"
	subTitle="เติมเงิน"
	linkPaths={[
		{
			title: 'เติมเงิน',
			link: ''
		}
	]}
>
	<div class="flex min-h-60 items-center justify-center">
		<form
			method="POST"
			class="grid justify-center gap-4 text-center"
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
			<h1>กรุณาระบุจำนวนเงิน</h1>
			<input
				name="code"
				class="input-white"
				autocomplete="off"
				placeholder="ระบุรหัส"
				type="text"
			/>
			<button type="submit" class="variant-filled-primary btn">ยืนยัน</button>
		</form>
	</div>
</PrimeLayer>
