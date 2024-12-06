<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Avatar, LightSwitch, popup, type PopupSettings } from '@skeletonlabs/skeleton';

	const popupFeatured: PopupSettings = {
		// Represents the type of event that opens/closed the popup
		event: 'click',
		// Matches the data-popup value on your popup element
		target: 'popupFeatured',
		// Defines which side of your trigger the popup will appear
		placement: 'bottom'
	};
	// {
	//     title: "โอนพ้อย",
	//     goto:"/tradePoints",
	//     icon: "mdi:account-switch"
	// }
</script>

<button use:popup={popupFeatured}>
	<Avatar
		src="https://images.unsplash.com/photo-1617296538902-887900d9b592?ixid=M3w0Njc5ODF8MHwxfGFsbHx8fHx8fHx8fDE2ODc5NzExMDB8&ixlib=rb-4.0.3&w=128&h=128&auto=format&fit=crop"
		width="w-12"
		rounded="rounded-full"
	/>
</button>
<div class="card w-72 bg-white dark:text-white shadow-xl" data-popup="popupFeatured">
	<div class="flex items-center gap-4 p-4">
		<Avatar
			src="https://images.unsplash.com/photo-1617296538902-887900d9b592?ixid=M3w0Njc5ODF8MHwxfGFsbHx8fHx8fHx8fDE2ODc5NzExMDB8&ixlib=rb-4.0.3&w=128&h=128&auto=format&fit=crop"
			width="w-12"
			rounded="rounded-full"
		/>
		<div class="flex flex-col">
			<div class="font-bold">UserName1234</div>
			<small class="font-semibold">คงเหลือ 88,888 Points</small>
		</div>
	</div>
	<hr class="opacity-40" />
	<a href="/tradepoints" class="flex items-center space-x-2 p-3 pt-4 hover:bg-surface-50-900-token">
		<Icon icon="mdi:account-switch" width="24" height="24" />
		<div>แลกเปลี่ยนพ้อย</div>
	</a>
	<hr class="opacity-40" />
    <div class="flex p-3 gap-4">
        <span>ปรับโทนสี</span> <LightSwitch />
    </div>
</div>
