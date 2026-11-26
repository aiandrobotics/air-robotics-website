# Infrastructure

Terraform configurations for Air Robotics (`dev.air-robotics.ai` and `air-robotics.ai`) will be added in **Phase 2: AWS Infrastructure with Terraform**.

Planned structure:
- `bootstrap/` — Remote S3 Terraform state backend
- `modules/static-site/` — S3 + CloudFront (OAC) + ACM + Route 53 reusable module
- `environments/dev/` — `dev.air-robotics.ai` environment
- `environments/prod/` — `air-robotics.ai` environment
