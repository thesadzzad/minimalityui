<script lang="ts">
	import type { Snippet } from 'svelte';
	import Popover from '../popover/popover.svelte';

	interface Props {
		text: string;
		trigger: Snippet<[Record<string, unknown>]>;
		placement?: 'top' | 'bottom';
		delay?: number;
	}

	let { text, trigger: renderTrigger, placement = 'top', delay = 180 }: Props = $props();
	const uid = $props.id();
	const id = `tooltip-${uid}`;
</script>

<Popover
	triggerMode="hover"
	hoverOpenDelay={delay}
	contentRole="tooltip"
	contentWidth="fit"
	contentPadding="none"
	contentId={id}
	side={placement}
	sideOffset={8}
	panelRadius={8}
	gooStrength={5}
>
	{#snippet trigger(toggle, open, props)}
		{@render renderTrigger({
			...props,
			'data-state': open ? 'open' : 'closed',
			'data-tooltip-trigger': Boolean(toggle)
		})}
	{/snippet}

	<span class="block whitespace-nowrap px-3 py-1.5 text-xs font-medium">{text}</span>
</Popover>
