# Rank Frontend Rebuild Plan

## Product Direction

This project is an overseas-facing AI ranking product. It should feel like a professional intelligence and discovery platform, not a static report page.

The first rebuild phase should intentionally add more product surface area than the final version may need. We will add discovery, comparison, methodology, evidence, market context, and category navigation first, then simplify later after the product direction is clearer.

## Current Planning Rule

Do not start product implementation before the research structure is settled.

The immediate work is planning and external reference research:

1. Study mature overseas ranking and review products.
2. Study market intelligence and company database products.
3. Study AI leaderboard and benchmark products.
4. Study robotics and industrial automation industry sites.
5. Merge findings into this plan.
6. Decide the first build scope.
7. Start implementation only after the product structure is approved.

## Core Users

- Overseas investors tracking AI and robotics markets.
- Enterprise buyers comparing vendors by category.
- Analysts building market maps and company shortlists.
- Operators who need credible ranking methodology and source traceability.

## Product Principles

- Ranking first: users should immediately see category leaders and score differences.
- Evidence visible: every score should have a path back to methodology and sources.
- Category-native: AI and Robotics should each have their own structure instead of forcing all markets into one flat list.
- Dense but readable: this is an intelligence tool, so the UI should favor scanning, filtering, comparison, and drilldown.
- Global orientation: English UI structure, with enough bilingual taxonomy support for internal China-based research workflows.

## Information Architecture

### Top-Level Domains

1. AI
2. Robotics

### AI Second-Level Tracks

- Foundation Models
- AI Agents
- AI Infra
- AI Hardware
- Generative Media
- Autonomous Driving
- AI Trust & Governance

### Robotics Second-Level Tracks

- Robot Bodies
- Embodied Intelligence
- Robot Core Components
- Robot Software & Platforms
- Robot System Integration
- Robot Services & Operations

### Ranking Detail Levels

- Domain overview
- Track overview
- Company ranking
- Company profile
- Score breakdown
- Methodology and source evidence

## First-Phase Feature Set

### Navigation

- Persistent left navigation for domains and tracks.
- Active state for selected domain and track.
- Track counters and market status labels.

### Discovery Surface

- Header with selected market, total tracked companies, top score, and update cycle.
- Market map showing subsegments under the selected track.
- Search input for company and segment discovery.
- Region and maturity filters as UI controls.

### Ranking Surface

- Top 10 ranking table.
- Rank, company, country, segment, score, momentum, maturity, evidence count.
- Dimension score bars for fast comparison.
- Highlighted leader card for the current track.

### Insight Surface

- Key market signals.
- Why the current leader ranks first.
- Methodology confidence and disclosure level.
- Watchlist companies outside the current Top 10.

### Methodology Surface

- Eight-dimension scoring architecture.
- Weight display.
- Explanation of direct data, benchmark data, official proxy, and low-disclosure proxy.
- Source coverage summary.

### Source Surface

- Source list with source type, publisher, URL, and freshness.
- Evidence counts connected to ranking rows.

## Web Structure Research Assignments

### Agent 1: Ranking And Review Products

Reference targets:

- G2
- Capterra
- Gartner Peer Insights
- Product Hunt
- SourceForge

Research questions:

- How do homepage, category page, ranking page, and vendor detail page connect?
- How are filters, sort controls, compare flows, ratings, user reviews, and trust signals displayed?
- Which modules should be borrowed for an overseas AI ranking product?

### Agent 2: Market Intelligence Products

Reference targets:

- Crunchbase
- CB Insights
- Dealroom
- PitchBook public pages
- Tracxn public pages

Research questions:

- How do company database products structure industry pages, lists, profiles, and data fields?
- How are funding, geography, company tags, similar companies, trend signals, and saved searches presented?
- Which modules help make the ranking product feel like an intelligence platform instead of a report?

### Agent 3: AI Leaderboard And Benchmark Products

Reference targets:

- Hugging Face leaderboards
- LMArena
- Artificial Analysis
- Stanford AI Index
- MLCommons benchmarks
- Papers with Code leaderboards

Research questions:

- What fields are shown on model leaderboard pages?
- How are benchmark methodology, source data, metrics, and model details explained?
- Which modules should be reused for score transparency and data credibility?

### Agent 4: Robotics And Industrial Automation Sites

Reference targets:

- International Federation of Robotics
- The Robot Report
- Robotics Business Review
- Automate.org
- RoboBusiness
- ABI Research or Interact Analysis public pages

Research questions:

- How do robotics sites classify products, applications, industries, and companies?
- What structure works for robot bodies, components, software platforms, integration, and operations?
- Which modules should inform the Robotics top-level domain?

## Data Model

