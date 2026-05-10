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
    paddingTop: 40,
    paddingBottom: 48,
    paddingHorizontal: 48,
    backgroundColor: COLOR.paper,
    color: COLOR.ink,
    fontFamily: "Helvetica",
    fontSize: 10.5,
    lineHeight: 1.5,
  },

  // Header
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  brand: {
    fontFamily: "Helvetica",
    fontSize: 9,
    letterSpacing: 4,
    color: COLOR.muted,
    textTransform: "uppercase",
  },
  date: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: COLOR.muted,
  },

  // Title block
  kicker: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: COLOR.accent,
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: {
    fontFamily: "Times-Roman",
    fontSize: 26,
    color: COLOR.ink,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: "Helvetica",
    fontSize: 11,
    color: COLOR.muted,
    marginTop: 8,
    maxWidth: 420,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: COLOR.hair,
    marginVertical: 22,
  },

  // Mood section
  moodRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  moodLabel: {
    fontFamily: "Times-Roman",
    fontSize: 13,
    color: COLOR.ink,
    width: 130,
  },
  moodBullets: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  moodBullet: {
    width: 18, height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: COLOR.hair,
  },
  moodCaption: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: COLOR.muted,
    marginLeft: 10,
  },

  // Fields
  fieldGroup: { marginBottom: 18 },
  fieldLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: COLOR.ink,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  fieldHint: {
    fontFamily: "Helvetica-Oblique",
    fontSize: 9,
    color: COLOR.muted,
    marginBottom: 8,
  },
  // Lined fill-in area (uses faint underlines)
  fillArea: {
    flexDirection: "column",
    gap: 14,
    marginTop: 4,
  },
  fillLine: {
    height: 1,
    backgroundColor: COLOR.hair,
  },
  // Pre-filled value when answers are provided
  fieldValue: {
    fontFamily: "Helvetica",
    fontSize: 10.5,
    color: COLOR.ink,
    lineHeight: 1.55,
  },

  // Card / panel
  panel: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLOR.hair,
    padding: 18,
    marginVertical: 12,
  },
  panelTitle: {
    fontFamily: "Times-Roman",
    fontSize: 13,
    color: COLOR.ink,
    marginBottom: 8,
  },
  panelBody: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: COLOR.muted,
    lineHeight: 1.6,
  },

  // Mini exercise (breath)
  breathPanel: {
    backgroundColor: COLOR.accentSoft,
    borderRadius: 14,
    padding: 18,
    marginVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  breathText: { flex: 1 },

  // Footer
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
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

        {/* Title */}
        <Text style={styles.kicker}>{worksheet.category.toUpperCase()}</Text>
        <Text style={styles.title}>{worksheet.title}</Text>
        <Text style={styles.subtitle}>{worksheet.intro}</Text>

        <View style={styles.divider} />

        {/* Mood pre/post */}
        <View style={styles.moodRow}>
          <Text style={styles.moodLabel}>Como me sinto antes</Text>
          <MoodScale value={moodBefore} />
        </View>
        <View style={{ height: 12 }} />
        <View style={styles.moodRow}>
          <Text style={styles.moodLabel}>Como me sinto depois</Text>
          <MoodScale value={moodAfter} />
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
                <Text style={styles.fieldValue}>{value}</Text>
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
          <Text style={styles.footerText}>Conteúdo psicoeducativo · não substitui acompanhamento clínico</Text>
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
      {[1, 2, 3, 4, 5].map((n) => (
        <View
          key={n}
          style={[
            styles.moodBullet,
            value && value >= n
              ? { backgroundColor: COLOR.amber, borderColor: COLOR.amber }
              : {},
          ]}
        />
      ))}
      <Text style={styles.moodCaption}>1 mal · 5 bem</Text>
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
