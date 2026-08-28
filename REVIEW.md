# REVIEW.md — Kilo Code Reviews policy for minimalityui

This file is read by Kilo Code Reviews from the PR base branch. It shapes what the reviewer flags, the severity it uses, files to skip, and sub-agent behavior. Keep it current whenever AGENTS.md changes.

## Severity calibration

Use these tags consistently. Do not invent new severity levels.

| Tag        | When to use                                                                                                 |
| ---------- | ----------------------------------------------------------------------------------------------------------- |
| `critical` | Breaks a public contract, breaks build/check, hard rule violation in AGENTS.md, security/accessibility hole |
| `warning`  | Clear bug, performance issue, or rule violation that will cause user-visible pain or rework                 |
| `info`     | Style, naming, optional DX improvement. Never block on these                                                |

If a finding is not critical, warning, or info, do not post it.

## Hard rules (always flag as `critical` or `warning`)

These come from AGENTS.md. Treat any violation as `critical` unless noted.

### Styling and themes (`critical` if violated)

- Hardcoded colors anywhere in a component file. Use semantic tokens from `src/lib/styles/theme.css` (`background`, `foreground`, `primary`, `primary-foreground`, `primary-hover`, `primary-subtle`, `primary-border`, `secondary*`, `destructive*`, `info*`, `warning*`, `success*`, `popover*`, `scrollbar-*`).
- Card wrapper around a showcase section. Use divider-based sections.
- Theme attribute dropped across a portal: any modal, popover, toast, or overlay that is portaled out of the `data-theme` carrier.

### Motion (`critical` if violated)

- Any easing that is not cubic-in-out. Anime.js must use `eases.inOutCubic`. CSS/UnoCSS must use `ease-[cubic-bezier(0.65,0,0.35,1)]`.
- Missing `prefers-reduced-motion` handling on a component that animates.
- Translate-only entrance where morphing would fit (Modal, Toast, dropdowns). Modal/Toast must use the centered `effectMorph` action and stay mounted until the exit callback completes.
- Gooey/SVG-filter effects on Modal or Toast. Gooey is reserved for shapes that must visually merge.
- A Svelte action that does not restore modified inline styles, remove listeners, or stop animations on cleanup.

### Accessibility (`critical` if violated)

- Icon-only control with no accessible name (missing `aria-label`, `aria-labelledby`, or visible text).
- Modal missing dialog semantics, Escape handler, backdrop dismissal, focus restoration, or body scroll lock.
- Tooltip not wired to its trigger with `aria-describedby` (or `aria-details` for richer content).
- Popover trigger without `aria-expanded` and `aria-controls` / `aria-haspopup`.
- Switch or Checkbox that loses native keyboard behavior (Space/Enter activation, focus ring, `:checked` styling) or form behavior (no `name` / `value` binding).

### Component organization (`warning` if violated)

- New component placed in the wrong tier: atom in `molecules/`, molecule in `atoms/`, action in a component folder.
- Variant definitions or option types not co-located with the component as `<component>.ts`.
- New public symbol (component, action, option type, variant) missing from `src/lib/index.ts`.

### Svelte conventions (`warning` if violated)

- Legacy slot syntax where a snippet would do.
- `{#each}` without a key.
- `$effect` that adds global listeners / timers / document state without cleanup.
- Any `.svelte` file edited without running `svelte-autofixer` (look for raw `let` declarations that should be `$state`, `export let` that should be `$props`).

### Public API (`critical` if violated)

- Breaking change to a public component API without an explicit note in the PR description.
- New dependency added for styling or animation when an existing tool already covers it.

## Focus areas for this repo

The following are the **default** focus areas. Add or remove via the Kilo Code Reviews dashboard, but these are tuned to minimalityui:

