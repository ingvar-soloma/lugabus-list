# Stage 1: Build the application
FROM node:22-bookworm-slim AS builder

# Enable corepack for pnpm
RUN corepack enable

# Install build dependencies
RUN apt-get update && apt-get install -y \
    openssl \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy workspace config files
# We need to copy all package.json files referenced in pnpm-workspace.yaml
# to ensure pnpm install works correctly with the lockfile.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install dependencies (all, frozen lockfile)
RUN pnpm install --frozen-lockfile

# Copy backend source
COPY backend ./backend

# Generate Prisma client for build usage (if needed by build)
WORKDIR /usr/src/app/backend
RUN echo 'DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"' > .env && npx prisma generate

# Compile TypeScript
RUN pnpm run build

# Deploy production dependencies and files to /prod/backend
# This creates a folder with package.json, node_modules (prod), and source files (respecting .npmignore/gitignore)
RUN pnpm --filter backend --prod deploy /prod/backend

# Explicitly copy built artifacts (since they might be gitignored)
RUN cp -r dist /prod/backend/dist

# Post-deploy setup: ensure prisma client is generated in the prod artifacts
WORKDIR /prod/backend
# Copy prisma folder from the source (since it might not be in 'files' or might be needed for generate)
# We copy it from the previous WORKDIR location
RUN cp -r /usr/src/app/backend/prisma ./prisma
# Install prisma cli temporarily to allow parsing prisma.config.ts
RUN pnpm add -D prisma
# Generate client again in the prod node_modules
RUN echo 'DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"' > .env && npx prisma generate
# Remove prisma cli to keep image small
RUN pnpm prune --prod
# Remove the dummy .env
RUN rm .env

# Stage 2: Create the production image
FROM node:22-bookworm-slim

# Install dumb-init and openssl (runtime deps)
RUN apt-get update && apt-get install -y dumb-init openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy the fully prepared application from builder
COPY --chown=node:node --from=builder /prod/backend ./
# Ensure config files are present
COPY --chown=node:node --from=builder /usr/src/app/backend/prisma.config.js ./

# EXPOSE port
EXPOSE 8080

# Enable corepack for pnpm support
RUN corepack enable

# Use non-root user
USER node

# Use dumb-init as entrypoint
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD ["node", "dist/src/index.js"]
