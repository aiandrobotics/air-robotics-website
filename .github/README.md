# GitHub Actions CI/CD Setup

This repository uses GitHub Actions with **AWS OIDC** (zero static AWS keys) and **GitHub Environments** (`dev` and `prod`) to validate PRs, run Terraform `plan`/`apply`, and enforce the `dev` → `main` promotion flow.

## Workflows

- **`ci.yml`** (PRs to `dev` and `main`):
  - Enforces that PRs targeting `main` originate from `dev` (`promotion-guard`).
  - Runs `pnpm lint`, `pnpm check`, `pnpm build`, and verifies `site/dist/index.html` and `site/dist/docs/index.html`.
  - Runs `terraform fmt -check -recursive infra/` and `terraform validate` across `bootstrap`, `modules/static-site`, `dev`, and `prod`.
  - Runs `terraform plan` against `dev` or `prod` when `infra/` files change and environment variables are configured.
- **`deploy-dev.yml`** (push to `dev`, `repository_dispatch` `robot-docs-updated`, or `workflow_dispatch`):
  - Runs `pnpm sync:docs` (using optional `ROBOTS_READ_TOKEN` secret for private robot repos), builds `site/dist/`, runs `terraform apply` for `dev` if `infra/` changed, syncs to the `dev` S3 bucket, and invalidates `dev` CloudFront (`https://dev.air-robotics.ai`).
- **`deploy-prod.yml`** (push to `main` or `workflow_dispatch`):
  - Runs `pnpm sync:docs`, builds `site/dist/`, runs `terraform apply` for `prod` if `infra/` changed, syncs to the `prod` S3 bucket, and invalidates `prod` CloudFront (`https://air-robotics.ai`).

### Cross-Repo Rebuild Trigger (`repository_dispatch`)
Robot repositories trigger an automatic `dev.air-robotics.ai` rebuild on doc merge by sending a `repository_dispatch` event to `aiandrobotics/air-robotics-website` with `event_type: "robot-docs-updated"`.

If any robot repositories are private, add a repository secret named `ROBOTS_READ_TOKEN` (fine-grained PAT with `Contents: Read` on the robot repos) in **GitHub → Settings → Secrets and variables → Actions → Secrets**.

## One-Time Setup Checklist

### 1. Provision AWS Bootstrap & Initial Environments
Follow [infra/README.md](../infra/README.md) to run `infra/bootstrap` once, delegate the 4 Route 53 nameservers at your `air-robotics.ai` registrar, and run the initial `terraform apply` for `infra/environments/dev` and `infra/environments/prod`.

### 2. Create GitHub Environments (`dev` and `prod`)
In **GitHub → Settings → Environments**, create two environments: `dev` and `prod`.

Configure these **Environment Variables** in **each** environment using the Terraform outputs:

| Variable | Source |
| --- | --- |
| `AWS_ROLE_ARN` | `github_deploy_role_arn` from `infra/environments/<env>` |
| `AWS_PLAN_ROLE_ARN` | `github_plan_role_arn` from `infra/environments/<env>` |
| `S3_BUCKET` | `bucket_name` from `infra/environments/<env>` |
| `CLOUDFRONT_DISTRIBUTION_ID` | `cloudfront_distribution_id` from `infra/environments/<env>` |
| `TF_STATE_BUCKET` | `state_bucket_name` from `infra/bootstrap` |
| `TF_STATE_BUCKET_ARN` | `state_bucket_arn` from `infra/bootstrap` |
| `OIDC_PROVIDER_ARN` | `github_oidc_provider_arn` from `infra/bootstrap` |

*(Optional: add a required reviewer on the `prod` GitHub Environment for an extra manual approval gate.)*

### 3. Create the `dev` Branch & Branch Protection on `main`
1. Create and push the `dev` branch from `main`:
   ```bash
   git checkout -b dev main && git push -u origin dev
   ```
2. In **GitHub → Settings → Branches**, add a branch protection rule for `main`:
   - Require a pull request before merging.
   - Require status checks to pass before merging: `Enforce dev -> main Promotion`, `Site Lint, Check & Build`, `Terraform Format & Validate`.
   - Restrict direct pushes to `main`.
