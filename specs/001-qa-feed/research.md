# Research & Best Practices: QA Feed

## Technology Decisions

1. **Next.js 16 Server Components & Mutations**
   - **Decision**: Fetch questions in `page.tsx` as Server Components. Mutations via Route Handlers (`app/api/questions/route.ts`) and refresh using `router.refresh()`.
   - **Rationale**: Mandated by the constitution to avoid external state libraries (no TanStack Query).
   - **Best Practices**: Ensure Server Components are clean and wait for data using standard `await`.

2. **GSAP Animations in React**
   - **Decision**: Use `gsap.context()` inside a `useEffect` or `useLayoutEffect` hook in client components.
   - **Rationale**: GSAP is strictly required for the scroll reveal animations. Using `gsap.context()` ensures animations can be cleaned up cleanly on component unmount, preventing memory leaks and conflicting scroll triggers.
   - **Best Practices**: Limit GSAP usage strictly to the `app/components/` wrapper components, keeping `app/design/` components clean.

3. **Neon PostgreSQL Serverless**
   - **Decision**: Use `@neondatabase/serverless` using `neon()` HTTP driver for Next.js Edge/Serverless functions.
   - **Rationale**: Connection pooling and serverless scalability natively supported.
   - **Best Practices**: Use parameterized queries via `sql` syntax to prevent SQL injection.
