<script lang="ts">
	import Icon from '@iconify/svelte';
	import {
		AppBar,
		Avatar,
		getDrawerStore,
		LightSwitch,
		type DrawerSettings
	} from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { SignIn, SignOut } from '@auth/sveltekit/components';
	const drawerStore = getDrawerStore();
	const drawerSettings: DrawerSettings = {
		id: 'ProfilePop',
		position: 'right',
		width: 'w-[280px] md:w-[480px]',
		bgBackdrop: 'bg-gradient-to-tr from-indigo-500/50 via-purple-500/50 to-pink-500/50',
		meta: { foo: 'bar', fizz: 'buzz', age: 40 }
	};
	let isTabOpen = $state(false);
	function logOnTabPress() {
		onMount(() => {
			document.addEventListener('keydown', (event) => {
				if (event.key === 'Tab') {
					if (!isTabOpen) {
						isTabOpen = true;
						return drawerStore.open(drawerSettings);
					} else {
						isTabOpen = false;
						return drawerStore.close();
					}
				}
			});
		});
	}

	logOnTabPress();

	import { page } from '$app/stores';

	const tabSize = 36;
</script>

<AppBar background="bg-white dark:variant-filled-surface" padding="py-4 px-2" shadow="shadow-md">
	<svelte:fragment slot="lead"
		><a href="/" class="btn text-4xl font-bold">SERENITY</a>
		<div class="flex pl-4 gap-10 max-md:hidden">
			<a href="/shop">
				<div class="flex flex-col items-center hover:scale-105 duration-200 active:scale-110">
					<div><Icon icon="mdi:cart" width={tabSize} height={tabSize} /></div>
					<div>รายการสินค้า</div>
				</div></a
			>
			<a href="/topup">
				<div class="flex flex-col items-center hover:scale-105 duration-200 active:scale-110">
					<div><Icon icon="mdi:hand-coin" width={tabSize} height={tabSize} /></div>
					<div>เติมเงิน</div>
				</div></a
			>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		{#if !$page.data.session}
			<SignIn>
				<div slot="submitButton" class="buttonPrimary">เข้าสู่ระบบ</div>
			</SignIn>
		{:else if $page.data.session.user}
			<button
				onclick={() => drawerStore.open(drawerSettings)}
				class="flex flex-col items-center justify-center"
			>
				<Avatar
					initials={$page.data.session.user.name ? $page.data.session.user.name[0] : ''}
					src={$page.data.session.user.image ?? ''}
					background="bg-primary-500"
					width="w-12"
					rounded="rounded-full"
					border={`border-4 ${$page.data.isOnline ? 'border-success-500' : 'border-warning-500'}`}
				/>
				<small>
					ยอดคงเหลือ {$page.data.session.user.points} P
				</small>
			</button>
		{/if}
		<!-- <button onclick={() => drawerStore.open(drawerSettings)} class="px-4 text-xs max-md:hidden"
			>กด <kbd class="kbd variant-filled-primary">Tab</kbd> เพื่อเปิดเมนู</button
		> -->
		<div class="hidden">
			<LightSwitch />
		</div>
	</svelte:fragment>
</AppBar>
