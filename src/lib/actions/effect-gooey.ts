import { animate, eases, stagger, type JSAnimation } from 'animejs';
import type { Action } from 'svelte/action';

export interface GooeyOptions {
	strength?: number;
	threshold?: number;
	duration?: number;
	origin?: string;
	stagger?: number;
	animate?: boolean;
}

let gooeyId = 0;

export const effectGooey: Action<HTMLElement, GooeyOptions | undefined> = (node, options = {}) => {
	const namespace = 'http://www.w3.org/2000/svg';
	const id = `minimality-gooey-${++gooeyId}`;
	const previousFilter = node.style.filter;
	const previousOrigin = node.style.transformOrigin;
	let animation: JSAnimation | undefined;
	let shapeAnimation: JSAnimation | undefined;
	const svg = document.createElementNS(namespace, 'svg');
	const defs = document.createElementNS(namespace, 'defs');
	const filter = document.createElementNS(namespace, 'filter');
	const blur = document.createElementNS(namespace, 'feGaussianBlur');
	const matrix = document.createElementNS(namespace, 'feColorMatrix');
	const composite = document.createElementNS(namespace, 'feComposite');

	Object.assign(svg.style, {
		position: 'absolute',
		width: '0',
		height: '0',
		pointerEvents: 'none'
	});
	svg.setAttribute('aria-hidden', 'true');
	filter.setAttribute('id', id);
	filter.setAttribute('x', '-40%');
	filter.setAttribute('y', '-40%');
	filter.setAttribute('width', '180%');
	filter.setAttribute('height', '180%');
	filter.setAttribute('color-interpolation-filters', 'sRGB');
	blur.setAttribute('in', 'SourceGraphic');
	blur.setAttribute('result', 'blur');
	matrix.setAttribute('in', 'blur');
	matrix.setAttribute('mode', 'matrix');
	matrix.setAttribute('result', 'goo');
	composite.setAttribute('in', 'SourceGraphic');
	composite.setAttribute('in2', 'goo');
	composite.setAttribute('operator', 'atop');
	filter.append(blur, matrix, composite);
	defs.append(filter);
	svg.append(defs);
	document.body.append(svg);
	node.style.filter = `url(#${id})`;

	function apply(next: GooeyOptions = {}) {
		const threshold = next.threshold ?? 9;
		node.style.transformOrigin = next.origin ?? 'center';
		blur.setAttribute('stdDeviation', String(next.strength ?? 7));
		matrix.setAttribute('values', `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -${threshold}`);
	}

	apply(options);
	if (options.animate !== false && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
		animation = animate(node, {
			scale: [0.72, 1],
			opacity: [0, 1],
			duration: options.duration ?? 320,
			ease: eases.inOutCubic
		});
		shapeAnimation = animate(node.children, {
			scale: [0, 1],
			delay: stagger(options.stagger ?? 35),
			duration: options.duration ?? 320,
			ease: eases.inOutCubic
		});
	}

	return {
		update: apply,
		destroy() {
			animation?.revert();
			shapeAnimation?.revert();
			node.style.filter = previousFilter;
			node.style.transformOrigin = previousOrigin;
			svg.remove();
		}
	};
};
