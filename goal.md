"I want to be able to take a web project from idea → production myself."

I'd aim for this knowledge map:

WEB DEVELOPMENT
│
├── Frontend
│   ├── HTML
│   ├── CSS
│   ├── JavaScript
│   ├── TypeScript
│   ├── React
│   ├── State management
│   ├── Forms
│   ├── Accessibility
│   └── Performance
│
├── Backend
│   ├── Node.js
│   ├── API design
│   ├── REST
│   ├── Validation
│   ├── Error handling
│   ├── Authentication
│   └── Authorization
│
├── Database
│   ├── PostgreSQL
│   ├── SQL
│   ├── Indexes
│   ├── Transactions
│   ├── Query optimization
│   ├── Migrations
│   └── Backups
│
├── Security
│   ├── OWASP
│   ├── XSS
│   ├── CSRF
│   ├── SQL injection
│   ├── SSRF
│   ├── Auth security
│   ├── Secrets
│   └── HTTPS
│
├── Infrastructure
│   ├── Linux
│   ├── Networking
│   ├── DNS
│   ├── Reverse proxy
│   ├── Load balancer
│   └── TLS
│
├── Containers
│   ├── Docker
│   ├── Images
│   ├── Networks
│   ├── Volumes
│   ├── Compose
│   └── Container security
│
├── Cloud
│   ├── AWS
│   ├── IAM
│   ├── VPC
│   ├── EC2
│   ├── ECS
│   ├── RDS
│   ├── S3
│   ├── CloudFront
│   ├── Route 53
│   └── CloudWatch
│
├── DevOps & Automation
│   ├── Git & GitHub
│   ├── GitHub Actions
│   ├── CI/CD pipelines
│   ├── Automated testing & linting (CI)
│   ├── Automated Docker image build & scan
│   ├── Docker registry (Amazon ECR / Docker Hub)
│   ├── Automated deployment to AWS (CD)
│   ├── Automated database migrations
│   ├── Secrets management (GitHub Secrets / AWS Secrets Manager)
│   ├── Zero-downtime deployment (Rolling / Blue-Green)
│   └── Automated rollbacks
│
└── System Design
    ├── Caching
    ├── Queues
    ├── Scaling
    ├── Replication
    ├── Sharding
    ├── CAP
    ├── Consistency
    ├── Availability
    └── Disaster recovery









    I'd structure your actual project as:

V1  → Basic URL shortener
      HTML/CSS/JS + backend + DB

V2  → Modern full-stack application
      React + TypeScript + API

V3  → Real users
      Auth + authorization + security

V4  → Performance
      Redis + caching + rate limiting

V5  → Scale
      Docker + multiple servers + load balancer

V6  → Production & CI/CD Automation
      AWS + HTTPS + DNS + monitoring + GitHub Actions (automated test, build, push & deploy)

V7  → Distributed system
      Queues + workers + replicas + failure handling

V8  → Production hardening
      Security + backups + disaster recovery + observability
