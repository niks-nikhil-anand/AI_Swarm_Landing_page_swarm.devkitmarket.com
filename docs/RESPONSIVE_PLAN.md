# Mobile and Tablet Responsive Plan

> **Goal:** make every homepage section feel designed for phones and tablets, not just "not broken".
> **Baseline measured 29 Sep 2026** on the running site at 320, 375, 768 and 1024 px, in both themes.
>
> **Status (29 Sep 2026):** Phases A, B and C are implemented. Phase D's automated checks passed at 320–1440 px in both themes; the real-device review is still open.
> Differences from this plan:
> - How it works uses compact cards rather than a stepper.
> - The How it works flow chips wrap rather than scroll.
> - The Roadmap has a "Swipe" hint instead of position dots.
> - Pricing features are in 2 columns on tablets only.
> - Tablet page height ended at ~10,200 px, above the 8,500 px target.

## 0. What the audit found

**Good news:** there is no sideways scrolling at any width, no content is cut off, and the mobile nav drawer works.

The problems are **length, wasted tablet space and small touch/text sizes**:

| Width | Page height | Main issues |
|---|---|---|
| 320 px (small phone) | ~15,400 px (24 screens) | H1 wraps to 4 lines; countdown tiles run 8 px into the side margin |
| 375 px (phone) | ~16,500 px (20 screens) | Deliverables 1,755 px, How it works 1,821 px, Roadmap 1,728 px, Compare 1,401 px |
| 768 px (tablet portrait) | ~10,500 px | Type stays phone-sized (H1 40 px); hero demo is the phone timeline stretched to 700 px; Roadmap leaves one card alone on the last row |
| 1024 px (tablet landscape) | ~10,700 px | How it works squeezed to 4 × 223 px cards; Roadmap to 5 × 174 px cards; hero demo still the phone layout (desktop version starts at 1280 px) |

**Across all widths:**
- About 40 text elements are 10–11 px (eyebrows, badges, assurances, notes, footer).
- Tap targets under 44 px: the announcement link (16 px tall), footer links (19 px), demo template chips (39 px), menu button (38 px wide).
- Most components jump straight from phone styles to `lg:` (1024 px), with nothing at `md:` (768 px), so tablets get the phone layout.

## 1. Breakpoint strategy (applies to every step)

| Name | Tailwind | Range | Devices |
|---|---|---|---|
| Phone | base | < 640 | iPhone SE → Pro Max, Android |
| Large phone | `sm:` | 640–767 | Large phones in landscape, small foldables |
| Tablet portrait | `md:` | 768–1023 | iPad mini/Air/Pro portrait |
| Tablet landscape | `lg:` | 1024–1279 | iPad landscape, small laptops |
| Desktop | `xl:` | ≥ 1280 | Unchanged by this plan |

**Rules:**
1. **Desktop (≥ 1280 px) must look exactly as it does today.** Every change is scoped to `max-xl` or to base/`sm:`/`md:`/`lg:` classes that `xl:` already overrides.
2. Every section gets a deliberate `md:` layout; tablet portrait should never be "the phone layout, wider".
3. **Minimum text size:** 12 px for readable text; 11 px only for uppercase badges and eyebrows.
4. **Tap targets:** at least 44 × 44 px for primary controls, and at least 32 px tall with 8 px spacing for dense link lists (WCAG 2.5.8 requires 24 px).
5. Keep the 20 px phone gutter (`px-5`) and 32 px from `sm:` (`px-8`).

## Phase A — Foundations (do first; every section inherits these)

### Step A1 — Section spacing (`ui/Section.tsx`)
- **Now:** `pt-16 pb-20 → lg:pt-24 lg:pb-28`.
- **Change to:** `pt-14 pb-16 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28`.
- **Saves:** about 16 px per section on phones (10 sections, about 160 px), and gives tablets an intermediate step.
- Change `scroll-mt-16` to `scroll-mt-20` so anchor jumps clear the 60 px sticky navbar with some breathing room.

### Step A2 — Heading scale (`ui/SectionHeader.tsx`)
- Add an `md:` step to each size:
  - `md`: `text-[28px] → md:text-[34px] → lg:text-[38px]`
  - `lg`: `text-[32px] → md:text-[40px] → lg:text-[48px]`
- Description: `text-[15px] md:text-base`, with `max-w-[620px]` kept.
- Eyebrow: `text-[11px]`, which stays as the one allowed exception (uppercase and letter-spaced).

### Step A3 — Card padding (`ui/Card.tsx` and callers)
- Standardise on `p-5 sm:p-6 lg:p-7`. Callers currently mix `p-6`, `p-6 sm:p-7` and `p-7 sm:p-8`.
- `IconTile`: `size-9 sm:size-10`.

