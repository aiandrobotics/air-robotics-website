output "bucket_name" {
  value = module.site.bucket_name
}

output "cloudfront_distribution_id" {
  value = module.site.cloudfront_distribution_id
}

output "site_url" {
  value = module.site.site_url
}

output "github_deploy_role_arn" {
  value = module.site.github_deploy_role_arn
}

output "github_plan_role_arn" {
  value = module.site.github_plan_role_arn
}
