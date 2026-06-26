# S3 Module main file

# 1. AWS S3 Bucket
resource "aws_s3_bucket" "clouddrive" {
  bucket        = "clouddrive-files-${var.environment}-${var.bucket_suffix}"
  force_destroy = true # Allows clean tear down on terraform destroy

  tags = {
    Name        = "clouddrive-files-${var.environment}-${var.bucket_suffix}"
    Environment = var.environment
  }
}

# 2. Enable object versioning
resource "aws_s3_bucket_versioning" "clouddrive" {
  bucket = aws_s3_bucket.clouddrive.id
  versioning_configuration {
    status = "Enabled"
  }
}

# 3. Server-side encryption at rest (SSE-S3 AES256)
resource "aws_s3_bucket_server_side_encryption_configuration" "clouddrive" {
  bucket = aws_s3_bucket.clouddrive.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# 4. Strict Block Public Access (Ensures private access model only)
resource "aws_s3_bucket_public_access_block" "clouddrive" {
  bucket                  = aws_s3_bucket.clouddrive.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# 5. Lifecycle Policies (Auto-archives older assets and cleans up temporary folders)
resource "aws_s3_bucket_lifecycle_configuration" "clouddrive" {
  bucket = aws_s3_bucket.clouddrive.id

  # Rule A: Move archived files under users/ to GLACIER after 1 year (365 days)
  rule {
    id     = "archive-old-user-files"
    status = "Enabled"

    filter {
      prefix = "users/"
    }

    transition {
      days          = 365
      storage_class = "GLACIER"
    }
  }

  # Rule B: Auto-delete temporary staging files under temp/ after 1 day
  rule {
    id     = "expire-temporary-files"
    status = "Enabled"

    filter {
      prefix = "temp/"
    }

    expiration {
      days = 1
    }
  }
}

# 6. CORS Policy (Allows direct S3 downloads/uploads from Web clients)
resource "aws_s3_bucket_cors_configuration" "clouddrive" {
  bucket = aws_s3_bucket.clouddrive.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "HEAD"]
    allowed_origins = ["*"] # Adjust to your domain in production
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}
