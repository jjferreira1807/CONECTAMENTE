import { NextResponse } from "next/server";

/**
 * Tiny response helpers. All API responses follow the same envelope so the
 * frontend can rely on a single shape: `{ ok: true, data }` or `{ ok: false, error }`.
 */
export type ApiOk<T> = { ok: true; data: T };
export type ApiErr = { ok: false; error: { code: string; message: string; details?: unknown } };
export type ApiResponse<T> = ApiOk<T> | ApiErr;

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json<ApiOk<T>>({ ok: true, data }, init);
}

export function fail(
  code: string,
  message: string,
  status = 400,
  details?: unknown
) {
  return NextResponse.json<ApiErr>(
    { ok: false, error: { code, message, ...(details ? { details } : {}) } },
    { status }
  );
}

// Common errors
export const errUnauthorised = () => fail("unauthorised", "Não autenticado.", 401);
export const errForbidden = () => fail("forbidden", "Sem permissão.", 403);
export const errNotFound = (what = "Recurso") => fail("not_found", `${what} não encontrado.`, 404);
export const errInvalid = (details?: unknown) =>
  fail("invalid_input", "Pedido inválido.", 422, details);
export const errRateLimited = () => fail("rate_limited", "Demasiados pedidos. Tenta de novo em breve.", 429);
export const errServer = (msg = "Erro interno.") => fail("server_error", msg, 500);
export const errMisconfigured = () =>
  fail("misconfigured", "Backend não configurado. Adiciona as variáveis Supabase.", 503);
