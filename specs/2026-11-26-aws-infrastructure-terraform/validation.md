# Validation

## Required Checks

All commands below must exit with code `0` (requires Terraform `>= 1.10`):

1. **Formatting check across all Terraform files**:
   ```bash
   terraform fmt -check -recursive infra/
   ```
2. **Validation across bootstrap, module, dev, and prod**:
   ```bash
   for dir in infra/bootstrap infra/modules/static-site infra/environments/dev infra/environments/prod; do
     terraform -chdir="$dir" init -backend=false
     terraform -chdir="$dir" validate
   done
   ```
3. **Existing workspace checks remain green**:
   ```bash
   pnpm lint && pnpm check && pnpm build
   ```

## Manual Review

- Verify every S3 bucket has `aws_s3_bucket_public_access_block` with all four flags set to `true` and encryption enabled.
- Verify CloudFront uses Origin Access Control (OAC) rather than legacy OAI or public S3 website endpoints.
- Verify `dev` enables `X-Robots-Tag: noindex, nofollow` and `prod` enables `www.air-robotics.ai` → `air-robotics.ai` redirect.
- Verify GitHub OIDC IAM trust policies strictly scope `sub` to `repo:aiandrobotics/air-robotics-website:ref:refs/heads/dev` (for `dev`) and `repo:aiandrobotics/air-robotics-website:ref:refs/heads/main` (for `prod`).
- Confirm `.terraform/`, `*.tfstate*`, and `*.tfvars` (excluding `*.example`) are ignored by `.gitignore` and not present in `git status`.

## Merge Criteria

- `terraform fmt -check -recursive infra/` passes with zero diff.
- `terraform validate` passes in `infra/bootstrap/`, `infra/modules/static-site/`, `infra/environments/dev/`, and `infra/environments/prod/`.
- Existing `pnpm lint`, `pnpm check`, and `pnpm build` checks still pass.
- `infra/README.md` documents the exact bootstrap, registrar NS delegation, and environment initialization steps.
- Changes stay strictly within Phase 2 scope (`infra/` and specs).
