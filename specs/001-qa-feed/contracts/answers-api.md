# Interface Contract: Answers API

## GET /api/answers?questionId={id}
Returns a list of answers associated with a specific question.

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "question_id": 2,
    "content": "يجب استخدام gsap.context() لتنظيف الحركات.",
    "created_at": "2026-05-14T11:00:00Z"
  }
]
```

## POST /api/answers
Creates a new answer (Admin Use Only).

**Request Body**:
```json
{
  "question_id": 2,
  "content": "يجب استخدام gsap.context() لتنظيف الحركات."
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "question_id": 2,
  "content": "يجب استخدام gsap.context() لتنظيف الحركات.",
  "created_at": "2026-05-14T11:00:00Z"
}
```
