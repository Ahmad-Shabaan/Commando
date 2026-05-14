# Performance & Next.js 16 Optimization Tasks

## Goal
Enhance application performance, reduce unnecessary client-side JavaScript,
and fully leverage Next.js 16 features.  
Convert components to Server Components where possible and apply best
performance practices.

---

- [X] ## 1. Audit Rendering Strategy (Critical)
- Review all components marked with `"use client"`.
- For each component:
  - Decide if it truly needs client-side interactivity.
  - If not, convert it to a **Server Component**.
- Remove `"use client"` unless one of the following is required:
  - useState / useEffect
  - browser-only APIs (window, document)
  - event handlers (onClick, onChange, etc.)

---

- [X] ## 2. Convert to Server Components Where Possible
- Convert the following to **Server Components** if feasible:
  - Announcement / Notification banner
  - Hero section
  - Layout wrappers
  - Static UI sections (headers, footers, informational sections)
- Fetch data directly inside Server Components using async/await.
- Avoid client-side fetching (`useEffect + fetch`) when data can be fetched on the server.

---

- [X] ## 3. Optimize Data Fetching (Next.js 16)
- Use the built-in `fetch` with:
  - `cache: "force-cache"` for static data
  - `next: { revalidate: X }` for semi-dynamic data
- Prevent refetching data on every navigation if not needed.
- Deduplicate requests by sharing fetch logic in server utilities.

---

- [X] ## 4. Reduce Client-Side JavaScript
- Move business logic to the server whenever possible.
- Keep Client Components thin:
  - UI-only
  - Event handling only
- Pass already-processed data from Server Components as props.

---

- [X] ## 5. Improve Caching Strategy
- Cache read-heavy data (e.g. questions, answers, announcements).
- Avoid refetching answers every time a question accordion opens.
- If data is static or rarely changes:
  - Use ISR (`revalidate`)
  - Or full static generation if applicable.

---

## 6. Component Splitting & Boundaries
- Split components into:
  - Server Component (data + structure)
  - Client Component (interaction only)
- Example:
  - `QuestionList.server.tsx`
  - `QuestionItem.client.tsx`

---

- [X] ## 7. Avoid Unnecessary Re-renders
- Remove state that can be derived from props.
- Avoid global window events if React state or context can be used.
- Ensure keys and memoization are correct where needed.

---

## 8. Optimize Layout Stability (CLS)
- Prevent layout shifts caused by:
  - Long text content
  - Dynamic height changes
- Ensure text wraps correctly (`break-words`, `min-w-0`, etc.)
- Avoid fixed widths unless absolutely necessary.

---

- [X] ## 9. Improve API & Backend Performance
- Minimize payload size.
- Select only required fields from the database.
- Add proper indexes for frequently queried columns.
- Ensure rate-limited endpoints fail fast.

---

- [X] ## 10. Use Next.js 16 Best Practices
- Use App Router conventions correctly.
- Prefer Server Actions when suitable.
- Keep API routes lightweight.
- Ensure environment variables are properly scoped.

---

- [X] ## 11. Final Validation
- Confirm:
  - No broken functionality
  - No UI regressions
  - Improved Lighthouse performance score
- Ensure build passes without warnings.
- Ensure production build (`next build`) is optimized.

---

## Important Rules
- Do NOT change business logic.
- Do NOT change UI behavior unless it improves performance.
- Do NOT introduce new libraries unless absolutely necessary.
- Follow existing project structure and conventions.
