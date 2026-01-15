# Lugabus List

**Lugabus List** is a web application for monitoring public figures' political stances. This repository contains both the frontend (React) and backend (Node.js/Express) services, containerized with Docker.

## 🚀 Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite.
- **Backend**: Node.js, Express, Prisma ORM, PostgreSQL.
- **Infrastructure**: Docker, Docker Compose, Nginx (prod).

## 🛠 Getting Started

### Prerequisites

- **Docker** & **Docker Compose**
- **Make** (optional, for easy commands)
- **pnpm** (if running locally without Docker)

### Environment Setup

1.  Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
2.  Adjust `DB_PASSWORD` and `JWT_SECRET` in `.env` if needed.

### Running with Docker (Recommended)

We use `make` to manage Docker commands.

- **Start Development Environment**:

  ```bash
  make dev
  ```

  - Frontend: [http://localhost:3000](http://localhost:3000)
  - Backend API: [http://localhost:8080](http://localhost:8080)
  - Database: `localhost:5432`

- **Start Production Environment**:

  ```bash
  make prod
  ```

  - Runs in detached mode.
  - No ports exposed for DB.
  - Uses optimized/built Docker images.

- **Stop Containers**:

  ```bash
  make down
  ```

- **View Logs**:
  ```bash
  make logs
  ```

## 📂 Project Structure

- `backend/`: Node.js API application.
- `frontend/`: React SPA application.
- `docker-compose.yml`: Base Docker services.
- `docker-compose.dev.yml`: Development overrides (hot-reloading).
- `docker-compose.prod.yml`: Production overrides (security/optimization).
- `Makefile`: Shortcuts for management commands.
