"use client";
import { useEffect, useState } from "react";
import type { Worksheet } from "@/content/worksheets";
import Link from "next/link";
import { ArrowLeft, Printer, Trash } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { remote } from "@/lib/sync/pushers";

/**
 * Print-optimised worksheet. Saves the user's input to localStorage so they
 * can return; "Imprimir" triggers the native print dialog (browser handles
 * "Save as PDF").
 */
export function WorksheetView({ worksheet }: { worksheet: Worksheet }) {
  const storageKey = `conectamente.ws.${worksheet.slug}`;
  const [data, setData] = useState<Record<string, string>>({});
  // Gate persistence on read completion. Without this, the write effect
  // would run on first mount with the initial `{}` and overwrite the saved
  // data before the read effect's state update lands on the next render.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setData(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(storageKey, JSON.stringify(data)); } catch {}
  }, [hydrated, data, storageKey]);

  const reset = () => { setData({}); };

  return (
    <article className="max-w-3xl mx-auto">
      <div className="no-print flex items-center justify-between flex-wrap gap-3 mb-8">
        <Link href="/fichas" className="text-sm text-muted hover:text-ink inline-flex items-center gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Todas as fichas
        </Link>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={reset}>
            <Trash className="h-4 w-4" /> Limpar
          </Button>
          <Button
            size="sm"
            onClick={() => {
              remote.download({ resource: `fichas/${worksheet.slug}`, format: "print" });
              remote.analytics({ kind: "download", attrs: { resource: worksheet.slug } });
              window.print();
            }}
          >
            <Printer className="h-4 w-4" /> Imprimir / PDF
          </Button>
        </div>
      </div>

      <header className="border-b border-border pb-6 mb-8">
        <p className="text-xs uppercase tracking-wider text-muted">{worksheet.category}</p>
        <h1 className="heading-display text-3xl md:text-5xl mt-2">{worksheet.title}</h1>
        <p className="prose-soft mt-3 max-w-xl">{worksheet.intro}</p>
      </header>

      <dl className="space-y-7">
        {worksheet.fields.map((f) => (
          <div key={f.id}>
            <dt className="text-sm font-medium">{f.label}</dt>
            {f.hint && <p className="text-xs text-muted mt-0.5">{f.hint}</p>}
            <dd className="mt-2">
              {f.rows && f.rows > 1 ? (
                <textarea
                  rows={f.rows}
                  value={data[f.id] ?? ""}
                  onChange={(e) => setData((d) => ({ ...d, [f.id]: e.target.value }))}
                  className="w-full bg-bg/40 hairline rounded-xl p-3 outline-none focus:border-accent resize-none print:bg-transparent print:border-b print:border-x-0 print:border-t-0 print:rounded-none print:p-0"
                />
              ) : (
                <input
                  value={data[f.id] ?? ""}
                  onChange={(e) => setData((d) => ({ ...d, [f.id]: e.target.value }))}
                  className="w-full bg-bg/40 hairline rounded-xl p-3 outline-none focus:border-accent print:bg-transparent print:border-b print:border-x-0 print:border-t-0 print:rounded-none print:p-0"
                />
              )}
            </dd>
          </div>
        ))}
      </dl>

      {worksheet.closing && (
        <p className="mt-12 italic text-center prose-soft border-t border-border pt-8">
          {worksheet.closing}
        </p>
      )}
    </article>
  );
}
