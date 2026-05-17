/**
 * Premium PDF layout for Conectamente worksheets.
 *
 * Aesthetic targets: Calm/Headspace journals — warm cream paper, soft amber
 * accents, serif headings, generous space. Functional content:
 *   • Episode/worksheet title + category + date
 *   • Mood pre/post (5-step scale, visual bullets)
 *   • All worksheet fields with appropriate space
 *   • Pequenas vitórias + intenções
 *   • Mini exercício de respiração
 *   • Footer with branding
 *
 * The page is intentionally A4 (595×842 pt) and respects safe margins so
 * print without scaling works perfectly. All assets are in-line — no fonts
 * or images to fetch, so generation is instant and offline-friendly.
 */
import { Document, Page, Text, View, StyleSheet, Font, Svg, Path, Circle, Line } from "@react-pdf/renderer";
import type { Worksheet } from "@/content/worksheets";

// Palette — warm cream paper + ink, calm amber + green accents
const COLOR = {
  paper:   "#F8F4ED",
  ink:     "#16202A",
  muted:   "#5C6470",
  hair:    "#E2DAC9",
  accent:  "#1E6E5A",   // therapeutic green
  amber:   "#B27A3C",   // amber gold
  amberSoft: "#F1E4CC",
  accentSoft: "#D9E8E1",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 44,
    paddingBottom: 56,
    paddingHorizontal: 52,
    backgroundColor: COLOR.paper,
    color: COLOR.ink,
    fontFamily: "Helvetica",
    fontSize: 10.5,
    // No page-level lineHeight: it propagates to every Text and breaks the
    // line-box maths for elements with very different fontSizes (title vs
    // body). Each Text now sets its own lineHeight explicitly.
  },

  // Header
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 36,
  },
  brand: {
    fontFamily: "Helvetica",
    fontSize: 9,
    letterSpacing: 4,
    color: COLOR.muted,
    textTransform: "uppercase",
    lineHeight: 1.2,
  },
  date: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: COLOR.muted,
    lineHeight: 1.2,
  },

  // Title block
  kicker: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: COLOR.accent,
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 10,
    lineHeight: 1.2,
  },
  // Explicit lineHeight so the title's bottom line-box descends only ~12pt
  // below the baseline, leaving clean room for the subtitle. The previous
  // inherited 1.5 line-height was crashing the subtitle into the title.
  title: {
    fontFamily: "Times-Roman",
    fontSize: 28,
    color: COLOR.ink,
    letterSpacing: -0.4,
    lineHeight: 1.12,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: "Helvetica",
    fontSize: 10.5,
    color: COLOR.muted,
    maxWidth: 440,
    lineHeight: 1.55,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: COLOR.hair,
    marginVertical: 24,
  },

  // Mood section
  moodSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLOR.hair,
    paddingHorizontal: 22,
    paddingVertical: 18,
  },
  moodSectionLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: COLOR.muted,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 14,
    lineHeight: 1.2,
  },
  moodRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  moodLabel: {
    fontFamily: "Times-Roman",
    fontSize: 12.5,
    color: COLOR.ink,
    width: 150,
    lineHeight: 1.2,
  },
  moodBullets: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  moodBullet: {
    width: 22, height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: COLOR.hair,
    alignItems: "center",
    justifyContent: "center",
  },
  moodBulletText: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: COLOR.muted,
    lineHeight: 1,
  },
  moodBulletTextFilled: {
    color: "#FFFFFF",
  },
  moodLegend: {
    fontFamily: "Helvetica",
    fontSize: 8.5,
    color: COLOR.muted,
    marginTop: 2,
    textAlign: "right",
    letterSpacing: 0.5,
    lineHeight: 1.2,
  },

  // Fields
  fieldGroup: { marginBottom: 18 },
  fieldLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: COLOR.ink,
    marginBottom: 4,
    letterSpacing: 0.3,
    textTransform: "uppercase",
    lineHeight: 1.3,
  },
  fieldHint: {
    fontFamily: "Helvetica-Oblique",
    fontSize: 9,
    color: COLOR.muted,
    marginBottom: 8,
    lineHeight: 1.3,
  },
  fillArea: {
    flexDirection: "column",
    gap: 14,
    marginTop: 6,
  },
  fillLine: {
    height: 1,
    backgroundColor: COLOR.hair,
  },
  fieldValue: {
    fontFamily: "Helvetica",
    fontSize: 10.5,
    color: COLOR.ink,
    lineHeight: 1.55,
    marginTop: 2,
  },

  // Panel / card
  panel: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLOR.hair,
    padding: 18,
    marginVertical: 14,
  },
  panelTitle: {
    fontFamily: "Times-Roman",
    fontSize: 13,
    color: COLOR.ink,
    marginBottom: 8,
    lineHeight: 1.25,
  },
  panelBody: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: COLOR.muted,
    lineHeight: 1.6,
  },

  // Breath panel
  breathPanel: {
    backgroundColor: COLOR.accentSoft,
    borderRadius: 14,
    padding: 18,
    marginVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  breathText: { flex: 1 },

  // Footer
  footer: {
    position: "absolute",
    bottom: 28,
    left: 52,
    right: 52,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontFamily: "Helvetica",
    fontSize: 8,
    color: COLOR.muted,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    lineHeight: 1.2,
  },
});

