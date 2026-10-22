<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Avatar, LightSwitch, getDrawerStore } from '@skeletonlabs/skeleton';
	import { SignIn, SignOut } from '@auth/sveltekit/components';
	import { page } from '$app/stores';
	import { sideBarList } from '$lib/variableStore';

	const drawerStore = getDrawerStore();
	const closeDrawer = () => drawerStore.close();

	const isActive = (path: string) => {
		if (path === '/') return $page.url.pathname === '/';
		return $page.url.pathname.startsWith(path);
	};
</script>

<div
	id="ProfilePop"
	class="flex h-full w-full flex-col justify-between overflow-y-auto bg-surface-50 text-surface-900 shadow-2xl dark:bg-surface-900 dark:text-surface-100"
>
	<!-- Top Bar / Header -->
	<div>
		<div
			class="flex items-center justify-between border-b border-surface-200/80 px-5 py-4 dark:border-surface-700/60"
		>
			<div class="flex items-center gap-2.5">
				<div class="rounded-lg bg-secondary-500/10 p-1.5 text-secondary-500 dark:bg-secondary-500/20">
					<Icon icon="mdi:account-cog" class="h-5 w-5" />
				</div>
				<span class="font-bold tracking-wide text-surface-800 dark:text-surface-100">
					เมนูผู้ใช้งาน
				</span>
			</div>
			<button
				type="button"
				onclick={closeDrawer}
				class="btn-icon btn-icon-sm rounded-lg text-surface-400 transition-colors hover:bg-surface-200 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-100"
				title="ปิดเมนู"
				aria-label="ปิดเมนู"
			>
				<Icon icon="mdi:close" class="h-5 w-5" />
			</button>
		</div>

		<!-- Profile / Session Area -->
		<div class="p-5">
			{#if $page.data.session && $page.data.session.user}
				<!-- Authenticated User Card -->
				<div
					class="card space-y-4 rounded-2xl border border-surface-200/80 bg-white/95 p-4 shadow-sm backdrop-blur-md dark:border-surface-700/60 dark:bg-surface-800/90"
				>
					<div class="flex items-center gap-3.5">
						<div class="relative">
							<Avatar
								src={$page.data.session.user?.image ?? ''}
								width="w-13"
								rounded="rounded-full"
								border="border-2 border-surface-200 dark:border-surface-700"
								class="shadow-sm"
							/>
							<span
								class="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white dark:border-surface-800 {$page
									.data.isOnline
									? 'bg-success-500'
									: 'bg-surface-400'}"
								title={$page.data.isOnline ? 'ออนไลน์ในเกม' : 'ออฟไลน์'}
							>
								{#if $page.data.isOnline}
									<span class="h-1.5 w-1.5 animate-ping rounded-full bg-white opacity-75"></span>
								{/if}
							</span>
						</div>

						<div class="min-w-0 flex-1">
							<div class="flex items-center justify-between gap-1">
								<h3 class="truncate text-base font-bold text-surface-900 dark:text-white">
									{$page.data.session.user.playerName ||
										$page.data.session.user.name ||
										'ผู้เล่น'}
								</h3>
								<span
									class="badge shrink-0 text-[10px] font-bold {$page.data.isOnline
										? 'variant-soft-success'
										: 'variant-soft-surface'}"
								>
									<span
										class="mr-1 inline-block h-1.5 w-1.5 rounded-full {$page.data.isOnline
											? 'bg-success-500'
											: 'bg-surface-400'}"
									></span>
									{$page.data.isOnline ? 'ในเซิร์ฟเวอร์' : 'ออฟไลน์'}
								</span>
							</div>

							{#if $page.data.session.user.playerName}
								<p class="truncate text-xs text-surface-500 dark:text-surface-400">
									IGN: <strong class="text-secondary-600 dark:text-secondary-400"
										>{$page.data.session.user.playerName}</strong
									>
								</p>
							{:else}
								<a
									href="/setign"
									onclick={closeDrawer}
									class="inline-flex items-center gap-1 text-xs font-semibold text-warning-600 hover:underline dark:text-warning-400"
								>
									<Icon icon="mdi:link-variant" class="h-3 w-3" />
									<span>ผูกชื่อตัวละครในเกม</span>
								</a>
							{/if}
						</div>
					</div>

					<!-- Wallet / Balances -->
					<div class="grid grid-cols-2 gap-2 pt-1">
						<div
							class="rounded-xl border border-surface-200/60 bg-surface-100/70 p-2.5 text-center dark:border-surface-700/60 dark:bg-surface-900/60"
						>
							<div class="flex items-center justify-center gap-1 text-[11px] font-semibold text-surface-500 dark:text-surface-400">
								<Icon icon="mdi:star-four-points" class="h-3.5 w-3.5 text-amber-500" />
								<span>แต้มคงเหลือ</span>
							</div>
							<div class="mt-0.5 text-lg font-black text-amber-600 dark:text-amber-400">
								{$page.data.session.user?.points ?? 0}
							</div>
							<span class="text-[10px] text-surface-400">Points</span>
						</div>

						<div
							class="rounded-xl border border-surface-200/60 bg-surface-100/70 p-2.5 text-center dark:border-surface-700/60 dark:bg-surface-900/60"
						>
							<div class="flex items-center justify-center gap-1 text-[11px] font-semibold text-surface-500 dark:text-surface-400">
								<Icon icon="mdi:hand-coin" class="h-3.5 w-3.5 text-secondary-500" />
								<span>เหรียญคงเหลือ</span>
							</div>
							<div class="mt-0.5 text-lg font-black text-secondary-600 dark:text-secondary-400">
								{$page.data.session.user?.coins ?? 0}
							</div>
							<span class="text-[10px] text-surface-400">Coins</span>
						</div>
					</div>

					<a
						href="/topup"
						onclick={closeDrawer}
						class="variant-filled-secondary btn btn-sm flex w-full items-center justify-center gap-1.5 rounded-xl font-bold shadow-sm transition-transform active:scale-95"
					>
						<Icon icon="mdi:credit-card-plus" class="h-4 w-4" />
						<span>เติมเงิน / รับแต้ม</span>
					</a>
				</div>
			{:else}
				<!-- Guest Welcome Card -->
				<div
					class="card rounded-2xl border border-surface-200/80 bg-white/95 p-5 text-center shadow-sm backdrop-blur-md dark:border-surface-700/60 dark:bg-surface-800/90"
				>
					<div
						class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5865F2]/10 text-[#5865F2]"
					>
						<Icon icon="ic:baseline-discord" class="h-7 w-7" />
					</div>
					<h3 class="mt-3 text-base font-bold text-surface-900 dark:text-white">
						ยินดีต้อนรับสู่เซิร์ฟเวอร์
					</h3>
					<p class="mt-1 text-xs text-surface-500 dark:text-surface-400">
						เข้าสู่ระบบด้วย Discord เพื่อสะสมแต้ม ซื้อไอเทมในร้านค้า และตรวจสอบสถานะออนไลน์
					</p>

					<div class="mt-4">
						<SignIn provider="discord" class="w-full">
							<button
								slot="submitButton"
								type="submit"
								class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5865F2] px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#4752C4] active:scale-95"
							>
								<Icon icon="ic:baseline-discord" class="h-5 w-5" />
								<span>เข้าสู่ระบบด้วย Discord</span>
							</button>
						</SignIn>
					</div>
				</div>
			{/if}

			<!-- Navigation Links -->
			<div class="mt-6 space-y-1">
				<span
					class="px-2 text-[11px] font-bold uppercase tracking-wider text-surface-400 dark:text-surface-500"
				>
					เมนูหลัก
				</span>
				<nav class="space-y-1 pt-1.5">
					{#each sideBarList as row}
						{@const active = isActive(row.goto)}
						<a
							href={row.goto}
							onclick={closeDrawer}
							class="flex items-center justify-between rounded-xl px-3.5 py-2.5 transition-all duration-150 {active
								? 'variant-filled-secondary font-bold text-white shadow-sm'
								: 'text-surface-700 hover:bg-surface-200/70 hover:text-surface-900 dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:text-surface-50'}"
						>
							<div class="flex items-center gap-3">
								<div
									class="flex h-8 w-8 items-center justify-center rounded-lg transition-colors {active
										? 'bg-white/20 text-white'
										: 'bg-surface-200/60 text-secondary-500 dark:bg-surface-700/60 dark:text-secondary-400'}"
								>
									<Icon icon={row.icon} class="h-4 w-4" />
								</div>
								<span class="text-sm">{row.title}</span>
							</div>
							<Icon
								icon="mdi:chevron-right"
								class="h-4 w-4 {active ? 'text-white' : 'text-surface-400 opacity-60'}"
							/>
						</a>
					{/each}
				</nav>
			</div>
		</div>
	</div>

	<!-- Bottom Section / Preferences & Sign Out -->
	<div
		class="border-t border-surface-200/80 bg-white/60 p-5 backdrop-blur dark:border-surface-700/60 dark:bg-surface-800/60"
	>
		<!-- Theme Toggle Card -->
		<div
			class="flex items-center justify-between rounded-xl border border-surface-200/80 bg-surface-100/80 px-3.5 py-2.5 dark:border-surface-700/60 dark:bg-surface-900/60"
		>
			<div class="flex items-center gap-2.5">
				<Icon icon="mdi:theme-light-dark" class="h-5 w-5 text-secondary-500" />
				<span class="text-xs font-semibold text-surface-700 dark:text-surface-300"
					>โหมดสว่าง / มืด</span
				>
			</div>
			<LightSwitch />
		</div>

		<!-- Sign Out Button (When Authenticated) -->
		{#if $page.data.session}
			<div class="mt-3">
				<SignOut class="w-full">
					<button
						slot="submitButton"
						type="submit"
						class="flex w-full items-center justify-center gap-2 rounded-xl border border-error-500/30 bg-error-500/10 px-4 py-2.5 text-xs font-semibold text-error-600 transition-all hover:bg-error-500/20 active:scale-95 dark:text-error-400"
					>
						<Icon icon="mdi:logout" class="h-4 w-4" />
						<span>ออกจากระบบ</span>
					</button>
				</SignOut>
			</div>
		{/if}
	</div>
</div>
