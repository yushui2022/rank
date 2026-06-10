# Rank Intelligence

Frontend prototype for an overseas-facing AI and Robotics ranking intelligence product.

This version turns the initial report-like scaffold into a market terminal style product surface:

- AI and Robotics as top-level domains
- Track navigation for model, agent, infrastructure, hardware, media, autonomy, governance, and robotics markets
- Market pulse metrics
- Multiple leaderboard views
- Dense ranking table with filters, evidence count, trend sparklines, watchlist, and shortlist actions
- Entity detail panel with score, metrics, availability channels, source evidence, and claim-profile actions
- Methodology and source ledger sections

## Scripts

```bash
npm install --cache .npm-cache
npm run build
npm run dev
npm run preview
```

On this Windows machine, `npm` may be blocked by PowerShell script policy. Use `npm.cmd` when needed:

```bash
npm.cmd install --cache .npm-cache
npm.cmd run build
```

## Data Status

The ranking data in this repository is prototype data for frontend development. It is not a final researched ranking.

Final production data should be imported from researched workbooks or a verified data pipeline, with sources, source quality, and proxy notes attached to each ranking row.

## Planning

See `plan.md` for the detailed product plan, reference research, execution blueprint, and first-build acceptance criteria.
