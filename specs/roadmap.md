# Roadmap

Each phase below is designed to be specified and implemented incrementally using `/feature-spec`. Phases 1–3 establish a minimal home page, AWS infrastructure, and CI/CD pipelines to verify end-to-end `dev` → `prod` delivery first; Phases 4–7 then build out the shared theme, full website, multi-repo docs aggregation, pilot robot, and agent skill.

---

## Phase 1: Minimal Home Page & Repo Foundation
- **Status**: `[x]` Complete
- **Goal**: Set up the repository layout and a minimal clean Astro + Starlight home page that builds cleanly to `dist/` so infrastructure and CI/CD can be verified end to end.
- **Key Deliverables**:
  - Repository directory layout (`site/`, `packages/theme/`, `infra/`, `scripts/`).
  - Astro + Starlight baseline with TypeScript, formatting, and linting.
  - Minimal clean Air Robotics home page (placeholder hero/branding) sufficient to verify builds and deployments.
  - Verified local dev server and static production build (`dist/`).

## Phase 2: AWS Infrastructure with Terraform
- **Status**: `[x]` Complete
- **Goal**: Provision reproducible AWS hosting and deployment roles for both `dev` (`dev.air-robotics.ai`) and `prod` (`air-robotics.ai`).
- **Key Deliverables**:
  - Remote Terraform state bootstrap configuration (S3 backend with locking).
  - Reusable Terraform module for static site hosting: private S3 bucket, CloudFront distribution with OAC and clean URL routing, ACM TLS certificate, and Route 53 DNS records.
  - Separate `dev` and `prod` environment configurations (`dev.air-robotics.ai` with `noindex` headers; `air-robotics.ai` for production).
  - GitHub Actions OIDC provider and least-privilege IAM roles scoped to `dev` and `prod` deployments.

## Phase 3: CI/CD & Dev-to-Prod Promotion Pipeline (GitHub Actions + Terraform)
- **Status**: `[x]` Complete
- **Goal**: Automate validation, Terraform plan/apply, `dev` deployment, and `dev` → `main` promotion to `prod` using GitHub Actions, and verify the minimal home page end to end on both environments.
- **Key Deliverables**:
  - PR validation workflow in GitHub Actions (lint, typecheck, site build, and `terraform fmt` / `validate` / `plan` against the target environment).
  - `dev` GitHub Actions workflow: on push to `dev`, run Terraform apply for `dev` infrastructure (when infra changes), build the site, sync to the `dev` S3 bucket, and invalidate the `dev` CloudFront cache.
  - `prod` GitHub Actions workflow: on merge of a PR from `dev` to `main`, run Terraform apply for `prod` infrastructure (when infra changes), build and deploy to the `prod` S3 bucket, and invalidate the `prod` CloudFront cache.
  - Branch protection rules enforcing the `dev` → `main` promotion path.
  - End-to-end verification of the minimal home page live at `dev.air-robotics.ai` and promoted to `air-robotics.ai`.

## Phase 4: Shared Theme & Full Main Website
- **Status**: `[ ]` Not started
- **Goal**: Build the shared Air Robotics theme package and the full v1 main website pages with a clean, consistent look and feel.
- **Key Deliverables**:
  - Shared Air Robotics theme package (design tokens, clean typography, light/dark styling, header/footer, Starlight preset) consumable by both the main website and standalone robot repos.
  - Full Air Robotics landing page, Company/About/Contact pages, and robot catalog UI linking to each robot's documentation section.
  - Responsive, clean visual polish verified on `dev.air-robotics.ai` and promoted to `air-robotics.ai`.

## Phase 5: Multi-Repo Docs Aggregation & Robot Registry
- **Status**: `[ ]` Not started
- **Goal**: Enable the main website to pull robot documentation from external robot repositories automatically at build time and rebuild on updates.
- **Key Deliverables**:
  - Robot registry manifest (e.g., `robots.yaml`) defining robot metadata (name, summary, slug, repo, branch/ref, docs path).
  - Build-time docs ingestion script that fetches each robot's docs from its repository, validates structure/assets, and mounts them under `/robots/<slug>/` (or `/docs/<slug>/`).
  - `repository_dispatch` trigger wired into the `dev` deploy workflow so robot doc updates automatically rebuild and deploy `dev.air-robotics.ai`.
  - Automated check verifying that adding a robot entry to the manifest integrates its docs without modifying site code.

## Phase 6: Robot Docs Template & `air-robot-docs` Agent Skill Plugin
- **Status**: `[ ]` Not started
- **Goal**: Deliver the reusable standalone robot-docs template and package all bootstrapping, styling, and CI integration instructions into the `air-robot-docs` agent skill plugin in `https://github.com/sathyavikram/agent-plugins.git`, ready to use for building robot repos.
- **Key Deliverables**:
  - Reusable robot-docs template using Astro + Starlight and the shared Air Robotics theme, runnable standalone with a single command.
  - Template GitHub Actions workflow that validates standalone docs on PRs and sends `repository_dispatch` to `air-robotics-website` on merge.
  - `air-robot-docs` skill (`SKILL.md` and supporting references/templates) structured as a plugin inside `https://github.com/sathyavikram/agent-plugins.git` matching the repo's existing plugin conventions.
  - Complete skill instructions covering tech stack (Astro + Starlight + shared Air Robotics theme), directory layout, frontmatter/asset conventions, local standalone preview/build commands, CI validation + `repository_dispatch`, and manifest registration in `air-robotics-website`.

## Phase 7: Fabrica Standalone Robot Docs & End-to-End Integration
- **Status**: `[ ]` Not started
- **Goal**: Switch to the **Fabrica** robot repository, use the shared theme package and `air-robot-docs` agent skill to bootstrap and build Fabrica's standalone docs, and connect Fabrica to `air-robotics-website` to prove the full workflow end to end.
- **Key Deliverables**:
  - Switch to the **Fabrica** robot repository and use the `air-robot-docs` skill + shared Air Robotics theme to bootstrap and build Fabrica's standalone documentation.
  - Verify Fabrica's docs run and build cleanly standalone, and that its CI triggers `repository_dispatch` on merge.
  - Onboard **Fabrica** in `air-robotics-website`'s robot registry manifest.
  - End-to-end verification: editing docs in the Fabrica repo automatically rebuilds and updates `dev.air-robotics.ai`, and promoting `dev` → `main` publishes the update to `air-robotics.ai`.
