<script>
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import { AppBar } from '@skeletonlabs/skeleton';
</script>

<AppBar background="bg-white" padding="py-4 px-2" shadow="shadow-md">
	<svelte:fragment slot="lead"
		><a href="/" class="text-2xl font-bold btn">SERENITY</a>
		<a href="/shop">ไอเทม</a>
		</svelte:fragment
	>
	<svelte:fragment slot="trail"><LightSwitch /></svelte:fragment>
</AppBar>
