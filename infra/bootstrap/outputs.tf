output "state_bucket_name" {
  description = "Name of the S3 bucket storing Terraform remote state."
  value       = aws_s3_bucket.tfstate.id
}

output "state_bucket_arn" {
  description = "ARN of the S3 bucket storing Terraform remote state."
  value       = aws_s3_bucket.tfstate.arn
}

output "github_oidc_provider_arn" {
  description = "ARN of the GitHub Actions IAM OIDC provider."
  value       = aws_iam_openid_connect_provider.github.arn
}

output "route53_zone_id" {
  description = "Route 53 hosted zone ID for air-robotics.ai."
  value       = aws_route53_zone.primary.zone_id
}

output "route53_name_servers" {
  description = "Delegate these nameservers at the air-robotics.ai domain registrar."
  value       = aws_route53_zone.primary.name_servers
}
