output "endpoint" {
  value       = aws_db_instance.mysql.address
  description = "The address endpoint of the RDS instance (e.g. host)"
}

output "port" {
  value       = aws_db_instance.mysql.port
  description = "The database connection port"
}
