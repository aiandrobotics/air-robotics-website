# Scripts

Build-time robot documentation aggregation and validation scripts.

## Files

- `lib/robots-manifest.mjs` — Parses and validates root `robots.yaml` (enforces unique kebab-case slugs, required fields, and valid sources).
- `sync-robot-docs.mjs` — Reads `robots.yaml` (or `--manifest <path>`), clones/copies each robot with `syncEnabled: true` into:
  - `site/src/content/docs/docs/<slug>/` (served at `/docs/<slug>/`)
  - `site/public/robots/<slug>/` (static assets)
  - `site/src/generated/robots.json` & `site/src/generated/robot-sidebar.json`
- `test-aggregation.mjs` — Automated end-to-end test proving manifest validation and zero-code-edit robot docs aggregation into `site/dist/`.

## Commands

```bash
# Sync robot docs defined in robots.yaml
pnpm sync:docs

# Run automated multi-repo aggregation test
pnpm test:aggregation
```
