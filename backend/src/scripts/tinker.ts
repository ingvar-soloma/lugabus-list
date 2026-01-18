import repl from 'node:repl';
import { prisma } from '../repositories/baseRepository';

/**
 * LugaBus Tinker Script
 * Usage: docker-compose exec backend pnpm tinker
 */

console.log('--- LugaBus Project Tinker ---');
console.log('Environment Debug:');
console.log(
  'DATABASE_URL starts with:',
  process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + '...' : 'UNDEFINED',
);
console.log('Available global: prisma');
console.log('Example: await prisma.person.findMany()');

const replServer = repl.start({
  prompt: 'lugabus > ',
  useGlobal: true,
});

// Add prisma to the REPL context
replServer.context.prisma = prisma;

replServer.on('exit', async () => {
  await prisma.$disconnect();
  process.exit();
});
