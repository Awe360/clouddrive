variable "environment" {
  type        = string
  description = "Application deployment environment name"
}

variable "public_subnet_id" {
  type        = string
  description = "The public subnet ID where the EC2 host is provisioned"
}

variable "ec2_sg_id" {
  type        = string
  description = "Security Group ID protecting EC2 inbound/outbound ports"
}

variable "ec2_instance_profile" {
  type        = string
  description = "IAM instance profile name granting S3 access roles to the EC2 server"
}

variable "key_pair_name" {
  type        = string
  description = "Pre-created AWS key pair name for SSH access credentials validation"
}
