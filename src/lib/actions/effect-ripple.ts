import { animate, eases, type JSAnimation } from 'animejs';
import type { Action } from 'svelte/action';

export const effectRipple: Action<HTMLElement> = (node) => {
	const animations = new Set<JSAnimation>();
	const initialPosition = node.style.position;
	const initialOverflow = node.style.overflow;
	const computedStyle = getComputedStyle(node);

	if (computedStyle.position === 'static') node.style.position = 'relative';
	node.style.overflow = 'hidden';

	function createRipple(event: PointerEvent) {
		if (event.button !== 0 || node.matches(':disabled')) return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const bounds = node.getBoundingClientRect();
		const x = event.clientX - bounds.left;
		const y = event.clientY - bounds.top;
		const radius = Math.max(
			Math.hypot(x, y),
			Math.hypot(bounds.width - x, y),
			Math.hypot(x, bounds.height - y),
			Math.hypot(bounds.width - x, bounds.height - y)
		);
		const diameter = radius * 2;
		const ripple = document.createElement('span');
		ripple.dataset.ripple = '';

		Object.assign(ripple.style, {
			position: 'absolute',
			left: `${x - radius}px`,
			top: `${y - radius}px`,
			width: `${diameter}px`,
			height: `${diameter}px`,
			borderRadius: '50%',
			background: 'currentColor',
			pointerEvents: 'none',
			transformOrigin: 'center'
		});

		node.append(ripple);

		const animation = animate(ripple, {
			scale: [0, 1],
			opacity: [0.18, 0],
			duration: 500,
			ease: eases.inOutCubic,
			onComplete: () => {
				animations.delete(animation);
				ripple.remove();
			}
		});
		animations.add(animation);
	}

	node.addEventListener('pointerdown', createRipple);

	return {
		destroy() {
			node.removeEventListener('pointerdown', createRipple);
			animations.forEach((animation) => animation.revert());
			animations.clear();
			node.querySelectorAll(':scope > [data-ripple]').forEach((ripple) => ripple.remove());
			node.style.position = initialPosition;
			node.style.overflow = initialOverflow;
		}
	};
};
