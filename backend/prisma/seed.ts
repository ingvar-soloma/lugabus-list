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
  // Користувачів не чіпаємо, або видаляємо крім адмінів,
  // але для повного сіда краще очистити все, крім системних записів
  // await prisma.user.deleteMany();

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
    // --- ГРУПА 1: "БАТАЛЬЙОНИ" ТА ВТІКАЧІ (МОНАКО, ДУБАЙ, КУРШЕВЕЛЬ) ---
    {
      fullName: 'Вадим Столар',
      currentRole: 'Нардеп (ОПЗЖ), забудовник',
      bio: 'Фігурант розслідування "Батальйон Дубай". Зв’язки з дубайською нерухомістю, декларування елітних авто за кордоном під час війни.',
      reputation: -90,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Розслідування УП: Батальйон Дубай',
          url: 'https://www.pravda.com.ua/articles/2023/01/27/7386738/',
          type: EvidenceType.VIDEO,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'Костянтин Жеваго',
      currentRole: 'Бізнесмен (екс-нардеп)',
      bio: 'Перебуває у Куршевелі (Франція). Справа про хабар $2.7 млн екс-голові ВС Князєву, екстрадиційний процес.',
      reputation: -90,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Справа про хабар Князєву',
          url: 'https://nabu.gov.ua/news/nabu-i-sap-vikrili-shche-odnogo-uchasnika-shemi-zhevago/',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'Артем Дмитрук',
      currentRole: 'Нардеп (втікач)',
      bio: 'Лондон (Великобританія). Незаконний перетин кордону, активний захист інтересів РПЦ, підозра у нападі.',
      reputation: -100,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Підозра Дмитруку: деталі ДБР',
          url: 'https://dbr.gov.ua/news/dbr-povidomilo-pro-pidozru-dmytruku',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'Андрій Одарченко',
      currentRole: 'Нардеп (втікач)',
      bio: 'Румунія. Спроба підкупу біткоїнами керівництва відновлення, втік через кордон під час суду.',
      reputation: -95,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Вирок та втеча Одарченка',
          url: 'https://nabu.gov.ua/odarchenko-vtecha',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'Андрій Холодов',
      currentRole: 'Екс-нардеп (Слуга Народу)',
      bio: 'Кіпр. Виїхав з країни і склав мандат дистанційно. Бізнес-інтереси за кордоном.',
      reputation: -70,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Схема-розслідування про Холодова',
          url: 'https://www.radiosvoboda.org/a/schemes/32521876.html',
          type: EvidenceType.VIDEO,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'Ярослав Дубневич',
      currentRole: 'Нардеп (втікач)',
      bio: 'Невідома країна ЄС. Оголошений у розшук за розкрадання газу на суму понад 2 млрд грн.',
      reputation: -90,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Розшук Дубневича',
          url: 'https://nabu.gov.ua/dubnevych-search',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'Олександр Грановський',
      currentRole: 'Екс-нардеп (розшук)',
      bio: 'Австрія/Ізраїль. Тіньовий куратор судової та правоохоронної систем часів Порошенка.',
      reputation: -85,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Підозра Грановському від НАБУ',
          url: 'https://nabu.gov.ua/news/pidozra-granovskomu/',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'Кирило Шевченко',
      currentRole: 'Екс-голова НБУ',
      bio: 'Австрія. Справа Укргазбанку (розкрадання 200 млн грн), втік, посилаючись на стан здоров’я.',
      reputation: -80,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Справа Укргазбанку',
          url: 'https://nabu.gov.ua/kyrylo-shevchenko',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'Дмитро Сенниченко',
      currentRole: 'Екс-голова ФДМУ',
      bio: 'Іспанія/Франція. Організація злочинного угруповання для розкрадання коштів ОПЗ та ОГХК на 500 млн грн.',
      reputation: -90,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Схема Сенниченка: деталі НАБУ',
          url: 'https://nabu.gov.ua/news/sennychenko-shema/',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },

    // --- ГРУПА 2: КОРУПЦІЯ МСЕК ТА ТЦК (ЗАГРОЗА НАЦБЕЗПЕЦІ) ---
    {
      fullName: 'Тетяна Крупа',
      currentRole: 'Екс-голова Хмельницької МСЕК',
      bio: 'Символ "прокурорської інвалідності". Знайдено $6 млн готівкою, нерухомість в Австрії та Іспанії.',
      reputation: -100,
      status: Status.APPROVED,
      evidence: [
        {
          title: '6 мільйонів доларів готівкою під ліжком',
          url: 'https://dbr.gov.ua/news/krupa-msek',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'Олександр Крупа',
      currentRole: 'Екс-голова ПФУ Хмельниччини',
      bio: 'Син Тетяни Крупи. Оформлення пенсій десяткам прокурорів області. Елітний автопарк.',
      reputation: -95,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Автопарк родини Круп',
          url: 'https://vsim.ua/krupa-porsche',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'Євген Борисов',
      currentRole: 'Екс-воєнком Одеси',
      bio: 'Вілла в Марбельї за €3.7 млн. Незаконне збагачення на 188 млн грн. Симуляція хвороб у СІЗО.',
      reputation: -100,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Батальйон Іспанія: Борисов',
          url: 'https://pravda.com.ua/borisov-villa',
          type: EvidenceType.VIDEO,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'Всеволод Князєв',
      currentRole: 'Екс-голова Верховного Суду',
      bio: 'Отримав хабар $2.7 млн. Спроба виїзду за кордон після звільнення з-під варти.',
      reputation: -100,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Найбільший хабар в історії судової влади',
          url: 'https://nabu.gov.ua/knyazev-2.7m',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'Олексій Тандир',
      currentRole: 'Екс-суддя',
      bio: 'Збив на смерть нацгвардійця на блокпосту. Спроби фальсифікації аналізів та затягування справи.',
      reputation: -100,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Справа Тандира: ДТП',
          url: 'https://gp.gov.ua/tandyr-case',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'В’ячеслав Шаповалов',
      currentRole: 'Екс-заст. Міністра оборони',
      bio: 'Скандал із закупівлею яєць по 17 грн та неякісної амуніції для ЗСУ на мільярди гривень.',
      reputation: -90,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Яйця по 17 грн: розслідування',
          url: 'https://zn.ua/ukr/shapovalov-zakupivli.html',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },

    // --- ГРУПА 3: "СЛУГИ НАРОДУ" ТА СКАНДАЛЬНІ ДЕПУТАТИ ---
    {
      fullName: 'Мар’яна Безугла',
      currentRole: 'Нардеп (позафракційна)',
      bio: 'Жорстка критика військового командування (Залужний, Содоль). Провокативні заяви щодо мобілізації.',
      reputation: -50,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Конфлікт з генералітетом',
          url: 'https://www.bbc.com/ukrainian/articles/bezuhla-zaluzhnyi',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'Микола Тищенко',
      currentRole: 'Нардеп (позафракційний)',
      bio: '"Батальйон Пхукет", напад на колишнього військового у Дніпрі, кумівство та шоуменство під час війни.',
      reputation: -95,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Напад на військового у Дніпрі',
          url: 'https://youtube.com/tyshchenko-dnipro-video',
          type: EvidenceType.VIDEO,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'Давид Арахамія',
      currentRole: 'Голова фракції "Слуга Народу"',
      bio: 'Лобіювання законів про мобілізацію, захист скандальних депутатів, переговори з РФ у 2022 році.',
      reputation: -30,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Діяльність голови фракції',
          url: 'https://sluga-narodu.com/arakhamia',
          type: EvidenceType.LINK,
          polarity: Polarity.SUPPORT,
        },
      ],
    },
    {
      fullName: 'Галина Третьякова',
      currentRole: 'Нардеп (Слуга Народу)',
      bio: 'Заяви про "дітей низької якості" та політику жорсткого урізання соціальних пільг.',
      reputation: -70,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Скандал про дітей низької якості',
          url: 'https://hromadske.ua/tretyakova-diti',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'Богдан Торохтій',
      currentRole: 'Нардеп (Слуга Народу)',
      bio: 'Відпочинок у Болгарії під час війни, купівля елітних авто (Mercedes-Benz EQS) за мільйони.',
      reputation: -85,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'BIHUS: Торохтій та автопарк',
          url: 'https://bihus.info/torohtiy-luxury',
          type: EvidenceType.VIDEO,
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
          title: 'Відео НАБУ: хабар через паркан',
          url: 'https://youtube.com/marchenko-nabu',
          type: EvidenceType.VIDEO,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'Анатолій Гунько',
      currentRole: 'Нардеп (Слуга Народу)',
      bio: 'Отримав хабар $85 тис. за земельну махінацію. Спійманий "на гарячому" у робочому кабінеті.',
      reputation: -95,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'НАБУ: Справа Гунька',
          url: 'https://nabu.gov.ua/gunko-land',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },

    // --- ГРУПА 4: БІЗНЕС-ЛОБІ ("ДОВІРА", "ЗА МАЙБУТНЄ") ---
    {
      fullName: 'Геннадій Вацак',
      currentRole: 'Нардеп (Довіра)',
      bio: 'Власник кондитерського дому. Помічений на Rolls-Royce у Молдові під час війни.',
      reputation: -60,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Вацак на Rolls-Royce Specter',
          url: 'https://topgir.com.ua/vacak-rolls-royce',
          type: EvidenceType.LINK,
          polarity: Polarity.REFUTE,
        },
      ],
    },
    {
      fullName: 'Олександр Герега',
      currentRole: 'Нардеп (За майбутнє)',
      bio: 'Власник "Епіцентру". Питання щодо роботи бізнесу на окупованих територіях та у РФ до 2022 року.',
      reputation: -40,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Схеми: Епіцентр в Криму',
          url: 'https://radiosvoboda.org/epicentr-crimea',
          type: EvidenceType.VIDEO,
          polarity: Polarity.REFUTE,
        },
      ],
    },

    // --- ГРУПА 5: ГРОМАДСЬКИЙ СЕКТОР ТА МЕДІА ---
    {
      fullName: 'Сергій Стерненко',
      currentRole: 'Волонтер, Блогер',
      bio: 'Активна підтримка мобілізації дронів, критика корупції в ТЦК та Міноборони. Мільйонні збори.',
      reputation: 90,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Звіти Стерненка',
          url: 'https://sternenko.com.ua',
          type: EvidenceType.LINK,
          polarity: Polarity.SUPPORT,
        },
      ],
    },
    {
      fullName: 'Михайло Ткач',
      currentRole: 'Журналіст (УП)',
      bio: 'Автор резонансних розслідувань "Батальйон Монако", "Батальйон Дубай", "Батальйон Лондон".',
      reputation: 85,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Батальйон Монако (УП)',
          url: 'https://youtube.com/pravda-monaco',
          type: EvidenceType.VIDEO,
          polarity: Polarity.SUPPORT,
        },
      ],
    },
    {
      fullName: 'Віталій Шабунін',
      currentRole: 'Голова ЦПК',
      bio: 'Викривач корупції. Має конфлікт із ДБР щодо нібито фіктивної служби в ТРО.',
      reputation: 40,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Діяльність ЦПК',
          url: 'https://antacor.org',
          type: EvidenceType.LINK,
          polarity: Polarity.SUPPORT,
        },
      ],
    },
    {
      fullName: 'Дмитро Гордон',
      currentRole: 'Журналіст',
      bio: 'Піар на темах війни, специфічна позиція щодо виїзду за кордон та мобілізації.',
      reputation: -20,
      status: Status.APPROVED,
      evidence: [
        {
          title: 'Інтерв’ю Гордона',
          url: 'https://youtube.com/gordonua',
          type: EvidenceType.VIDEO,
          polarity: Polarity.REFUTE,
        },
      ],
    },
  ];

  console.log('--- Створення бази персоналій ---');
  for (const fig of figures) {
    const { evidence, ...personData } = fig;

    const person = await prisma.person.create({
      data: {
        id: `seed-${personData.fullName.replace(/\s+/g, '-').toLowerCase()}`,
        ...personData,
        revisions: {
          create: {
            authorId: admin.id,
            status: Status.APPROVED,
            proposedData: personData as any,
            reason: 'Повне наповнення реєстру за даними "Списку Луганського" (Seed v3)',
            evidences: { create: evidence },
          },
        },
      },
    });
    console.log(`[OK] Додано: ${person.fullName}`);
  }

  // --- ОБ'ЄКТИ В ОЧІКУВАННІ ---
  const arestovych = await prisma.person.create({
    data: {
      fullName: 'Олексій Арестович',
      currentRole: 'Блогер-утікач (США)',
      bio: 'Екс-радник ОПУ. Жорстка критика влади, проросійські наративи, перебуває за межами України.',
      reputation: -60,
      status: Status.PENDING,
    },
  });

  await prisma.revision.create({
    data: {
      personId: arestovych.id,
      authorId: user.id,
      status: Status.PENDING,
      proposedData: {
        bio: 'Змінив риторику на відверто антидержавну, перебуваючи у безпеці за кордоном.',
      } as any,
      reason: 'Доповнення про зміну позиції та втечу',
      evidences: {
        create: [
          {
            title: 'Аналіз ефірів Арестовича',
            url: 'https://youtube.com/arestovych-usa',
            type: EvidenceType.VIDEO,
            polarity: Polarity.REFUTE,
          },
        ],
      },
    },
  });

  console.log('--- Сідер завершено! Внесено всіх ключових фігурантів. ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
