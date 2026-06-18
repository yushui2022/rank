# Rank Intelligence

Web frontend for an overseas-facing AI company ranking product.

The current production surface is the Industry Rankings module:

- 8 top-level AI domains.
- 40 workbook-backed ranking tracks.
- Top 20 company rankings per track.
- Company detail pages with score explanation, market positioning, representative product, evidence, and peer context.
- Community vote interaction on ranking rows.

## Architecture

The product UI is intentionally separated from generated ranking data.

```text
Workbook outputs
  -> scripts/generate_frontend_data.py
  -> src/data/generated/*
  -> src/data/rankingRepository.ts
  -> src/hooks/*
  -> pages/components
```

Key runtime files:

- `src/data/rankingRepository.ts`: data loading boundary and cache.
- `src/hooks/useTrackRecords.ts`: leaderboard records for the active track.
- `src/hooks/useCompanyDetail.ts`: detail page data for one company and one track.
- `src/utils/rankingLogic.ts`: pure ranking computation, sorting, evidence lookup, and peer context.
- `src/types/rankingRuntime.ts`: runtime types shared by hooks and components.

Generated data files:

- `src/data/generated/manifest.ts`: domains, tracks, and entity-to-track index.
- `src/data/generated/entities.ts`: global entity records, stored once.
- `src/data/generated/sources.ts`: global evidence/source records, stored once.
- `src/data/generated/tracks/*.ts`: per-track ranking rows only.

Do not hand-edit `src/data/generated/**`. Edit `scripts/generate_frontend_data.py` and regenerate.

## Scripts

```bash
npm install --cache .npm-cache
npm run dev
npm run build
npm run check
```

On this Windows machine, PowerShell may block `npm`. Use `npm.cmd` when needed:

```bash
npm.cmd install --cache .npm-cache
npm.cmd run dev
npm.cmd run check
```

## Data Validation

`npm run check` runs:

1. `python scripts/verify_generated_data.py`
2. `tsc -b && vite build`

The data verifier checks that domains, tracks, entities, ranking rows, source IDs, and entity-to-track indexes are internally consistent.
