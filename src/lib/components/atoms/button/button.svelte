<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import {
		buttonVariants,
		type ButtonContent,
		type ButtonRadius,
		type ButtonSize,
		type ButtonVariant
	} from './button.js';
	import { effectRipple } from '../../../actions/effect-ripple.js';
	import { cn } from '../../../utils/cn.js';

	interface Props extends HTMLButtonAttributes {
		children?: Snippet;
		icon?: Snippet;
		variant?: ButtonVariant;
		size?: ButtonSize;
		radius?: ButtonRadius;
		content?: ButtonContent;
		block?: boolean;
	}

	let {
		children,
		icon,
		variant = 'primary',
		size = 'md',
		radius = 'pill',
		content = 'text',
		block = false,
		class: className,
		type = 'button',
		...restProps
	}: Props = $props();
</script>

<button
	use:effectRipple
	{type}
	class={cn(buttonVariants({ variant, size, radius, content, block }), className)}
	{...restProps}
>
	{#if content !== 'text' && icon}
		<span class="flex shrink-0 items-center justify-center" aria-hidden="true">
			{@render icon()}
		</span>
	{/if}

	{#if content !== 'icon'}
		{@render children?.()}
	{/if}
</button>
