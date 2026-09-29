# Phase 1 Homepage and SEO Remediation Plan

> **Objective:** Make the standalone AI Swarm homepage accurately sell the live Phase 1 product—**Validate + Plan**—and give search engines, social crawlers, and prospective users enough evidence to understand and trust it.
>
> **Product rule:** `stageAvailability` remains the source of truth for product capability. A separate launch configuration may describe access status (`scheduled`, `open`, or `closed`), but a browser countdown must never enable a capability.

## 1. Current state verified in this repository

The original review is directionally correct, but part of the previous plan referred to the source application rather than this standalone site.

| Area | Current state | Required correction |
|---|---|---|
| Authentication proxy | This repository has **no `proxy.ts`** | Remove all proxy work from this plan |
| Metadata base | `app/layout.tsx` already defines `metadataBase` | Centralize the site URL and prevent a production localhost fallback |
| Search positioning | Title and H1 lead with “Launch your SaaS” | Lead with “Validate and plan your SaaS” until Build ships |
| Homepage scope | Build, deploy, stack, workspace, engine, and 15 teams dominate the page | Keep live outputs and proof above the roadmap; move future-detail off the homepage |
| Technical SEO | No canonical, complete OG/Twitter metadata, OG image, robots, sitemap, or JSON-LD | Add the standard Next.js 16 metadata files and truthful structured data |
| Proof | No genuine sample report or methodology page | Publish a real redacted report and explain sources, checks, and limitations |
| Pricing | Three `[PRICE]` placeholders are rendered | Publish approved prices or show “Free during beta”; never ship placeholders |
| Links | Footer, FAQ contact, Studio contact, and DevKit Market use `#` | Replace with real destinations or remove them |
| Launch message | Announcement says “Private beta is open”; review proposes a future countdown | Choose one access state before implementing countdown UI |
| Analytics | No conversion instrumentation | Track the CTA-to-registration funnel with placement attribution |

Next.js 16 implementation must follow the local documentation in `node_modules/next/dist/docs/`. The relevant conventions are static `metadata`, `app/robots.ts`, `app/sitemap.ts`, and `app/opengraph-image.tsx`/`twitter-image.tsx`.

## 2. Decisions required before implementation

These are product inputs, not engineering guesses.

| ID | Decision | Recommended default | Blocks |
|---|---|---|---|
| D1 | Production site URL | Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin | Canonical, sitemap, OG URLs, JSON-LD |
| D2 | Access state: scheduled or already open | If registration is usable now, keep `open` and **do not show a countdown** | Announcement and countdown |
| D3 | If scheduled: exact UTC launch timestamp and display timezone | Full ISO timestamp, e.g. `2026-10-15T04:30:00.000Z`; confirm before use | Countdown |
| D4 | Phase 1 price | “Free during beta” until a price is approved | Pricing and Offer schema |
| D5 | Primary CTA destination | Existing app registration URL with `?source=` attribution | All CTAs |
| D6 | Contact and legal destinations | Real support email plus published Privacy and Terms URLs | Footer and registration readiness |
| D7 | Sample report | One genuine, redacted Phase 1 run approved for public use | Proof section and sample page |
| D8 | Analytics provider and consent requirements | Use the product’s existing provider; keep a typed no-op adapter until configured | Funnel reporting |

Work that does not depend on these decisions—copy structure, component refactoring, robots/sitemap scaffolding, and tests—can proceed in parallel. Unresolved values must hide the affected UI rather than render placeholders.

## 3. Step-by-step execution checklist

Follow these steps in order. Do not start a later step if its dependency is unresolved; hide incomplete UI instead of shipping placeholder content.

### Step 0 — Lock the launch inputs

Confirm D1–D8 from the previous section in one launch brief. The minimum required to start is the production URL, whether access is already open, the CTA destination, the pricing fallback, and the contact address.

**Done when:** there is one approved value for each input, or the documented fallback is explicitly accepted.

### Step 1 — Record the baseline

1. Run `npm run lint` and `npm run build`.
2. Capture the current homepage at 375, 768, and 1440 px.
3. Record the current rendered word count and Lighthouse SEO/accessibility/CLS scores.
4. List every current CTA, placeholder, dead `#` link, and unpublished destination.

**Done when:** the team has before-state evidence and knows whether any pre-existing build error must be handled separately.

### Step 2 — Centralize site and launch configuration

1. Add a site configuration module containing the brand name, marketing origin, application origin, contact address, and public routes.
2. Add a separate launch configuration with `status: "scheduled" | "open" | "closed"` and an optional UTC timestamp.
3. Keep `stageAvailability` unchanged as the capability source of truth.
4. Reject or visibly warn about a localhost marketing origin in a production build.

