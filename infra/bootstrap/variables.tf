variable "aws_region" {
  description = "Primary AWS region for shared Terraform state and resources."
  type        = string
  default     = "us-east-1"
}

variable "domain_name" {
  description = "Root domain name for the Route 53 public hosted zone."
  type        = string
  default     = "air-robotics.ai"
}

variable "state_bucket_name" {
  description = "Globally unique S3 bucket name for Terraform remote state."
  type        = string
  default     = "air-robotics-website-tfstate"
}

variable "github_oidc_thumbprints" {
  description = "Root CA thumbprints for GitHub Actions OIDC provider."
  type        = list(string)
  default = [
    "6938fd4d98bab03faadb97b34396831e3780aea1",
    "1c58a3a8518e8759bf075b76b750d4f2df264fcd",
  ]
}
