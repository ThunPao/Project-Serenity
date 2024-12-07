<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Avatar, LightSwitch, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	let { session = null } = $props();
	const popupFeatured: PopupSettings = {
		event: 'click',
		target: 'popupFeatured',
		placement: 'bottom'
	};
	// {
	//     title: "โอนพ้อย",
	//     goto:"/tradePoints",
	//     icon: "mdi:account-switch"
	// }
	import { SignIn, SignOut } from '@auth/sveltekit/components';
</script>

{#if !session}
	<SignIn>
		<div slot="submitButton" class="buttonPrimary">เข้าสู่ระบบ</div>
	</SignIn>
{:else}
	<button class="flex flex-col items-center justify-center" use:popup={popupFeatured}>
		<Avatar initials={session.user?.name[0]} src={session.user.image} background="bg-primary-500" width="w-12" rounded="rounded-full" />
		<small>
			{session.user?.name}
		</small>
	</button>
{/if}
<div class="card w-72 bg-white shadow-xl dark:text-white" data-popup="popupFeatured">
	<div class="flex items-center gap-4 p-4">
		{#if !session}
			เข้าสู่ระบบ
		{:else}
			<Avatar src={session.user?.image} width="w-12" rounded="rounded-full" />
			<div class="flex flex-col">
				<div class="font-bold">{session.user?.name}</div>
				<small class="font-semibold"
					>คงเหลือ {session.user?.points} Points {session.user?.coins} Coins</small
				>
			</div>
		{/if}
	</div>
	<hr class="opacity-40" />
	<a href="/tradepoints" class="flex items-center space-x-2 p-3 pt-4 hover:bg-surface-50-900-token">
		<Icon icon="mdi:account-switch" width="24" height="24" />
		<div>แลกเปลี่ยนพ้อย</div>
	</a>
	<hr class="opacity-40" />
	<div class="grid gap-4 p-3">
		<div class="flex gap-4">
			<span>ปรับโทนสี</span>
			<LightSwitch />
		</div>
		<hr class="opacity-40" />

		<SignOut>
			<div slot="submitButton" class="flex items-center space-x-2 p-3 pt-4 hover:bg-surface-50-900-token">ออกจากระบบ</div>
		</SignOut>
	</div>
</div>
