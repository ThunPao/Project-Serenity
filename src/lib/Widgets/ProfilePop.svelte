<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Avatar, LightSwitch } from '@skeletonlabs/skeleton';
	import { SignIn, SignOut } from '@auth/sveltekit/components';
	import { page } from '$app/stores';
</script>

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
				{#if $page.data.session && $page.data.session.user}
					<Avatar
						src={$page.data.session.user?.image ?? ''}
						width="w-12"
						rounded="rounded-full"
						border={`border-4 ${$page.data.isOnline ? 'border-success-500' : 'border-warning-500'}`}
					/>
					<div class="flex flex-col">
						<div class="font-bold">{$page.data.session.user.playerName}</div>
						<small class="font-semibold"
							>คงเหลือ {$page.data.session.user?.points} Points {$page.data.session.user?.coins} Coins</small
						>
						{#if $page.data.session}
							<div
								class="badge gap-1 text-sm font-bold"
								class:variant-filled-success={$page.data.isOnline}
								class:variant-filled-warning={!$page.data.isOnline}
								class:animate-pulse={!$page.data.isOnline}
							>
								<Icon
									icon={$page.data.isOnline ? 'mdi:check-decagram' : 'mdi:information-box'}
									width="1.5rem"
									height="1.5rem"
								/>
								{$page.data.isOnline ? 'ออนไลน์' : 'ออฟไลน์'}
							</div>
						{/if}
					</div>
				{/if}
			</div>

			<hr class="opacity-40" />

			<hr class="opacity-40" />
			<div class="grid gap-4 p-3">
				<div class="flex gap-4">
					<span>ปรับโทนสี</span>
					<LightSwitch />
				</div>
				<hr class="opacity-40" />
				{#if !$page.data.session}
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
