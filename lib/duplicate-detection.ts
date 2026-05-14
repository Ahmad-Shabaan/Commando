const ARABIC_DIACRITICS = /[\u064B-\u065F\u0670]/g;
const PUNCTUATION = /[،؟!.,;:\-–—()\[\]{}""'']/g;

const STOP_WORDS = new Set([
  "في", "من", "على", "إلى", "ما", "ماذا", "هل", "الذي", "التي", "و", "أو",
  "مع", "عن", "كان", "هذا", "هذه", "ذلك", "كل", "لا", "لم", "لن", "إن",
  "أن", "قد", "ثم", "حتى", "عند", "بعد", "قبل", "بين", "خلال", "دون",
  "غير", "نحو", "حول", "لـ", "بال", "لل", "ولـ", "فـ", "بـ",
  "the", "is", "in", "on", "to", "what", "how", "a", "an", "and", "or",
  "of", "for", "with", "at", "by", "from", "as", "was", "are", "be",
]);

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(ARABIC_DIACRITICS, "")
    .replace(PUNCTUATION, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractKeywords(text: string): string[] {
  const normalized = normalize(text);
  return normalized
    .split(/\s+/)
    .filter((word) => word.length >= 3 && !STOP_WORDS.has(word));
}

export function findDuplicate(
  inputTitle: string,
  existingTitles: { id: number; title: string }[],
  threshold = 0.6
): { id: number; title: string; score: number } | null {
  const inputKeywords = extractKeywords(inputTitle);
  if (inputKeywords.length === 0) return null;

  let bestMatch: { id: number; title: string; score: number } | null = null;

  for (const existing of existingTitles) {
    const existingKeywords = extractKeywords(existing.title);

    if (existingKeywords.length === 0) continue;

    const intersection = inputKeywords.filter((kw) =>
      existingKeywords.some((ek) => ek.includes(kw) || kw.includes(ek))// true | false
    ).length;

    const similarity = intersection / Math.max(inputKeywords.length, existingKeywords.length);

    if (similarity >= threshold && (!bestMatch || similarity > bestMatch.score)) {
      bestMatch = { id: existing.id, title: existing.title, score: similarity };
    }
  }

  return bestMatch;
}
