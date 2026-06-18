# Rank Intelligence

Rank Intelligence is a desktop web frontend for an overseas-facing AI company
ranking product. The primary live surface is **Industry Rankings**: 8 AI domains,
40 workbook-backed tracks, and Top 20 company rankings for each track.

This README is intentionally detailed. Treat it as the project memory for future
agents and maintainers. If a change requires reading generated data or searching
many files to understand the architecture, update this document after the change.

## Current Product Surface

The app currently supports:

- Industry Rankings: real workbook-backed ranking data.
- Company detail pages: score explanation, market position, product summary,
  evidence sources, and peer context.
- Community vote controls on ranking rows.
- Static/demo category pages for non-industry tabs:
  `AI Top 100 Influencers`, `AI Under 25`, `Top Contributors`,
  `Global AI Cities TOP 10`, `Top 10 AI Universities`, and `Special Reports`.

The app has no backend today. All live ranking data is generated into frontend
modules from local workbook outputs.

## Product Boundaries

- This is a ranking-first product, not a landing page and not a report page.
- The leaderboard is the center of the product.
- Company score, rank, movement, evidence, and peer comparison are product
  signals, not decoration.
- Do not change product copy, layout, ranking semantics, or interaction behavior
  during engineering-only refactors.
- Right now the intended target is web. The CSS contains responsive support, but
  desktop web is the main acceptance viewport.

## Routes

The app uses hash routing in `src/app/App.tsx`.

```text
#/                                      Industry Rankings
#/company/{entityId}?track={trackId}    Company detail page
```

Examples:

```text
http://127.0.0.1:5180/#/
http://127.0.0.1:5180/#/company/openai?track=foundation_models_base_models_top20
```

Route behavior:

- Unknown hashes fall back to Industry Rankings.
- Company detail pages resolve the company by `entityId`.
- If `track` is present and the company belongs to that track, the detail page
  uses that track.
- If `track` is missing or invalid, the app falls back to the first known track
  for that company via `entityTrackIndex`.
- `Back to rankings` clears the hash and returns to `#/`.

## High-Level Architecture

```text
Workbook outputs
  -> scripts/generate_frontend_data.py
  -> src/data/generated/*
  -> src/data/rankingRepository.ts
  -> src/hooks/*
  -> src/utils/rankingLogic.ts
  -> pages/components
```

The core rule is: **generated data is not UI logic**. Pages and components should
not import generated files directly.

## Directory Map

```text
src/app/App.tsx                         Hash routing, lazy page loading, tabs
src/pages/RankingsPage.tsx              Industry Rankings page container
src/pages/CompanyDetailPage.tsx         Company detail page container
src/pages/CategoryDemoPage.tsx          Static/demo pages for non-industry tabs

src/components/rankings/*               Domain switcher, mini boards, main table
src/components/company/*                Logo, detail metrics, evidence, peers
src/components/voting/*                 Community sentiment vote interaction
src/components/navigation/*             Top navigation
src/components/shared/*                 Small shared display components

src/data/generated/*                    Generated ranking data, do not hand-edit
src/data/rankingRepository.ts           Runtime data loading boundary and cache
src/data/rankingData.ts                 Compatibility re-export for domains/tracks
src/data/categoryDemoRankings.ts        Static demo data for non-industry pages

src/hooks/useTrackRecords.ts            Active leaderboard records
src/hooks/useCompanyDetail.ts           Company detail data
src/utils/rankingLogic.ts               Pure ranking/filter/sort/detail logic
src/types/rankings.ts                   Source data model
src/types/rankingRuntime.ts             Runtime view model types

src/styles/tokens.css                   Design tokens
src/styles/layout.css                   Shell/workspace layout
src/styles/rankings.css                 Domain and ranking panel styling
src/styles/ranking-table.css            Main Top 20 table
src/styles/mini-boards.css              Three small ranking boards
src/styles/company-detail.css           Company detail page
src/styles/voting.css                   Vote controls and animation
src/styles/responsive.css               Responsive rules
src/styles/index.css                    CSS import barrel
```

## Generated Data Contract

Generated files live under `src/data/generated/**`.

