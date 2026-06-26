variable "environment" {
  type        = string
  description = "Application deployment environment name"
}

variable "private_subnet_ids" {
  type        = list(string)
  description = "A list of private subnets where the RDS DB instance subnet group is created"
}

variable "rds_sg_id" {
  type        = string
  description = "Security Group ID restricting access to RDS DB port 3306"
}

variable "db_username" {
  type        = string
  description = "Administrator login username for MySQL database engine"
}

variable "db_password" {
  type        = string
  description = "Administrator login password for MySQL database engine"
  sensitive   = true
}
