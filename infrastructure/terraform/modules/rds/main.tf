# RDS Module main file
# Deploys a managed, private MySQL instance

# 1. DB Subnet Group (Maps RDS database access to private VPC networks)
resource "aws_db_subnet_group" "mysql" {
  name       = "clouddrive-${var.environment}-db-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name        = "clouddrive-${var.environment}-db-subnet-group"
    Environment = var.environment
  }
}

# 2. RDS MySQL DB Instance (db.t3.micro is AWS Free Tier eligible)
resource "aws_db_instance" "mysql" {
  identifier        = "clouddrive-${var.environment}-mysql"
  allocated_storage = 20
  storage_type      = "gp2"
  engine            = "mysql"
  engine_version    = "8.0"
  instance_class    = "db.t3.micro"
  db_name           = "clouddrive"
  username          = var.db_username
  password          = var.db_password

  // Associate networks and firewalls
  db_subnet_group_name   = aws_db_subnet_group.mysql.name
  vpc_security_group_ids = [var.rds_sg_id]
  
  // Public access disabled for network security isolation
  publicly_accessible = false
  
  // Free Tier restriction: backup_retention_period must be 0 (no automated backups)
  // Upgrade your AWS account to enable backups
  backup_retention_period = 0
  maintenance_window      = "Mon:04:00-Mon:05:00"

  // Storage encryption at rest
  storage_encrypted = true

  // Set to true for dev environments to allow clean terraform destroy
  // Set to false and add final_snapshot_identifier in production
  skip_final_snapshot = true

  tags = {
    Name        = "clouddrive-${var.environment}-mysql"
    Environment = var.environment
  }
}
