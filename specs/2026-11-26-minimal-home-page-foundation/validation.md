# Validation

## Required Checks

All commands below must run from the repository root and exit with code `0`:

1. **Dependency installation & workspace resolution**:
   ```bash
   pnpm install --frozen-lockfile || pnpm install
   ```
2. **Lint & format check (Biome)**:
   ```bash
   pnpm lint
   ```
   (Runs `biome check .` with zero errors or formatting drift.)
3. **TypeScript & Astro diagnostics**:
   ```bash
   pnpm check
   ```
   (Runs `astro check` and `tsc --noEmit` in strict mode with zero errors.)
4. **Static production build**:
   ```bash
   pnpm build
   ```
   Confirm `site/dist/` is generated with zero errors and contains:
   - `site/dist/index.html` (minimal Air Robotics home page)
   - `site/dist/docs/index.html` (sample Starlight docs route)

## Manual Review

- Verify repository layout matches `specs/2026-11-26-minimal-home-page-foundation/requirements.md` (`site/`, `packages/theme/`, `infra/`, `scripts/`).
- Confirm no AWS credentials, Terraform state, or out-of-scope Phase 2–7 implementation files were introduced.
- Optional sanity check: run `pnpm dev` and inspect `/` and `/docs/` locally to verify clean rendering and working navigation between the home page and sample docs route.

## Merge Criteria

- All **Required Checks** (`pnpm lint`, `pnpm check`, `pnpm build`) pass cleanly with zero errors.
- `site/dist/index.html` and `site/dist/docs/index.html` are produced by `pnpm build`.
- Working tree has no untracked build artifacts (`dist/`, `node_modules/`, `.astro/` are properly ignored by `.gitignore`).
- Changes remain strictly within Phase 1 scope as defined in `requirements.md`.
