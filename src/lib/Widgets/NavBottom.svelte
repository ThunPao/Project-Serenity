<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Avatar, type DrawerSettings } from '@skeletonlabs/skeleton';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';

	const drawerStore = getDrawerStore();
	const drawerSettings: DrawerSettings = {
		id: 'ProfilePop',
		position: 'bottom',
		meta: { foo: 'bar', fizz: 'buzz', age: 40 }
	};

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
						src={$page.data.session && $page.data.session.user?.image || ''}
						width="w-20"
						rounded="rounded-full"
						border={`border-4 ${true ? 'border-success-500' : 'border-warning-500'}`}
					/>
			</button>
		</div>
		<a href="/shop" class="flex flex-col w-full items-center justify-center">
			<Icon icon="mdi:local-grocery-store" width="2rem" height="2rem" />
			<div>Shop</div>
		</a>
	</div>
</div>
