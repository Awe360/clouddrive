# CloudDrive — SaaS File Management Platform

> A production-grade mini Dropbox/Google Drive built on AWS — designed to teach you the most-used AWS services through a real, hands-on project.

[![AWS](https://img.shields.io/badge/AWS-Free_Tier-orange?logo=amazon-aws)](https://aws.amazon.com/free/)
[![Terraform](https://img.shields.io/badge/IaC-Terraform-purple?logo=terraform)](https://www.terraform.io/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_20-green?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/Frontend-React_18-blue?logo=react)](https://react.dev/)

---

## Architecture

```
                    Internet
                        │
              ┌─────────▼──────────┐
              │  EC2 t2.micro       │  ← Public Subnet (10.0.1.0/24)
              │  Ubuntu 22.04       │
              │  Nginx → Node.js   │
              └─────────┬──────────┘
                        │  (VPC internal)
              ┌─────────▼──────────┐       ┌──────────────────┐
              │  RDS db.t3.micro   │       │  S3 Bucket       │
              │  MySQL 8.0         │       │  clouddrive-files │
              │  Private Subnet    │       │  (via IAM Role)  │
              └────────────────────┘       └──────────────────┘
```

## AWS Services Covered

| Service | Usage |
|---------|-------|
| **IAM** | EC2 Role for S3 access — no hardcoded keys |
| **VPC** | Custom network with public/private subnets |
| **Security Groups** | Firewall rules for EC2, RDS, ALB |
| **EC2** | Ubuntu server running Node.js API + Nginx |
| **S3** | File storage with versioning, encryption, lifecycle |
| **RDS** | MySQL database in private subnet |
| **ALB** | Load balancer (optional, `create_alb = false` default) |
| **Terraform** | All infrastructure as code |
| **Ansible** | Automated EC2 server configuration |

---

## Project Structure

```
full-app/
├── backend/          # Node.js Express API
├── frontend/         # React + TypeScript (Vite)
└── infrastructure/
    ├── terraform/    # AWS Infrastructure as Code
    └── ansible/      # EC2 Configuration Automation
```

---

## Prerequisites

- AWS Account (free tier)
- AWS CLI configured: `aws configure`
- Terraform >= 1.6: [install](https://developer.hashicorp.com/terraform/install)
- Ansible >= 2.12: `pip install ansible`
- Node.js 20+: [install](https://nodejs.org/)
- An SSH key pair for EC2 access

---

## Getting Started

### Step 1 — AWS CLI Setup

```bash
# Configure your developer IAM user
aws configure
# AWS Access Key ID: (from IAM Console)
# AWS Secret Access Key: (from IAM Console)
# Default region: us-east-1
# Default output: json

# Verify
aws sts get-caller-identity
```

### Step 2 — Provision Infrastructure (Terraform)

```bash
cd infrastructure/terraform

# Initialize (downloads AWS provider)
terraform init

# Review what will be created
terraform plan \
  -var="db_username=admin" \
  -var="db_password=YourSecurePassword123!" \
  -var="key_pair_name=clouddrive"

# Apply (creates ~15 AWS resources)
terraform apply \
  -var="db_username=admin" \
  -var="db_password=YourSecurePassword123!" \
  -var="key_pair_name=clouddrive"

# Save the outputs
terraform output
# ec2_public_ip    = "x.x.x.x"
# rds_endpoint     = "clouddrive-mysql.xxx.us-east-1.rds.amazonaws.com"
# s3_bucket_name   = "clouddrive-files-dev-xxxx"
```

### Step 3 — Configure EC2 (Ansible)

```bash
cd infrastructure/ansible

# Update inventory.ini with your EC2 IP from Step 2
# ansible_host=<EC2_PUBLIC_IP>

# Run all roles (installs Node.js, Nginx, PM2, deploys app)
ansible-playbook -i inventory.ini site.yml
```

### Step 4 — Initialize the Database

```bash
# SSH into EC2
ssh -i ~/.ssh/clouddrive.pem ubuntu@<EC2_PUBLIC_IP>

# Connect to RDS (from inside EC2)
mysql -h <RDS_ENDPOINT> -u admin -p clouddrive < /var/www/clouddrive/backend/database/schema.sql
```

### Step 5 — Configure Environment

```bash
# On EC2
cp /var/www/clouddrive/backend/.env.example /var/www/clouddrive/backend/.env
nano /var/www/clouddrive/backend/.env
# Fill in DB_HOST (RDS endpoint), JWT_SECRET, S3_BUCKET_NAME
# No AWS keys needed — IAM Role handles it!

# Restart app
pm2 restart clouddrive-api
```

### Step 6 — Access the App

```
http://<EC2_PUBLIC_IP>        → React frontend
http://<EC2_PUBLIC_IP>/api/health → API health check
```

---

## Local Development

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env: set DB_HOST=localhost, add your local MySQL creds
# For S3: configure ~/.aws/credentials with developer IAM user
npm run dev
# API running at http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:3000
npm run dev
# UI running at http://localhost:5173
```

---

## API Endpoints

### Auth (`/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Create account | No |
| POST | `/auth/login` | Login, get JWT | No |
| GET | `/auth/me` | Get current user | Yes |

### Files (`/files`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/files/upload` | Upload file to S3 | Yes |
| GET | `/files` | List your files | Yes |
| GET | `/files/stats` | Total count + size | Yes |
| GET | `/files/:id/download` | Get presigned download URL | Yes |
| DELETE | `/files/:id` | Delete from S3 + DB | Yes |

### Users (`/users`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/profile` | Get profile | Yes |
| PATCH | `/users/profile` | Update name/email | Yes |

---

## S3 Key Concepts

### Why Presigned URLs?

```
Your S3 bucket is 100% PRIVATE. Users never get direct S3 access.

Download flow:
  User → GET /files/:id/download
  Node.js API → generates presigned URL (15 min expiry)
  User → downloads directly from S3 using the signed URL
  S3 validates the signature → serves the file
  URL expires → access revoked
```

### Why No AWS Keys on EC2?

```bash
# ❌ BAD - hardcoded credentials (security risk)
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="..."

# ✅ GOOD - EC2 Instance Role
EC2 → IAM Instance Profile → IAM Role → Policy → S3 Access
# AWS SDK reads credentials automatically from IMDS
# No keys stored anywhere — zero secret exposure
```

---

## Free Tier Cost Estimate

| Service | Free Tier | After Free Tier |
|---------|-----------|-----------------|
| EC2 t2.micro | 750 hrs/month (12 months) | ~$8.50/month |
| RDS db.t3.micro | 750 hrs/month (12 months) | ~$13/month |
| S3 | 5GB storage, 20K GET, 2K PUT | ~$0.023/GB |
| ALB | Not free | ~$16/month (disabled by default) |
| Data Transfer | 1GB/month free | $0.09/GB |

> ⚠️ **Remember to run `terraform destroy` when not using it to avoid charges!**

---

## Teardown (Avoid Charges)

```bash
cd infrastructure/terraform
terraform destroy \
  -var="db_username=admin" \
  -var="db_password=YourSecurePassword123!" \
  -var="key_pair_name=clouddrive"
```

---

## AWS Concepts Mastered

- [x] **IAM** — Roles, policies, instance profiles, least-privilege
- [x] **VPC** — Custom networks, subnets, internet gateway, route tables
- [x] **Security Groups** — Stateful firewalls, least-privilege networking
- [x] **EC2** — Virtual servers, AMIs, user data, instance profiles
- [x] **S3** — Object storage, versioning, encryption, lifecycle, presigned URLs
- [x] **RDS** — Managed MySQL, private networking, SSL, automated backups
- [x] **ALB** — Load balancing, target groups, health checks
- [x] **Terraform** — IaC, modules, state, providers, outputs
- [x] **Ansible** — Idempotent configuration management, roles, playbooks
