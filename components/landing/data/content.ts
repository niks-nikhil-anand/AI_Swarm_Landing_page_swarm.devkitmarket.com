import { icons } from "./icons";
import type { Availability, Hue, RunStatus } from "./tones";
import { contactHref, site } from "@/lib/site";

/* ---------- Navigation ---------- */

export const routes = {
  start: "#waitlist",
  announcement: "#waitlist",
  hero: "#waitlist",
  pricing: "#waitlist",
  finalCta: "#waitlist",
  navbar: "/#waitlist",
  signIn: `${site.appUrl}/login`,
  contact: contactHref,
} as const;

export type NavLink = {
  label: string;
  href: string;
  /** Homepage section id; drives the scroll-spy active state on "/". */
  section?: string;
  /** Hidden between lg and xl so the bar never wraps (same pattern as DevKit Market). */
  secondary?: boolean;
};

/** Absolute "/#…" links so the navbar also works from /methodology and future pages. */
export const navLinks: NavLink[] = [
  { label: "Home", href: "/", section: "product" },
  { label: "What you get", href: "/#deliverables", section: "deliverables" },
  { label: "How it works", href: "/#how", section: "how" },
  { label: "Pricing", href: "/#pricing", section: "pricing" },
  { label: "Roadmap", href: "/#roadmap", section: "roadmap", secondary: true },
  { label: "FAQ", href: "/#faq", section: "faq", secondary: true },
  { label: "Methodology", href: "/methodology", secondary: true },
];

/* ---------- Stages + availability ---------- */

export type StageKey = "validate" | "plan" | "build" | "launch" | "operate";

/**
 * What is live today. Flip one value when a phase ships and every section
 * that mentions the stage (hero, how it works, stages, pricing, FAQ) follows.
 * Phase 1 = validate + plan · Phase 2 = launch kit · Phase 3 = build · Phase 5 = operate.
 */
export const stageAvailability = {
  validate: "soon",
  plan: "soon",
  launch: "soon",
  build: "later",
  operate: "later",
} as const satisfies Record<StageKey, Availability>;

export const isLive = (key: StageKey) => (stageAvailability[key] as Availability) === "live";

export type Stage = {
  key: StageKey;
  n: string;
  name: string;
  hue: Hue;
  summary: string;
  agents: string[];
  deliverables: string[];
  /** Real sample output. Leave unset until a genuine file exists in /public/samples. */
  sample?: { label: string; href: string };
};

export const stages: Stage[] = [
  {
    key: "validate",
    n: "01",
    name: "Validate",
    hue: "mint",
    summary: "Is this worth building? Evidence from the market, not a hunch.",
    agents: ["Market", "Competitor", "Customer", "Community", "Pricing", "SEO", "Technical", "Fact-Checker"],
    deliverables: ["Validation report (PDF/DOCX)", "Competitor matrix (XLSX)", "SEO keyword list", "Go / pivot / no-go summary"],
  },
  {
    key: "plan",
    n: "02",
    name: "Plan",
    hue: "sky",
    summary: "Turn the research into a spec you could hand to any team.",
    agents: ["Product Manager", "UX Researcher", "Solution Architect", "Database Architect", "Security Architect"],
    deliverables: ["PRD, feature spec and MVP scope", "Personas and user journeys", "Architecture, DB schema, API spec", "Pitch deck (PPTX)"],
  },
  {
    key: "build",
    n: "03",
    name: "Build",
    hue: "amber",
    summary: "Design, code, test and deploy, with agents that run what they write.",
    agents: ["Design", "Frontend", "Backend", "Database", "Auth", "Payments", "AI", "QA", "Security", "DevOps"],
    deliverables: ["Design system and code prototype", "GitHub repo you own", "Test and browser QA report", "Deploy to Vercel, AWS or Google Cloud"],
  },
  {
    key: "launch",
    n: "04",
    name: "Launch",
    hue: "pink",
    summary: "Everything the launch needs, drafted and ready for your approval.",
    agents: ["SEO", "Content", "Docs", "Social", "Creative", "Email", "Launch Manager"],
    deliverables: ["Landing copy, SEO meta, sitemap", "Blog posts and product docs", "Product Hunt, Reddit, LinkedIn, X drafts", "Email sequence and launch checklist"],
  },
  {
    key: "operate",
    n: "05",
    name: "Operate",
    hue: "brand",
    summary: "After launch, a weekly loop that watches the numbers and proposes fixes.",
    agents: ["Analytics", "Growth", "Support", "Maintenance"],
    deliverables: ["Weekly metrics report", "Anomaly alerts", "Proposed copy, page and code fixes"],
  },
];

