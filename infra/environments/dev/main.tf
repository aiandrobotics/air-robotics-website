module "site" {
  source = "../../modules/static-site"

  environment              = "dev"
  domain_name              = "dev.air-robotics.ai"
  root_domain              = "air-robotics.ai"
  bucket_name              = var.bucket_name
  enable_www_redirect      = false
  noindex                  = true
  github_repo              = "aiandrobotics/air-robotics-website"
  github_oidc_sub_prefix   = "repo:aiandrobotics@226992963/air-robotics-website@1473563546"
  github_branch            = "dev"
  github_oidc_provider_arn = var.github_oidc_provider_arn
  state_bucket_arn         = var.state_bucket_arn
}
