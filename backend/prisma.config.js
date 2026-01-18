// Production-safe Prisma 7 config
require('dotenv').config();

module.exports = {
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node dist/prisma/seed.js', // Assuming seed is compiled
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
