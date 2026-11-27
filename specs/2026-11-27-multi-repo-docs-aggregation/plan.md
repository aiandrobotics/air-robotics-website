# Plan

## Task Group 1: Robot Registry Manifest (`robots.yaml`) & Schema Validation
1. Create root `robots.yaml` defining the canonical list of Air Robotics robots (initial entry: `fabrica` with `status: Coming Soon`, `syncEnabled: false`, metadata, highlights, repo URL, branch/ref, and docs/assets paths).
2. Create `scripts/lib/robots-manifest.mjs` (or `.ts`) that parses and validates `robots.yaml` (enforcing required fields, lowercase kebab-case unique `slug`, valid `status`, valid `repo` or `localPath` when `syncEnabled: true`, and clean error messages).
3. Update `site/src/data/robots.ts` to read directly from `robots.yaml` (or generated manifest JSON) so the Home page spotlight, `/robots/` catalog, and Starlight sidebar stay 100% driven by `robots.yaml` with zero hardcoded robot lists.

## Task Group 2: Build-Time Docs Ingestion & Starlight Integration
1. Implement `scripts/sync-robot-docs.mjs`:
   - Reads and validates `robots.yaml` (configurable via `--manifest <path>` for testing).
   - Cleans generated directories (`site/src/content/docs/docs/<slug>/` for managed robot slugs and `site/public/robots/<slug>/`) so removed or updated docs never leave stale files.
   - For each robot with `syncEnabled: true`:
     - Supports `localPath` (for local offline dev & automated tests) or shallow `git clone --depth 1 --branch <ref>` using `ROBOTS_READ_TOKEN` (falling back to `GITHUB_TOKEN` or unauthenticated clone for public repos).
     - Copies markdown/MDX docs from the robot's configured `docsPath` into `site/src/content/docs/docs/<slug>/`, validating that an entry `index.md`/`index.mdx` exists.
     - Copies static assets from the robot's configured `assetsPath` (if present) into `site/public/robots/<slug>/`.
   - Writes a generated sidebar metadata file (`site/src/generated/robot-sidebar.json`, gitignored) consumed by `site/astro.config.mjs` to auto-generate a Starlight sidebar group per synced robot (`autogenerate: { directory: 'docs/<slug>' }`).
2. Add root `package.json` scripts (`sync:docs`, `test:aggregation`) and update `.gitignore` to ignore generated synced robot docs (`site/src/content/docs/docs/*/`, `site/public/robots/`, `site/src/generated/`).

## Task Group 3: Wire Sync & `repository_dispatch` into GitHub Actions
1. Update `.github/workflows/deploy-dev.yml` to:
   - Trigger on `repository_dispatch` (`types: [robot-docs-updated]`) in addition to `push` to `dev` and `workflow_dispatch`.
   - Run `pnpm sync:docs` (passing `ROBOTS_READ_TOKEN: ${{ secrets.ROBOTS_READ_TOKEN }}`) before `pnpm build`.
2. Update `.github/workflows/deploy-prod.yml` and `.github/workflows/ci.yml` to run `pnpm sync:docs` before `pnpm build` (and run `pnpm test:aggregation` in `ci.yml`).
3. Document `ROBOTS_READ_TOKEN` and the `repository_dispatch` payload contract in `.github/README.md` and `scripts/README.md`.

## Task Group 4: Automated Aggregation Test & Validation
1. Create an automated end-to-end aggregation test (`scripts/test-aggregation.mjs`) that:
   - Creates a temporary local fixture robot repo (with `docs/index.mdx`, a subpage, and a static asset) and a temporary manifest adding that robot with `syncEnabled: true`.
   - Runs `sync-robot-docs` + `pnpm build` with zero edits to `site/` code.
   - Asserts `site/dist/docs/<slug>/index.html`, the subpage HTML, and the static asset exist in `site/dist/`, then cleans up temporary generated files and re-syncs with the real `robots.yaml`.
2. Run `pnpm test:aggregation`, `pnpm lint`, `pnpm check`, and `pnpm build` and confirm all checks pass cleanly.
