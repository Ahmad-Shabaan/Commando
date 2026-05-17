export type AnswerItemType = "text" | "link" | "location";

export interface AnswerItem {
  type: AnswerItemType;
  text?: string;
  href?: string;
  label?: string;
}

export interface Question {
  id: number;
  title: string;
  created_at: string;
  slug: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  primary_keyword?: string | null;
}

export interface Answer {
  id: number;
  question_id: number;
  content: string;
  content_items: AnswerItem[] | null;
  is_short: boolean;
  created_at: string;
}

export interface QuestionWithSnippet extends Question {
  snippet: string | null;
}

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://komando.store";

export function parseContentItems(
  content_items: unknown,
  fallbackContent?: string
): AnswerItem[] {
  if (Array.isArray(content_items)) return content_items;
  if (typeof content_items === "string") {
    try {
      const parsed = JSON.parse(content_items);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }
  if (fallbackContent) {
    return [{ type: "text" as const, text: fallbackContent }];
  }
  return [];
}

export function flattenAnswerItems(answer: Answer): string {
  const items = parseContentItems(answer.content_items, answer.content);
  return items.map((i) => i.text || i.label || "").join(" ");
}
