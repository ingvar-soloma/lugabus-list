# Stage 1: Build the application
FROM node:22-bookworm-slim AS builder

# Встановлюємо залежності для збірки (потрібні для node-gyp, prisma query engine)
RUN apt-get update && apt-get install -y \
    openssl \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./

# Використовуємо 'npm install' бо lock-файл може бути несинхронізований
RUN npm install

COPY . .

# Генерація Prisma клієнта
# Примітка: DATABASE_URL тут dummy, бо generate потребує валідної схеми, але не підключення
RUN echo 'DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"' > .env && npx prisma generate

# Компіляція TypeScript
RUN npm run build

# ! ВАЖЛИВО: Видаляємо devDependencies, щоб зменшити розмір node_modules перед копіюванням
RUN npm prune --production

# Stage 2: Create the production image
FROM node:22-bookworm-slim

WORKDIR /usr/src/app

# ! ВАЖЛИВО: Встановлюємо OpenSSL у фінальний образ. Без цього Prisma впаде з помилкою.
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Копіюємо лише необхідне з builder
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

EXPOSE 8080

CMD ["node", "dist/index.js"]
