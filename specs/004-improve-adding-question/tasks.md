# 🔍 Duplicate Question Detection (Before Add)

## Goal
Prevent adding duplicate or near-duplicate questions by checking existing questions
based on **main keywords**, not exact title match.

---

## 🧠 Problem
Users may submit the same question with:
- extra words
- prepositions
- slightly different phrasing

Example:
- "ماذا أفعل في أول يوم خدمة عسكرية؟"
- "ما الذي يجب أن أفعله في أول يوم في الخدمة العسكرية؟"

These should be treated as the **same question**.

---

## 🎯 Behavior Requirements

### When user submits a new question:
1. Extract main keywords from the input title
2. Compare against existing question titles
3. If a similar question exists:
   - Do NOT create a new question
   - Show existing question results immediately
   - Behave like a search result
4. If no similar question exists:
   - Proceed with normal add-question flow

---

## 🧩 Keyword Matching Rules (Frontend Only)

Because all questions are already loaded on frontend:

### Step 1: Normalize text
- Convert to lowercase
- Remove punctuation
- Remove Arabic diacritics (if present)

### Step 2: Remove stop words
Ignore common words such as:
- Arabic: (في، من، على، إلى، ما، ماذا، هل، الذي، التي، و، أو)
- English: (the, is, in, on, to, what, how)

### Step 3: Extract keywords
- Split title into words
- Keep words with meaningful length (>= 3 chars)

---

## 🧠 Matching Strategy

- For each existing question:
  - Extract keywords using same logic
  - Count keyword intersections
- If similarity score ≥ threshold (e.g. 60% match):
  - Consider it duplicate

---

## 📱 UI Behavior (IMPORTANT)

If duplicate detected:
- Show message (Arabic):
  "سؤالك موجود بالفعل، إليك الإجابة المتاحة"
- Scroll to or expand the existing question
- Highlight the matched question (optional)
- Do NOT submit the form

---

## ⚡ Performance Constraints

- Must be frontend-only
- No extra API calls
- Use memoized data if possible
- Max questions ~500 (safe for array comparison)

---

## 🚫 Constraints

- Do NOT use AI or embeddings
- Do NOT use backend fuzzy search
- Do NOT add new libraries
- Keep logic simple and deterministic

---

## 🎯 Final Goal

Reduce duplicate questions,
improve data quality,
and guide users to existing information
instead of creating repeated content.