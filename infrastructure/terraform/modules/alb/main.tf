# ALB Module main file

# 1. Application Load Balancer (ELB v2)
resource "aws_lb" "alb" {
  name               = "clouddrive-${var.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.alb_sg_id]
  subnets            = var.public_subnet_ids

  tags = {
    Name        = "clouddrive-${var.environment}-alb"
    Environment = var.environment
  }
}

# 2. Target Group targeting EC2 app servers on port 80 (Nginx proxies port 80 to port 3000)
resource "aws_lb_target_group" "app" {
  name     = "clouddrive-${var.environment}-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  health_check {
    path                = "/api/health"
    protocol            = "HTTP"
    port                = "80"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }

  tags = {
    Name        = "clouddrive-${var.environment}-tg"
    Environment = var.environment
  }
}

# 3. ALB Listener on HTTP port 80
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}

# 4. Bind EC2 Instance target attachment to the Target Group
resource "aws_lb_target_group_attachment" "app" {
  target_group_arn = aws_lb_target_group.app.arn
  target_id        = var.ec2_instance_id
  port             = 80
}