/** Research doesn't end at the report: each stage hands its files to the next. */
export const contextChain = ["Research", "PRD", "Design", "Code", "Marketing"];

export const stageByKey = Object.fromEntries(stages.map((s) => [s.key, s])) as Record<StageKey, Stage>;

/* ---------- The team ---------- */

export type Team = {
  name: string;
  stage: StageKey;
  icon: string;
  desc: string;
  agents: string[];
  /** What the team verifies end to end, not just generates. */
  flow?: string[];
};

export const teams: Team[] = [
  {
    name: "Research",
    stage: "validate",
    icon: icons.search,
    desc: "A Research Lead runs the specialists and produces the Research Pack, which becomes context for every team after it.",
    agents: ["Market", "Competitor", "Customer", "Community (read-only)", "SEO", "Pricing", "Technical", "Fact-Checker"],
  },
  {
    name: "Product",
    stage: "plan",
    icon: icons.flag,
    desc: "PRD, personas, journeys, feature spec, MVP scope, architecture, DB schema and API spec, all before any code.",
    agents: ["Product Manager", "UX Researcher", "Product Strategist", "Solution Architect", "Database Architect", "Security Architect"],
  },
  {
    name: "UI/UX & Design",
    stage: "build",
    icon: icons.layout,
    desc: "Designs in code first: flows, wireframes, tokens, components, responsive layouts and accessibility, then developer handoff.",
    agents: ["UX Architect", "UI Designer", "Design System", "Prototype", "Design QA"],
    flow: ["UX requirements", "Design system", "Code prototype", "Browser preview", "Visual QA", "Figma export"],
  },
  {
    name: "Frontend",
    stage: "build",
    icon: icons.code,
    desc: "A Frontend Lead with specialists for each layer of the default stack, checking its own work in a real browser.",
    agents: ["React", "Next.js", "TypeScript", "Tailwind", "shadcn/ui", "Accessibility", "Frontend QA"],
    flow: ["Build", "Browser test", "Screenshot", "Visual QA", "Fix"],
  },
  {
    name: "Backend",
    stage: "build",
    icon: icons.server,
    desc: "Runs the backend, tests every endpoint, and hands a working API to the frontend team, not just generated code.",
    agents: ["Node.js", "NestJS", "REST APIs", "WebSockets", "Authorization", "API QA"],
    flow: ["Write", "Run", "Test endpoints", "Hand off API"],
  },
  {
    name: "Database",
    stage: "build",
    icon: icons.db,
    desc: "Its own specialist on PostgreSQL + Prisma, from requirements to a schema that performs.",
    agents: ["PostgreSQL", "Prisma", "Redis"],
    flow: ["ERD", "Prisma schema", "Migrations", "Indexes", "Seed data", "Performance checks"],
  },
  {
    name: "Authentication",
    stage: "build",
    icon: icons.key,
    desc: "Starts from tested templates instead of writing auth from scratch on every run.",
    agents: ["Email + password", "OAuth", "Sessions", "Roles & permissions", "Password reset", "Email verification", "2FA", "Organizations"],
  },
  {
    name: "Payments",
    stage: "build",
    icon: icons.coin,
    desc: "Stripe for global, Razorpay for India. Subscriptions, one-time payments, plans, coupons, invoices and failed-payment handling.",
    agents: ["Stripe", "Razorpay", "Webhooks", "Subscriptions", "Invoices"],
    flow: ["Checkout", "Provider", "Webhook", "Database", "Subscription", "Entitlement"],
  },
  {
    name: "AI Integration",
    stage: "build",
    icon: icons.sparkle,
    desc: "One AIProvider layer, so your product isn't locked to a single model vendor.",
    agents: ["Anthropic", "OpenAI", "Gemini", "Embeddings", "RAG", "Vector DB", "Tool calling", "AI evals"],
  },
  {
    name: "QA & Security",
    stage: "build",
    icon: icons.test,
    desc: "A browser agent clicks through the real app: forms, checkout, sign-in and every screen size.",
    agents: ["Browser QA", "Test writer", "Visual QA", "Security reviewer"],
    flow: ["Build", "Browser agent", "Test", "Screenshot", "Fix"],
  },
  {
    name: "DevOps",
    stage: "build",
    icon: icons.refresh,
    desc: "A real deployment agent. It loads a skill per target instead of one hard-coded agent per cloud.",
    agents: ["Docker", "CI/CD", "Env vars", "Domains", "SSL", "DNS", "Monitoring", "Rollback"],
  },
  {
    name: "Content",
    stage: "launch",
    icon: icons.pen,
    desc: "Writes from your research and customers' real pain points, so the content isn't generic AI filler.",
    agents: ["Landing copy", "Blog", "Technical writer", "Docs", "Changelog", "Case studies", "Content QA"],
    flow: ["Research", "Pain points", "SEO research", "Content strategy", "Content"],
  },
  {
    name: "SEO",
    stage: "launch",
    icon: icons.trend,
    desc: "Keywords, search intent, SERP analysis, site architecture, metadata, structured data, sitemap, internal links and Search Console.",
    agents: ["Keywords", "SERP analysis", "Technical SEO", "Content briefs"],
    flow: ["Research", "SEO", "Content", "Developer", "Deploy"],
  },
  {
    name: "Marketing & Social",
    stage: "launch",
    icon: icons.users,
    desc: "Works from your research, product, brand and personas. Community research reads; social drafts; you approve and post.",
    agents: ["Positioning", "Messaging", "Social", "Email", "Creative", "Launch Manager"],
    flow: ["Read communities", "Draft", "Your approval", "You post"],
  },
  {
    name: "Operate",
    stage: "operate",
    icon: icons.chart,
    desc: "After launch: watches analytics, signups, revenue and errors, then proposes fixes for your approval.",
    agents: ["Analytics", "Growth", "Support", "Maintenance"],
    flow: ["Analytics", "Insight", "Proposed fix", "Your approval"],
  },
];

