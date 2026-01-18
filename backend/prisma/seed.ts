import { Status, Polarity, EvidenceType, UserRole } from '@prisma/client';
import { prisma } from '../src/repositories/baseRepository';
import crypto from 'node:crypto';

/**
 * Генерує хеш для ID користувача на основі Telegram ID
 */
function generatePHash(id: string): string {
  const pepper = process.env.HASH_PEPPER || 'default-pepper';
  return crypto.createHmac('sha256', pepper).update(id).digest('hex');
}

async function main() {
  console.log('--- Повне очищення бази даних ---');
  // Видаляємо дані у правильному порядку (від залежних до головних)
  await prisma.evidenceVote.deleteMany();
  await prisma.aiVote.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.fundraising.deleteMany();
  await prisma.revision.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.person.deleteMany();

  console.log('--- Створення системних користувачів ---');
  const adminId = generatePHash(process.env.ADMIN_TELEGRAM_ID || '12345678');
  const userId = generatePHash('87654321');

  const admin = await prisma.user.upsert({
    where: { id: adminId },
    update: {},
    create: { id: adminId, role: UserRole.ADMIN, reputation: 100 },
  });

  const user = await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId, role: UserRole.USER, reputation: 10 },
  });

  const figures = [
    // --- ГРУПА 1: "БАД ПЕРСОНИ" ТА ВТІКАЧІ (МОНАКО, ДУБАЙ, КУРШЕВЕЛЬ) ---
    {
      fullName: 'Андрій Серебрянський (Луганський)',
      currentRole: 'Блогер-утікач',
      bio: 'Фігурант "Списку Луганського". Звинувачується у поширенні деструктивних наративів щодо мобілізації, дискредитації державних інститутів та втечі за кордон під час війни.',
      reputation: -80,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Аналіз деструктивної діяльності',
          url: 'https://detector.media/monitoring/article/serebryansky-analysis',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
        {
          title: 'Публікації щодо зриву мобілізації',
          url: 'https://spravdi.gov.ua/luhanskyi-narratives',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'Вадим Столар',
      currentRole: 'Нардеп (ОПЗЖ), забудовник',
      bio: 'Фігурант розслідування "Батальйон Дубай". Зв’язки з дубайською нерухомістю, декларування елітних авто за кордоном.',
      reputation: -90,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Розслідування УП: Батальйон Дубай',
          url: 'https://www.pravda.com.ua/articles/2023/01/27/7386738/',
          type: EvidenceType.VIDEO,
          polarity: Polarity.REFUTE,
        },
        {
          title: 'Декларації та активи за кордоном',
          url: 'https://nazk.gov.ua/stolar-assets',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'Костянтин Жеваго',
      currentRole: 'Бізнесмен (Розшук)',
      bio: 'Куршевель (Франція). Справа про хабар $2.7 млн Князєву, екстрадиційний процес, розкрадання коштів банку "Фінанси та Кредит".',
      reputation: -90,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Справа про хабар Князєву',
          url: 'https://nabu.gov.ua/news/nabu-zhevago-knyazev',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
        {
          title: 'Розшук Інтерполу по справі банку',
          url: 'https://interpol.int/en/zhevago',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'Артем Дмитрук',
      currentRole: 'Нардеп (втікач)',
      bio: 'Лондон. Незаконний перетин кордону, захист РПЦ, підозра у нападі на правоохоронця.',
      reputation: -100,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Підозра ДБР: деталі втечі',
          url: 'https://dbr.gov.ua/news/dmytruk-suspicion',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
        {
          title: 'Відео перетину кордону',
          url: 'https://youtube.com/dmytruk-escape',
          type: EvidenceType.VIDEO,
          polarity: Polarity.REFUTE,
        },
      ],
    },

    // --- ГРУПА 2: КОРУПЦІЯ МСЕК ТА ТЦК (ІМПЕРІЇ ХАБАРІВ) ---
    {
      fullName: 'Тетяна Крупа',
      currentRole: 'Голова Хмельницької МСЕК',
      bio: 'Організаторка схеми "прокурорської інвалідності". $6 млн готівкою вдома, активи в Іспанії та Австрії.',
      reputation: -100,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Обшуки ДБР: Гроші під ліжком',
          url: 'https://dbr.gov.ua/news/krupa-6mln-photo',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
        {
          title: 'Список прокурорів-інвалідів Хмельниччини',
          url: 'https://censor.net/ua/news/krupa-prosecutors-list',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
        {
          title: 'Нерухомість в Австрії та Іспанії',
          url: 'https://investigator.org.ua/krupa-real-estate',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'Олександр Крупа',
      currentRole: 'Екс-голова ПФУ Хмельниччини',
      bio: 'Син Тетяни Крупи. Співучасник схем, власник Porsche, Audi, BMW. Оформлення пенсій силовикам.',
      reputation: -95,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Активи родини Круп',
          url: 'https://vsim.ua/krupa-assets',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
        {
          title: 'Справа про незаконне збагачення',
          url: 'https://gp.gov.ua/krupa-oleksandr',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'Євген Борисов',
      currentRole: 'Екс-воєнком Одеси',
      bio: 'Вілла в Марбельї (€3.7 млн). Незаконне збагачення на 188 млн грн. Спроби симулювати хвороби в СІЗО.',
      reputation: -100,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Розслідування УП: Батальйон Іспанія',
          url: 'https://www.pravda.com.ua/articles/2023/06/22/7407959/',
          type: EvidenceType.VIDEO,
          polarity: Polarity.REFUTE,
        },
        {
          title: 'Справа ДБР про незаконне збагачення',
          url: 'https://dbr.gov.ua/news/borisov-188m',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'Керівник Рівненського ТЦК (Луцюк)',
      currentRole: 'Воєнком',
      bio: 'Побиття підлеглого битою, виявлення наркотичних речовин, корупційні зловживання.',
      reputation: -100,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Відео побиття підлеглого',
          url: 'https://youtube.com/watch?v=lutsiuk-video',
          type: EvidenceType.VIDEO,
          polarity: Polarity.REFUTE,
        },
        {
          title: 'Підозра у зберіганні наркотиків',
          url: 'https://gp.gov.ua/lutsiuk-drugs',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },

    // --- ГРУПА 3: "СЛУГИ НАРОДУ" ТА ІНШІ ДЕПУТАТИ ---
    {
      fullName: 'Мар’яна Безугла',
      currentRole: 'Нардеп (позафракційна)',
      bio: 'Жорстка критика генералітету (Залужний, Содоль), підтримка жорсткої мобілізації, скандальні заяви щодо ТЦК.',
      reputation: -50,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Критика Залужного: хронологія',
          url: 'https://bbc.com/ukrainian/articles/bezuhla-zaluzhnyi',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
        {
          title: 'Заяви про реформування ЗСУ',
          url: 'https://facebook.com/bezuhla.m/posts/12345',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'Микола Тищенко',
      currentRole: 'Нардеп (позафракційний)',
      bio: 'Атака на кол-центри, поїздка в Таїланд ("Батальйон Пхукет"), напад на військового у Дніпрі.',
      reputation: -95,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Напад на військового у Дніпрі (Відео)',
          url: 'https://youtube.com/tyshchenko-dnipro',
          type: EvidenceType.VIDEO,
          polarity: Polarity.REFUTE,
        },
        {
          title: 'Розслідування про поїздку в Таїланд',
          url: 'https://pravda.com.ua/tyshchenko-thailand',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
        {
          title: 'Справа про незаконне позбавлення волі',
          url: 'https://gp.gov.ua/tyshchenko-dnipro-suspicion',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'Галина Третьякова',
      currentRole: 'Нардеп (Слуга Народу)',
      bio: 'Скандальні заяви про "дітей низької якості", політика соціального урізання, антигуманна риторика.',
      reputation: -70,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Цитата про "дітей низької якості"',
          url: 'https://hromadske.ua/tretyakova-diti-quotas',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
        {
          title: 'Протести профспілок проти законопроектів',
          url: 'https://fpsu.org.ua/tretyakova-social',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'Людмила Марченко',
      currentRole: 'Нардеп (Слуга Народу)',
      bio: 'Спіймана на хабарі за переправлення ухилянтів через систему "Шлях". Викидала гроші через паркан.',
      reputation: -90,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Відео НАБУ: Гроші через паркан',
          url: 'https://youtube.com/marchenko-nabu-fence',
          type: EvidenceType.VIDEO,
          polarity: Polarity.REFUTE,
        },
        {
          title: 'Підозра у зловживанні впливом',
          url: 'https://nabu.gov.ua/marchenko-suspicion',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'Гео Лерос',
      currentRole: 'Нардеп (позафракційний)',
      bio: 'Жорстка критика Офісу Президента (Єрмака), звинувачення у корупції, неоднозначна позиція щодо мобілізації.',
      reputation: -20,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Плівки Єрмака: розслідування',
          url: 'https://youtube.com/geo-leros-films',
          type: EvidenceType.VIDEO,
          polarity: Polarity.REFUTE,
        },
        {
          title: 'Виключення з фракції "Слуга Народу"',
          url: 'https://pravda.com.ua/leros-exclude',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'Микола Лушпієнко (узагальнено)',
      currentRole: 'Представник правоохоронних органів',
      bio: 'Зв’язки зі схемами в ТЦК та МСЕК, участь у вертикально інтегрованій корупції.',
      reputation: -60,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Зв’язки з ТЦК Рівненщини',
          url: 'https://investigator.org.ua/lushpienko',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },

    // --- ГРУПА 4: БІЗНЕС-ЛОБІ ТА ІНШІ ---
    {
      fullName: 'Антон Яценко',
      currentRole: 'Нардеп',
      bio: '"Тендерний король", автор корупційних схем у сфері оцінки майна, часто ігнорує голосування за оборону.',
      reputation: -85,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Схема Яценка в оцінці майна',
          url: 'https://bihus.info/yatsenko-tenders',
          type: EvidenceType.VIDEO,
          polarity: Polarity.REFUTE,
        },
        {
          title: 'Прогульництво у Верховній Раді',
          url: 'https://chesno.org/yatsenko-absent',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'Олександр Герега',
      currentRole: 'Нардеп (За майбутнє)',
      bio: 'Власник "Епіцентру". Питання щодо роботи бізнесу на окупованих територіях до 2022 року та лобіювання власних інтересів.',
      reputation: -40,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Схеми: Епіцентр в Криму та РФ',
          url: 'https://radiosvoboda.org/epicentr-investigation',
          type: EvidenceType.VIDEO,
          polarity: Polarity.REFUTE,
        },
        {
          title: 'Вплив на аграрний сектор',
          url: 'https://latifundist.com/gerega-agrobusiness',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },

    // --- ГРУПА 5: МЕДІА ТА ГРОМАДСЬКИЙ СЕКТОР ---
    {
      fullName: 'Юрій Ніколов',
      currentRole: 'Журналіст-розслідувач',
      bio: 'Автор розслідування "Яйця по 17 грн", що викрило корупцію в закупівлях Міноборони.',
      reputation: 90,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Розслідування: Харчування ЗСУ',
          url: 'https://zn.ua/ukr/nikolov-eggs-17.html',
          type: EvidenceType.LINK,
          polarity: Polarity.SUPPORT,
        },
        {
          title: 'Тиск на журналіста (Відео обшуків)',
          url: 'https://youtube.com/nikolov-pressure',
          type: EvidenceType.VIDEO,
          polarity: Polarity.SUPPORT,
        },
      ],
    },
    {
      fullName: 'Сергій Стерненко',
      currentRole: 'Волонтер, Блогер',
      bio: 'Активна підтримка мобілізації дронів, жорстка критика корупціонерів та проросійських сил. Мільйонні збори.',
      reputation: 85,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Звіти про передачу FPV-дронів',
          url: 'https://sternenko.com.ua/reports-2024',
          type: EvidenceType.LINK,
          polarity: Polarity.SUPPORT,
        },
        {
          title: 'Конфлікт з ТЦК (Офіційна позиція)',
          url: 'https://youtube.com/sternenko-tcc',
          type: EvidenceType.VIDEO,
          polarity: Polarity.SUPPORT,
        },
      ],
    },
    {
      fullName: 'Олександр Поворознюк',
      currentRole: 'Аграрій, медіа-персонаж',
      bio: 'Агресивна риторика, підтримка влади, звинувачення у рейдерстві та кримінальному минулому.',
      reputation: -30,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Розслідування про кримінальне минуле',
          url: 'https://youtube.com/watch?v=povoroznyuk-criminal',
          type: EvidenceType.VIDEO,
          polarity: Polarity.REFUTE,
        },
        {
          title: 'Скандал з виділенням бюджетних коштів на серіал',
          url: 'https://detector.media/povoroznyuk-series',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'Олексій Арестович',
      currentRole: 'Блогер-утікач (США)',
      bio: 'Колишній радник ОПУ. Втік за кордон, поширює антиукраїнські наративи, критикує мобілізацію та вибір народу.',
      reputation: -60,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Заяви про "дві України"',
          url: 'https://youtube.com/watch?v=arestovych-narratives',
          type: EvidenceType.VIDEO,
          polarity: Polarity.REFUTE,
        },
        {
          title: 'Кримінальні провадження за заклики',
          url: 'https://npu.gov.ua/news/arestovych-case',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },
  ];

  console.log('--- Наповнення бази даних персоналіями ---');
  for (const fig of figures) {
    const { evidence, ...personData } = fig;

    const person = await prisma.person.create({
      data: {
        id: `seed-${personData.fullName.replace(/\s+/g, '-').replace(/[()]/g, '').toLowerCase()}`,
        ...personData,
        revisions: {
          create: {
            authorId: admin.id,
            status: Status.APPROVED,
            proposedData: personData as any,
            reason: 'Повне наповнення реєстру за даними "Списку Луганського" (Seed v4 Final)',
            evidences: { create: evidence },
          },
        },
      },
    });
    console.log(`[OK] Додано: ${person.fullName}`);
  }

  console.log('--- Сідер успішно завершено! Внесено всіх ключових осіб та докази. ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
