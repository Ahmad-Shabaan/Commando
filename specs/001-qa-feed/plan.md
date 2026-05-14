# Implementation Plan: QA Feed

**Branch**: `001-qa-feed` | **Date**: 2026-05-14 | **Spec**: [specs/001-qa-feed/spec.md](./spec.md)
**Input**: Feature specification from `specs/001-qa-feed/spec.md`

## Summary

Implement a single-page, Arabic (RTL) informational Q&A knowledge website using Next.js 16 App Router. The app features a scrollable feed of questions with GSAP animations, where public users can read administrative answers and submit new questions. 

## Technical Context

**Language/Version**: TypeScript  
**Primary Dependencies**: Next.js 16 (App Router), Tailwind CSS, shadcn/ui, GSAP, `@neondatabase/serverless`  
**Storage**: Neon PostgreSQL Serverless  
**Testing**: Playwright / Jest (Standard web testing, if required)  
**Target Platform**: Vercel (or Node.js server)  
**Project Type**: Web Application  
**Performance Goals**: 60fps animations during scroll, instant load (server components)  
**Constraints**: strictly RTL/Arabic, Light mode only, NO authentication, NO external state management (e.g., TanStack Query)  
**Scale/Scope**: Single page, lightweight Q&A feed  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Arabic & RTL Only**: Passed. Handled natively via `<html lang="ar" dir="rtl">` and Tailwind logical properties.
- **Read-Only Minimal Q&A**: Passed. UI only includes form for adding questions. Answers are read-only. No auth/comments functionality is planned.
- **Single-Page Feed**: Passed. `app/page.tsx` implements the entire view.
- **Stitch-Driven UI**: Passed. `app/design/` isolated from `app/components/`.
- **Server-Side Data**: Passed. Utilizing Next.js Server Components and Route Handlers with `router.refresh()`.

## Project Structure

### Documentation (this feature)

```text
specs/001-qa-feed/
├── plan.md              # This file
├── research.md          # Technology decisions and best practices
├── data-model.md        # DB schemas
├── quickstart.md        # Setup guide
├── contracts/           # API contracts
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
app/
├── page.tsx
├── layout.tsx
├── design/               # Stitch UI components (raw design)
├── components/           # Functional components (logic + state + GSAP)
│   ├── QuestionFeed.tsx
│   ├── QuestionAccordion.tsx
│   ├── QuestionCard.tsx
│   ├── AnswerList.tsx
│   └── AddQuestionForm.tsx
├── api/
│   ├── questions/route.ts
│   └── answers/route.ts
└── styles/
    └── globals.css
lib/
└── db.ts                 # Neon Serverless connection
```

**Structure Decision**: The single application Next.js 16 app router structure is enforced as required by `plan.md` and the constitution.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations. Architecture remains completely within boundaries.
