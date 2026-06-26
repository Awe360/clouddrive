# EC2 Module main file
# Provisions virtual machine compute servers

# Retrieve the latest Ubuntu 22.04 LTS AMI automatically
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical (Ubuntu) owner ID

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Provision the EC2 App Server (t2.micro is 100% Free Tier eligible)
resource "aws_instance" "app" {
  ami                  = data.aws_ami.ubuntu.id
  instance_type        = "t3.micro"
  subnet_id            = var.public_subnet_id
  vpc_security_group_ids = [var.ec2_sg_id]
  
  // Attach IAM Role for passwordless AWS S3 access
  iam_instance_profile = var.ec2_instance_profile
  
  // Attach key pair credentials
  key_name = var.key_pair_name

  // Prepare environment for Ansible playbooks by pre-installing python3
  user_data = <<-EOF
              #!/bin/bash
              apt-get update -y
              apt-get install -y python3 python3-pip git curl
              EOF

  tags = {
    Name        = "clouddrive-${var.environment}-app-server"
    Environment = var.environment
  }
}
