/**
 * v2 Surface — the per-page composition helper.
 *
 * Renders TopBar + SubTabs + scrollable body. Designed to live inside
 * the shell's `<main>` (the shell owns RailV2 + outer flex layout).
 * For standalone storyboards / status pages / embed widgets, see
 * `SurfaceFramed` which wraps Surface in a Frame.
 *
 * The 28px body padding matches the design's spec sheet rhythm.
 */
import type { CSSProperties, ReactNode } from "react";
import { usePalette } from "./ThemeProvider.js";
import { Frame } from "./Frame.js";
import type { FrameProps } from "./Frame.js";
import { RailV2 } from "./RailV2.js";
import type { RailV2Props, SurfaceId } from "./RailV2.js";
import { SubTabs } from "./SubTabs.js";
import type { SubTab } from "./SubTabs.js";
import { TopBar } from "./TopBar.js";
import type { TopBarProps } from "./TopBar.js";

export interface SurfaceProps {
  /** Title (passed to TopBar). */
  title: ReactNode;
  /** Eyebrow above title. */
  sub?: ReactNode;
  /** Status pills. Includes env-switcher in v2. */
  status?: ReactNode;
  /** Right-aligned actions. */
  actions?: ReactNode;
  /** Optional ≤4-tab strip. */
  tabs?: readonly SubTab[];
  onTabClick?: TopBarTabClickHandler;
  /** Body — the page content. Scrolls inside. */
  children?: ReactNode;
  /** Override default 28px body padding. */
  bodyPadding?: number | string;
  style?: CSSProperties;
  className?: string;
}

type TopBarTabClickHandler = (item: SubTab) => void;

export function Surface({
  title,
  sub,
  status,
  actions,
  tabs,
  onTabClick,
  children,
  bodyPadding = 28,
  style,
  className,
}: SurfaceProps): JSX.Element {
  const p = usePalette();
  return (
    <section
      className={className}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: p.paper,
        minWidth: 0,
        overflow: "hidden",
        ...style,
      }}
    >
      <TopBar title={title} sub={sub} status={status} actions={actions} />
      {tabs && <SubTabs items={tabs} onTabClick={onTabClick} />}
      <div
        style={{
          flex: 1,
          padding: bodyPadding,
          overflow: "auto",
          background: p.paper,
        }}
      >
        {children}
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------
// SurfaceFramed — standalone-storyboard variant. Wraps Surface in a Frame
// and adds RailV2 to its left. Used in Storybook stories and in
// pre-auth surfaces (the public status page, embed widgets) that don't
// live inside the authenticated shell.
// ----------------------------------------------------------------------------

export interface SurfaceFramedProps extends SurfaceProps {
  /** Active surface — drives the rail highlight. */
  active: SurfaceId;
  /** Forwarded to RailV2 — items override, click handler, tenant chip etc. */
  rail?: Omit<RailV2Props, "active">;
  /** Forwarded to Frame — title bar path, width, height. */
  frame?: Omit<FrameProps, "children">;
}

export function SurfaceFramed({
  active,
  rail,
  frame,
  ...surface
}: SurfaceFramedProps): JSX.Element {
  return (
    <Frame title={`/${active}`} {...frame}>
      <RailV2 active={active} {...rail} />
      <Surface {...surface} />
    </Frame>
  );
}
