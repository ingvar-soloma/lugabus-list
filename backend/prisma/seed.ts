import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

console.log('Seeding data...');

const figures = [
  {
    name: 'Іван Боднар',
    role: 'Місцевий депутат',
    statement: 'Співпраця з окупаційною владою Луганщини.',
    rating: -50,
    status: Status.APPROVED,
  },
  {
    name: 'Олена Коваль',
    role: 'Вчителька історії',
    statement: 'Пропаганда руського миру в школах міста.',
    rating: -30,
    status: Status.APPROVED,
  },
  {
    name: 'Андрій Мельник',
    role: 'Волонтер',
    statement: 'Допомога ЗСУ та евакуація цивільних.',
    rating: 80,
    status: Status.APPROVED,
  },
];

try {
  for (const figure of figures) {
    const existing = await prisma.person.findFirst({
      where: { fullName: figure.name },
    });

    if (!existing) {
      await prisma.person.create({
        data: {
          fullName: figure.name,
          currentRole: figure.role,
          bio: figure.statement,
          reputation: figure.rating,
          status: figure.status,
        },
      });
    }
  }

  console.log('Seeding completed!');
} catch (e) {
  console.error(e);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
