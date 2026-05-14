

You MUST do these tasks for:
## Phase 1: Security Foundation
## Phase 2: Rate Limiting System
## Phase 3: Caching Layer
## Phase 4: API Updates
## Phase 5: Frontend Error Handling
## Phase 6: Optimization & Cleanup
## Phase 7: Testing Checklist



# 2. 🚦 Rate Limiting (Add Question API)

## Requirement:
- Limit: 5 questions per user per day
- If limit exceeded:
  - Block request on backend
  - Return HTTP 429
  - Frontend must show:
    "لقد وصلت للحد اليومي (5 أسئلة في اليوم)"

---

## 🧠 User Identification Strategy (IMPORTANT - VPN/Proxy Handling)

Because users may use VPNs or proxies, IP alone is NOT fully reliable.

Use a **combined fingerprint approach**:

### Primary identifier:
- IP address (req.ip or forwarded headers)

### Secondary fingerprint signals:
- User-Agent header
- Accept-Language header
- Light hashed fingerprint of:
  - IP + User-Agent + Accept-Language

👉 Store both:
- `ip`
- `fingerprint_hash`

This reduces simple VPN bypass attempts.

---

## 🗄️ Storage Strategy (Neon DB)

Create rate limit tracking table with:

- ip (TEXT)
- fingerprint_hash (TEXT)
- count (INT)
- date (DATE)

---

## 🧩 Rate Limiting Logic

On every POST /api/questions:

1. Generate fingerprint_hash
2. Check today's record by:
   - fingerprint_hash OR ip
3. If record exists:
   - If count >= 5 → return 429
   - Else increment count
4. If no record:
   - Create new record with count = 1

---

## 🛡️ Abuse Handling Rules

- Detect repeated IP changes with same fingerprint → treat as same user
- Normalize IP (handle IPv4/IPv6 inconsistencies)
- Ignore obvious bot User-Agents (optional heuristic)
- Prevent header spoofing by prioritizing server-provided IP (x-forwarded-for)


# 2. ⚡ Performance Optimization (CRITICAL)

## Problem:
Currently, answers are fetched every time a question is opened.

## Required solution:
- Implement caching layer for answers

## Requirements:
- Cache answers per question ID
- Avoid repeated DB queries for same question
- Use one of:
  - In-memory cache (Map)
  - Next.js cache (`unstable_cache`)
  - Server-side caching strategy

## Behavior:
- First request → DB fetch
- Next requests → cache hit
- Cache invalidation when new answer is added

---

# 3. 🛡️ Security Improvements

## 3.1 SQL Injection Protection
- Ensure ALL queries use parameterized queries
- Never concatenate SQL strings
- Use Neon / pg safe query templates only

---

## 3.2 Input Validation
Add validation for:
- Question title (max length, required)
- Answer content (max length, required)

Use:
- Zod OR similar validation library

---

## 3.3 API Hardening
- Validate all request bodies
- Validate query params (questionId)
- Return proper HTTP status codes

---

## 3.4 Rate Limit Abuse Protection
- Prevent bypass using:
  - IP normalization
  - basic request fingerprinting (user-agent + IP hash)

---

# 4. 📡 Backend Tasks

Create or update:

## Questions API
- POST /api/questions
  - Add rate limiting check BEFORE DB insert
  - Validate input
  - Save question safely

## Answers API
- GET /api/answers
  - Implement caching layer
- POST /api/answers
  - Validate input
  - Invalidate cache for that questionId

---

# 5. 🎯 Frontend Tasks

## Rate limit UI handling
- Detect 429 response
- Show toast / message:
  "لقد وصلت للحد اليومي (5 أسئلة في اليوم)"

## Performance handling
- Ensure no redundant fetch loops
- Use server components or cached fetch results

---

# 6. 🧠 Caching System Tasks

- Create caching utility module:
  - getCachedAnswers(questionId)
  - setCachedAnswers(questionId, data)
  - invalidateCache(questionId)

- Ensure thread-safe logic (avoid stale data issues)




