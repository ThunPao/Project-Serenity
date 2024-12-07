<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Avatar, popup, type PopupSettings } from '@skeletonlabs/skeleton';

	const popupFeatured: PopupSettings = {
		event: 'click',
		target: 'popupFeatured',
		placement: 'top'
	};
</script>

<div class="fixed bottom-4 z-50 w-full p-1">
	<div
		class="variant-filled-primary flex items-center justify-center rounded-full p-1 text-center lg:hidden"
	>
		<div class="grid w-full items-center justify-center">
			<Icon icon="mdi:user-circle" width="2rem" height="2rem" />
			<div>Home</div>
		</div>
		<div class="grid w-full items-center justify-center">
			<Icon icon="mdi:user-circle" width="2rem" height="2rem" />
			<div>Home</div>
		</div>
		<div class="grid w-full items-center justify-center">
			<button use:popup={popupFeatured}>
				<Avatar
					src="https://images.unsplash.com/photo-1617296538902-887900d9b592?ixid=M3w0Njc5ODF8MHwxfGFsbHx8fHx8fHx8fDE2ODc5NzExMDB8&ixlib=rb-4.0.3&w=128&h=128&auto=format&fit=crop"
					width="w-12"
					rounded="rounded-full"
				/>
			</button>
		</div>
	</div>
</div>
