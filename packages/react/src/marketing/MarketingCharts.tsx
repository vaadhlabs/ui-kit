/**
 * MarketingCharts — animated SVG data-viz + the sections that frame them
 * (Phase 5). Ported from the TensorCost design system's charts.jsx.
 *
 *   SavingsLine  — projected-vs-controlled spend with a shaded savings wedge
 *   MiniDonut    — single-value ring
 *   MiniBars     — small bar chart
 *   UtilHeatmap  — utilization grid (idle cells = wasted money)
 *   SavingsChart — section: copy + SavingsLine
 *   FeatureViz   — section: donut / bars / heatmap trio
 *
 * All animate on scroll-into-view (see _motion), respect reduced motion, and
 * use the brand blue→cyan palette (self-contained, not MUI `primary`).
 */
import { type ReactElement } from "react";
import { Box, Typography } from "@mui/material";
import { useScrollProgress } from "./_motion.js";
import { useSurfaces, type Surfaces } from "./_surfaces.js";

const BLUE = "#3B82F6";

/* ---- SavingsLine ---- */
export function SavingsLine({ height = 300 }: { height?: number }): ReactElement {
  const s = useSurfaces();
  const [ref, p] = useScrollProgress(1700);
  const W = 720, H = height, padL = 16, padR = 16, padT = 24, padB = 36;
  const iw = W - padL - padR, ih = H - padT - padB, n = 12;
  const without = Array.from({ length: n }, (_, i) => 40 + i * i * 0.62 + i * 2.2);
  const withT = Array.from({ length: n }, (_, i) => {
    const base = 40 + i * i * 0.62 + i * 2.2;
    const cut = Math.min(1, Math.max(0, (i - 2) / 6)) * 0.46;
    return base * (1 - cut);
  });
  const maxY = Math.max(...without) * 1.08;
  const x = (i: number) => padL + (iw * i) / (n - 1);
  const y = (v: number) => padT + ih - (ih * v) / maxY;
  const lineP = (arr: number[], prog: number) => {
    const cut = Math.max(1, Math.round((n - 1) * prog) + 1);
    return arr.slice(0, cut).map((v, i) => (i === 0 ? "M" : "L") + x(i) + " " + y(v)).join(" ");
  };
  const cutN = Math.max(1, Math.round((n - 1) * p) + 1);
  const areaP =
    "M" + x(0) + " " + y(without[0] as number) +
    without.slice(0, cutN).map((v, i) => " L" + x(i) + " " + y(v)).join("") +
    withT.slice(0, cutN).reverse().map((v, k) => " L" + x(cutN - 1 - k) + " " + y(v)).join("") + " Z";
  const lastI = cutN - 1;
  const wo = without[lastI] as number;
  const wi = withT[lastI] as number;
  return (
    <Box ref={ref} sx={{ width: "100%" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
        <defs>
          <linearGradient id="tc-savings-wedge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={BLUE} stopOpacity="0.20" />
            <stop offset="1" stopColor="#06B6D4" stopOpacity="0.04" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (
          <line key={g} x1={padL} x2={W - padR} y1={padT + ih * g} y2={padT + ih * g} stroke={s.line} strokeWidth="1" />
        ))}
        <path d={areaP} fill="url(#tc-savings-wedge)" />
        <path d={lineP(without, p)} fill="none" stroke={s.faint} strokeWidth="2.5" strokeDasharray="2 6" strokeLinecap="round" />
        <path d={lineP(withT, p)} fill="none" stroke={BLUE} strokeWidth="3" strokeLinecap="round" />
        <circle cx={x(lastI)} cy={y(wi)} r="5.5" fill={BLUE} stroke="#fff" strokeWidth="2.5" />
        <circle cx={x(lastI)} cy={y(wo)} r="4" fill={s.faint} />
        {p > 0.7 && (
          <line x1={x(lastI)} x2={x(lastI)} y1={y(wo)} y2={y(wi)} stroke={BLUE} strokeWidth="1.5" strokeDasharray="3 3" style={{ opacity: (p - 0.7) / 0.3 }} />
        )}
      </svg>
      <Box sx={{ display: "flex", gap: 2.5, justifyContent: "space-between", mt: 0.75, flexWrap: "wrap" }}>
        <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 1, fontSize: "0.82rem", color: s.ink2 }}>
          <Box sx={{ width: 18, borderTop: `2.5px dashed ${s.faint}` }} /> Projected spend, no control plane
        </Box>
        <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 1, fontSize: "0.82rem", color: s.ink2 }}>
          <Box sx={{ width: 18, height: 3, borderRadius: "2px", background: BLUE }} /> Spend with TensorCost
        </Box>
      </Box>
    </Box>
  );
}