### Domain

- id
- name
- description
- tracks

### Track

- id
- domainId
- name
- chineseName
- description
- status
- updateCycle
- segments
- ranking
- sources
- methodologyNotes

### CompanyRanking

- rank
- companyName
- country
- segment
- score
- scoreTrend
- maturity
- evidenceCount
- dimensionScores
- summary
- sourceIds

### DimensionScore

- dimensionId
- name
- score
- weight
- note

### Source

- id
- title
- publisher
- type
- url
- date
- quality

## First Implementation Scope

The first implementation should be a rich static product prototype with real application structure:

- Use local TypeScript data instead of a backend.
- Replace broken Chinese placeholder copy.
- Implement domain and track selection state.
- Add a proper ranking table.
- Add filters and search UI.
- Add score breakdown visuals.
- Add methodology and sources panels.
- Keep the code dependency-light.

## Later Phases

- Add routing for `/domain/:domainId/track/:trackId`.
- Add company detail pages.
- Add Excel or JSON import for generated ranking workbooks.
- Add source-level score traceability.
- Add compare mode for multiple companies.
- Add saved watchlists.
- Add export to CSV/PDF.
- Add multilingual UI switching.
- Add authenticated internal research mode.

## Acceptance Criteria For Phase 1

- The first screen must look like a product dashboard, not a report.
- AI and Robotics must both be represented as top-level domains.
- Users must be able to switch domains and tracks.
- The selected track must show a Top 10 table.
- Each ranking row must expose dimension scores and evidence count.
- The page must include methodology and source sections.
- The UI must be responsive on desktop and mobile widths.
- `npm run build` should pass when dependencies are installed.

## Implementation Gate

Implementation should begin only after the external research synthesis is added below and the first build scope is selected.

## Research Synthesis

### Completed Research Inputs

Three research tracks have returned:

- Ranking and review products: G2, Capterra, Gartner Peer Insights, Product Hunt, SourceForge.
- Market intelligence and company database products: Crunchbase, CB Insights, Dealroom, PitchBook, Tracxn.
- AI leaderboard and benchmark products: Hugging Face leaderboards, LMArena, Artificial Analysis, Stanford AI Index, MLCommons, Papers with Code current state.
- Robotics and industrial automation sites: IFR, Automate.org / A3, RoboBusiness, ABI Research, Interact Analysis.

All requested sub-agent research tracks have returned.

### Ranking And Review Product Patterns

Reference URLs:

- https://www.g2.com/
- https://www.g2.com/categories
- https://www.g2.com/categories/ai-chatbots
- https://www.capterra.com/
- https://www.capterra.com/categories/
- https://www.capterra.com/artificial-intelligence-software/
- https://www.gartner.com/reviews/markets
- https://www.gartner.com/reviews/market/ai-code-assistants
- https://www.producthunt.com/
- https://www.producthunt.com/topics/artificial-intelligence
- https://sourceforge.net/software/artificial-intelligence/

Patterns to borrow:

- Category pages should explain the category, inclusion rules, common use cases, and buyer questions before showing the ranking.
- Ranking pages should support filters, sorting, comparison, related categories, popular alternatives, and category education.
- Detail pages should use tabs for overview, use cases, pricing, features, integrations, evidence, security, reviews, alternatives, and changelog.
- Ratings should be broken into dimensions instead of relying only on one overall score.
- Trust signals should be explicit: verified sources, methodology, last verified date, sponsorship disclosure, and review/data quality.
- Product cards should work as decision summaries: company, positioning, score, segment, evidence count, best-for labels, risks, and alternatives.

Modules to avoid copying blindly:

- Heavy ad density from software directory sites.
- Strong login walls before trust is established.
- Pure Product Hunt-style heat ranking without procurement evidence.
- A single score that hides why a company ranks highly.

### AI Leaderboard And Benchmark Patterns

Reference URLs:

- https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard
- https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard/tree/main
- https://huggingface.co/blog/open-llm-leaderboard-mmlu
- https://arena.ai/leaderboard
- https://arena.ai/how-it-works
- https://artificialanalysis.ai/leaderboards/models
- https://artificialanalysis.ai/methodology
- https://artificialanalysis.ai/methodology/intelligence-benchmarking
- https://hai.stanford.edu/ai-index
- https://hai.stanford.edu/ai-index/global-vibrancy-tool
- https://mlcommons.org/benchmarks/
- https://mlcommons.org/benchmarks/inference-datacenter/
- https://mlcommons.org/benchmarks/training/
- https://paperswithcode.com/sota

Patterns to borrow:

