provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "air-robotics-website"
      ManagedBy   = "terraform"
      Environment = "dev"
    }
  }
}
