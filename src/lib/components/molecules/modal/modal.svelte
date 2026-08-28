<script lang="ts">
	import { tick, type Snippet } from 'svelte';

	import { effectMorph } from '../../../actions/effect-morph.js';

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
	let rendered = $state(open);
	let backdropVisible = $state(false);
	const uid = $props.id();
	const titleId = `modal-title-${uid}`;

	function close() {
		open = false;
		onOpenChange?.(false);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (open && event.key === 'Escape') close();
	}

	function finishMorph(isOpen: boolean) {
		if (!isOpen) rendered = false;
	}

	$effect(() => {
		if (open) {
			rendered = true;
			tick().then(() => {
				if (open) backdropVisible = true;
			});
		} else {
			backdropVisible = false;
		}
	});

	$effect(() => {
		if (!open) return;
		const previousOverflow = document.body.style.overflow;
		const previousFocus =
			document.activeElement instanceof HTMLElement ? document.activeElement : null;
		document.body.style.overflow = 'hidden';
		tick().then(() => {
			if (!panel) return;
			panel
				.querySelector<HTMLElement>(
					'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
				)
				?.focus();
		});
		return () => {
			document.body.style.overflow = previousOverflow;
			previousFocus?.focus();
		};
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if rendered}
	<div
		class="fixed inset-0 z-[20000] grid place-items-center bg-background/75 p-4 transition-[opacity,backdrop-filter] duration-[380ms] ease-[cubic-bezier(0.65,0,0.35,1)] {backdropVisible
			? 'opacity-100 backdrop-blur-sm'
			: 'opacity-0 backdrop-blur-0'}"
		role="presentation"
		onclick={(event) => event.target === event.currentTarget && closeOnBackdrop && close()}
	>
		<div
			bind:this={panel}
			role="dialog"
			aria-modal="true"
			aria-labelledby={titleId}
			class="w-full max-w-lg"
			use:effectMorph={{
				open,
				origin: 'center',
				scale: 0.82,
				duration: 380,
				onComplete: finishMorph
			}}
		>
			<div class="relative rounded-2xl bg-popover p-6 text-popover-foreground shadow-2xl">
				<div class="relative">
					<div class="flex items-start justify-between gap-6">
						<h2 id={titleId} class="m-0 text-xl font-semibold">{title}</h2>
						<button
							type="button"
							class="grid size-8 place-items-center rounded-full text-secondary transition-colors duration-200 ease-[cubic-bezier(0.65,0,0.35,1)] hover:bg-secondary-subtle-hover hover:text-foreground"
							aria-label="Close modal"
							onclick={close}
						>
							<span class="i-ph-x size-4" aria-hidden="true"></span>
						</button>
					</div>
					<div class="mt-5 text-sm leading-6 text-secondary">{@render children()}</div>
					{#if footer}<div class="mt-6 flex justify-end gap-3">{@render footer()}</div>{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
