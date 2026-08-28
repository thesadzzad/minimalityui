<script lang="ts">
	import { animate, eases } from 'animejs';
	import { tick, type Snippet } from 'svelte';
	import { effectGooey } from '../../../actions/effect-gooey.js';

	interface Props {
		open?: boolean;
		title: string;
		description?: string;
		action?: Snippet;
		duration?: number;
		onOpenChange?: (open: boolean) => void;
	}

	let {
		open = $bindable(false),
		title,
		description,
		action,
		duration = 4000,
		onOpenChange
	}: Props = $props();
	let toast = $state<HTMLDivElement>();
	let timer: ReturnType<typeof setTimeout>;

	function close() {
		open = false;
		onOpenChange?.(false);
	}

	$effect(() => {
		if (!open) return;
		tick().then(() => {
			if (toast) {
				animate(toast, {
					translateX: [32, 0],
					scale: [0.92, 1],
					opacity: [0, 1],
					duration: 320,
					ease: eases.inOutCubic
				});
			}
		});
		if (duration > 0) timer = setTimeout(close, duration);
		return () => clearTimeout(timer);
	});
</script>

{#if open}
	<div class="fixed bottom-5 right-5 z-50 w-[min(24rem,calc(100vw-2.5rem))]">
		<div bind:this={toast} role="status" aria-live="polite" class="opacity-0">
			<div class="relative rounded-xl border border-secondary-border p-4 shadow-2xl">
				<div
					class="pointer-events-none absolute inset-0"
					use:effectGooey={{ strength: 6, origin: 'bottom right' }}
				>
					<div class="absolute inset-0 rounded-xl bg-secondary-subtle"></div>
					<div class="absolute -left-7 -top-7 size-20 rounded-full bg-primary-subtle"></div>
					<div class="absolute left-8 top-3 size-11 rounded-full bg-primary-subtle"></div>
				</div>
				<div class="relative flex items-start gap-4">
					<div class="min-w-0 flex-1">
						<p class="m-0 text-sm font-semibold">{title}</p>
						{#if description}<p class="mb-0 mt-1 text-xs leading-5 text-secondary">
								{description}
							</p>{/if}
					</div>
					{#if action}<div class="shrink-0">{@render action()}</div>{/if}
					<button
						type="button"
						class="grid size-7 shrink-0 place-items-center rounded-full text-secondary hover:bg-secondary-subtle-hover hover:text-foreground"
						aria-label="Dismiss notification"
						onclick={close}>×</button
					>
				</div>
			</div>
		</div>
	</div>
{/if}
