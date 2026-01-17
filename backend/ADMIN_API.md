# Admin API Endpoints

Всі ендпоінти вимагають автентифікації через JWT токен з роллю `ADMIN`.

## Черга ревізій (Queue Management)

### GET /api/admin/queue

Отримати чергу ревізій для модерації

**Query Parameters:**

- `status` (optional): Status - фільтр за статусом (PENDING, QUEUED_FOR_AI, PROCESSING, APPROVED, REJECTED)
- `limit` (optional): number - кількість записів (default: 50)
- `offset` (optional): number - зсув для пагінації (default: 0)

**Response:**

```json
[
  {
    "id": "uuid",
    "personId": "uuid",
    "person": {
      "id": "uuid",
      "fullName": "Ім'я Прізвище"
    },
    "author": {
      "id": "hash",
      "displayName": "BraveEagle4523",
      "avatarColor": "#2196F3"
    },
    "proposedData": {},
    "reason": "Причина зміни",
    "status": "PENDING",
    "evidences": [],
    "aiVoteCount": 5,
    "createdAt": "2026-01-17T00:00:00.000Z"
  }
]
```

### POST /api/admin/queue/:id/approve

Затвердити ревізію

**Response:**

```json
{
  "id": "uuid",
  "status": "APPROVED",
  ...
}
```

### POST /api/admin/queue/:id/reject

Відхилити ревізію

**Body:**

```json
{
  "reason": "Причина відхилення"
}
```

## Докази (Evidence Management)

### GET /api/admin/evidence

Отримати список доказів

**Query Parameters:**

- `limit` (optional): number
- `offset` (optional): number

### DELETE /api/admin/evidence/:id

Видалити доказ

## Персони (Person Management)

### GET /api/admin/persons

Отримати список персон

**Query Parameters:**

- `status` (optional): Status
- `limit` (optional): number
- `offset` (optional): number

### PATCH /api/admin/persons/:id/status

Змінити статус персони

**Body:**

```json
{
  "status": "APPROVED"
}
```

### DELETE /api/admin/persons/:id

Видалити персону

## Користувачі (User Management)

### GET /api/admin/users

Отримати список користувачів

**Response:**

```json
[
  {
    "id": "hash",
    "displayName": "BraveEagle4523",
    "avatarColor": "#2196F3",
    "role": "USER",
    "reputation": 10.0,
    "isShadowBanned": false,
    "violationCount": 0,
    "createdAt": "2026-01-17T00:00:00.000Z"
  }
]
```

### PATCH /api/admin/users/:id/role

Змінити роль користувача

**Body:**

```json
{
  "role": "MODERATOR"
}
```

### POST /api/admin/users/:id/shadow-ban

Shadow ban користувача

**Body:**

```json
{
  "reason": "Спам"
}
```

### POST /api/admin/users/:id/unshadow-ban

Зняти shadow ban

### PATCH /api/admin/users/:id/reputation

Змінити репутацію користувача

**Body:**

```json
{
  "reputation": 50.0
}
```

## Логи (Audit Logs)

### GET /api/admin/logs

Отримати логи дій адміністраторів

**Response:**

```json
[
  {
    "id": "uuid",
    "adminId": "hash",
    "adminName": "BraveEagle4523",
    "action": "APPROVE_REVISION",
    "targetId": "uuid",
    "targetName": "Ім'я Прізвище",
    "timestamp": "2026-01-17T00:00:00.000Z"
  }
]
```

## AI Insights

### GET /api/admin/ai-insights

Отримати AI аналітику

**Response:**

```json
[
  {
    "id": "uuid",
    "targetId": "uuid",
    "confidence": 85,
    "sentiment": "POSITIVE",
    "summary": "AI analysis of revision uuid"
  }
]
```