interface Props {
  worksheet: Worksheet;
  /** Optional answers keyed by field id — pre-fills the PDF when present. */
  answers?: Record<string, string>;
  /** ISO date string for the "data" header. Defaults to today (pt-PT). */
  isoDate?: string;
  /** Optional mood snapshots */
  moodBefore?: number | null;
  moodAfter?: number | null;
}

export function WorksheetPDF({
  worksheet, answers = {}, isoDate, moodBefore = null, moodAfter = null,
}: Props) {
  const dateLabel = formatDate(isoDate);
  const filled = (id: string) => (answers[id] ?? "").trim();

  return (
    <Document
      title={`${worksheet.title} · Conectamente`}
      author="Conectamente"
      subject={worksheet.description}
    >
      <Page size="A4" style={styles.page} wrap>
        {/* Header */}
        <View style={styles.topBar}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <BrandMark size={20} />
            <Text style={styles.brand}>CONECTAMENTE</Text>
          </View>
          <Text style={styles.date}>{dateLabel}</Text>
        </View>

        {/* Title block */}
        <View>
          <Text style={styles.kicker}>{worksheet.category.toUpperCase()}</Text>
          <Text style={styles.title}>{worksheet.title}</Text>
          <Text style={styles.subtitle}>{worksheet.intro}</Text>
        </View>

        <View style={styles.divider} />

        {/* Mood pre/post — agrupado num só painel, com números nos círculos
            e legenda única em baixo. Substitui a versão anterior em que cada
            linha tinha o seu próprio "1 mal · 5 bem", criando ruído visual. */}
        <View style={styles.moodSection}>
          <Text style={styles.moodSectionLabel}>Estado emocional</Text>

          <View style={styles.moodRow}>
            <Text style={styles.moodLabel}>Como me sinto antes</Text>
            <MoodScale value={moodBefore} />
          </View>
          <View style={styles.moodRow}>
            <Text style={styles.moodLabel}>Como me sinto depois</Text>
            <MoodScale value={moodAfter} />
          </View>

          <Text style={styles.moodLegend}>1 — muito mal · 5 — muito bem</Text>
        </View>

        <View style={styles.divider} />

        {/* Worksheet fields */}
        {worksheet.fields.map((f) => {
          const value = filled(f.id);
          const rows = f.rows && f.rows > 1 ? f.rows : 1;
          return (
            <View key={f.id} style={styles.fieldGroup} wrap={false}>
              <Text style={styles.fieldLabel}>{f.label}</Text>
              {f.hint && <Text style={styles.fieldHint}>{f.hint}</Text>}
              {value ? (
                // Filled value gets a subtle amber rule on the left for
                // hierarchy — distinguishes pre-filled answers from blank
                // fill-lines without changing typography weight.
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    marginTop: 4,
                    paddingLeft: 2,
                  }}
                >
                  <View
                    style={{
                      width: 2,
                      backgroundColor: COLOR.amber,
                      borderRadius: 1,
                      opacity: 0.65,
                    }}
                  />
                  <Text style={[styles.fieldValue, { flex: 1 }]}>{value}</Text>
                </View>
              ) : (
                <View style={styles.fillArea}>
                  {Array.from({ length: rows }).map((_, i) => (
                    <View key={i} style={styles.fillLine} />
                  ))}
                </View>
              )}
            </View>
          );
        })}

        {/* Mini exercise de respiração */}
        <View style={styles.breathPanel} wrap={false}>
          <BreathOrb />
          <View style={styles.breathText}>
            <Text style={styles.panelTitle}>Mini exercício · respiração 4-2-6</Text>
            <Text style={styles.panelBody}>
              Antes de fechar esta folha, respira durante 60 segundos. Inspira em 4
              tempos, sustém 2, expira em 6. Sente o peso do corpo. Não tens nada
              para resolver agora.
            </Text>
          </View>
        </View>

        {/* Pequenas vitórias + compromisso */}
        <View style={[styles.panel, { flexDirection: "row", gap: 18 }]} wrap={false}>
          <View style={{ flex: 1 }}>
            <Text style={styles.panelTitle}>Pequenas vitórias desta semana</Text>
            <View style={[styles.fillArea, { marginTop: 6 }]}>
              <View style={styles.fillLine} />
              <View style={styles.fillLine} />
              <View style={styles.fillLine} />
            </View>
          </View>
          <View style={{ width: 1, backgroundColor: COLOR.hair }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.panelTitle}>Compromisso pessoal</Text>
            <View style={[styles.fillArea, { marginTop: 6 }]}>
              <View style={styles.fillLine} />
              <View style={styles.fillLine} />
              <View style={styles.fillLine} />
            </View>
          </View>
        </View>

        {/* Optional closing line */}
        {worksheet.closing && (
          <View style={[styles.panel, { backgroundColor: COLOR.amberSoft, borderColor: COLOR.amberSoft }]} wrap={false}>
            <Text style={{ ...styles.panelBody, fontStyle: "italic", textAlign: "center" }}>
              {worksheet.closing}
            </Text>
          </View>
        )}

        {/* Footer */}
        <View fixed style={styles.footer}>
          <Text style={styles.footerText}>Psicoeducativo · não substitui acompanhamento profissional</Text>
          <Text style={styles.footerText}>conectamente.pt</Text>
        </View>
      </Page>
    </Document>
  );
}

