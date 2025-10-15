# create-mahdi-app

A CLI tool to create Next.js projects with Mahdi's preferred tech stack.

## Installation

```bash
npm create mahdi-app@latest
```

Or using Bun:

```bash
bunx create-mahdi-app
```

## Usage

```bash
create-mahdi-app my-app
```

The CLI will guide you through the setup process with interactive prompts.

## Tech Stack

The generated projects include:

-   **Framework**: Next.js 15 with App Router
-   **Runtime**: Bun (enforced)
-   **UI Library**: Material-UI (MUI)
-   **State Management**: Zustand
-   **Data Fetching**: React Query (TanStack Query)
-   **Forms**: Formik + Yup
-   **URL State**: nuqs
-   **HTTP Client**: Axios
-   **Language**: TypeScript

## Templates

Currently available templates:

-   **Frontend**: Next.js with React, Material-UI, and all the above dependencies

More templates coming soon (backend, monorepo, etc.).

## Features

-   ✅ Interactive CLI with prompts
-   ✅ Bun-first template (enforced in generated projects)
-   ✅ Next.js App Router
-   ✅ Minimal setup (no example pages/components)
-   ✅ Full type safety with TypeScript
-   ✅ Extensible for future templates

## Development

To develop this CLI tool locally:

```bash
# Clone the repository
git clone <repository-url>
cd create-mahdi-app

# Install dependencies
npm install

# Build the project
npm run build

# Link globally for testing
npm link

# Test the CLI
create-mahdi-app my-test-app
```

## License

MIT
