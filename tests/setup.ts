import { vi } from "vitest";

export function createMockRequest(
  url: string,
  options?: { method?: string; body?: unknown; headers?: Record<string, string> }
): Request {
  const { method = "GET", body, headers = {} } = options ?? {};
  const init: RequestInit = {
    method,
    headers: { "Content-Type": "application/json", ...headers },
  };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }
  return new Request(url, init);
}

export const mockDb = vi.fn();
export const mockCheckRateLimit = vi.fn();
export const mockGetCachedAnswers = vi.fn();
export const mockSetCachedAnswers = vi.fn();
export const mockInvalidateCache = vi.fn();
