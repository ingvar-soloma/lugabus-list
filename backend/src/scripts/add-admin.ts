import 'dotenv/config';
import { UserRole } from '@prisma/client';
import { prisma } from '../repositories/baseRepository';
import crypto from 'node:crypto';

async function addAdmin() {
  const tgId = process.argv[2];
  const pepper = process.env.HASH_PEPPER;

  if (!tgId) {
    console.error('Please provide a Telegram ID as an argument: npm run add-admin <telegram_id>');
    process.exit(1);
  }

  if (!pepper) {
    console.error('HASH_PEPPER environment variable is missing.');
    process.exit(1);
  }

  const pHash = crypto.createHmac('sha256', pepper).update(tgId).digest('hex');

  await prisma.user.upsert({
    where: { id: pHash },
    update: {
      role: UserRole.ADMIN,
      reputation: 100,
    },
    create: {
      id: pHash,
      role: UserRole.ADMIN,
      reputation: 100,
    },
  });

  console.log(`User with Telegram ID ${tgId} (pHash: ${pHash}) is now an ADMIN.`);
}

addAdmin()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
