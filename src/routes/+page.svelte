<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import PrimeLayer from '$lib/Widgets/PrimeLayer.svelte';
	import Icon from '@iconify/svelte';

	const { data }: { data: PageData } = $props();

	let curVert = $state<number>(0);
	let copied = $state(false);

	const serverName = 'MineCha';
	const serverVersion = '26.3';
	const serverIp = 'MineCha.Online';

	function handleScroll() {
		curVert = window.scrollY;
	}

	async function copyIp() {
		try {
			await navigator.clipboard.writeText(serverIp);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch {
			// ponytail: fallback clipboard if permission denied
		}
	}

	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	const howToJoinSteps = [
		{
			step: '01',
			title: 'เปิดเกม Minecraft',
			desc: `ตรวจสอบให้แน่ใจว่าเลือกเวอร์ชัน ${serverVersion} (รองรับตัวเกมมาตรฐาน)`
		},
		{
			step: '02',
			title: 'เข้าสู่ Multiplayer',
			desc: 'เลือกเมนู Multiplayer แล้วกดปุ่ม Add Server หรือ Direct Connection'
		},
		{
			step: '03',
			title: 'ใส่ Server Address',
			desc: `กรอก ${serverIp} แล้วกด Join Server เพื่อเริ่มการผจญภัยได้ทันที!`
		}
	];

	const serverFeatures = [
		{
			icon: 'lucide:swords',
			title: 'ระบบเอาชีวิตรอด & กิลด์',
			desc: 'สร้างอาณาจักร ตั้งกิลด์ร่วมกับเพื่อน และเข้าร่วมศึกชิงดินแดนสุดเข้มข้น',
			color: 'text-secondary-500 bg-secondary-500/10 dark:bg-secondary-500/20'
		},
		{
			icon: 'lucide:coins',
			title: 'ระบบเศรษฐกิจสมดุล',
			desc: 'ตลาดกลาง Player Market ซื้อขายแลกเปลี่ยนผลผลิต ทุกสายอาชีพเติบโตได้',
			color: 'text-tertiary-500 bg-tertiary-500/10 dark:bg-tertiary-500/20'
		},
		{
			icon: 'lucide:shield-check',
			title: 'ระบบป้องกันแลนด์ปลอดภัย',
			desc: 'ระบบเคลมพื้นที่และล็อกหีบ ปกป้องบ้านและไอเทมสำคัญของคุณตลอด 24 ชม.',
			color: 'text-success-500 bg-success-500/10 dark:bg-success-500/20'
		}
	];

	const topPlayers = [
		{
			rank: 1,
			name: 'PlayerOne',
			badge: '🥇 อันดับ 1',
			badgeColor: 'variant-filled-warning',
			borderColor: 'border-amber-400/60 dark:border-amber-400/40',
			hours: '128 ชม.',
			quote: 'ผู้เล่นอันดับหนึ่งในดวงใจ',
			avatar: 'https://cdn.pixabay.com/photo/2020/12/10/11/07/creeper-5819992_960_720.png'
		},
		{
			rank: 2,
			name: 'PlayerTwo',
			badge: '🥈 อันดับ 2',
			badgeColor: 'variant-soft-surface',
			borderColor: 'border-surface-300 dark:border-surface-600',
			hours: '94 ชม.',
			quote: 'ออนไลน์สม่ำเสมอทุกวัน',
			avatar: 'https://cdn.pixabay.com/photo/2020/12/10/11/07/creeper-5819992_960_720.png'
		},
		{
			rank: 3,
			name: 'PlayerThree',
			badge: '🥉 อันดับ 3',
			badgeColor: 'variant-soft-warning',
			borderColor: 'border-amber-700/40 dark:border-amber-600/40',
			hours: '72 ชม.',
			quote: 'ขยันฟาร์มและร่วมกิจกรรม',
			avatar: 'https://cdn.pixabay.com/photo/2020/12/10/11/07/creeper-5819992_960_720.png'
		}
	];
</script>

<PrimeLayer
	bgContent=""
	title=""
	subTitle=""
	menuGap=""
	linkPaths={[
		{
			title: 'หน้าหลัก',
			link: '/'
		}
	]}
	icon="lucide:home"
>
	<div class="space-y-10 px-2 lg:px-4">
		<!-- Bento Hero Section -->
		<div class="grid grid-cols-1 gap-6 xl:grid-cols-12">
			<!-- Main Hero Banner (xl: 8 cols) -->
			<div
				class="group relative -mx-2 flex min-h-[460px] flex-col justify-end overflow-hidden border-y border-surface-200/80 bg-surface-100 shadow-xl transition-all duration-300 dark:border-surface-700/60 dark:bg-surface-800 sm:mx-0 sm:min-h-[480px] sm:rounded-2xl sm:border xl:col-span-8 xl:h-full xl:min-h-full"
			>
				<img
					class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
					src="/background/bg.webp"
					alt="{serverName} Hero"
					draggable="false"
				/>

				<!-- Ambient gradient backdrop to ensure full banner readability -->
				<div
					class="from-surface-950 via-surface-950/70 to-surface-950/25 pointer-events-none absolute inset-0 bg-gradient-to-t"
				></div>

				<!-- Top Glass Badges -->
				<div class="absolute left-4 top-4 z-20 flex flex-wrap items-center gap-2">
					<span
						class="badge border border-white/20 bg-surface-900/70 font-semibold text-white backdrop-blur-md"
					>
						<span class="mr-1.5 h-2 w-2 animate-pulse rounded-full bg-success-500"></span>
						{serverName} Community
					</span>
					<span
						class="badge border border-white/20 bg-secondary-500/85 font-bold text-white backdrop-blur-md"
					>
						เวอร์ชัน {serverVersion}
					</span>
				</div>

				<!-- Hero Bottom Overlay -->
				<div class="relative z-10 p-5 text-white sm:p-8">
					<h1
						class="speed-runner flex select-none items-center text-3xl font-black tracking-tight text-white sm:text-5xl"
					>
						{#each serverName.split('') as char, i}
							<span class="wobble-char" style="animation-delay: {i * 0.07}s;">{char}</span>
						{/each}
						<span class="speed-spark ml-2">⚡</span>
					</h1>
					<p class="mt-2 max-w-xl text-sm text-surface-200 sm:text-base">
						เซิร์ฟเวอร์คอมมูนิตี้ Minecraft เวอร์ชัน {serverVersion} สนุก ปลอดภัย และไร้ขีดจำกัด พร้อมระบบเอาชีวิตรอดที่สมบูรณ์แบบ
					</p>

					<!-- Action Buttons & IP Copy Pill -->
					<div class="mt-5 flex flex-wrap items-center gap-3">
						<button
							type="button"
							onclick={copyIp}
							class="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-4 py-2.5 text-xs font-semibold backdrop-blur-md transition-all hover:bg-white/25 active:scale-95"
							title="คลิกเพื่อคัดลอก IP เซิร์ฟเวอร์"
						>
							<Icon
								icon={copied ? 'lucide:check-check' : 'lucide:copy'}
								class="h-4 w-4 text-secondary-400"
							/>
							<span>IP: <strong class="text-white">{serverIp}</strong></span>
							{#if copied}
								<span class="ml-1 font-bold text-success-400">(คัดลอกสำเร็จ!)</span>
							{/if}
						</button>

						<a
							href="#how-to-join"
							class="btn btn-sm rounded-xl border border-white/20 bg-surface-800/80 font-semibold text-white shadow-md backdrop-blur-md hover:bg-surface-700/80"
						>
							<Icon icon="lucide:book-open" class="h-4 w-4" />
							<span>วิธีเข้าเล่น</span>
						</a>

						<a
							href="/shop"
							class="variant-filled-secondary btn btn-sm rounded-xl font-bold shadow-md transition-transform active:scale-95"
						>
							<Icon icon="lucide:shopping-bag" class="h-4 w-4" />
							<span>ร้านค้าไอเทม</span>
						</a>
					</div>
				</div>
			</div>

			<!-- Bento Stats Column (xl: 4 cols) -->
			<div class="flex flex-col justify-between gap-4 xl:col-span-4">
				<!-- Server Status Card -->
				<div
					class="card rounded-2xl border border-surface-200/80 bg-white/95 p-6 text-surface-900 shadow-lg backdrop-blur-md transition-all hover:shadow-xl dark:border-surface-700/60 dark:bg-surface-800/90 dark:text-surface-50"
				>
					<div class="flex items-center justify-between">
						<span
							class="text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400"
						>
							สถานะเซิร์ฟเวอร์
						</span>
						<span
							class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold {data.pAll ===
							'เซิร์ฟเวอร์ออฟไลน์'
								? 'bg-error-500/15 text-error-600 dark:text-error-400'
								: 'bg-success-500/15 text-success-700 dark:text-success-400'}"
						>
							<span
								class="h-2 w-2 rounded-full {data.pAll === 'เซิร์ฟเวอร์ออฟไลน์'
									? 'bg-error-500'
									: 'animate-ping bg-success-500'}"
							></span>
							{data.pAll === 'เซิร์ฟเวอร์ออฟไลน์' ? 'Offline' : 'Online'}
						</span>
					</div>

					<div class="mt-4 flex items-baseline gap-2">
						<span
							class="text-4xl font-extrabold tracking-tight {data.pAll === 'เซิร์ฟเวอร์ออฟไลน์'
								? 'text-error-500'
								: data.pAll === '0'
									? 'text-success-600 dark:text-success-400'
									: 'text-surface-900 dark:text-white'}"
						>
							{data.pAll === '0' ? 'ออนไลน์' : data.pAll}
						</span>
						{#if data.pAll !== 'เซิร์ฟเวอร์ออฟไลน์' && data.pAll !== '0'}
							<span class="text-sm font-medium text-surface-500 dark:text-surface-400"
								>คนออนไลน์</span
							>
						{/if}
					</div>

					<div
						class="mt-3 flex items-center justify-between border-t border-surface-200/60 pt-3 text-xs dark:border-surface-700/60"
					>
						<span class="text-surface-500 dark:text-surface-400">เวอร์ชันที่รองรับ:</span>
						<span class="font-bold text-secondary-600 dark:text-secondary-400"
							>v{serverVersion}</span
						>
					</div>
				</div>

				<!-- Top Supporter Card -->
				<div
					class="card rounded-2xl border border-surface-200/80 bg-white/95 p-6 text-surface-900 shadow-lg backdrop-blur-md transition-all hover:shadow-xl dark:border-surface-700/60 dark:bg-surface-800/90 dark:text-surface-50"
				>
					<div class="flex items-center gap-3">
						<div class="rounded-xl bg-amber-500/10 p-3 text-amber-500 dark:bg-amber-500/20">
							<Icon icon="lucide:crown" class="h-6 w-6" />
						</div>
						<div>
							<span
								class="text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400"
							>
								ผู้สนับสนุนอันดับหนึ่ง
							</span>
							<h3 class="text-lg font-bold text-surface-900 dark:text-surface-100">Top Donator</h3>
						</div>
					</div>
					<p class="mt-3 text-xs text-surface-500 dark:text-surface-400">
						ร่วมเป็นกำลังสำคัญในการผลักดันเซิร์ฟเวอร์ {serverName} ให้ดียิ่งขึ้น
					</p>
					<a
						href="/topup"
						class="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-secondary-600 hover:underline dark:text-secondary-400"
					>
						<span>สนับสนุนเซิร์ฟเวอร์ / เติมเงิน</span>
						<Icon icon="lucide:arrow-right" class="h-3.5 w-3.5" />
					</a>
				</div>

				<!-- Playtime Leader Highlight Card -->
				<a
					href="#topOnline"
					class="group card rounded-2xl border border-surface-200/80 bg-white/95 p-6 text-surface-900 no-underline shadow-lg backdrop-blur-md transition-all hover:shadow-xl dark:border-surface-700/60 dark:bg-surface-800/90 dark:text-surface-50"
				>
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-3">
							<div
								class="rounded-xl bg-secondary-500/10 p-3 text-secondary-500 dark:bg-secondary-500/20"
							>
								<Icon icon="lucide:flame" class="h-6 w-6" />
							</div>
							<div>
								<span
									class="text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400"
								>
									เวลาออนไลน์สะสม
								</span>
								<h3 class="text-lg font-bold text-surface-900 dark:text-surface-100">
									อันดับ 1-3 ประจำสัปดาห์
								</h3>
							</div>
						</div>
					</div>
				</a>
			</div>
		</div>

		<!-- How to Join Section (Intuitive & Easy to Use) -->
		<div id="how-to-join" class="space-y-4">
			<div class="flex items-center gap-2">
				<Icon icon="lucide:gamepad-2" class="h-6 w-6 text-secondary-500" />
				<h2 class="text-xl font-extrabold text-surface-900 dark:text-surface-50 sm:text-2xl">
					วิธีเข้าร่วมเล่น {serverName}
				</h2>
			</div>
			<p class="text-xs text-surface-500 dark:text-surface-400">
				เริ่มต้นการผจญภัยง่ายๆ เพียง 3 ขั้นตอน สำหรับเวอร์ชัน {serverVersion}
			</p>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				{#each howToJoinSteps as step}
					<div
						class="card rounded-2xl border border-surface-200/80 bg-white/95 p-6 text-surface-900 shadow-md backdrop-blur-md dark:border-surface-700/60 dark:bg-surface-800/90 dark:text-surface-50"
					>
						<span class="text-3xl font-black text-secondary-500/30 dark:text-secondary-400/30">
							{step.step}
						</span>
						<h3 class="mt-2 text-base font-bold text-surface-900 dark:text-surface-50">
							{step.title}
						</h3>
						<p class="mt-1 text-xs leading-relaxed text-surface-500 dark:text-surface-400">
							{step.desc}
						</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Leaderboard Section -->
		<div id="topOnline" class="space-y-6 pt-2">
			<div>
				<div class="flex items-center gap-2">
					<Icon icon="lucide:trophy" class="h-6 w-6 text-amber-500" />
					<h2 class="text-xl font-extrabold text-surface-900 dark:text-surface-50 sm:text-2xl">
						อันดับเวลาผู้เล่นออนไลน์สะสมสูงสุด
					</h2>
				</div>
				<p class="mt-1 text-xs text-surface-500 dark:text-surface-400">
					ตารางเกียรติยศสำหรับผู้เล่นที่มีเวลาในเซิร์ฟเวอร์ {serverName} มากที่สุด
				</p>
			</div>

			<!-- Leaderboard Cards -->
			<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
				{#each topPlayers as player}
					<div
						class="card relative overflow-hidden rounded-2xl border {player.borderColor} bg-white/95 p-6 text-surface-900 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-surface-800/90 dark:text-surface-50"
					>
						<div class="flex items-center justify-between">
							<span class="badge {player.badgeColor} text-xs font-bold">
								{player.badge}
							</span>
							<span class="text-xs font-semibold text-surface-500 dark:text-surface-400">
								{player.hours}
							</span>
						</div>

						<div class="mt-6 flex flex-col items-center text-center">
							<div
								class="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-surface-100 p-2 shadow-inner dark:bg-surface-700/60"
							>
								<img
									src={player.avatar}
									alt={player.name}
									class="h-20 w-20 object-contain drop-shadow"
								/>
							</div>

							<h3 class="mt-4 text-lg font-bold text-surface-900 dark:text-surface-50">
								{player.name}
							</h3>
							<p class="mt-1 text-xs italic text-surface-500 dark:text-surface-400">
								"{player.quote}"
							</p>
						</div>

						<div
							class="mt-6 flex items-center justify-between border-t border-surface-200/60 pt-4 text-xs dark:border-surface-700/60"
						>
							<span class="text-surface-500 dark:text-surface-400">เวลาสะสม</span>
							<span class="font-bold text-secondary-600 dark:text-secondary-400">
								{player.hours}
							</span>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</PrimeLayer>

<style>
	.speed-runner {
		transform: skewX(-10deg);
		display: inline-flex;
	}
	.wobble-char {
		display: inline-block;
		animation: speedWobbleOnce 0.85s cubic-bezier(0.34, 1.56, 0.64, 1) both;
		transform-origin: bottom center;
	}
	@keyframes speedWobbleOnce {
		0% {
			transform: translateX(-35px) translateY(10px) rotate(-16deg) scale(0.6);
			opacity: 0;
		}
		40% {
			transform: translateX(8px) translateY(-12px) rotate(10deg) scale(1.12);
			opacity: 1;
		}
		70% {
			transform: translateX(-3px) translateY(-3px) rotate(-4deg) scale(0.98);
		}
		85% {
			transform: translateX(1px) translateY(-1px) rotate(2deg) scale(1.02);
		}
		100% {
			transform: translateX(0) translateY(0) rotate(0deg) scale(1);
			opacity: 1;
		}
	}
	.speed-spark {
		display: inline-block;
		animation: sparkOnce 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both;
		animation-delay: 0.45s;
	}
	@keyframes sparkOnce {
		0% {
			transform: scale(0) rotate(-45deg);
			opacity: 0;
		}
		70% {
			transform: scale(1.4) rotate(15deg);
			opacity: 1;
		}
		100% {
			transform: scale(1) rotate(0deg);
			opacity: 1;
		}
	}
</style>
