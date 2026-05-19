import { type ComponentType, useEffect, useRef, useState } from "react";
import { Box, ButtonBase, IconButton, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  UnfoldMore as UnfoldMoreIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  PushPin as PushPinIcon,
  PushPinOutlined as PushPinOutlinedIcon,
} from "@mui/icons-material";

// RailSidebar — navrail primitive (2026-05-19, user override 2026-05-19)
//
// User override: spec said "always 240px, never collapses." User overrides
// to collapse-by-default (56px icon rail) with hover-to-expand + click-to-pin.
//
// Five zones (top → bottom):
//   1. Brand: gradient dot + "TensorCost" wordmark (collapsed: dot only)
//   2. Tenant chip: full-width button (collapsed: HIDDEN)
//   3. Search: 32px (collapsed: HIDDEN)
//   4. Item list: scrollable, icon-only in collapsed mode with tooltips
//   5. User footer: avatar (collapsed: avatar only)
//
// Expand behavior:
//   - Hover: expands after 100ms delay, collapses 200ms after mouseLeave
//   - Pin button (top-right when expanded): locks open; persists in localStorage
//   - defaultCollapsed: default true (collapse-by-default user override)

export type NavItemKey =
  | "home"
  | "costs"
  | "gpu"
  | "ai"
  | "monitoring"
  | "savings"
  | "routing"
  | "reports"
  | "alerts"
  | "enforcement"
  | "compliance"
  | "admin"
  | "integrations"
  | "settings";

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
  /**
   * Whether the sidebar starts collapsed.
   * Defaults to true — the user override from 2026-05-19.
   */
  defaultCollapsed?: boolean;
  /**
   * External pin state (host-controlled). When pinned the sidebar stays
   * expanded even after mouseLeave. Persist via onPinChange.
   */
  pinned?: boolean;
  onPinChange?: (pinned: boolean) => void;
}

