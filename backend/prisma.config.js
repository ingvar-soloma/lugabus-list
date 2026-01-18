// Production-safe Prisma 7 config
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DATABASE_URL } = process.env;

// If a full DATABASE_URL is provided, use it.
// Otherwise, construct it from parts (common in Docker environments).
let dbUrl = DATABASE_URL;

if (!dbUrl && DB_USER && DB_PASSWORD && DB_NAME) {
  const host = DB_HOST || 'localhost';
  // Use URL object to properly encode special characters in password
  const url = new URL(`postgresql://${host}:5432/${DB_NAME}`);
  url.username = DB_USER;
  url.password = DB_PASSWORD;
  dbUrl = url.toString();
}

module.exports = {
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node dist/prisma/seed.js',
  },
  datasource: {
    url: dbUrl,
  },
};