/* ---------- Built-in IDE + browser ---------- */

export const ideFiles = [
  { name: "app/", depth: 0 },
  { name: "page.tsx", depth: 1, active: true },
  { name: "pricing/", depth: 1 },
  { name: "components/", depth: 0 },
  { name: "api/", depth: 0 },
  { name: "prisma/", depth: 0 },
  { name: "schema.prisma", depth: 1 },
];

export const ideTerminal = [
  { cmd: true, text: "npm run dev" },
  { cmd: false, text: "✓ Ready on http://localhost:3000" },
  { cmd: true, text: "npm test" },
  { cmd: false, text: "✓ 42 passed · 0 failed" },
];

export const agentLoop = ["Write code", "Run it", "Open browser", "Inspect", "Screenshot", "Find the problem", "Fix", "Repeat"];

export const browserAbilities = ["Navigate pages", "Click and type", "Upload files", "Test forms", "Test checkout", "Test sign-in", "Responsive layouts", "Screenshots"];

/* ---------- Deploy flows ---------- */

export const deployTargets: { name: string; prompt: string; steps: string[] }[] = [
  {
    name: "Vercel",
    prompt: "Deploy my SaaS to Vercel.",
    steps: ["Detect Next.js", "Build", "Configure env", "Deploy", "Health check", "Production URL"],
  },
  {
    name: "AWS",
    prompt: "Deploy my SaaS to AWS.",
    steps: ["Inspect project", "Detect env vars", "Build Docker image", "Run tests", "Create infrastructure", "Push image", "Deploy", "Domain + SSL", "Health check", "Browser test", "Production URL"],
  },
  {
    name: "Google Cloud",
    prompt: "Deploy my SaaS to Google Cloud.",
    steps: ["Docker image", "Artifact Registry", "Cloud Run", "Cloud SQL", "Cloud Storage", "DNS", "Health check", "Production URL"],
  },
];

