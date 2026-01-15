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

COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

COPY . .

# Generate Prisma client
# DATABASE_URL is dummy here because generate needs schema but not connection
RUN echo 'DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"' > .env && npx prisma generate

# Compile TypeScript
RUN pnpm run build

# Remove devDependencies to reduce size
RUN pnpm prune --prod

# Stage 2: Create the production image
FROM node:22-bookworm-slim

# Install dumb-init and openssl
RUN apt-get update && apt-get install -y dumb-init openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy files from builder and set ownership to node user
COPY --chown=node:node --from=builder /usr/src/app/package.json ./
COPY --chown=node:node --from=builder /usr/src/app/pnpm-lock.yaml ./
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist
COPY --chown=node:node --from=builder /usr/src/app/prisma ./prisma

EXPOSE 8080

# Use non-root user
USER node

# Use dumb-init as entrypoint for signal handling
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD ["node", "dist/index.js"]
