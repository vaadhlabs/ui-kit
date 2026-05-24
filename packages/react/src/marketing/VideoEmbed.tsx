import { useState, type ReactElement } from "react";
import { Box, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PosterImage {
  url?: string;
  /** Strapi v5 format. */
  data?: { attributes?: { url?: string } };
}

export interface VideoEmbedProps {
  title?: string;
  description?: string;
  /** Full video URL — YouTube watch URL, Vimeo URL, or a direct mp4 URL. */
  videoUrl?: string;
  /** `youtube` | `vimeo` | `mp4` | `embed` (raw iframe src). Default: youtube. */
  videoType?: "youtube" | "vimeo" | "mp4" | "embed";
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  /** Poster image shown before the user clicks play. */
  posterImage?: PosterImage | string;
  /** Aspect ratio of the video container. Default: `16:9`. */
  aspectRatio?: "16:9" | "4:3" | "1:1" | "21:9";
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ASPECT_RATIO_PADDING: Record<string, string> = {
  "16:9": "56.25%",
  "4:3": "75%",
  "1:1": "100%",
  "21:9": "42.86%",
};

function buildEmbedUrl(
  videoUrl: string,
  videoType: string,
  autoplay: boolean,
  loop: boolean,
  muted: boolean,
): string {
  const params = new URLSearchParams();
  if (autoplay) params.append("autoplay", "1");
  if (loop) params.append("loop", "1");
  if (muted) params.append("mute", "1");

  switch (videoType) {
    case "youtube": {
      const match = videoUrl.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/,
      );
      const videoId = match?.[1] ?? videoUrl;
      return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
    }
    case "vimeo": {
      const match = videoUrl.match(/vimeo\.com\/(\d+)/);
      const videoId = match?.[1] ?? videoUrl;
      return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
    }
    default:
      return videoUrl;
  }
}

function resolvePosterUrl(
  posterImage: PosterImage | string | undefined,
): string | undefined {
  if (!posterImage) return undefined;
  if (typeof posterImage === "string") return posterImage;
  return posterImage.data?.attributes?.url ?? posterImage.url;
}

// ---------------------------------------------------------------------------
// VideoEmbed (public)
// ---------------------------------------------------------------------------

/**
 * VideoEmbed — YouTube, Vimeo, or mp4 embed with a poster-image play-button
 * overlay. Clicking the overlay replaces it with the embedded player (lazy load).
 *
 * Layout: responsive 16:9 (or configurable) aspect ratio via paddingBottom trick —
 * identical approach to the source component, now expressed as MUI sx.
 *
 * Ported from component-library/src/components/display/VideoEmbed.jsx (Phase 3a-2).
 * lucide `Play` icon replaced with @mui/icons-material `PlayArrowIcon`.
 */
export function VideoEmbed({
  title,
  description,
  videoUrl,
  videoType = "youtube",
  autoplay = false,
  loop = false,
  muted = false,
  posterImage,
  aspectRatio = "16:9",
  className,
}: VideoEmbedProps): ReactElement {
  const [showVideo, setShowVideo] = useState(autoplay);

  const posterUrl = resolvePosterUrl(posterImage);
  const paddingBottom = ASPECT_RATIO_PADDING[aspectRatio] ?? "56.25%";

  const embedUrl =
    videoUrl && videoType !== "mp4"
      ? buildEmbedUrl(videoUrl, videoType, autoplay || showVideo, loop, muted)
      : videoUrl;

  return (
    <Box
      component="section"
      className={className}
      sx={{ py: { xs: 6, md: 8 }, px: { xs: 3, md: 4 } }}
    >
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        {(title || description) && (
          <Box sx={{ textAlign: "center", mb: 3 }}>
            {title && (
              <Typography variant="h2" sx={{ fontSize: { xs: "1.75rem", md: "2rem" }, mb: 0.75 }}>
                {title}
              </Typography>
            )}
            {description && (
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                {description}
              </Typography>
            )}
          </Box>
        )}

        {/* Aspect-ratio container */}
        <Box
          sx={{
            position: "relative",
            paddingBottom,
            height: 0,
            overflow: "hidden",
            borderRadius: 3,
            background: "#000",
          }}
        >
          {videoType === "mp4" && embedUrl ? (
            <Box
              component="video"
              src={embedUrl}
              autoPlay={autoplay}
              loop={loop}
              muted={muted}
              controls
              poster={posterUrl}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            />
          ) : showVideo && embedUrl ? (
            <Box
              component="iframe"
              src={embedUrl}
              title={title ?? "Video"}
              frameBorder={0}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            />
          ) : (
            /* Poster overlay — click to load the player */
            <Box
              onClick={() => setShowVideo(true)}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundImage: posterUrl ? `url(${posterUrl})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.2s, opacity 0.2s",
                  "&:hover": { transform: "scale(1.08)", opacity: 0.95 },
                }}
              >
                <PlayArrowIcon
                  sx={{ fontSize: 36, color: "#4f46e5", ml: "4px" }}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
