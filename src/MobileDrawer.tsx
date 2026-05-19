import { useEffect, useRef, type ComponentType } from "react";
import { Box, ButtonBase, IconButton, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  UnfoldMore as UnfoldMoreIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

// MobileDrawer — navrail primitive (2026-05-19)
//
// Spec: design_handoff_navigation_rail/README.md §Mobile drawer
// Width 312px, slides from left. 55%-opacity slate-900 scrim covers rest.
// Open: 240ms cubic-bezier(0.4, 0, 0.2, 1).
// Close: 200ms same easing.
// Dismiss: scrim tap OR swipe-left >40px.
// Keyboard: ESC closes.
//
// Drawer content matches desktop sidebar 1:1 but larger touch targets
// (item rows 40px, avatar 32px) per spec §Mobile artboards.

export interface MobileNavItem {
  key: string;
  label: string;
  icon: ComponentType<{ sx?: object; fontSize?: string }>;
  path: string;
  hint?: string;
  badge?: { kind: "ok" | "warn" | "danger" | "info"; count: number };
}

export interface MobileDrawerUser {
  email: string;
  role: string;
  avatarUrl?: string;
}

export interface MobileDrawerProps {
  open: boolean;
  active: string;
  items: MobileNavItem[];
  tenant: string;
  env: string;
  user: MobileDrawerUser;
  alertsCount: number;
  onClose: () => void;
  onItemClick?: (item: MobileNavItem) => void;
  onTenantClick?: () => void;
  onUserSettingsClick?: () => void;
}

// Swipe detection threshold in px per spec.
const SWIPE_THRESHOLD = 40;

export function MobileDrawer({
  open,
  active,
  items,
  tenant,
  env,
  user,
  alertsCount,
  onClose,
  onItemClick,
  onTenantClick,
  onUserSettingsClick,
}: MobileDrawerProps): JSX.Element {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const b = theme.palette.brand;

  const paper = b?.paper ?? (isDark ? "#1E293B" : "#FFFFFF");
  const border = b?.border ?? (isDark ? "rgba(148,163,184,0.16)" : "#E2E8F0");
  const ink = b?.ink ?? (isDark ? "#F8FAFC" : "#0F172A");
  const ink2 = b?.ink2 ?? (isDark ? "#CBD5E1" : "#475569");
  const ink3 = b?.ink3 ?? (isDark ? "#94A3B8" : "#94A3B8");
  const blue = b?.blue ?? (isDark ? "#60A5FA" : "#3B82F6");
  const cyan = b?.cyan ?? (isDark ? "#22D3EE" : "#06B6D4");
  const danger = b?.danger ?? (isDark ? "#F87171" : "#EF4444");
  const mono = b?.mono ?? "'JetBrains Mono', ui-monospace, monospace";
  const motionOpen = b?.motionDrawerOpen ?? "240ms cubic-bezier(0.4,0,0.2,1)";
  const motionClose = b?.motionDrawerClose ?? "200ms cubic-bezier(0.4,0,0.2,1)";
  const iconTileBg = isDark ? "rgba(255,255,255,0.04)" : "#F1F5F9";

  const drawerRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);

  // ESC to close.
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Swipe-left to dismiss. Track touchstart X, on touchend check delta.
  function handleTouchStart(e: React.TouchEvent) {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartXRef.current === null) return;
    const deltaX = (e.changedTouches[0]?.clientX ?? 0) - touchStartXRef.current;
    // Negative deltaX = swipe left
    if (deltaX < -SWIPE_THRESHOLD) {
      onClose();
    }
    touchStartXRef.current = null;
  }

  const avatarInitial = user.email.charAt(0).toUpperCase();
  const transition = open ? motionOpen : motionClose;

  return (
    // Render both scrim and drawer unconditionally; animate via transform/opacity.
    // This preserves the DOM node for animation — visibility follows open state.
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1300,
        pointerEvents: open ? "auto" : "none",
      }}
      aria-hidden={!open}
    >
      {/* Scrim — 55% opacity slate-900 */}
      <Box
        onClick={onClose}
        aria-label="Close navigation menu"
        sx={{
          position: "absolute",
          inset: 0,
          background: "rgba(15,23,42,0.55)",
          opacity: open ? 1 : 0,
          transition: `opacity ${transition}`,
        }}
      />

      {/* Drawer */}
      <Box
        ref={drawerRef}
        component="aside"
        aria-label="Navigation menu"
        aria-modal={open}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        sx={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: 312,
          background: paper,
          display: "flex",
          flexDirection: "column",
          // 50px iOS status bar inset
          paddingTop: "env(safe-area-inset-top, 50px)",
          boxShadow: "8px 0 32px rgba(15,23,42,0.18)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: `transform ${transition}`,
          fontFamily: "'Inter', system-ui, sans-serif",
          zIndex: 1,
        }}
      >
        {/* Brand */}
        <Box sx={{ padding: "14px 16px 12px", display: "flex", alignItems: "center", gap: "8px" }}>
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
          <Box component="span" sx={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.02em", color: ink }}>
            TensorCost
          </Box>
        </Box>

        {/* Tenant chip */}
        <Box sx={{ padding: "0 12px 10px" }}>
          <ButtonBase
            onClick={onTenantClick}
            aria-label={`Switch tenant: ${tenant} / ${env}`}
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 12px",
              background: isDark ? "rgba(255,255,255,0.04)" : "#FAFBFC",
              border: `1px solid ${border}`,
              borderRadius: "8px",
              cursor: "pointer",
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 13,
              color: ink,
              fontWeight: 500,
              textAlign: "left",
            }}
          >
            <Box component="span" aria-hidden="true" sx={{ width: 6, height: 6, borderRadius: "50%", background: cyan, flexShrink: 0 }} />
            <Box component="span" sx={{ color: ink, fontWeight: 500 }}>{tenant}</Box>
            <Box component="span" sx={{ color: ink3, fontWeight: 400 }}>{" "}/{" "}{env}</Box>
            <Box component="span" sx={{ flex: 1 }} />
            <UnfoldMoreIcon sx={{ fontSize: 14, color: ink3 }} />
          </ButtonBase>
        </Box>

        {/* Search */}
        <Box sx={{ padding: "0 12px 12px" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              height: 36,
              padding: "0 12px",
              background: isDark ? "rgba(255,255,255,0.04)" : "#FAFBFC",
              border: `1px solid ${border}`,
              borderRadius: "8px",
            }}
          >
            <SearchIcon sx={{ fontSize: 14, color: ink3 }} />
            <Box component="span" sx={{ flex: 1, fontSize: 13, color: ink3 }}>Find anything</Box>
          </Box>
        </Box>

        {/* Item list — 40px touch targets */}
        <Box
          component="nav"
          aria-label="Main navigation"
          sx={{ flex: 1, overflowY: "auto", padding: "4px 8px 12px" }}
        >
          {items.map((item) => {
            const isActive = active === item.key;
            const IconComponent = item.icon;
            const hasBadge = item.badge != null || (item.key === "alerts" && alertsCount > 0);
            const badgeCount = item.badge?.count ?? (item.key === "alerts" ? alertsCount : 0);

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
                  // 40px touch target per spec (vs 36px on desktop)
                  padding: "10px 10px",
                  margin: "1px 0",
                  background: isActive
                    ? (isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9")
                    : "transparent",
                  border: "1px solid transparent",
                  borderRadius: "8px",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: 14,
                  color: isActive ? ink : ink2,
                  fontWeight: isActive ? 600 : 500,
                  letterSpacing: "-0.005em",
                  textDecoration: "none",
                  "&:focus-visible": { outline: `2px solid ${blue}`, outlineOffset: 2 },
                }}
              >
                {/* Icon tile 28×28 for mobile (vs 24×24 desktop) */}
                <Box
                  component="span"
                  aria-hidden="true"
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "7px",
                    background: isActive ? `${blue}22` : iconTileBg,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <IconComponent sx={{ fontSize: 15, color: isActive ? blue : ink2 }} />
                </Box>
                <Box component="span" sx={{ flex: 1 }}>{item.label}</Box>
                {hasBadge ? (
                  <Box
                    component="span"
                    aria-label={`${badgeCount} alerts`}
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: 18,
                      height: 18,
                      padding: "0 6px",
                      borderRadius: "999px",
                      background: danger,
                      color: isDark ? "#0F172A" : "#fff",
                      fontSize: 10,
                      fontWeight: 700,
                      fontFamily: mono,
                    }}
                  >
                    {badgeCount}
                  </Box>
                ) : item.hint ? (
                  <Box component="span" sx={{ fontSize: 11, color: ink3, fontFamily: mono }}>
                    {item.hint}
                  </Box>
                ) : null}
              </ButtonBase>
            );
          })}
        </Box>

        {/* User footer — 32px avatar per spec (vs 28px desktop) */}
        <Box sx={{ padding: "12px 16px", borderTop: `1px solid ${border}`, display: "flex", alignItems: "center", gap: "10px" }}>
          {user.avatarUrl ? (
            <Box
              component="img"
              src={user.avatarUrl}
              alt={user.email}
              sx={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
            />
          ) : (
            <Box
              component="span"
              aria-label={user.email}
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: blue,
                color: isDark ? "#0F172A" : "#fff",
                display: "grid",
                placeItems: "center",
                fontSize: 13,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {avatarInitial}
            </Box>
          )}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ fontSize: 13, fontWeight: 600, color: ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.email}
            </Box>
            <Box sx={{ fontSize: 11, color: ink3, fontFamily: mono, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.role}
            </Box>
          </Box>
          <Tooltip title="Settings">
            <IconButton
              size="small"
              onClick={onUserSettingsClick}
              aria-label="User settings"
              sx={{ color: ink3, padding: "4px", "&:focus-visible": { outline: `2px solid ${blue}`, outlineOffset: 2 } }}
            >
              <SettingsIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}