/* ---------- Engine: agents, skills, tools ---------- */

export const enginePillars: { name: string; body: string; icon: string; items: string[] }[] = [
  { name: "Agent Runtime", body: "Where agents work: their own browser, IDE, sandbox and memory.", icon: icons.terminal, items: ["Browser", "IDE", "Sandbox", "Memory"] },
  { name: "Tool Gateway", body: "Every real action goes through one gate that you control.", icon: icons.shieldCheck, items: ["Permissions", "Budgets", "Approvals", "Audit"] },
  { name: "Skill Registry", body: "Capabilities agents load on demand, added without new agents.", icon: icons.logo, items: ["Vercel", "AWS", "Google Cloud", "Docker", "Stripe", "Razorpay", "Next.js", "PostgreSQL"] },
];

export const engineChains: string[][] = [
  ["DevOps Agent", "AWS Deployment Skill", "Tool Gateway", "AWS APIs"],
  ["Payment Agent", "Stripe Skill", "Stripe Tool", "Stripe API"],
  ["Frontend Agent", "Next.js Skill", "IDE + Terminal + Browser", "Working UI"],
];

/* ---------- Hero demo ---------- */

export type DemoAgent = {
  name: string;
  icon: string;
  status: RunStatus;
  line: string;
  pct: number;
};

export type DemoPreset = {
  label: string;
  mobileLabel?: string;
  slug: string;
  goal: string;
  short: string;
  plan: string;
  result: string;
  agents: DemoAgent[];
  availability?: Availability;
};

const agent = (
  name: string,
  icon: string,
  status: RunStatus,
  line: string,
  pct: number,
): DemoAgent => ({ name, icon, status, line, pct });

const flagshipIdea = "an AI interview-prep SaaS for developers";

export const demoPresets: DemoPreset[] = [
  {
    label: "Validate my idea",
    mobileLabel: "Validate",
    slug: "validate-idea",
    goal: `Validate ${flagshipIdea}. Is there demand, and who already serves it?`,
    short: "Validate: AI interview-prep SaaS",
    plan: "Planning 6 tasks",
    result: "validation-report.pdf · go / pivot / no-go",
    availability: stageAvailability.validate,
    agents: [
      agent("Market", icons.search, "run", "Sizing the dev-hiring market…", 62),
      agent("Community", icons.users, "run", "Reading r/cscareerquestions…", 38),
      agent("Competitor", icons.target, "done", "Mapped 9 products", 100),
    ],
  },
  {
    label: "Competitor analysis",
    mobileLabel: "Competitors",
    slug: "competitor-analysis",
    goal: `Compare every product that already serves ${flagshipIdea}: features, pricing, gaps.`,
    short: "Competitors: interview-prep tools",
    plan: "Planning 4 tasks",
    result: "competitor-matrix.xlsx · pricing tiers · sources",
    availability: stageAvailability.validate,
    agents: [
      agent("Competitor", icons.target, "done", "Mapped 9 products", 100),
      agent("Pricing", icons.coin, "run", "Comparing pricing tiers…", 54),
      agent("Fact-check", icons.shieldCheck, "wait", "Waiting for matrix", 0),
    ],
  },
  {
    label: "Write my PRD",
    mobileLabel: "PRD",
    slug: "write-prd",
    goal: `Write the PRD for ${flagshipIdea}, using the validation research.`,
    short: "PRD: AI interview-prep SaaS",
    plan: "Planning 5 tasks",
    result: "prd.docx · personas · MVP scope · schema",
    availability: stageAvailability.plan,
    agents: [
      agent("Product", icons.flag, "run", "Scoping the MVP…", 47),
      agent("UX", icons.layout, "run", "Drafting user journeys…", 30),
      agent("Architect", icons.db, "wait", "Waiting for scope", 0),
    ],
  },
  {
    label: "Pitch deck",
    slug: "pitch-deck",
    goal: `Build an investor pitch deck for ${flagshipIdea} from the research and PRD.`,
    short: "Pitch deck: interview-prep SaaS",
    plan: "Planning 4 tasks",
    result: "pitch-deck.pptx · 12 slides · sources",
    availability: stageAvailability.plan,
    agents: [
      agent("Analyst", icons.chart, "done", "Market slides ready", 100),
      agent("Writer", icons.pen, "run", "Writing the story arc…", 58),
      agent("Designer", icons.layout, "run", "Laying out slides…", 22),
    ],
  },
];

