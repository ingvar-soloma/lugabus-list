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

## 🔐 Налаштування середовища (.env)

Для роботи проєкту необхідно створити файл `.env` у корені папки `backend`. Ви можете скопіювати приклад:

```bash
cp .env.example .env
```

### Основні змінні:

- `DATABASE_URL`: Шлях до вашої БД PostgreSQL.
- `JWT_SECRET`: Секретний ключ для підпису токенів (будь-який випадковий рядок).
- `HASH_PEPPER`: "Піль" для анонімізації Telegram ID та IP. **Важливо зберегти її для консистентності даних.**
- `ENCRYPTION_KEY`: Ключ AES (64 символи hex). Згенеруйте новий:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- `TELEGRAM_BOT_TOKEN`: Отримайте у [@BotFather](https://t.me/BotFather).

---

## 👨‍💼 Додавання Адміністратора

Є два способи призначити користувача адміністратором:

### 1. Через змінні в .env (при першому сидуванні)

Додайте свій Telegram ID у `.env`:

```env
ADMIN_TELEGRAM_ID=123456789
```

Після цього запустіть сидування:

```bash
npx prisma db seed
# Або в Docker:
docker exec -it lugabus-backend pnpm prisma db seed
```

### 2. Через спеціальний скрипт (для існуючих користувачів)

Ви можете призначити роль ADMIN будь-якому користувачу за його Telegram ID:

```bash
pnpm run add-admin 123456789
# Або в Docker:
docker exec -it lugabus-backend pnpm run add-admin 123456789
```

---

## 🌱 Демонстраційні дані (Seed)

Для наповнення бази даних тестовими записами (Публічні фігури, Ревізії, Докази):

```bash
npx prisma db seed
```

---

## 📦 Database Migrations

Ми використовуємо **Prisma** для керування схемою.

- **Generate Client**: `npx prisma generate`
- **Push Schema to DB**: `npx prisma db push`
- **Studio (GUI)**: `npx prisma studio`
