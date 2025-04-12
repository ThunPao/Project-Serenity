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
		meta: { foo: 'bar', fizz: 'buzz', age: 40 },
		rounded: 'rounded-none'
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
	import DarkSwitch from '$lib/Components/DarkSwitch.svelte';

	const tabSize = 36;
</script>

<AppBar background="bg-white dark:variant-filled-surface max-lg:hidden" padding="p-2" shadow="shadow-md">
	<svelte:fragment slot="lead"
		><a href="/" class="btn text-2xl font-bold">SERENITY</a>
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
			<!-- <LightSwitch /> -->
			<DarkSwitch />
		</div>
	</svelte:fragment>
</AppBar>
