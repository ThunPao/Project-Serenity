<script lang="ts">
	import Icon from '@iconify/svelte';
	const actionItems = [
		{
			title: 'Home',
			icon: 'mdi:house'
		},
		{
			title: '2',
			icon: 'mdi:house'
		},
		{
			title: 'Profile',
			icon: 'mdi:user-circle'
		}
	];
</script>

<div class="fixed bottom-4 z-50 w-full p-1">
	<div class="variant-filled-primary flex justify-center rounded-full p-1 text-center lg:hidden">
		{#each actionItems as tab}
			<div class="grid w-full items-center justify-center">
				<Icon icon={tab.icon} width="2rem" height="2rem" />
				<div>{tab.title}</div>
			</div>
		{/each}
	</div>
</div>
