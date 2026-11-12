# Design System (Phase 4)

Principles: calm, trustworthy, fast. This is a money tool, so it should look like a good financial product, not an ad page.

## Color tokens (CSS variables; light and dark)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | #FAFAF7 | #0E1116 | Page background |
| `--surface` | #FFFFFF | #161B22 | Cards, inputs |
| `--text` | #14181F | #F2F4F7 | Body text (contrast above 7:1) |
| `--muted` | #5B6573 | #9AA4B2 | Secondary text (contrast at least 4.5:1) |
| `--border` | #E3E6EB | #2A313B | Dividers |
| `--accent` | #0F766E | #2DD4BF | Primary actions, links |
| `--win` | #15803D | #4ADE80 | Better-offer highlight |
| `--warn` | #B45309 | #FBBF24 | Assumption and pending notices |

Rule: color never carries meaning alone. The winning offer also gets a text label ("Better by $X/yr").

## Typography
- Font: system UI stack for speed (no web-font blocking); numbers use `font-variant-numeric: tabular-nums`.
- Scale: 14 / 16 / 20 / 28 / 40 px. Results headline 40px, body 16px minimum on mobile.
- Line height 1.5 body, 1.15 headings.

## Layout
- Mobile first, single column; two-column comparison from 768px up.
- 4px spacing grid: 4, 8, 12, 16, 24, 32, 48.
- Max content width 1040px; tool above the fold on a 375px phone.
- Order on every page: tool, result, breakdown, explanation, then ads.

## Components
- **OfferForm**: labeled inputs, inline validation, advanced fields collapsed.
- **LocationSelect**: searchable; unverified jurisdictions shown as "Coming soon" and not selectable.
- **ResultCard**: verdict sentence, two take-home figures, difference. This is also the layout of the shareable image (1200x630).
- **BreakdownTable**: tax lines per offer, with an "as of 2026" label and source link.
- **AssumptionsPanel**: always visible under results.
- **ShareBar**: copy link, native share, social buttons.
- **AdSlot**: reserved height (prevents layout shift), never above the tool or between inputs and results.

## Accessibility (WCAG 2.2 AA)
- Every input has a visible label and an error message linked via `aria-describedby`.
- Results live in an `aria-live="polite"` region.
- Focus rings at least 2px, never removed.
- Touch targets at least 44x44px.
- Respects `prefers-reduced-motion` and `prefers-color-scheme`.
