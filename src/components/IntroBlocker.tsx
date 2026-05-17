/**
 * SSR-rendered black overlay. Prevents the "flash of content then loader
 * covers it" race condition: from the very first byte the browser receives,
 * a black opaque overlay covers the viewport. The client-side IntroLoader
 * later either fades it out (no intro) or transitions into the cutscene.
 *
 * Uses a plain inline `<script>` (the documented App Router pattern for
 * pre-paint logic) rather than `next/script`'s `beforeInteractive` strategy,
 * which ESLint flags outside `pages/_document`.
 */
// The cutscene plays on every load (it's part of the product, not a
// first-visit-only flourish). Only prefers-reduced-motion forces skip.
const inlineScript = `
  try {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var url = new URL(window.location.href);
    var force = url.searchParams.get('intro') === '1';
    document.documentElement.dataset.intro = (reduced && !force) ? 'skip' : 'play';
  } catch (e) {
    document.documentElement.dataset.intro = 'play';
  }
`;

export function IntroBlocker() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: inlineScript }} />

      <div
        id="intro-blocker"
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background:
            "radial-gradient(120% 80% at 50% 50%, #0a1322 0%, #04060a 60%, #000 100%)",
          pointerEvents: "auto",
        }}
      />
    </>
  );
}