**Files:** `lib/site.ts`, `components/landing/data/launch.ts`, `components/landing/data/content.ts`, `.env.example`.

**Done when:** metadata, links, CTA state, and future countdown logic can all read from one consistent configuration.

### Step 3 — Fix the Phase 1 message

1. Change the page title, description, H1, badge, and hero paragraph to Validate + Plan.
2. Name the concrete deliverables in the first viewport.
3. Remove Build and Launch presets from the live hero demo.
4. Move the broader “Launch your SaaS with an AI team” vision into the roadmap.

**Files:** `app/page.tsx`, `components/landing/sections/Hero.tsx`, `components/landing/sections/HeroDemo.tsx`, `components/landing/data/content.ts`.

**Done when:** nothing in the first viewport implies that coding, deployment, launch execution, or operation is currently available.

### Step 4 — Repair the conversion path

1. Select the CTA label from launch status: Get beta access, Validate my idea, or Join the waitlist.
2. Add `?source=` attribution to announcement, hero, sample, pricing, and final CTA links.
3. Replace price placeholders with approved prices or “Free during beta.”
4. Show future plans as roadmap cards without purchasable prices.
5. Replace every `href="#"`; remove destinations that do not exist.
6. Connect FAQ and Studio contact actions to a real email or form.

**Files:** `content.ts`, `AnnouncementBar.tsx`, `Hero.tsx`, `Pricing.tsx`, `Faq.tsx`, `FinalCta.tsx`, `Footer.tsx`.

**Done when:** a repository search finds no visible placeholder or dead anchor, and every CTA lands at the intended destination.

### Step 5 — Rebuild the homepage information hierarchy

1. Reorder the page so live outcomes and evidence come before future capability.
2. Add a “What you receive” section sourced from Validate and Plan deliverables.
3. Add “How research works” and “What validation cannot prove.”
4. Reduce How It Works to four Phase 1 steps.
5. Condense Stages into a roadmap.
6. Remove Team, Workspace, Stack, Engine, and deployment sections from the homepage.
7. Reduce the focused FAQ to the questions needed to evaluate Phase 1.
8. Keep the rendered page between 1,200 and 1,600 useful words.

**Files:** `LandingPage.tsx`, `HowItWorks.tsx`, `Stages.tsx`, `Faq.tsx`, plus new Deliverables and Methodology sections.

**Done when:** all content before Roadmap describes live functionality and the page remains coherent after the future-detail sections are removed.

### Step 6 — Add real proof

1. Generate one genuine Phase 1 report from an approved example idea.
2. Redact personal, licensed, or confidential information.
3. Verify sources, dates, competitor data, assumptions, and the recommendation.
4. Publish a visible excerpt plus a downloadable accessible document.
5. Add a methodology and limitations explanation next to the proof.
6. If approval is not complete, keep the sample section absent—not disabled or empty.

**Files:** `public/samples/`, a new sample section, and optionally `app/sample-validation-report/page.tsx`.

**Done when:** a visitor can inspect a real output, understand how it was produced, and distinguish evidence from AI inference.

### Step 7 — Complete page metadata and social previews

1. Reuse the centralized production origin in `metadataBase`.
2. Add the homepage canonical URL.
3. Complete Open Graph and Twitter fields with Phase 1 copy.
4. Remove the `keywords` field.
5. Create and verify a 1200×630 social image with meaningful alt text.

**Files:** `app/layout.tsx`, `app/page.tsx`, `app/opengraph-image.tsx`, and `app/twitter-image.tsx` only if it needs a different image.

**Done when:** rendered source contains one canonical and absolute, correct OG/Twitter image URLs.

### Step 8 — Add crawl and structured-data foundations

1. Add `app/robots.ts`, allowing the public marketing site and referencing the sitemap.
2. Add `app/sitemap.ts` with only routes that exist in the same release.
3. Add Organization and WebSite JSON-LD.
4. Add SoftwareApplication JSON-LD using live features only.
5. Add Offer data only when price and availability are approved.
6. Do not add FAQ schema.

**Done when:** the production build serves valid robots, sitemap, and JSON-LD; the sitemap contains no redirect, 404, or planned route.

### Step 9 — Add the countdown only if launch is scheduled

