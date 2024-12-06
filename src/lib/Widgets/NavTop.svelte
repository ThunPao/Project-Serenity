<script>
	import { AppBar } from '@skeletonlabs/skeleton';
	import ProfilePop from './ProfilePop.svelte';
</script>

<AppBar background="bg-white" padding="py-4 px-2" shadow="shadow-md">
	<svelte:fragment slot="lead"
		><a href="/" class="btn text-2xl font-bold">SERENITY</a>
		<a href="/shop">ไอเทม</a>
	</svelte:fragment>
	<svelte:fragment slot="trail"
		>
		<div class="px-4">
			<ProfilePop />
		</div>
	</svelte:fragment>
</AppBar>
