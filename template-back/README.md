# NestJS + Prisma + Swagger + Postgres (Docker)

A minimal backend starter with:
- NestJS (v10)
- Prisma ORM
- Swagger (OpenAPI) at `/api`
- Postgres (via Docker Compose)

## Quick Start

```bash
# 1) Start Postgres in Docker
docker compose up -d

# 2) Install deps
npm install

# 3) Create .env
cp .env.example .env

# 4) Generate Prisma Client
npm run prisma:generate

# 5) Run dev server (uses local Node, DB is in Docker)
npm run start:dev
```

Then open:  
- API docs (Swagger): http://localhost:3000/api
- Example endpoints: `GET /users`, `POST /users`, etc.

### Database Migrations
During dev:
```bash
npm run prisma:migrate
```

In production (Dockerfile does this at container start):
```bash
npm run build
docker build -t backend .
docker run --env-file .env -p 3000:3000 --network host backend
```

### Seed data
```bash
npm run seed
```

## Project Structure
- `src/prisma` — Prisma module/service for DB access
- `src/users` — Example CRUD resource using Prisma
- `prisma/schema.prisma` — DB schema
- `prisma/seed.ts` — Seed script
- `swagger` — auto-configured in `main.ts` at `/api`
