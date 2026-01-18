import 'dotenv/config';
import { prisma } from '../repositories/baseRepository';
import { generateIdentity } from '../utils/identityGenerator';

async function refreshIdentities() {
  console.log('Fetching all users...');
  const users = await prisma.user.findMany();
  console.log(`Found ${users.length} users. Starting migration...`);

  let updatedCount = 0;

  for (const user of users) {
    try {
      // Re-generate identity based on pHash (user.id)
      const identity = generateIdentity(user.id);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          displayName: identity.nickname,
          avatarColor: `hsl(${identity.metadata.hue}, 70%, 50%)`,
        },
      });

      console.log(`Updated user ${user.id.substring(0, 8)}...: ${identity.nickname}`);
      updatedCount++;
    } catch (error) {
      console.error(`Failed to update user ${user.id}:`, error);
    }
  }

  console.log(`
Migration completed!
Total users: ${users.length}
Successfully updated: ${updatedCount}
  `);
}

refreshIdentities()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
