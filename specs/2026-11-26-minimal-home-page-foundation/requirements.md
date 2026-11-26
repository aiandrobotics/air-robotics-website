# Requirements

## Scope

Phase 1 establishes the repository foundation and a minimal clean Astro + Starlight website for **Air Robotics** so that Phases 2 and 3 (Terraform AWS infrastructure and GitHub Actions CI/CD) can deploy and verify a real static artifact (`dist/`) end to end across `dev.air-robotics.ai` and `air-robotics.ai`.

In scope:
- Top-level `pnpm` workspace setup and directory scaffolding: `site/`, `packages/theme/` (stub), `infra/` (placeholder), `scripts/` (placeholder).
- Astro + Starlight static site baseline in `site/` using strict TypeScript.
- Biome configured at the repository root for linting and formatting.
- Minimal clean Air Robotics home page (`/`) with hero/tagline and a placeholder "Coming soon" robots section.
- One sample Starlight documentation route (`/docs/`) verifying both Astro custom pages and Starlight docs build together into `site/dist/`.
- Root `package.json` scripts for running dev, build, lint, format, and typecheck consistently across the workspace.

## Decisions

- **Package Manager**: `pnpm` workspaces (`pnpm-workspace.yaml`).
- **Linting & Formatting**: Biome (`biome.json`) as the single linter and formatter.
- **TypeScript**: Strict mode enabled across workspace packages.
- **Directory Scaffolding**: Full top-level layout (`site/`, `packages/theme/`, `infra/`, `scripts/`) is scaffolded in Phase 1 so Phases 2–5 slot in without restructuring.
- **Minimal Home Page + Starlight Route**: Include both the minimal Air Robotics home page and one sample Starlight `/docs/` route in Phase 1 to prove the combined Astro + Starlight static build early.
- **Static Output**: Astro builds pure static files to `site/dist/` suitable for Amazon S3 + CloudFront hosting.

## Constraints

- Must align with `specs/mission.md` and `specs/tech-stack.md`: Astro + Starlight, TypeScript, Node.js LTS, static output only (no server-side runtime or database).
- Keep visual design clean, uncluttered, and lightweight—no heavy UI frameworks or unnecessary dependencies.
- Keep `packages/theme/` as a minimal valid workspace stub in Phase 1; full theme design tokens, components, and Starlight preset belong to Phase 4.
- Branch: work proceeds on `minimal-home-page-foundation` and targets merge only after all validation criteria pass.

## Non-goals

- AWS infrastructure or Terraform modules (Phase 2).
- GitHub Actions CI/CD workflows or deployment scripts (Phase 3).
- Full Air Robotics design system, shared theme implementation, Company/About/Contact pages, or robot catalog UI (Phase 4).
- Robot registry manifest (`robots.yaml`), multi-repo docs ingestion scripts, or `repository_dispatch` wiring (Phase 5).
- Reusable robot-docs template, `air-robot-docs` skill plugin, or Fabrica docs (Phases 6–7).

## Context

- Source roadmap phase: **Phase 1: Minimal Home Page & Repo Foundation** in `specs/roadmap.md`.
- Main repository: `github.com/aiandrobotics/air-robotics-website`.
- Target domains (provisioned in Phase 2): `dev.air-robotics.ai` (`dev`) and `air-robotics.ai` (`prod`).
