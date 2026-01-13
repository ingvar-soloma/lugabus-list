# Production Deployment Guide

This guide provides instructions for deploying the LugaBus.ua application to a production environment.

## 1. Prerequisites

- A server with Docker and Docker Compose installed.
- A domain name pointed to your server's IP address.
- A PostgreSQL database. You can use a managed database service or run it in a Docker container.
- A reverse proxy like Nginx or Traefik to handle SSL termination and proxy requests to the application containers.

## 2. Environment Variables

Create a `.env` file at the root of the project and fill in the following environment variables:

```
# PostgreSQL Database
DATABASE_URL="postgresql://user:password@your-database-host:5432/lugabus?schema=public"

# JWT
JWT_SECRET="your-super-secret-key"

# CORS
CORS_ORIGIN="https://your-domain.com"

# Telegram Bot
TELEGRAM_BOT_TOKEN="your-telegram-bot-token"
VITE_TELEGRAM_BOT_NAME="your-telegram-bot-name"

# Additional Domain (for CORS, if needed)
ADDITIONAL_DOMAIN="https://www.your-domain.com"
```

## 3. Building and Running the Application

1.  **Clone the repository** to your server:
    ```bash
    git clone https://github.com/vladyslav-d/lugabus.ua.git
    cd lugabus.ua
    ```

2.  **Build and run the application** using Docker Compose in detached mode:
    ```bash
    docker-compose -f docker-compose.prod.yml up --build -d
    ```

## 4. Production Docker Compose Configuration

The `docker-compose.prod.yml` file in the root of the repository is configured for production use. It exposes the frontend and backend services on `localhost` for use with a reverse proxy.

## 5. Nginx Reverse Proxy Configuration

Here is an example Nginx configuration for serving the application with SSL:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/your/fullchain.pem;
    ssl_certificate_key /path/to/your/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 6. Database Migrations

Before starting the application for the first time, you need to run the database migrations:

```bash
docker-compose -f docker-compose.prod.yml run --rm backend npx prisma migrate deploy
```
