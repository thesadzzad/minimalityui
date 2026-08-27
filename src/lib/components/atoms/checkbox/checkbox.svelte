<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '../../../utils/cn.js';
	import {
		checkboxIconVariants,
		checkboxVariants,
		type CheckboxSize,
		type CheckboxState
	} from './checkbox.js';

	type Props = Omit<HTMLInputAttributes, 'checked' | 'children' | 'size' | 'type'> & {
		state?: CheckboxState;
		children?: Snippet;
		size?: CheckboxSize;
		onStateChange?: (state: CheckboxState) => void;
	};

	let {
		state = $bindable('unchecked'),
		children,
		size = 'md',
		onStateChange,
		class: className,
		disabled = false,
		onchange,
		...restProps
	}: Props = $props();

	let input: HTMLInputElement;
	type InputChangeEvent = Parameters<NonNullable<HTMLInputAttributes['onchange']>>[0];

	$effect(() => {
		input.indeterminate = state === 'indeterminate';
	});

	function handleChange(event: InputChangeEvent) {
		state = event.currentTarget.checked ? 'checked' : 'unchecked';
		onStateChange?.(state);
		onchange?.(event);
	}
</script>

<label
	class={cn(
		'group inline-flex w-fit items-center gap-3 text-sm font-medium select-none',
		disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
		className
	)}
>
	<input
		bind:this={input}
		type="checkbox"
		checked={state === 'checked'}
		aria-checked={state === 'indeterminate' ? 'mixed' : state === 'checked'}
		{disabled}
		class="peer sr-only"
		onchange={handleChange}
		{...restProps}
	/>
	<span
		aria-hidden="true"
		class={cn(
			checkboxVariants({ size, state }),
			'peer-focus-visible:ring-2 peer-focus-visible:ring-foreground/40 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background'
		)}
	>
		<svg
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class={checkboxIconVariants({ size, state })}
		>
			<path
				d="m3 8 3 3 7-7"
				pathLength="1"
				class="transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]"
				style:stroke-dasharray="1"
				style:stroke-dashoffset={state === 'checked' ? 0 : 1}
				style:opacity={state === 'checked' ? 1 : 0}
			/>
			<path
				d="M4 8h8"
				pathLength="1"
				class="transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]"
				style:stroke-dasharray="1"
				style:stroke-dashoffset={state === 'indeterminate' ? 0 : 1}
				style:opacity={state === 'indeterminate' ? 1 : 0}
			/>
		</svg>
	</span>
	{#if children}
		<span>{@render children()}</span>
	{/if}
</label>
