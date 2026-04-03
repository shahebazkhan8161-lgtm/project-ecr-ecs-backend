# project-ecr-ecs-backend

Node.js REST API — JWT Auth, Postgres database. AWS ECS Fargate pe deploy hota hai.

## Tech
- Node.js + Express
- JWT Authentication
- PostgreSQL (AWS RDS)
- Docker → AWS ECR → AWS ECS Fargate
- GitHub Actions + OIDC

## API Endpoints

| Method | Endpoint              | Auth | Description       |
|--------|-----------------------|------|-------------------|
| GET    | /health               | No   | Health check      |
| POST   | /api/auth/register    | No   | Register new user |
| POST   | /api/auth/login       | No   | Login → JWT token |
| GET    | /api/users/me         | JWT  | Current user info |
| GET    | /api/users            | JWT  | All users list    |

## Local development

```bash
# .env file banao
cp .env.example .env

# Dependencies install karo
npm install

# Local Postgres chahiye
docker run -d \
  --name postgres \
  -e POSTGRES_DB=ecr_ecs_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine

# Server start karo
npm run dev
# http://localhost:3000
```

## Pipeline flow

```
develop branch push
      │
      ▼
npm test → Docker Build → ECR Push (dev-<sha> tag)
      │
      ▼
Infra repo trigger → TF Init → TF Plan → TF Apply
      │
      ▼
https://shabaz.mytitan.in/api
```

## Branch → Environment mapping

| Branch    | Environment | Approval |
|-----------|-------------|----------|
| develop   | DEV         | Auto     |
| staging   | UAT         | Required |
| main      | PRODUCTION  | Required |

## GitHub Secrets required

```
DEV_IAM_ROLE_ARN    = arn:aws:iam::ACCOUNT:role/ecr-ecs-github-actions-dev
UAT_IAM_ROLE_ARN    = arn:aws:iam::ACCOUNT:role/ecr-ecs-github-actions-uat
PROD_IAM_ROLE_ARN   = arn:aws:iam::ACCOUNT:role/ecr-ecs-github-actions-production
INFRA_DEPLOY_TOKEN  = GitHub PAT (infra repo trigger ke liye)
```

## GitHub Variables required

```
AWS_REGION = ap-south-1
```
