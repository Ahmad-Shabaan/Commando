interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

const CACHE_TTL = 60_000;

export function getCachedAnswers<T>(questionId: number): T | null {
  const key = `answers:${questionId}`;
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCachedAnswers<T>(questionId: number, data: T): void {
  const key = `answers:${questionId}`;
  cache.set(key, { data, timestamp: Date.now() });
}

export function invalidateCache(questionId: number): void {
  const key = `answers:${questionId}`;
  cache.delete(key);
}

export function clearAllCache(): void {
  cache.clear();
}
