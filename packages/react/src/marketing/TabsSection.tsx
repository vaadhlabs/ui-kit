/**
 * TabsSection — tab navigation block with underline / pills / boxed variants.
 * Tab content is rendered as markdown via MarkdownBody.
 *
 * SECURITY NOTE: rehype-raw allows raw HTML nodes from markdown. Safe for
 * CMS-authored content. NEVER use this component to render user-submitted content.
 *
 * Icon note: the source used `* as Icons from 'lucide-react'` and looked up
 * icon names dynamically via `Icons[tab.icon]`. We replace this with a curated
 * MUI icon map. Unknown icon names silently receive no icon — same behaviour
 * as the original when a lucide name didn't exist.
 *
 * Ported from @tensorcost/component-library TabsSection (Phase 3a-1).
 */
import { useState, type ReactElement } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import { useTheme } from "@mui/material/styles";
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
  Search,
  Settings,
  Star,
  Code,
  CloudDone,
  Timeline,
} from "@mui/icons-material";
import { MarkdownBody } from "./MarkdownBody.js";
import type { SvgIconComponent } from "@mui/icons-material";

// Mapping from the lucide/semantic icon name strings used in CMS data to MUI
// icon components. Covers the full ICON_ALIASES set from the source library.
const ICON_MAP: Record<string, SvgIconComponent> = {
  // semantic aliases
  ml: Psychology,
  forecast: ShowChart,
  throughput: Speed,
  route: AccountTree,
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
  // common lucide names used directly
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
  Search: Search,
  Settings: Settings,
  Star: Star,
  Code: Code,
  CloudDone: CloudDone,
  Timeline: Timeline,
};

export interface TabItem {
  label: string;
  content?: string;
  /** Icon name — resolved via ICON_MAP; unknown names produce no icon. */
  icon?: string;
}

export type TabStyle = "underline" | "pills" | "boxed";

export interface TabsSectionProps {
  title?: string;
  tabs?: TabItem[];
  tabStyle?: TabStyle;
  defaultTab?: number;
  backgroundColor?: string;
  className?: string;
}

export function TabsSection({
  title,
  tabs = [],
  tabStyle = "underline",
  defaultTab = 0,
  backgroundColor = "#ffffff",
  className,
}: TabsSectionProps): ReactElement {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(Math.min(defaultTab, Math.max(0, tabs.length - 1)));

  const primaryColor = theme.palette.primary.main;

  // Variant-specific tab list styling
  const tabListSx = {
    underline: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      mb: "2rem",
    },
    pills: {
      mb: "2rem",
      "& .MuiTabs-indicator": { display: "none" },
      "& .MuiTab-root": {
        borderRadius: "9999px",
        mx: "0.25rem",
        "&.Mui-selected": {
          background: primaryColor,
          color: "#fff",
        },
      },
    },
    boxed: {
      borderBottom: `2px solid ${theme.palette.divider}`,
      mb: "2rem",
      "& .MuiTab-root": {
        borderRadius: "8px 8px 0 0",
        background: theme.palette.grey[100],
        "&.Mui-selected": {
          background: theme.palette.background.paper,
          borderBottom: `2px solid ${theme.palette.background.paper}`,
          mb: "-2px",
        },
      },
    },
  }[tabStyle];

  const activeContent = tabs[activeTab]?.content ?? "";

  return (
    <Box
      component="section"
      className={className}
      sx={{ background: backgroundColor, py: "4rem", px: "2rem" }}
    >
      <Box sx={{ maxWidth: "900px", mx: "auto" }}>
        {title && (
          <Typography
            component="h2"
            sx={{
              textAlign: "center",
              fontSize: "2.5rem",
              fontWeight: 700,
              mb: "2rem",
              color: "inherit",
            }}
          >
            {title}
          </Typography>
        )}

        <Tabs
          value={activeTab}
          onChange={(_, v: number) => setActiveTab(v)}
          centered
          sx={tabListSx}
          aria-label={title ? `${title} tabs` : "content tabs"}
        >
          {tabs.map((tab, i) => {
            const IconComp = tab.icon ? ICON_MAP[tab.icon] : undefined;
            return (
              <Tab
                key={i}
                label={tab.label}
                icon={IconComp ? <IconComp sx={{ fontSize: "1.1rem" }} /> : undefined}
                iconPosition="start"
                id={`tab-${i}`}
                aria-controls={`tabpanel-${i}`}
              />
            );
          })}
        </Tabs>

        <Box
          role="tabpanel"
          id={`tabpanel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          sx={{
            lineHeight: 1.8,
            color: theme.palette.text.primary,
            // Inline styles from source: tab content typography
            "& h2": { fontSize: "1.75rem", fontWeight: 700, mt: "1.5rem", mb: "1rem" },
            "& h3": { fontSize: "1.25rem", fontWeight: 600, mt: "1.25rem", mb: "0.75rem" },
            "& p": { my: "0.75rem" },
            "& ul, & ol": { my: "0.75rem", pl: "1.5rem" },
            "& li": { my: "0.25rem" },
            "& code": {
              background: theme.palette.grey[100],
              px: "0.4rem",
              py: "0.15rem",
              borderRadius: "4px",
              fontSize: "0.9em",
              color: theme.palette.secondary.main,
            },
            "& pre": {
              background: "#1e293b",
              color: "#e2e8f0",
              p: "1rem 1.25rem",
              borderRadius: "8px",
              overflowX: "auto",
              my: "1rem",
              "& code": { background: "none", color: "inherit", p: 0 },
            },
            "& strong": { fontWeight: 600 },
            "& a": { color: primaryColor, textDecoration: "underline" },
          }}
        >
          {/* trusted-cms-content — see MarkdownBody for rehype-raw security note */}
          <MarkdownBody>{activeContent}</MarkdownBody>
        </Box>
      </Box>
    </Box>
  );
}