/* ---------- Founder problem ---------- */

export const founderRoles = [
  "Product manager",
  "Researcher",
  "Designer",
  "Developer",
  "QA",
  "DevOps",
  "Marketer",
  "SEO",
  "Content writer",
  "Growth",
];

/* ---------- How it works ---------- */

export const steps: {
  n: string;
  title: string;
  body: string;
  code: string;
  /** One-line version of `code` for phones. */
  summary: string;
  stage?: StageKey;
}[] = [
  {
    n: "01",
    title: "Describe your idea",
    body: "One sentence is enough. Add notes, links or an existing repo if you have them.",
    code: "“AI interview-prep SaaS\nfor developers.”",
    summary: "“AI interview-prep SaaS for developers.”",
  },
  {
    n: "02",
    title: "Review the plan",
    body: "See the research questions, specialist agents and expected outputs before the run starts.",
    code: "market · competitors\npricing · SEO\ncustomers · technical\nfact-checking",
    summary: "market · competitors · pricing · SEO · fact-checking",
    stage: "validate",
  },
  {
    n: "03",
    title: "Watch the analysis",
    body: "Follow each source-backed task, finding and verification step as the team works.",
    code: "9 competitors mapped\n12 pain points tagged\npricing compared\nclaims checked ✓",
    summary: "9 competitors · 12 pain points · claims checked ✓",
    stage: "validate",
  },
  {
    n: "04",
    title: "Download the plan",
    body: "Get the validation report, decision summary, competitor matrix, PRD and MVP scope.",
    code: "validation-report.pdf\ncompetitors.xlsx\nprd.docx\nmvp-scope + next steps",
    summary: "validation-report.pdf · competitors.xlsx · prd.docx",
    stage: "plan",
  },
];

export const howFlow = ["Your idea", "Research plan", "Agent analysis", "Report + PRD"];

/* ---------- Live execution ---------- */

export const runAgents: {
  name: string;
  role: string;
  status: RunStatus;
  line: string;
  pct: number;
}[] = [
  { name: "Market Researcher", role: "validate · web", status: "run", line: "Sizing developer hiring spend", pct: 62 },
  { name: "Competitor Analyst", role: "validate · browser", status: "done", line: "Mapped 9 products", pct: 100 },
  { name: "Community Researcher", role: "validate · read-only", status: "run", line: "Reading r/cscareerquestions threads", pct: 41 },
  { name: "Pricing Analyst", role: "validate", status: "wait", line: "Waiting for competitor matrix", pct: 0 },
  { name: "Fact-Checker", role: "verification", status: "wait", line: "Waiting for findings", pct: 0 },
];

export const runStats = [
  { value: "14", label: "TASKS COMPLETED" },
  { value: "3", label: "AGENTS ACTIVE" },
  { value: "31", label: "CREDITS USED · EST. 44" },
];

export const runLog: { t: string; hue: Hue; who: string; msg: string }[] = [
  { t: "00:00", hue: "brand", who: "planner", msg: "split idea into validate → plan graph" },
  { t: "00:02", hue: "sky", who: "competitor", msg: "started · browser" },
  { t: "00:02", hue: "sky", who: "market", msg: "started · web search" },
  { t: "00:05", hue: "sky", who: "community", msg: "read subreddit rules · read-only" },
  { t: "00:41", hue: "mint", who: "competitor", msg: "done · 9 products mapped" },
  { t: "01:12", hue: "brand", who: "market", msg: "retried 1 failed fetch" },
  { t: "01:30", hue: "sky", who: "community", msg: "12 pain points tagged" },
  { t: "01:34", hue: "dim", who: "fact-checker", msg: "queued · waits on findings" },
];

/* ---------- App builders comparison ---------- */

/** 2 = strong · 1 = partial · 0 = none */
export type Coverage = 0 | 1 | 2;

