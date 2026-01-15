# Stage 1: Build the application
FROM node:22-bookworm-slim AS build-stage

# Enable corepack for pnpm
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
