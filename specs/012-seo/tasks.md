# SEO Multi-Page Architecture — Tasks

**Feature**: Transform single-page Q&A app into multi-page SEO-optimized website
**Branch**: `012-seo`
**Priority**: Critical — current architecture is invisible to Google

---

## Context

The current site renders ALL content client-side with `{ ssr: false }`:
- `ClientHome.tsx` uses `dynamic(() => import(...), { ssr: false })`
- Questions are fetched via client-side `fetch("/api/questions")`
- Google sees an **empty page** — zero indexable content
- No unique URLs per question — all content lives on `/`

This must change to a multi-page, server-rendered architecture.

---

## Phase 0: Database Schema Changes

### Task 0.1 — Add `slug` column to questions table
- [ ] Create migration `sql/005_add_slug_to_questions.sql`
- Add `slug TEXT UNIQUE` column to `questions` table
- Generate slugs from existing titles using a safe Arabic-to-slug function
- Slug format: Arabic text is fine for URLs (Google supports it)
  - Example: `ما-هي-شروط-التقديم-للخدمة-العسكرية`
  - Alternative transliterated: `shorot-el-takdeem-lel-khedma`
- Decision: Use **transliterated slugs** — better for URL sharing and avoiding encoding issues

```sql
ALTER TABLE questions ADD COLUMN slug TEXT UNIQUE;
ALTER TABLE questions ADD COLUMN seo_title TEXT;
ALTER TABLE questions ADD COLUMN seo_description TEXT;
ALTER TABLE questions ADD COLUMN primary_keyword TEXT;
```

### Task 0.2 — Add `is_short` column to answers table
- [ ] Create migration `sql/006_add_is_short_to_answers.sql`
- Add `is_short BOOLEAN DEFAULT FALSE` to mark snippet-optimized short answers (40–80 words)
- Each question should have ONE short answer (for featured snippets) and optionally a detailed answer

```sql
ALTER TABLE answers ADD COLUMN is_short BOOLEAN DEFAULT FALSE;
```

### Task 0.3 — Create slug utility function
- [ ] Create `lib/slug.ts`
- Function `generateSlug(arabicTitle: string): string` that:
  - Transliterates Arabic → Latin characters
  - Replaces spaces with hyphens
  - Removes special characters
  - Lowercases everything
  - Truncates to ~60 chars max
- Function `arabicSlug(title: string): string` (alternative, keeps Arabic)
- Export both, use transliterated as default

### Task 0.4 — Seed existing questions with slugs
- [ ] Create `sql/007_seed_slugs.sql` or a Node script `scripts/seed-slugs.ts`
- For each existing question without a slug, generate one from the title
- Ensure uniqueness (append `-2`, `-3` if duplicate)

---

## Phase 1: Question Detail Pages (HIGHEST SEO IMPACT)

### Task 1.1 — Create question detail page route
- [ ] Create `app/tajneed/[slug]/page.tsx`
- This is a **Server Component** (NO "use client")
- Fetch question + answers from DB by slug
- Render:
  - `<h1>` = question title (SEO keyword in heading)
  - Short answer block (snippet-optimized, 40–80 words)
  - Full detailed answer(s) below
  - Related questions sidebar/section (internal links)
- If question not found → call `notFound()`

```tsx
// Structure:
// app/tajneed/[slug]/page.tsx
import { notFound } from "next/navigation";
import sql from "@/lib/db";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const [question] = await sql`SELECT * FROM questions WHERE slug = ${slug}`;
  if (!question) return {};
  return {
    title: question.seo_title || question.title,
    description: question.seo_description || `إجابة شاملة عن: ${question.title}`,
    keywords: [question.primary_keyword, "التجنيد في مصر", "الخدمة العسكرية"].filter(Boolean),
    alternates: { canonical: `/tajneed/${slug}` },
  };
}

export default async function QuestionPage({ params }: Props) {
  // Fetch and render question + answers server-side
}
```

### Task 1.2 — Add `generateStaticParams` for pre-rendering
- [ ] In `app/tajneed/[slug]/page.tsx`, export `generateStaticParams`
- Fetches all question slugs from DB
- Enables static generation at build time (ISR)

```tsx
export async function generateStaticParams() {
  const questions = await sql`SELECT slug FROM questions WHERE slug IS NOT NULL`;
  return questions.map((q) => ({ slug: q.slug }));
}
```

### Task 1.3 — Per-page FAQ JSON-LD
- [ ] In each question page, render `FAQPage` JSON-LD with just that question
- This is more targeted than the homepage catch-all schema

```tsx
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [{
    "@type": "Question",
    name: question.title,
    acceptedAnswer: {
      "@type": "Answer",
      text: shortAnswer.content,
    },
  }],
};
```

### Task 1.4 — Breadcrumb structured data per question page
- [ ] Add BreadcrumbList JSON-LD to each question page:
  - Home → التجنيد → [Question Title]

---

## Phase 2: Category Page

### Task 2.1 — Create category listing page
- [ ] Create `app/tajneed/page.tsx`
- Server Component — fetches all questions from DB
- Render as a structured list with:
  - `<h1>` = "أسئلة وأجوبة عن التجنيد والخدمة العسكرية في مصر"
  - Each question as a link `<a href="/tajneed/{slug}">` (crawlable!)
  - Short preview of the answer (first 100 chars)
  - Organized by topic groups if possible
- Page metadata:
  - title: "أسئلة شائعة عن التجنيد في مصر | كوماندو"
  - description: targeting "التجنيد في مصر" keyword cluster

