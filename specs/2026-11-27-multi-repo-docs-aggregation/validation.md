# Validation

## Required Checks

All commands below must run from the repository root and exit with code `0`:

1. **Automated multi-repo aggregation test**:
   ```bash
   pnpm test:aggregation
   ```
   Verifies:
   - Manifest validation rejects duplicate/invalid slugs and missing required fields.
   - Adding a fixture robot entry to a manifest with `syncEnabled: true` syncs its docs & assets and builds `site/dist/docs/<slug>/index.html`, subpage HTML, and static asset with zero changes to `site/` code.
2. **Default docs sync, lint, typecheck, and build**:
   ```bash
   pnpm sync:docs && pnpm lint && pnpm check && pnpm build
   ```
   Confirm all 5 main routes (`index.html`, `robots/index.html`, `about/index.html`, `contact/index.html`, `docs/index.html`) exist in `site/dist/`.
3. **Workflow YAML validation**:
   Confirm `.github/workflows/ci.yml`, `deploy-dev.yml`, and `deploy-prod.yml` parse cleanly as valid YAML and `deploy-dev.yml` includes `repository_dispatch` (`types: [robot-docs-updated]`).

## Manual Review

- Confirm `robots.yaml` is the sole source of truth for the robot catalog (no duplicated hardcoded robot entries in `site/src/data/robots.ts`).
- Confirm synced robot docs directories (`site/src/content/docs/docs/*/`, `site/public/robots/`, `site/src/generated/`) are properly ignored by `.gitignore` and absent from `git status`.
- Confirm `ROBOTS_READ_TOKEN` and the `repository_dispatch` contract are clearly documented in `.github/README.md` and `scripts/README.md`.

## Merge Criteria

- All **Required Checks** (`pnpm test:aggregation`, `pnpm sync:docs`, `pnpm lint`, `pnpm check`, `pnpm build`, workflow YAML validation) pass with zero errors.
- No generated or fixture files remain untracked in `git status`.
- Deployed and verified on `https://dev.air-robotics.ai` before promoting `dev` → `main`.
