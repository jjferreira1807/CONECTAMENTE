/**
 * Worksheet PDF — calm, intentional, non-dopaminergic.
 *
 * One typographic family (Helvetica, PDF built-in), one ink colour,
 * one subtle sage accent, generous whitespace. Page 1 holds the title,
 * mood pre/post and main fields. Page 2 holds the 4-2-6 breathing
 * prompt, "pequenas vitórias", "compromisso pessoal" and an optional
 * closing line. Footer is fixed on both pages.
 *
 * Margins: 20mm sides / 18mm top-bottom (A4 595×842 pt). Hair lines and
 * uppercase tracked labels replace the previous boxed cards. The amber
 * rule for filled answers and the decorative orbs have been removed.
 */
import { Document, Page, Text, View, StyleSheet, Svg, Circle } from "@react-pdf/renderer";
import type { Worksheet } from "@/content/worksheets";

// Helvetica is built into every PDF reader — zero network, instant
// generation, no risk of font fetch failure breaking the download.
// Hierarchy comes from weight (Helvetica vs Helvetica-Bold), size and
// tracking, not from family swaps.
const FONT = {
  regular: "Helvetica",
  medium:  "Helvetica-Bold",
  italic:  "Helvetica-Oblique",
};

// A4 margins: 20mm horizontal, 18mm vertical (1mm ≈ 2.835 pt)
const MARGIN_X = 57;
const MARGIN_Y = 51;

const COLOR = {
  paper:  "#FAFAF8",
  ink:    "#0F1117",
  muted:  "#6B7280",
  hair:   "#E5E3DE",
  accent: "#5E7166",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: MARGIN_Y,
    paddingBottom: MARGIN_Y,
    paddingHorizontal: MARGIN_X,
    backgroundColor: COLOR.paper,
    color: COLOR.ink,
    fontFamily: FONT.regular,
    fontSize: 11,
  },

  // Header band
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandText: {
    fontFamily: FONT.medium,
    fontSize: 9,
    color: COLOR.ink,
    letterSpacing: 3,
    textTransform: "uppercase",
    lineHeight: 1.2,
  },
  meta: {
    fontFamily: FONT.regular,
    fontSize: 9,
    color: COLOR.muted,
    letterSpacing: 0.4,
    lineHeight: 1.2,
  },

  // Subtle divider
  rule: {
    height: 1,
    backgroundColor: COLOR.hair,
    marginVertical: 18,
  },
  ruleTight: {
    height: 1,
    backgroundColor: COLOR.hair,
    marginVertical: 12,
  },

  // Title block
  kicker: {
    fontFamily: FONT.medium,
    fontSize: 8.5,
    color: COLOR.accent,
    letterSpacing: 2.4,
    textTransform: "uppercase",
    marginBottom: 14,
    lineHeight: 1.2,
  },
  title: {
    fontFamily: FONT.regular,
    fontSize: 26,
    color: COLOR.ink,
    letterSpacing: -0.2,
    lineHeight: 1.15,
    marginBottom: 10,
  },
  intro: {
    fontFamily: FONT.italic,
    fontSize: 10,
    color: COLOR.muted,
    maxWidth: 440,
    lineHeight: 1.55,
  },

  // Compact mood row
  moodRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  moodLabel: {
    fontFamily: FONT.medium,
    fontSize: 8.5,
    color: COLOR.muted,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    lineHeight: 1.2,
  },
  moodGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  moodDots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  moodDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 0.8,
    borderColor: COLOR.hair,
  },
  moodLegend: {
    fontFamily: FONT.regular,
    fontSize: 8,
    color: COLOR.muted,
    letterSpacing: 0.4,
    lineHeight: 1.2,
  },

  // Field group
  field: {
    marginBottom: 22,
  },
  fieldLabel: {
    fontFamily: FONT.medium,
    fontSize: 8.5,
    color: COLOR.muted,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 6,
    lineHeight: 1.3,
  },
  fieldHint: {
    fontFamily: FONT.italic,
    fontSize: 9.5,
    color: COLOR.muted,
    marginBottom: 10,
    lineHeight: 1.45,
  },
  fieldValue: {
    fontFamily: FONT.regular,
    fontSize: 10.5,
    color: COLOR.ink,
    lineHeight: 1.6,
    marginTop: 4,
  },
  fillStack: {
    flexDirection: "column",
    gap: 16,
    marginTop: 4,
  },
  fillLine: {
    height: 0.8,
    backgroundColor: COLOR.hair,
  },

  // Section heading (page 2)
  section: {
    marginBottom: 18,
  },
  sectionLabel: {
    fontFamily: FONT.medium,
    fontSize: 8.5,
    color: COLOR.muted,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 8,
    lineHeight: 1.3,
  },
  sectionTitle: {
    fontFamily: FONT.regular,
    fontSize: 14,
    color: COLOR.ink,
    letterSpacing: -0.1,
    marginBottom: 6,
    lineHeight: 1.3,
  },
  sectionBody: {
    fontFamily: FONT.regular,
    fontSize: 10.5,
    color: COLOR.ink,
    lineHeight: 1.65,
    maxWidth: 440,
  },

  // Two-column block (vitórias + compromisso)
  twoCol: {
    flexDirection: "row",
    gap: 32,
    marginTop: 6,
  },
  twoColItem: {
    flex: 1,
  },

  // Closing line
  closing: {
    fontFamily: FONT.italic,
    fontSize: 10.5,
    color: COLOR.muted,
    textAlign: "center",
    lineHeight: 1.55,
    marginTop: 8,
  },

  // Footer (fixed both pages)
  footer: {
    position: "absolute",
    left: MARGIN_X,
    right: MARGIN_X,
    bottom: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontFamily: FONT.medium,
    fontSize: 8,
    color: COLOR.muted,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    lineHeight: 1.2,
  },
});

