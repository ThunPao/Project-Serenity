<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Avatar, LightSwitch } from '@skeletonlabs/skeleton';
	let { session = null, isOnline = false } = $props();

	import { SignIn, SignOut } from '@auth/sveltekit/components';
</script>

<!-- {#if !session}
	<SignIn>
		<div slot="submitButton" class="buttonPrimary">เข้าสู่ระบบ</div>
	</SignIn>
{:else}
	<button
		onclick={() => drawerStore.open(drawerSettings)}
		class="flex flex-col items-center justify-center"
	>
		<Avatar
			initials={session.user?.name[0]}
			src={session.user.image}
			background="bg-primary-500"
			width="w-12"
			rounded="rounded-full"
		/>
		<small>
			{session.user?.name}
		</small>
	</button>
{/if} -->
<div id="ProfilePop" class="card z-50 h-full bg-white shadow-xl dark:text-white">
	<div class="flex h-full w-full flex-col justify-between">
		<div></div>

		<div>
			<a
				href="/tradepoints"
				class="flex items-center space-x-2 p-3 pt-4 hover:bg-surface-50-900-token"
			>
				<Icon icon="mdi:account-switch" width="24" height="24" />
				<div>แลกเปลี่ยนพ้อย</div>
			</a>

			<div class="flex items-center gap-4 p-4">
				{#if session}
					<Avatar
						src={session.user?.image}
						width="w-12"
						rounded="rounded-full"
						border={`border-4 ${isOnline ? 'border-success-500' : 'border-warning-500'}`}
					/>
					<div class="flex flex-col">
						<div class="font-bold">{session.user?.name}</div>
						<small class="font-semibold"
							>คงเหลือ {session.user?.points} Points {session.user?.coins} Coins</small
						>
					</div>
				{/if}
			</div>
			{#if session}
				<div
					class="badge gap-1 text-sm"
					class:variant-filled-success={isOnline}
					class:variant-filled-warning={!isOnline}
					class:animate-pulse={!isOnline}
				>
					<Icon
						icon={isOnline ? 'mdi:information-box' : 'mdi:check-decagram'}
						width="1.5rem"
						height="1.5rem"
					/>
					สถานะ {isOnline ? 'ออนไลน์' : 'คุณไม่ได้อยู่ในเกมส์'}
				</div>
			{/if}

			<hr class="opacity-40" />

			<hr class="opacity-40" />
			<div class="grid gap-4 p-3">
				<div class="flex gap-4">
					<span>ปรับโทนสี</span>
					<LightSwitch />
				</div>
				<hr class="opacity-40" />
				{#if !session}
					<SignIn>
						<div slot="submitButton" class="buttonPrimary">เข้าสู่ระบบ</div>
					</SignIn>
				{:else}
					<SignOut>
						<div
							slot="submitButton"
							class="flex items-center space-x-2 p-3 pt-4 hover:bg-surface-50-900-token"
						>
							ออกจากระบบ
						</div>
					</SignOut>
				{/if}
			</div>
		</div>
	</div>
</div>
