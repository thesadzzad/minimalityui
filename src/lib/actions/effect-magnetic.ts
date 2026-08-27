import type { Action } from 'svelte/action';
import { cubicInOut } from 'svelte/easing';

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

const MOVE_FACTOR = cubicInOut(0.42);
const RESET_FACTOR = cubicInOut(0.3);
const REST_THRESHOLD = 0.02;

export const effectMagnetic: Action<HTMLElement, MagneticOptions | undefined> = (
	node,
	options = {}
) => {
	let strength = options.strength ?? 0.45;
	let maxDistance = options.maxDistance ?? 20;
	let bounds: Bounds | undefined;
	let frame: number | undefined;
	let currentX = 0;
	let currentY = 0;
	let targetX = 0;
	let targetY = 0;
	let tracking = false;
	const initialTranslate = node.style.translate;
	const initialTransition = node.style.transition;

	node.style.transition = 'none';

	function render() {
		const factor = tracking ? MOVE_FACTOR : RESET_FACTOR;
		currentX += (targetX - currentX) * factor;
		currentY += (targetY - currentY) * factor;

		const atRest =
			Math.abs(targetX - currentX) < REST_THRESHOLD &&
			Math.abs(targetY - currentY) < REST_THRESHOLD;

		if (atRest) {
			currentX = targetX;
			currentY = targetY;
		}

		node.style.translate = `${currentX}px ${currentY}px`;
		frame = atRest ? undefined : requestAnimationFrame(render);
	}

	function requestRender() {
		if (frame === undefined) frame = requestAnimationFrame(render);
	}

	function stopTracking() {
		tracking = false;
		bounds = undefined;
		targetX = 0;
		targetY = 0;
		window.removeEventListener('pointermove', track);
		requestRender();
	}

	function track(event: PointerEvent) {
		if (!bounds) return;

		const isInside =
			event.clientX >= bounds.left &&
			event.clientX <= bounds.right &&
			event.clientY >= bounds.top &&
			event.clientY <= bounds.bottom;

		if (!isInside) {
			stopTracking();
			return;
		}

		const offsetX = (event.clientX - (bounds.left + bounds.width / 2)) * strength;
		const offsetY = (event.clientY - (bounds.top + bounds.height / 2)) * strength;
		const distance = Math.hypot(offsetX, offsetY);
		const scale = distance > maxDistance ? maxDistance / distance : 1;

		targetX = offsetX * scale;
		targetY = offsetY * scale;
		requestRender();
	}

	function startTracking(event: PointerEvent) {
		if (event.pointerType === 'touch' || node.matches(':disabled')) return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const rect = node.getBoundingClientRect();
		bounds = {
			left: rect.left - currentX,
			right: rect.right - currentX,
			top: rect.top - currentY,
			bottom: rect.bottom - currentY,
			width: rect.width,
			height: rect.height
		};
		tracking = true;
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
			if (frame !== undefined) cancelAnimationFrame(frame);
			window.removeEventListener('pointermove', track);
			node.removeEventListener('pointerenter', startTracking);
			node.removeEventListener('blur', stopTracking);
			node.style.translate = initialTranslate;
			node.style.transition = initialTransition;
		}
	};
};