/** `short` is the phone column header; screen readers always get `label`. */
export const compareColumns = [
  { label: "Research", short: "RSRCH", edge: true },
  { label: "Competitors", short: "COMP", edge: true },
  { label: "Sources", short: "SRC", edge: true },
  { label: "PRD", short: "PRD", edge: true },
];

export const compareRows: { name: string; ours?: boolean; cells: Coverage[] }[] = [
  { name: "AI app builders", cells: [0, 0, 0, 0] },
  { name: "Chat assistants", cells: [1, 1, 1, 1] },
  { name: "General AI agents", cells: [2, 1, 1, 1] },
  { name: "AI Swarm beta", ours: true, cells: [2, 2, 2, 2] },
];

export const comparePoints = [
  "Validate demand before committing to code",
  "Turn the evidence into a build-ready PRD",
  "See sources, assumptions and limits",
];

/* ---------- Opinionated stack ---------- */

export const stack = [
  { k: "Frontend", v: "Next.js · React · TypeScript" },
  { k: "UI", v: "Tailwind CSS · shadcn/ui" },
  { k: "Backend", v: "Route handlers · NestJS" },
  { k: "Database", v: "PostgreSQL · Prisma · Redis" },
  { k: "Auth", v: "One templated auth library" },
  { k: "Payments", v: "Stripe · Razorpay" },
  { k: "AI", v: "One provider layer · 3 vendors" },
  { k: "Deploy", v: "Vercel · AWS · Google Cloud" },
  { k: "Analytics", v: "PostHog" },
  { k: "Email", v: "Resend" },
];

export const stackReasons = ["Faster runs", "Fewer failures", "Cheaper tokens", "Regression-tested"];

/* ---------- You stay in control ---------- */

export const postingFlow: { label: string; tone: "neutral" | "brand" | "mint" }[] = [
  { label: "Read communities", tone: "neutral" },
  { label: "Find threads", tone: "neutral" },
  { label: "Read the rules", tone: "neutral" },
  { label: "Draft a reply", tone: "neutral" },
  { label: "Your approval", tone: "brand" },
  { label: "You post", tone: "mint" },
];

export const controlItems = [
  { name: "Approval before anything external", body: "Nothing is posted, sent or deployed without your yes.", icon: icons.check },
  { name: "Sources on every claim", body: "Research links back to where each finding came from.", icon: icons.link },
  { name: "Your GitHub, your code", body: "Code lands in a repository you own.", icon: icons.code },
  { name: "Your accounts", body: "Deploys, payments and socials stay on your accounts.", icon: icons.key },
  { name: "Full run log", body: "Every agent step, tool call and retry, recorded.", icon: icons.file },
  { name: "Encryption and retention", body: "Encrypted in transit and at rest. You choose how long we keep it.", icon: icons.lock },
];

/* ---------- Pricing ---------- */

export type PricingTier = {
  name: string;
  desc: string;
  price: string;
  unit: string;
  note: string;
  cta: string;
  href: string;
  featured: boolean;
  features: string[];
  /** Stage this plan depends on; shows its availability badge when not live. */
  stage?: StageKey;
};

export const pricingTiers: PricingTier[] = [
  {
    name: "Private beta",
    desc: "A complete validation and planning pack before you commit to building.",
    price: "Free",
    unit: "during beta",
    note: "Pricing will be announced before beta ends",
    cta: "Join the waitlist",
    href: routes.pricing,
    featured: true,
    features: ["Full validation report", "Competitor matrix (XLSX)", "SEO keyword list", "PRD, personas, MVP scope", "Architecture and DB schema", "Pitch deck (PPTX)"],
  },
];

export const creditEstimate = [
  { k: "Market Researcher", v: 18 },
  { k: "Competitor Analyst", v: 12 },
  { k: "Community Researcher", v: 8 },
  { k: "Fact-Checker", v: 6 },
];

/* ---------- FAQ ---------- */

