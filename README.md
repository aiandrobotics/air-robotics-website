# Air Robotics Website

Main website and unified documentation hub for **Air Robotics** ([air-robotics.ai](https://air-robotics.ai)), built with Astro + Starlight.

## Workspace Layout

- `site/` — Main Astro + Starlight website (`@air-robotics/site`)
- `packages/theme/` — Shared Air Robotics theme package (`@air-robotics/docs-theme`)
- `infra/` — AWS Terraform infrastructure ([infra/README.md](infra/README.md))
- `.github/` — GitHub Actions CI/CD workflows ([.github/README.md](.github/README.md))
- `scripts/` — Build-time multi-repo docs aggregation scripts (Phase 5)
- `specs/` — Project constitution (`mission.md`, `tech-stack.md`, `roadmap.md`) and dated feature specs

## Prerequisites

- Node.js 22 LTS (see `.nvmrc`)
- `pnpm` 10+

## Commands

Run from the repository root:

```bash
# Install workspace dependencies
pnpm install

# Start local Astro dev server
pnpm dev

# Run Biome lint & format check
pnpm lint

# Auto-format with Biome
pnpm format

# Run Astro & TypeScript strict checks
pnpm check

# Build static production output to site/dist/
pnpm build
```
