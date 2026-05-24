/**
 * ProofSection — dark-background "verify it yourself" section with a
 * macOS-style terminal block and optional copy + CTA.
 *
 * SECURITY NOTE: rehype-raw allows raw HTML nodes from markdown. Safe for
 * CMS-authored content. NEVER use this component to render user-submitted content.
 *
 * The terminal mockup is purely decorative — CSS dots and monospace text.
 * No dependencies beyond MarkdownBody (which carries react-markdown + rehype-raw).
 *
 * Renamed from `Proof` to `ProofSection` to avoid collision with any future
 * assertion-library export named `Proof`.
 *
 * Ported from @tensorcost/component-library Proof (Phase 3a-1).
 */
import { type ReactElement } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { MarkdownBody, type MarkdownBodyComponents } from "./MarkdownBody.js";

export type ProofVariant = "split" | "stacked";

export interface ProofSectionProps {
  title?: string;
  /** Markdown body text. */
  body?: string;
  ctaText?: string;
  ctaLink?: string;
  /** Shell command string (the `$ ` prefix is stripped automatically). */
  command?: string;
  /** Output line displayed below the command. */
  output?: string;
  variant?: ProofVariant;
  className?: string;
}

export function ProofSection({
  title = "Verify it yourself.",
  body,
  ctaText,
  ctaLink,
  command = "$ sha256sum savings-ledger.csv",
  output = "a3f2c9b88e1d4f6a9c0b5d8e72f1a4b6c8d9e0f12  savings-ledger.csv",
  variant = "split",
  className,
}: ProofSectionProps): ReactElement {
  const theme = useTheme();

  const primaryColor =
    theme.palette.mode === "dark"
      ? theme.palette.primary.light
      : "#38bdf8";

  // Custom link renderer for the body — matches the original sky-blue link color.
  const bodyComponents: MarkdownBodyComponents = {
    a: ({ node: _node, ...p }: Record<string, unknown>) => (
      <a
        {...(p as React.ComponentPropsWithoutRef<"a">)}
        style={{ color: primaryColor, textDecoration: "underline" }}
      />
    ),
  };

  const isSplit = variant === "split";

  return (
    <Box
      component="section"
      className={className}
      sx={{ py: "4rem", px: "2rem", bgcolor: "#0b1220", color: "#e2e8f0" }}
    >
      <Box
        sx={{
          maxWidth: "1100px",
          mx: "auto",
          display: "grid",
          gridTemplateColumns: isSplit
            ? "repeat(auto-fit, minmax(320px, 1fr))"
            : "1fr",
          gap: isSplit ? "3rem" : "2rem",
          alignItems: "center",
        }}
      >
        {/* Terminal block */}
        <Box
          data-testid="proof-terminal"
          sx={{
            bgcolor: "#020617",
            border: "1px solid #1e293b",
            borderRadius: "10px",
            p: "1.25rem 1.5rem",
            fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
            fontSize: "0.85rem",
            lineHeight: 1.6,
            minWidth: 0,
          }}
        >
          {/* macOS traffic-light dots */}
          <Box sx={{ display: "flex", gap: "0.4rem", mb: "0.75rem" }} aria-hidden>
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#ef4444", display: "inline-block" }} />
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#eab308", display: "inline-block" }} />
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#22c55e", display: "inline-block" }} />
          </Box>
          <Box>
            <Typography component="span" sx={{ color: "#64748b", fontFamily: "inherit", fontSize: "inherit" }}>
              {"$ "}
            </Typography>
            <Typography component="span" sx={{ color: "#e2e8f0", fontFamily: "inherit", fontSize: "inherit" }}>
              {command.replace(/^\$\s*/, "")}
            </Typography>
          </Box>
          <Box sx={{ color: "#94a3b8", mt: "0.5rem", wordBreak: "break-all", fontFamily: "inherit", fontSize: "inherit" }}>
            {output}
          </Box>
        </Box>

        {/* Copy block */}
        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="h2"
            sx={{
              fontSize: "clamp(1.4rem, 4vw, 1.75rem)",
              fontWeight: 700,
              letterSpacing: "-0.015em",
              lineHeight: 1.2,
              mb: "0.75rem",
              color: "#f8fafc",
            }}
          >
            {title}
          </Typography>

          {body && (
            <Box sx={{ fontSize: "1rem", lineHeight: 1.65, opacity: 0.85, mb: "1.5rem" }}>
              {/* trusted-cms-content — see MarkdownBody for rehype-raw security note */}
              <MarkdownBody components={bodyComponents}>{body}</MarkdownBody>
            </Box>
          )}

          {ctaText && ctaLink && (
            <Box
              component="a"
              href={ctaLink}
              sx={{
                display: "inline-flex",
                py: "0.6rem",
                px: "1.2rem",
                borderRadius: "8px",
                border: "1px solid",
                borderColor: primaryColor,
                color: primaryColor,
                textDecoration: "none",
                fontSize: "0.95rem",
                fontWeight: 500,
                "&:hover": { opacity: 0.85 },
              }}
            >
              {ctaText} →
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
