/**
 * FAQAccordion — FAQ section using MUI Accordion.
 *
 * MUI Accordion/AccordionSummary/AccordionDetails provides full accessibility
 * (ARIA roles, keyboard navigation) without the custom scroll-height animation
 * hack in the original. The lucide ChevronDown icon is replaced by MUI's
 * built-in ExpandMore (MUI Accordion renders it automatically via expandIcon).
 *
 * The `answer` field carries raw HTML from the CMS (trustedContent).
 * dangerouslySetInnerHTML is intentional — only ever supply CMS-authored content.
 *
 * Ported from @tensorcost/component-library FAQAccordion (Phase 3a-1).
 */
import { useState, type ReactElement } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

export interface FAQItem {
  id?: string | number;
  question: string;
  /** Raw HTML or plain text. Rendered via dangerouslySetInnerHTML. */
  answer?: string;
}

export interface FAQAccordionProps {
  title?: string;
  subtitle?: string;
  items?: FAQItem[];
  /** When true, multiple FAQ items can be open simultaneously. */
  allowMultipleOpen?: boolean;
  backgroundColor?: string;
  className?: string;
}

export function FAQAccordion({
  title,
  subtitle,
  items = [],
  allowMultipleOpen = false,
  backgroundColor = "#ffffff",
  className,
}: FAQAccordionProps): ReactElement {
  // Track which items are expanded. When allowMultipleOpen is false we store
  // at most one key; otherwise we store a Set.
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  function handleChange(index: number) {
    setExpanded((prev) => {
      const next = allowMultipleOpen ? new Set(prev) : new Set<number>();
      if (prev.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <Box
      component="section"
      className={className}
      sx={{ background: backgroundColor, py: "4rem", px: "2rem" }}
    >
      {(title || subtitle) && (
        <Box
          sx={{
            textAlign: "center",
            mb: "3rem",
            maxWidth: "800px",
            mx: "auto",
          }}
        >
          {title && (
            <Typography
              component="h2"
              sx={{ fontSize: "2.5rem", fontWeight: 700, mb: "0.5rem" }}
            >
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography sx={{ fontSize: "1.2rem", opacity: 0.8 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      )}

      <Box sx={{ maxWidth: "800px", mx: "auto" }}>
        {items.map((item, index) => (
          <Accordion
            key={item.id ?? index}
            expanded={expanded.has(index)}
            onChange={() => handleChange(index)}
            disableGutters
            elevation={0}
            data-testid="faq-item"
            sx={{
              borderBottom: "1px solid",
              borderColor: "divider",
              "&:before": { display: "none" },
              "&.Mui-expanded": { mb: 0 },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls={`faq-panel-${index}`}
              id={`faq-header-${index}`}
              sx={{
                px: 0,
                py: "1.5rem",
                fontWeight: 600,
                fontSize: "1.1rem",
                color: "text.primary",
                "& .MuiAccordionSummary-content": { my: 0 },
              }}
            >
              {item.question}
            </AccordionSummary>

            <AccordionDetails
              id={`faq-panel-${index}`}
              sx={{
                px: 0,
                pb: "1.5rem",
                color: "text.secondary",
                lineHeight: 1.7,
              }}
            >
              {item.answer ? (
                // trusted-cms-content — answer field is CMS-authored HTML.
                // Never pass user-submitted content here.
                <Box
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                />
              ) : null}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
}
