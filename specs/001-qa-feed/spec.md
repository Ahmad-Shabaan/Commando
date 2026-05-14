# Feature Specification: QA Feed

**Feature Branch**: `001-qa-feed`
**Created**: 2026-05-14
**Status**: Draft
**Input**: User description: "$ARGUMENTS"

## Clarifications

### Session 2026-05-14
- Q: If there is no Add Answer form in the accordion, how and where do users add answers to a question? → A: Users only add Questions; Answers are added by admins only.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Knowledge Feed (Priority: P1)

Users visit the homepage and browse the questions as a continuous feed. The experience is highly visual and engaging.

**Why this priority**: It is the primary way users interact with the content and consume knowledge.

**Independent Test**: Can be fully tested by loading the page and scrolling to observe the feed animations and content loading.

**Acceptance Scenarios**:

1. **Given** a user loads the single page app, **When** they scroll down, **Then** questions sequentially fade and slide up into view.
2. **Given** a user is viewing the feed, **When** they click on a question card, **Then** the shadcn/ui accordion smoothly expands to reveal read-only answers.

---

### User Story 2 - Add a New Question (Priority: P1)

Users can submit a new topic or question to the feed without authentication.

**Why this priority**: Ensures the platform can grow with user-generated topics.

**Independent Test**: Can be tested by filling out the form at the bottom of the feed and confirming it appears in the list.

**Acceptance Scenarios**:

1. **Given** a user navigates to the bottom of the page, **When** they submit the "Add Question" form with a valid title, **Then** the question is saved, the feed refreshes (`router.refresh()`), and the new question appears at the top.

### Edge Cases

- What happens when a user submits an empty question?
- How does the system handle rapid, multiple form submissions?
- What happens when the database connection to Neon serverless fails?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display all questions in a vertical, scrollable feed on a single page.
- **FR-002**: System MUST allow users to expand questions using an Accordion component to view existing answers.
- **FR-003**: System MUST restrict answers to be read-only for public users (NO Add Answer form inside the expanded accordion). Answers are provided exclusively by administrators in the backend.
- **FR-004**: System MUST allow users to submit new questions via a form at the bottom of the page.
- **FR-005**: System MUST NOT require or support user authentication.
- **FR-006**: System MUST enforce an exclusively Arabic language interface and Right-to-Left (RTL) layout.
- **FR-007**: System MUST enforce a light mode only, army-inspired modern design.
- **FR-008**: System MUST NOT support editing, deleting, comments, replies, categories, tags, or likes.

### Key Entities

- **Question**: Represents a topic. Contains `id` (PK), `title` (TEXT, required), `created_at` (timestamp).
- **Answer**: Represents the read-only content for a topic. Contains `id` (PK), `question_id` (FK), `content` (TEXT, required), `created_at` (timestamp).

## Technical Implementation Details

*Note: Added specifically as per user mandate, bypassing the general rule against implementation details in this specification document.*

### Folder Structure
```text
app/
├─ page.tsx
├─ design/               # Stitch UI components (raw design layout)
├─ components/           # Functional logic components
├─ api/
│   ├─ questions/route.ts
│   ├─ answers/route.ts
├─ lib/
│   ├─ db.ts
├─ styles/
```

### Page Structure
A single page application (`app/page.tsx`) following strict order:
1. **Hero Section**: Displays army-inspired imagery.
2. **Questions Feed**: Vertical feed of accordion items.
3. **Add Question Form**: Positioned at the very bottom.

### Components List
- `app/design/*`: Raw visual components provided by Stitch.
- `app/components/QuestionFeed`: Server Component responsible for initial data fetching and rendering the list.
- `app/components/QuestionAccordion`: Client Component handling the shadcn/ui Accordion trigger and content.
- `app/components/QuestionCard`: Displays the question title (Accordion Trigger).
- `app/components/AnswerList`: Displays the answers content (Accordion Content).
- `app/components/AddQuestionForm`: Client Component for question submission using Route Handlers and `router.refresh()`.

### Data Models
- **Questions**: `id` (Primary Key), `title` (TEXT, required), `created_at` (timestamp default now).
- **Answers**: `id` (Primary Key), `question_id` (Foreign Key -> questions.id), `content` (TEXT, required), `created_at` (timestamp default now).

### Animation Behavior (GSAP)
- **Scroll-based Question Reveal**: Uses `GSAP ScrollTrigger` with a fade and slide-up effect as each question enters the viewport.
- **Question Expand Animation**: Smooth expand/collapse of the answers section.
- **Micro-interactions**: Subtle hover effects on question cards, button click animations, and input focus animations.
- **Rules**: Must use `gsap.context()` for React integration and ensure proper cleanup.

### Styling Rules
- **Tailwind CSS** strictly.
- **Light mode** only.
- Follow the provided army-inspired Stitch design files.

### Accessibility Considerations
- Accordions must utilize `aria-expanded` and `aria-controls` (provided natively by shadcn/ui).
- Forms must have properly associated `<label>` elements or `aria-label` attributes.
- Keyboard navigation (Tab, Enter/Space) must be fully supported for expanding accordions and submitting forms.

### Arabic RTL Handling
- The HTML document must have `<html lang="ar" dir="rtl">`.
- Use logical Tailwind CSS properties for layout spacing (e.g., `ms-`, `me-`, `ps-`, `pe-` instead of `ml-`, `mr-`, `pl-`, `pr-`).
- Animations should be direction-aware if translating horizontally.

### Separation of Concerns
- Clear distinction between `app/design/` (pure layout from Stitch) and `app/components/` (React logic, state, and GSAP integration). Do not mix logic into the Stitch design files.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the UI layout properly displays in Right-to-Left (RTL) format without layout breakage.
- **SC-002**: Questions fade and slide in via GSAP without dropping below 60FPS on scrolling.
- **SC-003**: Submitting a new question successfully updates the feed seamlessly without requiring a hard page reload by the user.
- **SC-004**: The application strictly avoids any user authentication or editing workflows.

## Assumptions

- Neon PostgreSQL is already configured with valid connection strings in `.env.local`.
- Stitch design files (`app/design/`) are readily available and complete.
- Users have a modern browser capable of executing GSAP animations smoothly.
