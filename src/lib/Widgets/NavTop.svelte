<script>
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import { AppBar } from '@skeletonlabs/skeleton';
</script>

<AppBar background="variant-filled-primary" padding="py-4 px-2" shadow="shadow-md">
	<svelte:fragment slot="lead"
		><a href="/" class="text-2xl font-bold btn">Project Serenity ไก่ทอด</a></svelte:fragment
	>
	<svelte:fragment slot="trail"><LightSwitch /></svelte:fragment>
</AppBar>
