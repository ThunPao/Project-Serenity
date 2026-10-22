<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { navigating } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { Circle3 } from 'svelte-loading-spinners';
	const p = tweened(0, {
		duration: 200,
		easing: cubicOut
	});

	let isVisible = false;

	function increase() {
		if ($p >= 0 && $p < 0.2) {
			p.update((_) => _ + 0.04);
		} else if ($p >= 0.2 && $p < 0.5) {
			p.update((_) => _ + 0.02);
		} else if ($p >= 0.5 && $p < 0.8) {
			p.update((_) => _ + 0.002);
		} else if ($p >= 0.8 && $p < 0.99) {
			p.update((_) => _ + 0.0005);
		} else {
			p.set(0);
		}

		if ($navigating) {
			const rand = Math.round(Math.random() * (300 - 50)) + 50;
			setTimeout(increase, rand);
		}
	}

	$: {
		if ($navigating) {
			increase();
			isVisible = true;
		} else {
			p.update((_) => _ + 0.3);
			setTimeout(() => {
				p.set(1);
				setTimeout(() => {
					isVisible = false;

					p.set(0);
				}, 100);
			}, 100);
		}
	}
</script>

<div
	class="fixed inset-0 z-50 flex select-none bg-surface-900 bg-opacity-0 transition-opacity duration-300"
	class:hidden={!isVisible}
>
	<div class="flex w-full flex-col justify-center">
		<div class="z-50 flex h-full items-center justify-center">
			<Circle3 size="60" unit="px" duration="1s" />
		</div>
		<div class="flex items-end justify-center text-center">
			<progress value={$p} transition:fade={{ duration: 300 }}></progress>
		</div>
	</div>
</div>

<style>
	progress {
		--bar-color: rgba(255, 255, 255, 0.3);
		--val-color: #148527;
		z-index: 999999;
		height: 4px;
		width: 80vw;
		border-radius: 0;
	}
	/* bar: */
	progress::-webkit-progress-bar {
		background-color: var(--bar-color);
		width: 100%;
	}
	progress {
		background-color: var(--bar-color);
	}

	/* value: */
	progress::-webkit-progress-value {
		background-color: var(--val-color) !important;
	}
	progress::-moz-progress-bar {
		background-color: var(--val-color) !important;
	}
	progress {
		color: var(--val-color);
	}
</style>