- Use an overview page with multiple Top 10 cards by capability, then allow users to enter detailed tables.
- Ranking tables should support advanced filters, search, custom columns, pinned comparison, and URL-synced state.
- AI model rankings need more than quality: cost, latency, speed, context window, license, open weights, provider availability, and version.
- Methodology should be first-class, not hidden in FAQ. Each metric needs tooltip-level explanation and a full methodology page.
- Each result should point to evidence: model version, benchmark version, prompt/template, source URL, submission date, and change log where available.
- Add versioning for leaderboard releases and rule changes.
- Support persona or use-case weighting, such as enterprise procurement, low latency, coding, open weights, multilingual, or privacy-first.

Important caution:

- Papers with Code SOTA pages currently redirect to Hugging Face Trending Papers in the observed public state, so it should not be treated as a stable crawl source for SOTA tables without additional validation.

### Market Intelligence And Company Database Patterns

Reference URLs:

- https://support.crunchbase.com/hc/en-us/articles/115010629528-Use-filters-to-build-a-search-with-Crunchbase-Pro
- https://support.crunchbase.com/hc/en-us/articles/360052260893-Navigating-a-company-profile-on-Crunchbase
- https://www.cbinsights.com/research/
- https://www.cbinsights.com/research/report/artificial-intelligence-top-startups-2026/
- https://app.dealroom.co/companies
- https://app.dealroom.co/companies/openai
- https://dealroom.co/companies/openai/
- https://app.dealroom.co/sector/technology/artificial_intelligence/overview
- https://pitchbook.com/profiles
- https://pitchbook.com/platform-data/companies
- https://pitchbook.com/platform-data/deals
- https://pitchbook.com/products/pitchbooks-ai-capabilities
- https://tracxn.com/d/companies
- https://tracxn.com/d/sectors/native-ai/__F_EyY5HYEjpsyq9OBM-d8E_ifnianKm1QNsUjuaUa-s
- https://tracxn.com/d/companies/openai/__kElhSG7uVGeFk1i71Co9-nwFtmtyMVT7f-YHMn4TFBg

Access notes:

- Crunchbase main pages were blocked by robots for the crawler, but official support pages exposed product structure.
- CB Insights company pages and some report pages returned 403, so they should be treated as reference patterns rather than stable crawl targets.
- PitchBook profile pages returned 403 in some cases, but product and data pages were accessible.
- Dealroom and Tracxn public sample pages exposed useful field structures.

Patterns to borrow:

- Global search should cover companies, investors, people, lists, innovations, categories, and reports.
- Company lists should support table and landscape views.
- Advanced filters should include sector, location, founded year, stage, ownership, funding date, funding amount, investors, headcount, valuation band, traffic, and technology tags.
- Company profiles should have a strong snapshot: one-line description, HQ, website, founded date, employee range, funding, latest round, valuation band, investors, tags, and similar companies.
- Industry pages should include key metrics, top companies, funding trends, top investors, M&A, IPOs, country distribution, founded-year distribution, stage distribution, and news.
- Trend signals should be explicit and explainable: funding momentum, hiring momentum, media heat, traffic, developer signal, patent signal, investor quality, and enterprise adoption.
- Similar company modules should be split into direct competitors, similar by use case, similar by customer segment, and emerging challengers.
- AI assistant prompts can be prebuilt: funding history, why ranked, competitor comparison, last 90 days change, similar companies, and main risk factors.
- Public pages can show useful summaries while reserving export, saved search, deep filters, historical trend, investor graph, and API access for later advanced product layers.

Fields to add to the long-term data model:

- foundedYear
- employeeRange
- stage
- latestFundingRound
- totalFunding
- valuationBand
- investorNames
- trafficSignal
- hiringSignal
- developerSignal
- mediaSignal
- patentSignal
- similarCompanies
- recentEvents

### Robotics And Industrial Automation Patterns

Reference URLs:

- https://ifr.org/
- https://ifr.org/about-world-robotics/
- https://ifr.org/wr-industrial-robots/
- https://ifr.org/wr-service-robots/
- https://ifr.org/ifr-press-releases/
- https://ifr.org/case-studies
- https://ifr.org/members-list
- https://www.automate.org/
- https://www.automate.org/products
- https://www.automate.org/companies
- https://www.automate.org/system-integration
- https://www.automate.org/robotics
- https://www.robobusiness.com/
- https://www.therobotreport.com/
- https://www.therobotreport.com/rbr50/
- https://www.abiresearch.com/
- https://www.abiresearch.com/news-resources/
- https://interactanalysis.com/research-products/
- https://interactanalysis.com/insights/robotics-warehouse-automation/

Patterns to borrow:

