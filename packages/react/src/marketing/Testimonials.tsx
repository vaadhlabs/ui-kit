/**
 * Testimonials — carousel or grid of testimonial cards.
 *
 * Icon substitutions (lucide → MUI):
 *   ChevronLeft  → KeyboardArrowLeft
 *   ChevronRight → KeyboardArrowRight
 *   Star         → Star (same name, @mui/icons-material)
 *
 * Carousel auto-advances every 5 seconds when there are multiple items.
 *
 * Ported from @tensorcost/component-library Testimonials (Phase 3a-1).
 */
import { useState, useEffect, type ReactElement } from "react";
import { Box, Typography, Card, CardContent, Avatar, IconButton } from "@mui/material";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Star as StarIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

export interface TestimonialItem {
  id?: string | number;
  quote?: string;
  authorName?: string;
  authorTitle?: string;
  authorCompany?: string;
  /** Strapi image shape or plain { url }. */
  authorImage?: { data?: { attributes?: { url?: string } }; url?: string } | null;
  /** Star rating 1–5. */
  rating?: number;
}

export type TestimonialsDisplayMode = "carousel" | "grid";

export interface TestimonialsProps {
  title?: string;
  subtitle?: string;
  displayMode?: TestimonialsDisplayMode;
  items?: TestimonialItem[];
  backgroundColor?: string;
  className?: string;
}

function resolveImageUrl(img?: TestimonialItem["authorImage"]): string | undefined {
  if (!img) return undefined;
  return img.data?.attributes?.url ?? img.url;
}

interface TestimonialCardProps extends TestimonialItem {
  accentColor: string;
}

function TestimonialCard({
  quote,
  authorName,
  authorTitle,
  authorCompany,
  authorImage,
  rating,
  accentColor,
}: TestimonialCardProps): ReactElement {
  const imageUrl = resolveImageUrl(authorImage);
  const initials = authorName?.[0]?.toUpperCase() ?? "?";

  return (
    <Card
      sx={{
        borderRadius: "16px",
        p: 0,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      data-testid="testimonial-card"
    >
      <CardContent sx={{ p: "2rem", flexGrow: 1 }}>
        {typeof rating === "number" && rating > 0 && (
          <Box sx={{ display: "flex", gap: "0.25rem", mb: "1rem" }}>
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                sx={{
                  fontSize: "1.1rem",
                  color: i < rating ? "#f59e0b" : "divider",
                  fill: i < rating ? "#f59e0b" : "none",
                }}
              />
            ))}
          </Box>
        )}

        <Typography
          sx={{
            fontSize: "1.1rem",
            lineHeight: 1.7,
            color: "text.primary",
            mb: "1.5rem",
            fontStyle: "italic",
          }}
        >
          &ldquo;{quote}&rdquo;
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {imageUrl ? (
            <Avatar
              src={imageUrl}
              alt={authorName}
              sx={{ width: 50, height: 50 }}
            />
          ) : (
            <Avatar
              sx={{
                width: 50,
                height: 50,
                background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%)`,
                fontWeight: 600,
              }}
            >
              {initials}
            </Avatar>
          )}

          <Box>
            <Typography sx={{ fontWeight: 600, color: "text.primary" }}>
              {authorName}
            </Typography>
            {(authorTitle || authorCompany) && (
              <Typography sx={{ fontSize: "0.9rem", color: "text.secondary" }}>
                {authorTitle}
                {authorTitle && authorCompany && ", "}
                {authorCompany}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export function Testimonials({
  title,
  subtitle,
  displayMode = "carousel",
  items = [],
  backgroundColor = "#f8f9fa",
  className,
}: TestimonialsProps): ReactElement {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const accentColor = theme.palette.primary.main;

  useEffect(() => {
    if (displayMode === "carousel" && items.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [displayMode, items.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % items.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

  return (
    <Box
      component="section"
      className={className}
      sx={{ background: backgroundColor, py: "4rem", px: "2rem" }}
    >
      {(title || subtitle) && (
        <Box sx={{ textAlign: "center", mb: "3rem" }}>
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

      {displayMode === "carousel" ? (
        <Box sx={{ position: "relative", maxWidth: "800px", mx: "auto" }}>
          {items[currentIndex] && (
            <TestimonialCard {...items[currentIndex]} accentColor={accentColor} />
          )}

          {items.length > 1 && (
            <>
              <IconButton
                onClick={prevSlide}
                aria-label="previous testimonial"
                sx={{
                  position: "absolute",
                  left: "-60px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <KeyboardArrowLeft />
              </IconButton>

              <IconButton
                onClick={nextSlide}
                aria-label="next testimonial"
                sx={{
                  position: "absolute",
                  right: "-60px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <KeyboardArrowRight />
              </IconButton>

              {/* Dot navigation */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "0.5rem",
                  mt: "2rem",
                }}
              >
                {items.map((_, idx) => (
                  <Box
                    key={idx}
                    component="button"
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to testimonial ${idx + 1}`}
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      border: "none",
                      bgcolor: idx === currentIndex ? accentColor : "divider",
                      cursor: "pointer",
                      p: 0,
                      "&:hover": { opacity: 0.8 },
                    }}
                  />
                ))}
              </Box>
            </>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
            maxWidth: "1200px",
            mx: "auto",
          }}
        >
          {items.map((item, idx) => (
            <TestimonialCard
              key={item.id ?? idx}
              {...item}
              accentColor={accentColor}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
