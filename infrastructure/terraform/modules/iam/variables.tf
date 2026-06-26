variable "environment" {
  type        = string
  description = "Application deployment environment name"
}

variable "s3_bucket_arn" {
  type        = string
  description = "The ARN of the primary S3 files bucket"
}
