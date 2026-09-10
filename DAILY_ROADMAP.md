# Day-by-Day Implementation Roadmap

A structured **40-Day Master Plan** to take your URL shortener from a blank folder to an enterprise-grade, distributed production system on AWS.

> **How to use this plan:**
> - Each day is designed for **1.5 – 2 hours** of focused work.
> - Every day has a clear checklist `- [ ]` and a **"Definition of Done"** so you always know when to stop and celebrate progress.
> - Check off the boxes as you complete each task.

---

## 📅 Roadmap Overview

```
Week 1 (Days 01–07)  →  Monorepo Foundation & Core Shortener (V1 & V2)
Week 2 (Days 08–14)  →  Authentication, Authorization & Security (V3)
Week 3 (Days 15–21)  →  Performance, Redis Caching & Rate Limiting (V4)
Week 4 (Days 22–28)  →  Docker, Multi-Container Orchestration & Scale (V5)
Week 5 (Days 29–35)  →  AWS Cloud Deployment & Automated CI/CD (V6)
Week 6 (Days 36–40)  →  Distributed Queues, Background Workers & Hardening (V7 & V8)
```

---

## Week 1: Monorepo Setup & Core URL Shortener (V1 & V2)

### Day 01: Turborepo Foundation
- [ ] Install `pnpm` globally (`npm install -g pnpm`).
- [ ] Initialize root `package.json`, `pnpm-workspace.yaml`, and `turbo.json`.
- [ ] Configure root `.gitignore` (ignore `node_modules`, `dist`, `.turbo`, `.env*`).
- [ ] Scaffold folders: `apps/api`, `apps/web`, `packages/shared`, and `packages/typescript-config`.
- [ ] **Definition of Done:** Running `pnpm install` succeeds with zero errors across the monorepo.

### Day 02: Shared Package & Type Contracts
- [ ] Configure `packages/typescript-config` with a base `tsconfig.json`.
- [ ] Set up `packages/shared` with `zod` for validation schemas.
- [ ] Define the `createUrlSchema` (validates original URL format, optional custom slug).
- [ ] Define shared TypeScript interfaces (`UrlMapping`, `CreateUrlResponse`, `ApiError`).
- [ ] Export schemas and types from `packages/shared/src/index.ts`.
- [ ] **Definition of Done:** `pnpm --filter @urlshortner/shared build` compiles without errors.

### Day 03: API Setup & Database Schema (PostgreSQL)
- [ ] Initialize `apps/api` with Node.js, TypeScript, and Express (or Fastify).
- [ ] Set up local PostgreSQL (via local install or Docker).
- [ ] Install and configure Prisma or Drizzle ORM in the API.
- [ ] Create initial `urls` table schema:
  - `id` (UUID / BigInt)
  - `original_url` (Text)
  - `short_code` (Unique, indexed)
  - `clicks` (Integer, default 0)
  - `created_at` (Timestamp)
- [ ] Run the initial database migration.
- [ ] **Definition of Done:** Database table exists and the API connects to Postgres successfully on boot.

### Day 04: URL Shortening Algorithm & `POST /api/shorten`
- [ ] Implement the short-code generator (Base62 encoding or nanoid collision-handled).
- [ ] Link `@urlshortner/shared` to `apps/api` via `workspace:*`.
- [ ] Build the `POST /api/shorten` route:
  - Validate incoming body using Zod schema from `@urlshortner/shared`.
  - Handle custom slug requests (check uniqueness).
  - Store mapping in PostgreSQL.
  - Return short URL response.
- [ ] **Definition of Done:** Calling `POST /api/shorten` with Postman/cURL creates a database record and returns `{ shortUrl: "..." }`.

### Day 05: Redirection Logic & Click Tracking (`GET /:code`)
- [ ] Implement the `GET /:code` redirection route.
- [ ] Query Postgres for the `short_code`:
  - If found: Increment `clicks` counter and issue an HTTP `302 Found` redirect.
  - If not found: Return a custom 404 response.
- [ ] Implement a `GET /api/urls/:code/stats` endpoint returning click counts.
- [ ] Add global error-handling middleware.
- [ ] **Definition of Done:** Entering `http://localhost:4000/xyz` in a browser successfully redirects to Google/destination and increments the click count in Postgres.

