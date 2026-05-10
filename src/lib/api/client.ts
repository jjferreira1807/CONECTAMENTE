/**
 * Tiny typed fetch wrapper for our API. Always returns the unwrapped data on
 * success or throws a typed ApiError. Use from client components.
 */
import type { ApiResponse } from "./response";

export class ApiError extends Error {
  code: string;
  status: number;
  details?: unknown;
  constructor(code: string, message: string, status: number, details?: unknown) {
    super(message); this.code = code; this.status = status; this.details = details;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    credentials: "include",
    cache: "no-store",
  });
  let body: ApiResponse<T> | null = null;
  try { body = await res.json() as ApiResponse<T>; } catch {}
  if (!body || !body.ok) {
    const code = body?.error?.code ?? `http_${res.status}`;
    const msg = body?.error?.message ?? res.statusText;
    throw new ApiError(code, msg, res.status, body?.error?.details);
  }
  return body.data;
}

export const api = {
  get:    <T>(p: string) => request<T>(p),
  post:   <T>(p: string, b: unknown) => request<T>(p, { method: "POST",   body: JSON.stringify(b) }),
  patch:  <T>(p: string, b: unknown) => request<T>(p, { method: "PATCH",  body: JSON.stringify(b) }),
  del:    <T>(p: string) => request<T>(p, { method: "DELETE" }),
};