const COLLAPSED_WIDTH = 56;
const EXPANDED_WIDTH = 240;
const LS_PIN_KEY = "tensorcost.navrail.pinned";

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
  defaultCollapsed = true,
  pinned: externalPinned,
  onPinChange,
}: RailSidebarProps): JSX.Element {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const b = theme.palette.brand;

  // Internal pin state — used when the host doesn't supply pinned/onPinChange.
  const [internalPinned, setInternalPinned] = useState<boolean>(() => {
    // On first mount, read the localStorage preference.
    try {
      return localStorage.getItem(LS_PIN_KEY) === "true";
    } catch {
      return false;
    }
  });

  // The "effective" pin state: host-controlled if prop is provided, else internal.
  const isControlled = externalPinned !== undefined;
  const isPinned = isControlled ? (externalPinned ?? false) : internalPinned;

  const togglePin = (): void => {
    const next = !isPinned;
    if (isControlled) {
      onPinChange?.(next);
    } else {
      setInternalPinned(next);
    }
    try {
      localStorage.setItem(LS_PIN_KEY, next ? "true" : "false");
    } catch {
      // localStorage not available in this env — non-fatal
    }
  };

  // Hover-expand state (ignores pinned — pinned stays expanded regardless).
  const [hoverExpanded, setHoverExpanded] = useState(false);
  const expandTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Whether the sidebar is currently showing in expanded layout.
  // Pinned → always expanded. Hover-expanded → also expanded. Otherwise collapsed.
  // When defaultCollapsed=false, start in expanded state unless the pin says otherwise.
  const [forcedOpen] = useState(!defaultCollapsed && !isPinned);
  const isExpanded = isPinned || hoverExpanded || forcedOpen;

  const handleMouseEnter = (): void => {
    if (isPinned) return; // already locked open
    if (collapseTimer.current) {
      clearTimeout(collapseTimer.current);
      collapseTimer.current = null;
    }
    expandTimer.current = setTimeout(() => {
      setHoverExpanded(true);
    }, 100); // 100ms delay per spec — brushing past doesn't trigger
  };

  const handleMouseLeave = (): void => {
    if (isPinned) return; // locked — don't collapse
    if (expandTimer.current) {
      clearTimeout(expandTimer.current);
      expandTimer.current = null;
    }
    collapseTimer.current = setTimeout(() => {
      setHoverExpanded(false);
    }, 200); // 200ms delay per spec
  };

  // Clean up timers on unmount.
  useEffect(() => {
    return () => {
      if (expandTimer.current) clearTimeout(expandTimer.current);
      if (collapseTimer.current) clearTimeout(collapseTimer.current);
    };
  }, []);

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

  const currentWidth = isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH;

  return (
    <Box
      component="aside"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        width: currentWidth,
        flexShrink: 0,
        background: sidebarBg,
        borderRight: `1px solid ${border}`,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        fontFamily: "'Inter', system-ui, sans-serif",
        // Smooth width transition — 150ms matches design system motion token.
        transition: `width ${motionFast}`,
        overflow: "hidden",
        position: "relative",
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
          flexShrink: 0,
          minWidth: 0,
          position: "relative",
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
        {/* Wordmark — hidden in collapsed mode via overflow:hidden on the parent */}
        <Box
          component="span"
          sx={{
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: "-0.02em",
            color: ink,
            opacity: isExpanded ? 1 : 0,
            transition: `opacity ${motionFast}`,
            whiteSpace: "nowrap",
            overflow: "hidden",
            flex: 1,
          }}
        >
          TensorCost
        </Box>

        {/* Pin button — only visible when expanded */}
        {isExpanded && (
          <Tooltip title={isPinned ? "Unpin sidebar" : "Pin sidebar open"}>
            <IconButton
              size="small"
              onClick={togglePin}
              aria-label={isPinned ? "Unpin sidebar" : "Pin sidebar open"}
              aria-pressed={isPinned}
              sx={{
                color: isPinned ? blue : ink3,
                padding: "2px",
                flexShrink: 0,
                "&:focus-visible": { outline: `2px solid ${blue}`, outlineOffset: 2 },
              }}
            >
              {isPinned ? (
                <PushPinIcon sx={{ fontSize: 14 }} />
              ) : (
                <PushPinOutlinedIcon sx={{ fontSize: 14 }} />
              )}
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Zone 2 — Tenant chip (hidden in collapsed mode) */}
      <Box
        sx={{
          padding: "0 12px 10px",
          opacity: isExpanded ? 1 : 0,
          height: isExpanded ? "auto" : 0,
          overflow: "hidden",
          transition: `opacity ${motionFast}`,
          flexShrink: 0,
        }}
      >
        <ButtonBase
          onClick={onTenantClick}
          aria-label={`Switch tenant: ${tenant} / ${env}`}
          tabIndex={isExpanded ? 0 : -1}
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

      {/* Zone 3 — Search input (hidden in collapsed mode) */}
      <Box
        sx={{
          padding: "0 12px 10px",
          opacity: isExpanded ? 1 : 0,
          height: isExpanded ? "auto" : 0,
          overflow: "hidden",
          transition: `opacity ${motionFast}`,
          flexShrink: 0,
        }}
      >
        <ButtonBase
          onClick={onSearch}
          aria-label="Search (⌘K)"
          role="searchbox"
          tabIndex={isExpanded ? 0 : -1}
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
          overflowX: "hidden",
          padding: isExpanded ? "4px 8px 12px" : "4px 4px 12px",
          transition: `padding ${motionFast}`,
        }}
      >
        {items.map((item) => {
          const isActive = active === item.key;
          const IconComponent = item.icon;
          const hasBadge = item.badge != null || (item.key === "alerts" && alertsCount > 0);
          const badgeCount = item.badge?.count ?? (item.key === "alerts" ? alertsCount : 0);
          const bKind = item.badge?.kind ?? "danger";
          const bColor = hasBadge ? badgeColor(bKind, isDark) : undefined;

          // Build tooltip content: label + hint/badge if present.
          const tooltipLabel = item.hint
            ? `${item.label} — ${item.hint}`
            : hasBadge
            ? `${item.label} (${badgeCount})`
            : item.label;

          const itemButton = (
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
                gap: isExpanded ? "10px" : 0,
                width: "100%",
                padding: isExpanded ? "8px 10px" : "8px 6px",
                justifyContent: isExpanded ? "flex-start" : "center",
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
                transition: `background ${motionFast}, color ${motionFast}, padding ${motionFast}, gap ${motionFast}`,
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

              {/* Label — hidden in collapsed mode */}
              <Box
                component="span"
                sx={{
                  flex: 1,
                  opacity: isExpanded ? 1 : 0,
                  width: isExpanded ? "auto" : 0,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  transition: `opacity ${motionFast}`,
                }}
              >
                {item.label}
              </Box>

              {/* Badge or hint — only visible when expanded */}
              {isExpanded && hasBadge ? (
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
                    flexShrink: 0,
                  }}
                >
                  {badgeCount}
                </Box>
              ) : isExpanded && item.hint ? (
                <Box
                  component="span"
                  sx={{
                    fontSize: "10.5px",
                    color: ink3,
                    fontFamily: mono,
                    flexShrink: 0,
                  }}
                >
                  {item.hint}
                </Box>
              ) : null}

              {/* Collapsed-mode badge dot — tiny indicator so the badge isn't entirely invisible */}
              {!isExpanded && hasBadge ? (
                <Box
                  component="span"
                  aria-hidden="true"
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: bColor,
                  }}
                />
              ) : null}
            </ButtonBase>
          );

          // Wrap with tooltip when collapsed for keyboard/pointer discoverability.
          return !isExpanded ? (
            <Tooltip
              key={item.key}
              title={tooltipLabel}
              placement="right"
              enterDelay={0}
              enterNextDelay={0}
            >
              {/* Tooltip needs a single forwardRef child — Box wrapper here */}
              <Box sx={{ position: "relative" }}>
                {itemButton}
              </Box>
            </Tooltip>
          ) : (
            <Box key={item.key} sx={{ position: "relative" }}>
              {itemButton}
            </Box>
          );
        })}
      </Box>

      {/* Zone 5 — User footer */}
      <Box
        sx={{
          padding: isExpanded ? "12px 14px" : "12px 8px",
          borderTop: `1px solid ${border}`,
          display: "flex",
          alignItems: "center",
          gap: isExpanded ? "10px" : 0,
          justifyContent: isExpanded ? "flex-start" : "center",
          transition: `padding ${motionFast}, gap ${motionFast}`,
          flexShrink: 0,
          overflow: "hidden",
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

        {/* Email + role — hidden in collapsed mode */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            opacity: isExpanded ? 1 : 0,
            width: isExpanded ? "auto" : 0,
            overflow: "hidden",
            transition: `opacity ${motionFast}`,
          }}
        >
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

        {/* Settings icon — only shown in expanded mode */}
        {isExpanded && (
          <Tooltip title="Settings">
            <IconButton
              size="small"
              onClick={onUserSettingsClick}
              aria-label="User settings"
              sx={{
                color: ink3,
                padding: "4px",
                flexShrink: 0,
                "&:focus-visible": { outline: `2px solid ${blue}`, outlineOffset: 2 },
              }}
            >
              <SettingsIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}
