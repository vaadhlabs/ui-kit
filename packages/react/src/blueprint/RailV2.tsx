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
import { BLUEPRINT_FAMILIES, BLUEPRINT_LIGHT } from "@tensorcost/tokens";

export type SurfaceId = "router" | "money" | "policy" | "build" | "trust";

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
  logoSlot,
  versionLabel,
  width = 240,
  style,
  className,
}: RailV2Props): JSX.Element {
  const p = BLUEPRINT_LIGHT;

  return (
    <nav
      aria-label="Primary"
      className={className}
      style={{
        width,
        minWidth: width,
        background: p.paper,
        borderRight: `1px solid ${p.ink}`,
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {/* Word-mark */}
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${p.ink}` }}>
        {logoSlot ?? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              aria-hidden
              style={{ width: 14, height: 14, background: p.accent, display: "inline-block" }}
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
                  background: isActive ? p.ink : "transparent",
                  color: isActive ? p.paper : p.ink,
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
                  borderRadius: 0,
                  cursor: "pointer",
                  textAlign: "left",
                  font: "inherit",
                }}
              >
                <span
                  style={{
                    fontFamily: BLUEPRINT_FAMILIES.mono,
                    fontSize: 10,
                    fontWeight: 600,
                    color: isActive ? p.paper : p.faint,
                    letterSpacing: "0.06em",
                    lineHeight: 1.4,
                  }}
                >
                  {it.n}
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

      {/* Tenant strip — pinned bottom */}
      {tenant && (
        <button
          type="button"
          onClick={onTenantClick}
          aria-label={`Tenant ${tenant}${environment ? ` · ${environment}` : ""}`}
          style={{
            padding: "12px 20px",
            borderTop: `1px solid ${p.ink}`,
            border: "none",
            borderTopWidth: 1,
            borderTopStyle: "solid",
            borderTopColor: p.ink,
            background: p.paper2,
            color: p.ink,
            textAlign: "left",
            cursor: onTenantClick ? "pointer" : "default",
            font: "inherit",
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
          {environment && (
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
        </button>
      )}
    </nav>
  );
}
