variable "environment" {
  type        = string
  description = "Application deployment environment name"
}

variable "bucket_suffix" {
  type        = string
  description = "Random hex suffix to guarantee S3 bucket global uniqueness"
}
