<script lang="ts">
	import type { Snippet } from 'svelte';

	import { effectMorph } from '../../../actions/effect-morph.js';
	import { cn } from '../../../utils/cn.js';
	import { toastVariants, type ToastVariant } from './toast.js';

	const defaultIcons: Record<ToastVariant, string> = {
		neutral: 'i-ph-bell-ringing-fill',
		info: 'i-ph-lightbulb-fill',
		warning: 'i-ph-warning-fill',
		error: 'i-ph-heart-break-fill',
		success: 'i-ph-checks'
	};

	interface Props {
		open?: boolean;
		title: string;
		description?: string;
		variant?: ToastVariant;
		icon?: Snippet;
		action?: Snippet;
		duration?: number;
		placement?: 'fixed' | 'stack';
		onOpenChange?: (open: boolean) => void;
		onExitComplete?: () => void;
	}

	let {
		open = $bindable(false),
		title,
		description,
		variant = 'neutral',
		icon,
		action,
		duration = 4000,
		placement = 'fixed',
		onOpenChange,
		onExitComplete
	}: Props = $props();
	let rendered = $state(open);
	let timer: ReturnType<typeof setTimeout>;

	function close() {
		open = false;
		onOpenChange?.(false);
	}

	function finishMorph(isOpen: boolean) {
		if (isOpen) return;
		rendered = false;
		onExitComplete?.();
	}

	$effect(() => {
		if (open) rendered = true;
	});

	$effect(() => {
		if (!open) return;
		if (duration > 0) timer = setTimeout(close, duration);
		return () => clearTimeout(timer);
	});
</script>

{#if rendered}
	<div
		class={cn(
			'w-[min(22rem,calc(100vw-2.5rem))]',
			placement === 'fixed' ? 'fixed right-5 bottom-5 z-[20000]' : 'relative w-full'
		)}
	>
		<div
			role="status"
			aria-live="polite"
			use:effectMorph={{
				open,
				origin: 'center',
				scale: 0.82,
				duration: 360,
				onComplete: finishMorph
			}}
		>
			<div class={cn(toastVariants({ variant }))}>
				<div class="flex items-start gap-3">
					<div class="mt-0.5 grid size-5 shrink-0 place-items-center" aria-hidden="true">
						{#if icon}
							{@render icon()}
						{:else}
							<span class={`${defaultIcons[variant]} size-5`}></span>
						{/if}
					</div>
					<div class="min-w-0 flex-1">
						<p class="m-0 text-sm font-medium leading-5">{title}</p>
						{#if description}<p class="m-0 mt-0.5 text-xs leading-5 opacity-70">
								{description}
							</p>{/if}
					</div>
					{#if action}<div class="shrink-0">{@render action()}</div>{/if}
					<button
						type="button"
						class="grid size-6 shrink-0 place-items-center opacity-60 transition-opacity duration-200 ease-[cubic-bezier(0.65,0,0.35,1)] hover:opacity-100"
						aria-label="Dismiss notification"
						onclick={close}
					>
						<span class="i-ph-x size-4" aria-hidden="true"></span>
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
