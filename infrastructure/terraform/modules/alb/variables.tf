variable "environment" {
  type        = string
  description = "Application deployment environment name"
}

variable "vpc_id" {
  type        = string
  description = "The ID of the custom VPC"
}

variable "public_subnet_ids" {
  type        = list(string)
  description = "Public subnets to bind the ALB endpoints"
}

variable "alb_sg_id" {
  type        = string
  description = "Security Group ID protecting the ALB listeners"
}

variable "ec2_instance_id" {
  type        = string
  description = "The ID of the EC2 instance to receive target routing"
}
