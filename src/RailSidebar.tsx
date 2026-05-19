import { type ComponentType } from "react";
import { Box, ButtonBase, IconButton, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  UnfoldMore as UnfoldMoreIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

// RailSidebar — navrail primitive (2026-05-19)
//
// Spec: design_handoff_navigation_rail/README.md §Sidebar zones
// Static 240px wide, full-height, never collapses on desktop (≥1024px).
// Below 768px: parent renders mobile chrome instead — this component is
// pure desktop and does NOT handle the mobile breakpoint itself.
//
// Five zones (top → bottom):
//   1. Brand: gradient logo dot 22×22 + "TensorCost" wordmark Inter 14/700
//   2. Tenant chip: full-width button, cyan dot + tenant/env + unfold icon
//   3. Search: 32px tall, leading magnifier, ⌘K kbd hint right-aligned
//   4. Item list: scrollable, 36px rows, icon tile 24×24/6px-radius, badge/hint
//   5. User footer: 28px avatar + email + role mono caption + settings icon
//
// Props contract: host passes `active` key and handles all navigation.
// This component does NOT watch location.pathname — single source of truth.

export interface NavItemBadge {
  kind: "ok" | "warn" | "danger" | "info";
  count: number;
}

export interface NavItem {
  key: string;
  label: string;
  /** MUI icon component. */
  icon: ComponentType<{ sx?: object; fontSize?: string }>;
  path: string;
  hint?: string;
  badge?: NavItemBadge;
}

export interface RailSidebarUser {
  email: string;
  role: string;
  avatarUrl?: string;
}

export interface RailSidebarProps {
  active: string;
  items: NavItem[];
  tenant: string;
  env: string;
  user: RailSidebarUser;
  alertsCount: number;
  onSearch?: () => void;
  onTenantClick?: () => void;
  onUserSettingsClick?: () => void;
  /** Called when a nav item is clicked. Host handles actual navigation. */
  onItemClick?: (item: NavItem) => void;
}

function badgeColor(kind: NavItemBadge["kind"], isDark: boolean): string {
  switch (kind) {
    case "ok":     return isDark ? "#34D399" : "#10B981";
    case "warn":   return isDark ? "#FBBF24" : "#F59E0B";
    case "info":   return isDark ? "#60A5FA" : "#3B82F6";
    case "danger":
    default:       return isDark ? "#F87171" : "#EF4444";
  }
}

export function RailSidebar({
  active,
  items,
  tenant,
  env,
  user,
  alertsCount,
  onSearch,
  onTenantClick,
  onUserSettingsClick,
  onItemClick,
}: RailSidebarProps): JSX.Element {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const b = theme.palette.brand;

  // Derived avatar initial — first char of email, uppercased.
  const avatarInitial = user.email.charAt(0).toUpperCase();

  const sidebarBg = b?.bgPage ?? (isDark ? "#0F172A" : "#FAFBFC");
  const border = b?.border ?? (isDark ? "rgba(148,163,184,0.16)" : "#E2E8F0");
  const ink = b?.ink ?? (isDark ? "#F8FAFC" : "#0F172A");
  const ink2 = b?.ink2 ?? (isDark ? "#CBD5E1" : "#475569");
  const ink3 = b?.ink3 ?? (isDark ? "#94A3B8" : "#94A3B8");
  const paper = b?.paper ?? (isDark ? "#1E293B" : "#FFFFFF");
  const blue = b?.blue ?? (isDark ? "#60A5FA" : "#3B82F6");
  const cyan = b?.cyan ?? (isDark ? "#22D3EE" : "#06B6D4");
  const mono = b?.mono ?? "'JetBrains Mono', ui-monospace, monospace";
  const motionFast = b?.motionFast ?? "150ms cubic-bezier(0.4,0,0.2,1)";

  const iconTileBg = isDark ? "rgba(255,255,255,0.04)" : "#F1F5F9";

  return (
    <Box
      component="aside"
      sx={{
        width: 240,
        flexShrink: 0,
        background: sidebarBg,
        borderRight: `1px solid ${border}`,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        fontFamily: "'Inter', system-ui, sans-serif",
        // Desktop-only: hide below 768px; parent renders MobileTopBar instead.
        "@media (max-width: 767px)": { display: "none" },
      }}
    >
      {/* Zone 1 — Brand */}
      <Box
        sx={{
          padding: "16px 16px 12px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {/* Gradient logo dot 22×22 */}
        <Box
          component="span"
          aria-hidden="true"
          sx={{
            width: 22,
            height: 22,
            borderRadius: "6px",
            background: `linear-gradient(135deg, ${blue} 0%, ${cyan} 100%)`,
            flexShrink: 0,
          }}
        />
        <Box
          component="span"
          sx={{
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: "-0.02em",
            color: ink,
          }}
        >
          TensorCost
        </Box>
      </Box>

      {/* Zone 2 — Tenant chip */}
      <Box sx={{ padding: "0 12px 10px" }}>
        <ButtonBase
          onClick={onTenantClick}
          aria-label={`Switch tenant: ${tenant} / ${env}`}
          sx={{
            appearance: "none",
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "7px 10px",
            background: paper,
            border: `1px solid ${border}`,
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 12.5,
            color: ink,
            fontWeight: 500,
            textAlign: "left",
          }}
        >
          {/* Cyan env dot */}
          <Box
            component="span"
            aria-hidden="true"
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: cyan,
              flexShrink: 0,
            }}
          />
          <Box component="span" sx={{ color: ink, fontWeight: 500 }}>
            {tenant}
          </Box>
          <Box component="span" sx={{ color: ink3, fontWeight: 400 }}>
            {" "}/{" "}{env}
          </Box>
          <Box component="span" sx={{ flex: 1 }} />
          <UnfoldMoreIcon sx={{ fontSize: 14, color: ink3, flexShrink: 0 }} />
        </ButtonBase>
      </Box>

      {/* Zone 3 — Search input */}
      <Box sx={{ padding: "0 12px 10px" }}>
        <ButtonBase
          onClick={onSearch}
          aria-label="Search (⌘K)"
          role="searchbox"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            height: 32,
            padding: "0 10px",
            background: paper,
            border: `1px solid ${border}`,
            borderRadius: "8px",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
          }}
        >
          <SearchIcon sx={{ fontSize: 14, color: ink3, flexShrink: 0 }} />
          <Box
            component="span"
            sx={{
              flex: 1,
              fontSize: 12,
              color: ink3,
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            Find anything
          </Box>
          {/* ⌘K kbd hint */}
          <Box
            component="kbd"
            sx={{
              display: "inline-flex",
              padding: "1px 5px",
              background: isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9",
              border: `1px solid ${border}`,
              borderRadius: "4px",
              fontFamily: mono,
              fontSize: 10,
              fontWeight: 600,
              color: ink2,
              lineHeight: 1.6,
            }}
          >
            ⌘K
          </Box>
        </ButtonBase>
      </Box>

      {/* Zone 4 — Item list */}
      <Box
        component="nav"
        aria-label="Main navigation"
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: "4px 8px 12px",
        }}
      >
        {items.map((item) => {
          const isActive = active === item.key;
          const IconComponent = item.icon;
          const hasBadge = item.badge != null || (item.key === "alerts" && alertsCount > 0);
          const badgeCount = item.badge?.count ?? (item.key === "alerts" ? alertsCount : 0);
          const bKind = item.badge?.kind ?? "danger";
          const bColor = hasBadge ? badgeColor(bKind, isDark) : undefined;

          return (
            <ButtonBase
              key={item.key}
              component="a"
              href={item.path}
              onClick={(e: React.MouseEvent) => {
                if (onItemClick) {
                  e.preventDefault();
                  onItemClick(item);
                }
              }}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                padding: "8px 10px",
                margin: "1px 0",
                background: isActive ? paper : "transparent",
                border: isActive ? `1px solid ${border}` : "1px solid transparent",
                boxShadow: isActive
                  ? (isDark ? "0 1px 0 rgba(0,0,0,0.3)" : "0 1px 2px rgba(15,23,42,0.04)")
                  : "none",
                borderRadius: "8px",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 13,
                color: isActive ? ink : ink2,
                fontWeight: isActive ? 600 : 500,
                letterSpacing: "-0.005em",
                transition: `background ${motionFast}, color ${motionFast}`,
                textDecoration: "none",
                "&:focus-visible": {
                  outline: `2px solid ${blue}`,
                  outlineOffset: 2,
                },
              }}
            >
              {/* Icon tile 24×24, 6px radius */}
              <Box
                component="span"
                aria-hidden="true"
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "6px",
                  background: isActive ? `${blue}22` : iconTileBg,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  transition: `background ${motionFast}`,
                }}
              >
                <IconComponent
                  sx={{
                    fontSize: 14,
                    color: isActive ? blue : ink2,
                    transition: `color ${motionFast}`,
                  }}
                />
              </Box>

              {/* Label */}
              <Box component="span" sx={{ flex: 1 }}>
                {item.label}
              </Box>

              {/* Badge or hint */}
              {hasBadge ? (
                <Box
                  component="span"
                  aria-label={`${badgeCount} ${item.key} alerts`}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 16,
                    height: 16,
                    padding: "0 5px",
                    borderRadius: "999px",
                    background: bColor,
                    color: isDark ? "#1E293B" : "#fff",
                    fontSize: 10,
                    fontWeight: 700,
                    fontFamily: mono,
                  }}
                >
                  {badgeCount}
                </Box>
              ) : item.hint ? (
                <Box
                  component="span"
                  sx={{
                    fontSize: "10.5px",
                    color: ink3,
                    fontFamily: mono,
                  }}
                >
                  {item.hint}
                </Box>
              ) : null}
            </ButtonBase>
          );
        })}
      </Box>

      {/* Zone 5 — User footer */}
      <Box
        sx={{
          padding: "12px 14px",
          borderTop: `1px solid ${border}`,
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {/* Avatar circle 28px */}
        {user.avatarUrl ? (
          <Box
            component="img"
            src={user.avatarUrl}
            alt={user.email}
            sx={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
        ) : (
          <Box
            component="span"
            aria-label={user.email}
            sx={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: blue,
              color: isDark ? "#0F172A" : "#fff",
              display: "grid",
              placeItems: "center",
              fontSize: 11,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {avatarInitial}
          </Box>
        )}

        {/* Email + role */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              fontSize: 12.5,
              fontWeight: 600,
              color: ink,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            {user.email}
          </Box>
          <Box
            sx={{
              fontSize: 10.5,
              color: ink3,
              fontFamily: mono,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user.role}
          </Box>
        </Box>

        {/* Settings icon */}
        <Tooltip title="Settings">
          <IconButton
            size="small"
            onClick={onUserSettingsClick}
            aria-label="User settings"
            sx={{
              color: ink3,
              padding: "4px",
              "&:focus-visible": { outline: `2px solid ${blue}`, outlineOffset: 2 },
            }}
          >
            <SettingsIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
