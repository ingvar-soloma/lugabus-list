const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');
  const figures = [
    {
      name: 'Іван Боднар',
      role: 'Місцевий депутат',
      statement: 'Співпраця з окупаційною владою Луганщини.',
      rating: -50,
      status: 'APPROVED',
    },
    {
      name: 'Олена Коваль',
      role: 'Вчителька історії',
      statement: 'Пропаганда руського миру в школах міста.',
      rating: -30,
      status: 'APPROVED',
    },
    {
      name: 'Андрій Мельник',
      role: 'Волонтер',
      statement: 'Допомога ЗСУ та евакуація цивільних.',
      rating: 80,
      status: 'APPROVED',
    }
  ];

  for (const figure of figures) {
    const existing = await prisma.publicFigure.findFirst({
      where: { name: figure.name }
    });
    
    if (!existing) {
      await prisma.publicFigure.create({
        data: figure
      });
    }
  }
  console.log('Seeding completed!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
