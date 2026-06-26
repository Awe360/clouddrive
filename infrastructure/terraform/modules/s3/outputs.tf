output "bucket_name" {
  value       = aws_s3_bucket.clouddrive.id
  description = "The auto-generated name of the S3 bucket"
}

output "bucket_arn" {
  value       = aws_s3_bucket.clouddrive.arn
  description = "The ARN of the S3 bucket"
}
