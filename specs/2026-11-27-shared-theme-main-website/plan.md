# Plan

## Task Group 1: Shared Air Robotics Theme Package (`packages/theme/`)
1. Design and implement `@air-robotics/docs-theme` exports in `packages/theme/`:
   - `tokens.css` — Layered design tokens (`@layer reset, base, theme, components, utilities;`), light/dark color system (`light-dark()` + `prefers-color-scheme` fallback + `<meta name="color-scheme">` `:has()` mapping), typography, spacing, and surface tokens inspired by `buildair-ai-v0`.
   - `starlight.css` — Shared Starlight theme overrides aligning documentation typography, colors, header/sidebar polish, and light/dark palettes with Air Robotics branding.
   - `createAirStarlightConfig()` — Typed Starlight configuration preset helper so both the main website and standalone robot repos (Phases 6–7) get identical look, feel, social links, and custom CSS with minimal boilerplate.
   - Shared Astro components: `AirLayout.astro`, `AirHeader.astro` (frosted glass sticky nav, responsive mobile menu, accessible two-state dark mode toggle, active route indicator), and `AirFooter.astro`.
2. Export all CSS, TypeScript helpers, and Astro components cleanly via `packages/theme/package.json` `exports` map and verify strict TypeScript checking (`pnpm --filter @air-robotics/docs-theme check`).

## Task Group 2: Wire Shared Theme into `site/` & Starlight
1. Update `site/astro.config.mjs` to consume `createAirStarlightConfig()` and the shared Starlight CSS from `@air-robotics/docs-theme` (removing duplicate local `starlight-custom.css`).
2. Verify `/docs/` renders with the shared Air Robotics Starlight theme.

## Task Group 3: Full v1 Main Website Pages (`site/src/pages/`)
1. Upgrade the **Home page** (`site/src/pages/index.astro`) using `AirLayout` with:
   - Clean hero section ("Dream Big / Build Robots / Create Moonshots") and clear CTAs to `/robots/` and `/docs/`
   - Featured Robot showcase (Fabrica) linking to `/robots/` and `/docs/`
   - "Everything You Need to Build" capabilities/features grid (complete docs, 3D printable parts, open-source code & schematics, standalone & unified docs) inspired by `buildair-ai-v0`
2. Build the **Robots Catalog page** (`site/src/pages/robots/index.astro`) with a structured, data-driven robot card grid (initial entry: Fabrica — Coming Soon, ready for Phase 5's `robots.yaml` manifest ingestion) linking to robot documentation.
3. Build the **Company / About page** (`site/src/pages/about/index.astro`) presenting Air Robotics' mission, open-source robotics philosophy, and architecture principles.
4. Build the **Contact page** (`site/src/pages/contact/index.astro`) with pure static contact cards featuring direct email (`mailto:contact@air-robotics.ai`), GitHub organization/repositories (`https://github.com/aiandrobotics`), and collaboration links.

## Task Group 4: Verification & Promotion Readiness
1. Update `.github/workflows/ci.yml` route smoke checks to verify all new routes (`index.html`, `robots/index.html`, `about/index.html`, `contact/index.html`, `docs/index.html`) are built in `site/dist/`.
2. Run `pnpm lint`, `pnpm check`, and `pnpm build` and confirm zero errors or warnings.
3. Verify visual quality across desktop/mobile viewports and light/dark themes locally before merging into `dev` (`dev.air-robotics.ai`) and promoting `dev` → `main` (`air-robotics.ai`).
