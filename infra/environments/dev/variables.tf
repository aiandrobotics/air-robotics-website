variable "aws_region" {
  description = "Primary AWS region."
  type        = string
  default     = "us-east-1"
}

variable "bucket_name" {
  description = "Globally unique S3 bucket name for the dev static site."
  type        = string
  default     = "air-robotics-website-dev"
}

variable "github_oidc_provider_arn" {
  description = "ARN of the GitHub Actions OIDC provider from infra/bootstrap."
  type        = string
}

variable "state_bucket_arn" {
  description = "ARN of the Terraform remote state S3 bucket from infra/bootstrap."
  type        = string
}