### Day 06: React Frontend UI (`apps/web`)
- [ ] Initialize `apps/web` with Vite + React + TypeScript.
- [ ] Link `@urlshortner/shared` into `apps/web`.
- [ ] Build the UI components:
  - Clean hero section with title and description.
  - URL input bar with real-time validation (using Zod from shared package).
  - "Shorten" action button with loading state.
  - Result card displaying the shortened link.
  - "Copy to Clipboard" one-click button with feedback ("Copied!").
- [ ] **Definition of Done:** Frontend renders cleanly at `http://localhost:5173`.

### Day 07: Full-Stack Integration & Milestone Review
- [ ] Connect React frontend to the backend API (`fetch` / `axios` / `tanstack-query`).
- [ ] Handle error states (invalid URL, slug already taken) and display friendly alerts.
- [ ] Add recent shortened links list in local storage or session state.
- [ ] Test `pnpm dev` from the root: verify API and Web launch together.
- [ ] Commit progress to Git: `feat: v1-v2 complete working full-stack url shortener`.
- [ ] **Definition of Done:** You can paste a link in the UI, receive a short link, click it, and get redirected!

---

## Week 2: Authentication, Authorization & Security (V3)

### Day 08: User Model & Database Migration
- [ ] Update DB schema with `users` table (`id`, `email`, `password_hash`, `created_at`).
- [ ] Add relation: A `User` has many `Urls` (`user_id` foreign key on `urls` table, nullable for anonymous links).
- [ ] Add Zod schemas in `packages/shared`: `registerSchema`, `loginSchema`.
- [ ] Run migration.
- [ ] **Definition of Done:** Postgres migration applied with user foreign keys.

### Day 09: Registration & Password Hashing
- [ ] Install `bcrypt` or `argon2` in `apps/api`.
- [ ] Implement `POST /api/auth/register`:
  - Check if email already exists.
  - Hash password securely.
  - Save user to database.
- [ ] Write integration test or test with Postman.
- [ ] **Definition of Done:** New users can register and passwords are saved as secure hashes (never plain text).

### Day 10: Login, JWT & Secure Cookies
- [ ] Implement `POST /api/auth/login`:
  - Verify credentials.
  - Generate JWT access token & refresh token.
  - Set token in an `httpOnly`, `secure`, `sameSite` cookie.
- [ ] Implement `POST /api/auth/logout` (clears cookie).
- [ ] Implement `GET /api/auth/me` to get current session.
- [ ] **Definition of Done:** User login sets an `httpOnly` cookie and `/me` returns user profile.

### Day 11: Auth Middleware & User Ownership
- [ ] Build `requireAuth` and `optionalAuth` Express middlewares.
- [ ] Update `POST /api/shorten`: If user is logged in, attach their `user_id`.
- [ ] Create `GET /api/user/urls`: Returns all URLs created by the authenticated user with individual click counts.
- [ ] Implement `DELETE /api/urls/:id`: Allow users to delete their own URLs (enforce authorization).
- [ ] **Definition of Done:** Authenticated users see only their URLs; non-owners get `403 Forbidden` if attempting deletion.

### Day 12: Frontend Auth Integration
- [ ] Build React Auth Context / Zustand store to manage login state.
- [ ] Create Login & Register modal / pages with input validation.
- [ ] Build "My Links" dashboard view displaying user's links and total clicks.
- [ ] Add ability to delete a link from the dashboard.
- [ ] **Definition of Done:** Full auth lifecycle (Signup → Login → Create Link → View in Dashboard → Logout) works in the browser.

### Day 13: Security Hardening (OWASP Top 10 Basics)
- [ ] Add `helmet` to `apps/api` for secure HTTP headers.
- [ ] Configure strict `cors` policy (only allow frontend origin).
- [ ] Protect against open-redirect vulnerabilities (validate destination protocol: reject `javascript:`, `file:`, etc.).
- [ ] Add basic rate limiting on `/api/auth/*` using `express-rate-limit` to prevent brute force.
- [ ] **Definition of Done:** Automated checks verify malicious protocols and origin tampering are blocked.

