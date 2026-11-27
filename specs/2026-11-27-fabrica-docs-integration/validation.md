# Validation

## Required Checks

All checks below must exit with code `0`:

1. **Fabrica standalone docs build** (in `/home/vikram/Documents/workspace/fabrica/fabrica`):
   ```bash
   pnpm --dir docs install
   pnpm --dir docs check
   pnpm --dir docs build
   ```
   Confirm `docs/dist/index.html` and all Fabrica guide pages are generated cleanly.
2. **Aggregation into `air-robotics-website`** (in `air-robotics-website`):
   ```bash
   pnpm sync:docs
   pnpm lint
   pnpm check
   pnpm build
   pnpm test:aggregation
   ```
   Confirm `site/dist/docs/fabrica/index.html` and Fabrica subpages exist in `site/dist/`, and `site/dist/robots/index.html` links Fabrica to `/docs/fabrica/`.

## Manual Review

- Verify all internal links inside Fabrica docs are relative (working both standalone at `/<page>/` and aggregated at `/docs/fabrica/<page>/`).
- Verify Fabrica's `.gitignore` ignores `docs/node_modules/`, `docs/dist/`, and `docs/.astro/`.
- Verify responsive formatting (no fixed-pixel-width elements, clean tables/images on mobile and desktop).

## Merge Criteria

- Fabrica standalone build (`pnpm --dir docs check && pnpm --dir docs build`) passes with zero errors.
- `air-robotics-website` aggregation and full build (`pnpm sync:docs && pnpm lint && pnpm check && pnpm build && pnpm test:aggregation`) pass with zero errors and produce `/docs/fabrica/`.
- Changes stay strictly within Phase 7 scope.