### Step A4 — Small-text sweep
- Badges (`StatusBadge`, `AvailabilityBadge`): keep 10 px (uppercase), but add `py-[3px]` so they don't look cramped.
- Readable 11 px text becomes `text-xs` (12 px): hero assurances, the pricing note, the FAQ helper, the footer copyright row, the waitlist flow chips and the timeline.

### Step A5 — Tap-target sweep
- Announcement bar link: add `inline-flex min-h-9 items-center px-1` so the tappable area fills the bar's height.
- Navbar menu button: `p-2` becomes `p-2.5`, giving 44 × 44.
- Footer links: add `py-1.5`, giving about 32 px tall.
- Demo template chips: `py-2` becomes `py-2.5`, giving 44 px.

**Done when:** the audit script reports no readable text under 12 px and no primary control under 44 px.

## Phase B — Section by section (top to bottom)

### Step B1 — Announcement bar (`sections/AnnouncementBar.tsx`, `ui/LaunchCountdown.tsx`)
- **Phone:** "Beta in 59d 21h 55m · Join →" at 11 px. Raise to `text-xs` and apply the A5 tap target.
- **Tablet:** already shows the full text from `md:`; no layout change.
- **Check:** the text fits on one line at 320 px with the seconds hidden, which they already are.

### Step B2 — Navbar (`sections/Navbar.tsx`)
- **Phone:** the logo byline "by DevKit Market" is already hidden below `sm:`. Apply the A5 menu-button size.
- **Tablet portrait (768):** shows the logo with byline, the "Join the waitlist" button (36 px tall) and the menu button. Raise the button to `py-2.5` (40 px) on touch sizes only (`max-lg:`).
- **Tablet landscape (1024):** shows 4 links, the toggle and the CTA; the audit confirms nothing collides. Keep it.
- **Drawer:** add `pb-[max(2.5rem,env(safe-area-inset-bottom))]` so the waitlist button clears the iPhone home indicator. This also needs `viewport-fit=cover` (Step C1).

### Step B3 — Hero (`sections/Hero.tsx`, `ui/HeroIdeaForm.tsx`)
**Now:** 1,663 px tall on a 375 px phone (2 screens). At 320 px the H1 wraps to 4 lines.

1. **H1:** `text-[34px] min-[375px]:text-[40px] md:text-[54px] lg:text-[68px]`. On phones, replace the forced `<br />` with a line break allowed only from `sm:` up (`<br className="hidden sm:block" />`), so small screens wrap naturally.
2. **Subhead:** `text-[15px] md:text-[17px]`; add `md:max-w-[560px]`.
3. **Idea form:** it already stacks on phones. Make the button full-width on phones (`w-full sm:w-auto`), and keep the input at 16 px (`text-base`) so iOS doesn't zoom in when it's tapped.
4. **"See how it works":** on phones, turn it into a plain text link ("See how it works ↓") to save height and reduce competition with the main CTA; keep it as a button from `sm:`.
5. **Assurances:** `text-xs`; on phones, show them as one centred row that wraps, `gap-x-4`.
6. **Countdown tiles:** at 320 px they break the margin. Use tile width `w-[62px] min-[375px]:w-[68px] sm:w-[84px]` and `gap-1.5 min-[375px]:gap-2`.
7. **Spacing:** `pt-10 pb-14 md:pt-16 md:pb-20 lg:pt-24 lg:pb-32`.

**Target:** hero text and CTA fully visible in the first 812 px screen on a 375 px phone, with the demo starting just below.

### Step B4 — Hero demo (`sections/HeroDemo.tsx`)
**Now:** below 1280 px it always shows the phone timeline, 699 px tall even on a 1024 px iPad.

1. **Phone (< 640):**
   - Template chips in a single horizontally scrolling row (`flex-nowrap overflow-x-auto snap-x`, hidden scrollbar), instead of wrapping onto 2–3 lines.
   - Show 2 agent cards plus a "+1 agent" line instead of all 3.
   - Target height about 520 px.
2. **Tablet portrait (768–1023), new layout:**
   - Two columns: `md:grid md:grid-cols-[240px_1fr]`.
   - Left: the presets as a vertical list plus the "Your idea" box (the desktop panel, narrower).
   - Right: the timeline, with the 3 agents in a row (`md:grid-cols-3`) between the Planner and the Fact-Checker.
3. **Tablet landscape (1024–1279):** the same two-column layout with a 300 px left column.
4. **Keep:** the desktop `xl:` graph (760 px canvas) exactly as is.

**Target:** about 460 px tall on tablets instead of 699 px, with no empty stretched cards.

### Step B5 — Deliverables (`sections/Deliverables.tsx`)
**Now:** 1,755 px on phones (6 tall cards stacked).

