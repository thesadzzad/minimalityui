<script lang="ts">
	import { effectMagnetic } from '../lib/actions/effect-magnetic.js';
	import { effectRipple } from '../lib/actions/effect-ripple.js';
	import Button from '../lib/components/atoms/button/button.svelte';

	const variants = ['primary', 'secondary', 'destructive'] as const;
	const sizes = ['sm', 'md', 'lg'] as const;
	const radii = ['none', 'sm', 'md', 'lg', 'pill'] as const;
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

<main data-theme="dark" class="min-h-screen bg-background text-foreground">
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

		<section class="border-y border-secondary-border py-12 sm:py-16">
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

		<footer class="flex flex-wrap items-center justify-between gap-4 pt-8 text-xs text-secondary">
			<p class="m-0">Minimality UI / Atoms</p>
			<code>button.svelte</code>
		</footer>
	</div>
</main>
