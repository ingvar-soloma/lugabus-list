import { Status, Polarity, EvidenceType, UserRole } from '@prisma/client';
import { prisma } from '../src/repositories/baseRepository';
import crypto from 'node:crypto';

function generatePHash(id: string): string {
  const pepper = process.env.HASH_PEPPER || 'default-pepper';
  return crypto.createHmac('sha256', pepper).update(id).digest('hex');
}

async function main() {
  console.log('Seeding data...');

  // 1. Create a Test Admin and User
  const adminTgId = process.env.ADMIN_TELEGRAM_ID || '12345678';
  const adminId = generatePHash(adminTgId);
  const userId = generatePHash('87654321'); // Mock Telegram ID for regular user

  const admin = await prisma.user.upsert({
    where: { id: adminId },
    update: {},
    create: {
      id: adminId,
      role: UserRole.ADMIN,
      reputation: 100,
    },
  });

  const user = await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      role: UserRole.USER,
      reputation: 10,
    },
  });

  // 2. Create Public Figures
  const figures = [
    {
      fullName: 'Володимир Сальдо',
      currentRole: 'Гауляйтер Херсонщини',
      bio: 'Колишній мер Херсона, який перейшов на бік окупантів.',
      reputation: -100,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Указ про призначення головою окупаційної адміністрації',
          url: 'https://example.com/evidence-saldo-1',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'Сергій Притула',
      currentRole: 'Волонтер, засновник благодійного фонду',
      bio: 'Активно допомагає ЗСУ, організовує масштабні збори на потреби армії.',
      reputation: 95,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Звіт про придбання супутника ICEYE',
          url: 'https://prytulafoundation.org/news/iceye',
          type: EvidenceType.LINK,
          polarity: Polarity.SUPPORT,
        },
      ],
    },
    {
      fullName: 'Галина Данильченко',
      currentRole: 'Самопроголошена мер Мелітополя',
      bio: 'Перша зрадниця, яка погодилася очолити місто після викрадення законного мера.',
      reputation: -90,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Відео звернення до мелітопольців із закликом до співпраці',
          url: 'https://example.com/danilchenko-video',
          type: EvidenceType.VIDEO,
          polarity: Polarity.REFUTE,
        },
      ],
    },
  ];

  for (const fig of figures) {
    const { evidence, ...personData } = fig;

    const person = await prisma.person.upsert({
      where: { id: `seed-${personData.fullName.replace(/\s+/g, '-').toLowerCase()}` }, // Stable ID for seeding
      create: {
        id: `seed-${personData.fullName.replace(/\s+/g, '-').toLowerCase()}`,
        ...personData,
        revisions: {
          create: {
            authorId: admin.id,
            status: Status.APPROVED,
            proposedData: personData,
            reason: 'Initial seed data verified by admin',
            evidences: {
              create: evidence,
            },
          },
        },
      },
      update: {
        ...personData,
      },
    });

    console.log(`Created/Updated: ${person.fullName}`);
  }

  // 3. Create a Pending Revision for demonstration
  const pendingPerson = await prisma.person.create({
    data: {
      fullName: 'Денис Пушилін',
      currentRole: 'Голова так званої ДНР',
      bio: 'Керівник терористичного угруповання на окупованій Донеччині.',
      reputation: -100,
      status: Status.PENDING,
    },
  });

  await prisma.revision.create({
    data: {
      personId: pendingPerson.id,
      authorId: user.id,
      status: Status.PENDING,
      proposedData: {
        bio: 'Організатор псевдореферендумів на окупованих територіях.',
      },
      reason: 'Додано інформацію про роль у псевдореферендумах',
      evidences: {
        create: [
          {
            title: 'Матеріали СБУ про підозру Пушиліну',
            url: 'https://ssu.gov.ua/news/search?q=Пушилін',
            type: EvidenceType.LINK,
            polarity: Polarity.REFUTE,
          },
        ],
      },
    },
  });

  console.log('Seeding completed!');
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
