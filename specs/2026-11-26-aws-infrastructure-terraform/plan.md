# Plan

## Task Group 1: Bootstrap Stack (`infra/bootstrap/`)
1. Create `infra/bootstrap/` Terraform configuration (`versions.tf`, `providers.tf`, `variables.tf`, `main.tf`, `outputs.tf`) targeting `us-east-1` and Terraform `>= 1.10`.
2. Define the shared Terraform remote state S3 bucket (versioning enabled, AES256/KMS encryption, public access blocked, lifecycle cleanup for incomplete uploads) to support native S3 state locking (`use_lockfile = true`).
3. Define the GitHub Actions OIDC identity provider (`https://token.actions.githubusercontent.com`) for `sts.amazonaws.com`.
4. Define the shared Route 53 hosted zone for `air-robotics.ai` and export `state_bucket_name`, `github_oidc_provider_arn`, `route53_zone_id`, and `route53_name_servers` (for registrar NS delegation).

## Task Group 2: Reusable Static Site Module (`infra/modules/static-site/`)
1. Create `infra/modules/static-site/` (`versions.tf`, `variables.tf`, `main.tf`, `iam.tf`, `cloudfront-function.js`, `outputs.tf`).
2. Provision private S3 origin bucket (public access blocked, encryption, versioning) and S3 bucket policy granting read access solely to the CloudFront distribution via Origin Access Control (OAC).
3. Provision ACM TLS certificate in `us-east-1` covering `domain_name` (and `www.<domain_name>` when `enable_www_redirect = true`), with automated Route 53 DNS validation records.
4. Implement CloudFront Function for clean Astro/Starlight URLs (rewriting `/path` and `/path/` to `/path/index.html`) and 301 redirect from `www.<domain_name>` to `https://<domain_name>` when enabled.
5. Provision CloudFront distribution with HTTPS redirect, HTTP/2 & HTTP/3, custom `/404.html` error response, security headers, and optional `X-Robots-Tag: noindex, nofollow` response header policy (for `dev`).
6. Provision Route 53 `A` and `AAAA` alias records for `domain_name` (and `www.<domain_name>` when enabled).
7. Provision least-privilege GitHub Actions OIDC IAM role scoped to `github.com/aiandrobotics/air-robotics-website` and the environment's target branch (`dev` or `main`), granting S3 sync and CloudFront cache invalidation permissions (plus read-only/plan role support for Phase 3 PR checks).

## Task Group 3: Environment Stacks (`infra/environments/dev/` & `infra/environments/prod/`)
1. Create `infra/environments/dev/` calling `../../modules/static-site` for `dev.air-robotics.ai` with `noindex = true`, `enable_www_redirect = false`, OIDC branch `dev`, and S3 remote backend (`use_lockfile = true`, `key = "dev/terraform.tfstate"`).
2. Create `infra/environments/prod/` calling `../../modules/static-site` for `air-robotics.ai` with `noindex = false`, `enable_www_redirect = true`, OIDC branch `main`, and S3 remote backend (`use_lockfile = true`, `key = "prod/terraform.tfstate"`).
3. Add `backend.hcl.example` / `terraform.tfvars.example` templates and update `infra/README.md` with clear bootstrap, NS delegation, and environment initialization instructions.

## Task Group 4: Formatting & Validation
1. Run `terraform fmt -check -recursive infra/`.
2. Run `terraform init -backend=false` and `terraform validate` in `infra/bootstrap/`, `infra/modules/static-site/`, `infra/environments/dev/`, and `infra/environments/prod/`.
3. Verify no state files, `.terraform/` directories, or hardcoded AWS credentials are committed.
