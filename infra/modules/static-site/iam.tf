# ------------------------------------------------------------------------------
# Least-Privilege GitHub Actions OIDC Roles (Deploy + PR Plan)
# ------------------------------------------------------------------------------
data "aws_iam_policy_document" "github_oidc_assume_deploy" {
  statement {
    sid     = "AllowGitHubActionsDeployOIDC"
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
      values = [
        "repo:${var.github_repo}:environment:${var.environment}",
        "repo:${var.github_repo}:ref:refs/heads/${var.github_branch}",
      ]
    }
  }
}

resource "aws_iam_role" "github_deploy" {
  name               = "air-robotics-website-${var.environment}-github-deploy"
  assume_role_policy = data.aws_iam_policy_document.github_oidc_assume_deploy.json
}

data "aws_iam_policy_document" "github_deploy" {
  statement {
    sid    = "SiteBucketManage"
    effect = "Allow"
    actions = [
      "s3:ListBucket",
      "s3:GetBucket*",
      "s3:PutBucket*",
      "s3:PutEncryptionConfiguration",
      "s3:GetEncryptionConfiguration",
      "s3:GetAccelerateConfiguration",
      "s3:GetLifecycleConfiguration",
      "s3:GetReplicationConfiguration",
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

  statement {
    sid    = "CloudFrontManageAndInvalidate"
    effect = "Allow"
    actions = [
      "cloudfront:Get*",
      "cloudfront:List*",
      "cloudfront:CreateInvalidation",
      "cloudfront:UpdateDistribution",
      "cloudfront:CreateFunction",
      "cloudfront:UpdateFunction",
      "cloudfront:PublishFunction",
      "cloudfront:DescribeFunction",
      "cloudfront:DeleteFunction",
      "cloudfront:CreateOriginAccessControl",
      "cloudfront:UpdateOriginAccessControl",
      "cloudfront:DeleteOriginAccessControl",
      "cloudfront:CreateResponseHeadersPolicy",
      "cloudfront:UpdateResponseHeadersPolicy",
      "cloudfront:DeleteResponseHeadersPolicy",
      "cloudfront:TagResource",
      "cloudfront:UntagResource",
    ]
    resources = ["*"]
  }

  statement {
    sid    = "AcmAndRoute53Manage"
    effect = "Allow"
    actions = [
      "acm:DescribeCertificate",
      "acm:GetCertificate",
      "acm:ListCertificates",
      "acm:ListTagsForCertificate",
      "acm:RequestCertificate",
      "acm:AddTagsToCertificate",
      "acm:DeleteCertificate",
      "route53:GetHostedZone",
      "route53:ListHostedZones",
      "route53:ListHostedZonesByName",
      "route53:ListTagsForResource",
      "route53:ListResourceRecordSets",
      "route53:ChangeResourceRecordSets",
      "route53:GetChange",
    ]
    resources = ["*"]
  }

  statement {
    sid    = "IamScopedToEnvironmentRoles"
    effect = "Allow"
    actions = [
      "iam:GetRole",
      "iam:ListRolePolicies",
      "iam:GetRolePolicy",
      "iam:PutRolePolicy",
      "iam:DeleteRolePolicy",
      "iam:ListAttachedRolePolicies",
      "iam:UpdateAssumeRolePolicy",
      "iam:TagRole",
      "iam:UntagRole",
      "iam:ListRoleTags",
    ]
    resources = [
      "arn:aws:iam::*:role/air-robotics-website-${var.environment}-github-*",
    ]
  }
}

resource "aws_iam_role_policy" "github_deploy" {
  name   = "air-robotics-website-${var.environment}-deploy-policy"
  role   = aws_iam_role.github_deploy.id
  policy = data.aws_iam_policy_document.github_deploy.json
}

# ------------------------------------------------------------------------------
# Read-Only GitHub Actions OIDC Role for Pull Request Terraform Plan
# ------------------------------------------------------------------------------
data "aws_iam_policy_document" "github_oidc_assume_plan" {
  statement {
    sid     = "AllowGitHubActionsPullRequestOIDC"
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
      values = [
        "repo:${var.github_repo}:pull_request",
        "repo:${var.github_repo}:environment:${var.environment}",
      ]
    }
  }
}

resource "aws_iam_role" "github_plan" {
  name               = "air-robotics-website-${var.environment}-github-plan"
  assume_role_policy = data.aws_iam_policy_document.github_oidc_assume_plan.json
}

data "aws_iam_policy_document" "github_plan" {
  statement {
    sid    = "TerraformStateReadAndLock"
    effect = "Allow"
    actions = [
      "s3:ListBucket",
    ]
    resources = [var.state_bucket_arn]
  }

  statement {
    sid    = "TerraformStateReadObjects"
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
    ]
    resources = ["${var.state_bucket_arn}/${var.environment}/*"]
  }

  statement {
    sid    = "ReadOnlyInfraInspection"
    effect = "Allow"
    actions = [
      "s3:GetBucket*",
      "s3:GetEncryptionConfiguration",
      "s3:GetAccelerateConfiguration",
      "s3:GetLifecycleConfiguration",
      "s3:GetReplicationConfiguration",
      "s3:ListBucket",
      "cloudfront:Get*",
      "cloudfront:List*",
      "cloudfront:DescribeFunction",
      "acm:DescribeCertificate",
      "acm:GetCertificate",
      "acm:ListCertificates",
      "acm:ListTagsForCertificate",
      "route53:GetHostedZone",
      "route53:ListHostedZones",
      "route53:ListHostedZonesByName",
      "route53:ListTagsForResource",
      "route53:ListResourceRecordSets",
      "iam:GetRole",
      "iam:GetRolePolicy",
      "iam:ListRolePolicies",
      "iam:ListAttachedRolePolicies",
      "iam:ListRoleTags",
    ]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "github_plan" {
  name   = "air-robotics-website-${var.environment}-plan-policy"
  role   = aws_iam_role.github_plan.id
  policy = data.aws_iam_policy_document.github_plan.json
}
