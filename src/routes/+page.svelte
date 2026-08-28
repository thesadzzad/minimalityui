<script lang="ts">
	import { effectMagnetic } from '../lib/actions/effect-magnetic.js';
	import { effectRipple } from '../lib/actions/effect-ripple.js';
	import Button from '../lib/components/atoms/button/button.svelte';
	import Checkbox from '../lib/components/atoms/checkbox/checkbox.svelte';
	import type { CheckboxState } from '../lib/components/atoms/checkbox/checkbox.js';
	import Switch from '../lib/components/atoms/switch/switch.svelte';
	import Modal from '../lib/components/molecules/modal/modal.svelte';
	import Popover from '../lib/components/molecules/popover/popover.svelte';
	import ToastStack from '../lib/components/molecules/toast-stack/toast-stack.svelte';
	import type { ToastItem } from '../lib/components/molecules/toast-stack/toast-stack.js';
	import Tooltip from '../lib/components/molecules/tooltip/tooltip.svelte';

	const variants = ['primary', 'secondary', 'destructive'] as const;
	const sizes = ['sm', 'md', 'lg'] as const;
	const radii = ['none', 'sm', 'md', 'lg', 'pill'] as const;
	const switchSizes = ['sm', 'md', 'lg'] as const;
	const checkboxSizes = ['sm', 'md', 'lg'] as const;
	const notificationVariants = ['neutral', 'info', 'warning', 'error', 'success'] as const;

	let notifications = $state(true);
	let sounds = $state(false);
	let termsState: CheckboxState = $state('checked');
	let modalOpen = $state(false);
	let toastItems = $state<ToastItem[]>([]);
	let toastId = 0;

	function showToast(variant: NonNullable<ToastItem['variant']>) {
		toastId += 1;
		toastItems = [
			...toastItems,
			{
				id: toastId,
				variant,
				title: `${variant[0].toUpperCase()}${variant.slice(1)} notification`,
				description: 'This notification dismisses automatically.',
				duration: 4000
			}
		];
	}

	function dismissToast(id: ToastItem['id']) {
		toastItems = toastItems.filter((item) => item.id !== id);
	}
</script>

<svelte:head>
	<title>Button — Minimality UI</title>
	<meta name="description" content="Minimality UI button component showcase." />
</svelte:head>

