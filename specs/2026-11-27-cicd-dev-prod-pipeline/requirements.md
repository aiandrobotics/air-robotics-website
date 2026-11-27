# Requirements

## Scope

Phase 3 delivers the GitHub Actions CI/CD pipelines for validating pull requests, running Terraform `plan`/`apply`, deploying changes automatically to `dev` (`dev.air-robotics.ai`), and promoting verified changes from `dev` → `main` to `prod` (`air-robotics.ai`).

In scope:
- Updated OIDC IAM roles in `infra/modules/static-site/iam.tf` supporting:
  - GitHub Environment OIDC `sub` claims (`repo:aiandrobotics/air-robotics-website:environment:dev` and `environment:prod`).
  - Terraform management permissions (S3, CloudFront, ACM, Route 53, IAM) in addition to S3 sync and CloudFront invalidation.
  - Read-only PR `terraform plan` role/permissions for `pull_request` runs.
- Three GitHub Actions workflows under `.github/workflows/`:
  - `ci.yml` — PR validation (site lint/check/build, Terraform fmt/validate/conditional plan, and `dev` → `main` promotion guard).
  - `deploy-dev.yml` — Automated `dev` Terraform apply (when `infra/` changes) + site build + S3 sync + CloudFront invalidation on push to `dev` (and `workflow_dispatch`).
  - `deploy-prod.yml` — Controlled `prod` Terraform apply (when `infra/` changes) + site build + S3 sync + CloudFront invalidation on push to `main` (and `workflow_dispatch`).
- Cache-control strategy during S3 sync: long-lived immutable caching for hashed `_astro/*` assets and short/revalidated caching for HTML/manifests.
- Setup documentation for GitHub Environments (`dev`, `prod`), environment variables, and `main` branch protection rules.

## Decisions

- **Terraform IAM in CI**: Extend `infra/modules/static-site/iam.tf` OIDC roles with Terraform permissions plus a PR plan role/trust condition so both infra and site changes flow through GitHub Actions.
- **GitHub Configuration**: Use **GitHub Environments** (`dev` and `prod`) with environment-scoped variables (`AWS_ROLE_ARN`, `TF_STATE_BUCKET`, `TF_STATE_BUCKET_ARN`, `OIDC_PROVIDER_ARN`, `S3_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID`) rather than prefixed repo secrets.
- **Workflow Structure**: 3 separate, focused workflow files (`ci.yml`, `deploy-dev.yml`, `deploy-prod.yml`).
- **Promotion Enforcement**: Nothing reaches `prod` without passing through `dev` first—enforced by both GitHub branch protection on `main` and a `promotion-guard` check in `ci.yml` verifying PRs into `main` originate from `dev`.

## Constraints

- Must align with `specs/mission.md` and `specs/tech-stack.md` (GitHub Actions, OIDC-only AWS auth with zero static keys, Terraform `>= 1.10`, `pnpm` + Node.js 22 LTS, `dev` → `main` promotion).
- Workflows must use pinned major versions of official actions (`actions/checkout`, `pnpm/action-setup`, `actions/setup-node`, `hashicorp/setup-terraform`, `aws-actions/configure-aws-credentials`) and explicit minimal `permissions:` blocks (`id-token: write`, `contents: read`).
- Concurrent deploys to the same environment must be serialized (`concurrency` group per environment without canceling in-progress applies).
- Branch: work proceeds on `cicd-dev-prod-pipeline`.

## Non-goals

- `repository_dispatch` cross-repo rebuild triggers from external robot repos (Phase 5).
- Full website pages, shared theme package, or robot docs aggregation (Phases 4–5).
- Live AWS provisioning during automated local validation (can be executed right after merge using the documented runbook).

## Context

- Source roadmap phase: **Phase 3: CI/CD & Dev-to-Prod Promotion Pipeline (GitHub Actions + Terraform)** in `specs/roadmap.md`.
- Depends on Phase 1 (`pnpm lint`, `pnpm check`, `pnpm build` → `site/dist/`) and Phase 2 (`infra/bootstrap`, `infra/environments/dev`, `infra/environments/prod`).
