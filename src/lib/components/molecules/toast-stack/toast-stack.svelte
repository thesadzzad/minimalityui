<script lang="ts">
	import { animate, eases, type JSAnimation } from 'animejs';
	import type { Action } from 'svelte/action';
	import { SvelteSet } from 'svelte/reactivity';
	import Toast from '../toast/toast.svelte';
	import type { ToastItem } from './toast-stack.js';

	interface Props {
		items?: ToastItem[];
		onDismiss?: (id: ToastItem['id']) => void;
	}

	interface StackEntry {
		item: ToastItem;
		open: boolean;
		notified: boolean;
	}

	interface StackPosition {
		depth: number;
		zIndex: number;
	}

	let { items = [], onDismiss }: Props = $props();
	let entries = $state<StackEntry[]>([]);
	const dismissed = new SvelteSet<ToastItem['id']>();

	const stackPosition: Action<HTMLDivElement, StackPosition> = (node, position) => {
		let animation: JSAnimation | undefined;
		let initialized = false;
		const initialTransform = node.style.transform;
		const initialOpacity = node.style.opacity;
		const initialZIndex = node.style.zIndex;

		function apply(next: StackPosition) {
			const depth = Math.min(next.depth, 4);
			const translateY = depth * -10;
			const scale = 1 - depth * 0.035;
			const opacity = 1 - depth * 0.12;
			node.style.zIndex = String(next.zIndex);

			if (!initialized || matchMedia('(prefers-reduced-motion: reduce)').matches) {
				initialized = true;
				node.style.transform = `translateY(${translateY}px) scale(${scale})`;
				node.style.opacity = String(opacity);
				return;
			}

			animation?.pause();
			animation = animate(node, {
				translateY,
				scale,
				opacity,
				duration: 320,
				ease: eases.inOutCubic
			});
		}

		apply(position);
		return {
			update: apply,
			destroy() {
				animation?.pause();
				node.style.transform = initialTransform;
				node.style.opacity = initialOpacity;
				node.style.zIndex = initialZIndex;
			}
		};
	};

	function dismiss(entry: StackEntry) {
		entry.open = false;
		if (entry.notified) return;
		entry.notified = true;
		dismissed.add(entry.item.id);
		onDismiss?.(entry.item.id);
	}

	function remove(entry: StackEntry) {
		entries = entries.filter((candidate) => candidate !== entry);
	}

	$effect(() => {
		const ids = new Set(items.map((item) => item.id));
		for (const id of dismissed) {
			if (!ids.has(id)) dismissed.delete(id);
		}

		for (const entry of entries) {
			const item = items.find((candidate) => candidate.id === entry.item.id);
			if (item) entry.item = item;
			else entry.open = false;
		}

		const additions = items
			.filter(
				(item) => !dismissed.has(item.id) && !entries.some((entry) => entry.item.id === item.id)
			)
			.map((item) => ({ item, open: true, notified: false }));
		if (additions.length) entries = [...entries, ...additions];
	});
</script>

<div
	class="pointer-events-none fixed right-5 bottom-5 z-[20000] h-24 w-[min(22rem,calc(100vw-2.5rem))]"
	aria-label="Notifications"
>
	{#each entries as entry, index (entry.item.id)}
		{@const depth = entries.length - index - 1}
		<div
			class={`absolute inset-x-0 bottom-0 origin-bottom ${depth === 0 ? 'pointer-events-auto' : 'pointer-events-none'}`}
			use:stackPosition={{ depth, zIndex: index + 1 }}
		>
			<Toast
				open={entry.open}
				title={entry.item.title}
				description={entry.item.description}
				variant={entry.item.variant}
				icon={entry.item.icon}
				action={entry.item.action}
				duration={entry.item.duration}
				placement="stack"
				onOpenChange={(open) => !open && dismiss(entry)}
				onExitComplete={() => remove(entry)}
			/>
		</div>
	{/each}
</div>
