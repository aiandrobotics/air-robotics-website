# Requirements

## Scope

Phase 7 bootstraps standalone documentation inside the **Fabrica** robot repository (`/home/vikram/Documents/workspace/fabrica/fabrica`) using the `air-robot-docs` skill and shared `@air-robotics/docs-theme` package, then connects Fabrica into `air-robotics-website` so its docs aggregate cleanly at `/docs/fabrica/`.

In scope:
- Standalone Astro 7 + Starlight 0.43 documentation app under `/home/vikram/Documents/workspace/fabrica/fabrica/docs/` consuming `@air-robotics/docs-theme`.
- Migrated/adapted Fabrica documentation pages (Overview, Getting Started, Hardware/BOM, Assembly, Software) sourced from existing Fabrica files (and `buildair-ai-v0` where relevant), formatted cleanly and responsively for mobile, tablet, and desktop.
- Standalone CI validation workflow (`.github/workflows/docs.yml`) in the Fabrica repo (validating standalone builds only—no cross-repo dispatch required).
- `air-robotics-website/robots.yaml` updated with `syncEnabled: true` for `fabrica` so `pnpm sync:docs && pnpm build` aggregates Fabrica's docs into `/docs/fabrica/` and updates the `/robots/` catalog link automatically.

## Decisions

- **Fabrica Repo Path**: `/home/vikram/Documents/workspace/fabrica/fabrica`.
- **Initial Content**: Migrate and adapt existing Fabrica content from the Fabrica repo (and `buildair-ai-v0` if relevant) into clean Starlight pages (`Overview`, `Getting Started`, `Hardware & BOM`, `Assembly`, `Software`).
- **Deployment Trigger Model**: Manual/independent main-site updates—no cross-repo `repository_dispatch` token (`AIR_WEBSITE_DISPATCH_TOKEN`) is required. When Fabrica docs are ready, updating/triggering `air-robotics-website` (`dev` → `main`) pulls and publishes the latest Fabrica docs.
- **Responsive Design**: All Fabrica pages, tables, code blocks, and images must render cleanly across mobile, tablet, and desktop with zero horizontal overflow.

## Constraints

- Must follow the `air-robot-docs` skill (`docs/src/content/docs/index.mdx`, relative internal links, Starlight v0.43 `items: [{ autogenerate: ... }]` syntax, `@air-robotics/docs-theme` via `github:aiandrobotics/air-robotics-website#main&path:packages/theme`).
- Must keep `air-robotics-website` checks (`pnpm test:aggregation`, `pnpm sync:docs`, `pnpm lint`, `pnpm check`, `pnpm build`) green.
- Branch in `air-robotics-website`: `fabrica-docs-integration` (branched from `dev`).

## Non-goals

- Automatic cross-repo `repository_dispatch` triggers from `fabrica` to `air-robotics-website` (explicitly deferred; main site rebuilds will be triggered manually when docs are ready).
- Modifying Fabrica firmware, CAD, or electronics source code outside documentation.

## Context

- Source roadmap phase: **Phase 7: Fabrica Standalone Robot Docs & End-to-End Integration** in `specs/roadmap.md`.
- Depends on Phase 4 (`@air-robotics/docs-theme`), Phase 5 (`robots.yaml` + `scripts/sync-robot-docs.mjs`), and Phase 6 (`templates/robot-docs/` + installed `air-robot-docs` plugin).
