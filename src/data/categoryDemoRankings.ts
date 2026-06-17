export type DemoCategoryId =
  | "ai-top100"
  | "a25"
  | "contributors"
  | "cities"
  | "universities"
  | "reports";

export type DemoBoardKind = "people" | "ecosystem" | "report";

export type DemoRankItem = {
  id: string;
  rank: number;
  name: string;
  subline: string;
  score: number;
  scoreLabel: string;
  segment: string;
  signal: string;
  evidence: string;
  momentum: string;
  summary: string;
  tags: string[];
  statA: string;
  statB: string;
};

export type DemoBoardConfig = {
  id: DemoCategoryId;
  title: string;
  eyebrow: string;
  description: string;
  kind: DemoBoardKind;
  segmentLabel: string;
  signalLabel: string;
  entityLabel: string;
  scoreColumn: string;
  profileTitle: string;
  profileNote: string;
  segments: string[];
  rows: DemoRankItem[];
  subBoards?: DemoSubBoard[];
};

export type DemoSubBoard = {
  id: string;
  label: string;
  eyebrow: string;
  description: string;
  note: string;
  rows: DemoRankItem[];
};

type DemoExpansionSeed = {
  name: string;
  subline: string;
  segment: string;
  signal: string;
  summary?: string;
  tags: string[];
  statA?: string;
  statB?: string;
  momentum?: string;
  evidence?: string;
};

