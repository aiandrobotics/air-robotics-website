# Plan

## Task Group 1: Standalone Robot Docs Template (`templates/robot-docs/`)
1. Create `templates/robot-docs/` as a self-contained, runnable standalone robot documentation scaffold using Astro 7 + Starlight 0.43 + `@air-robotics/docs-theme`:
   - `docs/package.json` — installs `@air-robotics/docs-theme` via `github:aiandrobotics/air-robotics-website#main&path:packages/theme` (or local override for offline tests), `astro`, `@astrojs/starlight`, `@astrojs/check`, and `typescript`.
   - `docs/astro.config.mjs` — uses `createAirStarlightConfig()` from `@air-robotics/docs-theme` with Starlight sidebar `items: [{ autogenerate: { directory: '.' } }]`.
   - `docs/tsconfig.json`, `docs/src/content.config.ts`, `docs/src/content/docs/index.mdx`, `docs/src/content/docs/getting-started.mdx`, and `docs/public/.gitkeep`.
   - `.github/workflows/docs.yml` — validates standalone docs (`pnpm install`, `pnpm check`, `pnpm build`) on PRs, and on push to `main` (when `docs/` changes) sends a `repository_dispatch` (`event_type: "robot-docs-updated"`) to `aiandrobotics/air-robotics-website` using `AIR_WEBSITE_DISPATCH_TOKEN`.
   - `README.md` — concise instructions for running standalone (`pnpm --dir docs dev`), building (`pnpm --dir docs build`), and registering in `air-robotics-website/robots.yaml`.
2. Ensure `templates/robot-docs/` is excluded from `air-robotics-website`'s root `pnpm-workspace.yaml` (so it remains an independent project) and ignored where appropriate by Biome if template placeholders exist, while keeping all template files cleanly formatted.

## Task Group 2: Standalone & Aggregation Verification of Template
1. Verify `templates/robot-docs/docs/` builds cleanly standalone (`pnpm install && pnpm check && pnpm build`).
2. Verify `templates/robot-docs/` aggregates cleanly into `air-robotics-website` via `scripts/sync-robot-docs.mjs --manifest <temp-manifest>` and builds `/docs/<slug>/index.html` and `/docs/<slug>/getting-started/index.html`.

## Task Group 3: `air-robot-docs` Agent Skill Plugin (`sathyavikram/agent-plugins`)
1. Inspect `https://github.com/sathyavikram/agent-plugins.git` (existing local clone or fresh clone) to match its exact plugin directory layout, `plugin.json` / manifest conventions, and skill structure.
2. Create the `air-robot-docs` plugin containing:
   - `skills/air-robot-docs/SKILL.md` — complete, actionable instructions for bootstrapping and maintaining standalone Air Robotics robot docs repos:
     - Tech stack (`Astro 7`, `Starlight 0.43`, `pnpm`, strict TypeScript, `@air-robotics/docs-theme` via `github:aiandrobotics/air-robotics-website#main&path:packages/theme`)
     - Exact directory layout (`docs/src/content/docs/`, `docs/public/`, `docs/astro.config.mjs`, `docs/src/content.config.ts`)
     - Starlight v0.43 sidebar rules (`items: [{ autogenerate: ... }]`), frontmatter & asset path conventions (`/robots/<slug>/...` vs relative assets)
     - Local standalone preview & build commands
     - GitHub Actions workflow (`docs.yml`) for PR validation + `repository_dispatch` (`robot-docs-updated`) trigger
     - Registering the robot in `air-robotics-website/robots.yaml` (`syncEnabled: true`)
   - Supporting reference/template snippets matching `templates/robot-docs/`.
3. Commit and push the new plugin to `https://github.com/sathyavikram/agent-plugins.git` after verification.

## Task Group 4: Final Validation
1. Re-run `pnpm test:aggregation`, `pnpm sync:docs`, `pnpm lint`, `pnpm check`, and `pnpm build` in `air-robotics-website`.
2. Confirm both `air-robotics-website` and `agent-plugins` working trees are clean with all checks passing.
