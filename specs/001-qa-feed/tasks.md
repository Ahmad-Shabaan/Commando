# Tasks: QA Feed

**Input**: Design documents from `/specs/001-qa-feed/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/

## Project Initialization

- [X] T001 Initialize Next.js 16 App Router project with TypeScript in app/
- [X] T002 [P] Install dependencies: Tailwind CSS, shadcn/ui, GSAP, @neondatabase/serverless
- [X] T003 Configure Next.js compiler for `router.refresh()` compatibility in next.config.ts
- [X] T004 [P] Update `layout.tsx` to set `<html lang="ar" dir="rtl">` for Arabic RTL support

## Database & Neon Setup

- [X] T005 [P] Setup environment variables in `.env.local` for `DATABASE_URL`
- [X] T006 Create `lib/db.ts` and initialize Neon serverless connection
- [X] T007 Create SQL script to initialize `questions` table schema
- [X] T008 Create SQL script to initialize `answers` table schema (admin seeded)

## Backend (Route Handlers)

- [X] T009 [US1] Implement GET `/api/questions` route handler in `app/api/questions/route.ts`
- [X] T010 [US1] Implement GET `/api/answers?questionId={id}` route handler in `app/api/answers/route.ts`
- [X] T011 [US2] Implement POST `/api/questions` route handler in `app/api/questions/route.ts`

## Design Integration (Stitch + Shadcn)

- [X] T012 [P] Initialize shadcn/ui and configure `components.json`
- [X] T013 [P] Add shadcn/ui Accordion component to `components/ui/accordion.tsx`
- [X] T014 Copy Stitch-generated UI files into `app/design/` directory
- [X] T015 Apply military theme colors (olive green, sand/beige, dark green accents) to Tailwind config
- [X] T016 Remove dark mode configurations completely from Tailwind config

## Hero Section (Army-inspired, Arabic)

- [X] T017 [US1] Create `components/Hero.tsx` using Stitch layout
- [X] T018 [US1] Add army-inspired image and Arabic heading to `components/Hero.tsx`
- [X] T019 [US1] Integrate `Hero` component into `app/page.tsx`

## Questions Feed UI

- [X] T020 [US1] Create `components/QuestionFeed.tsx` as a Server Component
- [X] T021 [US1] Fetch data from `GET /api/questions` inside `QuestionFeed.tsx`
- [X] T022 [US1] Create `components/QuestionCard.tsx` to display question title

## Answers Display (Read-only)

- [X] T023 [US1] Create `components/QuestionAccordion.tsx` (Client Component) to wrap `QuestionCard.tsx`
- [X] T024 [US1] Fetch answers for the question and map to `components/AnswerList.tsx`
- [X] T025 [US1] Render answers as read-only text inside the Accordion Content
- [X] T026 [US1] Verify there are no usernames, metadata, or Add Answer UI in the expanded Accordion

## GSAP Animations

- [X] T027 [P] [US1] Implement GSAP ScrollTrigger in `components/QuestionFeed.tsx` for fade + slide-up effect
- [X] T028 [P] [US1] Add hover micro-interactions to `components/QuestionCard.tsx`
- [X] T029 [P] [US2] Add input focus animations to `components/AddQuestionForm.tsx` using GSAP
- [X] T030 Ensure all GSAP animations use `gsap.context()` and cleanup on unmount

## Forms (Add Question only)

- [X] T031 [US2] Create `components/AddQuestionForm.tsx` (Client Component)
- [X] T032 [US2] Add single input field for question title and submit button
- [X] T033 [US2] Connect form submission to `POST /api/questions` route handler
- [X] T034 [US2] Implement `router.refresh()` inside form success handler
- [X] T035 [US2] Add form validation to prevent empty title submission
- [X] T036 [US2] Render `AddQuestionForm.tsx` at the bottom of `app/page.tsx`

## Arabic Content & RTL Checks

- [X] T037 [P] Replace physical margin/padding with Tailwind logical properties (e.g., `ms-`, `me-`) across all components
- [X] T038 [P] Verify GSAP slide animations respect RTL slide direction (sliding correctly without horizontal scrollbars)
- [X] T039 [P] Ensure typography is optimized for Arabic fonts in `globals.css`

## Performance & Cleanup

- [X] T040 Review `app/page.tsx` to ensure all possible components are Server Components
- [X] T041 Verify Accordion and Form components have `"use client"` directives
- [X] T042 Confirm no TanStack Query or external state managers are installed or used

## Final Review Checklist

- [X] T043 Verify app is completely functional in light mode only
- [X] T044 Verify no authentication prompts or files exist
- [X] T045 Verify no user profiles, voting, comments, or category features exist
- [X] T046 Verify no Add Answer UI exists for public users
- [X] T047 Verify smooth scrolling experience without performance stuttering
