# Click to split: plan

> **Status (29 Sep 2026):** implemented in `SwarmCanvas.tsx`.
> Two tuning changes beyond the plan:
> - Particle speeds are capped.
> - Small-swarm centres have a hard wall at 75% of the sphere radius, so rapid clicks stay contained.

> **Goal:** clicking or tapping the swarm in the Pricing section makes the word **"Swarm"** break apart into several **small swarms**. These are little balls of particles that fly out, roam around inside the sphere, then regroup into the word.
> **Why:** today a click only pushes nearby particles for a moment (a small ripple), which is easy to miss. Splitting into small swarms is a visible, satisfying reaction, and it tells the product story: one team splitting into specialist agents.
> **File:** `components/landing/ui/SwarmCanvas.tsx` only. The Pricing layout doesn't change.

## 1. What the visitor sees

| Time after click | What happens |
|---|---|
| 0 – 0.4 s | **Burst:** the word breaks apart; particles fly outward from the click point. A mint ring spreads out from the click, and the sphere shell swells about 4%. |
| 0.4 – 3.5 s | **Roam:** the particles gather into **5 small swarms**, one per letter (S, w, a, r, m). Each is a swirling ball that drifts around inside the sphere; they avoid each other and never leave the sphere. |
| 3.5 – 4.4 s | **Regroup:** the small swarms fly back and the word "Swarm" re-forms with a slight overshoot. The sphere settles back. |

- **Clicking during roam:** the small swarms scatter again from the new click point, and the timer restarts.
- **Clicking during regroup:** they split again. Rapid clicks never break the animation.
- **Everything else stays:** the pointer repulsion, twinkles, sphere turning, heartbeat ring and theme colours all keep working in every state.

## 2. How it works (engine changes)

**1. State machine:** `formed → burst → roam → regroup → formed`, with a start time per state. Each particle's target changes with the state; the existing spring physics produces the flight between targets, so there's no new animation system.

**2. Groups, one per letter:**
- When sampling the word, record which letter each particle came from, using the character boundaries measured with `measureText`.
- The word "Swarm" therefore splits naturally into its 5 letters, and each letter's particles become one small swarm.
- If the word ever changes, the number of groups follows the number of letters, capped at 7.

**3. Small-swarm centres:**
- Each centre moves on its own smooth wandering path (steering toward a slowly changing random point).
- Centres push away from each other (minimum gap ≈ 18% of the canvas) and are held inside ≈ 70% of the sphere radius.
- On burst, each centre starts from its letter's position and launches outward, away from the click point.

**4. Particle target while roaming:**
- The target is the group centre plus a personal orbit: each particle gets a radius (25–100% of the swarm radius, so the core is denser) and a spin speed, both random.
- Result: each small swarm looks like a rotating, breathing ball.

**5. Physics tuning per state:**
- **burst:** the spring is softened so particles fly loose.
- **roam:** a medium spring, so the balls look alive but hold together.
- **regroup:** the formed-word spring.

**6. Accents:**
- The mint click ring (already there) grows larger.
- Each small swarm's core gets a mint tint while roaming, the same colour as the "live/running" dots.
- The heartbeat ring pauses while split.

## 3. Accessibility, touch and performance
- **Keyboard:** wrap the canvas in a real `<button>` labelled "Split the swarm" (it gets the site's normal focus ring). Enter or Space splits it at the centre. The canvas itself stays `aria-hidden`.
- **Touch:** a tap splits it, and scrolling past it still works (`touch-action: pan-y`). A tap won't also fire the hover repulsion.
- **Reduced motion:** a click shows a still frame of the 5 small swarms; the next click shows the still word. No motion.
- **Performance:** same particle count and one extra loop over 5–7 centres, far below 0.1 ms per frame. The loop still pauses off screen and in hidden tabs.
- **Hint:** a small caption under the swarm, "Click the swarm" ("Tap the swarm" on touch screens), in the site's 12 px mono style. It hides after the first split.

## 4. Steps
1. Record each particle's letter group during sampling.
2. Add the state machine and the small-swarm centres (wander, separation, keeping them inside the sphere).
3. Choose each particle's target by state, and add the per-state spring settings.
4. Burst launch from the click point; timer restart on repeated clicks.
5. Mint core tint, a bigger click ring, sphere swell, and the heartbeat pausing while split.
6. The button wrapper with keyboard support, plus the hint caption.
7. The reduced-motion still frames.
8. Tuning pass in both themes at 220, 320 and 440 px.

## 5. Verification
- A temporary debug hook (removed afterwards) to trigger a split, step the simulation, and snapshot the canvas at 0.2 s, 1.5 s, 3.0 s and 4.6 s: burst, roam, regroup and formed.
- **Visual checks:** 5 separate balls during roam; none leaves the sphere; the word is fully readable again by 4.6 s.
- **Clicks:** 10 clicks in 2 seconds cause no errors, stuck particles or runaway speeds.
- **Other inputs:** keyboard Enter/Space splits it and focus is visible; reduced motion swaps between the two still frames; touch scrolling still works.
- **Frame cost:** step + draw < 4 ms at 440 px.
- **Build:** `tsc`, `eslint` and `next build` pass.

## 6. Decisions (confirmed 29 Sep 2026)

| # | Question | Chosen |
|---|---|---|
| D1 | How it splits | **One small swarm per letter** (5), with no labels |
| D2 | Returning | **Automatic after about 3.5 s** |
| D3 | Hint | **"Click the swarm" / "Tap the swarm"**, hidden after the first split |

**Estimate:** about 2–3 hours including tuning. No new packages.
