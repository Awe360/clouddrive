# VPC Module main file

# Custom VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "clouddrive-${var.environment}-vpc"
    Environment = var.environment
  }
}

# Internet Gateway for Public Subnet traffic routing
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "clouddrive-${var.environment}-igw"
    Environment = var.environment
  }
}

# Public Subnets (For Nginx Frontend, API endpoints, ALB)
resource "aws_subnet" "public_1" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
  // Map public IPs to resources launched here automatically
  map_public_ip_on_launch = true

  tags = {
    Name        = "clouddrive-${var.environment}-public-1"
    Environment = var.environment
  }
}

resource "aws_subnet" "public_2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-east-1b"
  map_public_ip_on_launch = true

  tags = {
    Name        = "clouddrive-${var.environment}-public-2"
    Environment = var.environment
  }
}

# Private Subnets (Isolated for RDS MySQL Database)
resource "aws_subnet" "private_1" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "us-east-1a"

  tags = {
    Name        = "clouddrive-${var.environment}-private-1"
    Environment = var.environment
  }
}

resource "aws_subnet" "private_2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.4.0/24"
  availability_zone = "us-east-1b"

  tags = {
    Name        = "clouddrive-${var.environment}-private-2"
    Environment = var.environment
  }
}

# Public Route Table mapping to IGW
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name        = "clouddrive-${var.environment}-public-rt"
    Environment = var.environment
  }
}

# Route Table Associations for Public Subnets
resource "aws_route_table_association" "public_1" {
  subnet_id      = aws_subnet.public_1.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_2" {
  subnet_id      = aws_subnet.public_2.id
  route_table_id = aws_route_table.public.id
}

# ==========================================================
# Security Groups (Stateful Firewalls)
# ==========================================================

# 1. Security Group for Application Load Balancer
resource "aws_security_group" "alb" {
  name        = "clouddrive-${var.environment}-alb-sg"
  description = "Allows incoming HTTP/HTTPS traffic to ALB"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "clouddrive-${var.environment}-alb-sg"
    Environment = var.environment
  }
}

# 2. Security Group for EC2 Instance
resource "aws_security_group" "ec2" {
  name        = "clouddrive-${var.environment}-ec2-sg"
  description = "Allows incoming Nginx traffic and administrator SSH access"
  vpc_id      = aws_vpc.main.id

  // HTTP inbound for public access (directly to Nginx proxy)
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  // Node API server direct port (routed from ALB Security Group)
  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  // SSH management inbound
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ssh_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "clouddrive-${var.environment}-ec2-sg"
    Environment = var.environment
  }
}

# 3. Security Group for RDS DB Instance (Least-privilege: Only EC2 can access)
resource "aws_security_group" "rds" {
  name        = "clouddrive-${var.environment}-rds-sg"
  description = "Allows DB connections only from the EC2 instance SG"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "clouddrive-${var.environment}-rds-sg"
    Environment = var.environment
  }
}
