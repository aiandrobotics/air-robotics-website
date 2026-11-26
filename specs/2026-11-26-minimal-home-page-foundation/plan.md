# Plan

## Task Group 1: Root Workspace & Repository Layout
1. Configure root `package.json`, `pnpm-workspace.yaml`, `.gitignore`, and `.nvmrc` (Node.js LTS) for the `pnpm` workspace.
2. Scaffold the top-level repository directories:
   - `site/` — main Astro + Starlight website package
   - `packages/theme/` — minimal placeholder package (`@air-robotics/docs-theme`) ready for Phase 4 implementation
   - `infra/` — placeholder `README.md` documenting Terraform layout for Phase 2
   - `scripts/` — placeholder `README.md` documenting build/aggregation scripts for Phase 5
3. Configure Biome (`biome.json`) and root TypeScript strict base config (`tsconfig.base.json`), plus root workspace scripts (`dev`, `build`, `check`, `lint`, `format`).

## Task Group 2: Astro + Starlight Site Baseline
1. Initialize the `site/` workspace package with Astro, `@astrojs/starlight`, and strict TypeScript configuration extending the root config.
2. Configure `site/astro.config.mjs` with Starlight integration, site metadata (`Air Robotics`, `https://air-robotics.ai`), and static output (`site/dist/`).
3. Wire `site/` to reference the workspace `@air-robotics/docs-theme` stub package so workspace linking is verified early.

## Task Group 3: Minimal Home Page & Sample Starlight Route
1. Implement the minimal clean Air Robotics home page (`site/src/pages/index.astro`) featuring:
   - Clean Air Robotics hero and tagline
   - Placeholder "Robots" section ("Coming soon" with link to `/docs/`)
   - Minimal clean styling and responsive layout
2. Add one sample Starlight documentation page (`site/src/content/docs/docs/index.mdx` or Starlight `/docs/` route) confirming Starlight routing, sidebar, and static generation work alongside the custom Astro home page.

## Task Group 4: Documentation & Local Verification
1. Update root `README.md` with clear setup, dev server, lint/format, typecheck, and build commands.
2. Run full workspace checks: `pnpm install`, Biome lint/format check, Astro/TypeScript check (`astro check`), and production static build (`pnpm build`).
3. Verify `site/dist/` contains the generated home page (`index.html`) and sample `/docs/` route with zero build or type errors.
