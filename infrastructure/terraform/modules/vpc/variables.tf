variable "environment" {
  type        = string
  description = "Application deployment environment name"
}

variable "allowed_ssh_cidr" {
  type        = string
  description = "CIDR allowed to connect to EC2 instances via SSH"
}
