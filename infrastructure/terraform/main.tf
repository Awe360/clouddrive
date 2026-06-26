# Root Terraform main file for CloudDrive Infrastructure

# Generate a random suffix for the S3 bucket to ensure global uniqueness
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

module "vpc" {
  source           = "./modules/vpc"
  environment      = var.environment
  allowed_ssh_cidr = var.allowed_ssh_cidr
}

module "iam" {
  source       = "./modules/iam"
  environment  = var.environment
  s3_bucket_arn = module.s3.bucket_arn
}

module "s3" {
  source        = "./modules/s3"
  environment   = var.environment
  bucket_suffix = random_id.bucket_suffix.hex
}

module "rds" {
  source             = "./modules/rds"
  environment        = var.environment
  private_subnet_ids = module.vpc.private_subnet_ids
  rds_sg_id          = module.vpc.rds_sg_id
  db_username        = var.db_username
  db_password        = var.db_password
}

module "ec2" {
  source               = "./modules/ec2"
  environment          = var.environment
  public_subnet_id     = module.vpc.public_subnet_ids[0]
  ec2_sg_id            = module.vpc.ec2_sg_id
  ec2_instance_profile = module.iam.ec2_instance_profile_name
  key_pair_name        = var.key_pair_name
}

module "alb" {
  count             = var.create_alb ? 1 : 0
  source            = "./modules/alb"
  environment       = var.environment
  vpc_id            = module.vpc.vpc_id
  public_subnet_ids = module.vpc.public_subnet_ids
  alb_sg_id         = module.vpc.alb_sg_id
  ec2_instance_id   = module.ec2.instance_id
}
