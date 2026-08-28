import { animate, eases, type JSAnimation } from 'animejs';
import type { Action } from 'svelte/action';

export interface MorphOptions {
	open?: boolean;
	origin?: string;
	duration?: number;
	scale?: number;
	fade?: boolean;
	onComplete?: (open: boolean) => void;
}

export const effectMorph: Action<HTMLElement, MorphOptions | undefined> = (node, options = {}) => {
	let animation: JSAnimation | undefined;
	let initialized = false;
	let runId = 0;
	const initialOrigin = node.style.transformOrigin;
	const initialClipPath = node.style.clipPath;
	const initialOpacity = node.style.opacity;
	const initialTransform = node.style.transform;

	function run(next: MorphOptions = {}) {
		const id = ++runId;
		const open = next.open ?? true;
		const scale = next.scale ?? 0.72;
		const fade = next.fade !== false;
		animation?.pause();
		node.style.transformOrigin = next.origin ?? 'center';

		if (!initialized) {
			initialized = true;
			node.style.clipPath = open ? 'inset(50% round 999px)' : 'inset(0% round 0px)';
			node.style.opacity = open && fade ? '0' : '1';
			node.style.transform = `scale(${open ? scale : 1})`;
		}

		if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
			node.style.clipPath = open ? 'inset(0% round 0px)' : 'inset(50% round 999px)';
			node.style.opacity = open || !fade ? '1' : '0';
			node.style.transform = `scale(${open ? 1 : scale})`;
			next.onComplete?.(open);
			return;
		}

		animation = animate(node, {
			clipPath: open ? 'inset(0% round 0px)' : 'inset(50% round 999px)',
			scale: open ? 1 : scale,
			opacity: open || !fade ? 1 : 0,
			duration: next.duration ?? 360,
			ease: eases.inOutCubic,
			onComplete: () => {
				if (id === runId) next.onComplete?.(open);
			}
		});
	}

	run(options);

	return {
		update: run,
		destroy() {
			runId += 1;
			animation?.pause();
			node.style.transformOrigin = initialOrigin;
			node.style.clipPath = initialClipPath;
			node.style.opacity = initialOpacity;
			node.style.transform = initialTransform;
		}
	};
};
