import { useState, type ReactElement } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Single image — accepts plain URL strings or Strapi-shaped media objects. */
export interface GalleryImage {
  url?: string;
  alt?: string;
  /** Strapi v5 format. */
  attributes?: { url?: string; alternativeText?: string };
}

/** The `images` prop accepts either a Strapi media relation or a plain array. */
export type ImagesProp =
  | { data: Array<{ url?: string; alt?: string; attributes?: { url?: string; alternativeText?: string } }> }
  | Array<GalleryImage | string>;

export interface ImageGalleryProps {
  title?: string;
  images?: ImagesProp;
  /** Target column count on desktop (1–6). Collapses gracefully on mobile. */
  columns?: number | string;
  /** When false the lightbox is suppressed. Default: true. */
  enableLightbox?: boolean;
  /** Controls the CSS aspect-ratio of each thumbnail cell. */
  aspectRatio?: "square" | "portrait" | "landscape" | "auto";
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface NormalisedImage {
  url: string;
  alt: string;
}

function normaliseImages(images: ImagesProp | undefined): NormalisedImage[] {
  if (!images) return [];

  // Strapi data-wrapper shape
  if ("data" in images) {
    return images.data.map((img) => ({
      url: img.attributes?.url ?? img.url ?? "",
      alt: img.attributes?.alternativeText ?? img.alt ?? "",
    }));
  }

  // Plain array — each entry is either a string URL or an object
  return (images as Array<GalleryImage | string>).map((img) => {
    if (typeof img === "string") return { url: img, alt: "" };
    return { url: img.url ?? "", alt: img.alt ?? "" };
  });
}

const ASPECT_RATIO_MAP: Record<string, string> = {
  square: "1 / 1",
  portrait: "3 / 4",
  landscape: "16 / 9",
  auto: "auto",
};

// ---------------------------------------------------------------------------
// ImageGallery (public)
// ---------------------------------------------------------------------------

/**
 * ImageGallery — responsive grid with an optional full-screen lightbox carousel.
 * The lightbox is implemented via MUI `<Dialog>` for keyboard accessibility and
 * focus trapping (replaces the custom fixed-overlay from the source component).
 *
 * Ported from component-library/src/components/display/ImageGallery.jsx (Phase 3a-2).
 * lucide icons (X, ChevronLeft, ChevronRight) replaced with @mui/icons-material
 * equivalents (Close, ChevronLeft, ChevronRight).
 */
export function ImageGallery({
  title,
  images,
  columns = 3,
  enableLightbox = true,
  aspectRatio = "square",
  className,
}: ImageGalleryProps): ReactElement {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const imageList = normaliseImages(images);
  const colCount = Math.min(Math.max(parseInt(String(columns), 10), 1), 6);
  const ar = ASPECT_RATIO_MAP[aspectRatio] ?? "1 / 1";

  const openLightbox = (index: number) => {
    if (enableLightbox) {
      setCurrentIndex(index);
      setLightboxOpen(true);
    }
  };

  const closeLightbox = () => setLightboxOpen(false);

  const next = () =>
    setCurrentIndex((prev) => (prev + 1) % imageList.length);

  const prev = () =>
    setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);

  const current = imageList[currentIndex];

  return (
    <Box
      component="section"
      className={className}
      sx={{ py: { xs: 6, md: 8 }, px: { xs: 3, md: 4 } }}
    >
      {title && (
        <Typography
          variant="h2"
          sx={{
            textAlign: "center",
            fontSize: { xs: "2rem", md: "2.5rem" },
            mb: 4,
          }}
        >
          {title}
        </Typography>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: `repeat(${Math.min(colCount, 2)}, 1fr)`,
            md: `repeat(${colCount}, 1fr)`,
          },
          gap: 1.5,
          maxWidth: 1200,
          mx: "auto",
        }}
      >
        {imageList.map((image, index) => (
          <Box
            key={index}
            onClick={() => openLightbox(index)}
            sx={{
              aspectRatio: ar,
              overflow: "hidden",
              borderRadius: 2,
              cursor: enableLightbox ? "pointer" : "default",
              transition: "transform 0.2s",
              "&:hover": enableLightbox
                ? { transform: "scale(1.02)" }
                : undefined,
            }}
          >
            <Box
              component="img"
              src={image.url}
              alt={image.alt}
              sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </Box>
        ))}
      </Box>

      {/* Lightbox — MUI Dialog replaces the custom fixed-position overlay */}
      <Dialog
        open={lightboxOpen}
        onClose={closeLightbox}
        fullScreen={fullScreen}
        maxWidth={false}
        PaperProps={{
          sx: {
            background: "rgba(0,0,0,0.95)",
            boxShadow: "none",
            m: 0,
            maxWidth: "100vw",
            maxHeight: "100vh",
            width: "100vw",
            height: "100vh",
            borderRadius: 0,
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Close */}
          <IconButton
            aria-label="Close lightbox"
            onClick={closeLightbox}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              color: "#fff",
              zIndex: 1,
            }}
          >
            <CloseIcon sx={{ fontSize: 32 }} />
          </IconButton>

          {/* Prev */}
          {imageList.length > 1 && (
            <IconButton
              aria-label="Previous image"
              onClick={prev}
              sx={{
                position: "absolute",
                left: 12,
                color: "#fff",
                zIndex: 1,
              }}
            >
              <ChevronLeftIcon sx={{ fontSize: 40 }} />
            </IconButton>
          )}

          {/* Image */}
          {current && (
            <Box
              component="img"
              src={current.url}
              alt={current.alt}
              sx={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                objectFit: "contain",
              }}
            />
          )}

          {/* Next */}
          {imageList.length > 1 && (
            <IconButton
              aria-label="Next image"
              onClick={next}
              sx={{
                position: "absolute",
                right: 12,
                color: "#fff",
                zIndex: 1,
              }}
            >
              <ChevronRightIcon sx={{ fontSize: 40 }} />
            </IconButton>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
