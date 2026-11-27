# Validation

## Required Checks

All commands below must exit with code `0`:

1. **Workflow YAML syntax validation**:
   Verify `.github/workflows/ci.yml`, `.github/workflows/deploy-dev.yml`, and `.github/workflows/deploy-prod.yml` parse cleanly as valid YAML (and pass `actionlint` if available).
2. **Terraform formatting & validation**:
   ```bash
   terraform fmt -check -recursive infra/
   for dir in infra/bootstrap infra/modules/static-site infra/environments/dev infra/environments/prod; do
     terraform -chdir="$dir" init -backend=false
     terraform -chdir="$dir" validate
   done
   ```
3. **Workspace lint, typecheck, and static build**:
   ```bash
   pnpm lint && pnpm check && pnpm build
   ```

## Manual Review

- Verify every workflow defines explicit least-privilege `permissions:` and uses OIDC (`id-token: write`) with zero static AWS access keys.
- Verify `deploy-dev.yml` and `deploy-prod.yml` use `environment: dev` and `environment: prod` respectively, matching the OIDC `sub` claims in `infra/modules/static-site/iam.tf`.
- Verify `deploy-dev.yml` and `deploy-prod.yml` set `cancel-in-progress: false` on their `concurrency` groups so a running `terraform apply` is never interrupted mid-flight.
- Verify `ci.yml` blocks PRs into `main` from branches other than `dev`.
- Verify setup documentation clearly lists all required GitHub Environment variables, branch protection rules, and AWS bootstrap steps.

## Merge Criteria

- All **Required Checks** pass with zero errors.
- All three workflow files (`ci.yml`, `deploy-dev.yml`, `deploy-prod.yml`) and updated `infra/modules/static-site/iam.tf` are present and validated.
- No secrets, `.tfstate` files, or out-of-scope changes are committed.