Do not hand-edit them. Change `scripts/generate_frontend_data.py`, then run:

```bash
python scripts/generate_frontend_data.py
```

Generated files:

```text
src/data/generated/manifest.ts
  domains: Domain[]
  tracks: Track[]
  entityTrackIndex: Record<string, string[]>

src/data/generated/entities.ts
  entities: Entity[]

src/data/generated/sources.ts
  sources: Source[]

src/data/generated/trackLoaders.ts
  trackDataLoaders: Record<string, () => Promise<{ trackDataset }>>

src/data/generated/tracks/{trackId}.ts
  trackDataset: TrackRankingDataset
  only contains { trackId, rankings }
```

The normalized shape matters:

- `entities.ts` stores each company once.
- `sources.ts` stores each evidence source once.
- Each track file stores only ranking rows for that track.
- This avoids duplicating entities and sources across 40 track chunks.
- `.gitattributes` marks `src/data/generated/**` as generated for GitHub.

## Workbook Pipeline

The generator reads workbook outputs from:

```text
outputs/019e910c-af91-7f70-b575-98ceeb8830a1/industry_rankings
```

Each workbook is expected to provide at least these sheets:

```text
Ranking
Detailed Scoring
Sources
Methodology
```

Important generator constants in `scripts/generate_frontend_data.py`:

```text
SNAPSHOT_DATE = "2026-06-06"
OUTPUT_ID = "019e910c-af91-7f70-b575-98ceeb8830a1"
DEFAULT_RANKING_SIZE = 20
FOLDER_LABELS = 8 top-level AI domains
TRACK_LABEL_OVERRIDES = stable English names for track slugs
```

The generator writes TypeScript modules, not JSON files, so Vite can lazy-load
each track through dynamic imports.

## Runtime Data Loading

`src/data/rankingRepository.ts` is the only runtime layer that should know about
generated module locations.

Exports:

```ts
domains
tracks
trackById
preferredTrackForDomain(domainId)
resolveEntityTrackId(entityId, preferredTrackId?)
loadTrackDataset(trackId)
loadTrackEvidenceDataset(trackId)
readTrackDataset(trackId)
readTrackEvidenceDataset(trackId)
```

Loading model:

- `loadTrackDataset(trackId)` loads:
  - one track ranking chunk from `tracks/{trackId}.ts`
  - global `entities.ts`
  - no sources
- `loadTrackEvidenceDataset(trackId)` loads:
  - the same track dataset
  - global `sources.ts`
- `readTrackDataset` and `readTrackEvidenceDataset` throw promises while loading.
  They are intended to run under React `Suspense`.
- `App.tsx` wraps pages in `Suspense`, so hooks can use read-style loading.
- The repository caches loaded and pending datasets in module-level maps.

Why sources load separately:

- The leaderboard needs rankings and entities.
- The detail page needs evidence sources.
- Keeping sources out of the first leaderboard load reduces unnecessary work.

## Hooks

Use these hooks from pages instead of importing repository or generated data
inside components.

`useTrackRecords(trackId, filters, sortKey, sortDirection)`

- Used by `RankingsPage`.
- Reads the active track dataset.
- Calls `recordsForDataset`.
- Slices to Top 20.

`useCompanyDetail(entityId, preferredTrackId?)`

- Used by `CompanyDetailPage`.
- Resolves the correct track for the company.
- Reads the evidence dataset.
- Returns:
  - `detail`
  - `evidence`
  - `peers`

## Ranking Logic

`src/utils/rankingLogic.ts` is pure data logic. It should not import generated
data or React.

Main exports:

```ts
scoreForView(record, activeView)
compareRecords(sortKey, direction, activeView)
recordsForDataset(dataset, activeView, filters, sortKey, sortDirection)
recordForEntityInDataset(dataset, track, entityId)
sourcesForRecord(dataset, row, entity)
peerRecordsForDataset(dataset, entityId)
```

Current visible leaderboard view is fixed to `"top"` in `useTrackRecords`, but
the older view scoring logic remains available in `rankingLogic.ts`.

Sort keys:

