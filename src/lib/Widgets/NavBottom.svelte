<script lang="ts">
	import type { UserSession } from '$lib/variableStore/interModels';
	import Icon from '@iconify/svelte';
	import { Avatar, type DrawerSettings } from '@skeletonlabs/skeleton';
	import { getDrawerStore } from '@skeletonlabs/skeleton';

	const drawerStore = getDrawerStore();
	const drawerSettings: DrawerSettings = {
		id: 'ProfilePop',
		position: 'bottom',
		meta: { foo: 'bar', fizz: 'buzz', age: 40 }
	};
	const {
		usrSession = null,
		isOnline = false
	}: { usrSession: UserSession | null | undefined; isOnline: Boolean } = $props();
</script>

<div class="fixed bottom-4 z-30 w-full p-1">
	<div
		class="flex items-center justify-center rounded-full bg-white p-1 py-2 text-center shadow-md shadow-secondary-500 dark:variant-filled-surface lg:hidden"
	>
		<a href="/" class="flex flex-col w-full items-center justify-center">
			<Icon icon="mdi:user-circle" width="2rem" height="2rem" />
			<div>Home</div>
		</a>
		<div class="grid w-full items-center justify-center -mt-6">
			<button onclick={() => drawerStore.open(drawerSettings)}>
				<Avatar
						src={usrSession?.image ?? ''}
						width="w-20"
						rounded="rounded-full"
						border={`border-4 ${isOnline ? 'border-success-500' : 'border-warning-500'}`}
					/>
			</button>
		</div>
		<a href="/shop" class="flex flex-col w-full items-center justify-center">
			<Icon icon="mdi:local-grocery-store" width="2rem" height="2rem" />
			<div>Shop</div>
		</a>
	</div>
</div>
