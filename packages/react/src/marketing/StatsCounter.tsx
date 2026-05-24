import {
  useState,
  useEffect,
  useRef,
  type ReactElement,
  type ComponentType,
} from "react";
import { Box, Grid, Typography } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MemoryIcon from "@mui/icons-material/Memory";
import SecurityIcon from "@mui/icons-material/Security";
import SyncIcon from "@mui/icons-material/Sync";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import PieChartIcon from "@mui/icons-material/PieChart";
import StorageIcon from "@mui/icons-material/Storage";
import SpeedIcon from "@mui/icons-material/Speed";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DnsIcon from "@mui/icons-material/Dns";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PsychologyIcon from "@mui/icons-material/Psychology";
import AccountTreeIcon from "@mui/icons-material/AccountTree";

// ---------------------------------------------------------------------------
// Icon map — mirrors FeatureGrid's ICON_MAP for the icon slot on each stat.
// lucide-react is NOT used (confirmed unused in source, Phase 3a plan §TL;DR).
// ---------------------------------------------------------------------------
const ICON_MAP: Record<string, ComponentType<{ sx?: object }>> = {
  cost: AttachMoneyIcon,
  gpu: MemoryIcon,
  cpu: MemoryIcon,
  shield: SecurityIcon,
  sync: SyncIcon,
  ledger: FactCheckIcon,
  lightbulb: LightbulbIcon,
  cfo: PieChartIcon,
  route: AccountTreeIcon,
  cache: StorageIcon,
  throughput: SpeedIcon,
  forecast: ShowChartIcon,
  alert: WarningAmberIcon,
  platform: DnsIcon,
  ml: PsychologyIcon,
  finance: ReceiptIcon,
  // PascalCase passthroughs
  DollarSign: AttachMoneyIcon,
  Cpu: MemoryIcon,
  Shield: SecurityIcon,
  RefreshCw: SyncIcon,
  FileCheck2: FactCheckIcon,
  Lightbulb: LightbulbIcon,
  PieChart: PieChartIcon,
  GitBranch: AccountTreeIcon,
  Database: StorageIcon,
  Gauge: SpeedIcon,
  LineChart: ShowChartIcon,
  AlertTriangle: WarningAmberIcon,
  Server: DnsIcon,
  BrainCircuit: PsychologyIcon,
  Receipt: ReceiptIcon,
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StatCounterEntry {
  id?: string | number;
  /** The target value to count up to, e.g. "40%", "$4M", "200ms", or "2000". */
  value: string;
  label: string;
  /** Optional prefix prepended to the animating number, e.g. "$". */
  prefix?: string;
  /** Optional suffix appended to the animating number, e.g. "%". */
  suffix?: string;
  /** Semantic icon alias or PascalCase @mui/icons-material name. */
  icon?: string;
}

export interface StatsCounterProps {
  title?: string;
  subtitle?: string;
  stats?: StatCounterEntry[];
  /** CSS background color. Default: #4f46e5 (indigo). */
  backgroundColor?: string;
  /** Gradient start color — if both gradient props are set they override backgroundColor. */
  gradientFrom?: string;
  /** Gradient end color. */
  gradientTo?: string;
  /** Text color over the background. Default: #ffffff. */
  textColor?: string;
  /**
   * When true (default) the count-up animation triggers once the section scrolls
   * into view via IntersectionObserver.
   *
   * Animation approach: pure JS setInterval count-up (2 s, 60 steps).
   * framer-motion is NOT used — confirmed unused in component-library despite being
   * listed as a dep. See PORTING-COMPONENT-LIBRARY.md §TL;DR.
   */
  animateOnScroll?: boolean;
  className?: string;
}

// ---------------------------------------------------------------------------
// StatItem (internal)
// ---------------------------------------------------------------------------

interface StatItemProps extends StatCounterEntry {
  isVisible: boolean;
  delay?: number;
}

function StatItem({
  value,
  label,
  prefix = "",
  suffix = "",
  icon,
  isVisible,
  delay = 0,
}: StatItemProps): ReactElement {
  // Initialise to the target value when the stat is already visible (no animation).
  // This ensures synchronous rendering shows the real value; the count-up effect
  // only activates once `isVisible` transitions from false → true.
  const [displayValue, setDisplayValue] = useState(() =>
    isVisible ? value : "0",
  );
  const IconComponent = icon ? ICON_MAP[icon] : undefined;

  // Extract the numeric portion to animate, leaving non-numeric strings as-is.
  const numericValue = parseFloat((value ?? "").replace(/[^0-9.]/g, "")) || 0;
  const isNumeric = !isNaN(numericValue) && numericValue > 0;

  useEffect(() => {
    if (!isVisible || !isNumeric) {
      setDisplayValue(value);
      return;
    }

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = numericValue / steps;
    let current = 0;

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setDisplayValue(value);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(current).toLocaleString());
        }
      }, stepDuration);

      // Return cleanup from the outer setTimeout callback — the clearInterval
      // below handles the interval if the component unmounts before it fires.
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, value, numericValue, isNumeric, delay]);

  return (
    <Box sx={{ textAlign: "center" }}>
      {IconComponent && (
        <Box sx={{ mb: 1.5 }}>
          <IconComponent sx={{ fontSize: 40 }} />
        </Box>
      )}

      <Typography
        component="div"
        sx={{
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 700,
          lineHeight: 1,
          mb: 0.75,
        }}
      >
        {prefix}
        {displayValue}
        {suffix}
      </Typography>

      <Typography
        component="div"
        sx={{
          fontSize: "1rem",
          opacity: 0.9,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// StatsCounter (public)
// ---------------------------------------------------------------------------

/**
 * StatsCounter — animated stats grid that counts up from 0 to each target value
 * once the section scrolls into view (IntersectionObserver, threshold 0.2).
 *
 * Animation: pure JS setInterval count-up over 2 s in 60 steps. framer-motion
 * is explicitly excluded (confirmed unused in component-library). Set
 * `animateOnScroll={false}` to disable animation entirely (useful in tests).
 *
 * Ported from component-library/src/components/display/StatsCounter.jsx (Phase 3a-2).
 * lucide wildcard import replaced by named @mui/icons-material imports via ICON_MAP.
 */
export function StatsCounter({
  title,
  subtitle,
  stats = [],
  backgroundColor = "#4f46e5",
  gradientFrom,
  gradientTo,
  textColor = "#ffffff",
  animateOnScroll = true,
  className,
}: StatsCounterProps): ReactElement {
  const [isVisible, setIsVisible] = useState(!animateOnScroll);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!animateOnScroll) return;
    // Guard against jsdom / SSR environments where IntersectionObserver isn't available.
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [animateOnScroll]);

  const bg =
    gradientFrom && gradientTo
      ? `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`
      : backgroundColor;

  // MUI Grid v7: up to 4 columns, at least 1
  const colCount = Math.min(Math.max(stats.length, 1), 4);
  const colSizes: Record<number, object> = {
    1: { xs: 12 },
    2: { xs: 12, sm: 6 },
    3: { xs: 12, sm: 6, md: 4 },
    4: { xs: 12, sm: 6, md: 3 },
  };
  const gridSize = colSizes[colCount] ?? { xs: 12, sm: 6, md: 3 };

  return (
    <Box
      ref={sectionRef}
      component="section"
      className={className}
      sx={{
        background: bg,
        color: textColor,
        py: { xs: 6, md: 8 },
        px: { xs: 3, md: 4 },
      }}
    >
      {(title || subtitle) && (
        <Box sx={{ textAlign: "center", mb: 6, maxWidth: 760, mx: "auto" }}>
          {title && (
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2rem", md: "2.5rem" },
                color: textColor,
                mb: 0.75,
              }}
            >
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography
              variant="body1"
              sx={{ opacity: 0.9, fontSize: "1.2rem", color: textColor }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      )}

      <Grid container spacing={3} sx={{ maxWidth: 1200, mx: "auto" }}>
        {stats.map((stat, index) => (
          <Grid key={stat.id ?? index} size={gridSize}>
            <StatItem
              {...stat}
              isVisible={isVisible}
              delay={index * 100}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
