# Lugabus Backend

Node.js REST API service for the Lugabus platform.

## 🛠 Tech Stack

- **Runtime**: Node.js v22
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Security**: Helmet, Rate Limiting, Zod Validation
- **Package Manager**: pnpm

## 🚀 Setup & Run (Local)

If you are not using Docker, you can run the backend locally:

1.  **Install Dependencies**:

    ```bash
    pnpm install
    ```

2.  **Environment Config**:
    Copy `.env.example` to `.env` and configure your database connection.

3.  **Run in Development Mode**:

    ```bash
    pnpm run dev
    ```

4.  **Build**:
    ```bash
    pnpm run build
    pnpm start
    ```

## 📦 Database Migrations

We use **Prisma** for database management.

- **Generate Client**:
  ```bash
  npx prisma generate
  ```
- **Push Schema to DB**:
  ```bash
  npx prisma db push
  ```
- **Studio (GUI)**:
  ```bash
  npx prisma studio
  ```
