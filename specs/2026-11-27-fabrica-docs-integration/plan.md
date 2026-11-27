# Plan

## Task Group 1: Inspect Fabrica Repo & Existing Content
1. Inspect `/home/vikram/Documents/workspace/fabrica/fabrica` (git remote, branch, existing docs/README/CAD/firmware/electronics files) and check `buildair-ai-v0` for any existing Fabrica documentation/assets worth migrating.
2. Map out the Starlight page structure under `docs/src/content/docs/` (`index.mdx`, `getting-started.mdx`, `hardware-bom.mdx`, `assembly.mdx`, `software.mdx`, plus any colocated images/assets).

## Task Group 2: Bootstrap Standalone Fabrica Docs Using `air-robot-docs`
1. Follow the `air-robot-docs` skill inside `/home/vikram/Documents/workspace/fabrica/fabrica`:
   - Create `docs/package.json` using Astro 7 + Starlight 0.43 + `@air-robotics/docs-theme` (`github:aiandrobotics/air-robotics-website#main&path:packages/theme`).
   - Create `docs/astro.config.mjs` using `createAirStarlightConfig()`, `docs/tsconfig.json`, and `docs/src/content.config.ts`.
   - Author clean, responsive Starlight documentation pages (`Overview`, `Getting Started`, `Hardware & BOM`, `Assembly`, `Software`) using relative internal links and fluid/responsive media & tables.
   - Add `.github/workflows/docs.yml` for standalone PR/push validation (`pnpm check && pnpm build`) without cross-repo dispatch.
   - Update Fabrica's `.gitignore` to ignore `docs/node_modules/`, `docs/dist/`, and `docs/.astro/`.
2. Verify Fabrica builds cleanly standalone (`pnpm --dir docs install && pnpm --dir docs check && pnpm --dir docs build`).

## Task Group 3: Connect Fabrica in `air-robotics-website`
1. Update `air-robotics-website/robots.yaml` for `fabrica`:
   - Set `syncEnabled: true`, `status: Active` (or `Beta` as appropriate), exact GitHub `repo` URL & `ref`, `docsPath: docs/src/content/docs`, and `assetsPath: docs/public`.
2. Run `pnpm sync:docs`, `pnpm lint`, `pnpm check`, and `pnpm build` in `air-robotics-website` to verify `/docs/fabrica/` and all subpages build cleanly with the auto-generated Starlight sidebar and updated `/robots/` catalog link.

## Task Group 4: Verification & Deployment Readiness
1. Confirm `site/dist/docs/fabrica/index.html` and all Fabrica subpages exist and render cleanly.
2. Confirm both repositories pass all checks and are ready to push (`fabrica` first, then `air-robotics-website` via `dev` → `main` when ready to publish).
