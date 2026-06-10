# Claude Frontend Operating Rules

This project is an overseas-facing AI and Robotics ranking product. Visual quality is a hard requirement, not a polish phase.

Use these local skills when doing frontend design work:

- `redesign-existing-projects` for existing UI upgrades.
- `design-taste-frontend` for anti-template design judgment.
- `minimalist-ui` or `industrial-brutalist-ui` only when they fit the product direction.
- `gpt-taste` is not the default for this project because it can push the app toward landing-page or motion-heavy aesthetics.

Product direction:

- Build a ranking-first intelligence product, not a report page.
- The first viewport must expose the leaderboard, controls, evidence, and selected-entity intelligence quickly.
- Treat score, rank, movement, methodology confidence, source quality, watchlist, and comparison as core product signals.
- Favor dense, credible, institutional data-product design over decorative marketing composition.

Design constraints:

- Do not create a landing page hero.
- Do not add purple AI gradients, decorative orbs, bokeh blobs, or generic SaaS card piles.
- Do not bury the ranking table below explanatory content.
- Do not add dependencies unless Codex explicitly approves.
- Keep text readable at mobile and desktop widths; do not allow button, table, or card text overflow.
- Keep letter spacing at `0`.
- Preserve all existing workflows unless the task explicitly says otherwise.

Workflow:

1. Audit the current screenshot or running page before redesigning.
2. Name the specific weak visual patterns being fixed.
3. Change only the files assigned by Codex.
4. Build a visibly better product surface, then let Codex run build and screenshot verification.