interface Props {
  worksheet: Worksheet;
  /** Optional answers keyed by field id — pre-fills the PDF when present. */
  answers?: Record<string, string>;
  /** ISO date string for the header. Defaults to today (pt-PT). */
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
        {/* Header — mark + brand left · date right */}
        <View style={styles.header}>
          <View style={styles.brand}>
            <BrandDot />
            <Text style={styles.brandText}>Conectamente</Text>
          </View>
          <Text style={styles.meta}>{dateLabel}</Text>
        </View>

        <View style={styles.rule} />

        {/* Title block */}
        <View>
          <Text style={styles.kicker}>{worksheet.category}</Text>
          <Text style={styles.title}>{worksheet.title}</Text>
          <Text style={styles.intro}>{worksheet.intro}</Text>
        </View>

        <View style={styles.rule} />

        {/* Estado emocional · antes (compacto, no topo) */}
        <View style={styles.moodRow}>
          <Text style={styles.moodLabel}>Estado emocional · antes</Text>
          <View style={styles.moodGroup}>
            <MoodDots value={moodBefore} />
            <Text style={styles.moodLegend}>1 — mal · 5 — bem</Text>
          </View>
        </View>

        <View style={styles.ruleTight} />

        {/* Main fields */}
        <View style={{ marginTop: 10 }}>
          {worksheet.fields.map((f) => {
            const value = filled(f.id);
            const rows = f.rows && f.rows > 1 ? f.rows : 1;
            return (
              <View key={f.id} style={styles.field} wrap={false}>
                <Text style={styles.fieldLabel}>{f.label}</Text>
                {f.hint && <Text style={styles.fieldHint}>{f.hint}</Text>}
                {value ? (
                  <Text style={styles.fieldValue}>{value}</Text>
                ) : (
                  <View style={styles.fillStack}>
                    {Array.from({ length: rows }).map((_, i) => (
                      <View key={i} style={styles.fillLine} />
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.ruleTight} />

        {/* Estado emocional · depois */}
        <View style={styles.moodRow}>
          <Text style={styles.moodLabel}>Estado emocional · depois</Text>
          <View style={styles.moodGroup}>
            <MoodDots value={moodAfter} />
            <Text style={styles.moodLegend}>1 — mal · 5 — bem</Text>
          </View>
        </View>

        {/* Force page 2 — breath exercise + reflections live on a fresh page */}
        <View break>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Mini exercício · respiração 4-2-6</Text>
            <Text style={styles.sectionTitle}>Sessenta segundos antes de fechar a folha</Text>
            <Text style={styles.sectionBody}>
              Inspira em 4 tempos, sustém 2, expira em 6. Sente o peso do corpo,
              os pés no chão, o ar a sair mais devagar do que entrou. Não tens
              nada para resolver agora.
            </Text>
          </View>

          <View style={styles.rule} />

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Pequenas vitórias desta semana</Text>
            <View style={styles.fillStack}>
              <View style={styles.fillLine} />
              <View style={styles.fillLine} />
              <View style={styles.fillLine} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Compromisso pessoal</Text>
            <View style={styles.fillStack}>
              <View style={styles.fillLine} />
              <View style={styles.fillLine} />
              <View style={styles.fillLine} />
            </View>
          </View>

          {worksheet.closing ? (
            <View>
              <View style={styles.ruleTight} />
              <Text style={styles.closing}>{worksheet.closing}</Text>
            </View>
          ) : null}
        </View>

        {/* Footer — fixed on every page */}
        <View fixed style={styles.footer}>
          <Text style={styles.footerText}>
            Psicoeducativo · não substitui acompanhamento profissional
          </Text>
          <Text style={styles.footerText}>conectamente.pt</Text>
        </View>
      </Page>
    </Document>
  );
}

/* ------------------------------------------------------------------------ */

function MoodDots({ value }: { value: number | null }) {
  return (
    <View style={styles.moodDots}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = value !== null && value !== undefined && value >= n;
        return (
          <View
            key={n}
            style={[
              styles.moodDot,
              filled
                ? { backgroundColor: COLOR.accent, borderColor: COLOR.accent }
                : {},
            ]}
          />
        );
      })}
    </View>
  );
}

function BrandDot() {
  // A single 7pt sage circle — minimal, no fan, no amber accent.
  return (
    <Svg width={7} height={7} viewBox="0 0 7 7">
      <Circle cx={3.5} cy={3.5} r={3.5} fill={COLOR.accent} />
    </Svg>
  );
}

/* ------------------------------------------------------------------------ */

function formatDate(iso?: string) {
  const d = iso ? new Date(iso) : new Date();
  return d.toLocaleDateString("pt-PT", { day: "2-digit", month: "long", year: "numeric" });
}
