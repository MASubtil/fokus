# fokus
Next.js (App Router) + TypeScript + Tailwind + Prisma (SQLite)

## Setup rápido
1) `npm i`
2) `cp .env.example .env`
3) `npx prisma migrate dev --name init`
4) `npm run dev` → http://localhost:3000

## Notas
- DB local: `DATABASE_URL="file:./dev.db"`
- API demo: `GET /api/items`, `POST /api/items { name }`
