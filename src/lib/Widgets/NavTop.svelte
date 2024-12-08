<script lang="ts">
	import { AppBar, getDrawerStore, LightSwitch, type DrawerSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
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
</script>

<AppBar background="bg-white dark:variant-filled-primary" padding="py-4 px-2" shadow="shadow-md">
	<svelte:fragment slot="lead"
		><a href="/" class="btn text-2xl font-bold">SERENITY</a>
		<a href="/shop">ไอเทม</a>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<button onclick={() => drawerStore.open(drawerSettings)} class="px-4 text-xs"
			>กด <kbd class="kbd variant-filled-primary">Tab</kbd> เพื่อเปิดเมนู</button
		>
		<LightSwitch />
	</svelte:fragment>
</AppBar>
