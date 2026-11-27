# Infrastructure (AWS + Terraform)

Terraform infrastructure for **Air Robotics** (`dev.air-robotics.ai` and `air-robotics.ai`) in `us-east-1`.

## Layout

- `bootstrap/` — One-time shared stack:
  - S3 remote state bucket (versioned, encrypted, public access blocked, Terraform `>= 1.10` native S3 lockfile)
  - GitHub Actions IAM OIDC provider (`token.actions.githubusercontent.com`)
  - Route 53 public hosted zone for `air-robotics.ai`
- `modules/static-site/` — Reusable module provisioning private S3 bucket, CloudFront distribution with OAC, ACM certificate + Route 53 DNS validation, CloudFront Function (clean `/index.html` URLs + optional `www` → apex 301 redirect), security & optional `X-Robots-Tag: noindex, nofollow` headers, Route 53 `A`/`AAAA` alias records, and least-privilege GitHub Actions OIDC IAM role.
- `environments/dev/` — `dev.air-robotics.ai` (`noindex = true`, branch `dev`)
- `environments/prod/` — `air-robotics.ai` + `www.air-robotics.ai` → `air-robotics.ai` redirect (`noindex = false`, branch `main`)

## Prerequisites

- Terraform `>= 1.10.0`
- AWS CLI authenticated against the target AWS account

## 1. Run Bootstrap (One-Time)

```bash
terraform -chdir=infra/bootstrap init
terraform -chdir=infra/bootstrap apply
```

Note the outputs:
- `state_bucket_name` and `state_bucket_arn`
- `github_oidc_provider_arn`
- `route53_name_servers`

### Delegate DNS at Your Registrar

Point the `air-robotics.ai` domain registrar nameservers to the `route53_name_servers` output before applying `dev` or `prod` so ACM DNS validation completes automatically.

## 2. Initialize & Apply `dev` and `prod`

For each environment (`dev`, then `prod`):

```bash
cp infra/environments/dev/backend.hcl.example infra/environments/dev/backend.hcl
cp infra/environments/dev/terraform.tfvars.example infra/environments/dev/terraform.tfvars
# Update backend.hcl and terraform.tfvars with outputs from infra/bootstrap

terraform -chdir=infra/environments/dev init -backend-config=backend.hcl
terraform -chdir=infra/environments/dev plan
terraform -chdir=infra/environments/dev apply
```

Repeat with `infra/environments/prod` for `air-robotics.ai`.

## 3. Local Validation (No AWS Credentials Required)

```bash
terraform fmt -check -recursive infra/
for dir in infra/bootstrap infra/modules/static-site infra/environments/dev infra/environments/prod; do
  terraform -chdir="$dir" init -backend=false
  terraform -chdir="$dir" validate
done
```
