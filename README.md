# 🔐 Express Authentication API

A **production-ready**, stateless authentication system built with Express.js and TypeScript.

## ✨ Features

- **JWT Authentication** — Short-lived Access Tokens (15 min) + Long-lived Refresh Tokens (7 days)
- **Secure Cookies** — Refresh Tokens stored in `httpOnly`, `secure`, `sameSite` cookies
- **Password Hashing** — bcrypt with salt rounds
- **Role-Based Access Control (RBAC)** — Admin-only routes with middleware
- **Swagger API Docs** — Interactive testing UI at `/api-docs`
- **Token Revocation** — Database-backed logout (instant invalidation)

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Express.js** | Web Framework |
| **TypeScript** | Type Safety |
| **PostgreSQL** | Database |
| **Prisma** | ORM (Schema, Migrations, Queries) |
| **JWT** | Token-based Authentication |
| **bcryptjs** | Password Hashing |
| **Swagger** | API Documentation & Testing UI |
| **Helmet** | Security Headers |
| **Morgan** | Request Logging |

## 📁 Project Structure

```
src/
├── config/
│   └── swagger.ts          # Swagger/OpenAPI configuration
├── controllers/
│   └── authController.ts   # Register, Login, Refresh, Logout logic
├── lib/
│   └── prisma.ts           # Prisma Client instance
├── middleware/
│   ├── authMiddleware.ts   # JWT verification (protects routes)
│   ├── roleMiddleware.ts   # Admin role check
│   └── errorHandler.ts     # Global error handler
├── routes/
│   └── authRoutes.ts       # API route definitions
├── utils/
│   └── jwt.ts              # Token generation & verification helpers
└── index.ts                # App entry point
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

# 6. Start development server
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

## 📡 API Endpoints

### Public Routes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and receive tokens |
| `POST` | `/auth/refresh` | Get new Access Token (uses cookie) |
| `POST` | `/auth/logout` | Revoke Refresh Token |

### Protected Routes (Requires `Authorization: Bearer <token>`)

| Method | Endpoint | Description | Role |
| :--- | :--- | :--- | :--- |
| `GET` | `/auth/me` | Get current user profile | Any |
| `GET` | `/auth/admin` | Admin dashboard | Admin only |

## 📖 API Documentation

Once the server is running, visit:

```
http://localhost:3002/api-docs
```

This opens an interactive **Swagger UI** where you can test all endpoints directly from your browser.

## 🔒 Security Features

- **Access Tokens**: Short-lived (15 min), sent in JSON response body
- **Refresh Tokens**: Long-lived (7 days), stored in HTTP-Only cookies (immune to XSS)
- **SameSite Cookies**: Protection against CSRF attacks
- **Helmet**: Sets secure HTTP headers automatically
- **Password Hashing**: bcrypt with configurable salt rounds
- **Token Revocation**: Database-backed, enabling instant logout

## 📝 License

MIT