/* ---- MiniDonut ---- */
export function MiniDonut({ value = 38, size = 132, color = "#EF4444", label = "idle" }: { value?: number; size?: number; color?: string; label?: string }): ReactElement {
  const s = useSurfaces();
  const [ref, p] = useScrollProgress(1300);
  const r = size / 2 - 11, c = 2 * Math.PI * r;
  const shown = Math.round(value * p);
  return (
    <Box ref={ref} sx={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.line} strokeWidth="11" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="11" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - (value / 100) * p)} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
        <Box>
          <Box sx={{ fontSize: size * 0.24, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, color: s.ink }}>{shown}%</Box>
          <Box sx={{ fontSize: 11, color: s.ink3, mt: 0.25 }}>{label}</Box>
        </Box>
      </Box>
    </Box>
  );
}

/* ---- MiniBars ---- */
export function MiniBars({ height = 150 }: { height?: number }): ReactElement {
  const s = useSurfaces();
  const [ref, p] = useScrollProgress(1200);
  const items = [
    { l: "Training", v: 100 }, { l: "Inference", v: 72 }, { l: "Fine-tune", v: 54 }, { l: "Dev", v: 33 }, { l: "Idle", v: 21 },
  ];
  const cols = ["#3B82F6", "#06B6D4", "#8B5CF6", "#10B981", "#F59E0B"];
  const max = Math.max(...items.map((d) => d.v));
  return (
    <Box ref={ref} sx={{ display: "flex", alignItems: "flex-end", gap: 1.75, height }}>
      {items.map((d, i) => (
        <Box key={d.l} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 1, height: "100%", justifyContent: "flex-end" }}>
          <Box sx={{ width: "100%", maxWidth: 44, borderRadius: "5px 5px 0 0", background: cols[i % cols.length], height: (d.v / max) * (height - 28) * p }} />
          <Box component="span" sx={{ fontSize: 11, color: s.ink3, whiteSpace: "nowrap" }}>{d.l}</Box>
        </Box>
      ))}
    </Box>
  );
}

/* ---- UtilHeatmap ---- */
export function UtilHeatmap({ rows = 5, cols = 12 }: { rows?: number; cols?: number }): ReactElement {
  const [ref, p] = useScrollProgress(1400);
  const cells: number[] = [];
  let seed = 7;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  for (let i = 0; i < rows * cols; i++) cells.push(rnd());
  const colorFor = (v: number) => (v > 0.78 ? "#EF4444" : v > 0.62 ? "#F59E0B" : v > 0.34 ? "#3B82F6" : "#10B981");
  const gap = 4, size = 16, W = cols * (size + gap), H = rows * (size + gap);
  return (
    <Box ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
        {cells.map((v, i) => {
          const r = Math.floor(i / cols), c = i % cols;
          const appear = Math.min(1, Math.max(0, p * cells.length - i * 0.5));
          return <rect key={i} x={c * (size + gap)} y={r * (size + gap)} width={size} height={size} rx="4" fill={colorFor(v)} opacity={0.18 + appear * (v > 0.62 ? 0.82 : 0.5)} />;
        })}
      </svg>
    </Box>
  );
}

const cardSx = (s: Surfaces) => ({ background: s.card, border: `1px solid ${s.line}`, borderRadius: "16px", p: 3, height: "100%" });

