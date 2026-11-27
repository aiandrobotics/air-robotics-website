# Requirements

## Scope

Phase 4 replaces the Phase 1 minimal placeholder with the full **Air Robotics** v1 main website and a reusable `@air-robotics/docs-theme` package that powers both the main site and future standalone robot documentation repositories (Phases 6–7).

In scope:
- Reusable `@air-robotics/docs-theme` package in `packages/theme/` exporting:
  - Shared CSS design tokens and base/component styles (`tokens.css`)
  - Shared Starlight theme CSS (`starlight.css`)
  - Typed `createAirStarlightConfig()` preset helper for consistent Starlight configuration across repos
  - Shared Astro UI shell components (`AirLayout.astro`, `AirHeader.astro`, `AirFooter.astro`)
- Full v1 main website routes in `site/src/pages/`:
  - `/` — Clean Air Robotics landing page (hero, featured robot spotlight, capabilities/features grid) inspired by `buildair-ai-v0`
  - `/robots/` — Robot catalog page showcasing Air Robotics projects (starting with Fabrica) and linking to documentation
  - `/about/` — Company & About page covering Air Robotics' mission and open-source robotics approach
  - `/contact/` — Static Contact page with direct email (`contact@air-robotics.ai`) and GitHub community links
  - `/docs/` — Unified Starlight documentation hub styled with `@air-robotics/docs-theme`
- Responsive navigation with mobile menu and accessible light/dark mode toggle.

## Decisions

- **Shared Theme Package Exports**: `@air-robotics/docs-theme` exports CSS tokens, Starlight theme CSS, `createAirStarlightConfig()` helper, and shared `AirLayout` / `AirHeader` / `AirFooter` Astro components so both the main site and standalone robot repos share one source of truth.
- **v1 Routes**: `/`, `/robots/`, `/about/`, `/contact/`, and `/docs/`.
- **Contact Mechanism**: Pure static contact cards with `mailto:contact@air-robotics.ai` and GitHub links—no backend or third-party form processor.
- **Visual Direction**: Clean, uncluttered Apple-inspired aesthetic matching `buildair-ai-v0` (light `#ffffff` / dark `#000000` canvas, `#0071e3` blue accent, blue→cyan→purple gradient highlights, frosted-glass sticky header).

## Constraints

- Must align with `specs/mission.md` and `specs/tech-stack.md` (Astro + Starlight, strict TypeScript, Biome formatting/linting, 100% static output to `site/dist/`).
- Must follow modern CSS & accessibility best practices (`@layer` cascade, `light-dark()` with `prefers-color-scheme` fallback, `<meta name="color-scheme">` FOUC prevention, semantic landmarks, keyboard focus styles, `prefers-reduced-motion`).
- Keep robot catalog data structured cleanly so Phase 5's `robots.yaml` manifest ingestion can plug in without redesigning the UI.
- Branch: work proceeds on `shared-theme-main-website` (branched from `dev`) and merges into `dev` first (`dev.air-robotics.ai`) before promotion to `main` (`air-robotics.ai`).

## Non-goals

- Multi-repo docs ingestion script, `robots.yaml` manifest fetching, or `repository_dispatch` triggers (Phase 5).
- Reusable standalone robot-docs template repo or `air-robot-docs` agent skill plugin (Phase 6).
- Fabrica full standalone documentation (Phase 7).
- Blog, shop/e-commerce, or server-side contact form backend.

## Context

- Source roadmap phase: **Phase 4: Shared Theme & Full Main Website** in `specs/roadmap.md`.
- Depends on Phases 1–3 (Astro 7 + Starlight 0.43 workspace, Terraform AWS hosting, and `dev` → `main` GitHub Actions pipelines already live).
