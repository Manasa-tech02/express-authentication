# 🔐 Express Authentication API

A **production-ready**, stateless authentication and user management system built with Express.js and TypeScript.

## ✨ Features

- **JWT Authentication** — Short-lived Access Tokens (15 min) + Long-lived Refresh Tokens (7 days)
- **Secure Cookies** — Refresh Tokens stored in `httpOnly`, `secure`, `sameSite` cookies
- **Password Hashing** — bcrypt with configurable salt rounds
- **Role-Based Access Control (RBAC)** — Admin-only routes with middleware
- **Admin User Management** — Full CRUD for users (list, view, update role, delete) with pagination
- **Input Validation & Sanitization** — Zod schemas for all endpoints (email normalization, password rules, name trimming)
- **Rate Limiting** — Global limiter (100 req/15 min) + strict auth limiter (10 req/15 min) to prevent brute-force
- **Centralized Error Handling** — Custom error classes (`AppError`, `BadRequestError`, `UnauthorizedError`, etc.) with a global handler
- **Swagger API Docs** — Interactive testing UI at `/api-docs`
- **Token Revocation** — Database-backed logout (instant invalidation)
- **Database Seeding** — Pre-seed users via `prisma/seed.ts`

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Express.js v5** | Web Framework |
| **TypeScript** | Type Safety |
| **PostgreSQL** | Database |
| **Prisma v7** | ORM (Schema, Migrations, Queries) |
| **JWT** | Token-based Authentication |
| **bcryptjs** | Password Hashing |
| **Zod v4** | Input Validation & Sanitization |
| **express-rate-limit** | Rate Limiting (DDoS / Brute-force protection) |
| **Swagger** | API Documentation & Testing UI |
| **Helmet** | Security Headers |
| **Morgan** | Request Logging |
| **cookie-parser** | Parsing Refresh Token cookies |

## 📁 Project Structure

```
Authentication/
├── prisma/
│   ├── schema.prisma          # Database schema (User, RefreshToken models)
│   ├── seed.ts                # Database seeding script
│   └── migrations/            # Prisma migration history
├── docs/
│   ├── api_requests.http      # Sample HTTP requests for manual testing
│   ├── check_db.ts            # Database connectivity check script
│   └── test_auth.js           # Automated auth flow test script
├── src/
│   ├── config/
│   │   └── swagger.ts             # Swagger/OpenAPI spec configuration
│   ├── controllers/
│   │   ├── authController.ts      # Register, Login, Refresh, Logout logic
│   │   └── adminController.ts     # List Users, Get User, Update Role, Delete User
│   ├── lib/
│   │   └── prisma.ts              # Prisma Client singleton instance
│   ├── middleware/
│   │   ├── authMiddleware.ts      # JWT verification (protects routes)
│   │   ├── roleMiddleware.ts      # Admin role check
│   │   ├── validateRequest.ts     # Zod validation middleware factory
│   │   ├── rateLimiter.ts         # Global + Auth-specific rate limiters
│   │   └── errorHandler.ts        # Global error handler middleware
│   ├── routes/
│   │   ├── authRoutes.ts          # Auth API route definitions
│   │   └── adminRoutes.ts         # Admin API route definitions
│   ├── utils/
│   │   ├── jwt.ts                 # Token generation & verification helpers
│   │   ├── validationSchemas.ts   # Zod schemas (register, login, updateRole)
│   │   └── errors.ts             # Custom error classes (AppError hierarchy)
│   └── index.ts                   # App entry point & middleware setup
├── package.json
├── tsconfig.json
├── eslint.config.mjs
├── .prettierrc
└── .env
```

## 🗄️ Database Schema

```prisma
model User {
  id            Int            @id @default(autoincrement())
  email         String         @unique
  password      String         // Hashed with bcrypt
  name          String?
  role          String         @default("user")  // "user" or "admin"
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  refreshTokens RefreshToken[]
}

model RefreshToken {
  id        Int      @id @default(autoincrement())
  token     String   @unique
  userId    Int
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL running locally
- npm

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/express-authentication.git
cd express-authentication

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env
# Edit .env with your database URL and secrets

# 4. Run database migrations
npx prisma migrate dev

# 5. Generate Prisma Client
npx prisma generate

# 6. (Optional) Seed the database
npx ts-node prisma/seed.ts

# 7. Start development server
npm run dev
```

