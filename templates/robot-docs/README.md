# Standalone Robot Docs Template

Reusable Astro 7 + Starlight 0.43 documentation template for Air Robotics robot repositories, styled with `@air-robotics/docs-theme`.

## Local Preview & Build

```bash
pnpm --dir docs install
pnpm --dir docs dev
pnpm --dir docs check && pnpm --dir docs build
```

## Connecting to `air-robotics-website`

1. Add a repository secret `AIR_WEBSITE_DISPATCH_TOKEN` (fine-grained PAT with `Contents: Read and write` on `aiandrobotics/air-robotics-website`) so `.github/workflows/docs.yml` triggers automatic `dev.air-robotics.ai` rebuilds on merge to `main`.
2. Register the robot in `air-robotics-website/robots.yaml` with `syncEnabled: true`, `docsPath: docs/src/content/docs`, and `assetsPath: docs/public`.