- Robotics cannot be represented by one flat category. It needs multiple dimensions: robot type, technology stack, application, vertical industry, and market data.
- Company pages should aggregate products, news, case studies, videos, technical papers, regions, certifications, and event participation.
- Robotics rankings should include deployment proof, safety/compliance, integration capability, service network, and real customer cases.
- The Robotics domain should include a supply-chain map: bodies, AI/software, vision/sensing, motion control, end effectors, safety, simulation, components, integration, and operations.
- A case library is important. Each ranking row should eventually connect to real deployments by industry, task, customer type, and outcome metric.
- Robotics buyers need tools: vendor shortlist, deployment risk checklist, fit-by-use-case selector, certified integrator directory, and comparison table.
- Market dashboards should include region distribution, installed base proxies, revenue range, deployment count, growth signal, and competitive landscape.

### CoinMarketCap Market Terminal Patterns

Reference URLs:

- https://coinmarketcap.com/?type=coins&tableRankBy=date_added
- https://coinmarketcap.com/new/
- https://coinmarketcap.com/currencies/strive-inc-series-a-preferred-tokenized-stock-xstock/

Why this reference matters:

CoinMarketCap is closer to a market data terminal than a content site. It is useful because our ranking product should become a high-density AI and Robotics market operating surface, not a static report.

Patterns to borrow from the list page:

- Top navigation should be task-oriented, not marketing-oriented: rankings, categories, market indicators, watchlist, portfolio, community, API, methodology, get listed, and alerts.
- The first screen should show market state before narrative content.
- Add a market pulse bar for AI and Robotics:
  - Products Tracked
  - Companies / Labs
  - 24h Attention
  - Funding / Revenue Proxy
  - Category Dominance
  - Inference Cost / GPU Cost Index
  - AI Market Sentiment
- Ranking should be split into multiple user intents:
  - Top
  - Trending
  - New
  - Most Visited
  - Fastest Growing
  - Most Funded
  - Open Source
  - Enterprise Ready
  - Community Sentiment
  - Robotics
- The ranking table needs filters and custom columns as core features, not secondary extras.
- Suggested AI ranking table fields:
  - Rank
  - Name
  - Category
  - Traffic / Users
  - 1d / 7d / 30d Growth
  - Funding / Valuation / Revenue Proxy
  - Launch Date / Added Date
  - GitHub / Research / Patents
  - Integrations
  - Last 7 / 30 Days Sparkline
  - Sentiment
  - Status
- Watchlist and alerts should become core retention loops.
- Portfolio should be adapted into AI Stack, Evaluation List, Vendor Portfolio, or Shortlist.
- Topic prompts should make the product feel queryable:
  - Which AI coding tools are growing fastest this week?
  - What new robotics startups launched recently?
  - Which model providers changed pricing this month?
  - Which humanoid robotics companies have new demos?
  - What open-source agents are trending on GitHub?
- Commercial loops can be productized later:
  - Get Listed
  - Claim Profile
  - Enterprise Data API
  - Widgets
  - Pro / Max
  - Newsletter
  - Alerts

Patterns to borrow from the detail page:

- Detail page first screen should be identity + rank + score/change + chart + key metrics.
- Avoid marketing hero layouts on entity pages.
- The main number can be Rank, Composite Score, Benchmark Score, or Momentum Score.
- Replace crypto metrics with AI-native metrics:
  - Market Cap -> Valuation, Funding, ARR Estimate, Traffic Scale
  - Volume -> API Calls, Web Visits, Downloads, GitHub Activity, Robot Deployments
  - Holders -> Customers, Developers, Contributors, Deployers, Integrators
  - Contracts / Explorers -> Model Card, Paper, GitHub, API Docs, Benchmark Source, Safety Report, Certification Link
- Add historical charts:
  - Rank History
  - Benchmark Score History
  - Traffic / Adoption
  - GitHub Stars / Commits
  - Model Downloads
  - Funding / Valuation Events
  - News Sentiment
  - Pricing Changes
  - Safety Incidents / Downtime
- Convert Markets into Availability / Providers / Channels:
  - API
  - Cloud
  - Open Source
  - Hugging Face
  - AWS Bedrock
  - Azure
  - Vertex AI
  - Self-hosted
  - Direct Sales
  - Integrators
  - RaaS
  - Region Availability
- Convert Converter into Pricing Calculator:
  - Tokens to USD
  - Requests to Monthly Cost
  - GPU Hours to Cost
  - Robot Hourly Cost
  - Seat Pricing Calculator
- Add entity verification and correction flows:
  - Claim this profile
  - Update company info
  - Submit benchmark evidence
  - Report incorrect data
  - Claimed / unclaimed profile status