### Task 2.2 — Category page metadata
- [ ] Export `metadata` object with:
  - SEO-optimized title targeting "التجنيد في مصر"
  - Description with primary keywords
  - Canonical URL `/tajneed`

---

## Phase 3: Homepage SSR Fix (CRITICAL)

### Task 3.1 — Server-render questions on homepage
- [ ] Refactor `app/page.tsx` to fetch questions server-side
- Remove `{ ssr: false }` from ClientHome.tsx dynamic imports, or better:
- Fetch questions in `page.tsx` (Server Component) and pass as props
- The accordion interaction can remain client-side, but the question LIST must be in the initial HTML
- Google must see the question titles when it crawls `/`

### Task 3.2 — Add crawlable links on homepage
- [ ] Each question in the feed must also be an `<a href="/tajneed/{slug}">` link
- This creates internal links that Google can follow
- The accordion expand behavior can work alongside the link (e.g., clicking the title expands, but there's also a "اقرأ المزيد" link)

---

## Phase 4: Internal Linking System

### Task 4.1 — Related questions component
- [ ] Create `components/RelatedQuestions.tsx`
- Server Component that takes current `questionId` and fetches 3–5 other questions
- Renders as a list of links: `<a href="/tajneed/{slug}">{title}</a>`
- Used on every question detail page
- Selection logic: random or keyword-based (can start with random)

### Task 4.2 — Back-to-category link
- [ ] On every question page, add a link back to `/tajneed`
- Text: "← المزيد من الأسئلة الشائعة"
- On category page, add link back to `/` (homepage)

### Task 4.3 — Footer navigation update
- [ ] Update `components/Footer.tsx` to include:
  - Link to `/tajneed` (category page)
  - "الأسئلة الشائعة" section with top 5 question links

---

## Phase 5: Dynamic Sitemap

### Task 5.1 — Update sitemap to include all question pages
- [ ] Modify `app/sitemap.ts` to:
  - Fetch all questions with slugs from DB
  - Generate URL entries for each: `https://komando.store/tajneed/{slug}`
  - Include the category page: `https://komando.store/tajneed`
  - Keep the homepage entry

```tsx
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://komando.store";
  const questions = await sql`SELECT slug, created_at FROM questions WHERE slug IS NOT NULL`;

  const questionUrls = questions.map((q) => ({
    url: `${siteUrl}/tajneed/${q.slug}`,
    lastModified: new Date(q.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl}/tajneed`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    ...questionUrls,
  ];
}
```

### Task 5.2 — Update robots.ts
- [ ] Ensure `/tajneed/` routes are allowed (they already are by default)
- No changes needed unless new exclusions arise

---

## Phase 6: API Route for Slug-Based Fetch

### Task 6.1 — Create slug-based question API
- [ ] Create `app/api/questions/[slug]/route.ts`
- GET handler: fetch question + answers by slug
- Returns full question data with all answers
- Used by the detail page (or just use direct DB queries in Server Components)

**Note**: For Server Components, direct DB queries in the page are preferred over API routes. The API route is optional — only needed if client components also need slug-based fetching.

---

## Phase 7: Question Detail Page UI

### Task 7.1 — Design the question detail page layout
- [ ] Create `components/QuestionDetail.tsx`
- Layout structure:
  - Hero section with question title as `<h1>`
  - Short answer box (highlighted, snippet-style)
  - Detailed answer section
  - Related questions section
  - "اطرح سؤالك" CTA linking back to homepage form
- Use existing design system tokens (colors, typography)
- Arabic RTL layout

### Task 7.2 — Short answer snippet component
- [ ] Create `components/ShortAnswer.tsx`
- Renders the `is_short = true` answer in a highlighted box
- Designed to match Google's featured snippet format:
  - 40–80 words
  - Clear, direct answer
  - Visually distinct from detailed answers

---

## Phase 8: Polish & Validation

### Task 8.1 — Verify all pages build correctly
- [ ] Run `next build` and confirm zero errors
- [ ] Verify `/tajneed` and `/tajneed/[slug]` appear in build output

### Task 8.2 — Test structured data
- [ ] Use Google Rich Results Test on each page type
- [ ] Verify FAQPage schema validates
- [ ] Verify BreadcrumbList schema validates

### Task 8.3 — Test internal links
- [ ] Crawl the site manually: homepage → category → question → related → back
- [ ] Ensure no broken links
- [ ] Ensure all question pages are reachable from homepage within 2 clicks

### Task 8.4 — Submit to Google Search Console
- [ ] Submit updated sitemap
- [ ] Request indexing for key pages
- [ ] Monitor crawl coverage

---

## Dependency Order

```
Phase 0 (DB) → Phase 1 (Detail pages) → Phase 2 (Category page)
                                        ↓
Phase 3 (Homepage SSR) ─────────────────┤
                                        ↓
Phase 4 (Internal links) → Phase 5 (Sitemap) → Phase 6 (API, optional)
                                                        ↓
Phase 7 (UI polish) → Phase 8 (Validation)
```

---

## Key Constraints

- **Arabic RTL**: All new pages must use `dir="rtl"` and Arabic content
- **No Auth**: Keep public read-only model
- **Existing homepage**: Don't break the current feed — enhance it
- **Server-first**: Question pages MUST be Server Components for SEO
- **No new dependencies**: Use existing stack (Next.js 16, Tailwind, shadcn, Neon)