1. Skip this step when access status is already `open`.
2. Server-render the fixed launch date in a `<time>` element.
3. Hydrate a UTC-based remaining time calculated from `Date.now()`.
4. Pause second-level updates in hidden tabs and recompute on return.
5. Use tabular numerals and reserved widths.
6. Avoid per-second `aria-live` announcements.
7. Test scheduled, exactly-zero, expired, open, and closed states.
8. At zero, change display text only; never unlock the product in the browser.

**Files:** `launch.ts`, a new `LaunchCountdown.tsx`, `AnnouncementBar.tsx`, and the mobile hero launch card if required.

**Done when:** the date is readable without JavaScript, the timer never becomes negative, and it creates no visible layout shift.

### Step 10 — Add funnel analytics

1. Add a typed analytics adapter that is a no-op without configuration.
2. Track announcement/countdown view, CTA clicks, registration start/completion, and sample view/download.
3. Include placement and access state in every relevant event.
4. Prevent duplicate impression and completion events.
5. Confirm consent handling before enabling analytics in production.

**Done when:** one test journey produces a complete, non-duplicated funnel from landing-page CTA to registration completion.

### Step 11 — Run responsive and accessibility QA

1. Test 375, 768, 1024, and 1440 px widths.
2. Verify no horizontal scrolling, clipped countdown content, or broken anchor offsets.
3. Keyboard-test navigation, FAQ accordions, CTAs, and downloads.
4. Verify visible focus, semantic heading order, alt text, contrast, and useful link names.
5. Keep interactive targets at least 44×44 px where practical.
6. Verify reduced-motion behavior and ensure no information depends on hover.

**Done when:** all checks pass at every target viewport and Lighthouse accessibility is at least 95.

### Step 12 — Run production SEO QA and release

1. Run `npm run lint` and `npm run build`.
2. Start the production build and request `/`, `/robots.txt`, `/sitemap.xml`, and the OG image.
3. Inspect rendered metadata and validate JSON-LD.
4. Test X, LinkedIn, and Slack previews.
5. Run Lighthouse against the deployed HTTPS URL; target SEO ≥ 95 and CLS < 0.05.
6. Complete a real CTA-to-registration flow.
7. Submit the sitemap to Google Search Console and Bing Webmaster Tools.

**Done when:** every release criterion passes on the production domain, not only localhost.

### Step 13 — Expand organic landing pages after launch

Use Search Console queries and real customer language to prioritize `/methodology`, `/sample-validation-report`, `/roadmap`, and the keyword-specific pages. Publish one page at a time with unique examples and internal links; add it to the sitemap in the same release.

**Done when:** every indexed page serves a distinct intent and none is a lightly rewritten copy of the homepage.

## 4. Detailed delivery requirements

### Milestone 1 — Truthful positioning and working conversion path (P0)

**Outcome:** A visitor immediately understands what is available now and every visible action works.

1. Create one site configuration module for brand name, production origin, app origin, contact address, and public routes.
2. Separate capability status from access status:
   - `stageAvailability`: Validate and Plan are live; Build, Launch, and Operate remain roadmap items.
   - `phaseOneLaunch.status`: `scheduled`, `open`, or `closed`.
3. Replace homepage metadata and hero messaging:
   - Title: `Validate Your SaaS Idea with an AI Team | AI Swarm`
   - Description: `Research your market, compare competitors, test pricing, and get a PRD and MVP plan from an AI product team. Start with a free SaaS validation report.`
   - H1: `Validate and plan your SaaS with an AI team.`
   - Supporting copy names the actual outputs: market research, competitor analysis, pricing recommendations, MVP scope, and PRD.
4. Make one CTA vocabulary consistent with access state:
   - Scheduled: `Get beta access`
   - Open: `Validate my idea`
   - Closed: `Join the waitlist`
5. Add a `source` value to hero, announcement, pricing, sample, and final CTA URLs.
6. Replace `[PRICE]` with an approved price or `Free during beta`. Move future plans into a compact roadmap block without prices.
7. Convert footer data to `{ label, href }`. Remove links to pages that do not exist. Replace every `href="#"` with a real URL, `mailto:` link, or no link.
8. Remove future-capability wording from the Phase 1 FAQ. Keep roadmap answers explicitly labeled as future work.

**Acceptance criteria**

- No `[PRICE]`, `[ADD ...]`, or `href="#"` remains in rendered landing content.
- The title, H1, first viewport, pricing, and primary CTA describe only Validate + Plan.
- Build, Launch, and Operate are visibly labeled as roadmap items.
- Every CTA resolves to the correct registration or waitlist destination and carries a source value.

### Milestone 2 — Focus the homepage around evidence (P0)

**Outcome:** Live value and proof appear before the long-term vision.