- Add related discovery:
  - Alternatives
  - Used Together With
  - Similar Models
  - Models from Same Lab
  - Popular Companies in This Category
  - Trending Agents
  - Most Visited Robotics Companies

Important cautions:

- Do not copy crypto price-first language directly.
- Red and green change indicators can be used, but the tone should be intelligence/product discovery, not speculative trading.
- Early navigation should borrow CoinMarketCap's task grouping, but with fewer entries.
- Mobile should not copy the full desktop table. Use rank, name, category, growth, and trend by default, with details in a drawer.

### Structural Decision For Our Product

The product should not be a single report page. It should be structured as a ranking intelligence platform:

1. Home / Market Overview
   - Global search.
   - Top-level domains: AI and Robotics.
   - Market pulse bar.
   - Featured rankings, trending products, new launches, most visited entities, and fast-rising companies.
   - Watchlist, AI Stack / Shortlist, and alerts entry points.
   - Recent updates and methodology confidence.

2. Domain Page
   - Domain definition.
   - Second-level tracks.
   - Market map.
   - Featured Top 10 rankings.
   - Trend signals and source coverage.

3. Track Ranking Page
   - Category definition and inclusion rules.
   - Top 10 ranking table with table and landscape views.
   - Filters, sorting, compare mode, saved shortlist, watchlist, alerts, and column customization.
   - Multiple leaderboard views: Top, Trending, New, Most Visited, Fastest Growing, Enterprise Ready, Open Source, Community Sentiment.
   - Dimension score breakdown.
   - Sparkline trend columns.
   - Evidence coverage and last verified date.
   - Related tracks and alternatives.

4. Company Detail Page
   - Positioning, rank, segment, geography, maturity, and score.
   - Score / momentum / rank change as the main status number.
   - Historical chart for rank, score, traffic, downloads, funding events, GitHub, news, and pricing changes.
   - Company snapshot: HQ, founded year, stage, employee range, funding, investors, valuation band, website, and tags.
   - Availability / providers / channels table.
   - Pricing calculator where relevant.
   - Dimension breakdown and scoring rationale.
   - Products, use cases, industries, integrations, and deployment evidence.
   - Sources, updates, timeline, alternatives, comparable companies, and recent event signals.
   - Claim profile, submit evidence, and report incorrect data actions.

5. Methodology Page
   - Scoring dimensions and weights.
   - Direct data, benchmark data, official proxy, and low-disclosure proxy definitions.
   - Source quality rules.
   - Score versioning and change log.

6. Source Ledger
   - Searchable source database.
   - Source type, publisher, URL, date, quality, related companies, and related indicators.

### Phase 1 Build Scope After Research

Do not implement everything at once. The first build should create the product skeleton that can hold all later functions:

- App shell with global navigation.
- Home / overview dashboard.
- Domain and track navigation.
- Track ranking page with filters, sort, and comparison affordance.
- Table and landscape view switcher for company rankings.
- Ranking table with dimension scores and evidence count.
- Right-side intelligence panel with leader rationale, market signals, source coverage, and watchlist.
- Methodology panel and source ledger preview.
- Static TypeScript data only.
- No backend yet.
- No crawler integration yet.
- No paid/login wall yet.

### Phase 2 Candidate Additions

- Company detail pages.
- Compare mode.
- Custom weighting.
- Saved shortlist.
- Source ledger full page.
- Excel / JSON import from generated ranking workbooks.
- Data freshness and change log.
- Robotics case library.
- AI benchmark version tracking.
- Public submission workflow for companies and models.

### Open Decisions Before Implementation

- Whether the first visible page should be Home Overview or a default Track Ranking page.
- Whether the UI language should be English-only first, or English UI with Chinese internal taxonomy labels.
- Whether Robotics should have one domain landing page first or immediately expose all six second-level tracks.
- Whether company detail pages are required in Phase 1 or can wait for Phase 2.
- Whether sample data is acceptable for frontend prototyping, or whether every row must be backed by workbook/imported data from day one.

## Goal-Mode Execution Blueprint

This section is written for a future one-pass execution run. The goal-mode agent should be able to follow this plan without reopening the whole strategy discussion.

### Execution Rule

Before implementation:

- Read this file completely.
- Inspect the existing project structure.
- Check git status.
- Preserve any user changes.
- Do not rewrite unrelated files.
- Do not start from a blank app unless the current scaffold is unusable.

During implementation:

- Build the product skeleton first.
- Use structured TypeScript data before UI styling.
- Keep visual density high and report-like hero sections out of the product.
- Prefer reusable components, but do not over-abstract before the first working prototype.
- Add sample data only when it is clearly labeled as prototype data.
- Do not present prototype scores as final researched rankings.

After implementation:

- Run typecheck/build when dependencies are available.
- Verify no obvious layout breakage on desktop and mobile widths.
- Report any dependency, network, or build issue explicitly.

## One-Pass Target Outcome

The first serious build should deliver a static but product-grade AI/Robotics ranking intelligence frontend.

It should include:

- A global product shell.
- A market overview dashboard.
- AI and Robotics as top-level domains.
- Track-level navigation.
- A dense ranking table.
- Multiple leaderboard views.
- Filters and custom column affordance.
- Watchlist / Shortlist / Alerts entry points.
- Company/model/robot detail page pattern.
- Methodology and source ledger pattern.
- Responsive behavior.
- Clean enough architecture for later data import.

It should not include yet:

- Real authentication.
- Backend API.
- Crawler integration.
- Payment or subscription logic.
- Real user accounts.
- Real watchlist persistence.
- Real-time charts.
- Real sponsored listing logic.

Those can be simulated as front-end states and placeholders.

## Recommended Product Shape

### Primary Navigation

Global navigation should expose user tasks:

- Rankings
- Trending
- New
- Categories
- Companies
- Models
- Robotics
- Methodology
- Sources
- Watchlist
- Alerts
- Get Listed

This should feel closer to CoinMarketCap, Crunchbase, Artificial Analysis, and G2 than to a corporate landing page.

### First Screen

The first visible screen should be `Market Overview`, not a marketing hero.

Above the fold:

- Compact top nav.
- Market pulse bar.
- Search.
- Domain switcher: AI / Robotics.
- Leaderboard view tabs.
- Main ranking table preview.
- Right-side intelligence rail.

### Core Page Types

The app should be organized around these page concepts even if real routing is implemented later:

1. Market Overview
2. Domain Overview
3. Track Ranking
4. Entity Detail
5. Methodology
6. Source Ledger
7. Watchlist / Shortlist
8. Get Listed / Claim Profile

## Implementation Phases

### Phase 0: Project Audit And Cleanup

Goal: understand the current scaffold and remove obvious blockers.

Tasks:

- Check `package.json`, `src/main.tsx`, `src/app/App.tsx`, current components, styles, and data files.
- Confirm whether Chinese text is corrupted in source files.
- Decide whether to fix corrupted text during the first implementation.
- Confirm whether `node_modules` and lockfile exist.
- Do not install new dependencies unless necessary.
- Record build constraints.

Acceptance:

- Current repo state is understood.
- Existing app entry is identified.
- Implementation files are known.

### Phase 1: Data Contract

Goal: define a data structure that can power the whole prototype.

Files:

- `src/types/rankings.ts`
- `src/data/rankingData.ts`
- Optional: `src/data/referenceSources.ts`
- Optional: `src/data/mockTrends.ts`

Core types:

- `Domain`
- `Track`
- `Entity`
- `RankingRow`
- `DimensionScore`
- `Metric`
- `TrendPoint`
- `Source`
- `Evidence`
- `LeaderboardView`
- `FilterState`
- `ColumnDefinition`

Required fields for `Entity`:

- id
- name
- logoText or logoUrl
- entityType: company | model | product | robot | infrastructure | service
- domainId
- trackIds
- country
- region
- foundedYear
- stage
- tags
- summary
- website
- sourceIds

Required fields for `RankingRow`:

- rank
- entityId
- score
- scoreChange
- momentum
- category
- trafficProxy
- fundingProxy
- launchDate
- addedDate
- githubSignal
- researchSignal
- patentSignal
- sentiment
- status
- sparkline
- dimensionScores
- evidenceCount

Required fields for `Source`:

- id
- title
- publisher
- url
- type
- quality
- lastChecked
- notes

Acceptance:

- UI can render all pages from local TypeScript data.
- All ranking rows can trace to at least one source object.
- Sample data is clearly identifiable as prototype data.

### Phase 2: App Shell

Goal: replace the current report-like shell with a product shell.

Files:

- `src/app/App.tsx`
- `src/app/app.css`
- `src/styles/global.css`
- `src/components/AppShell.tsx`
- `src/components/TopNav.tsx`
- `src/components/MarketPulse.tsx`
- `src/components/DomainSwitcher.tsx`

Layout:

- Top nav.
- Left domain / track navigation on desktop.
- Main content region.
- Right intelligence rail on desktop.
- Mobile collapses navigation into horizontal chips and stacked sections.

Acceptance:

- No oversized marketing hero.
- First viewport is dense and useful.
- AI and Robotics are visible as top-level product areas.

### Phase 3: Market Overview Page

Goal: create the main product entry.

Components:

- `MarketOverview`
- `MarketPulse`
- `LeaderboardTabs`
- `TopicPrompts`
- `TrendingPanel`
- `RecentAdditionsPanel`
- `MethodologyConfidence`
- `SourceCoverageCard`