export const faqs = [
  { q: "What is AI Swarm?", a: "An AI product team for validating and planning a SaaS. Specialist agents research the market, compare competitors, test pricing and turn the evidence into a PRD and MVP scope." },
  { q: "When does the private beta open?", a: "The Validate + Plan private beta is scheduled for 28 November 2026 at 10:00 IST. Join the waitlist and we’ll send one email when access opens." },
  { q: "What does the validation include?", a: "A market overview, competitor matrix, pricing observations, customer and community signals, SEO opportunities, technical constraints, and a go, pivot, or no-go recommendation with sources." },
  { q: "Is my SaaS idea confidential?", a: "Your idea and generated files are not published. Data is encrypted in transit and at rest, and retention controls are part of the private-beta workflow." },
  { q: "How long does a validation run take?", a: "Timing depends on the research scope and the sources available. Before a run begins, you’ll see the planned tasks and expected outputs rather than an unsupported fixed-time promise." },
  { q: "Which sources does the research use?", a: "The plan can include company websites, public pricing pages, search data, public communities and other relevant public sources. Findings link back to their evidence and weak claims are flagged." },
  { q: "What does AI validation not prove?", a: "It cannot guarantee demand, product-market fit or revenue. It reduces avoidable uncertainty and shows which assumptions still need interviews, prototypes or real sales tests." },
  { q: "How is this different from an AI app builder?", a: "App builders begin with implementation. AI Swarm starts earlier: it tests the opportunity and produces the product decisions and specification a builder needs." },
  { q: "Can I review the research plan first?", a: "Yes. You see the proposed tasks, sources and outputs before the run, and you can approve or change the plan." },
  { q: "Do I own the documents?", a: "Yes. Your reports, matrices, PRD and planning files are yours to download and use with any team or development tool." },
  { q: "What happens after the beta?", a: "Validate + Plan is free during the private beta, with no credit card required. Pricing will be announced before the beta ends, so you can decide before any paid plan begins." },
];

/* ---------- Collaborators ---------- */

export type SocialKind = "linkedin" | "github" | "reddit" | "x" | "portfolio";

export type Collaborator = {
  name: string;
  role: string;
  photo: string;
  bio: string;
  focus: string[];
  /** Only listed profiles render; add a { kind, href } entry to show a new one. */
  socials: { kind: SocialKind; href: string }[];
};

export const team = {
  company: "Rubenius Interior Wellbeing LLP",
};

export const collaborators: Collaborator[] = [
  {
    name: "Nikhil Anand",
    role: "Software Developer – Team Lead",
    photo: "/team/nikhil-anand.jpg",
    bio: "Full-stack developer with 6 years of freelance experience, shipping production apps with Next.js, Node.js and AWS and building AI workflows with LangChain and RAG. Also the founder of DevKit Market.",
    focus: ["6 years freelance", "Product & engineering", "AI workflows"],
    socials: [
      { kind: "linkedin", href: "https://www.linkedin.com/in/nikhilanand86" },
      { kind: "github", href: "https://github.com/niks-nikhil-anand" },
      { kind: "reddit", href: "https://www.reddit.com/user/Defiant_Company_6015/" },
      { kind: "x", href: "https://x.com/niks_developer" },
      { kind: "portfolio", href: "https://www.devkitmarket.com/hire-me" },
    ],
  },
  {
    name: "Tripti Shakya",
    role: "Full Stack Developer",
    photo: "/team/tripti-shakya.jpg",
    bio: "Full stack developer at Rubenius Interior Wellbeing, building AI Swarm's product experience across the frontend and backend.",
    focus: ["Full-stack", "Product experience"],
    socials: [
      { kind: "linkedin", href: "https://www.linkedin.com/in/tripti-shakya-602097281/" },
      { kind: "github", href: "https://github.com/triptishakya-dev" },
      { kind: "reddit", href: "https://www.reddit.com/user/Huge-Leg-8072/" },
      { kind: "x", href: "https://x.com/ShakyaTrip48522" },
    ],
  },
];

/* ---------- Footer ---------- */

export const footerColumns = [
  {
    heading: "PRODUCT",
    links: [
      { label: "What you get", href: "#deliverables" },
      { label: "How it works", href: "#how" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    heading: "RESEARCH",
    links: [
      { label: "Methodology", href: "/methodology" },
      { label: "Roadmap", href: "#roadmap" },
      { label: "Team", href: "#team" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  ...(contactHref
    ? [
        {
          heading: "CONTACT",
          links: [{ label: site.contactEmail, href: contactHref }],
        },
      ]
    : []),
];
