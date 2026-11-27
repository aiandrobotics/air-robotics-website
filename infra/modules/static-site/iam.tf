# ------------------------------------------------------------------------------
# Least-Privilege GitHub Actions OIDC Role for Environment Deploys
# ------------------------------------------------------------------------------
data "aws_iam_policy_document" "github_oidc_assume" {
  statement {
    sid     = "AllowGitHubActionsOIDC"
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [var.github_oidc_provider_arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${var.github_repo}:ref:refs/heads/${var.github_branch}"]
    }
  }
}

resource "aws_iam_role" "github_deploy" {
  name               = "air-robotics-website-${var.environment}-github-deploy"
  assume_role_policy = data.aws_iam_policy_document.github_oidc_assume.json
}

data "aws_iam_policy_document" "github_deploy" {
  statement {
    sid    = "SiteBucketList"
    effect = "Allow"
    actions = [
      "s3:ListBucket",
      "s3:GetBucketLocation",
    ]
    resources = [aws_s3_bucket.site.arn]
  }

  statement {
    sid    = "SiteBucketObjects"
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
    ]
    resources = ["${aws_s3_bucket.site.arn}/*"]
  }

  statement {
    sid    = "CloudFrontInvalidation"
    effect = "Allow"
    actions = [
      "cloudfront:CreateInvalidation",
      "cloudfront:GetInvalidation",
    ]
    resources = [aws_cloudfront_distribution.site.arn]
  }

  statement {
    sid    = "TerraformStateBucketList"
    effect = "Allow"
    actions = [
      "s3:ListBucket",
    ]
    resources = [var.state_bucket_arn]
  }

  statement {
    sid    = "TerraformStateObjects"
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
    ]
    resources = ["${var.state_bucket_arn}/${var.environment}/*"]
  }
}

resource "aws_iam_role_policy" "github_deploy" {
  name   = "air-robotics-website-${var.environment}-deploy-policy"
  role   = aws_iam_role.github_deploy.id
  policy = data.aws_iam_policy_document.github_deploy.json
}
