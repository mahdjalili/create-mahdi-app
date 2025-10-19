# Use official Bun image
FROM oven/bun:1.3-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Copy production dependencies
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Build stage
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Production stage
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /app/src ./src
COPY --from=prerelease /app/package.json .
COPY --from=prerelease /app/tsconfig.json .
COPY --from=prerelease /app/drizzle.config.ts .
COPY --from=prerelease /app/drizzle ./drizzle

# Create directories for SQLite database and logs, set permissions
RUN mkdir -p /app/data /app/logs && chown -R bun:bun /app/data /app/logs

# Expose port
EXPOSE 3000

# Set user to bun
USER bun

# Run the app
CMD ["bun", "start"]