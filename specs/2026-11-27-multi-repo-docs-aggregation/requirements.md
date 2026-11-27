# Requirements

## Scope

Phase 5 implements the manifest-driven multi-repo documentation aggregation pipeline so that adding a robot to `robots.yaml` automatically populates the robot catalog, pulls its docs & assets at build time, mounts them at `/docs/<slug>/`, and triggers automatic `dev.air-robotics.ai` rebuilds via `repository_dispatch` when a robot repo updates its docs.

In scope:
- Root `robots.yaml` registry manifest as the single source of truth for robot catalog metadata and docs sync configuration.
- Manifest schema validation rejecting missing fields, invalid/duplicate slugs, or invalid sync sources.
- `scripts/sync-robot-docs.mjs` build-time ingestion script:
  - Shallow `git clone --depth 1` for remote GitHub repos (supporting private repos via `ROBOTS_READ_TOKEN` / `GITHUB_TOKEN`) plus `localPath` support for offline local dev and testing.
  - Copies robot docs into `site/src/content/docs/docs/<slug>/` (serving at `/docs/<slug>/`) and static assets into `site/public/robots/<slug>/`.
  - Generates Starlight sidebar entries automatically per synced robot (`site/src/generated/robot-sidebar.json`).
  - Supports `syncEnabled: false` for planned/coming-soon robots (such as `fabrica` until Phase 7) so they appear in the catalog without breaking builds.
- `site/src/data/robots.ts` and `site/astro.config.mjs` driven directly by `robots.yaml` and generated sidebar config.
- GitHub Actions updates:
  - `deploy-dev.yml` listens for `repository_dispatch` (`types: [robot-docs-updated]`) and runs `pnpm sync:docs` before building.
  - `deploy-prod.yml` and `ci.yml` run `pnpm sync:docs` before building, and `ci.yml` runs the automated aggregation test.
- Automated test (`pnpm test:aggregation`) proving that adding a robot entry to a manifest syncs its docs & assets and builds `/docs/<slug>/index.html` with zero changes to `site/` code.

## Decisions

- **Manifest & URL Path**: `robots.yaml` at repo root; synced robot docs mount at `/docs/<slug>/` with an auto-generated Starlight sidebar section per robot.
- **Fetch Mechanism**: Shallow `git clone --depth 1` using `ROBOTS_READ_TOKEN` (with `localPath` override for offline dev/tests).
- **Planned vs Active Robots**: `syncEnabled` boolean flag per robot in `robots.yaml` (`fabrica` starts with `syncEnabled: false` until Phase 7; flipped to `true` once Fabrica's standalone docs repo is built).
- **Cross-Repo Trigger**: GitHub `repository_dispatch` event with `event_type: "robot-docs-updated"` wired into `deploy-dev.yml` (so robot doc edits always land on `dev.air-robotics.ai` first).

## Constraints

- Must align with `specs/mission.md` and `specs/tech-stack.md` (adding a new robot requires only updating `robots.yaml`, zero site code edits; changes flow to `dev` first, never directly to `prod`).
- Synced robot docs and generated files must be gitignored so `air-robotics-website` never commits duplicated docs from robot repos.
- Must keep `pnpm lint`, `pnpm check`, and `pnpm build` green with zero errors.
- Branch: work proceeds on `multi-repo-docs-aggregation` (branched from `dev`).

## Non-goals

- Publishing `@air-robotics/docs-theme` to GitHub Packages or creating the standalone robot-docs template & `air-robot-docs` agent skill (Phase 6).
- Building Fabrica's actual standalone robot documentation repo (Phase 7).
- Runtime/server-side fetching—all aggregation happens strictly at static build time.

## Context

- Source roadmap phase: **Phase 5: Multi-Repo Docs Aggregation & Robot Registry** in `specs/roadmap.md`.
- Depends on Phase 3 (GitHub Actions pipelines) and Phase 4 (`site/` catalog + `@air-robotics/docs-theme` + Starlight config).
