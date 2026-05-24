/**
 * MarkdownBody — thin wrapper around react-markdown + rehype-raw with
 * shared element styling.
 *
 * SECURITY NOTE: rehype-raw allows raw HTML nodes embedded in markdown.
 * This is safe for CMS-authored content where the source is trusted.
 * NEVER render user-submitted or untrusted content through this component —
 * rehype-raw bypasses markdown's default HTML escaping and would open an
 * XSS vector.
 *
 * Ported from @tensorcost/component-library MarkdownRichText (Phase 3a-1).
 */
import { type ReactElement, type ComponentPropsWithoutRef } from "react";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

// The custom component type react-markdown passes to overrides.
// We keep this deliberately loose — react-markdown's own generic types
// are complex; matching the minimal subset we use is cleaner.
type MdComponent = (props: Record<string, unknown>) => ReactElement | null;

export interface MarkdownBodyComponents {
  p?: MdComponent;
  ul?: MdComponent;
  ol?: MdComponent;
  li?: MdComponent;
  h3?: MdComponent;
  h4?: MdComponent;
  code?: MdComponent;
  a?: MdComponent;
  [key: string]: MdComponent | undefined;
}

export interface MarkdownBodyProps {
  /** Markdown string (may contain raw HTML when sourced from a trusted CMS). */
  children?: string;
  /** Override or extend the default element renderers. */
  components?: MarkdownBodyComponents;
  /** Forwarded to the wrapper Box. */
  sx?: ComponentPropsWithoutRef<typeof Box>["sx"];
  className?: string;
}

/**
 * Default element renderers. Consumers can override individual keys by
 * passing `components` — the caller's overrides are merged on top.
 */
function buildDefaultComponents(linkColor: string): MarkdownBodyComponents {
  return {
    p: ({ node: _node, ...p }) => (
      <p style={{ margin: "0 0 1rem" }} {...(p as ComponentPropsWithoutRef<"p">)} />
    ),
    ul: ({ node: _node, ...p }) => (
      <ul style={{ margin: "0 0 1rem", paddingLeft: "1.5rem" }} {...(p as ComponentPropsWithoutRef<"ul">)} />
    ),
    ol: ({ node: _node, ...p }) => (
      <ol style={{ margin: "0 0 1rem", paddingLeft: "1.5rem" }} {...(p as ComponentPropsWithoutRef<"ol">)} />
    ),
    li: ({ node: _node, ...p }) => (
      <li style={{ margin: "0 0 0.4rem" }} {...(p as ComponentPropsWithoutRef<"li">)} />
    ),
    h3: ({ node: _node, ...p }) => (
      <h3
        style={{ margin: "1.5rem 0 0.5rem", fontSize: "1.15rem", fontWeight: 600 }}
        {...(p as ComponentPropsWithoutRef<"h3">)}
      />
    ),
    h4: ({ node: _node, ...p }) => (
      <h4
        style={{ margin: "1.25rem 0 0.4rem", fontSize: "1.05rem", fontWeight: 600 }}
        {...(p as ComponentPropsWithoutRef<"h4">)}
      />
    ),
    code: ({ node: _node, inline, ...p }: Record<string, unknown>) =>
      inline ? (
        <code
          style={{
            background: "rgba(0,0,0,0.06)",
            padding: "0.1rem 0.35rem",
            borderRadius: 4,
            fontSize: "0.92em",
          }}
          {...(p as ComponentPropsWithoutRef<"code">)}
        />
      ) : (
        <code {...(p as ComponentPropsWithoutRef<"code">)} />
      ),
    a: ({ node: _node, ...p }) => (
      <a
        style={{ color: linkColor, textDecoration: "underline" }}
        {...(p as ComponentPropsWithoutRef<"a">)}
      />
    ),
  };
}

export function MarkdownBody({
  children = "",
  components,
  sx,
  className,
}: MarkdownBodyProps): ReactElement {
  const theme = useTheme();
  const linkColor = theme.palette.primary.main;

  const defaults = buildDefaultComponents(linkColor);
  const merged: MarkdownBodyComponents =
    components === undefined ? defaults : { ...defaults, ...components };

  return (
    <Box className={className} sx={sx}>
      {/* trusted-cms-content — see module-level security note */}
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        components={merged as any}
      >
        {children}
      </ReactMarkdown>
    </Box>
  );
}
