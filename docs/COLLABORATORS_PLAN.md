# "Built by" collaborators section: plan

> **Goal:** show the two people behind AI Swarm, Nikhil Anand and Tripti Shakya, as two profile cards under one shared heading. Each card has a small photo, name, role, company, a short description, and LinkedIn, GitHub, Reddit and X links.
> **Why it matters:** the homepage has no named humans today. The footer says "Built by a developer · for developers" with no name. Solo founders trust indie makers they can see and look up.

## 0. Inputs

| Item | Nikhil Anand | Tripti Shakya |
|---|---|---|
| Photo | `public/nikhil-anand.png`, 240 × 240, ready | `public/tripti-fav.png`, 1086 × 1448, 1.9 MB, **needs a square crop** |
| Role | Software Developer – Team Lead | Full Stack Developer |
| Company (shared) | Rubenius Interior Wellbeing LLP, Bengaluru | Rubenius Interior Wellbeing LLP |
| Description | Drafted from devkitmarket.com/about-me (see Step 2) | Neutral placeholder (see Step 2); edit any time |
| LinkedIn | https://linkedin.com/in/nikhilanand86 | https://www.linkedin.com/in/tripti-shakya-602097281/ |
| GitHub | https://github.com/niks-nikhil-anand | https://github.com/triptishakya-dev |
| Reddit | **Waiting for URL from Nikhil** | https://www.reddit.com/user/Huge-Leg-8072/ |
| X | **Waiting for URL from Nikhil** | https://x.com/ShakyaTrip48522 |

- Tripti's LinkedIn URL arrived with `?isSelfProfile=true`. That parameter only applies when she's signed in, so the page will use the clean URL above.
- A link with no URL is **hidden** rather than rendered as a dead icon, the same rule the site already applies to the contact email.

## Step 1: Prepare the photos
1. Crop Tripti's portrait to a head-and-shoulders square centred on her face. Export it at 256 × 256 (sharp at 2× for a 64–72 px avatar) to `public/team/tripti-shakya.png`, targeting under 60 KB.
2. Copy Nikhil's photo to `public/team/nikhil-anand.png`. It's already square, and this keeps both team images in one folder.
3. Keep the originals untouched. Render both through `next/image` with `width`/`height` 72 and `sizes="72px"`, which gives automatic WebP/AVIF and lazy loading.

## Step 2: Content data (`components/landing/data/content.ts`)
Add a typed `collaborators` array next to the other content, so copy changes never touch the layout:

```ts
type Social = { kind: "linkedin" | "github" | "reddit" | "x"; href: string };
type Collaborator = {
  name: string; role: string; company: string; location: string;
  photo: string; bio: string; focus: string[]; socials: Social[];
};
```

**Draft copy (for your approval):**
- **Section eyebrow:** `THE TEAM`
- **Section title:** "Built by two developers, *not a faceless AI company.*"
- **Section description:** "AI Swarm is designed and built by two engineers at Rubenius Interior Wellbeing in Bengaluru. We use it on our own ideas first."
- **Nikhil Anand**, *Software Developer – Team Lead, Rubenius Interior Wellbeing LLP*
  - **Bio:** "Full-stack developer who ships production apps with Next.js, Node.js and AWS, and builds AI workflows with LangChain and RAG. Also the founder of DevKit Market."
  - **Focus chips:** `Product & engineering` · `AI workflows`
- **Tripti Shakya**, *Full Stack Developer, Rubenius Interior Wellbeing LLP*
  - **Bio (placeholder):** "Full stack developer at Rubenius Interior Wellbeing, building AI Swarm's product experience across the frontend and backend."
  - **Focus chips:** `Full-stack` · `Product experience`

## Step 3: Brand icons (`components/landing/ui/SocialIcon.tsx`)
- The existing `Icon` component draws stroke outlines. Brand logos need filled paths, so add a small `SocialIcon` with the LinkedIn, GitHub, Reddit and X glyphs in `currentColor`.
- Each link is a 40 × 40 px round button (44 px on touch sizes, matching the responsive plan).
- Each link has an `aria-label` such as "Tripti Shakya on GitHub" and opens in a new tab (`target="_blank" rel="noopener noreferrer"`).

## Step 4: Section component (`components/landing/sections/Team.tsx`)
`Team.tsx` already exists but isn't used on the homepage: it's the old 15-agent "teams" grid. Two options:
- **(a) Recommended:** create `Collaborators.tsx` and leave `Team.tsx` alone.
- **(b)** Rename or delete the old file (it would need your OK).

**Layout** (same `Section`, `SectionHeader` and `Card` as every other section):
- **Header:** eyebrow, title and description, left-aligned like the other sections.
- **Cards:** two, side by side from `md:` (768 px) and stacked on phones. Each card contains:
  1. A 72 px round photo with a 2 px ring (`ring-brand/30`), with name and role beside it.
  2. The company as a line with an icon: "Rubenius Interior Wellbeing LLP · Bengaluru".
  3. The bio: 2–3 lines, `text-sm text-muted`.
  4. The focus chips (`Chip`).
  5. A divider, then the row of four social buttons.
- **Shared company:** a small strip under the cards, "Both at Rubenius Interior Wellbeing LLP", so "same company" is stated once instead of only repeated inside each card.
- **Themes:** tokens only (`bg-panel`, `border-line`, `text-fg`…). Both themes work automatically, and no `border-dashed` without `border-0` (this site runs without Tailwind preflight).

## Step 5: Placement and navigation (confirmed: before FAQ)
- **Where:** between **Roadmap** and **FAQ**. Visitors see who's behind the product right before their questions and the waitlist form. Section id: `team`.
- **Footer:** add "Team" under RESEARCH, and replace "Built by a developer · for developers" with "Built by Nikhil Anand & Tripti Shakya".
- **Navbar:** leave it alone; it already has 7 links. It's optional as a `secondary` link if you want it.

## Step 6: SEO (`components/seo/JsonLd.tsx`)
Add two `Person` entries, each with:
- `name`, `jobTitle` and `image`;
- `worksFor`: an Organization for Rubenius Interior Wellbeing LLP;
- `sameAs`: their profile URLs.

Link them to the `SoftwareApplication` as its `creator`. This helps name searches and the product's author signals, and uses only the facts shown on the page.

## Step 7: Verification
- 320, 375, 768, 1024 and 1440 px: no overflow; cards stack below 768 px and sit side by side from 768 px. Desktop sections above and below keep their heights; the only change is the page getting taller by this section.
- Light and dark mode: the contrast scan shows 0 failures.
- Every social link: correct URL, opens in a new tab, and has an accessible name; tap target ≥ 44 px on touch sizes.
- Images: both served through `/_next/image`, under 20 KB each at the displayed size.
- JSON-LD passes the Rich Results test.
- `tsc`, `eslint` and `next build` pass.

## Files touched
`public/team/*` (new) · `data/content.ts` · `ui/SocialIcon.tsx` (new) · `sections/Collaborators.tsx` (new) · `LandingPage.tsx` · `sections/Footer.tsx` · `seo/JsonLd.tsx`