Target 1,200–1,600 words and use this section order:

1. Announcement/access status
2. Phase 1 hero and one primary CTA
3. Real example: idea → analysis → decision
4. What you receive: report, competitor matrix, pricing analysis, SEO opportunities, PRD, MVP scope, go/pivot/no-go recommendation
5. How research works: source collection, specialist analysis, fact-checking, and founder approval
6. What AI validation can and cannot prove
7. Real sample report preview and download
8. Four-step Phase 1 flow: describe idea → approve research plan → watch analysis → download deliverables
9. “What app builders skip” comparison
10. Phase 1 pricing
11. Compact product roadmap
12. Focused FAQ
13. Final CTA

Move `Team`, `Workspace`, `Stack`, `Engine`, and deployment detail out of the homepage. Do not create a broad `/product` page merely to preserve every existing section; publish it only when its copy is clearly framed as a roadmap and provides unique value.

**Proof requirements**

- The sample must come from a real run, not a fabricated mockup.
- Redact personal or confidential data.
- Show enough of the output to verify specificity: cited sources, dated evidence, competitor rows, assumptions, and recommendation.
- Publish a short methodology statement beside it.
- If no approved sample exists, hide the preview and download controls; do not use an empty card.

**Acceptance criteria**

- All sections before Roadmap describe live capabilities only.
- A visitor can identify the inputs, outputs, turnaround expectation, evidence method, and limitations without reading the roadmap.
- Mobile order matches desktop information priority; no proof is hover-only.

### Milestone 3 — Technical SEO and social sharing (P1)

**Outcome:** Crawlers receive complete, absolute, internally consistent metadata.

1. Add `lib/site.ts` (or equivalent) and use it from layout metadata, page metadata, robots, sitemap, and JSON-LD.
2. Keep `metadataBase`, but validate that production cannot emit `localhost` URLs.
3. In `app/page.tsx`:
   - add `alternates.canonical: "/"`;
   - add `openGraph.url`, `siteName`, locale, title, and description;
   - add a `summary_large_image` Twitter card;
   - remove the `keywords` field.
4. Add a 1200×630 `app/opengraph-image.tsx` with exported `alt`, `size`, and `contentType`. Add a Twitter image only if it differs; otherwise explicitly reuse the same visual and verify both tags.
5. Add `app/robots.ts`. This standalone marketing site can allow `/` and reference the absolute sitemap URL; do not copy private-route exclusions from the application repository.
6. Add `app/sitemap.ts`. Include only published, canonical, indexable URLs. Do not list planned routes.
7. Add homepage JSON-LD:
   - `Organization`
   - `WebSite`
   - `SoftwareApplication` only with live features
   - `Offer` only after price and availability are public
8. Do not add FAQ schema.

**Acceptance criteria**

- Page source contains one canonical and absolute OG/Twitter image URLs.
- `/robots.txt`, `/sitemap.xml`, and the social image return `200` in a production build.
- Sitemap contains no 404, redirect, placeholder, or noindex route.
- JSON-LD passes Schema Markup Validator and makes no future-feature claims.
- Social previews render correctly in at least two independent preview tools.

### Milestone 4 — Countdown and analytics (P1, conditional)

**Outcome:** Launch urgency is accurate, accessible, stable, and measurable.

Implement a countdown **only when `phaseOneLaunch.status === "scheduled"` and D3 is confirmed**. If registration is already open, show a stable “Private beta is open” message instead.

Countdown behavior:

- Server-render a fixed human-readable `<time dateTime="...">` launch date.
- Hydrate the remaining time on the client from the UTC timestamp.
- Recompute from `Date.now()`; do not decrement a local counter.
- Pause second-level updates while the tab is hidden and recompute on return.
- Use tabular numerals and reserved widths to avoid layout shift.
- Do not use `aria-live` for every tick; expose a readable full-duration label.
- At zero, change the display to “Private beta is live” without changing `stageAvailability` or granting access.
- Never show negative units or a permanent zero timer.

Track:

- `launch_countdown_viewed` (scheduled state only)
- `launch_countdown_cta_clicked`
- `beta_registration_started`
- `beta_registration_completed`
- `sample_report_viewed`
- `sample_report_downloaded`

Every CTA event must include `placement` (`announcement`, `hero`, `sample`, `pricing`, or `final_cta`) and access state.

**Acceptance criteria**

- Scheduled, open, closed, exactly-zero, and expired states have deterministic tests.
- The date remains understandable without JavaScript.
- Timer operation causes no visible layout shift and respects reduced motion.
- Funnel events fire once per intended action and contain placement data.

