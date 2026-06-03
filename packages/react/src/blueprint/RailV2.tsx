/**
 * v2 RailV2 — the 5-surface navigation rail.
 *
 * Router · Money · Policy · Build · Trust. Pinned to bottom: tenant
 * chip (single click for single-tenant, splits for multi-tenant). No
 * search button in the rail — search is ⌘K, opened from the surface
 * top-bar. No per-item badges — those moved into TopBar.status.
 *
 * The shell renders RailV2 + Surface side-by-side; the design's
 * `Surface` composition helper (in this file too, sister export) is
 * for standalone storyboards.
 */
import type { CSSProperties, ReactNode } from "react";
import { BLUEPRINT_FAMILIES } from "@tensorcost/tokens";
import { usePalette } from "./ThemeProvider.js";

export type SurfaceId = "router" | "money" | "policy" | "build" | "trust";

/** Subtle per-surface line icon, stacked above the index in the rail.
 *  Strokes inherit `currentColor` so the rail controls active/idle colour. */
function surfaceIcon(id: SurfaceId): ReactNode {
  const paths: Record<SurfaceId, ReactNode> = {
    router: <><circle cx="5" cy="12" r="2" /><circle cx="19" cy="6" r="2" /><circle cx="19" cy="18" r="2" /><path d="M7 12 17 6.5M7 12l10 5.5" /></>,
    money: <><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /></>,
    policy: <path d="M12 3l7 3v5c0 4.2-2.9 7.4-7 9-4.1-1.6-7-4.8-7-9V6z" />,
    build: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 9l3 3-3 3M13 15h4" /></>,
    trust: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  };
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {paths[id]}
    </svg>
  );
}

export interface RailItem {
  id: SurfaceId;
  /** "01" .. "05" — the architectural-drawing index. */
  n: string;
  /** Surface name — "Router" / "Money" / etc. */
  name: string;
  /** One-line description shown under the name. */
  sub: string;
}

export const DEFAULT_RAIL_ITEMS: readonly RailItem[] = [
  { id: "router", n: "01", name: "Router", sub: "decisions · savings · quality" },
  { id: "money", n: "02", name: "Money", sub: "spend · allocations · budgets" },
  { id: "policy", n: "03", name: "Policy", sub: "policies · alerts · actions" },
  { id: "build", n: "04", name: "Build", sub: "eval · sdk · custom" },
  { id: "trust", n: "05", name: "Trust", sub: "compliance · admin · audit" },
] as const;

export interface RailV2Props {
  /** Which surface is active. Drives the inked highlight + accent border. */
  active: SurfaceId;
  /** Override the default 5 items — rarely needed; useful for previews. */
  items?: readonly RailItem[];
  /** Click handler. Receives the clicked item. */
  onItemClick?: (item: RailItem) => void;

  /** Tenant name shown in the bottom strip. */
  tenant?: string;
  /** Environment string — "prod · eu-west-1" etc. Shows next to a dot below tenant. */
  environment?: string;
  /** Click handler for the tenant chip. */
  onTenantClick?: () => void;
  /**
   * Click handler for the environment line. When supplied, the env row
   * becomes its own clickable button (so a multi-tenant user can open
   * the environment picker without triggering the tenant picker). When
   * omitted, the env line renders as static text.
   */
  onEnvClick?: () => void;

  /**
   * Logged-in user — email + role string. Rendered as a chip ABOVE the
   * tenant strip when present, mirroring the legacy RailSidebar so a
   * v2-flagged tenant doesn't lose access to its identity surface.
   * Operator feedback 2026-05-25 was that v2 dropped the user info
   * entirely and there was no way to find "who am I signed in as".
   */
  user?: { email: string; role: string };
  /** Click handler for the user chip (typically opens theme/sign-out menu). */
  onUserSettingsClick?: () => void;

  /** Word-mark / logo slot. Replaces the default text "tensorcost" lockup. */
  logoSlot?: ReactNode;
  /** Build/version tag shown under the word-mark. Default omitted. */
  versionLabel?: string;

  /** Rail width. Default 240px. */
  width?: number;
  style?: CSSProperties;
  className?: string;
}

