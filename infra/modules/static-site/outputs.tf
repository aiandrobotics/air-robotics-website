output "bucket_name" {
  description = "S3 origin bucket name."
  value       = aws_s3_bucket.site.id
}

output "bucket_arn" {
  description = "S3 origin bucket ARN."
  value       = aws_s3_bucket.site.arn
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID (used for cache invalidation)."
  value       = aws_cloudfront_distribution.site.id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name."
  value       = aws_cloudfront_distribution.site.domain_name
}

output "certificate_arn" {
  description = "Validated ACM certificate ARN."
  value       = aws_acm_certificate_validation.site.certificate_arn
}

output "site_url" {
  description = "Public HTTPS URL for this environment."
  value       = "https://${var.domain_name}"
}

output "github_deploy_role_arn" {
  description = "IAM role ARN assumed by GitHub Actions via OIDC for deploys and Terraform apply."
  value       = aws_iam_role.github_deploy.arn
}

output "github_plan_role_arn" {
  description = "Read-only IAM role ARN assumed by GitHub Actions via OIDC for PR Terraform plans."
  value       = aws_iam_role.github_plan.arn
}
