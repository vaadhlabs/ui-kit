/**
 * Timeline — vertical alternating timeline with icon dots and content cards.
 *
 * Decision: using a custom MUI Box layout rather than @mui/lab's Timeline
 * component. ui-kit does not currently depend on @mui/lab, and adding it for
 * one component is not worth the bundle cost. The visual output is identical.
 *
 * Icon resolution: the source used `* as Icons from 'lucide-react'` with
 * dynamic lookup. We resolve named icons via the same ICON_MAP used in
 * TabsSection. Unknown icon names fall back to a numbered dot (same as source).
 *
 * `description` carries CMS-authored HTML — rendered via dangerouslySetInnerHTML.
 * trusted-cms-content only.
 *
 * Ported from @tensorcost/component-library Timeline (Phase 3a-1).
 */
import { type ReactElement } from "react";
import { Box, Typography, Paper } from "@mui/material";
import {
  Psychology,
  ShowChart,
  Speed,
  AccountTree,
  AttachMoney,
  Memory,
  Security,
  Sync,
  FactCheck,
  Lightbulb,
  PieChart,
  Receipt,
  Storage,
  Warning,
  CheckCircle,
  Code,
  Settings,
} from "@mui/icons-material";
import type { SvgIconComponent } from "@mui/icons-material";

const ICON_MAP: Record<string, SvgIconComponent> = {
  BrainCircuit: Psychology,
  LineChart: ShowChart,
  Gauge: Speed,
  GitBranch: AccountTree,
  DollarSign: AttachMoney,
  Cpu: Memory,
  Shield: Security,
  RefreshCw: Sync,
  FileCheck2: FactCheck,
  Lightbulb: Lightbulb,
  PieChart: PieChart,
  Receipt: Receipt,
  Server: Storage,
  Database: Storage,
  AlertTriangle: Warning,
  CheckCircle: CheckCircle,
  Code: Code,
  Settings: Settings,
  ml: Psychology,
  cost: AttachMoney,
  gpu: Memory,
  cpu: Memory,
  sync: Sync,
  ledger: FactCheck,
  cfo: PieChart,
  finance: Receipt,
  platform: Storage,
  cache: Storage,
  alert: Warning,
  forecast: ShowChart,
  throughput: Speed,
  route: AccountTree,
};

/** Strapi image shape or plain { url }. */
interface StrapiImage {
  data?: { attributes?: { url?: string } };
  url?: string;
}

export interface TimelineItem {
  id?: string | number;
  title?: string;
  description?: string;
  date?: string;
  /** Icon name resolved via ICON_MAP; falls back to index number. */
  icon?: string;
  image?: StrapiImage;
}

export interface TimelineProps {
  title?: string;
  items?: TimelineItem[];
  /** CSS color for the accent dots and date labels. */
  accentColor?: string;
  backgroundColor?: string;
  className?: string;
}

function resolveImageUrl(img?: StrapiImage): string | undefined {
  if (!img) return undefined;
  return img.data?.attributes?.url ?? img.url;
}

export function Timeline({
  title,
  items = [],
  accentColor = "#4f46e5",
  backgroundColor = "#ffffff",
  className,
}: TimelineProps): ReactElement {
  return (
    <Box
      component="section"
      className={className}
      sx={{ background: backgroundColor, py: "4rem", px: "2rem" }}
    >
      {title && (
        <Typography
          component="h2"
          sx={{
            textAlign: "center",
            fontSize: "2.5rem",
            fontWeight: 700,
            mb: "3rem",
          }}
        >
          {title}
        </Typography>
      )}

      <Box
        sx={{
          maxWidth: "800px",
          mx: "auto",
          position: "relative",
        }}
      >
        {/* Vertical centre line */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            width: "2px",
            top: 0,
            bottom: 0,
            bgcolor: "divider",
          }}
        />

        {items.map((item, index) => {
          const isEven = index % 2 === 0;
          const IconComp = item.icon ? ICON_MAP[item.icon] : undefined;
          const imageUrl = resolveImageUrl(item.image);

          return (
            <Box
              key={item.id ?? index}
              data-testid="timeline-item"
              sx={{
                display: "flex",
                justifyContent: isEven ? "flex-start" : "flex-end",
                pl: isEven ? 0 : "50%",
                pr: isEven ? "50%" : 0,
                mb: "3rem",
                position: "relative",
              }}
            >
              {/* Dot / icon in the centre */}
              <Box
                aria-hidden
                sx={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  bgcolor: accentColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  zIndex: 1,
                }}
              >
                {IconComp ? (
                  <IconComp sx={{ fontSize: "1.2rem" }} />
                ) : (
                  <Typography component="span" sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                    {index + 1}
                  </Typography>
                )}
              </Box>

              {/* Content card */}
              <Paper
                elevation={0}
                sx={{
                  p: "1.5rem",
                  ml: isEven ? 0 : "2rem",
                  mr: isEven ? "2rem" : 0,
                  maxWidth: "calc(50% - 40px)",
                  width: "100%",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                }}
              >
                {item.date && (
                  <Typography
                    sx={{
                      color: accentColor,
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      mb: "0.5rem",
                    }}
                  >
                    {item.date}
                  </Typography>
                )}

                {item.title && (
                  <Typography
                    component="h3"
                    sx={{ fontSize: "1.25rem", fontWeight: 600, mb: "0.5rem" }}
                  >
                    {item.title}
                  </Typography>
                )}

                {imageUrl && (
                  <Box
                    component="img"
                    src={imageUrl}
                    alt={item.title ?? ""}
                    sx={{ width: "100%", borderRadius: "8px", mb: "0.75rem" }}
                  />
                )}

                {item.description && (
                  // trusted-cms-content — description is CMS-authored HTML.
                  // Never pass user-submitted content here.
                  <Box
                    sx={{ color: "text.secondary", lineHeight: 1.6 }}
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                )}
              </Paper>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