### Milestone 5 — Search-intent pages (P2, after proof is live)

Create pages only when each has unique, useful content:

1. `/sample-validation-report`
2. `/methodology`
3. `/roadmap`
4. `/saas-idea-validation`
5. `/saas-competitor-analysis`
6. `/saas-market-research`
7. `/prd-generator`

Each page needs a distinct title, H1, canonical, examples, and internal links. Do not duplicate the homepage into keyword variants. Add a route to the sitemap only in the same change that publishes the route.

## 5. Repository change map

| File or area | Planned work |
|---|---|
| `app/layout.tsx` | Brand metadata defaults; centralized, production-safe `metadataBase` |
| `app/page.tsx` | Phase 1 metadata, canonical, full OG/Twitter fields, homepage JSON-LD |
| `app/robots.ts` | Public crawl policy and sitemap reference |
| `app/sitemap.ts` | Published canonical routes only |
| `app/opengraph-image.tsx` | 1200×630 share image with alt metadata |
| `components/landing/data/content.ts` | Phase-aware hero/CTA/pricing/FAQ/footer content; no placeholders |
| `components/landing/data/launch.ts` | Access state and optional confirmed UTC timestamp |
| `components/landing/LandingPage.tsx` | Evidence-first section order; future-detail sections removed |
| `components/landing/sections/Hero.tsx` | Validate + Plan promise and output-led supporting copy |
| `components/landing/sections/AnnouncementBar.tsx` | Open/scheduled/closed state presentation |
| `components/landing/sections/Pricing.tsx` | Live Phase 1 offer first; roadmap plans demoted |
| `components/landing/sections/Faq.tsx` | Focused Phase 1 questions and working contact link |
| `components/landing/sections/Footer.tsx` | Real route data only |
| New proof components/pages | Deliverables, methodology/limitations, sample preview, optional search pages |

## 6. Verification plan

### Automated

- `npm run lint`
- `npm run build`
- Search the repository for placeholders and dead anchors.
- Unit-test launch-state formatting and countdown boundaries if the countdown is built.
- In a production server, request `/`, `/robots.txt`, `/sitemap.xml`, and the OG image and verify status, content type, and absolute URLs.

### Browser and accessibility

- Test 375, 768, 1024, and 1440 px widths with no horizontal scroll.
- Keyboard-test navigation, FAQ controls, CTAs, and sample download.
- Verify visible focus, 44×44 px interactive targets where practical, text contrast, and reduced-motion behavior.
- Confirm the countdown does not shift layout and does not announce every second.

### SEO and release

- Run Lighthouse against the deployed production URL: target SEO ≥ 95, accessibility ≥ 95, and CLS < 0.05.
- Validate JSON-LD and inspect the rendered source for canonical, OG, and Twitter tags.
- Test X, LinkedIn, and Slack previews.
- Submit the sitemap to Google Search Console and Bing Webmaster Tools.
- After indexing, verify Google’s selected canonical and monitor queries and the CTA funnel.

## 7. Recommended implementation sequence

| Slice | Work | Dependency |
|---|---|---|
| 1 | Resolve D1–D6; implement site/access config, Phase 1 copy, CTAs, pricing fallback, and dead-link cleanup | Product inputs |
| 2 | Reorder and shorten the homepage; add deliverables and methodology/limitations | None |
| 3 | Publish and integrate the genuine sample report | D7 |
| 4 | Add canonical, OG/Twitter image, robots, sitemap, and JSON-LD | D1; D4 for Offer schema |
| 5 | Add countdown only if scheduled; add analytics adapter and funnel events | D2, D3, D8 |
| 6 | Run production QA and submit sitemap | Deployment |
| 7 | Build unique search-intent pages based on real usage and Search Console data | Proof live and initial data |

## 8. Definition of done

- [ ] The homepage sells Validate + Plan as the live product; future stages are clearly roadmap items.
- [ ] The access message is internally consistent: scheduled with a valid countdown, or open without one.
- [ ] No visible placeholders or dead links remain.
- [ ] A genuine sample report and methodology/limitations explanation are available, or the sample UI is intentionally hidden.
- [ ] Canonical, OG/Twitter metadata, robots, sitemap, and JSON-LD are valid and production-safe.
- [ ] Pricing and structured data contain only approved public claims.
- [ ] All CTA destinations work and analytics include placement attribution.
- [ ] Responsive, keyboard, reduced-motion, and countdown boundary checks pass.
- [ ] Production Lighthouse meets the release targets and the sitemap is submitted.
