output "vpc_id" {
  value       = aws_vpc.main.id
  description = "The ID of the custom VPC"
}

output "public_subnet_ids" {
  value       = [aws_subnet.public_1.id, aws_subnet.public_2.id]
  description = "The list of IDs of public subnets"
}

output "private_subnet_ids" {
  value       = [aws_subnet.private_1.id, aws_subnet.private_2.id]
  description = "The list of IDs of private subnets"
}

output "alb_sg_id" {
  value       = aws_security_group.alb.id
  description = "The Security Group ID for the ALB"
}

output "ec2_sg_id" {
  value       = aws_security_group.ec2.id
  description = "The Security Group ID for the EC2 App Server"
}

output "rds_sg_id" {
  value       = aws_security_group.rds.id
  description = "The Security Group ID for the RDS DB"
}
