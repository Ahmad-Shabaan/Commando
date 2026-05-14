
# Testing Cycle Tasks (QA Phase)

## Role
You are acting as a **Professional QA Engineer & Test Writer**.


Your responsibility is to design and implement a **complete, reliable testing suite**
for the existing project **without modifying application code**.

---

## 🧠 Project Context

This is a **single-page Arabic informational Q&A application** with the following characteristics:

### Core Features
- Questions (title only)
- Answers (content only)
- No authentication
- No users, comments, editing, or deleting
- Users can only:
  - Read questions & answers
  - Add new questions (rate-limited)
- Data stored in **Neon PostgreSQL**

### API Routes
- `GET /api/questions`
- `POST /api/questions`
- `GET /api/answers?questionId=`
- `POST /api/answers`

### Frontend Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- GSAP (UI animations only)

---

## 🎯 Objective

Create a **production-ready testing suite** that validates:

- API correctness
- Data integrity
- Input validation
- UI rendering stability
- Error handling behavior

---

## 🧪 Testing Stack (Required)

Use the following tools:

- **Vitest** (preferred for Next.js 16)
- **React Testing Library** (UI testing)
- Fetch mocking or API handler mocking
- Database mocking (Neon / PostgreSQL)

⚠️ Do NOT use a real database connection.

---

## 🧩 Scope of Tests

### 1. Unit Tests

Create unit tests for:

#### API Layer
- `/api/questions`
  - Valid POST request
  - Invalid input (empty / unsafe)
  - Rate limit exceeded
- `/api/answers`
  - Valid POST request
  - Missing `questionId`
  - Invalid content

#### Database Utilities
- Query functions
- Insert helpers
- Ensure correct parameters are passed
- Ensure SQL injection protection logic is respected

#### Validation Logic
- Question title validation
- Answer content validation
- Sanitization behavior

---

### 2. Integration Tests

Test full flows (mocked DB):

- Create a question → ensure it appears in questions list
- Fetch questions list
- Add an answer to an existing question
- Fetch answers for a specific question
- Handle duplicate question detection
- Handle rate-limit rejection

---

### 3. UI Component Tests

Write focused UI tests for:

- Question card / accordion item
- Answers list rendering
- Add Question form:
  - Successful submit
  - Duplicate question flow
  - Rate limit error message
- Announcement / notification banner rendering (if present)

⚠️ Ignore GSAP animations logic (mock or bypass).

---

## 📁 Required Test Structure

Create tests under a dedicated test directory, for example:

```

/tests
/api
questions.test.ts
answers.test.ts
/components
question.test.tsx
answers.test.tsx
/db
db.test.ts
setup.ts

```

---

## ⚙️ Configuration Tasks

- Configure **Vitest** for:
  - TypeScript
  - Next.js App Router compatibility
  - jsdom for UI tests
- Configure React Testing Library setup
- Mock:
  - `fetch`
  - Neon DB client
  - Environment variables if required

---

## 📄 Deliverables

Provide:

1. Test folder structure
2. `vitest.config.ts` (or equivalent)
3. `tests/setup.ts`
4. Full example test files:
   - `api/questions.test.ts`
   - `api/answers.test.ts`
   - `components/question.test.tsx`
   - `db/db.test.ts`

Tests must be:
- Clean
- Readable
- Minimal but meaningful
- Runnable without real backend services

---

## ⚠️ Constraints (Strict)

- ❌ Do NOT modify production code
- ❌ Do NOT add new features
- ❌ Do NOT refactor existing logic
- ✅ Only create test-related files
- ✅ Follow existing project structure

---

## 🧠 Quality Standards

- Tests must reflect **real user behavior**
- Prefer behavior-based testing over implementation details
- Avoid snapshot abuse
- Fail clearly with meaningful assertions

---

## 🎯 Final Goal

Ensure the application is:

- Stable
- Correct
- Safe to deploy
- Confidently testable before production releases

```

---