### Day 14: Week 2 Review & Code Cleanup
- [ ] Audit error messages (ensure no database stack traces leak to the client).
- [ ] Run `pnpm lint` and fix all TypeScript/ESLint warnings.
- [ ] Commit progress: `feat: v3 authentication and security complete`.
- [ ] **Definition of Done:** V3 fully functional with safe user isolation and security headers.

---

## Week 3: Performance, Redis Caching & Rate Limiting (V4)

### Day 15: Redis Setup & Connection Layer
- [ ] Install Redis (locally or via Docker: `docker run -p 6379:6379 redis:alpine`).
- [ ] Add `ioredis` dependency to `apps/api`.
- [ ] Build a robust Redis client module with automatic reconnect and error logging.
- [ ] **Definition of Done:** API connects to Redis on startup and logs `Redis connected`.

### Day 16: Cache-Aside Pattern for Redirections
- [ ] Implement cache-aside in `GET /:code`:
  1. Check Redis: `GET url:{code}`.
  2. If Cache HIT: Immediately redirect (skip Postgres entirely!).
  3. If Cache MISS: Query Postgres, set Redis key with TTL (e.g., 24 hours), then redirect.
- [ ] Measure response latency: Compare DB query time vs Redis cache hit time.
- [ ] **Definition of Done:** Second visit to any short URL returns from Redis cache in under 2ms.

### Day 17: Cache Invalidation Strategy
- [ ] Handle link updates and deletions: When a user deletes a link, call `redis.del(`url:${code}`)`.
- [ ] Handle custom slug changes or expiration.
- [ ] Set sensible TTL policies so stale data does not linger.
- [ ] **Definition of Done:** Deleting a link in the UI instantly purges it from Redis cache so subsequent visits return 404.

### Day 18: Distributed Rate Limiting with Redis
- [ ] Implement sliding-window rate limiting using Redis sorted sets (`ZADD`, `ZRANGEBYSCORE`).
- [ ] Create rate-limiting middleware:
  - Anonymous users: 10 shorten requests per minute.
  - Authenticated users: 60 shorten requests per minute.
