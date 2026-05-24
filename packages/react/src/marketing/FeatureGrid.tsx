import { type ReactElement, type ComponentType } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
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
// BrainCircuit and GitBranch have no 1:1 MUI counterpart — using semantic
// fallbacks: Psychology (brain/intelligence) and AccountTree (branching graph).
import PsychologyIcon from "@mui/icons-material/Psychology";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

// ---------------------------------------------------------------------------
// Icon alias map — mirrors ICON_ALIASES from the source component-library
// (component-library/src/components/display/FeatureGrid.jsx).
// lucide-react is NOT imported here; every icon maps to @mui/icons-material.
// The two exceptions (BrainCircuit → Psychology, GitBranch → AccountTree)
// are called out explicitly above.
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
  route: AccountTreeIcon, // GitBranch → AccountTree (branching structure)
  cache: StorageIcon,
  throughput: SpeedIcon,
  forecast: ShowChartIcon,
  alert: WarningAmberIcon,
  platform: DnsIcon, // Server → Dns (server/DNS icon)
  ml: PsychologyIcon, // BrainCircuit → Psychology (ML / intelligence)
  finance: ReceiptIcon,
  // Common PascalCase names that might be passed through directly
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

/** A single image reference — accepts Strapi media objects or plain URLs. */
export interface FeatureImage {
  url?: string;
  /** Strapi v5 format: `{ data: { attributes: { url: string } } }` */
  data?: { attributes?: { url?: string } };
}

export interface Feature {
  id?: string | number;
  title?: string;
  description?: string;
  /** Semantic alias (e.g. "cost", "ml") or PascalCase icon name (e.g. "DollarSign") */
  icon?: string;
  image?: FeatureImage | string;
  link?: string;
  linkText?: string;
}

export interface FeatureGridProps {
  title?: string;
  subtitle?: string;
  /** How many columns to target on wide viewports (1–4). Default: 3. */
  columns?: number | string;
  features?: Feature[];
  /** CSS background for the section. Default: theme bgSoft. */
  backgroundColor?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// FeatureCard (internal)
// ---------------------------------------------------------------------------

interface FeatureCardProps extends Feature {}

function FeatureCard({
  title,
  description,
  icon,
  image,
  link,
  linkText = "Learn more",
}: FeatureCardProps): ReactElement {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const imageUrl =
    typeof image === "string"
      ? image
      : (image as FeatureImage | undefined)?.data?.attributes?.url ??
        (image as FeatureImage | undefined)?.url;

  const IconComponent = icon ? ICON_MAP[icon] : undefined;

  const handleClick = () => {
    if (link) window.location.href = link;
  };

  return (
    <Card
      onClick={link ? handleClick : undefined}
      sx={{
        height: "100%",
        cursor: link ? "pointer" : "default",
        borderRadius: 2.5,
        border: `1px solid`,
        borderColor: "divider",
        transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
        "&:hover": link
          ? {
              transform: "translateY(-4px)",
              boxShadow: isDark
                ? "0 8px 24px rgba(0,0,0,0.4)"
                : "0 8px 24px rgba(15,23,42,0.08)",
              borderColor: "text.disabled",
            }
          : undefined,
      }}
    >
      <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
        {imageUrl && (
          <Box
            component="img"
            src={imageUrl}
            alt={title}
            sx={{
              width: "100%",
              height: 150,
              objectFit: "cover",
              borderRadius: 2,
              mb: 2,
              display: "block",
            }}
          />
        )}

        {IconComponent && !imageUrl && (
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <IconComponent sx={{ fontSize: 28, color: "#fff" }} />
          </Box>
        )}

        {title && (
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 0.75, fontSize: "1.125rem" }}
          >
            {title}
          </Typography>
        )}

        {description && (
          <Typography
            component="div"
            variant="body2"
            sx={{
              color: "text.secondary",
              lineHeight: 1.6,
              mb: link ? 1.5 : 0,
              // Markdown renders <p> tags — reset default margins.
              "& p": { margin: 0 },
              "& a": {
                color: "primary.main",
                textDecoration: "underline",
              },
            }}
          >
            <ReactMarkdown rehypePlugins={[rehypeRaw as never]}>
              {description}
            </ReactMarkdown>
          </Typography>
        )}

        {link && (
          <Box
            component="a"
            href={link}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            sx={{
              color: "primary.main",
              textDecoration: "none",
              fontWeight: 500,
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              fontSize: "0.875rem",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {linkText}
            <ArrowForwardIcon sx={{ fontSize: 14 }} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// FeatureGrid (public)
// ---------------------------------------------------------------------------

/**
 * FeatureGrid — responsive grid of feature cards, each optionally carrying an
 * icon (resolved via an alias map to @mui/icons-material), an image, a markdown
 * description, and a CTA link.
 *
 * Ported from component-library/src/components/display/FeatureGrid.jsx (Phase 3a-2).
 * lucide-react removed; icon aliases re-mapped to @mui/icons-material. Two icons
 * (BrainCircuit → Psychology, GitBranch → AccountTree) have no 1:1 MUI equivalent
 * and use semantic fallbacks — see ICON_MAP above.
 */
export function FeatureGrid({
  title,
  subtitle,
  columns = 3,
  features = [],
  backgroundColor,
  className,
}: FeatureGridProps): ReactElement {
  const theme = useTheme();
  const colCount = Math.min(Math.max(parseInt(String(columns), 10), 1), 4);
  const bgDefault =
    theme.palette.mode === "dark" ? theme.palette.background.paper : "#f8f9fa";

  // MUI Grid v7 (Grid2) column sizing: xs=12 always, then per-breakpoint based on
  // the requested column count.
  const colSizes: Record<number, object> = {
    1: { xs: 12 },
    2: { xs: 12, sm: 6 },
    3: { xs: 12, sm: 6, md: 4 },
    4: { xs: 12, sm: 6, md: 3 },
  };
  const gridSize = colSizes[colCount] ?? { xs: 12, sm: 6, md: 4 };

  return (
    <Box
      component="section"
      className={className}
      sx={{
        background: backgroundColor ?? bgDefault,
        py: { xs: 6, md: 8 },
        px: { xs: 3, md: 4 },
      }}
    >
      {(title || subtitle) && (
        <Box sx={{ textAlign: "center", mb: 6, maxWidth: 760, mx: "auto" }}>
          {title && (
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: "2rem", md: "2.5rem" }, mb: 1 }}
            >
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography
              component="div"
              variant="body1"
              sx={{
                opacity: 0.8,
                fontSize: "1.1rem",
                "& p": { margin: 0 },
              }}
            >
              <ReactMarkdown rehypePlugins={[rehypeRaw as never]}>
                {subtitle}
              </ReactMarkdown>
            </Typography>
          )}
        </Box>
      )}

      <Grid
        container
        spacing={3}
        sx={{ maxWidth: 1200, mx: "auto" }}
      >
        {features.map((feature, index) => (
          <Grid
            key={feature.id ?? index}
            size={gridSize}
          >
            <FeatureCard {...feature} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
