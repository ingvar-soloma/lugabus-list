# Stage 1: Build the application
FROM node:22-bookworm-slim AS build-stage

# Enable corepack for pnpm
RUN corepack enable

# Install build dependencies (openssl often needed for build utils)
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy monorepo root files and package manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Install dependencies (all, frozen lockfile) from the root context
RUN pnpm install --frozen-lockfile

# Copy frontend source
COPY frontend ./frontend

# Build the frontend
WORKDIR /usr/src/app/frontend
RUN pnpm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

COPY --from=build-stage /usr/src/app/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
