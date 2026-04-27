# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

- **herbiqa** (`artifacts/herbiqa`) — Full Ayurvedic ecommerce site. React + Vite + Tailwind + framer-motion + wouter. Pages: `/` landing, `/products`, `/cart` (with checkout), `/sign-in`, `/sign-up`, `/account` (own orders), and admin panel under `/admin/*` (overview, products, orders, payments, users). Calls the API at `/api/*` directly via fetch with credentials. Served at `/`.
- **api-server** (`artifacts/api-server`) — Express 5 + MongoDB (mongoose). Auth (bcryptjs + JWT in HTTP-only cookie), products CRUD, orders + Razorpay (test mode) order creation and signature verification, admin endpoints. On startup it auto-seeds 6 sample products and an admin user (`admin@herbiqa.com` / `Admin@123`). Mounted at `/api`.

## Backend stack notes

- **MongoDB** is used for Herbiqa (mongoose models in `artifacts/api-server/src/models`). The original Drizzle/PostgreSQL setup remains in the repo but is unused for this product.
- **Auth**: cookie name `herbiqa_token`, signed with `SESSION_SECRET`. Middleware in `artifacts/api-server/src/middlewares/auth.ts` (`attachUser` is global, `requireAuth` and `requireAdmin` per-route).
- **Razorpay**: keys read from `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`. Server creates order, frontend opens `checkout.razorpay.com/v1/checkout.js`, success handler POSTs back to `/api/orders/:id/verify` which validates the HMAC signature.
- **Required secrets**: `MONGODB_URI`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `SESSION_SECRET`.
- **MongoDB Atlas**: Network Access must allow `0.0.0.0/0` (or be configured per Replit deployment) — Replit container IPs are not stable.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