```text
view       score/view score
1w         row.rank1mChange, displayed as 1W movement
momentum   row.momentum
```

The UI label says `1W`, but the data field is still named `rank1mChange` for
legacy compatibility. Do not rename it casually; update generator, types,
components, and verifier together if changing it.

## Data Types

Source model: `src/types/rankings.ts`

Important types:

```ts
Domain
Track
Entity
Source
DimensionScore
RankingRow
FilterState
```

Runtime model: `src/types/rankingRuntime.ts`

Important types:

```ts
RankingRecord = { row, entity }
ScoredRecord = RankingRecord & { viewScore }
TrackRankingDataset = { trackId, rankings }
TrackDataset = TrackRankingDataset & { entities, sources }
CompanyDetailRecord = ScoredRecord & { track }
SortKey = "view" | "1w" | "momentum"
SortDirection = "asc" | "desc"
```

## Industry Rankings Page

File: `src/pages/RankingsPage.tsx`

Responsibilities:

- Owns active domain, active track, selected entity, sort key, and sort direction.
- Uses `DomainSwitcher` for left-side domain/track navigation.
- Uses `MiniBoardsStrip` for the three small boards.
- Uses `RankingTable` for the Top 20 leaderboard.
- Opens company detail by setting:

```ts
window.location.hash =
  `/company/${encodeURIComponent(entityId)}?track=${encodeURIComponent(trackId)}`;
```

Behavior to preserve:

- Main table shows Top 1-10 and Top 11-20 in two columns.
- Clicking a row/company opens the company detail page.
- Clicking vote controls should not navigate to detail.
- Sort buttons preserve current product semantics.

## Company Detail Page

File: `src/pages/CompanyDetailPage.tsx`

Responsibilities:

- Uses `useCompanyDetail`.
- Shows not-found state if no matching company/track record exists.
- Shows company identity, official website, rank, score, 1W movement, momentum,
  evidence count, score rationale, market position, representative product,
  evidence list, and peer context.
- Uses URL `track` as the preferred comparison track.

Fallback behavior:

- Missing `marketPositioning` falls back to `entity.summary`.
- Missing `representativeProduct` falls back to `row.category + entity.tags`.
- Missing evidence shows the evidence pending state in `CompanyEvidenceList`.

## Category Demo Pages

File: `src/pages/CategoryDemoPage.tsx`

These are static/demo category pages for tabs other than Industry Rankings.
They use `src/data/categoryDemoRankings.ts`, not workbook-generated ranking data.

Do not confuse them with the live Industry Rankings pipeline.

## Voting Module

Files:

```text
src/components/voting/CommunitySentimentVote.tsx
src/styles/voting.css
```

Behavior:

- Inline vote controls appear inside ranking rows.
- Votes are local UI state only.
- The vote area must stop event bubbling so row navigation does not trigger.
- Percentages are revealed after click.
- The current animation is part of the product experience; do not change it
  during data or architecture refactors.

## CSS Layering

CSS is imported through `src/styles/index.css`.

Current order:

```css
@import "./tokens.css";
@import "./layout.css";
@import "./navigation.css";
@import "./rankings.css";
@import "./ranking-table.css";
@import "./mini-boards.css";
@import "./voting.css";
@import "./company-detail.css";
@import "./category-demo.css";
@import "./responsive.css";
```

When changing styles:

- Prefer editing the smallest domain CSS file.
- Do not create broad overrides in `global.css`.
- Keep `tokens.css` for reusable variables.
- Verify at least 1440 x 900. Existing checks also use 1280 x 800 and
  1920 x 1080 when layout risk is high.

## Validation Commands

Use `npm.cmd` on this Windows machine if PowerShell blocks `npm`.

```bash
npm.cmd run check
```

This runs:

```bash
python scripts/verify_generated_data.py
tsc -b && vite build
```

Run only the generator:

```bash
python scripts/generate_frontend_data.py
```

Run only data verification:

```bash
npm.cmd run verify:data
```

Run development server:

```bash
npm.cmd run dev
```

The current local dev URL used in recent work has been:

```text
http://127.0.0.1:5180/#/
```

