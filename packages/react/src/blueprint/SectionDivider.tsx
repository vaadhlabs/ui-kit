/**
 * v2 SectionDivider — document-section header. Used between long-form
 * sections of marketing / docs / thesis pages.
 *
 * Renamed from the design's `SectionHeader` to avoid colliding with the
 * existing kit's `SectionHeader` export (Workshop's page-header
 * component). This one is a document divider: big accent number,
 * eyebrow kicker, large H1 title, optional body paragraph.
 */
import type { CSSProperties, ReactNode } from "react";
import { BLUEPRINT_FAMILIES, BLUEPRINT_LIGHT } from "@tensorcost/tokens";
import { B, Eyebrow, H1 } from "./Text.js";

export interface SectionDividerProps {
  /** The big number — "01", "02", "00.5". */
  no: ReactNode;
  /** Mono kicker under the number — "01 · Router · the homepage". */
  kicker: ReactNode;
  /** H1 title. */
  title: ReactNode;
  /** Optional intro paragraph. */
  body?: ReactNode;
  /** Override the number color. Defaults to palette accent. */
  accent?: string;
  /** Override the H1 size. Default 44. */
  titleSize?: number | string;
  style?: CSSProperties;
  className?: string;
}

export function SectionDivider({
  no,
  kicker,
  title,
  body,
  accent,
  titleSize = 44,
  style,
  className,
}: SectionDividerProps): JSX.Element {
  const p = BLUEPRINT_LIGHT;
  const numberColor = accent ?? p.accent;
  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: "120px 1fr",
        gap: 32,
        marginBottom: 28,
        ...style,
      }}
    >
      <div>
        <div
          style={{
            fontFamily: BLUEPRINT_FAMILIES.mono,
            fontSize: 48,
            fontWeight: 500,
            color: numberColor,
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {no}
        </div>
        <div style={{ marginTop: 8 }}>
          <Eyebrow>{kicker}</Eyebrow>
        </div>
      </div>
      <div>
        <H1 size={titleSize}>{title}</H1>
        {body && (
          <B size={16} color={p.ink2} style={{ marginTop: 14, maxWidth: 720 }}>
            {body}
          </B>
        )}
      </div>
    </div>
  );
}
