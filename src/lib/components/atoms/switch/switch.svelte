<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { cn } from '../../../utils/cn.js';
	import { switchThumbVariants, switchVariants, type SwitchSize } from './switch.js';

	interface Props extends HTMLButtonAttributes {
		checked?: boolean;
		size?: SwitchSize;
		onCheckedChange?: (checked: boolean) => void;
	}

	let {
		checked = $bindable(false),
		size = 'md',
		onCheckedChange,
		class: className,
		disabled = false,
		onclick,
		type = 'button',
		...restProps
	}: Props = $props();

	type ButtonClickEvent = Parameters<NonNullable<HTMLButtonAttributes['onclick']>>[0];

	function handleClick(event: ButtonClickEvent) {
		checked = !checked;
		onCheckedChange?.(checked);
		onclick?.(event);
	}
</script>

<button
	{type}
	role="switch"
	aria-checked={checked}
	{disabled}
	class={cn(switchVariants({ size, checked }), className)}
	onclick={handleClick}
	{...restProps}
>
	<span class={switchThumbVariants({ size, checked })}></span>
</button>
