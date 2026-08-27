import type { Action } from 'svelte/action';

const EASING = 'cubic-bezier(0.65, 0, 0.35, 1)';

export const effectRipple: Action<HTMLElement> = (node) => {
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
			transform: 'scale(0)',
			transformOrigin: 'center',
			opacity: '0.18'
		});

		node.append(ripple);

		const animation = ripple.animate(
			[
				{ transform: 'scale(0)', opacity: 0.18 },
				{ transform: 'scale(1)', opacity: 0 }
			],
			{ duration: 500, easing: EASING, fill: 'forwards' }
		);

		animation.finished.then(() => ripple.remove()).catch(() => ripple.remove());
	}

	node.addEventListener('pointerdown', createRipple);

	return {
		destroy() {
			node.removeEventListener('pointerdown', createRipple);
			node.querySelectorAll(':scope > [data-ripple]').forEach((ripple) => ripple.remove());
			node.style.position = initialPosition;
			node.style.overflow = initialOverflow;
		}
	};
};
