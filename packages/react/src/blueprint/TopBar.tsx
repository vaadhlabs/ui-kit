/**
 * v2 TopBar — the page header that lives inside Surface.
 *
 * Eyebrow (sub) sits above the title. `status` holds tags / pills; the
 * environment switcher lives here per the W1 design call. `actions`
 * holds Btn instances on the right.
 */
import type { CSSProperties, ReactNode } from "react";
import { usePalette } from "./ThemeProvider.js";
import { Eyebrow, H2 } from "./Text.js";

export interface TopBarProps {
  /** Page title — "Live router", "Spend explorer". */
  title: ReactNode;
  /** Eyebrow line above the title — "01 · Router · Live". */
  sub?: ReactNode;
  /** Status pills (Tag instances) — also where env-switcher lives in v2. */
  status?: ReactNode;
  /** Right-aligned actions (Btn instances). */
  actions?: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export function TopBar({
  title,
  sub,
  status,
  actions,
  style,
  className,
}: TopBarProps): JSX.Element {
  const p = usePalette();
  const css: CSSProperties = {
    display: "flex",
    alignItems: "flex-end",
    gap: 16,
    padding: "20px 28px",
    borderBottom: `1px solid ${p.ink}`,
    background: p.paper,
    ...style,
  };
  return (
    <header className={className} style={css}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {sub && <Eyebrow>{sub}</Eyebrow>}
        <H2 size={28} style={{ marginTop: sub ? 6 : 0 }}>
          {title}
        </H2>
      </div>
      {status && <div style={{ display: "flex", gap: 6, alignItems: "center" }}>{status}</div>}
      {actions && <div style={{ display: "flex", gap: 6, alignItems: "center" }}>{actions}</div>}
    </header>
  );
}
