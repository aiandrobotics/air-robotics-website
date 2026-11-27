variable "environment" {
  description = "Deployment environment name (dev or prod)."
  type        = string

  validation {
    condition     = contains(["dev", "prod"], var.environment)
    error_message = "environment must be either \"dev\" or \"prod\"."
  }
}

variable "domain_name" {
  description = "Primary domain served by this static site (e.g. dev.air-robotics.ai or air-robotics.ai)."
  type        = string
}

variable "root_domain" {
  description = "Root Route 53 hosted zone domain name."
  type        = string
  default     = "air-robotics.ai"
}

variable "bucket_name" {
  description = "Globally unique S3 bucket name for the static site origin."
  type        = string
}

variable "enable_www_redirect" {
  description = "When true, serve a 301 redirect from www.<domain_name> to https://<domain_name>."
  type        = bool
  default     = false
}

variable "noindex" {
  description = "When true, add X-Robots-Tag: noindex, nofollow response header (used for dev)."
  type        = bool
  default     = false
}

variable "github_repo" {
  description = "GitHub repository in owner/repo format authorized via OIDC."
  type        = string
  default     = "aiandrobotics/air-robotics-website"
}

variable "github_oidc_sub_prefix" {
  description = "GitHub OIDC subject prefix (supports GitHub immutable subject IDs, e.g. repo:org@id/repo@id). Defaults to repo:<github_repo> when null."
  type        = string
  default     = null
}

variable "github_branch" {
  description = "GitHub branch authorized to assume this environment's deploy role."
  type        = string
}

variable "github_oidc_provider_arn" {
  description = "ARN of the GitHub Actions IAM OIDC provider created in infra/bootstrap."
  type        = string
}

variable "state_bucket_arn" {
  description = "ARN of the shared Terraform remote state S3 bucket created in infra/bootstrap."
  type        = string
}

variable "price_class" {
  description = "CloudFront distribution price class."
  type        = string
  default     = "PriceClass_100"
}
