You are working on a Next.js 16 (App Router) frontend using React + Tailwind + shadcn/ui.

Your task is to implement a **client-side search** feature for questions.

---

## 🧠 Context

- All questions are already fetched and stored in frontend memory
- No backend search API is required
- Search must filter questions by **title only**
- Website is Arabic (RTL)

---

## 🎯 Requirements

### 1. Search behavior
- Search is **case-insensitive**
- Search matches **partial words**
- Search happens only on question title
- Empty search → show all questions

---

### 2. Debounce
- Implement debounce on input change
- Delay: **300–400ms** (choose best)
- Debounce must prevent filtering on every keystroke

---

### 3. Implementation rules
- Use React hooks only
- No external debounce libraries
- Implement debounce using:
  - `setTimeout`
  - `clearTimeout`
- Search logic must be isolated (clean and readable)

---

### 4. UI
- Use shadcn `Input` component
- Place search input above question list
- Support RTL layout
- Add Arabic placeholder:
  "ابحث عن عنوان السؤال..."

---

### 5. Performance
- Avoid unnecessary re-renders
- Do NOT refetch data
- Filter from existing questions array only

---

## 🧩 Output Expectations

Provide:
1. A reusable `useDebouncedSearch` hook OR inline debounce logic
2. Search input component
3. Filtering logic example
4. Clean, readable code

---

## 🚫 Constraints

- Do NOT add backend endpoints
- Do NOT modify database
- Do NOT introduce new state libraries
- Do NOT change existing architecture

---

## 🎯 Goal

Create a fast, smooth, frontend-only debounced search that filters questions by title without impacting performance.