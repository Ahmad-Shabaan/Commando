# Interface Contract: Questions API

## GET /api/questions
Returns a list of all questions, ordered by newest first.

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "title": "ما هو إطار العمل Next.js؟",
    "created_at": "2026-05-14T10:00:00Z"
  }
]
```

## POST /api/questions
Creates a new question.

**Request Body**:
```json
{
  "title": "كيف أستخدم GSAP مع React؟"
}
```

**Response** (201 Created):
```json
{
  "id": 2,
  "title": "كيف أستخدم GSAP مع React؟",
  "created_at": "2026-05-14T10:05:00Z"
}
```
