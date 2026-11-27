# Requirements

## Scope

Phase 2 defines all AWS infrastructure as code in Terraform under `infra/` so both `dev` (`dev.air-robotics.ai`) and `prod` (`air-robotics.ai`, with `www.air-robotics.ai` redirect) can be provisioned reproducibly and deployed securely by GitHub Actions in Phase 3.

In scope:
- `infra/bootstrap/` stack provisioning:
  - Shared S3 bucket for Terraform remote state with native S3 lockfile support (`use_lockfile = true`, Terraform `>= 1.10`).
  - AWS IAM OIDC provider for GitHub Actions (`token.actions.githubusercontent.com`).
  - Route 53 public hosted zone for `air-robotics.ai` (outputting nameservers for registrar configuration).
- `infra/modules/static-site/` reusable Terraform module provisioning:
  - Private S3 origin bucket + CloudFront Origin Access Control (OAC) + least-privilege bucket policy.
  - ACM TLS certificate in `us-east-1` with Route 53 DNS validation.
  - CloudFront distribution with HTTPS enforcement, clean URL rewriting for Astro/Starlight static routes (`/docs/` → `/docs/index.html`), `/404.html` error handling, optional `www` → apex 301 redirect, and optional `X-Robots-Tag: noindex, nofollow` header.
  - Route 53 `A` and `AAAA` alias records.
  - Least-privilege GitHub Actions OIDC IAM role scoped to `aiandrobotics/air-robotics-website` and the environment's branch.
- `infra/environments/dev/` (`dev.air-robotics.ai`, `noindex = true`, branch `dev`) and `infra/environments/prod/` (`air-robotics.ai` + `www.air-robotics.ai` redirect, `noindex = false`, branch `main`), each with isolated S3 remote state keys.
- Updated `infra/README.md` documenting bootstrap, registrar NS setup, and environment usage.

## Decisions

- **Route 53 Hosted Zone**: Created by Terraform in `infra/bootstrap/` for `air-robotics.ai`; `dev` and `prod` environments reference it via data source so both environments share one zone cleanly without duplication.
- **AWS Region**: `us-east-1` for S3 buckets, Terraform state, and CloudFront ACM certificates (single-region simplicity).
- **`www` Redirect**: `www.air-robotics.ai` redirects (`301`) to `https://air-robotics.ai` via CloudFront Function on `prod`, covered by the `prod` ACM certificate SAN and Route 53 alias records.
- **State Locking**: Terraform `>= 1.10` native S3 lockfile (`use_lockfile = true`)—no DynamoDB table needed.
- **Authentication**: GitHub OIDC federation only; zero static AWS access keys.

## Constraints

- Must align with `specs/mission.md` and `specs/tech-stack.md` (AWS S3 + CloudFront + ACM + Route 53, Terraform IaC, GitHub OIDC, strict `dev` vs `prod` isolation).
- `dev.air-robotics.ai` must send `X-Robots-Tag: noindex, nofollow` so staging is not indexed by search engines.
- All S3 buckets must block public access (`aws_s3_bucket_public_access_block`) and enforce encryption at rest.
- Branch: work proceeds on `aws-infrastructure-terraform`.

## Non-goals

- GitHub Actions workflow YAML files (`.github/workflows/`) and automated CI/CD execution (Phase 3).
- Full website pages, shared theme package, or multi-repo docs aggregation (Phases 4–5).
- WAF, custom log analytics pipelines, or authentication/IP gating on `dev`.
- Applying Terraform to a live AWS account during spec validation (live apply happens once AWS credentials and registrar NS delegation are ready).

## Context

- Source roadmap phase: **Phase 2: AWS Infrastructure with Terraform** in `specs/roadmap.md`.
- Depends on Phase 1 (`site/dist/` static output structure, including `/index.html`, `/docs/index.html`, and `/404.html`).
- Feeds directly into Phase 3 (`dev` and `prod` GitHub Actions deploy and Terraform plan/apply workflows).
