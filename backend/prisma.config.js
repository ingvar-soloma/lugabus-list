// Production-safe Prisma 7 config
// It will look for DATABASE_URL in the environment first
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('CRITICAL ERROR: DATABASE_URL is not defined in the environment!');
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
