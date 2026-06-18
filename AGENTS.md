# Agent Frontend Operating Rules

This project is an overseas-facing AI and Robotics ranking product. Visual quality is a hard requirement.

Use the installed taste skills as design constraints:

- `redesign-existing-projects`: default for improving the current app.
- `design-taste-frontend`: anti-generic design guidance.
- `minimalist-ui` / `industrial-brutalist-ui`: optional direction-specific constraints.
- `gpt-taste`: use only for ideation, not as the default implementation style.

Codex should act as product and engineering controller:

- Define the product goal, task boundaries, allowed files, and acceptance criteria.
- Review diffs, run builds, and verify with screenshots before finalizing.

Engineering boundaries:

- Do not hand-edit `src/data/generated/**`. Those files are generated from the workbook pipeline.
- Change generated ranking data by editing `scripts/generate_frontend_data.py`, then run `python scripts/generate_frontend_data.py`.
- Treat `src/data/rankingRepository.ts` as the runtime data boundary.
- Treat `src/utils/rankingLogic.ts` as pure ranking computation.
- Use `src/hooks/useTrackRecords.ts` for leaderboard records and `src/hooks/useCompanyDetail.ts` for company detail records.
- Product UI, copy, ranking semantics, and interaction behavior are sensitive. Do not change them during engineering-only refactors.
- Run `npm.cmd run check` after data or runtime refactors.

Design acceptance criteria:

- Ranking table and controls must be visible and central early in the viewport.
- The interface must feel like a credible ranking intelligence product, not a report or marketing site.
- Evidence quality, methodology confidence, score movement, and selected-entity intelligence should be first-class UI signals.
- Avoid decorative gradients, orbs, generic white-card dashboards, and landing-page hero sections.
- Text must fit on desktop and mobile. Letter spacing stays `0`.
