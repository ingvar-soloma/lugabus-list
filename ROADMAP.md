# 🗺️ LugaBus.ua — Трекер Реалізації Проєкту (v2.0)

---

### 🏗️ Фаза 0: Інфраструктура (Foundation)

- [x] Ініціалізація Monorepo (Backend/Frontend)
- [x] Налаштування ESLint, Prettier, Husky
- [x] Docker: Dockerfile для Node.js (multi-stage)
- [x] Docker: docker-compose.yml (App + Postgres + Redis)
- [x] Backend: Express + TypeScript Setup
- [x] Backend: Clean Architecture (Controllers, Services, Repos)
- [x] Backend: Logger (Winston/Pino)
- [x] Backend: Global Error Middleware

---

### 🗄️ Фаза 1: Дані та Core Logic

- [ ] DB: Оновлена схема Prisma (Person, Revision, User, Vote, Tag)
- [ ] DB: Підтримка `pg_trgm` розширення для Prisma
- [ ] Core: Логіка Event Sourcing Lite (створення Revision)
- [ ] Core: Механізм затвердження ревізії (Snapshot update)
- [ ] API: GET /persons/:id (актуальний стан)
- [ ] API: GET /persons/:id/history (історія ревізій)
- [ ] Evidence: Типізація (MEDIA, LINK, VOTE) та Polarity (SUPPORT/REFUTE)
- [ ] Storage: S3 сумісне сховище + Sanitization (sharp)

---

### 🕵️ Фаза 2: Anonymous Auth & Security (Оновлено)

- [ ] **Auth: HMAC Pipeline** (Генерація `pHash` через Global Pepper)
- [ ] **Auth: Monthly Privacy Layer** (Генерація `mHash` з ротацією солі щомісяця)
- [ ] Auth: Вхід через Telegram Widget (Hash validation)
- [ ] Security: Валідація сесій без збереження raw Telegram ID
- [ ] **Anti-Abuse: Shadow Ban Logic** (Приховані обмеження для низького репутаційного скору)
- [ ] **Anti-Abuse: Progressive Tracking** (Логування IP лише при перевищенні порогу порушень)
- [ ] Anti-Abuse: Redis Rate Limiter (ліміти на правки/хв)

---

### 🧩 Фаза 2.5: Data Ingestion & Search

- [ ] Scraper: Парсер rada.gov.ua (голосування)
- [ ] Scraper: Парсер НАЗК (декларації)
- [ ] Search: Інтеграція MeiliSearch або Postgres FTS
- [ ] Search: Індексація сутностей Person та Tags

---

### ⚖️ Фаза 3: AI-Аналітика та Рейтинги

- [ ] AI Service: Підключення Gemini/OpenAI API
- [ ] AI Logic: Промпт для Fact-Checking (аналіз доказів)
- [ ] AI Logic: RAG pipeline (Vector DB) для аналізу законопроєктів
- [ ] Scoring: Формула User Reputation (вплив на вагу голосу)
- [ ] Scoring: Revision Score (Reputation + AI Score)
- [ ] Scoring: Influence Score (Метрика "Впливу" особи)

---

### 📢 Фаза 4: Публічність та Безсмертя

- [ ] Bot: Telegram бот для сповіщень про зміни
- [ ] Queue: BullMQ для відкладених задач (social-publish)
- [ ] Archiving: Інтеграція Wayback Machine API
- [ ] IPFS: Експорт зліпків статей для децентралізованого доступу

---

### 🚀 Фаза 5: Frontend & User Experience

- [ ] UI: Адаптив Mobile First / PWA
- [ ] Page: Профіль особи (Timeline змін, Теги, Графіки)
- [ ] Page: Comparison Mode & Graph View (зв'язки)
- [ ] UI: Система коментування ревізій
- [ ] Extension: Браузерний плагін (LugaBus Detector)

---

### 🎮 Фаза 6: Гейміфікація та Спільнота

- [ ] System: Ачівки за якісне редагування (підвищення лімітів)
- [ ] System: Публічні рейтинги (анонімні, за `pHash`)
- [ ] Process: Human-in-the-loop (Апеляції на AI-рішення)
