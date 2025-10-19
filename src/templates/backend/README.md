# Backend API Template

A modern backend API template built with Bun, Hono, and Drizzle ORM.

## 🚀 Tech Stack

-   **[Bun](https://bun.sh/)** - Fast all-in-one JavaScript runtime
-   **[Hono](https://hono.dev/)** - Ultrafast web framework
-   **[Drizzle ORM](https://orm.drizzle.team/)** - TypeScript ORM with SQLite

## 📦 Features

-   ⚡️ Fast development with hot reload
-   🗃️ SQLite database with Drizzle ORM
-   🛣️ RESTful API routes
-   🔧 TypeScript support with path aliases
-   📝 Full CRUD operations
-   🔐 JWT authentication with role-based access
-   🎯 Service layer architecture for clean separation
-   🎨 Clean project structure
-   📊 Database migrations with Drizzle Kit

## 🛠️ Setup

1. Install dependencies:

```bash
bun install
```

2. Create your environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure your settings:

```env
DATABASE_URL=./sqlite.db
PORT=3000
NODE_ENV=development

# JWT Secret for user authentication
# Generate a secure random string for production
JWT_SECRET=your-jwt-secret-key-change-in-production

# Logging (optional - defaults to 'info')
# Options: trace, debug, info, warn, error, fatal
LOG_LEVEL=info
```

3. Push database schema:

```bash
bun run db:push
```

## 🏃 Running the Project

Development mode (with hot reload):

```bash
bun run dev
```

Production mode:

```bash
bun run start
```

## 🔐 Authentication (JWT)

The API uses JWT-based authentication with role-based access control.

-   Only the `admin` role can access protected endpoints
-   Public endpoints are available without authentication

### Quick Start

1. Register an admin user:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@example.com",
    "password": "StrongPassword123",
    "role": "admin"
  }'
```

2. Login and get a token:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "StrongPassword123"
  }'
```

3. Use the token to call protected endpoints:

```bash
TOKEN=eyJhbGciOiJ... # paste token from login response
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/users
```

4. Get current user:

```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/auth/me
```

Environment:

-   Set `JWT_SECRET` in `.env` for production

## 📚 Available Scripts

-   `bun run dev` - Start development server with hot reload
-   `bun run start` - Start production server
-   `bun run db:generate` - Generate migration files
-   `bun run db:migrate` - Run migrations
-   `bun run db:push` - Push schema changes to database
-   `bun run db:studio` - Open Drizzle Studio

## 🔌 API Endpoints

### Base

-   `GET /` - API welcome message and endpoint documentation

### Authentication

-   `POST /api/auth/register` - Register a new user
-   `POST /api/auth/login` - Login user
-   `GET /api/auth/me` - Get current user profile

### Users - Admin Only

-   `GET /api/users` - Get all users
-   `GET /api/users/:id` - Get user by ID
-   `POST /api/users` - Create new user
-   `PUT /api/users/:id` - Update user
-   `DELETE /api/users/:id` - Delete user

### Health Check

-   `GET /health` - Health check endpoint (Public)

## 📁 Project Structure

```
backend/
├── src/
│   ├── db/
│   │   ├── index.ts       # Database connection
│   │   └── schema.ts      # Database schema (users)
│   ├── routes/            # HTTP layer - request/response handling
│   │   ├── users.ts       # User routes
│   │   └── health.ts      # Health check route
│   ├── services/          # Business logic
│   │   └── users.service.ts        # User business logic
│   ├── utils/             # Utility functions
│   │   └── logger.ts      # Centralized logging utility
│   └── index.ts           # Main application
├── drizzle/               # Migration files
├── drizzle.config.ts      # Drizzle configuration
├── tsconfig.json          # TypeScript config with path aliases
├── .env                   # Environment variables
└── package.json
```

## 🏗️ Architecture

The project follows a **layered architecture** with clear separation of concerns:

-   **Routes** (`src/routes/`): HTTP layer - handles requests/responses
-   **Services** (`src/services/`): Business logic & external API integration
-   **Database** (`src/db/`): Data access layer with Drizzle ORM

**Path Aliases:**

-   `@/*` → `./src/*`
-   `@db/*` → `./src/db/*`
-   `@routes/*` → `./src/routes/*`
-   `@services/*` → `./src/services/*`
-   `@utils/*` → `./src/utils/*`

**Logging:**

The application uses a simple, fast logger utility (`@utils/logger`) optimized for Bun:

-   `logger.info()` - General information
-   `logger.success()` - Successful operations (custom level)
-   `logger.warn()` - Warnings
-   `logger.error()` - Errors
-   `logger.debug()` - Debug information

Features:

-   Clean, colored output with timestamps and emojis
-   Configurable log level via `LOG_LEVEL` environment variable
-   Zero dependencies - pure TypeScript
-   Optimized for Bun runtime

## 🧪 Example Usage

### Health Check

Check if the API is running:

```bash
curl http://localhost:3000/health
```

### Users

Create a user:

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

Get all users:

```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/users
```

Update a user:

```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Jane Doe","email":"jane@example.com"}'
```

Delete a user:

```bash
curl -X DELETE http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer $TOKEN"
```

## 📋 Database Schema

The users table includes the following fields:

-   **id**: Primary key (auto-increment)
-   **email**: User email (unique)
-   **name**: User display name
-   **password**: Hashed password
-   **role**: User role (admin, user)
-   **createdAt**: Timestamp when user was created
-   **updatedAt**: Timestamp when user was last updated

## 📝 License

MIT
