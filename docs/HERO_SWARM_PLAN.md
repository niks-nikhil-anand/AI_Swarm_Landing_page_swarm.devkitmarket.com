> **Update (29 Sep 2026):** at Nikhil's request the swarm forms the word **"Swarm"** (not "AI"), and it lives in the **Pricing** section (pricing card on the left, swarm on the right) instead of the hero. The hero is back to its original centred layout. The engine, colours, motion and performance rules below still apply.

# Live "AI" particle swarm in the hero: plan

> **Goal:** turn the hero's top area into two columns: the text left-aligned on the left, and a live particle visual on the right. In the visual, hundreds of glowing particles form the letters **"AI"** inside a slowly turning sphere, like the reference image.
> **Brand fit:** the product is called *AI Swarm*, so the swarm is literally the logo idea.
> **Colours:** the reference is teal. It will be redrawn in the site's own palette (brand purple with mint highlights) so it matches the current UI in both themes.
> **Scope:** "header" here means the **hero** (the first section with the headline). The 60 px navbar stays as it is.

## 0. What changes, at a glance

| Area | Now | After |
|---|---|---|
| Hero layout | Everything centred in one column | From 1024 px: **two columns**, text on the left (≈ 55%) and the swarm on the right (≈ 45%) |
| Text alignment | Centred | **Left-aligned** at every size (pill, H1, subhead, form, links, assurances, countdown) |
| Hero demo window | Full width below | **Unchanged:** still full width below both columns |
| New visual | None | Live canvas particle swarm, decorative, no data |

## 1. Visual design (matching the current UI)

**Composition** (same structure as the reference):
1. **Letters:** about 900 particles sampled from the letters "AI", drawn in the body font (DM Sans 600). Heavy strokes sample cleanly into dots.
2. **Sphere:** about 700 particles on a sphere that turns slowly around the letters, with particles at the back dimmer and smaller.
3. **Dust:** about 120 faint free-floating particles for depth.
4. **Glow:** a soft radial glow behind the letters, the same `rgba(124,111,247,…)` glow the hero already uses.

**Colours** (read at runtime from the existing CSS tokens, so the visual follows the theme toggle):

| Element | Dark theme | Light theme |
|---|---|---|
| Letter particles | `--color-brand-soft` `#a89ef9`, glowing | `--color-brand` `#5f51de`, no glow (glow looks muddy on white) |
| Sparkle highlights (~8%) | `--color-mint` `#2dd4a7` | `--color-mint` `#04704f` |
| Sphere particles | brand-soft at 25–60% opacity by depth | brand at 20–45% |
| Background | Transparent over the existing hero glow and grid | Transparent |

Mint ties it to the existing "live" signals: the blinking mint dot in the hero pill and the mint "DONE" states.

## 2. "Feels live": motion design
- **Always moving:**
  - the sphere turns about 1 revolution every 40 s;
  - every particle drifts slightly around its home spot;
  - letter particles twinkle at random, like agents lighting up.
- **Assembly on load:** particles start scattered and gather into "AI" over about 1.4 s. On first view the swarm visibly forms, which is the product story.
- **Breathing:** the glow pulses softly every 4 s.
- **Cursor:** particles within about 80 px of the pointer scatter away and spring back when it leaves. On touch screens, a tap causes a short ripple.
- **Pulse:** every 8–10 s a faint ring expands from the centre, a gentle "the swarm is working" beat.
- **Nothing flashes;** all changes are gradual (no WCAG 2.3 risk).

## 3. Performance and accessibility (must-haves)
- **Rendering:**
  - one `<canvas>` with a single `requestAnimationFrame` loop and no libraries (0 KB of dependencies);
  - about 1,700 particles in total, cut to about 700 on phones and to about 60% on low-end devices (`navigator.hardwareConcurrency ≤ 4`);
  - device pixel ratio capped at 2.
- **Pausing:**
  - stops when the hero scrolls off screen (`IntersectionObserver`);
  - stops when the tab is hidden;
  - resumes where it left off.
- **Reduced motion** (`prefers-reduced-motion`): no animation. The formed "AI" is drawn once as a still image.
- **Page speed:**
  - the H1 remains the page's largest element (LCP), and the canvas loads as a small client-only component after the text;
  - the container reserves its square size up front, so there's **no layout shift**.
- **Screen readers and search:** the canvas is decorative (`aria-hidden`, `role="presentation"`), so readers and search engines still see only the real H1 and copy.
- **Theme toggle:** the colours update right away without restarting the animation (it watches the `class` on `<html>`).

## 4. Layout by screen size

| Width | Layout |
|---|---|
| ≥ 1280 px (desktop) | Two columns `grid-cols-[1.15fr_0.85fr]`, gap 64 px; swarm about 480 px square, vertically centred on the text |
| 1024–1279 px | Two columns, swarm about 380 px |
| 768–1023 px (tablet) | One column: text left-aligned, swarm **below the text** at 320 px, before the demo |
| < 768 px (phone) | One column, left-aligned text; swarm as a **compact 220 px** version below the CTAs (about 700 particles) |

**Text column changes (left alignment):**
- H1: `text-center` → `text-left`; keep the `sm:` line break.
- Subhead and form: `max-w-[560px]`; the form keeps its full width inside the column.
- "See how it works", assurances and countdown tiles: `items-start` / `justify-start`. `CountdownTiles` gets an `align` prop.
- The existing top glow shifts from the centre (`left-1/2`) to behind the swarm, so the light source reads as "coming from the AI".

## 5. Implementation steps
1. **`ui/SwarmCanvas.tsx`** (new, client component). It contains:
   - the particle engine: target sampling from off-screen text, sphere points, the spring-and-drift physics and the render loop;
   - the theme-token reader and the pause/resume logic;
   - reduced-motion and device-tier handling.
2. **`sections/Hero.tsx`**:
   - wrap the text in a left column and add a right column holding `SwarmCanvas` at a fixed size;
   - left-align the text;
   - move the glow;
   - leave `HeroDemo` below.
3. **`ui/LaunchCountdown.tsx`**: an `align` prop on `CountdownTiles` (default `center`, so other callers don't change).
4. **`ui/HeroIdeaForm.tsx`**: an optional `className` so the hero can set its max width.
5. **Tuning pass:** particle counts, speeds and opacities in both themes; the letters must stay readable at 220 px.

## 6. Verification
- **Visual:** screenshots in both themes at 375, 768, 1024 and 1440 px, and check the "AI" is readable at every size.
- **Frame rate:** 60 fps on desktop and ≥ 50 fps with 4× CPU throttling; the loop takes < 4 ms per frame.
- **Pausing:** scroll the hero away or hide the tab, and confirm 0 frames are drawn.
- **Reduced motion:** a static frame and no running loop.
- **Page speed:** LCP element is still the H1; CLS stays at 0.
- **Checks:** no horizontal overflow, contrast scan of the text column, and `tsc`, `eslint` and `next build` pass.

## 7. Decisions (confirmed 29 Sep 2026)

| # | Decision | Chosen |
|---|---|---|
| D1 | Colours | **Purple + mint**, following the site tokens in both themes |
| D2 | Phones | **Compact 220 px swarm** below the CTAs, about 700 particles |
| D3 | Cursor interaction | **Yes, subtle:** scatter-and-reform on hover, a ripple on tap |

**Estimate:** about half a day, most of it the particle engine and tuning. No new packages.
