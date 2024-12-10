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
	import type { UserSession } from '$lib/variableStore/interModels';

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
	const { usrSession = null, isOnline = false }: {usrSession: UserSession | null | undefined,isOnline: Boolean} = $props();
</script>

<AppBar background="bg-white dark:variant-filled-surface" padding="py-4 px-2" shadow="shadow-md">
	<svelte:fragment slot="lead"
		><a href="/" class="btn text-2xl font-bold">SERENITY</a>
		<div class="pl-4">
			<a href="/shop">
				<div class="flex flex-col items-center">
					<div><Icon icon="mdi:cart" width="24" height="24" /></div>
					<div>สินค้า</div>
				</div></a
			>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		{#if !usrSession}
			<SignIn>
				<div slot="submitButton" class="buttonPrimary">เข้าสู่ระบบ</div>
			</SignIn>
		{:else}
			<button
				onclick={() => drawerStore.open(drawerSettings)}
				class="flex flex-col items-center justify-center"
			>
				<Avatar
					initials={usrSession.name ? usrSession.name[0] : ''}
					src={usrSession.image ?? ''}
					background="bg-primary-500"
					width="w-12"
					rounded="rounded-full"
					border={`border-4 ${isOnline ? "border-success-500" : "border-warning-500"}`}
				/>
				<small>
					{usrSession.name}
				</small>
			</button>
		{/if}
		<!-- <button onclick={() => drawerStore.open(drawerSettings)} class="px-4 text-xs max-md:hidden"
			>กด <kbd class="kbd variant-filled-primary">Tab</kbd> เพื่อเปิดเมนู</button
		> -->
		<div class="lg:hidden">
			<LightSwitch />
		</div>
	</svelte:fragment>
</AppBar>
