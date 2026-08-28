<script lang="ts">
	import { animate, eases } from 'animejs';
	import { tick, type Snippet } from 'svelte';
	import { effectGooey } from '../../../actions/effect-gooey.js';

	interface Props {
		open?: boolean;
		title: string;
		children: Snippet;
		footer?: Snippet;
		closeOnBackdrop?: boolean;
		onOpenChange?: (open: boolean) => void;
	}

	let {
		open = $bindable(false),
		title,
		children,
		footer,
		closeOnBackdrop = true,
		onOpenChange
	}: Props = $props();
	let panel = $state<HTMLDivElement>();
	const uid = $props.id();
	const titleId = `modal-title-${uid}`;

	function close() {
		open = false;
		onOpenChange?.(false);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (open && event.key === 'Escape') close();
	}

	$effect(() => {
		if (!open) return;
		document.body.style.overflow = 'hidden';
		tick().then(() => {
			if (!panel) return;
			animate(panel, { scale: [0.88, 1], opacity: [0, 1], duration: 320, ease: eases.inOutCubic });
			panel
				.querySelector<HTMLElement>(
					'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
				)
				?.focus();
		});
		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<div
		class="fixed inset-0 z-50 grid place-items-center bg-background/75 p-4 backdrop-blur-sm"
		role="presentation"
		onclick={(event) => event.target === event.currentTarget && closeOnBackdrop && close()}
	>
		<div
			bind:this={panel}
			role="dialog"
			aria-modal="true"
			aria-labelledby={titleId}
			class="w-full max-w-lg opacity-0"
		>
			<div class="relative rounded-2xl border border-secondary-border p-6 shadow-2xl">
				<div
					class="pointer-events-none absolute inset-0"
					use:effectGooey={{ origin: 'center', duration: 380 }}
				>
					<div class="absolute inset-0 rounded-2xl bg-secondary-subtle"></div>
					<div class="absolute -right-8 -top-8 size-24 rounded-full bg-primary-subtle"></div>
					<div class="absolute right-10 top-5 size-14 rounded-full bg-primary-subtle"></div>
					<div class="absolute -bottom-10 -left-6 size-28 rounded-full bg-secondary-subtle"></div>
					<div class="absolute bottom-5 left-12 size-12 rounded-full bg-secondary-subtle"></div>
				</div>
				<div class="relative">
					<div class="flex items-start justify-between gap-6">
						<h2 id={titleId} class="m-0 text-xl font-semibold">{title}</h2>
						<button
							type="button"
							class="grid size-8 place-items-center rounded-full text-secondary transition-colors duration-200 ease-[cubic-bezier(0.65,0,0.35,1)] hover:bg-secondary-subtle-hover hover:text-foreground"
							aria-label="Close modal"
							onclick={close}>×</button
						>
					</div>
					<div class="mt-5 text-sm leading-6 text-secondary">{@render children()}</div>
					{#if footer}<div class="mt-6 flex justify-end gap-3">{@render footer()}</div>{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