### Environment Variables

Create a `.env` file with:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/express_auth"
JWT_SECRET="your-access-token-secret"
REFRESH_TOKEN_SECRET="your-refresh-token-secret"
PORT=3002
```

### Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `nodemon src/index.ts` | Start dev server with hot reload |
| `npm run build` | `tsc` | Compile TypeScript to JavaScript |
| `npm start` | `node dist/index.js` | Run the production build |
| `npm run lint` | `eslint src/` | Check for linting issues |
| `npm run lint:fix` | `eslint src/ --fix` | Auto-fix linting issues |
| `npm run format` | `prettier --write src/` | Format code with Prettier |
| `npm run format:check` | `prettier --check src/` | Check code formatting |
| `npm run db:migrate` | `prisma migrate dev` | Run database migrations |
| `npm run studio` | `prisma studio` | Open Prisma Studio GUI |
| `npm run generate` | `prisma generate` | Re-generate Prisma Client |

## 📡 API Endpoints

### Auth Routes (`/auth`)

| Method | Endpoint | Auth | Rate Limited | Validated | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | ❌ | ✅ Strict | ✅ Zod | Register a new user |
| `POST` | `/auth/login` | ❌ | ✅ Strict | ✅ Zod | Login and receive tokens |
| `POST` | `/auth/refresh` | ❌ | — | — | Get new Access Token (uses cookie) |
| `POST` | `/auth/logout` | ❌ | — | — | Revoke Refresh Token |
| `GET` | `/auth/me` | 🔑 Bearer | — | — | Get current user profile |
| `GET` | `/auth/admin` | 🔑 Admin | — | — | Admin dashboard |

### Admin Routes (`/admin`) — Requires Login + Admin Role

| Method | Endpoint | Validated | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/users` | — | List all users (paginated: `?page=1&limit=10`) |
| `GET` | `/admin/users/:id` | — | Get a specific user by ID |
| `PATCH` | `/admin/users/:id/role` | ✅ Zod | Update a user's role (`user` / `admin`) |
| `DELETE` | `/admin/users/:id` | — | Delete a user (cascades to refresh tokens) |

## 📖 API Documentation

Once the server is running, visit:

```
http://localhost:3002/api-docs
```

This opens an interactive **Swagger UI** where you can test all endpoints directly from your browser.

## 🛡️ Input Validation

All validated endpoints use **Zod v4** schemas with automatic sanitization:

| Schema | Fields | Rules |
| :--- | :--- | :--- |
| `registerSchema` | `email`, `password`, `name` | Email → lowercase + trim; Password ≥ 8 chars, 1 uppercase, 1 number; Name 2–50 chars + trim |
| `loginSchema` | `email`, `password` | Email → lowercase + trim; Password required |
| `updateRoleSchema` | `role` | Must be `"user"` or `"admin"` |

Invalid requests return a structured `400` response with per-field error messages.

## 🔒 Security Features

- **Access Tokens**: Short-lived (15 min), sent in JSON response body
- **Refresh Tokens**: Long-lived (7 days), stored in HTTP-Only cookies (immune to XSS)
- **SameSite Cookies**: `strict` mode — protection against CSRF attacks
- **Helmet**: Sets secure HTTP headers automatically
- **Password Hashing**: bcrypt with 10 salt rounds
- **Token Revocation**: Database-backed, enabling instant logout
- **Rate Limiting**: Two tiers — global (100/15min) and auth-specific (10/15min) per IP
- **Cascade Deletes**: Deleting a user automatically removes all their refresh tokens

## ⚠️ Error Handling

All errors flow through a centralized `errorHandler` middleware. Controllers throw typed errors that map to HTTP status codes:

| Error Class | Status Code |
| :--- | :--- |
| `BadRequestError` | `400` |
| `UnauthorizedError` | `401` |
| `ForbiddenError` | `403` |
| `NotFoundError` | `404` |
| `ConflictError` | `409` |
| `TooManyRequestsError` | `429` |
| `InternalServerError` | `500` |

## 📝 License

MIT
