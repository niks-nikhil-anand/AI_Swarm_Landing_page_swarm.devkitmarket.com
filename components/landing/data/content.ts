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
  { label: "Private beta", href: "/#pricing", section: "pricing" },
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
  launch: "later",
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
  /** Roadmap badge text (e.g. "Private Beta", "Future"); tone still comes from stageAvailability. */
  badge: string;
  /** Real sample output. Leave unset until a genuine file exists in /public/samples. */
  sample?: { label: string; href: string };
};

export const stages: Stage[] = [
  {
    key: "validate",
    n: "01",
    name: "Validate",
    hue: "mint",
    badge: "Private Beta",
    summary: "Research and validate product opportunities.",
    agents: ["Market", "Competitor", "Customer", "Pricing", "SEO", "Evidence"],
    deliverables: ["Market research", "Competitor analysis", "Customer research", "Pricing research", "SEO research", "Evidence-backed reports"],
  },
  {
    key: "plan",
    n: "02",
    name: "Plan",
    hue: "sky",
    badge: "Coming Next",
    summary: "Turn research into product requirements and MVP plans.",
    agents: ["Product", "Strategy"],
    deliverables: ["PRD generation", "MVP planning", "Feature prioritization", "Product strategy", "Technical planning"],
  },
  {
    key: "build",
    n: "03",
    name: "Build",
    hue: "amber",
    badge: "Future",
    summary: "Assist with turning product plans into software.",
    agents: [],
    deliverables: ["AI-assisted development", "Code generation", "Architecture", "Testing", "Deployment"],
  },
  {
    key: "launch",
    n: "04",
    name: "Launch",
    hue: "pink",
    badge: "Future",
    summary: "Help prepare positioning, content, SEO, and acquisition.",
    agents: [],
    deliverables: ["Launch planning", "SEO", "Content", "Distribution", "Growth experiments"],
  },
  {
    key: "operate",
    n: "05",
    name: "Operate",
    hue: "brand",
    badge: "Long Term",
    summary: "Eventually support the ongoing product lifecycle.",
    agents: [],
    deliverables: ["Analytics", "Monitoring", "Optimization", "Customer insights", "Product iteration"],
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

const flagshipIdea = "an AI interview preparation platform for software developers";

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
    title: "Validate",
    body: "Understand whether your idea has a market, who you're competing with, and where opportunities may exist.",
    code: "is there a market?\nwho are the competitors?\nwhere are the gaps?",
    summary: "market? · competitors? · opportunities?",
    stage: "validate",
  },
  {
    n: "02",
    title: "Research",
    body: "Collect information from relevant sources across the web and organize it into useful evidence.",
    code: "relevant web sources\n→ collected\n→ organized\n→ useful evidence",
    summary: "web sources → organized evidence",
    stage: "validate",
  },
  {
    n: "03",
    title: "Analyze",
    body: "Compare competitors, pricing, positioning, customer problems, demand signals, and market opportunities.",
    code: "competitors · pricing\npositioning\ncustomer problems\ndemand signals",
    summary: "competitors · pricing · positioning · demand",
    stage: "validate",
  },
  {
    n: "04",
    title: "Plan",
    body: "Turn research into a structured product strategy and MVP scope.",
    code: "product strategy\nMVP scope\nPRD\ntechnical plan",
    summary: "product strategy · MVP scope · PRD",
    stage: "plan",
  },
];

export const howFlow = ["Your SaaS idea", "AI Swarm", "Research-backed product strategy", "MVP / PRD"];

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
  { name: "AI chatbots", cells: [1, 1, 1, 1] },
  { name: "Collections of agents", cells: [2, 1, 1, 1] },
  { name: "AI Swarm", ours: true, cells: [2, 2, 2, 2] },
];