1. **Bug detection** — primary focus. Look for logic errors in components, especially around state machines (Switch, Checkbox, Modal, Toast).
2. **Accessibility** — primary focus. The repo ships headless primitives, so a11y regressions are user-visible.
3. **Style** — secondary. UnoCSS / semantic-token drift is the most common style issue.
4. **Test coverage** — secondary. Any new component or new variant without a corresponding showcase route or unit test is flagged as `warning`.
5. **Performance** — secondary. Flag N+1 in the showcase (e.g. rendering 1000 atoms on initial paint) and listener leaks in actions.
6. **Documentation** — light. Flag missing or stale `AGENTS.md` content, missing exports in `src/lib/index.ts`, undocumented `<component>.ts` option types.
7. **Security** — light. This is a UI library with no backend, so focus on XSS in Svelte `{@html}` (forbidden unless documented) and any commit that adds network calls.

## What to skip

Do not flag, comment on, or block on any of the following. They are out of scope for this repo.

- Lockfile churn unless a real vulnerability is being introduced (Dependabot/Renovate PRs are skipped by default anyway).
- Showcase copy / placeholder text in `src/routes`.
- `CHANGELOG.md` formatting.
- Typos in the showcase, but DO flag typos in component prop names, exported type names, and `src/lib/index.ts` (these are public).
- `dist/`, `build/`, `.svelte-kit/`, `.output/`, `node_modules/`.
- Generated files: `package-lock.json` (when the change is dep-only), anything under `.vercel/`, `.wrangler/`.
- A PR that only changes a single line of CSS and clearly fixes a token mismatch — accept without comment.

## Severity reporting rules

- A finding that references AGENTS.md must quote the exact section name, not paraphrase it.
- A finding that cites a line number must verify that line is part of the PR diff. If the line is in unchanged context, drop the inline comment and reference the file:line in the summary only.
- Never combine two unrelated findings into one comment. Each `critical`/`warning` is its own inline.
- Duplicate findings across sub-agents must be deduped in the summary. Keep the highest-severity mention.

## Sub-agent usage

Override the default sub-agent tier guidance. The defaults are fine for general-purpose repos; minimalityui is small enough that sub-agent overhead usually exceeds the benefit.

- **Use 0 sub-agents** for: docs-only changes, AGENTS.md or REVIEW.md edits, single-file typo/comment fixes, single-line CSS fixes, showcase copy changes, dependabot/renovate PRs.
- **Use 1 sub-agent** when the PR is <300 changed lines and touches exactly one of: an atom, a molecule, a Svelte action, a single showcase route, or a single CVA variant definition. The sub-agent's role is to do a focused pass on accessibility and motion-contract compliance for that one surface.
- **Use 3 sub-agents** only when the PR is ≥300 changed lines OR spans ≥3 of these surfaces: atoms, molecules, actions, theme tokens, showcase. Then split as:
  1. **Component API reviewer** — public exports, prop types, snippet contracts, `src/lib/index.ts` coverage, breaking-change detection.
  2. **Styling and motion reviewer** — UnoCSS utility usage, semantic-token compliance, cubic-in-out easing, `prefers-reduced-motion`, action cleanup, portal-theme propagation.
  3. **Accessibility reviewer** — native semantics preservation, keyboard behavior, ARIA wiring (dialog, popover, tooltip, switch, checkbox), focus management.
- **Do not use 6 sub-agents** for this repo. The diffs are small; the coordination cost exceeds coverage benefit.

Each sub-agent must stay read-only, must not post comments, and must return findings with `path`, `line`, `severity`, `rationale`, and `confidence`. The main reviewer verifies every finding, dedupes, and posts the final inline comments and summary.

## Summary comment format

Use this structure for the top-level PR summary comment. Keep it under 30 lines.

```markdown
## Kilo Code Review

- ✅ / ❌ `npm run check`
- ✅ / ❌ `npm run build`
- :sparkles: N inline comments posted

### Findings

- `critical`: N
- `warning`: N
- `info`: N

### Notes

- <one short paragraph; only if needed>

<sub>Generated by Kilo Code Reviews — see `REVIEW.md`.</sub>
```

If the build or check step failed, list the exact failing command and the first error line. Do not paste full logs.

## Reviewer persona

Be terse, factual, and concrete. No "I noticed", no "you might consider", no apologies. Reference files as `path/to/file.ts:NN`. When you don't know, say so in one line and stop.