/* ------------------------------------------------------------------------ */

function MoodScale({ value }: { value: number | null }) {
  return (
    <View style={styles.moodBullets}>
      {[1, 2, 3, 4, 5].map((n) => {
        const isFilled = value !== null && value !== undefined && value >= n;
        return (
          <View
            key={n}
            style={[
              styles.moodBullet,
              isFilled
                ? { backgroundColor: COLOR.amber, borderColor: COLOR.amber }
                : {},
            ]}
          >
            <Text
              style={[
                styles.moodBulletText,
                isFilled ? styles.moodBulletTextFilled : {},
              ]}
            >
              {n}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function BrandMark({ size = 24 }: { size?: number }) {
  // Mini logomark — 5 nodes + centre + balance dot
  const s = size;
  const c = s / 2;
  const nodes = [
    [c, s * 0.18], [s * 0.82, s * 0.34], [s * 0.82, s * 0.66],
    [c, s * 0.82], [s * 0.18, c],
  ];
  return (
    <Svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <Circle cx={c} cy={c} r={s * 0.42} stroke={COLOR.accent} strokeOpacity={0.35} strokeWidth={1} fill="none" />
      {nodes.map(([x, y], i) => (
        <Line key={i} x1={c} y1={c} x2={x} y2={y} stroke={COLOR.accent} strokeOpacity={0.6} strokeWidth={0.7} />
      ))}
      {nodes.map(([x, y], i) => (
        <Circle key={"n" + i} cx={x} cy={y} r={s * 0.06} fill={COLOR.accent} />
      ))}
      <Circle cx={c} cy={c} r={s * 0.08} fill={COLOR.accent} />
      <Circle cx={s * 0.74} cy={s * 0.78} r={s * 0.07} fill={COLOR.amber} />
    </Svg>
  );
}

function BreathOrb() {
  const s = 64;
  const c = s / 2;
  return (
    <Svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <Circle cx={c} cy={c} r={28} fill={COLOR.accent} fillOpacity={0.08} />
      <Circle cx={c} cy={c} r={20} fill={COLOR.accent} fillOpacity={0.16} />
      <Circle cx={c} cy={c} r={12} fill={COLOR.accent} />
      <Path
        d={`M ${c - 8} ${c} q 4 -6 8 0 q 4 6 8 0`}
        stroke="#fff"
        strokeWidth={1.2}
        fill="none"
      />
    </Svg>
  );
}

/* ------------------------------------------------------------------------ */

function formatDate(iso?: string) {
  const d = iso ? new Date(iso) : new Date();
  return d.toLocaleDateString("pt-PT", { day: "2-digit", month: "long", year: "numeric" });
}