export const comparePoints = [
  "Days or weeks of research, coordinated into one workflow",
  "Agents that work together, not just side by side",
  "Orchestration → Research → Evidence → Analysis → Synthesis → Product Planning",
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

/* ---------- Research team ---------- */

export const researchAgents = [
  { name: "Market Research Agent", body: "Researches your market, industry, trends, demand signals, and opportunities.", icon: icons.chart },
  { name: "Competitor Agent", body: "Finds competitors, analyzes their products, pricing, positioning, features, and gaps.", icon: icons.target },
  { name: "Customer Research Agent", body: "Identifies target users, their problems, existing solutions, and unmet needs.", icon: icons.users },
  { name: "Pricing Agent", body: "Studies competitor pricing and helps identify potential pricing models and positioning.", icon: icons.coin },
  { name: "SEO Agent", body: "Researches search demand, keywords, content opportunities, and organic acquisition possibilities.", icon: icons.trend },
  { name: "Evidence Agent", body: "Connects important findings back to their sources and identifies weak or unsupported claims.", icon: icons.shieldCheck },
  { name: "Product Agent", body: "Turns research findings into product requirements, MVP scope, features, and priorities.", icon: icons.file },
  { name: "Strategy Agent", body: "Brings the research together into a clear product direction.", icon: icons.flag },
];

/* ---------- The problem: questions before the build ---------- */

export const problemQuestions = [
  "Is there a real market?",
  "Who are the competitors?",
  "What are customers already using?",
  "What are people willing to pay?",
  "What problems are still unsolved?",
  "What keywords and channels can drive demand?",
  "What should the MVP actually contain?",
  "What should you build first?",
];

/* ---------- From research to PRD ---------- */

export const prdPlan: { name: string; icon: string; items: string[] }[] = [
  { name: "Product Definition", icon: icons.flag, items: ["Problem statement", "Target users", "Personas", "Value proposition", "Product positioning"] },
  { name: "MVP Scope", icon: icons.target, items: ["Core features", "User journeys", "Priorities", "MVP boundaries", "Future features"] },
  { name: "Product Requirements", icon: icons.file, items: ["Functional requirements", "User stories", "Acceptance criteria", "Product flows"] },
  { name: "Technical Direction", icon: icons.server, items: ["Architecture considerations", "API requirements", "Data requirements", "Integration requirements"] },
  { name: "Launch Planning", icon: icons.trend, items: ["Positioning", "Acquisition opportunities", "SEO opportunities", "Launch considerations"] },
];

/* ---------- Built for SaaS founders ---------- */

export const founderMoments = [
  { quote: "I have an idea.", answer: "Start with validation." },
  { quote: "I found competitors.", answer: "Understand the market around them." },
  { quote: "I know what users want.", answer: "Turn that understanding into a product plan." },
  { quote: "I want to start building.", answer: "Start with a clearer MVP." },
  { quote: "I want to launch.", answer: "Use the research to identify positioning and acquisition opportunities." },
];

/* ---------- Stop building blind ---------- */

export const buildingBlindRisks = [
  "The market is different than expected.",
  "Competitors already solved the problem.",
  "Customers don't care about the feature.",
  "Pricing doesn't work.",
  "The MVP is too large.",
  "The positioning is unclear.",
];

export const saasJourney = ["Idea", "Research", "Validate", "Plan", "Build", "Launch"];

/* ---------- Who it's for ---------- */

export const audiences = [
  { name: "Founders", body: "Validate and research ideas before investing heavily in development.", icon: icons.flag },
  { name: "Indie Hackers", body: "Move from idea to MVP with a structured research process.", icon: icons.sparkle },
  { name: "Developers", body: "Understand the market and product requirements before writing code.", icon: icons.code },
  { name: "Product Managers", body: "Accelerate market research and early product planning.", icon: icons.layout },
  { name: "Agencies", body: "Research client ideas and create structured product discovery reports.", icon: icons.building },
  { name: "Startup Teams", body: "Create a shared research foundation before making product decisions.", icon: icons.users },
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
    name: "Private Beta Launch",
    desc: "We're opening AI Swarm to a limited group of early users before the public launch.",
    price: "Nov 28",
    unit: "2026 · 10:00 IST",
    note: "Early users can help us improve",
    cta: "Join the Private Beta",
    href: routes.pricing,
    featured: true,
    features: ["Research quality", "Agent workflows", "Reports", "Product planning", "User experience", "New AI agents"],
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
  { q: "What is AI Swarm?", a: "AI Swarm is an AI-powered SaaS research and validation platform that uses multiple specialized AI agents to research markets, competitors, customers, pricing, SEO opportunities, and product requirements." },
  { q: "How is AI Swarm different from ChatGPT?", a: "ChatGPT is a general-purpose AI assistant. AI Swarm is designed around a structured research workflow where specialized agents perform different tasks and their findings are combined into a product research report." },
  { q: "Do I need technical knowledge?", a: "No. You can provide a simple description of your SaaS idea and AI Swarm handles the research workflow." },
  { q: "Does AI Swarm guarantee that my SaaS idea will succeed?", a: "No. Research can reduce uncertainty, but it cannot guarantee product-market fit or business success. AI Swarm is designed to give you better evidence and clearer information before making product decisions." },
  { q: "What does AI Swarm research?", a: "Depending on the workflow, research can include the market, customers, competitors, pricing, trends, SEO, product opportunities, risks, and sources and evidence." },
  { q: "Can AI Swarm generate a PRD?", a: "PRD generation is part of the product roadmap and planned product workflow." },
  { q: "Where does the research come from?", a: "AI Swarm is designed to research relevant external sources and connect important findings back to their supporting evidence." },
  { q: "Is my SaaS idea private?", a: "AI Swarm will provide specific privacy and data-handling terms as the beta launches. Do not submit confidential information until the applicable terms and controls are available." },
  { q: "When is AI Swarm launching?", a: "The private beta is planned for November 28, 2026 at 10:00 IST." },
  { q: "Who built AI Swarm?", a: "AI Swarm is built by Nikhil Anand and developed under DevKitMarket." },
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
    bio: "A software developer and product builder focused on turning ideas into real software products, with 6 years of freelance experience. The goal behind AI Swarm: make the research and product discovery phase of building software dramatically faster.",
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
      { label: "Private beta", href: "#pricing" },
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
