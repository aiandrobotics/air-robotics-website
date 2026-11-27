# Requirements

## Scope

Phase 6 delivers two tightly aligned artifacts so every robot team (and coding agent) can bootstrap consistent, standalone Air Robotics documentation repositories before building **Fabrica** in Phase 7:

1. **Reusable Standalone Robot Docs Template (`templates/robot-docs/`)** inside `air-robotics-website`:
   - Runnable and buildable completely standalone with Astro 7 + Starlight 0.43 + `@air-robotics/docs-theme`.
   - Includes `docs/` app scaffold (`package.json`, `astro.config.mjs`, `tsconfig.json`, `src/content.config.ts`, starter `index.mdx` & `getting-started.mdx`, `public/`).
   - Includes a ready-to-use `.github/workflows/docs.yml` that validates standalone builds on PRs and emits `repository_dispatch` (`event_type: "robot-docs-updated"`) to `aiandrobotics/air-robotics-website` on merge to `main`.
2. **`air-robot-docs` Agent Skill Plugin** inside `https://github.com/sathyavikram/agent-plugins.git`:
   - Packaged following the exact plugin conventions of `sathyavikram/agent-plugins`.
   - Contains complete `SKILL.md` instructions (and reference templates) covering tech stack, `@air-robotics/docs-theme` installation, directory & asset conventions, Starlight v0.43 sidebar syntax, responsive mobile/tablet/desktop authoring rules (tables, images, diagrams, embeds, zero horizontal overflow), standalone preview/build commands, CI `repository_dispatch` setup, and registering a new robot in `air-robotics-website/robots.yaml`.

## Decisions

- **Theme Distribution**: Standalone robot repos install `@air-robotics/docs-theme` directly via `pnpm` git-subpath dependency:
  `"github:aiandrobotics/air-robotics-website#main&path:packages/theme"` (zero npm registry or GitHub Packages auth setup required).
- **Template Location**: Maintained at `templates/robot-docs/` in `air-robotics-website` AND referenced/bundled in the `air-robot-docs` skill in `https://github.com/sathyavikram/agent-plugins.git`.
- **Agent Plugin Delivery**: Inspect `https://github.com/sathyavikram/agent-plugins.git`, match its existing plugin conventions, add `air-robot-docs`, verify structure, and push.

## Constraints

- Must align with `specs/mission.md` and `specs/tech-stack.md` (Astro + Starlight, shared `@air-robotics/docs-theme`, standalone-runnable robot docs, `repository_dispatch` to `dev` first).
- Template `docs/src/content/docs/` structure must match `robots.yaml`'s default `docsPath: docs/src/content/docs` and `assetsPath: docs/public` so zero custom overrides are needed.
- `templates/robot-docs/` must not interfere with `air-robotics-website`'s root `pnpm` workspace build or Biome lint checks.
- Branch in `air-robotics-website`: `robot-docs-template-agent-skill` (branched from `dev`).

## Non-goals

- Bootstrapping or authoring Fabrica's actual standalone robot documentation repository (Phase 7).
- Publishing `@air-robotics/docs-theme` to public npm or GitHub Packages (using direct git-subpath install instead).

## Context

- Source roadmap phase: **Phase 6: Robot Docs Template & `air-robot-docs` Agent Skill Plugin** in `specs/roadmap.md`.
- Depends on Phase 4 (`@air-robotics/docs-theme`) and Phase 5 (`robots.yaml`, `scripts/sync-robot-docs.mjs`, and `deploy-dev.yml` `repository_dispatch` listener).
- Directly enables Phase 7 (**Fabrica Standalone Robot Docs & End-to-End Integration**).