export function RailV2({
  active,
  items = DEFAULT_RAIL_ITEMS,
  onItemClick,
  tenant,
  environment,
  onTenantClick,
  onEnvClick,
  user,
  onUserSettingsClick,
  logoSlot,
  versionLabel,
  width = 240,
  style,
  className,
}: RailV2Props): JSX.Element {
  const p = usePalette();

  return (
    <nav
      aria-label="Primary"
      className={className}
      style={{
        width,
        minWidth: width,
        background: p.paper,
        borderRight: `1px solid ${p.paper3}`,
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {/* Word-mark */}
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${p.paper3}` }}>
        {logoSlot ?? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              aria-hidden
              style={{ width: 14, height: 14, background: "linear-gradient(135deg, #3b82f6, #06b6d4)", display: "inline-block" }}
            />
            <span
              style={{
                fontFamily: BLUEPRINT_FAMILIES.display,
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: p.ink,
              }}
            >
              tensorcost
            </span>
          </div>
        )}
        {versionLabel && (
          <span
            style={{
              fontFamily: BLUEPRINT_FAMILIES.mono,
              fontSize: 9,
              color: p.ink3,
              marginTop: 6,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              display: "block",
            }}
          >
            {versionLabel}
          </span>
        )}
      </div>

      {/* The five surfaces */}
      <ul
        style={{
          flex: 1,
          padding: "10px 0",
          margin: 0,
          listStyle: "none",
        }}
      >
        {items.map((it) => {
          const isActive = it.id === active;
          return (
            <li key={it.id} style={{ margin: 0 }}>
              <button
                type="button"
                onClick={() => onItemClick?.(it)}
                aria-current={isActive ? "page" : undefined}
                style={{
                  display: "grid",
                  gridTemplateColumns: "32px 1fr",
                  gap: 4,
                  width: "100%",
                  padding: "12px 20px",
                  // Active row = elevated paper layer + accent left edge.
                  // Earlier this was bg=p.ink / text=p.paper — the iconic
                  // "ink block" treatment. In LIGHT that read fine; in
                  // DARK mode `p.ink` is cream-white (#ece9e0) so the
                  // active row went near-white against the graphite
                  // sidebar, which operator feedback 2026-05-25 flagged
                  // as wrong ("left nav has white background for selected
                  // menu item"). paper3 gives subtle elevation in both
                  // modes — tan ruled-grid step in light, elevated
                  // graphite in dark — without flipping foreground.
                  background: isActive ? p.paper3 : "transparent",
                  color: p.ink,
                  // Reset user-agent button borders via longhand widths;
                  // active left-border colored, all other sides transparent.
                  // Width stays 3 on left when inactive so the layout
                  // doesn't shift on activation.
                  borderTopWidth: 0,
                  borderRightWidth: 0,
                  borderBottomWidth: 0,
                  borderLeftWidth: 3,
                  borderStyle: "solid",
                  borderColor: isActive ? p.accent : "transparent",
                  // Active left-edge marker sweeps the brand blue→cyan gradient
                  // (matches the marketing site). Falls back to the solid accent
                  // colour above on the rare engine without border-image.
                  ...(isActive
                    ? { borderImage: "linear-gradient(180deg, #3b82f6, #06b6d4) 1" }
                    : {}),
                  borderRadius: 0,
                  cursor: "pointer",
                  textAlign: "left",
                  font: "inherit",
                }}
              >
                <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
                  <span aria-hidden style={{ color: isActive ? p.accent : p.ink3, display: "flex" }}>
                    {surfaceIcon(it.id)}
                  </span>
                  <span
                    style={{
                      fontFamily: BLUEPRINT_FAMILIES.mono,
                      fontSize: 10,
                      fontWeight: 600,
                      // Index colour tracks the row's emphasis — brand accent
                      // when active so it reads as part of the highlight.
                      color: isActive ? p.accent : p.faint,
                      letterSpacing: "0.06em",
                      lineHeight: 1.4,
                    }}
                  >
                    {it.n}
                  </span>
                </span>
                <span>
                  <span
                    style={{
                      fontFamily: BLUEPRINT_FAMILIES.display,
                      fontSize: 17,
                      fontWeight: 500,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.1,
                      display: "block",
                    }}
                  >
                    {it.name}
                  </span>
                  <span
                    style={{
                      fontFamily: BLUEPRINT_FAMILIES.body,
                      fontSize: 11,
                      lineHeight: 1.35,
                      color: isActive ? "rgba(251,250,246,0.7)" : p.ink3,
                      marginTop: 2,
                      display: "block",
                    }}
                  >
                    {it.sub}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* User chip — pinned above the tenant strip when a user prop is
          supplied. Renders the signed-in email + role and a settings
          affordance (gear glyph) on the right. Single-line truncation
          on the email so a long address doesn't push the gear out of
          view. */}
      {user && (
        <button
          type="button"
          onClick={onUserSettingsClick}
          aria-label={`User settings — ${user.email}`}
          style={{
            all: "unset",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 20px",
            borderTopWidth: 1,
            borderTopStyle: "solid",
            borderTopColor: p.paper3,
            background: p.paper,
            color: p.ink,
            cursor: onUserSettingsClick ? "pointer" : "default",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Avatar — single-letter mark from the email. */}
          <span
            aria-hidden
            style={{
              width: 24,
              height: 24,
              flexShrink: 0,
              background: p.ink,
              color: p.paper,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: BLUEPRINT_FAMILIES.mono,
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {(user.email[0] ?? "?").toUpperCase()}
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span
              style={{
                fontFamily: BLUEPRINT_FAMILIES.body,
                fontSize: 12,
                fontWeight: 500,
                color: p.ink,
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.email}
            </span>
            <span
              style={{
                fontFamily: BLUEPRINT_FAMILIES.mono,
                fontSize: 9,
                color: p.ink3,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                display: "block",
              }}
            >
              {user.role}
            </span>
          </span>
          {onUserSettingsClick && (
            <span
              aria-hidden
              style={{
                fontFamily: BLUEPRINT_FAMILIES.mono,
                fontSize: 14,
                color: p.ink3,
                flexShrink: 0,
              }}
            >
              ⚙
            </span>
          )}
        </button>
      )}

      {/* Tenant + env strip — pinned bottom. Two separately-clickable
          buttons when both handlers are supplied (multi-tenant case);
          otherwise the env line stays a static span (single-tenant). */}
      {tenant && (
        <div
          style={{
            padding: "12px 20px",
            borderTopWidth: 1,
            borderTopStyle: "solid",
            borderTopColor: p.paper3,
            background: p.paper2,
            color: p.ink,
          }}
        >
          <button
            type="button"
            onClick={onTenantClick}
            aria-label={`Tenant ${tenant}`}
            style={{
              all: "unset",
              display: "block",
              width: "100%",
              cursor: onTenantClick ? "pointer" : "default",
              textAlign: "left",
            }}
          >
            <span
              style={{
                fontFamily: BLUEPRINT_FAMILIES.mono,
                fontSize: 9,
                color: p.ink3,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 4,
              }}
            >
              Tenant
            </span>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: BLUEPRINT_FAMILIES.body, fontSize: 13, fontWeight: 500 }}>
                {tenant}
              </span>
              <span
                aria-hidden
                style={{ fontFamily: BLUEPRINT_FAMILIES.mono, fontSize: 10, color: p.ink3 }}
              >
                ↕
              </span>
            </div>
          </button>
          {environment && onEnvClick && (
            <button
              type="button"
              onClick={onEnvClick}
              aria-label={`Environment ${environment}`}
              style={{
                all: "unset",
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: 6,
                cursor: "pointer",
                width: "100%",
              }}
            >
              <span
                aria-hidden
                style={{ width: 6, height: 6, background: p.accent, display: "inline-block" }}
              />
              <span style={{ fontFamily: BLUEPRINT_FAMILIES.mono, fontSize: 10, color: p.ink2 }}>
                {environment}
              </span>
              <span
                aria-hidden
                style={{ marginLeft: "auto", fontFamily: BLUEPRINT_FAMILIES.mono, fontSize: 10, color: p.ink3 }}
              >
                ↕
              </span>
            </button>
          )}
          {environment && !onEnvClick && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
              <span
                aria-hidden
                style={{ width: 6, height: 6, background: p.accent, display: "inline-block" }}
              />
              <span style={{ fontFamily: BLUEPRINT_FAMILIES.mono, fontSize: 10, color: p.ink2 }}>
                {environment}
              </span>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