Market pulse metrics:

- Products Tracked
- Companies / Labs
- 24h Attention
- Funding / Revenue Proxy
- Category Dominance
- Inference Cost / GPU Cost Index
- AI Market Sentiment

Topic prompts:

- Which AI coding tools are growing fastest this week?
- What new robotics startups launched recently?
- Which model providers changed pricing this month?
- What open-source agents are trending on GitHub?
- Which humanoid robotics companies have new demos?

Acceptance:

- User understands the market state in the first screen.
- User can jump from overview into a leaderboard view.
- Product feels like a market terminal, not a report.

### Phase 4: Ranking Table

Goal: make the ranking table the central interaction surface.

Components:

- `RankingTable`
- `RankingToolbar`
- `FilterBar`
- `ColumnSelector`
- `ScoreCell`
- `Sparkline`
- `TrendBadge`
- `EvidenceBadge`
- `EntityNameCell`

Default columns:

- Rank
- Name
- Category
- Score
- 7d Change
- Traffic / Users
- Funding / Revenue Proxy
- GitHub / Research / Patents
- Sentiment
- Status
- Trend
- Evidence

Leaderboard views:

- Top
- Trending
- New
- Most Visited
- Fastest Growing
- Most Funded
- Open Source
- Enterprise Ready
- Community Sentiment
- Robotics

Filter groups:

- Domain
- Track
- Region
- Category
- Entity type
- Stage
- Open-source status
- Enterprise readiness
- Deployment model
- Funding stage
- Evidence quality

Acceptance:

- Table supports changing active leaderboard view.
- Filters visibly affect displayed rows.
- Column customization can be a non-persistent prototype interaction.
- Rows can lead to entity detail state/page.

### Phase 5: Entity Detail Page

Goal: define the reusable detail page for companies, models, products, and robot vendors.

Components:

- `EntityDetail`
- `EntityHeader`
- `EntityStats`
- `EntityTrendChart`
- `AvailabilityTable`
- `PricingCalculator`
- `DimensionBreakdown`
- `EvidencePanel`
- `NewsTimeline`
- `CommunitySignals`
- `RelatedEntities`
- `ClaimProfilePanel`

First screen:

- Logo / name / tags.
- Rank badge.
- Main score.
- Score or momentum change.
- Watchlist and shortlist actions.
- Trend chart.
- Key stats.

AI-native stats:

- Valuation / Funding / ARR Estimate
- Traffic Scale
- API Calls or Downloads
- GitHub Activity
- Model Downloads
- Customers / Developers
- Robot Deployments
- Pricing
- Latency
- SLA
- Evidence Quality

Availability / Providers / Channels:

- API
- Cloud
- Open Source
- Hugging Face
- AWS Bedrock
- Azure
- Vertex AI
- Self-hosted
- Direct Sales
- Integrators
- RaaS
- Region Availability

Acceptance:

- Detail page uses the same data model as the table.
- User can understand why an entity ranks where it does.
- User can find sources, alternatives, and channels.

### Phase 6: Methodology And Source Ledger

Goal: make ranking credibility visible.

Components:

- `MethodologyPage`
- `ScoringDimensions`
- `DataQualityLegend`
- `ProxyRules`
- `SourceLedger`
- `SourceCard`
- `EvidenceTrail`

Methodology should explain:

- Composite score.
- Momentum score.
- Benchmark score.
- Evidence quality.
- Direct public data.
- Benchmark data.
- Official proxy.
- Low-disclosure proxy.
- Versioning and change log.
- Sponsored listing disclosure.

Source ledger columns:

- Source ID
- Publisher
- Type
- URL
- Last checked
- Quality
- Related entities
- Related indicators
- Notes

Acceptance:

- Every sample source is visible.
- Ranking credibility is not hidden.
- Prototype makes it obvious how real evidence will be connected later.

### Phase 7: Watchlist, Shortlist, Alerts

Goal: add product retention surfaces without backend persistence.

Components:

- `WatchlistButton`
- `ShortlistButton`
- `AlertsPanel`
- `SavedViewMock`

Prototype behavior:

- Toggle watchlist state in memory.
- Toggle shortlist state in memory.
- Show alert types but no real notification delivery.
- Allow saved view mock but no persistence.

Alert types:

- Rank change.
- Pricing change.
- New benchmark.
- New funding.
- New model release.
- Traffic spike.
- GitHub spike.
- New robotics deployment.

Acceptance:

- User sees why they would return to the product.
- Features are clearly UI prototypes, not fake backend systems.

### Phase 8: Responsive And Visual Polish

