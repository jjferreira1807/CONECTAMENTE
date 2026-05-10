/**
 * Tiny structured logger. Outputs single-line JSON suitable for Vercel logs
 * or any log aggregator. Avoid `console.log` directly in route handlers.
 */
type Level = "info" | "warn" | "error";

interface LogPayload {
  msg: string;
  [k: string]: unknown;
}

function emit(level: Level, payload: LogPayload) {
  const line = JSON.stringify({ level, ts: new Date().toISOString(), ...payload });
  // eslint-disable-next-line no-console
  (level === "error" ? console.error : level === "warn" ? console.warn : console.log)(line);
}

export const log = {
  info: (msg: string, extra?: Record<string, unknown>) => emit("info", { msg, ...extra }),
  warn: (msg: string, extra?: Record<string, unknown>) => emit("warn", { msg, ...extra }),
  error: (msg: string, extra?: Record<string, unknown>) => emit("error", { msg, ...extra }),
};