type DemoExpansionOptions = {
  prefix: string;
  startRank: number;
  scoreCeiling: number;
  scoreLabel: string;
  evidenceBase: number;
  statA: string;
  statB: string;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const scoreForRank = (rank: number, scoreCeiling: number) =>
  Number(Math.max(70, scoreCeiling - (rank - 1) * 0.19 - (rank % 6) * 0.08).toFixed(1));

const momentumForRank = (rank: number) => `+${(1.2 + (rank % 9) * 0.34).toFixed(1)}`;

const buildDemoRows = (
  seeds: DemoExpansionSeed[],
  options: DemoExpansionOptions,
): DemoRankItem[] =>
  seeds.map((seed, index) => {
    const rank = options.startRank + index;

    return {
      id: `${options.prefix}-${rank}-${slugify(seed.name)}`,
      rank,
      name: seed.name,
      subline: seed.subline,
      score: scoreForRank(rank, options.scoreCeiling),
      scoreLabel: options.scoreLabel,
      segment: seed.segment,
      signal: seed.signal,
      evidence:
        seed.evidence ??
        `${Math.max(8, options.evidenceBase - Math.floor(index / 4))} demo signals`,
      momentum: seed.momentum ?? momentumForRank(rank),
      summary:
        seed.summary ??
        `Prototype entry for ${seed.segment.toLowerCase()} based on ${seed.signal.toLowerCase()}. Scores are synthetic until source-backed data is attached.`,
      tags: seed.tags,
      statA: seed.statA ?? options.statA,
      statB: seed.statB ?? options.statB,
    };
  });

const buildInfluencerExpansion = () => {
  const firstNames = [
    "Aisha",
    "Noah",
    "Maya",
    "Leo",
    "Nora",
    "Kenji",
    "Elena",
    "Owen",
    "Priya",
    "Mateo",
    "Lina",
    "Aria",
    "Jonas",
    "Sofia",
    "Ravi",
    "Mina",
    "Theo",
    "Iris",
    "Amir",
    "Clara",
  ];
  const lastNames = [
    "Morgan",
    "Patel",
    "Chen",
    "Reed",
    "Singh",
    "Park",
    "Rossi",
    "Okafor",
    "Garcia",
    "Tan",
    "Khan",
    "Bennett",
    "Nakamura",
    "Silva",
    "Hughes",
    "Ibrahim",
    "Kovacs",
    "Lin",
    "Dubois",
    "Hassan",
  ];
  const lanes = [
    {
      segment: "Company operators",
      sublines: [
        "Frontier AI company operator",
        "Enterprise model platform builder",
        "Applied AI product executive",
      ],
      signals: [
        "Platform distribution and executive visibility",
        "Product launches, partnerships and buyer access",
        "Enterprise adoption narrative and market reach",
      ],
      tags: ["operators", "platform", "enterprise"],
      statA: "operator proxy",
      statB: "market reach",
    },
    {
      segment: "Infrastructure leaders",
      sublines: [
        "AI infrastructure ecosystem leader",
        "Compute and deployment platform builder",
        "Model serving and data platform operator",
      ],
      signals: [
        "Compute leverage and infrastructure adoption",
        "Deployment footprint and partner network",
        "Runtime adoption, cloud reach and developer pull",
      ],
      tags: ["compute", "infra", "deployment"],
      statA: "infra proxy",
      statB: "partner reach",
    },
    {
      segment: "Research leaders",
      sublines: [
        "Frontier research lab leader",
        "Multimodal AI research voice",
        "AI safety and evaluation researcher",
      ],
      signals: [
        "Research visibility and benchmark transfer",
        "Publication signal and lab influence",
        "Evaluation credibility and safety discourse",
      ],
      tags: ["research", "benchmarks", "labs"],
      statA: "research proxy",
      statB: "citation reach",
    },
    {
      segment: "Independent builders",
      sublines: [
        "Developer education and tooling voice",
        "Independent AI product builder",
        "Open workflow and agent builder",
      ],
      signals: [
        "Developer mindshare and educational reach",
        "Community adoption and practical workflow influence",
        "Open demos, tutorials and repeatable product patterns",
      ],
      tags: ["builders", "education", "community"],
      statA: "community proxy",
      statB: "developer pull",
    },
  ];

  const seeds = Array.from({ length: 95 }, (_, index): DemoExpansionSeed => {
    const lane = lanes[index % lanes.length];
    const name = `${firstNames[index % firstNames.length]} ${
      lastNames[(index * 7 + Math.floor(index / firstNames.length)) % lastNames.length]
    }`;
    const subline = lane.sublines[index % lane.sublines.length];
    const signal = lane.signals[Math.floor(index / lane.sublines.length) % lane.signals.length];

    return {
      name,
      subline,
      segment: lane.segment,
      signal,
      tags: lane.tags,
      statA: lane.statA,
      statB: lane.statB,
    };
  });

  return buildDemoRows(seeds, {
    prefix: "person-demo",
    startRank: 6,
    scoreCeiling: 94.1,
    scoreLabel: "Influence score",
    evidenceBase: 27,
    statA: "signal proxy",
    statB: "source proxy",
  });
};

const buildInfluencerCohortRows = (
  prefix: string,
  cohortLabel: string,
  scoreLabel: string,
  scoreCeiling: number,
  nameOffset: number,
) => {
  const firstNames = [
    "Maya",
    "Noah",
    "Aisha",
    "Leo",
    "Nora",
    "Kenji",
    "Elena",
    "Owen",
    "Priya",
    "Mateo",
    "Lina",
    "Aria",
    "Jonas",
    "Sofia",
    "Ravi",
    "Mina",
    "Theo",
    "Iris",
    "Amir",
    "Clara",
    "Ava",
    "Ethan",
    "Laila",
    "Hugo",
    "Sana",
  ];
  const lastNames = [
    "Chen",
    "Morgan",
    "Patel",
    "Reed",
    "Singh",
    "Park",
    "Rossi",
    "Okafor",
    "Garcia",
    "Tan",
    "Khan",
    "Bennett",
    "Nakamura",
    "Silva",
    "Hughes",
    "Ibrahim",
    "Kovacs",
    "Lin",
    "Dubois",
    "Hassan",
    "Rahman",
    "Turner",
    "Okoye",
    "Walsh",
    "Nguyen",
  ];
  const lanes = [
    {
      segment: "Company operators",
      subline: `${cohortLabel} AI company operator`,
      signal: "Operating role, platform visibility and market narrative pull",
      tags: ["operators", "platform", "market signal"],
      statA: "operator proxy",
      statB: "leadership cycle",
    },
    {
      segment: "Infrastructure leaders",
      subline: `${cohortLabel} infrastructure builder`,
      signal: "Compute, deployment tooling and ecosystem partnership reach",
      tags: ["infrastructure", "compute", "deployment"],
      statA: "infra proxy",
      statB: "partner signal",
    },
    {
      segment: "Research leaders",
      subline: `${cohortLabel} research and lab voice`,
      signal: "Research visibility, benchmark signal and lab transfer potential",
      tags: ["research", "benchmarks", "labs"],
      statA: "research proxy",
      statB: "citation signal",
    },
    {
      segment: "Independent builders",
      subline: `${cohortLabel} independent builder`,
      signal: "Developer mindshare, public demos and workflow adoption",
      tags: ["builders", "developer mindshare", "community"],
      statA: "community proxy",
      statB: "builder velocity",
    },
  ];

  return buildDemoRows(
    Array.from({ length: 100 }, (_, index): DemoExpansionSeed => {
      const lane = lanes[(index + nameOffset) % lanes.length];
      const name = `${firstNames[(index + nameOffset) % firstNames.length]} ${
        lastNames[
          (index * 9 + nameOffset + Math.floor(index / firstNames.length)) %
            lastNames.length
        ]
      }`;

      return {
        name,
        subline: lane.subline,
        segment: lane.segment,
        signal: lane.signal,
        summary:
          `${cohortLabel} cohort prototype entry based on public-role proxy, visible ecosystem activity and momentum signals. Production data should verify eligibility and source evidence.`,
        tags: lane.tags,
        statA: lane.statA,
        statB: lane.statB,
      };
    }),
    {
      prefix,
      startRank: 1,
      scoreCeiling,
      scoreLabel,
      evidenceBase: 31,
      statA: "cohort proxy",
      statB: "source proxy",
    },
  );
};

const buildA25Expansion = () => {
  const names = [
    "Ava Patel",
    "Ethan Kim",
    "Laila Mensah",
    "Hugo Alvarez",
    "Sana Rahman",
    "Mika Tanaka",
    "Olivia Brooks",
    "Yusuf Khan",
    "Ivy Zhang",
    "Max Turner",
    "Amara Okoye",
    "Finn Walsh",
    "Leah Rossi",
    "Kai Nguyen",
    "Zara Haddad",
    "Milo Bennett",
    "Anika Shah",
    "Tomas Silva",
    "Nina Park",
    "Eli Carter",
  ];
  const lanes = [
    {
      segment: "Research",
      subline: "Early-career model evaluation researcher",
      signal: "Accepted papers, benchmark reuse and lab references",
      tags: ["research", "evals", "benchmarks"],
    },
    {
      segment: "Founders",
      subline: "Young AI application founder",
      signal: "Customer pilots, technical demo quality and fundraising signal",
      tags: ["founders", "pilots", "product"],
    },
    {
      segment: "Open source",
      subline: "Open-source agent tooling maintainer",
      signal: "Repository velocity, community reuse and integration pull",
      tags: ["open source", "agents", "developer tools"],
    },
    {
      segment: "Policy",
      subline: "AI governance and standards fellow",
      signal: "Policy citations, standards participation and public writing",
      tags: ["policy", "governance", "standards"],
    },
    {
      segment: "Creators",
      subline: "Generative workflow educator",
      signal: "Audience growth, practical tutorials and tool adoption",
      tags: ["creators", "workflow", "education"],
    },
  ];

  return buildDemoRows(
    names.map((name, index) => ({
      name,
      ...lanes[index % lanes.length],
      statA: `${3 + (index % 5)} proof signals`,
      statB: `${2 + (index % 4)} adoption signals`,
    })),
    {
      prefix: "a25-demo",
      startRank: 6,
      scoreCeiling: 88.9,
      scoreLabel: "Rising score",
      evidenceBase: 14,
      statA: "proof proxy",
      statB: "adoption proxy",
    },
  );
};

const buildContributorExpansion = () => {
  const groups = [
    "Vector Index Guild",
    "Agent Runtime Working Group",
    "Open Model Card Maintainers",
    "Inference Kernel Collective",
    "RAG Evaluation Lab",
    "Multimodal Dataset Stewards",
    "Safety Harness Contributors",
    "PromptOps Community",
    "Robotics Sim Builders",
    "Edge AI Toolkit Maintainers",
    "Synthetic Data Commons",
    "AI Observability Crew",
    "Embeddings Benchmark Team",
    "Workflow Automation Maintainers",
    "Open Fine-Tuning League",
  ];
  const lanes = [
    {
      segment: "Open source",
      subline: "Reusable AI infrastructure project",
      signal: "Release velocity, adoption signal and downstream reuse",
      tags: ["open source", "infrastructure", "reuse"],
    },
    {
      segment: "Community",
      subline: "Global AI contributor community",
      signal: "Contributor breadth, documentation depth and community support",
      tags: ["community", "docs", "contributors"],
    },
    {
      segment: "Developer tools",
      subline: "Application framework and tooling contributors",
      signal: "Integration coverage, developer workflow fit and examples",
      tags: ["developer tools", "framework", "integrations"],
    },
    {
      segment: "Evaluation",
      subline: "Benchmark and evaluation maintainers",
      signal: "Reproducibility, benchmark coverage and trust signal",
      tags: ["evaluation", "benchmarks", "trust"],
    },
    {
      segment: "Robotics",
      subline: "Robot learning and simulation contributors",
      signal: "Simulation reuse, control modules and embodied AI examples",
      tags: ["robotics", "simulation", "control"],
    },
  ];
  const seeds = Array.from({ length: 45 }, (_, index): DemoExpansionSeed => {
    const lane = lanes[index % lanes.length];
    const name = `${groups[index % groups.length]} ${Math.floor(index / groups.length) + 1}`;

    return {
      name,
      ...lane,
      statA: `${8 + (index % 9)} reuse signals`,
      statB: `${4 + (index % 7)} release signals`,
    };
  });

  return buildDemoRows(seeds, {
    prefix: "contrib-demo",
    startRank: 6,
    scoreCeiling: 90.0,
    scoreLabel: "Contribution index",
    evidenceBase: 22,
    statA: "reuse proxy",
    statB: "release proxy",
  });
};

const buildCityExpansion = () =>
  buildDemoRows(
    [
      {
        name: "Boston-Cambridge",
        subline: "United States",
        segment: "North America",
        signal: "University density, biotech AI and technical talent",
        tags: ["research", "biotech", "talent"],
        statA: "academic density",
        statB: "science AI pull",
      },
      {
        name: "Singapore",
        subline: "Singapore",
        segment: "Asia",
        signal: "Regional headquarters, policy clarity and applied AI adoption",
        tags: ["regional hub", "policy", "enterprise"],
        statA: "policy hub",
        statB: "enterprise adoption",
      },
      {
        name: "Seattle",
        subline: "United States",
        segment: "North America",
        signal: "Cloud platforms, enterprise AI and engineering talent",
        tags: ["cloud", "enterprise", "talent"],
        statA: "cloud hub",
        statB: "platform talent",
      },
      {
        name: "Paris",
        subline: "France",
        segment: "Europe",
        signal: "Foundation model startups, research and European policy presence",
        tags: ["startups", "research", "Europe AI"],
        statA: "startup signal",
        statB: "policy presence",
      },
      {
        name: "Seoul",
        subline: "South Korea",
        segment: "Asia",
        signal: "Semiconductors, robotics, consumer AI and enterprise adoption",
        tags: ["semiconductors", "robotics", "consumer AI"],
        statA: "hardware base",
        statB: "robotics pull",
      },
    ],
    {
      prefix: "city-demo",
      startRank: 6,
      scoreCeiling: 87.8,
      scoreLabel: "Ecosystem score",
      evidenceBase: 24,
      statA: "ecosystem proxy",
      statB: "growth proxy",
    },
  );

const buildUniversityExpansion = () =>
  buildDemoRows(
    [
      {
        name: "UC Berkeley",
        subline: "United States",
        segment: "North America",
        signal: "Open research, systems depth and startup talent pipeline",
        tags: ["open research", "systems", "founders"],
        statA: "systems signal",
        statB: "founder flow",
      },
      {
        name: "University of Cambridge",
        subline: "United Kingdom",
        segment: "Europe",
        signal: "AI safety, science AI and technical research depth",
        tags: ["AI safety", "science", "research"],
        statA: "safety signal",
        statB: "science depth",
      },
      {
        name: "ETH Zurich",
        subline: "Switzerland",
        segment: "Europe",
        signal: "Robotics, systems research and European talent pipeline",
        tags: ["robotics", "systems", "Europe"],
        statA: "robotics signal",
        statB: "talent pipeline",
      },
      {
        name: "University of Toronto",
        subline: "Canada",
        segment: "North America",
        signal: "Deep learning heritage, research strength and applied AI ecosystem",
        tags: ["deep learning", "research", "talent"],
        statA: "research signal",
        statB: "ecosystem pull",
      },
      {
        name: "National University of Singapore",
        subline: "Singapore",
        segment: "Asia",
        signal: "Regional AI research, enterprise transfer and policy-aligned talent",
        tags: ["Asia AI", "enterprise", "talent"],
        statA: "regional signal",
        statB: "transfer proxy",
      },
    ],
    {
      prefix: "uni-demo",
      startRank: 6,
      scoreCeiling: 91.4,
      scoreLabel: "Research index",
      evidenceBase: 26,
      statA: "research proxy",
      statB: "talent proxy",
    },
  );

const buildReportExpansion = () =>
  buildDemoRows(
    [
      {
        name: "Edge AI Deployment Radar",
        subline: "Enterprise buyer report",
        segment: "Buyer guides",
        signal: "On-device models, edge inference and deployment constraints",
        tags: ["edge AI", "deployment", "buyer guide"],
        momentum: "Q4",
        statA: "24 pages",
        statB: "38 sources",
      },
      {
        name: "AI Chip Supply Chain Brief",
        subline: "Sector intelligence report",
        segment: "Sector briefs",
        signal: "Accelerators, memory, packaging and interconnect bottlenecks",
        tags: ["AI chips", "HBM", "supply chain"],
        momentum: "Q3",
        statA: "34 pages",
        statB: "61 sources",
      },
      {
        name: "Enterprise Agent Buyer Matrix",
        subline: "Enterprise buyer report",
        segment: "Buyer guides",
        signal: "Agent platform fit, governance, integrations and deployment maturity",
        tags: ["agents", "enterprise", "matrix"],
        momentum: "Q2",
        statA: "29 pages",
        statB: "47 sources",
      },
      {
        name: "Synthetic Data Market Map",
        subline: "Quarterly ranking report",
        segment: "Market maps",
        signal: "Data generation, privacy, evaluation and vertical adoption",
        tags: ["synthetic data", "privacy", "market map"],
        momentum: "Q4",
        statA: "31 pages",
        statB: "52 sources",
      },
      {
        name: "AI Safety Vendor Landscape",
        subline: "Risk and compliance report",
        segment: "Risk reports",
        signal: "Red-team tooling, policy enforcement and enterprise controls",
        tags: ["AI safety", "red team", "compliance"],
        momentum: "Q3",
        statA: "27 pages",
        statB: "43 sources",
      },
      {
        name: "Robotics Autonomy Stack Map",
        subline: "Sector intelligence report",
        segment: "Sector briefs",
        signal: "Robot OS, simulation, control, perception and fleet operations",
        tags: ["robotics", "simulation", "fleet ops"],
        momentum: "Q2",
        statA: "33 pages",
        statB: "55 sources",
      },
      {
        name: "AI Data Center Power Brief",
        subline: "Sector intelligence report",
        segment: "Sector briefs",
        signal: "Power availability, cooling, grid constraints and cluster planning",
        tags: ["datacenter", "power", "cooling"],
        momentum: "Q4",
        statA: "22 pages",
        statB: "36 sources",
      },
      {
        name: "Model Evaluation Methods Guide",
        subline: "Risk and compliance report",
        segment: "Risk reports",
        signal: "Benchmark design, hallucination tests and deployment gates",
        tags: ["evaluation", "hallucination", "trust"],
        momentum: "Q3",
        statA: "42 pages",
        statB: "68 sources",
      },
      {
        name: "AI in Healthcare Deployment Map",
        subline: "Quarterly ranking report",
        segment: "Market maps",
        signal: "Clinical workflow adoption, compliance and evidence maturity",
        tags: ["healthcare", "workflow", "compliance"],
        momentum: "Q2",
        statA: "39 pages",
        statB: "64 sources",
      },
      {
        name: "Financial AI Agents Market Signals",
        subline: "Sector intelligence report",
        segment: "Sector briefs",
        signal: "Research agents, compliance workflows and enterprise pilots",
        tags: ["finance", "agents", "pilots"],
        momentum: "Q4",
        statA: "26 pages",
        statB: "41 sources",
      },
      {
        name: "Generative Media Production Stack",
        subline: "Quarterly ranking report",
        segment: "Market maps",
        signal: "Video, image, voice, music and interactive content tooling",
        tags: ["generative media", "video", "creative tools"],
        momentum: "Q3",
        statA: "37 pages",
        statB: "59 sources",
      },
      {
        name: "Private AI Deployment Playbook",
        subline: "Enterprise buyer report",
        segment: "Buyer guides",
        signal: "On-prem, VPC, model governance and secure RAG deployment",
        tags: ["private AI", "RAG", "governance"],
        momentum: "Q2",
        statA: "44 pages",
        statB: "70 sources",
      },
      {
        name: "Autonomous Driving AI Stack",
        subline: "Sector intelligence report",
        segment: "Sector briefs",
        signal: "End-to-end autonomy, simulation, data loops and cockpit AI",
        tags: ["autonomous driving", "simulation", "data loop"],
        momentum: "Q4",
        statA: "35 pages",
        statB: "56 sources",
      },
      {
        name: "AI Regulation Readiness Index",
        subline: "Risk and compliance report",
        segment: "Risk reports",
        signal: "Regional compliance, documentation and governance operating model",
        tags: ["regulation", "compliance", "governance"],
        momentum: "Q3",
        statA: "30 pages",
        statB: "49 sources",
      },
      {
        name: "Open Model Ecosystem Review",
        subline: "Quarterly ranking report",
        segment: "Market maps",
        signal: "Open weights, licensing, developer adoption and deployment fit",
        tags: ["open models", "licensing", "adoption"],
        momentum: "Q2",
        statA: "33 pages",
        statB: "57 sources",
      },
    ],
    {
      prefix: "report-demo",
      startRank: 6,
      scoreCeiling: 88.2,
      scoreLabel: "Report priority",
      evidenceBase: 48,
      statA: "report scope",
      statB: "source depth",
    },
  );

const peopleRows: DemoRankItem[] = [
  {
    id: "person-altman",
    rank: 1,
    name: "Sam Altman",
    subline: "OpenAI / company builder",
    score: 99.4,
    scoreLabel: "Influence score",
    segment: "Company operators",
    signal: "Capital, policy and platform reach",
    evidence: "42 source signals",
    momentum: "+3.8",
    summary:
      "High public visibility, platform control, funding influence and policy engagement across the AI stack.",
    tags: ["AGI platforms", "policy", "capital"],
    statA: "18 board signals",
    statB: "31 media citations",
  },
  {
    id: "person-huang",
    rank: 2,
    name: "Jensen Huang",
    subline: "NVIDIA / infrastructure leader",
    score: 98.7,
    scoreLabel: "Influence score",
    segment: "Infrastructure leaders",
    signal: "Compute supply chain leverage",
    evidence: "39 source signals",
    momentum: "+4.1",
    summary:
      "Defines the AI infrastructure cycle through GPU roadmaps, ecosystem partnerships and enterprise deployment cadence.",
    tags: ["compute", "hardware", "ecosystem"],
    statA: "21 partner signals",
    statB: "27 market citations",
  },
  {
    id: "person-hassabis",
    rank: 3,
    name: "Demis Hassabis",
    subline: "Google DeepMind / science AI",
    score: 97.9,
    scoreLabel: "Influence score",
    segment: "Research leaders",
    signal: "Research breakthroughs and product transfer",
    evidence: "37 source signals",
    momentum: "+2.4",
    summary:
      "Combines frontier model research, scientific discovery work and product-facing AI deployment inside Google.",
    tags: ["research", "science", "Gemini"],
    statA: "16 research signals",
    statB: "34 publication citations",
  },
  {
    id: "person-feifei",
    rank: 4,
    name: "Fei-Fei Li",
    subline: "Stanford HAI / human-centered AI",
    score: 96.2,
    scoreLabel: "Influence score",
    segment: "Research leaders",
    signal: "Academic, policy and public trust reach",
    evidence: "32 source signals",
    momentum: "+1.5",
    summary:
      "Strong influence through computer vision research, institutional leadership and human-centered AI policy work.",
    tags: ["vision", "policy", "education"],
    statA: "19 academic signals",
    statB: "22 policy citations",
  },
  {
    id: "person-karpathy",
    rank: 5,
    name: "Andrej Karpathy",
    subline: "Eureka Labs / AI education",
    score: 94.6,
    scoreLabel: "Influence score",
    segment: "Independent builders",
    signal: "Developer education and model intuition",
    evidence: "28 source signals",
    momentum: "+2.9",
    summary:
      "Developer mindshare remains high through education, practical model explanations and product-building credibility.",
    tags: ["education", "developer mindshare", "agents"],
    statA: "24 community signals",
    statB: "18 developer citations",
  },
  ...buildInfluencerExpansion(),
];

const under50InfluencerRows = buildInfluencerCohortRows(
  "u50-demo",
  "Under 50",
  "U50 influence",
  96.2,
  3,
);

const under30InfluencerRows = buildInfluencerCohortRows(
  "u30-demo",
  "Under 30",
  "U30 influence",
  92.7,
  9,
);

const influencerSubBoards: DemoSubBoard[] = [
  {
    id: "overall",
    label: "Overall Top 100",
    eyebrow: "Global influence",
    description:
      "The full AI influence board across operators, infrastructure leaders, research voices and independent builders.",
    note: "Best for comparing total ecosystem leverage across all public influence signals.",
    rows: peopleRows,
  },
  {
    id: "under-50",
    label: "Under 50 Top 100",
    eyebrow: "Current-cycle leaders",
    description:
      "A cohort view for influential operators, researchers and builders who represent the active leadership cycle.",
    note: "Best for spotting people with direct operating leverage in the current AI market.",
    rows: under50InfluencerRows,
  },
  {
    id: "under-30",
    label: "Under 30 Top 100",
    eyebrow: "Breakout talent",
    description:
      "A younger cohort board focused on visible breakout builders, researchers and community voices.",
    note: "Best for tracking early talent before it appears on slower institutional rankings.",
    rows: under30InfluencerRows,
  },
];

const a25Rows: DemoRankItem[] = [
  {
    id: "a25-researcher",
    rank: 1,
    name: "Maya Chen",
    subline: "Multimodal agents / MIT",
    score: 96.8,
    scoreLabel: "Rising score",
    segment: "Research",
    signal: "Accepted papers, open benchmarks and lab adoption",
    evidence: "18 source signals",
    momentum: "+6.2",
    summary:
      "Early-career researcher with visible traction across multimodal agent benchmarks and open evaluation tooling.",
    tags: ["multimodal", "agents", "benchmarks"],
    statA: "4 accepted papers",
    statB: "2 benchmark releases",
  },
  {
    id: "a25-founder",
    rank: 2,
    name: "Leo Park",
    subline: "Robotics foundation model startup",
    score: 94.3,
    scoreLabel: "Rising score",
    segment: "Founders",
    signal: "Seed funding, pilots and technical depth",
    evidence: "16 source signals",
    momentum: "+5.4",
    summary:
      "Founder profile combines robotics demos, enterprise pilots and credible technical recruiting.",
    tags: ["robotics", "VLA", "seed"],
    statA: "3 pilot signals",
    statB: "2 investor signals",
  },
  {
    id: "a25-builder",
    rank: 3,
    name: "Nora Singh",
    subline: "Open-source inference tools",
    score: 92.1,
    scoreLabel: "Rising score",
    segment: "Open source",
    signal: "Developer adoption and repository velocity",
    evidence: "15 source signals",
    momentum: "+4.7",
    summary:
      "Strong developer adoption in open inference tooling, with a visible maintainer and community footprint.",
    tags: ["inference", "open source", "developer tools"],
    statA: "11k stars proxy",
    statB: "7 release signals",
  },
  {
    id: "a25-policy",
    rank: 4,
    name: "Elena Rossi",
    subline: "AI safety policy fellow",
    score: 90.4,
    scoreLabel: "Rising score",
    segment: "Policy",
    signal: "Standards participation and policy citations",
    evidence: "13 source signals",
    momentum: "+3.9",
    summary:
      "Recognized across policy workshops, standards discussions and public safety evaluation commentary.",
    tags: ["governance", "safety", "standards"],
    statA: "5 policy signals",
    statB: "8 public citations",
  },
  {
    id: "a25-creator",
    rank: 5,
    name: "Kenji Mori",
    subline: "AI media tooling creator",
    score: 88.7,
    scoreLabel: "Rising score",
    segment: "Creators",
    signal: "Audience growth and workflow adoption",
    evidence: "12 source signals",
    momentum: "+4.3",
    summary:
      "Fast-growing creator building practical media workflows and tutorials around generative production stacks.",
    tags: ["media", "workflow", "creator tools"],
    statA: "900k reach proxy",
    statB: "6 tool signals",
  },
  ...buildA25Expansion(),
];

const contributorRows: DemoRankItem[] = [
  {
    id: "contrib-vllm",
    rank: 1,
    name: "vLLM Maintainers",
    subline: "Open inference infrastructure",
    score: 98.1,
    scoreLabel: "Contribution index",
    segment: "Open source",
    signal: "Runtime adoption and enterprise pull-through",
    evidence: "31 source signals",
    momentum: "+5.0",
    summary:
      "Maintainer group has outsized influence on production LLM serving, inference optimization and enterprise stacks.",
    tags: ["inference", "runtime", "open source"],
    statA: "high adoption",
    statB: "frequent releases",
  },
  {
    id: "contrib-hf",
    rank: 2,
    name: "Hugging Face Community",
    subline: "Model hub and tooling ecosystem",
    score: 97.4,
    scoreLabel: "Contribution index",
    segment: "Community",
    signal: "Model sharing, datasets and ecosystem gravity",
    evidence: "34 source signals",
    momentum: "+3.7",
    summary:
      "The community remains a primary distribution layer for models, datasets and practical AI workflows.",
    tags: ["model hub", "datasets", "community"],
    statA: "broad coverage",
    statB: "global contributors",
  },
  {
    id: "contrib-langchain",
    rank: 3,
    name: "LangChain Contributors",
    subline: "Agent application framework",
    score: 94.9,
    scoreLabel: "Contribution index",
    segment: "Developer tools",
    signal: "Framework adoption and integrations",
    evidence: "27 source signals",
    momentum: "+2.5",
    summary:
      "Contributor network keeps a strong position in agent application scaffolding, integrations and templates.",
    tags: ["agents", "framework", "integrations"],
    statA: "many integrations",
    statB: "active ecosystem",
  },
  {
    id: "contrib-evals",
    rank: 4,
    name: "Open Evals Builders",
    subline: "Model evaluation infrastructure",
    score: 91.8,
    scoreLabel: "Contribution index",
    segment: "Evaluation",
    signal: "Benchmark quality and reproducibility",
    evidence: "22 source signals",
    momentum: "+3.1",
    summary:
      "Evaluation contributors provide practical test harnesses and repeatable workflows for model comparison.",
    tags: ["evals", "benchmarks", "trust"],
    statA: "12 benchmark signals",
    statB: "high reuse proxy",
  },
  {
    id: "contrib-robotics",
    rank: 5,
    name: "Open Robotics Stack",
    subline: "Simulation and robot control contributors",
    score: 90.5,
    scoreLabel: "Contribution index",
    segment: "Robotics",
    signal: "Simulation, control and field deployment reuse",
    evidence: "20 source signals",
    momentum: "+2.8",
    summary:
      "Open robotics contributors support simulation, autonomy testing and shared components for robot builders.",
    tags: ["robotics", "simulation", "control"],
    statA: "9 stack signals",
    statB: "field reuse proxy",
  },
  ...buildContributorExpansion(),
];

const cityRows: DemoRankItem[] = [
  {
    id: "city-sf",
    rank: 1,
    name: "San Francisco Bay Area",
    subline: "United States",
    score: 99.2,
    scoreLabel: "Ecosystem score",
    segment: "North America",
    signal: "Capital, talent, labs and startup density",
    evidence: "45 source signals",
    momentum: "+2.1",
    summary:
      "The Bay Area remains the densest AI company, capital, lab and talent concentration in the global ecosystem.",
    tags: ["capital", "frontier labs", "startups"],
    statA: "frontier lab hub",
    statB: "high funding density",
  },
  {
    id: "city-beijing",
    rank: 2,
    name: "Beijing",
    subline: "China",
    score: 95.8,
    scoreLabel: "Ecosystem score",
    segment: "Asia",
    signal: "Research institutions, AI companies and policy support",
    evidence: "38 source signals",
    momentum: "+2.7",
    summary:
      "Strong concentration of AI research institutions, model companies and national policy-linked deployment.",
    tags: ["research", "policy", "model companies"],
    statA: "large talent base",
    statB: "policy support",
  },
  {
    id: "city-london",
    rank: 3,
    name: "London",
    subline: "United Kingdom",
    score: 92.6,
    scoreLabel: "Ecosystem score",
    segment: "Europe",
    signal: "Research, finance and safety governance activity",
    evidence: "32 source signals",
    momentum: "+1.4",
    summary:
      "London combines strong AI research, financial services adoption and a visible AI governance ecosystem.",
    tags: ["finance", "governance", "research"],
    statA: "finance adoption",
    statB: "policy center",
  },
  {
    id: "city-shenzhen",
    rank: 4,
    name: "Shenzhen",
    subline: "China",
    score: 90.9,
    scoreLabel: "Ecosystem score",
    segment: "Asia",
    signal: "Hardware supply chain and robotics manufacturing",
    evidence: "29 source signals",
    momentum: "+3.3",
    summary:
      "Distinct advantage in hardware, robotics, manufacturing integration and productization speed.",
    tags: ["hardware", "robotics", "manufacturing"],
    statA: "supply-chain hub",
    statB: "robotics density",
  },
  {
    id: "city-toronto",
    rank: 5,
    name: "Toronto",
    subline: "Canada",
    score: 88.4,
    scoreLabel: "Ecosystem score",
    segment: "North America",
    signal: "Academic depth and applied AI companies",
    evidence: "25 source signals",
    momentum: "+1.8",
    summary:
      "A strong research-centered ecosystem with durable academic influence and applied AI startup activity.",
    tags: ["research", "talent", "applied AI"],
    statA: "academic hub",
    statB: "steady startup base",
  },
  ...buildCityExpansion(),
];

const universityRows: DemoRankItem[] = [
  {
    id: "uni-stanford",
    rank: 1,
    name: "Stanford University",
    subline: "United States",
    score: 99.0,
    scoreLabel: "Research index",
    segment: "North America",
    signal: "Research, founder output and lab ecosystem",
    evidence: "41 source signals",
    momentum: "+1.6",
    summary:
      "High AI research output, founder density and proximity to frontier AI company formation.",
    tags: ["research", "founders", "Silicon Valley"],
    statA: "high founder output",
    statB: "strong lab network",
  },
  {
    id: "uni-mit",
    rank: 2,
    name: "MIT",
    subline: "United States",
    score: 98.3,
    scoreLabel: "Research index",
    segment: "North America",
    signal: "Technical depth and applied research transfer",
    evidence: "39 source signals",
    momentum: "+1.9",
    summary:
      "Deep technical research base with strong applied AI, robotics and systems transfer into industry.",
    tags: ["systems", "robotics", "applied AI"],
    statA: "systems strength",
    statB: "robotics depth",
  },
  {
    id: "uni-cmu",
    rank: 3,
    name: "Carnegie Mellon University",
    subline: "United States",
    score: 96.7,
    scoreLabel: "Research index",
    segment: "North America",
    signal: "Robotics, ML and computer science depth",
    evidence: "35 source signals",
    momentum: "+1.5",
    summary:
      "A top technical institution with strong robotics, machine learning and CS talent pipeline signals.",
    tags: ["robotics", "ML", "CS"],
    statA: "robotics leadership",
    statB: "strong talent signal",
  },
  {
    id: "uni-tsinghua",
    rank: 4,
    name: "Tsinghua University",
    subline: "China",
    score: 95.8,
    scoreLabel: "Research index",
    segment: "Asia",
    signal: "Research output and AI company talent pipeline",
    evidence: "33 source signals",
    momentum: "+2.3",
    summary:
      "Major AI research and talent pipeline with strong links into China's AI company ecosystem.",
    tags: ["research", "talent", "China AI"],
    statA: "large research base",
    statB: "company pipeline",
  },
  {
    id: "uni-oxford",
    rank: 5,
    name: "University of Oxford",
    subline: "United Kingdom",
    score: 92.4,
    scoreLabel: "Research index",
    segment: "Europe",
    signal: "AI safety, science and interdisciplinary research",
    evidence: "28 source signals",
    momentum: "+1.2",
    summary:
      "Strong position in science-oriented AI, safety research and interdisciplinary policy work.",
    tags: ["AI safety", "science", "policy"],
    statA: "safety signal",
    statB: "science depth",
  },
  ...buildUniversityExpansion(),
];

const reportRows: DemoRankItem[] = [
  {
    id: "report-foundation",
    rank: 1,
    name: "Foundation Models Market Map",
    subline: "Quarterly ranking report",
    score: 98.0,
    scoreLabel: "Report priority",
    segment: "Market maps",
    signal: "Model capability, adoption and source-backed rank shifts",
    evidence: "72 source signals",
    momentum: "Q2",
    summary:
      "A concise executive view of frontier model labs, open models, edge models and applied benchmark signals.",
    tags: ["foundation models", "benchmarks", "market map"],
    statA: "40 pages",
    statB: "72 sources",
  },
  {
    id: "report-robotics",
    rank: 2,
    name: "Embodied Robotics Market Signals",
    subline: "Sector intelligence report",
    score: 95.5,
    scoreLabel: "Report priority",
    segment: "Sector briefs",
    signal: "Humanoid, quadruped, VLA and deployment readiness",
    evidence: "58 source signals",
    momentum: "Q2",
    summary:
      "A robotics-centered briefing covering body platforms, intelligence stacks, supplier signals and pilots.",
    tags: ["robotics", "VLA", "humanoids"],
    statA: "32 pages",
    statB: "58 sources",
  },
  {
    id: "report-infra",
    rank: 3,
    name: "AI Infrastructure Leaders",
    subline: "Enterprise buyer report",
    score: 93.8,
    scoreLabel: "Report priority",
    segment: "Buyer guides",
    signal: "Compute, server, chip and datacenter ecosystem strength",
    evidence: "63 source signals",
    momentum: "Q3",
    summary:
      "A decision-support report for enterprise AI infrastructure, hardware and cloud deployment strategy.",
    tags: ["compute", "chips", "datacenter"],
    statA: "36 pages",
    statB: "63 sources",
  },
  {
    id: "report-agents",
    rank: 4,
    name: "Agent Stack Adoption Radar",
    subline: "Workflow intelligence report",
    score: 91.6,
    scoreLabel: "Report priority",
    segment: "Market maps",
    signal: "Enterprise pilots, agent frameworks and workflow depth",
    evidence: "49 source signals",
    momentum: "Q3",
    summary:
      "A practical map of agent frameworks, enterprise agent deployment patterns and early workflow winners.",
    tags: ["agents", "enterprise", "workflow"],
    statA: "28 pages",
    statB: "49 sources",
  },
  {
    id: "report-trust",
    rank: 5,
    name: "AI Trust and Governance Index",
    subline: "Risk and compliance report",
    score: 89.4,
    scoreLabel: "Report priority",
    segment: "Risk reports",
    signal: "Evaluation, red-team, compliance and private deployment signals",
    evidence: "44 source signals",
    momentum: "Q4",
    summary:
      "A governance-focused view of model evaluation, red-team testing, deployment risk and compliance vendors.",
    tags: ["trust", "governance", "evaluation"],
    statA: "30 pages",
    statB: "44 sources",
  },
  ...buildReportExpansion(),
];

export const demoBoardConfigs: Record<DemoCategoryId, DemoBoardConfig> = {
  "ai-top100": {
    id: "ai-top100",
    title: "AI Top 100 Influencers",
    eyebrow: "People ranking",
    description:
      "Tracks public influence across company building, research, capital, policy, infrastructure and developer mindshare.",
    kind: "people",
    segmentLabel: "Influence segment",
    signalLabel: "Influence signal",
    entityLabel: "Profile",
    scoreColumn: "Influence",
    profileTitle: "Influence profile",
    profileNote:
      "This demo uses proxy signals such as source coverage, public role, ecosystem leverage and visible momentum.",
    segments: [
      "All",
      "Company operators",
      "Infrastructure leaders",
      "Research leaders",
      "Independent builders",
    ],
    rows: peopleRows,
    subBoards: influencerSubBoards,
  },
  a25: {
    id: "a25",
    title: "AI Under 25",
    eyebrow: "Rising talent ranking",
    description:
      "Highlights emerging AI builders, researchers, open-source maintainers, policy voices and creators under 25.",
    kind: "people",
    segmentLabel: "Talent segment",
    signalLabel: "Breakout signal",
    entityLabel: "Rising profile",
    scoreColumn: "Rising",
    profileTitle: "Rising talent profile",
    profileNote:
      "A25 demo emphasizes acceleration, early proof, technical credibility and visible ecosystem pull.",
    segments: ["All", "Research", "Founders", "Open source", "Policy", "Creators"],
    rows: a25Rows,
  },
  contributors: {
    id: "contributors",
    title: "Top Contributors",
    eyebrow: "Contribution ranking",
    description:
      "Ranks contributors and maintainer groups whose work shapes the practical AI ecosystem.",
    kind: "people",
    segmentLabel: "Contribution lane",
    signalLabel: "Contribution signal",
    entityLabel: "Contributor",
    scoreColumn: "Contribution",
    profileTitle: "Contributor profile",
    profileNote:
      "Contribution rank favors reusable infrastructure, community adoption, release velocity and cross-stack impact.",
    segments: [
      "All",
      "Open source",
      "Community",
      "Developer tools",
      "Evaluation",
      "Robotics",
    ],
    rows: contributorRows,
  },
  cities: {
    id: "cities",
    title: "Global AI Cities TOP 10",
    eyebrow: "Ecosystem ranking",
    description:
      "Compares city-scale AI ecosystems across talent, capital, labs, infrastructure, policy and commercialization.",
    kind: "ecosystem",
    segmentLabel: "Region",
    signalLabel: "Ecosystem signal",
    entityLabel: "City ecosystem",
    scoreColumn: "Ecosystem",
    profileTitle: "City ecosystem profile",
    profileNote:
      "City ranking demo uses proxy signals for funding density, lab presence, talent, policy support and industrial base.",
    segments: ["All", "North America", "Asia", "Europe"],
    rows: cityRows,
  },
  universities: {
    id: "universities",
    title: "Top 10 AI Universities",
    eyebrow: "Institution ranking",
    description:
      "Ranks university AI strength across research output, talent pipeline, founder output, labs and industry transfer.",
    kind: "ecosystem",
    segmentLabel: "Region",
    signalLabel: "Research signal",
    entityLabel: "Institution",
    scoreColumn: "Research",
    profileTitle: "Institution profile",
    profileNote:
      "University ranking demo focuses on research strength, talent flow, founder links and domain specialization.",
    segments: ["All", "North America", "Asia", "Europe"],
    rows: universityRows,
  },
  reports: {
    id: "reports",
    title: "Special Reports",
    eyebrow: "Report library",
    description:
      "A report-first ranking surface for market maps, sector briefs, buyer guides and risk reports.",
    kind: "report",
    segmentLabel: "Report type",
    signalLabel: "Report focus",
    entityLabel: "Report",
    scoreColumn: "Priority",
    profileTitle: "Report brief",
    profileNote:
      "Report ranking demo keeps the same leaderboard shell while shifting the profile panel toward report scope and source depth.",
    segments: ["All", "Market maps", "Sector briefs", "Buyer guides", "Risk reports"],
    rows: reportRows,
  },
};