/* ---- SavingsChart section ---- */
export interface SavingsChartProps {
  eyebrow?: string;
  title?: string;
  body?: string;
  backgroundColor?: string;
}
export function SavingsChart({
  eyebrow = "The savings curve",
  title = "Your spend was never supposed to look like the dotted line.",
  body = "Left alone, AI infrastructure cost compounds — more models, more experiments, more idle capacity “just in case.” TensorCost bends the curve back down within the first quarter and keeps it there.",
  backgroundColor,
}: SavingsChartProps): ReactElement {
  const s = useSurfaces();
  return (
    <Box component="section" sx={{ background: backgroundColor || s.band, py: { xs: 6, md: 9 }, px: "2rem" }}>
      <Box sx={{ maxWidth: 1180, mx: "auto", display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1.1fr" }, gap: { xs: 4, md: 7 }, alignItems: "center" }}>
        <Box>
          {eyebrow && <Typography sx={{ textTransform: "uppercase", letterSpacing: "0.12em", fontSize: "0.75rem", fontWeight: 600, color: s.ink3, mb: 1.75 }}>{eyebrow}</Typography>}
          <Typography component="h2" sx={{ fontFamily: "'Inter Tight', Inter, sans-serif", fontSize: { xs: "1.7rem", md: "2rem" }, fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.01em", color: s.ink }}>{title}</Typography>
          <Typography sx={{ mt: 2.25, fontSize: "1.1rem", lineHeight: 1.55, color: s.ink2 }}>{body}</Typography>
        </Box>
        <Box sx={cardSx(s)}><SavingsLine height={300} /></Box>
      </Box>
    </Box>
  );
}

/* ---- FeatureViz section (configurable donut / bars / heatmap trio) ---- */
export interface VizCard {
  /** Which animated visual to render in the card. */
  vizType?: "donut" | "bars" | "heatmap";
  overline?: string;
  title?: string;
  body?: string;
  /** Donut percentage value (vizType: donut). */
  value?: number;
  /** Donut center label (vizType: donut). */
  label?: string;
  /** Donut ring color (vizType: donut). */
  color?: string;
}

export interface FeatureVizProps {
  title?: string;
  subtitle?: string;
  items?: VizCard[];
  backgroundColor?: string;
}

const DEFAULT_VIZ_CARDS: VizCard[] = [
  { vizType: "donut", value: 32, label: "recoverable", color: "#EF4444", overline: "Waste finder", title: "Find the spend you're not using", body: "Idle GPUs, oversized provisioned throughput, zombie endpoints — ranked by daily cost." },
  { vizType: "bars", overline: "Cost explorer", title: "Spend, sliced any way", body: "By team, model, customer, or provider — five adapters normalized to one ledger." },
  { vizType: "heatmap", overline: "Live utilization", title: "Watch every cluster breathe", body: "Real-time heat across your fleet, so red cells get fixed before they bill." },
];

function VizFor({ card }: { card: VizCard }): ReactElement {
  if (card.vizType === "bars") return <Box sx={{ py: 2.5 }}><MiniBars height={150} /></Box>;
  if (card.vizType === "heatmap") return <Box sx={{ py: 2.75 }}><UtilHeatmap rows={5} cols={12} /></Box>;
  return (
    <Box sx={{ display: "grid", placeItems: "center", py: 2.25 }}>
      <MiniDonut value={card.value ?? 32} label={card.label ?? "recoverable"} color={card.color ?? "#EF4444"} />
    </Box>
  );
}

export function FeatureViz({
  title = "Less a dashboard, more a decision engine",
  subtitle = "What you get",
  items,
  backgroundColor,
}: FeatureVizProps): ReactElement {
  const s = useSurfaces();
  const cards = items && items.length ? items : DEFAULT_VIZ_CARDS;
  return (
    <Box component="section" sx={{ background: backgroundColor || s.page, py: { xs: 6, md: 9 }, px: "2rem" }}>
      <Box sx={{ maxWidth: 1180, mx: "auto" }}>
        <Box sx={{ textAlign: "center", mb: 5 }}>
          {subtitle && <Typography sx={{ textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.72rem", fontWeight: 600, color: s.ink3, mb: 1 }}>{subtitle}</Typography>}
          {title && <Typography component="h2" sx={{ fontFamily: "'Inter Tight', Inter, sans-serif", fontSize: { xs: "1.8rem", md: "2.4rem" }, fontWeight: 700, letterSpacing: "-0.01em", color: s.ink }}>{title}</Typography>}
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: `repeat(${Math.min(cards.length || 1, 3)},1fr)` }, gap: 3 }}>
          {cards.map((c, i) => (
            <Box key={i} sx={cardSx(s)}>
              <VizFor card={c} />
              {c.overline && <Typography sx={{ textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.72rem", fontWeight: 600, color: s.ink3, mb: 1 }}>{c.overline}</Typography>}
              {c.title && <Typography component="h3" sx={{ fontSize: "1.25rem", fontWeight: 700, color: s.ink, mb: 1 }}>{c.title}</Typography>}
              {c.body && <Typography sx={{ fontSize: "0.98rem", color: s.ink2, lineHeight: 1.5 }}>{c.body}</Typography>}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
