variable "aws_region" {
  type        = string
  description = "The target AWS region for deployment resources"
  default     = "us-east-1"
}

variable "environment" {
  type        = string
  description = "Application deployment environment (e.g. dev, staging, prod)"
  default     = "dev"
}

variable "db_username" {
  type        = string
  description = "Root username for RDS MySQL Database instance"
  default     = "admin"
}

variable "db_password" {
  type        = string
  description = "Root password for RDS MySQL Database instance (must be >= 8 chars)"
  sensitive   = true
}

variable "key_pair_name" {
  type        = string
  description = "Name of the pre-created EC2 Key Pair to install on the EC2 instance for SSH access"
}

variable "create_alb" {
  type        = bool
  description = "Toggle to create an Application Load Balancer. Setting this to false preserves AWS Free Tier."
  default     = false
}

variable "allowed_ssh_cidr" {
  type        = string
  description = "CIDR block allowed to SSH into the EC2 instance (recommend narrowing to your local IP)"
  default     = "0.0.0.0/0"
}
