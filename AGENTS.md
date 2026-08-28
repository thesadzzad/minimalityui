# Minimality UI contributor guide

Keep this file current whenever project architecture, commands, public APIs, styling rules, or validation requirements change.

## Project scope

Minimality UI is a Svelte 5 component library with a SvelteKit showcase app.

- Library source: `src/lib`
- Showcase and manual previews: `src/routes`
- Public package exports: `src/lib/index.ts`
- Theme tokens: `src/lib/styles/theme.css`
- UnoCSS token mapping: `uno.config.ts`

## Stack

- Svelte 5 runes and snippets
- TypeScript
- UnoCSS with `presetWind4` and `presetIcons`
- Phosphor icons through `@iconify-json/ph` and `i-ph-*` utilities
- CVA for typed component variants
- Anime.js 4 for JavaScript animation
- Semantic CSS custom properties for light and dark themes

Do not add another styling or animation dependency unless existing tools cannot meet a concrete requirement.

## Component organization

- Atoms live in `src/lib/components/atoms/<component>`.
- Molecules live in `src/lib/components/molecules/<component>`.
- Reusable Svelte actions live in `src/lib/actions`.
- Variant definitions and exported variant types live beside their component in `<component>.ts`.
- Components use `<component>.svelte`.
- Add every supported public component, action, option type, and variant type to `src/lib/index.ts`.

Preserve existing component APIs unless a breaking change is explicitly requested. Prefer native element attributes, snippets, bindable state, and callback props.

## Styling and themes

Use UnoCSS utilities and semantic colors from `theme.css`. Never hardcode component colors.

Supported semantic surfaces include:

- `background` / `foreground`
- `popover` / `popover-foreground`
- `primary` and related foreground, hover, subtle, and border tokens
- `secondary` and related foreground, hover, subtle, and border tokens
- `destructive` and related foreground, hover, and subtle tokens
- Subtle feedback tokens for `info`, `warning`, and `success`
- `scrollbar-track`, `scrollbar-thumb`, `scrollbar-thumb-hover`, and `scrollbar-size`

A theme is selected by `data-theme="dark"`; light is the `:root` default. Overlay previews must remain inside the element carrying `data-theme`, or a portal must copy that theme to its portal root.

Use divider-based showcase sections. Do not add card wrappers solely for presentation.

## Motion

All easing must be cubic-in-out.

- Anime.js: `eases.inOutCubic`
- CSS/UnoCSS: `ease-[cubic-bezier(0.65,0,0.35,1)]`

Respect `prefers-reduced-motion`. Use scale or shape morphing rather than translate-only entrances unless position movement is intrinsic to the interaction. Modal and Toast use the centered `effectMorph` action and remain mounted until its exit callback completes. Gooey filtering is reserved for components whose shapes must visually merge; do not apply it to Modal or Toast.

Actions must restore modified inline styles, remove listeners and generated DOM, and stop animations during cleanup.

## Accessibility

- Preserve native semantics whenever possible.
- Icon-only controls require an accessible name.
- Modal must expose dialog semantics, support Escape and backdrop dismissal, restore focus, and lock body scrolling only while open.
- Tooltip must work with pointer hover and keyboard focus and use `aria-describedby`.
- Popover triggers must expose expanded state and dialog relationships.
- Switch and Checkbox must retain native keyboard and form behavior.

## Svelte conventions

- Use Svelte 5 runes (`$props`, `$state`, `$derived`, `$effect`, `$bindable`).
- Use snippets and `{@render}` instead of legacy slots.
- Key every `{#each}` block.
- Type snippets and native event handlers.
- Run `svelte-autofixer` after editing any `.svelte` file.
- Keep effects focused on synchronization and always clean up global listeners, timers, or document state.

## Validation

Run focused validation after changes, then broader checks:

```sh
npm run check
npm run build
```

`npm run build` also packages the library and runs `publint`. Do not claim either command passed unless it completed successfully. Run `npm run lint` when changing formatting or lint-sensitive project configuration.

## Change discipline

- Make narrow changes at the responsible layer.
- Fix root causes rather than showcase-only symptoms, except when the bug is specifically showcase theme scope.
- Do not overwrite unrelated user work.
- Update showcase previews when adding or materially changing a component.
- Update this guide when a change makes any instruction inaccurate or incomplete.
