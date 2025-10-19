# create-mahdi-app [![npm version](https://img.shields.io/npm/v/create-mahdi-app.svg)](https://www.npmjs.com/package/create-mahdi-app)

A CLI tool to create full-stack projects with Mahdi's preferred tech stack.

## About

This is a create app tool for creating Mahdi's flavor stack applications in both frontend and backend. I was tired of setting up my preferred tech stack again and again, so I gathered everything into a single CLI command. Now you can bootstrap your entire project with all the tools and configurations I use in just one line of code.

## Requirements

Before using this CLI tool, make sure you have one of the following installed:

-   **Bun** (recommended): Install from [bun.sh](https://bun.sh)
-   **Node.js**: Version 18 or higher

## Installation

For npm:

```bash
npx create-mahdi-app
```

Or using Bun:

```bash
bunx create-mahdi-app
```

The CLI will guide you through the setup process with interactive prompts.

## Quick Start

### Create a Frontend Project

```bash
npx create-mahdi-app my-frontend
# Select "Frontend - Next.js" from the menu
cd my-frontend
bun dev
```

### Create a Backend Project

```bash
npx create-mahdi-app my-backend
# Select "Backend - Hono + Drizzle" from the menu
cd my-backend
cp .env.example .env  # Configure your environment
bun run db:push       # Set up the database
bun run dev           # Start the development server
```

### Create a Monorepo

```bash
npx create-mahdi-app my-monorepo
# Select "Monorepo" from the menu
cd my-monorepo
bun install           # Install all dependencies
bun dev               # Start development servers
```

## Templates

Currently available templates:

### 🎨 Frontend Template

> **Modern Next.js application with my preferred tech stack**

| Technology            | Purpose                                     |
| --------------------- | ------------------------------------------- |
| **Next.js 15**        | Latest React features with App Router       |
| **Material-UI (MUI)** | Beautiful, accessible UI components         |
| **TypeScript**        | Type safety and better developer experience |
| **Bun**               | Fast runtime and package manager            |
| **Pre-configured**    | All necessary dependencies and setup        |

**✨ What you get:**

-   🚀 Clean, production-ready foundation
-   ⚡ Zero configuration required
-   🎯 Ready to start building immediately
-   🔧 All build systems and routing pre-configured

### 🚀 Backend Template

> **Fast, modern backend API with Bun, Hono, and Drizzle ORM**

| Technology             | Purpose                                     |
| ---------------------- | ------------------------------------------- |
| **Bun**                | Ultra-fast JavaScript runtime               |
| **Hono**               | Lightweight, fast web framework             |
| **Drizzle ORM**        | Type-safe database toolkit                  |
| **SQLite**             | Embedded database (bun:sqlite)              |
| **JWT Authentication** | Secure user authentication                  |
| **TypeScript**         | Type safety and better developer experience |

**✨ What you get:**

-   🔐 Complete authentication system (register, login, JWT)
-   👥 User management with role-based access control
-   🗃️ Database setup with migrations
-   🐳 Docker support with docker-compose
-   📝 Comprehensive logging system
-   🛡️ Type-safe database operations
-   ⚡ Hot reload development server

**🔧 Available Scripts:**

```bash
bun run dev          # Start development server
bun run start        # Start production server
bun run db:generate  # Generate database migrations
bun run db:migrate   # Run database migrations
bun run db:push      # Push schema to database
bun run db:studio    # Open Drizzle Studio
```

**📡 API Endpoints:**

-   `GET /` - API welcome message
-   `GET /health` - Health check
-   `POST /api/auth/register` - User registration
-   `POST /api/auth/login` - User login
-   `GET /api/auth/me` - Get current user
-   `GET /api/users` - Get all users (admin only)
-   `POST /api/users` - Create user (admin only)
-   `PUT /api/users/:id` - Update user (admin only)
-   `DELETE /api/users/:id` - Delete user (admin only)

### 🏗️ Monorepo Template

> **Full-stack monorepo with shared packages and multiple apps**

| Technology          | Purpose                          |
| ------------------- | -------------------------------- |
| **Turborepo**       | Monorepo build system            |
| **Next.js**         | Frontend application             |
| **Shared Packages** | Reusable UI, utils, and config   |
| **TypeScript**      | Type safety across all packages  |
| **Bun**             | Fast package manager and runtime |

**✨ What you get:**

-   📦 Multiple apps in a single repository
-   🔄 Shared packages for code reuse
-   ⚡ Optimized builds with Turborepo
-   🎯 Consistent tooling across all packages
-   🔧 Pre-configured workspace setup

## Tech Stack

### Core Technologies

-   **Bun** - Ultra-fast JavaScript runtime and package manager
-   **TypeScript** - Type safety and enhanced developer experience
-   **Next.js** - React framework with App Router
-   **Hono** - Lightweight, fast web framework for APIs
-   **Drizzle ORM** - Type-safe database toolkit
-   **Material-UI** - Beautiful, accessible UI components

### Development Experience

-   ⚡ **Hot Reload** - Instant development feedback
-   🔧 **Zero Config** - Everything pre-configured and ready to go
-   📦 **Modern Tooling** - Latest versions of all dependencies
-   🛡️ **Type Safety** - Full TypeScript support across all templates
-   🐳 **Docker Ready** - Container support for easy deployment

## Features

### Authentication & Security

-   JWT-based authentication
-   Role-based access control (admin/user)
-   Password hashing with Bun's built-in crypto
-   Secure middleware for protected routes

### Database & ORM

-   SQLite with bun:sqlite for fast, embedded database
-   Drizzle ORM for type-safe database operations
-   Database migrations with Drizzle Kit
-   Drizzle Studio for database management

### Development Tools

-   Comprehensive logging system
-   Environment configuration
-   Docker and docker-compose support
-   Hot reload development servers
-   TypeScript strict mode enabled

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
