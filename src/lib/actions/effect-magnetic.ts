import { animate, eases, type JSAnimation } from 'animejs';
import type { Action } from 'svelte/action';

export interface MagneticOptions {
	strength?: number;
	maxDistance?: number;
}

interface Bounds {
	left: number;
	right: number;
	top: number;
	bottom: number;
	width: number;
	height: number;
}

const RESET_DURATION = 260;

export const effectMagnetic: Action<HTMLElement, MagneticOptions | undefined> = (
	node,
	options = {}
) => {
	let strength = options.strength ?? 0.45;
	let maxDistance = options.maxDistance ?? 20;
	let bounds: Bounds | undefined;
	let resetAnimation: JSAnimation | undefined;
	const position = { x: 0, y: 0 };
	const initialTranslate = node.style.translate;

	function render() {
		node.style.translate = `${position.x}px ${position.y}px`;
	}

	function stopTracking() {
		if (!bounds) return;

		bounds = undefined;
		window.removeEventListener('pointermove', track);
		resetAnimation?.pause();

		const animation = animate(position, {
			x: 0,
			y: 0,
			duration: RESET_DURATION,
			ease: eases.inOutCubic,
			onRender: render,
			onComplete: () => {
				if (resetAnimation === animation) resetAnimation = undefined;
			}
		});
		resetAnimation = animation;
	}

	function track(event: PointerEvent) {
		if (!bounds) return;

		const visualBounds = node.getBoundingClientRect();
		const isInsideOrigin =
			event.clientX >= bounds.left &&
			event.clientX <= bounds.right &&
			event.clientY >= bounds.top &&
			event.clientY <= bounds.bottom;
		const isInsideVisual =
			event.clientX >= visualBounds.left &&
			event.clientX <= visualBounds.right &&
			event.clientY >= visualBounds.top &&
			event.clientY <= visualBounds.bottom;

		if (!isInsideOrigin && !isInsideVisual) {
			stopTracking();
			return;
		}

		const offsetX = (event.clientX - (bounds.left + bounds.width / 2)) * strength;
		const offsetY = (event.clientY - (bounds.top + bounds.height / 2)) * strength;
		const distance = Math.hypot(offsetX, offsetY);
		const scale = distance > maxDistance ? maxDistance / distance : 1;

		position.x = offsetX * scale;
		position.y = offsetY * scale;
		render();
	}

	function startTracking(event: PointerEvent) {
		if (event.pointerType === 'touch' || node.matches(':disabled')) return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		resetAnimation?.pause();
		resetAnimation = undefined;

		const rect = node.getBoundingClientRect();
		bounds = {
			left: rect.left - position.x,
			right: rect.right - position.x,
			top: rect.top - position.y,
			bottom: rect.bottom - position.y,
			width: rect.width,
			height: rect.height
		};
		window.addEventListener('pointermove', track);
		track(event);
	}

	node.addEventListener('pointerenter', startTracking);
	node.addEventListener('blur', stopTracking);

	return {
		update(nextOptions = {}) {
			strength = nextOptions.strength ?? 0.45;
			maxDistance = nextOptions.maxDistance ?? 20;
		},
		destroy() {
			resetAnimation?.pause();
			window.removeEventListener('pointermove', track);
			node.removeEventListener('pointerenter', startTracking);
			node.removeEventListener('blur', stopTracking);
			node.style.translate = initialTranslate;
		}
	};
};