Vite may choose a different port if 5180 is occupied.

## Data Verification Guarantees

`scripts/verify_generated_data.py` checks:

- `manifest.ts` exists.
- `entities.ts` exists and is non-empty.
- `sources.ts` exists and is non-empty.
- Every manifest track has a generated track file.
- Every track references a known domain.
- Every track dataset has matching `trackId`.
- Every track has ranking rows.
- `track.companyCount` matches ranking row count.
- `track.sourceCount` matches owned sources.
- Ranking rows reference existing entities.
- Ranking rows reference existing sources.
- Entity `trackIds` include the track using that entity.
- `entityTrackIndex` includes the correct track for every row.
- No extra track files exist outside the manifest.

## Common Change Recipes

Add or update workbook-backed ranking data:

1. Update the workbook files under the output folder.
2. Run `python scripts/generate_frontend_data.py`.
3. Run `npm.cmd run check`.
4. Do not hand-edit `src/data/generated/**`.

Add a new ranking track:

1. Add the workbook in the correct domain folder.
2. Add a stable English label to `TRACK_LABEL_OVERRIDES` if needed.
3. Regenerate data.
4. Verify `manifest.ts` contains the track.
5. Run `npm.cmd run check`.

Add a new domain:

1. Add it to `FOLDER_LABELS`.
2. Confirm `domain_for_folder` produces the desired `domainId`.
3. Add workbook files under that folder.
4. Regenerate and verify.
5. Check `DomainSwitcher` visually because left navigation width may be affected.

Add a new company detail field:

1. Add the field to workbook source or generator mapping.
2. Add/adjust the relevant type in `src/types/rankings.ts`.
3. Regenerate data.
4. Read through `useCompanyDetail` and `CompanyDetailPage`.
5. Add fallback behavior for missing data.
6. Run `npm.cmd run check`.

Change leaderboard sorting:

1. Update `SortKey` in `src/types/rankingRuntime.ts` if the key is new.
2. Update `sortValue` in `src/utils/rankingLogic.ts`.
3. Update headers/buttons in `RankingTable`.
4. Verify visible sort labels and behavior.

Change route behavior:

1. Update `routeFromHash` in `src/app/App.tsx`.
2. Update navigation functions in `RankingsPage` or detail page if needed.
3. Test direct URL refresh and browser back behavior.

Refactor UI only:

1. Do not touch generated data or generator scripts.
2. Keep the same props and event behavior where possible.
3. Run build.
4. Take screenshots before and after.

Refactor data/runtime only:

1. Do not change product copy or CSS.
2. Keep screenshot hashes or visual output equivalent when possible.
3. Run `npm.cmd run check`.
4. Verify at least `#/` and one company detail URL.

## Known Compatibility Notes

- `src/data/rankingData.ts` is a thin compatibility export for domains/tracks.
  Prefer `rankingRepository.ts` for new runtime code.
- `LeaderboardViewId` still includes historical views even though the current
  visible Industry Rankings surface is fixed to `"top"`.
- `rank1mChange` is displayed as `1W` in the UI. This is legacy naming.
- `CategoryDemoPage` and `categoryDemoRankings.ts` are separate static demo
  surfaces. They are not generated from the workbook pipeline.
- Generated files are intentionally committed so the app can run without
  requiring workbook parsing at runtime.

## Agent Rules

Before changing code:

1. Read this README.
2. Read `AGENTS.md`.
3. If doing design/UI work, read `CLAUDE.md` for visual constraints.
4. Identify whether the task is product, data, runtime, style, or infrastructure.
5. Avoid touching unrelated layers.

Never do these casually:

- Hand-edit `src/data/generated/**`.
- Rename `entityId`, `trackId`, `rank1mChange`, `sourceIds`, or route params
  without updating all dependent layers.
- Change vote bubbling behavior.
- Move generated data imports into React components.
- Add dependencies for simple UI or data transformations.
- Reintroduce large one-file all-data imports for the leaderboard.

Good completion checklist:

```text
npm.cmd run check passes
git diff --check passes
No unintended product UI/copy changes
Generated data changed only through the generator
README updated if architecture changed
```