1. **Phone:** switch to compact rows. Use `Card direction="row"` with the icon on the left, title and body on the right, and `p-5 gap-4`. That's about 130 px per card instead of about 250 px.
2. **Tablet portrait:** 2 columns (unchanged), using the Phase A card padding.
3. **Tablet landscape:** keep 3 columns.

**Target:** about 1,050 px on phones.

### Step B6 — Methodology (`sections/Methodology.tsx`)
**Now:** 1,441 px on phones; the "Limits" card stacks its 4 checks in one column.

1. The four method cards use the same compact row layout as B5 on phones.
2. **Limits card:**
   - **Phone:** heading, then a 1-column list.
   - **Tablet portrait:** heading above a 2-column list (`md:grid-cols-2`).
   - **`lg:`:** the side-by-side layout, unchanged.

**Target:** about 1,000 px on phones.

### Step B7 — How it works (`sections/HowItWorks.tsx`)
**Now:** 1,821 px on phones (4 cards, each with a 130 px code box). At 1024 px the cards are 223 px wide inside a fixed 340 px height.

1. **Phone:**
   - Turn the steps into a vertical stepper: number on a connecting line on the left, title and body on the right.
   - Replace the code box with a single one-line mono summary, e.g. `validation-report.pdf · prd.docx`.
   - Move the flow chips above the steps and keep them on one horizontally scrolling line.
2. **Tablet portrait:** 2 × 2 grid with the code boxes kept (unchanged), using the Phase A padding.
3. **Tablet landscape:** keep the 2 × 2 grid up to `xl:`, so replace `lg:grid-cols-4` with `xl:grid-cols-4`. Remove the fixed `lg:h-[340px]` and use `xl:h-[340px]`.

**Target:** about 900 px on phones; no squeezed cards at 1024 px.

### Step B8 — Compare table (`sections/AppBuildersSkip.tsx`)
**Now:** on phones, each of the 4 products becomes a card with a 2 × 2 list: 1,401 px.

1. **Phone:** the data is only 4 rows × 4 columns, so use the real table on phones too:
   - Row labels wrap onto 2 lines (drop `whitespace-nowrap` and the sticky column below `sm:`).
   - Column headers at 10 px uppercase with short labels: add a `short` field (`RSRCH`, `COMP`, `SRC`, `PRD`).
   - Dots are centred in 48 px cells.
   - Estimated size: 120 px + 4 × 48 px = 312 px, which fits 335 px.
2. **Tablet:** the table as it is today.
3. The three check points below the table: 1 column on phones, 3 columns from `md:` (currently only from `lg:`).
4. **Measure at 320 px.** If the table doesn't fit, fall back to the current card list, but make each card a single line: name, then 4 dots.

**Target:** about 600 px on phones.

### Step B9 — In control (`sections/InControl.tsx`)
- **Phone:** 4 row cards (fine at 971 px). Apply the Phase A padding; keep the body text at 13 px.
- **Tablet:** 2 columns from `md:` already; no change.

### Step B10 — Pricing (`sections/Pricing.tsx`)
- A single card with `max-w-[680px]`, which works everywhere.
- **Phone:**
  - Price `text-5xl` becomes `text-[40px] sm:text-5xl`.
  - The feature list goes to 2 columns from `sm:` (`sm:grid sm:grid-cols-2`) to cut the card's height.
  - The note goes to `text-xs`.
- **Tablet:** 2-column features; the card stays centred.

**Target:** about 760 px on phones (from 938).

### Step B11 — Roadmap (`sections/Stages.tsx`)
**Now:** 1,728 px on phones. At 768 px the 5 cards in 2 columns leave one alone on the last row; at 1024 px there are 5 columns of 174 px.

1. **Phone:**
   - A horizontal scroll-snap carousel (`flex overflow-x-auto snap-x snap-mandatory`), with each card `w-[82%] shrink-0 snap-start` so the next card peeks in.
   - Add a small "1 / 5" position hint, or dots, below it.
   - Estimated about 420 px.
2. **Tablet portrait:** 3 columns on the first row and 2 on the second (`md:grid-cols-6`, cards spanning 2 columns, the last two offset to centre them), or live plus soon/later groups. Either way, no lone card.
3. **Tablet landscape:** the same 3 + 2 layout until `xl:`, where the 5-column row returns (`xl:grid-cols-5`).
4. Keep the availability badges on one line: add `whitespace-nowrap` and let the stage name truncate.

**Target:** about 500 px on phones; no card narrower than 220 px on tablets.

### Step B12 — FAQ (`sections/Faq.tsx`)
- **Phone:** one column (1,305 px, mostly the answers). Add `py-4` question rows (already `min-h-16`, fine) and use `text-[15px]` for questions.
- **Tablet portrait:** keep one column, with the intro text beside the heading so it doesn't sit above the list alone.
- **Tablet landscape:** switch to the two-column layout at `lg:` (current behaviour; the intro column is 379 px, fine).

