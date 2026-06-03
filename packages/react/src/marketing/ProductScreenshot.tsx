/**
 * ProductScreenshot — CMS product-visual section.
 *
 * A text column paired with a framed product screenshot (or a built-in
 * dashboard mockup when no image is supplied). Supports a side-by-side
 * `split` layout and a stacked `centered` layout.
 *
 * Ported from @tensorcost/component-library ProductScreenshot (Phase 3a).
 *
 * Strapi note: `image` accepts a plain URL string, a Strapi media object
 * `{ data: { attributes: { url } } }`, or a flat `{ url }`. Colors come from
 * the MUI theme (`primary.main`, `text.*`, `divider`) so the section follows
 * whatever theme the marketing site is wrapped in.
 */
import { type ReactElement } from "react";
import { Box, Typography } from "@mui/material";
import { MarkdownBody } from "./MarkdownBody.js";
import { useSurfaces } from "./_surfaces.js";

type ProductScreenshotVariant = "split" | "centered";

/** Strapi media shape or plain { url }. */
interface StrapiImage {
  data?: { attributes?: { url?: string } };
  url?: string;
}

const resolveImageUrl = (image?: string | StrapiImage): string | undefined => {
  if (!image) return undefined;
  if (typeof image === "string") return image;
  return image.data?.attributes?.url ?? image.url ?? undefined;
};

export interface ProductScreenshotProps {
  /** Small uppercase label above the heading. */
  eyebrow?: string;
  /** Section heading. */
  title?: string;
  /** Markdown body text. */
  body?: string;
  /** Screenshot — URL string or Strapi media object. */
  image?: string | StrapiImage;
  /** Alt text for the screenshot (falls back to `title`). */
  alt?: string;
  /** Italic caption rendered under the frame. */
  caption?: string;
  /** `split` = text + image side by side; `centered` = stacked, centered. */
  variant?: ProductScreenshotVariant;
  /** Show the built-in dashboard mockup when no `image` is supplied. */
  useMockup?: boolean;
  /** Section background (CSS color). Defaults to a soft warm band. */
  backgroundColor?: string;
  className?: string;
}

/** Minimal in-theme dashboard mockup — only used when no image is supplied. */
function DashboardMockup(): ReactElement {
  const rows = [
    { tag: "Bedrock PT", desc: "Provisioned-throughput right-sized", amount: "$342,800" },
    { tag: "Routing", desc: "Opus → Sonnet on classify prompts", amount: "$218,440" },
    { tag: "Cache", desc: "Prompt prefix caching, 6 templates", amount: "$94,210" },
    { tag: "Guard", desc: "Runaway loop intercepted (May 03)", amount: "$48,720" },
  ];
  return (
    <Box sx={{ background: "#fff", color: "text.primary" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: 1.25,
          borderBottom: "1px solid",
          borderColor: "divider",
          background: "action.hover",
        }}
      >
        {["#ef4444", "#eab308", "#22c55e"].map((c) => (
          <Box key={c} sx={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
        ))}
        <Box sx={{ ml: 1, fontSize: "0.78rem", color: "text.secondary", fontFamily: "monospace" }}>
          console.tensorcost.com/cost-ops
        </Box>
      </Box>
      {rows.map((row, i) => (
        <Box
          key={row.tag}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2,
            py: 1,
            borderTop: i ? "1px solid" : "none",
            borderColor: "divider",
          }}
        >
          <Box
            component="span"
            sx={{
              minWidth: 92,
              textAlign: "center",
              fontSize: "0.7rem",
              fontWeight: 600,
              py: 0.25,
              px: 0.75,
              borderRadius: "4px",
              color: "primary.main",
              bgcolor: (t) => `${t.palette.primary.main}1f`,
            }}
          >
            {row.tag}
          </Box>
          <Box component="span" sx={{ flex: 1, fontSize: "0.85rem", color: "text.secondary" }}>
            {row.desc}
          </Box>
          <Box component="span" sx={{ fontSize: "0.85rem", fontWeight: 600, color: "success.main", fontVariantNumeric: "tabular-nums" }}>
            {row.amount}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export function ProductScreenshot({
  eyebrow,
  title = "What you see on day one",
  body,
  image,
  alt,
  caption,
  variant = "split",
  useMockup = true,
  backgroundColor,
  className,
}: ProductScreenshotProps): ReactElement {
  const s = useSurfaces();
  const imageUrl = resolveImageUrl(image);
  const showMockup = !imageUrl && useMockup;
  const isCentered = variant === "centered";

  return (
    <Box
      component="section"
      className={className}
      sx={{ background: backgroundColor || s.band, color: "text.primary", py: "5rem", px: "2rem" }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          ...(isCentered
            ? { display: "flex", flexDirection: "column", alignItems: "center" }
            : {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                gap: "3rem",
                alignItems: "center",
              }),
        }}
      >
        {/* Text column */}
        <Box sx={isCentered ? { textAlign: "center", mb: "2.5rem", maxWidth: 640 } : undefined}>
          {eyebrow && (
            <Typography
              component="span"
              sx={{
                display: "block",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "text.secondary",
                mb: "0.75rem",
              }}
            >
              {eyebrow}
            </Typography>
          )}
          {title && (
            <Typography
              component="h2"
              sx={{ fontSize: "1.875rem", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.015em", mb: "1rem", color: "inherit" }}
            >
              {title}
            </Typography>
          )}
          {body && (
            <Box sx={{ fontSize: "1.05rem", lineHeight: 1.6, color: "text.secondary" }}>
              {/* trusted-cms-content — only CMS-authored strings here. */}
              <MarkdownBody>{body}</MarkdownBody>
            </Box>
          )}
        </Box>

        {/* Image column */}
        <Box sx={isCentered ? { width: "100%", maxWidth: 900 } : undefined}>
          <Box
            sx={{
              borderRadius: "12px",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: s.dark ? "0 10px 30px rgba(0,0,0,0.4)" : "0 10px 30px rgba(15,23,42,0.10), 0 4px 10px rgba(15,23,42,0.05)",
              overflow: "hidden",
              background: s.card,
            }}
          >
            {imageUrl ? (
              <Box component="img" src={imageUrl} alt={alt || title} sx={{ width: "100%", display: "block" }} />
            ) : showMockup ? (
              <DashboardMockup />
            ) : null}
          </Box>
          {caption && (
            <Typography sx={{ fontSize: "0.8rem", color: "text.secondary", mt: "0.75rem", textAlign: "center", fontStyle: "italic" }}>
              {caption}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ProductScreenshot;