Goal: make the product credible across desktop and mobile.

Desktop:

- Dense table.
- Sticky header.
- Left navigation.
- Right intelligence rail.
- Column customization.

Mobile:

- Market pulse as horizontal ticker.
- Leaderboard tabs as horizontal chips.
- Default table columns reduced to rank, name, category, score, growth, and trend.
- Detail metrics stacked.
- Filters in a drawer or collapsible section.

Visual rules:

- Use a calm data-product palette.
- Avoid oversized hero typography.
- Avoid decorative gradients and marketing cards.
- Keep repeated item cards at 8px radius or less.
- Use compact metrics, trend chips, sparkline charts, and evidence badges.
- Use color for semantic state: positive, negative, neutral, warning, source quality.

Acceptance:

- No incoherent overlaps.
- Text fits in buttons, chips, table cells, and cards.
- Mobile remains usable.

### Phase 9: Verification

Goal: ensure the prototype actually runs.

Commands:

- `npm install` only if dependencies are missing and network is available.
- `npm run build`

Manual checks:

- App loads.
- Domain switch works.
- Leaderboard view switch works.
- Filters work.
- Row selection/detail works.
- Watchlist/shortlist mock actions work.
- Methodology and source ledger are visible.
- Desktop and mobile layouts are usable.

Acceptance:

- Build passes, or failure is clearly reported with cause.
- No TypeScript errors introduced intentionally.
- Git status is summarized.

## Proposed File Structure

Target structure:

```text
src/
  app/
    App.tsx
    app.css
  components/
    AppShell.tsx
    TopNav.tsx
    MarketPulse.tsx
    DomainSwitcher.tsx
    LeaderboardTabs.tsx
    RankingToolbar.tsx
    RankingTable.tsx
    EntityDetail.tsx
    EntityHeader.tsx
    EntityStats.tsx
    EntityTrendChart.tsx
    AvailabilityTable.tsx
    MethodologyPanel.tsx
    SourceLedger.tsx
    WatchlistButton.tsx
    Sparkline.tsx
    Badge.tsx
  data/
    rankingData.ts
    referenceSources.ts
  styles/
    global.css
  types/
    rankings.ts
  utils/
    formatters.ts
    rankingFilters.ts
```

Keep the number of files reasonable in the first pass. If the first run needs speed, combine small display components, but keep data, types, app shell, and table logic separate.

## Suggested First Build Data Scope

Use enough prototype data to exercise the UI:

- 2 domains: AI, Robotics.
- 7 AI tracks.
- 6 Robotics tracks.
- 40-80 total entities across all tracks.
- 10-20 source records.
- 6-8 scoring dimensions.
- 8-12 trend samples per entity for sparklines.

Do not try to create final researched rankings in the frontend task. The goal is UI structure.

## Data Integrity Rules

Prototype data must be marked:

- `dataStatus: "prototype"`
- `lastUpdated`
- `sourceIds`
- `evidenceQuality`

Do not fabricate exact public market share, ARR, retention, customer count, or revenue as if final.

Allowed prototype fields:

- `trafficProxy`
- `fundingProxy`
- `revenueProxy`
- `developerSignal`
- `adoptionSignal`
- `momentumScore`

Each proxy should have a note field explaining it is a placeholder or proxy.

## Implementation Order For A Single Goal-Mode Run

Follow this exact order:

1. Read `plan.md`.
2. Inspect current repo.
3. Check git status.
4. Restore or avoid touching unrelated dirty files.
5. Replace corrupted placeholder copy only as part of the new implementation.
6. Define types.
7. Define data.
8. Build app shell.
9. Build market overview.
10. Build ranking table.
11. Build filters and leaderboard tabs.
12. Build entity detail.
13. Build methodology/source panels.
14. Build watchlist/shortlist mock interactions.
15. Polish responsive CSS.
16. Run build.
17. Report what changed and what still needs real data.

## Non-Goals For First Build

- Do not implement authentication.
- Do not implement a real database.
- Do not implement crawler jobs.
- Do not implement payments.
- Do not implement real alert delivery.
- Do not implement infinite enterprise-grade table virtualization unless needed.
- Do not turn the product into a marketing landing page.

## Definition Of Done

The first implementation is done when:

- It no longer looks like a static report.
- It feels like a real market data product.
- AI and Robotics are first-class domains.
- Ranking table is the core interaction.
- Users can switch leaderboard views.
- Users can filter and inspect rows.
- Users can open an entity detail state/page.
- Methodology and source evidence are visible.
- Watchlist / shortlist / alerts are visible as future product loops.
- Layout works on desktop and mobile.
- The code is organized enough to connect real workbook/imported data later.
