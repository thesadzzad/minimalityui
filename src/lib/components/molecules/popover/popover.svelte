<script lang="ts">
	import { animate, eases, type JSAnimation } from 'animejs';
	import { tick, type Snippet } from 'svelte';
	import type { Action } from 'svelte/action';
	import { effectGooey } from '../../../actions/effect-gooey.js';

	type Side = 'top' | 'bottom';
	type Align = 'start' | 'center' | 'end';
	type TriggerMode = 'click' | 'hover';

	interface Rect {
		x: number;
		y: number;
		width: number;
		height: number;
		radius: number;
	}

	interface Props {
		open?: boolean;
		trigger: Snippet<[() => void, boolean, Record<string, unknown>]>;
		children: Snippet;
		side?: Side;
		align?: Align;
		sideOffset?: number;
		panelRadius?: number;
		gooStrength?: number;
		triggerMode?: TriggerMode;
		hoverOpenDelay?: number;
		contentRole?: 'dialog' | 'tooltip';
		contentWidth?: 'md' | 'fit';
		contentPadding?: 'default' | 'none';
		contentId?: string;
		onOpenChange?: (open: boolean) => void;
	}

	let {
		open = $bindable(false),
		trigger,
		children,
		side = 'bottom',
		align = 'center',
		sideOffset = 12,
		panelRadius = 14,
		gooStrength = 6,
		triggerMode = 'click',
		hoverOpenDelay = 0,
		contentRole = 'dialog',
		contentWidth = 'md',
		contentPadding = 'default',
		contentId: providedContentId,
		onOpenChange
	}: Props = $props();

	const uid = $props.id();
	const contentId = $derived(providedContentId ?? `popover-${uid}`);
	let root = $state<HTMLDivElement>();
	let panel = $state<HTMLDivElement>();
	let blob = $state<HTMLDivElement>();
	let content = $state<HTMLDivElement>();
	let rendered = $state(false);
	let positioned = $state(false);
	let anchorLeft = $state(0);
	let anchorTop = $state(0);
	let layerLeft = $state(0);
	let layerTop = $state(0);
	let layerWidth = $state(0);
	let layerHeight = $state(0);
	let triggerRect = $state<Rect>();
	let panelRect = $state<Rect>();
	let progress = 0;
	let animation: JSAnimation | undefined;
	let openTimer: ReturnType<typeof setTimeout> | undefined;
	let closeTimer: ReturnType<typeof setTimeout> | undefined;
	let previousOpen = false;

	const portal: Action<HTMLElement> = (node) => {
		const theme = root?.closest<HTMLElement>('[data-theme]')?.dataset.theme;
		if (theme) node.dataset.theme = theme;
		document.body.append(node);
		return { destroy: () => node.remove() };
	};

	const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;

	function clearTimers() {
		if (openTimer) clearTimeout(openTimer);
		if (closeTimer) clearTimeout(closeTimer);
		openTimer = undefined;
		closeTimer = undefined;
	}

	function setOpen(next: boolean) {
		if (open === next) return;
		open = next;
		onOpenChange?.(next);
	}

	function toggle() {
		setOpen(!open);
	}

	function pointerEnter() {
		if (triggerMode !== 'hover') return;
		if (closeTimer) clearTimeout(closeTimer);
		openTimer = setTimeout(() => setOpen(true), hoverOpenDelay);
	}

	function pointerLeave() {
		if (triggerMode !== 'hover') return;
		if (openTimer) clearTimeout(openTimer);
		closeTimer = setTimeout(() => setOpen(false), 100);
	}

	function focusTrigger() {
		if (triggerMode !== 'hover') return;
		clearTimers();
		setOpen(true);
	}

	function blurTrigger() {
		if (triggerMode !== 'hover') return;
		pointerLeave();
	}

	function getTriggerProps(): Record<string, unknown> {
		if (triggerMode === 'hover') {
			return {
				onpointerenter: pointerEnter,
				onpointerleave: pointerLeave,
				onfocus: focusTrigger,
				onblur: blurTrigger,
				'aria-describedby': contentRole === 'tooltip' ? contentId : undefined,
				'data-state': open ? 'open' : 'closed'
			};
		}

		return {
			'aria-haspopup': contentRole === 'dialog' ? 'dialog' : undefined,
			'aria-controls': contentId,
			'aria-expanded': open,
			'data-state': open ? 'open' : 'closed'
		};
	}

	function measure() {
		if (!root || !panel) return false;
		const anchor = root.getBoundingClientRect();
		const panelWidth = panel.offsetWidth;
		const panelHeight = panel.offsetHeight;
		if (!anchor.width || !anchor.height || !panelWidth || !panelHeight) return false;

		const x =
			align === 'start'
				? 0
				: align === 'end'
					? anchor.width - panelWidth
					: (anchor.width - panelWidth) / 2;
		const y = side === 'bottom' ? anchor.height + sideOffset : -(panelHeight + sideOffset);

		anchorLeft = anchor.left;
		anchorTop = anchor.top;
		triggerRect = {
			x: 2,
			y: 2,
			width: Math.max(0, anchor.width - 4),
			height: Math.max(0, anchor.height - 4),
			radius: Math.min(anchor.height / 2, panelRadius)
		};
		panelRect = { x, y, width: panelWidth, height: panelHeight, radius: panelRadius };
		layerLeft = Math.min(0, x) - gooStrength * 3;
		layerTop = Math.min(0, y) - gooStrength * 3;
		layerWidth = Math.max(anchor.width, x + panelWidth) - Math.min(0, x) + gooStrength * 6;
		layerHeight = Math.max(anchor.height, y + panelHeight) - Math.min(0, y) + gooStrength * 6;
		positioned = true;
		render(progress);
		return true;
	}

	function render(amount: number) {
		if (!triggerRect || !panelRect || !blob || !content) return;
		const x = lerp(triggerRect.x, panelRect.x, amount);
		const y = lerp(triggerRect.y, panelRect.y, amount);
		const width = lerp(triggerRect.width, panelRect.width, amount);
		const height = lerp(triggerRect.height, panelRect.height, amount);
		const radius = lerp(triggerRect.radius, panelRect.radius, amount);
		const reveal = Math.max(0, Math.min(1, (amount - 0.35) / 0.65));

		Object.assign(blob.style, {
			transform: `translate3d(${x - layerLeft}px, ${y - layerTop}px, 0)`,
			width: `${width}px`,
			height: `${height}px`,
			borderRadius: `${radius}px`
		});
		Object.assign(content.style, {
			opacity: String(reveal),
			transform: `translate3d(${panelRect.x}px, ${panelRect.y}px, 0) scale(${0.94 + reveal * 0.06})`,
			pointerEvents: open && reveal > 0.95 ? 'auto' : 'none'
		});
	}

	function run(to: 0 | 1) {
		animation?.revert();
		const state = { value: progress };
		const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		animation = animate(state, {
			value: to,
			duration: reduced ? 0 : to ? 360 : 240,
			ease: eases.inOutCubic,
			onUpdate: () => {
				progress = state.value;
				render(progress);
			},
			onComplete: () => {
				progress = to;
				render(progress);
				if (!to) {
					rendered = false;
					positioned = false;
				}
			}
		});
	}

	function handleKeydown(event: KeyboardEvent) {
		if (open && event.key === 'Escape') setOpen(false);
	}

	$effect(() => {
		if (open === previousOpen) return;
		previousOpen = open;
		if (open) {
			rendered = true;
			tick().then(() => {
				if (measure()) run(1);
			});
		} else if (rendered) {
			run(0);
		}
	});

	$effect(() => {
		if (!rendered) return;
		const reposition = () => measure();
		const dismiss = (event: PointerEvent) => {
			const target = event.target as Node;
			if (!root?.contains(target) && !panel?.contains(target)) setOpen(false);
		};
		window.addEventListener('resize', reposition);
		window.addEventListener('scroll', reposition, true);
		document.addEventListener('pointerdown', dismiss);
		return () => {
			window.removeEventListener('resize', reposition);
			window.removeEventListener('scroll', reposition, true);
			document.removeEventListener('pointerdown', dismiss);
		};
	});

	$effect(() => () => {
		clearTimers();
		animation?.revert();
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<div bind:this={root} class="relative z-[10000] inline-flex isolate">
	{@render trigger(toggle, open, getTriggerProps())}
</div>

{#if rendered}
	<div
		use:portal
		class="pointer-events-none fixed left-0 top-0 z-[9999] size-0 isolate"
		style:visibility={positioned ? 'visible' : 'hidden'}
		style:transform={`translate3d(${anchorLeft}px, ${anchorTop}px, 0)`}
	>
		<div
			class="pointer-events-none absolute"
			style:transform={`translate3d(${layerLeft}px, ${layerTop}px, 0)`}
			style:width={`${layerWidth}px`}
			style:height={`${layerHeight}px`}
			use:effectGooey={{ strength: gooStrength, threshold: 9, animate: false }}
		>
			{#if triggerRect}
				<div
					class="absolute bg-popover"
					style:transform={`translate3d(${triggerRect.x - layerLeft}px, ${triggerRect.y - layerTop}px, 0)`}
					style:width={`${triggerRect.width}px`}
					style:height={`${triggerRect.height}px`}
					style:border-radius={`${triggerRect.radius}px`}
				></div>
			{/if}
			<div bind:this={blob} class="absolute left-0 top-0 bg-popover"></div>
		</div>

		<div
			bind:this={content}
			class="pointer-events-none absolute left-0 top-0 opacity-0"
			style:transform-origin={`${align === 'start' ? 'left' : align === 'end' ? 'right' : 'center'} ${side === 'bottom' ? 'top' : 'bottom'}`}
		>
			<div
				bind:this={panel}
				id={contentId}
				role={contentRole}
				class={`text-sm leading-6 text-popover-foreground outline-none ${contentPadding === 'default' ? 'p-4' : ''} ${contentWidth === 'fit' ? 'w-max max-w-[min(92vw,20rem)]' : 'w-72'}`}
				onpointerenter={pointerEnter}
				onpointerleave={pointerLeave}
			>
				{@render children()}
			</div>
		</div>
	</div>
{/if}