{#snippet plusIcon()}
	<svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2">
		<path d="M12 5v14M5 12h14" />
	</svg>
{/snippet}

<div data-theme="dark" class="bg-background text-foreground">
	<main class="min-h-screen">
		<div class="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-24">
			<header class="pb-16 sm:pb-24">
				<div class="mb-8 flex items-center gap-3">
					<span class="size-2 rounded-full bg-primary"></span>
					<p class="m-0 text-xs font-medium tracking-widest text-secondary uppercase">
						Minimality UI
					</p>
				</div>
				<div class="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-end">
					<h1 class="m-0 max-w-3xl text-5xl font-semibold tracking-tight sm:text-7xl">Button</h1>
					<p class="m-0 text-sm leading-6 text-secondary">
						A focused action primitive with semantic variants, flexible sizing, radius control, and
						icon support.
					</p>
				</div>
			</header>

			<section class="border-t border-secondary-border py-12 sm:py-16">
				<div class="grid gap-10 lg:grid-cols-[15rem_1fr]">
					<div>
						<p class="m-0 text-xs tracking-widest text-secondary uppercase">01</p>
						<h2 class="mt-3 text-lg font-medium">Variants</h2>
					</div>
					<div class="grid gap-10">
						{#each variants as variant (variant)}
							<div class="grid gap-5 sm:grid-cols-[8rem_1fr] sm:items-center">
								<code class="text-xs text-secondary">{variant}</code>
								<div class="flex flex-wrap items-center gap-3">
									{#each sizes as size (size)}
										<Button {variant} {size}>{size.toUpperCase()} Button</Button>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				</div>
			</section>

			<section class="border-t border-secondary-border py-12 sm:py-16">
				<div class="grid gap-10 lg:grid-cols-[15rem_1fr]">
					<div>
						<p class="m-0 text-xs tracking-widest text-secondary uppercase">02</p>
						<h2 class="mt-3 text-lg font-medium">Radius</h2>
					</div>
					<div class="flex flex-wrap items-center gap-3">
						{#each radii as radius (radius)}
							<Button {radius}>{radius}</Button>
						{/each}
					</div>
				</div>
			</section>

			<section class="border-t border-secondary-border py-12 sm:py-16">
				<div class="grid gap-10 lg:grid-cols-[15rem_1fr]">
					<div>
						<p class="m-0 text-xs tracking-widest text-secondary uppercase">03</p>
						<h2 class="mt-3 text-lg font-medium">Content</h2>
					</div>
					<div class="flex flex-wrap items-center gap-3">
						<Button>Text only</Button>
						<Button content="icon-text" icon={plusIcon}>Icon and text</Button>
						<Button content="icon" icon={plusIcon} aria-label="Add item" />
						<Button variant="secondary" content="icon-text" icon={plusIcon}>Secondary</Button>
						<Button variant="secondary" content="icon" icon={plusIcon} aria-label="Add item" />
					</div>
				</div>
			</section>

			<section class="border-t border-secondary-border py-12 sm:py-16">
				<div class="grid gap-10 lg:grid-cols-[15rem_1fr]">
					<div>
						<p class="m-0 text-xs tracking-widest text-secondary uppercase">04</p>
						<h2 class="mt-3 text-lg font-medium">Block</h2>
					</div>
					<div class="grid gap-3">
						<Button block>Primary block button</Button>
						<Button block variant="secondary">Secondary block button</Button>
					</div>
				</div>
			</section>

			<section class="border-t border-secondary-border py-12 sm:py-16">
				<div class="grid gap-10 lg:grid-cols-[15rem_1fr]">
					<div>
						<p class="m-0 text-xs tracking-widest text-secondary uppercase">05</p>
						<h2 class="mt-3 text-lg font-medium">Magnetic effect</h2>
						<p class="mt-3 text-xs leading-5 text-secondary">Move pointer across buttons.</p>
					</div>
					<div class="flex flex-wrap items-center gap-6 py-4">
						<span class="inline-flex" use:effectMagnetic>
							<Button>Default pull</Button>
						</span>
						<span class="inline-flex" use:effectMagnetic={{ strength: 0.65, maxDistance: 30 }}>
							<Button variant="secondary">Strong pull</Button>
						</span>
					</div>
				</div>
			</section>

			<section class="border-t border-secondary-border py-12 sm:py-16">
				<div class="grid gap-10 lg:grid-cols-[15rem_1fr]">
					<div>
						<p class="m-0 text-xs tracking-widest text-secondary uppercase">06</p>
						<h2 class="mt-3 text-lg font-medium">Ripple effect</h2>
						<p class="mt-3 text-xs leading-5 text-secondary">Press buttons to trigger ripple.</p>
					</div>
					<div class="flex flex-wrap items-center gap-3">
						<span class="inline-flex rounded-full text-primary-foreground" use:effectRipple>
							<Button>Primary ripple</Button>
						</span>
						<span class="inline-flex rounded-full text-secondary-foreground" use:effectRipple>
							<Button variant="secondary">Secondary ripple</Button>
						</span>
					</div>
				</div>
			</section>

			<section class="border-t border-secondary-border py-12 sm:py-16">
				<div class="grid gap-10 lg:grid-cols-[15rem_1fr]">
					<div>
						<p class="m-0 text-xs tracking-widest text-secondary uppercase">07</p>
						<h2 class="mt-3 text-lg font-medium">States</h2>
					</div>
					<div class="flex flex-wrap items-center gap-3">
						<Button>Default</Button>
						<Button disabled>Disabled</Button>
						<Button variant="secondary">Secondary</Button>
						<Button variant="secondary" disabled>Disabled</Button>
						<Button variant="destructive">Delete</Button>
					</div>
				</div>
			</section>

			<section class="border-t border-secondary-border py-12 sm:py-16">
				<div class="grid gap-10 lg:grid-cols-[15rem_1fr]">
					<div>
						<p class="m-0 text-xs tracking-widest text-secondary uppercase">08</p>
						<h2 class="mt-3 text-lg font-medium">Switch</h2>
						<p class="mt-3 text-xs leading-5 text-secondary">
							Accessible toggle control with three sizes.
						</p>
					</div>
					<div class="grid gap-10">
						<div class="grid gap-5 sm:grid-cols-[8rem_1fr] sm:items-center">
							<code class="text-xs text-secondary">sizes</code>
							<div class="flex flex-wrap items-center gap-5">
								{#each switchSizes as size (size)}
									<Switch {size} checked aria-label={`${size} switch`} />
								{/each}
							</div>
						</div>
						<div class="grid gap-5 sm:grid-cols-[8rem_1fr] sm:items-start">
							<code class="pt-1 text-xs text-secondary">settings</code>
							<div class="grid max-w-md divide-y divide-secondary-border">
								<label class="flex cursor-pointer items-center justify-between gap-8 py-4">
									<span>
										<span class="block text-sm font-medium">Notifications</span>
										<span class="mt-1 block text-xs text-secondary"
											>Receive updates about account activity.</span
										>
									</span>
									<Switch bind:checked={notifications} aria-label="Notifications" />
								</label>
								<label class="flex cursor-pointer items-center justify-between gap-8 py-4">
									<span>
										<span class="block text-sm font-medium">Interface sounds</span>
										<span class="mt-1 block text-xs text-secondary"
											>Play subtle sounds for interactions.</span
										>
									</span>
									<Switch bind:checked={sounds} aria-label="Interface sounds" />
								</label>
								<label class="flex items-center justify-between gap-8 py-4 opacity-50">
									<span>
										<span class="block text-sm font-medium">Unavailable</span>
										<span class="mt-1 block text-xs text-secondary">Disabled control state.</span>
									</span>
									<Switch disabled aria-label="Unavailable" />
								</label>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section class="border-t border-secondary-border py-12 sm:py-16">
				<div class="grid gap-10 lg:grid-cols-[15rem_1fr]">
					<div>
						<p class="m-0 text-xs tracking-widest text-secondary uppercase">09</p>
						<h2 class="mt-3 text-lg font-medium">Checkbox</h2>
						<p class="mt-3 text-xs leading-5 text-secondary">
							Native form control with polished visual states.
						</p>
					</div>
					<div class="grid gap-10">
						<div class="grid gap-5 sm:grid-cols-[8rem_1fr] sm:items-center">
							<code class="text-xs text-secondary">sizes</code>
							<div class="flex flex-wrap items-center gap-6">
								{#each checkboxSizes as size (size)}
									<Checkbox {size} state="checked">{size.toUpperCase()}</Checkbox>
								{/each}
							</div>
						</div>
						<div class="grid gap-5 sm:grid-cols-[8rem_1fr] sm:items-start">
							<code class="pt-1 text-xs text-secondary">states</code>
							<div class="grid max-w-md gap-5">
								<Checkbox bind:state={termsState}>Interactive checkbox</Checkbox>
								<Checkbox state="checked">Checked</Checkbox>
								<Checkbox state="indeterminate">Indeterminate</Checkbox>
								<Checkbox state="unchecked">Unchecked</Checkbox>
								<Checkbox state="checked" disabled>Checked and disabled</Checkbox>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section class="border-t border-secondary-border py-12 sm:py-16">
				<div class="grid gap-10 lg:grid-cols-[15rem_1fr]">
					<div>
						<p class="m-0 text-xs tracking-widest text-secondary uppercase">10</p>
						<h2 class="mt-3 text-lg font-medium">Modal</h2>
						<p class="mt-3 text-xs leading-5 text-secondary">
							Focused dialog with backdrop, Escape handling, and centered morph motion.
						</p>
					</div>
					<div class="flex items-center">
						<Button onclick={() => (modalOpen = true)}>Open modal</Button>
					</div>
				</div>
			</section>

			<section class="border-t border-secondary-border py-12 sm:py-16">
				<div class="grid gap-10 lg:grid-cols-[15rem_1fr]">
					<div>
						<p class="m-0 text-xs tracking-widest text-secondary uppercase">11</p>
						<h2 class="mt-3 text-lg font-medium">Popover</h2>
						<p class="mt-3 text-xs leading-5 text-secondary">
							Compact contextual content anchored to a trigger.
						</p>
					</div>
					<div class="flex items-center py-4">
						<Popover align="start">
							{#snippet trigger(toggle, open)}
								<Button variant="secondary" onclick={toggle}
									>{open ? 'Close' : 'Open'} popover</Button
								>
							{/snippet}
							<div class="grid gap-1">
								<p class="m-0 font-medium">Quick settings</p>
								<p class="m-0 text-xs text-secondary">
									Adjust preferences without leaving this page.
								</p>
							</div>
						</Popover>
					</div>
				</div>
			</section>

			<section class="border-t border-secondary-border py-12 sm:py-16">
				<div class="grid gap-10 lg:grid-cols-[15rem_1fr]">
					<div>
						<p class="m-0 text-xs tracking-widest text-secondary uppercase">12</p>
						<h2 class="mt-3 text-lg font-medium">Tooltip</h2>
						<p class="mt-3 text-xs leading-5 text-secondary">
							Keyboard and pointer hint with delayed reveal.
						</p>
					</div>
					<div class="flex flex-wrap items-center gap-6 py-4">
						<Tooltip text="Create a new item" placement="top">
							{#snippet trigger(props)}
								<Button {...props} content="icon" icon={plusIcon} aria-label="Create item" />
							{/snippet}
						</Tooltip>
						<Tooltip text="More information" placement="bottom">
							{#snippet trigger(props)}
								<Button {...props} variant="secondary">Hover or focus</Button>
							{/snippet}
						</Tooltip>
					</div>
				</div>
			</section>

			<section class="border-y border-secondary-border py-12 sm:py-16">
				<div class="grid gap-10 lg:grid-cols-[15rem_1fr]">
					<div>
						<p class="m-0 text-xs tracking-widest text-secondary uppercase">13</p>
						<h2 class="mt-3 text-lg font-medium">Toast</h2>
						<p class="mt-3 text-xs leading-5 text-secondary">
							Timed status feedback with optional manual dismissal.
						</p>
					</div>
					<div class="flex flex-wrap items-center gap-3">
						{#each notificationVariants as variant (variant)}
							<Button variant="secondary" onclick={() => showToast(variant)}>
								{variant}
							</Button>
						{/each}
					</div>
				</div>
			</section>

			<footer class="flex flex-wrap items-center justify-between gap-4 pt-8 text-xs text-secondary">
				<p class="m-0">Minimality UI / Atoms</p>
				<code>atoms · overlays · effects</code>
			</footer>
		</div>
	</main>

	<Modal bind:open={modalOpen} title="Create new project">
		<p class="m-0">
			Centered morph motion keeps the dialog entrance focused while preserving accessible semantics.
		</p>
		{#snippet footer()}
			<Button variant="secondary" onclick={() => (modalOpen = false)}>Cancel</Button>
			<Button onclick={() => (modalOpen = false)}>Create project</Button>
		{/snippet}
	</Modal>

	<ToastStack items={toastItems} onDismiss={dismissToast} />
</div>
