output "ec2_public_ip" {
  value       = module.ec2.public_ip
  description = "The public IP address of the deployed EC2 App Server (connect with SSH or HTTP)"
}

output "rds_endpoint" {
  value       = module.rds.endpoint
  description = "The database connect host endpoint for the RDS MySQL instance"
}

output "s3_bucket_name" {
  value       = module.s3.bucket_name
  description = "The auto-generated private S3 bucket name for uploads"
}

output "alb_dns_name" {
  value       = var.create_alb ? module.alb[0].dns_name : "ALB disabled (using direct EC2 access)"
  description = "The DNS name of the Application Load Balancer if enabled"
}
