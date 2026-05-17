/**
 * Utility functions for generating SEO-friendly slugs from Arabic text
 */

// Mapping of common Arabic characters to Latin equivalents for transliteration
const arabicToLatinMap: Record<string, string> = {
  'ا': 'a', 'أ': 'a', 'إ': 'e', 'آ': 'a',
  'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'g', 'ح': 'h', 'خ': 'kh',
  'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh',
  'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh',
  'ف': 'f', 'ق': 'k', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
  'ه': 'h', 'و': 'w', 'ي': 'y', 'ى': 'a', 'ة': 'a', 'ئ': 'e', 'ؤ': 'o'
};

/**
 * Generates a transliterated Latin slug from Arabic text
 */
export function generateSlug(arabicText: string): string {
  if (!arabicText) return "";

  // Convert to array of characters, map to Latin, and join
  let slug = arabicText
    .split('')
    .map(char => arabicToLatinMap[char] || char)
    .join('');

  return slug
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric (except spaces and hyphens)
    .trim()
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-')          // Replace multiple hyphens with single hyphen
    .substring(0, 60);            // Truncate to a reasonable length
}

/**
 * Generates an Arabic-character slug (retains Arabic text but makes it URL-safe)
 */
export function arabicSlug(arabicText: string): string {
  if (!arabicText) return "";
  
  return arabicText
    .trim()
    .replace(/[^\u0621-\u064A0-9\s-]/g, '') // Keep only Arabic letters, numbers, spaces, hyphens
    .replace(/\s+/g, '-')                    // Replace spaces with hyphens
    .replace(/-+/g, '-')                     // Replace multiple hyphens with single hyphen
    .substring(0, 60);                       // Truncate
}
