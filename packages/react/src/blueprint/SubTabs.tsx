/**
 * v2 SubTabs — the ≤4-tab strip per surface.
 *
 * Discipline: max 4 tabs per surface. A fifth tab is a sign the IA is
 * leaking — turn it into a workflow card, detail page, or row action.
 * The cap is asserted in dev: passing more than 4 items logs a warning.
 *
 * Active tab gets a 2px ink underline (border-bottom-thick). Counts
 * render as a thin mono number next to the label.
 */
import type { CSSProperties, ReactNode } from "react";
import { BLUEPRINT_FAMILIES } from "@tensorcost/tokens";
import { usePalette } from "./ThemeProvider.js";

export interface SubTab {
  /** Stable identifier — used for the active key + the click callback. */
  id: string;
  /** Display label. */
  label: ReactNode;
  /** Optional count chip — small mono number. */
  count?: number;
  /** Whether this tab is the active one. */
  active?: boolean;
}

export interface SubTabsProps {
  items: readonly SubTab[];
  onTabClick?: (item: SubTab) => void;
  style?: CSSProperties;
  className?: string;
}

const MAX_TABS = 4;

// `process` is a Node global; the kit has no @types/node dep so we
// detect it safely. The guard is dev-time only — production consoles
// stay quiet.
interface MaybeProcess { env?: { NODE_ENV?: string } }
const isDev =
  (globalThis as unknown as { process?: MaybeProcess }).process?.env?.NODE_ENV !== "production";

export function SubTabs({ items, onTabClick, style, className }: SubTabsProps): JSX.Element {
  if (items.length > MAX_TABS && isDev) {
    // eslint-disable-next-line no-console
    console.warn(
      `[ui-kit/SubTabs] ${items.length} tabs supplied — v2 IA caps at ${MAX_TABS}. ` +
        `Demote one to a workflow card, detail page, or row action.`,
    );
  }
  const p = usePalette();
  return (
    <div
      role="tablist"
      className={className}
      style={{
        display: "flex",
        gap: 0,
        borderBottom: `1px solid ${p.paper3}`,
        padding: "0 28px",
        background: p.paper,
        ...style,
      }}
    >
      {items.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={t.active ? "true" : "false"}
          onClick={() => onTabClick?.(t)}
          style={{
            padding: "10px 0 10px 0",
            marginRight: 20,
            marginBottom: -1,
            fontFamily: BLUEPRINT_FAMILIES.body,
            fontSize: 13,
            fontWeight: t.active ? 600 : 400,
            color: t.active ? p.ink : p.ink3,
            display: "flex",
            gap: 6,
            alignItems: "baseline",
            // Reset user-agent button borders via longhand widths; active
            // bottom-border colored, all other sides transparent. Width
            // stays 2 on bottom when inactive to avoid layout shift.
            borderTopWidth: 0,
            borderRightWidth: 0,
            borderLeftWidth: 0,
            borderBottomWidth: 2,
            borderStyle: "solid",
            borderColor: t.active ? p.ink : "transparent",
            borderRadius: 0,
            background: "transparent",
            cursor: "pointer",
          }}
        >
          <span>{t.label}</span>
          {t.count != null && (
            <span
              style={{
                fontFamily: BLUEPRINT_FAMILIES.mono,
                fontSize: 10,
                color: p.faint,
              }}
            >
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