- [ ] Return standard HTTP headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`.
- [ ] **Definition of Done:** Exceeding request limits returns `429 Too Many Requests` with correct `Retry-After` header.

### Day 19: Load Testing & Benchmarking
- [ ] Install `autocannon` or `k6`.
- [ ] Write a benchmark script testing 1,000 concurrent requests on `GET /:code`.
- [ ] Compare requests-per-second (RPS) with Redis enabled vs disabled.
- [ ] **Definition of Done:** Document benchmark results in `BENCHMARKS.md` showing 5x–10x throughput improvement with Redis.

### Day 20: Redis Connection Pooling & Error Resilience
- [ ] Implement graceful fallback: If Redis goes down, API must fall back to Postgres without crashing.
- [ ] Test killing the Redis container while running traffic.
- [ ] Verify logs indicate fallback mode and restore when Redis restarts.
- [ ] **Definition of Done:** Killing Redis does not take down the API.

### Day 21: Week 3 Review & Milestone Git Tag
- [ ] Clean up Redis keyspace naming (`urlshortner:urls:...`, `urlshortner:ratelimit:...`).
- [ ] Commit and tag: `git tag v4-performance`.
- [ ] **Definition of Done:** Sub-millisecond redirects and bulletproof rate limiting.

---

## Week 4: Docker, Multi-Container Orchestration & Scale (V5)

### Day 22: Turborepo Dockerization (`turbo prune`)
- [ ] Learn how `pnpm turbo prune @urlshortner/api --docker` isolates app code.
- [ ] Create multi-stage `apps/api/Dockerfile`:
  - Stage 1: Pruner (extracts needed packages).
  - Stage 2: Builder (installs deps and runs `turbo build`).
  - Stage 3: Runner (lightweight Node.js alpine image running only production artifacts).
- [ ] Build the API Docker image and test running it standalone.
- [ ] **Definition of Done:** Docker image builds in < 2 minutes and runs `apps/api` cleanly.

### Day 23: Frontend Dockerization (Nginx Alpine)
- [ ] Create multi-stage `apps/web/Dockerfile`:
  - Stage 1: Build Vite production bundle (`dist/`).
  - Stage 2: Nginx unprivileged alpine container serving static files with gzip/brotli.
- [ ] Configure `nginx.conf` to handle client-side React routing (`try_files $uri /index.html;`).
- [ ] **Definition of Done:** `apps/web` Docker container serves the frontend on port 80/8080.

### Day 24: Docker Compose Orchestration
- [ ] Create root `docker-compose.yml` defining all 4 services:
  1. `postgres` (with named volume for persistence).
  2. `redis` (with named volume).
  3. `api` (depends on postgres & redis health checks).
  4. `web` (depends on api).
- [ ] Add `.env.docker` for container-to-container networking.
- [ ] **Definition of Done:** Running `docker compose up --build` brings up the entire full-stack app on a clean machine.

### Day 25: Nginx Reverse Proxy & Load Balancer
- [ ] Add an `nginx-proxy` service to `docker-compose.yml`.
- [ ] Route traffic:
  - `/api/*` → forwards to `api` container.
  - `/*` (short codes & assets) → routes to appropriate service.
- [ ] Add upstream block in Nginx preparing for multiple API instances.
- [ ] **Definition of Done:** Accessing `http://localhost` routes seamlessly through the single Nginx gateway.

### Day 26: Scaling API Replicas
- [ ] Scale the API service: `docker compose up --scale api=3`.
- [ ] Configure round-robin load balancing in Nginx.
- [ ] Add container hostname/ID header in API responses to visually verify request balancing across containers.
- [ ] **Definition of Done:** Refreshing requests distributes hits across all 3 running API container replicas.

### Day 27: Container Health Checks & Graceful Shutdown
- [ ] Add `/health` endpoint to `apps/api` (checks DB ping & Redis ping).
- [ ] Add `HEALTHCHECK` directives in Dockerfiles and `docker-compose.yml`.
- [ ] Handle `SIGTERM` and `SIGINT` signals in Node.js to close open DB pools cleanly without dropping active connections.
- [ ] **Definition of Done:** Running `docker compose down` gracefully terminates processes with zero dropped connections.

### Day 28: Week 4 Review & Scale Validation
- [ ] Run load test against the Dockerized stack.
- [ ] Commit progress: `feat: v5 complete containerized micro-architecture`.
- [ ] **Definition of Done:** Complete application boots, scales, and shuts down via Docker Compose.

---

## Week 5: Production Deployment & CI/CD with GitHub Actions (V6)

### Day 29: GitHub Actions CI Pipeline
- [ ] Create `.github/workflows/ci.yml`.
- [ ] Set up pipeline steps:
  - Checkout repository.
  - Setup pnpm & Node.js with caching.
  - Run `pnpm install --frozen-lockfile`.
  - Run `pnpm lint`.
  - Run `pnpm turbo test`.
  - Run `pnpm turbo build`.
- [ ] Test on a pull request.
- [ ] **Definition of Done:** CI triggers automatically on push and all checks pass green.

### Day 30: Automated Docker Image Build & Push
- [ ] Set up Docker Hub or AWS ECR (Elastic Container Registry) repository.
- [ ] Store credentials in GitHub Actions Secrets (`DOCKER_USERNAME`, `DOCKER_PASSWORD`).
- [ ] Create `.github/workflows/docker-publish.yml`:
  - Builds API and Web Docker images on merge to `main`.
  - Tags with Git SHA and `latest`.
  - Pushes images to the registry.
- [ ] **Definition of Done:** Pushing to `main` automatically pushes fresh, versioned Docker images to your registry.

### Day 31: AWS Cloud Setup (Infrastructure)
- [ ] Create an AWS account (free tier eligible).
- [ ] Create an IAM user with least-privilege deployment permissions.
- [ ] Provision AWS resources:
  - **EC2 instance** (Ubuntu LTS) or **ECS (Elastic Container Service)**.
  - **RDS PostgreSQL** database instance (or Docker Postgres on EC2 for cost savings).
- [ ] Configure Security Groups (allow ports 80, 443, 22).
- [ ] **Definition of Done:** Can SSH into EC2 instance and connect to database.

### Day 32: Domain, Route 53 & SSL/TLS (HTTPS)
- [ ] Point your custom domain (or duckdns/free domain) to EC2 public IP via DNS A Record.
- [ ] Install **Certbot** on the server to obtain a free Let's Encrypt SSL certificate.
- [ ] Configure Nginx for automatic HTTPS redirect (`HTTP 80 → HTTPS 443`) and TLS 1.3 encryption.
- [ ] **Definition of Done:** Visiting `https://yourdomain.com` displays the secure padlock icon in the browser.

### Day 33: Continuous Deployment (CD) with GitHub Actions
- [ ] Set up SSH key in GitHub Secrets for automated deployment.
- [ ] Add `deploy` job to `.github/workflows/deploy.yml`:
  - SSH into EC2.
  - Pull latest Docker images from registry.
  - Run database migrations (`pnpm prisma migrate deploy`).
  - Reload containers with zero downtime (`docker compose up -d`).
- [ ] **Definition of Done:** Pushing a commit to `main` automatically deploys the live changes to your domain within 3 minutes.

### Day 34: Secrets & Environment Management
- [ ] Remove all `.env` files from Git tracking.
- [ ] Set up production secrets injection on the server (via Docker environment variables or AWS SSM Parameter Store).
- [ ] Ensure database credentials and JWT secrets are rotated and securely isolated.
- [ ] **Definition of Done:** Zero secrets present in GitHub repository history or build logs.

### Day 35: Live Production Demo & Smoke Test
- [ ] Perform complete live production test:
  - Create an account on your live domain.
  - Generate a shortened link.
  - Test redirection over mobile data / external network.
  - Inspect HTTPS headers.
- [ ] **Definition of Done:** Live URL Shortener is operating in production on AWS!

---

## Week 6: Distributed Queues, Workers & Production Hardening (V7 & V8)

### Day 36: Scaffold `apps/worker` & BullMQ
- [ ] Create new workspace app: `apps/worker`.
- [ ] Add `bullmq` and link `@urlshortner/shared`.
- [ ] Set up Redis connection for BullMQ queue.
- [ ] Define queue name: `analytics-queue`.
- [ ] **Definition of Done:** Worker process boots, connects to Redis, and waits for incoming jobs.

### Day 37: Asynchronous Click Analytics Processing
- [ ] Refactor `GET /:code` redirection:
  - Instead of writing to Postgres synchronously, publish a job to `analytics-queue` (`{ code, ip, userAgent, timestamp }`).
  - Instantly return the redirect response to the user.
- [ ] In `apps/worker`:
  - Consume jobs from `analytics-queue`.
  - Batch insert analytics records into Postgres every 5 seconds (bulk insert).
- [ ] **Definition of Done:** Redirection speed drops to sub-1ms because DB write happens completely in the background.

### Day 38: Dead-Letter Queues (DLQ) & Retry Policies
- [ ] Configure retry attempts (3 retries with exponential backoff) for failed worker jobs.
- [ ] Create Dead-Letter Queue (DLQ) for permanently failed jobs.
- [ ] Build a simple worker error monitoring handler.
- [ ] **Definition of Done:** Simulated DB failure retries 3 times before moving payload safely to DLQ without data loss.

### Day 39: Observability & Structured Logging
- [ ] Replace `console.log` with `pino` structured JSON logger in `apps/api` and `apps/worker`.
- [ ] Include `correlationId` (request ID) across all logs for tracing requests through the system.
- [ ] Set up basic metrics endpoint (`/metrics`) using `prom-client` (tracks request count, latency percentiles p95/p99, error rates).
- [ ] **Definition of Done:** Logs output clean JSON objects with timestamps, log levels, and request IDs.

### Day 40: Automated Backups, Disaster Recovery & Grand Finale!
- [ ] Write an automated bash script to dump PostgreSQL (`pg_dump`) and upload encrypted backup to AWS S3.
- [ ] Schedule backup via cron job (runs daily at 2:00 AM).
- [ ] Document disaster recovery runbook: Steps to restore database from S3 snapshot on a fresh server.
- [ ] Review entire architecture against [goal.md](file:///Users/mohitkumar/Desktop/urlshortner/goal.md).
- [ ] **Definition of Done:** All 8 versions complete. You have taken a project from a single idea to a production-grade, distributed web system! 🚀