### Step B13 — Final CTA and waitlist (`sections/FinalCta.tsx`, `ui/WaitlistForm.tsx`)
**Now:** 871 px on phones. The inner card uses `px-6 py-16`, the decorative corners take space, and the flow row wraps onto 2–3 lines.

1. **Phone:**
   - Card padding `px-5 py-12`; outer `rounded-[20px] sm:rounded-[28px]`.
   - Hide the four corner marks below `sm:`.
   - H2 `text-[32px] min-[375px]:text-[38px] md:text-[48px] lg:text-[58px]`.
   - The flow chips (`idea → … → MVP scope`) are hidden on phones or reduced to one line (`idea → evidence → PRD`).
2. **Form:**
   - Email plus button stack on phones (already); the button becomes full-width.
   - The idea textarea `min-h-20` becomes `min-h-16` on phones.
   - Success/error text stays at 14 px.
3. **Tablet:** the card has `max-w-[760px]` content; the H2 uses the new `md:` step.

**Target:** about 700 px on phones.

### Step B14 — Footer (`sections/Footer.tsx`)
1. **Phone:** brand block full-width, then link columns in 2 columns (current). Apply the A5 tap target, `py-1.5` on links.
2. **Tablet portrait:** 4 columns from `md:` (current). Check that the brand paragraph doesn't squeeze; if it does, keep the brand block full-width until `lg:`.
3. **Bottom row:** stacked on phones, `text-xs`.

## Phase C — Cross-cutting

### Step C1 — Viewport and safe areas (`app/layout.tsx`)
Export `viewport` with `width=device-width, initial-scale=1, viewportFit: "cover"` and a `themeColor` for light and dark. Check the Next 16 docs in `node_modules/next/dist/docs/` for the `viewport` export API first. Use `env(safe-area-inset-*)` where fixed layers touch the screen edges (the drawer).

### Step C2 — Touch behaviour
- Hover-only effects (card lift, link colour) are fine, but nothing important may be hover-only.
- Add `touch-action: manipulation` to buttons to remove the tap delay on older WebKit.
- Horizontal carousels (B4 chips, B7 flow, B11 roadmap) need `overscroll-x-contain` and a keyboard-reachable alternative: their items stay focusable, and focusing one scrolls it into view.

### Step C3 — Landscape phones (812 × 375)
The drawer already scrolls (`overflow-y-auto`). Check that the hero form and the countdown don't push the H1 off the first screen, and use `max-h-[100dvh]` on anything sized to the viewport.

### Step C4 — Both themes
Rerun the light-mode contrast scan after each phase: the new compact layouts place text on `bg-panel`, which lowers contrast slightly.

## Phase D — Verification (after each phase)

| Check | How | Pass criteria |
|---|---|---|
| No sideways scroll | Audit script at 320, 360, 375, 390, 414, 768, 820, 1024, 1180 | `scrollWidth === clientWidth` |
| Nothing cut off | Audit, including inside `overflow-hidden` | No element crosses the 20 px gutter |
| Text size | Audit | No readable text < 12 px |
| Tap targets | Audit | Primary controls ≥ 44 px; links ≥ 32 px |
| Page length | Sum of section heights | 375 px ≤ 11,500 px (from 16,500); 768 px ≤ 8,500 px |
| Desktop unchanged | Compare section heights at 1440 px with the baseline | Identical |
| Contrast | Light-mode scan | 0 failures |
| Keyboard and screen reader | Tab through the carousels and drawer | Every item reachable; focus visible |
| Real devices | iPhone SE, iPhone 15, iPad mini portrait, iPad Air landscape | Visual review in both themes |
| Build | `npx tsc --noEmit`, `npx eslint`, `npx next build` | All pass |

## Order of work and size

| Order | Steps | Effort | Why this order |
|---|---|---|---|
| 1 | A1–A5 foundations | S | Every section inherits them; lowest risk |
| 2 | B3–B4 hero and demo | M | First impression; biggest tablet gap |
| 3 | B5, B7, B11 | M | Largest phone height savings (about 2,800 px) |
| 4 | B8 compare table | S | Needs the 320 px fit test |
| 5 | B6, B9, B10, B12–B14 | S | Polish |
| 6 | B1–B2, C1–C4 | S | Edge cases and devices |
| 7 | Phase D | S | Final pass in both themes |

**Out of scope:** desktop (≥ 1280 px) visuals, copy changes, and the sections not rendered on the homepage (`Team`, `Workspace`, `Engine`, `Stack`, `DeployFlows`, `FounderProblem`, `LiveExecution`).
