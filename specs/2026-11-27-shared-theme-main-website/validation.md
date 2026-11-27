# Validation

## Required Checks

All commands below must run from the repository root and exit with code `0`:

1. **Lint & format check (Biome)**:
   ```bash
   pnpm lint
   ```
2. **TypeScript & Astro strict checks across `site` and `packages/theme`**:
   ```bash
   pnpm check
   ```
3. **Static production build**:
   ```bash
   pnpm build
   ```
   Confirm `site/dist/` contains all expected routes:
   - `site/dist/index.html` (`/`)
   - `site/dist/robots/index.html` (`/robots/`)
   - `site/dist/about/index.html` (`/about/`)
   - `site/dist/contact/index.html` (`/contact/`)
   - `site/dist/docs/index.html` (`/docs/`)
4. **Shared theme consumption**:
   Confirm `site/astro.config.mjs` imports `createAirStarlightConfig` from `@air-robotics/docs-theme` and pages use `AirLayout` from `@air-robotics/docs-theme`.

## Manual Review

- Inspect `/`, `/robots/`, `/about/`, `/contact/`, and `/docs/` on desktop and mobile viewports in both light and dark modes.
- Verify the Contact page links to `mailto:contact@air-robotics.ai` and `https://github.com/aiandrobotics`.
- Verify keyboard navigation, mobile menu open/close (including `Escape`), and dark mode toggle persistence.
- After merging to `dev`, confirm `Deploy Dev` passes and verify all routes live on `https://dev.air-robotics.ai` before promoting `dev` → `main`.

## Merge Criteria

- `pnpm lint`, `pnpm check`, and `pnpm build` pass cleanly with zero errors.
- All 5 routes are generated in `site/dist/`.
- `@air-robotics/docs-theme` is the single source of truth for design tokens, Starlight theme styling, and site chrome.
- Changes stay strictly within Phase 4 scope (`packages/theme/`, `site/`, `.github/workflows/ci.yml` route check, and specs).
