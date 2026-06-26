output "dns_name" {
  value       = aws_lb.alb.dns_name
  description = "The public DNS name of the ALB"
}

output "arn" {
  value       = aws_lb.alb.arn
  description = "The ARN of the ALB"
}
