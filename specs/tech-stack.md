# Tech Stack

## Web & Documentation Framework

- **Framework**: [Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/)
  - Astro powers the clean landing page, Company/About/Contact pages, and robot catalog with zero-JS-by-default static output.
  - Starlight powers unified documentation pages, navigation, and shared docs UX.
- **Language & Runtime**: TypeScript, Node.js (LTS), `pnpm` (or `npm` workspaces) for package management.
- **Shared Look & Feel**: Versioned shared theme package (e.g., `@air-robotics/docs-theme`, published to GitHub Packages / npm or consumed via pinned git ref) providing shared CSS tokens, typography, layout/header/footer components, and Starlight preset configuration for both the main website and every standalone robot repo.

## Multi-Repo Docs Architecture

- **Main Repo**: `github.com/aiandrobotics/air-robotics-website`
  - Holds the landing page, robot catalog, robot registry manifest (e.g., `robots.yaml`), docs ingestion/sync script, Terraform infrastructure, and CI/CD workflows.
- **Robot Repos**: Separate repositories under `github.com/aiandrobotics/<robot-name>`
  - Each robot repo contains its own standalone Astro + Starlight docs setup using the shared Air Robotics theme, so contributors can run and preview that robot's docs locally in isolation.
- **Aggregation Mechanism**:
  - At build time, the main website reads the robot manifest, fetches each robot's docs from its configured repo/ref, and builds the combined static site (`dist/`).
  - Robot repos emit a GitHub `repository_dispatch` event on doc updates to trigger an automated rebuild and deploy of the main site to `dev`.

## Cloud & Infrastructure (AWS + Terraform)

- **Hosting & CDN**:
  - **Amazon S3**: Private origin buckets (separate buckets for `dev` and `prod`) storing static build outputs.
  - **Amazon CloudFront**: CDN with Origin Access Control (OAC), HTTPS enforcement, clean URL/index routing, and cache invalidation on deploy.
  - **AWS Certificate Manager (ACM)**: TLS certificates in `us-east-1` for `air-robotics.ai` and `dev.air-robotics.ai`.
  - **Amazon Route 53**: DNS hosted zone and alias records for `air-robotics.ai` (`prod`) and `dev.air-robotics.ai` (`dev`).
- **Infrastructure as Code**:
  - **Terraform**: Modular definitions shared across `dev` and `prod` environments.
  - **Remote State**: Amazon S3 backend with state locking (S3 native lockfile or DynamoDB) and strict separation of `dev` and `prod` state.

## CI/CD & Promotion Workflow

- **Platform**: GitHub Actions (used for both site build/deploy and Terraform infrastructure plan/apply).
- **AWS Authentication**: GitHub OIDC federation (`aws-actions/configure-aws-credentials`) assuming least-privilege IAM roles per environment—no static AWS access keys.
- **Environments & Branching**:
  - Pull Requests → run site lint/typecheck/build and `terraform fmt`/`validate`/`plan`.
  - `dev` branch → runs Terraform apply for `dev` (when infra changes) and builds/deploys the site automatically to `dev.air-robotics.ai`.
  - `main` branch → runs Terraform apply for `prod` (when infra changes) and builds/deploys the site to `air-robotics.ai` (`prod`) only via Pull Request promoted from `dev` to `main`.
  - Branch protection on `main` enforces that changes come through `dev` and pass CI checks before merge.
- **Search Engine Hygiene**: `dev.air-robotics.ai` serves `X-Robots-Tag: noindex, nofollow` / disallow `robots.txt` so staging content is not indexed.

## Agent Skill & Plugin Distribution

- **Skill Name**: `air-robot-docs`
- **Repository**: `https://github.com/sathyavikram/agent-plugins.git` (packaged following the repository's existing plugin structure).
- **Contents**: End-to-end instructions for bootstrapping and authoring standalone robot documentation repositories—covering Astro + Starlight setup, installing and configuring the shared Air Robotics theme package, folder/frontmatter/asset conventions, local standalone preview & build commands, CI validation, `repository_dispatch` trigger configuration, and registering the robot in `air-robotics-website`'s manifest.
