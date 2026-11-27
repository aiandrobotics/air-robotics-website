# Plan

## Task Group 1: Extend Terraform OIDC IAM Roles for GitHub Actions + Terraform
1. Update `infra/modules/static-site/iam.tf` so each environment's GitHub OIDC deploy role trusts the GitHub Environment subject (`repo:aiandrobotics/air-robotics-website:environment:<env>`) as well as the branch ref (`ref:refs/heads/<branch>`).
2. Add the AWS permissions required for `terraform plan` / `terraform apply` (S3, CloudFront, ACM, Route 53, IAM role/policy management scoped to Air Robotics resources) alongside S3 sync and CloudFront invalidation.
3. Add a read-only `github_plan` OIDC IAM role (or PR trust condition) supporting `pull_request` `terraform plan` runs without granting write access.
4. Re-run `terraform fmt` and `terraform validate` across all Terraform stacks.

## Task Group 2: GitHub Actions PR Validation Workflow (`.github/workflows/ci.yml`)
1. Create `.github/workflows/ci.yml` triggered on `pull_request` targeting `dev` and `main`.
2. Add a `site` job running `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm check`, `pnpm build`, and verifying `site/dist/index.html` and `site/dist/docs/index.html` exist.
3. Add a `terraform` job running `terraform fmt -check -recursive infra/` and `terraform init -backend=false` + `terraform validate` across `infra/bootstrap`, `infra/modules/static-site`, `infra/environments/dev`, and `infra/environments/prod`.
4. Add a `promotion-guard` job on PRs targeting `main` that verifies the PR head branch is `dev` (enforcing the `dev` → `main` promotion rule).
5. Add a conditional `terraform-plan` job that runs `terraform plan` against `dev` (for PRs to `dev`) or `prod` (for PRs to `main`) when `infra/` files change and AWS OIDC variables are configured.

## Task Group 3: `dev` and `prod` Deployment Workflows
1. Create `.github/workflows/deploy-dev.yml` triggered on `push` to `dev` and `workflow_dispatch`, scoped to GitHub Environment `dev` with `concurrency` protection and `id-token: write`.
   - Authenticates to AWS via OIDC (`aws-actions/configure-aws-credentials`).
   - Runs `terraform init` and `terraform apply -auto-approve` on `infra/environments/dev` when `infra/` changed (or requested via `workflow_dispatch`).
   - Builds `site/dist/` with `pnpm build`, syncs to the `dev` S3 bucket (`--delete`, immutable cache headers for `_astro/*`, `no-cache` for HTML), and invalidates the `dev` CloudFront distribution.
2. Create `.github/workflows/deploy-prod.yml` triggered on `push` to `main` and `workflow_dispatch`, scoped to GitHub Environment `prod` with `concurrency` protection and `id-token: write`.
   - Mirrors the `dev` pipeline targeting `infra/environments/prod`, the `prod` S3 bucket, and the `prod` CloudFront distribution.

## Task Group 4: Documentation & Validation
1. Document GitHub Environments (`dev` and `prod`), required environment variables, `dev` branch setup, `main` branch protection rules, and the one-time AWS bootstrap + live verification steps in `README.md` / `infra/README.md`.
2. Validate workflow YAML syntax, `terraform fmt -check -recursive infra/`, `terraform validate`, and `pnpm lint && pnpm check && pnpm build`.
