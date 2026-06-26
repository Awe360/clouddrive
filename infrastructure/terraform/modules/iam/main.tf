# IAM Module main file
# Manages access credentials for the EC2 server using role assignments (no hardcoded keys!)

# 1. IAM Role to be assumed by the EC2 instance service
resource "aws_iam_role" "ec2_role" {
  name = "clouddrive-${var.environment}-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })

  tags = {
    Name        = "clouddrive-${var.environment}-ec2-role"
    Environment = var.environment
  }
}

# 2. IAM Policy allowing secure S3 access (restricted to the application bucket)
resource "aws_iam_role_policy" "s3_policy" {
  name = "clouddrive-${var.environment}-s3-policy"
  role = aws_iam_role.ec2_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      // Permission to upload, read, and delete user file objects
      {
        Effect   = "Allow"
        Action   = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ]
        Resource = "${var.s3_bucket_arn}/users/*"
      },
      // Permission to list bucket folders/keys
      {
        Effect   = "Allow"
        Action   = [
          "s3:ListBucket"
        ]
        Resource = var.s3_bucket_arn
      }
    ]
  })
}

# 3. Instance Profile to bridge the IAM role onto EC2 instances
resource "aws_iam_instance_profile" "ec2_profile" {
  name = "clouddrive-${var.environment}-ec2-profile"
  role = aws_iam_role.ec2_role.name
}
