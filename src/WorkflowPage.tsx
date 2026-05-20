import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Box, ButtonBase } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// WorkflowPage — navrail primitive (2026-05-19)
//
// Spec: design_handoff_navigation_rail/README.md §Screens/A2 + §Interactions
// Provides the sticky page header (title, subtitle, action slot) and a TOC
// pill row. Children (WorkflowCards) are stacked with a 16px gap inside a
// 1080px-max scrollable area.
//
// Scroll spy: IntersectionObserver with rootMargin "-140px 0px -50% 0px"
// tracks which card is topmost-visible. Active TOC pill follows it.
//
// Deep linking: clicking a pill scrolls to the card's anchor + updates
// location.hash. On mount, if location.hash matches an anchor, scrolls to
// and sets focusedAnchor for the matching card.

export interface TocItem {
  /** Matches WorkflowCard anchor prop. */
  key: string;
  label: string;
  /** Trailing mono hint shown inside the pill (e.g. "$55.1k 30d"). */
  hint?: string;
}

export interface WorkflowPageProps {
  title: string;
  subtitle?: string;
  /** Optional buttons/actions rendered top-right of the sticky header. */
  actionSlot?: ReactNode;
  /** TOC items — one per WorkflowCard. Order must match DOM order. */
  tocItems: TocItem[];
  children: ReactNode;
  /** Called when a TOC pill is clicked. Host can use for additional side-effects. */
  onTocClick?: (key: string) => void;
}

// Height of the sticky header in px — must match scrollMarginTop on WorkflowCard anchors.
const STICKY_HEADER_HEIGHT = 140;

export function WorkflowPage({
  title,
  subtitle,
  actionSlot,
  tocItems,
  children,
  onTocClick,
}: WorkflowPageProps): JSX.Element {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const brand = theme.palette.brand;

  // Active anchor tracks which card is topmost-visible (scroll spy).
  // Initial value: from location.hash, or the first TOC item.
  const [activeAnchor, setActiveAnchor] = useState<string>(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.slice(1);
      if (tocItems.some((t) => t.key === hash)) return hash;
    }
    return tocItems[0]?.key ?? "";
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // On mount: if hash matches an anchor, scroll to it and mark it active.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const target = document.getElementById(hash);
    if (target) {
      if (typeof target.scrollIntoView === "function") {
        target.scrollIntoView();
      }
      setActiveAnchor(hash);
    }
    // Run once on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll spy via IntersectionObserver.
  // rootMargin: "-140px 0px -50% 0px" means we only count an element as
  // "visible" when it's between the sticky header (140px from top) and the
  // midpoint of the viewport. The topmost such element wins.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const anchors = tocItems.map((t) => document.getElementById(t.key)).filter(Boolean) as HTMLElement[];
    if (anchors.length === 0) return;

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            visible.add(id);
          } else {
            visible.delete(id);
          }
        }
        // Pick the topmost visible anchor (DOM order = tocItems order).
        const topmost = tocItems.find((t) => visible.has(t.key));
        if (topmost) setActiveAnchor(topmost.key);
      },
      { rootMargin: `-${STICKY_HEADER_HEIGHT}px 0px -50% 0px` },
    );

    for (const el of anchors) {
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, [tocItems]);

  const handlePillClick = useCallback(
    (key: string) => {
      const target = document.getElementById(key);
      if (target && typeof target.scrollIntoView === "function") {
        target.scrollIntoView({ behavior: "smooth" });
      }
      if (typeof window !== "undefined") {
        window.location.hash = key;
      }
      setActiveAnchor(key);
      onTocClick?.(key);
    },
    [onTocClick],
  );

  const stickyBg = isDark ? "rgba(30,41,59,0.94)" : "rgba(255,255,255,0.96)";
  const border = brand?.border ?? "#E2E8F0";

  return (
    <Box
      ref={containerRef}
      component="main"
      sx={{
        flex: 1,
        height: "100%",
        overflowY: "auto",
        // PAGE surface (not card surface). Per the design spec §Design tokens:
        // bgPage = page background (#FAFBFC light / #0F172A dark);
        // paper  = card + sidebar surface (#FFFFFF light / #1E293B dark).
        // Cards inside this Box use `paper`, so the page underneath uses
        // `bgPage` — that's what makes cards visually float in dark mode
        // (slate-800 cards on a slate-900 page) and gives the subtle lift
        // on light mode (#FFFFFF cards on #FAFBFC page). The pre-fix code
        // used `paper` here too, which collapsed the distinction AND showed
        // bright white in dark mode when the brand token didn't resolve.
        //
        // Fallback chain: brand.bgPage (spec value) → theme palette default
        // (always present via createTensorTheme) → light off-white literal.
        background: brand?.bgPage ?? theme.palette.background.default ?? "#FAFBFC",
        fontFamily: "'Inter', system-ui, sans-serif",
        color: brand?.ink ?? theme.palette.text.primary ?? "#0F172A",
      }}
    >
      {/* Sticky page header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          background: stickyBg,
          borderBottom: `1px solid ${border}`,
          // 32px horizontal gutter on desktop; 16px on mobile (spec §Spacing)
          px: { xs: 2, sm: 4 },
          pt: "18px",
          pb: "14px",
          zIndex: 10,
        }}
      >
        {/* Title row — wraps action slot below title on narrow screens */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
              component="h1"
              sx={{
                margin: 0,
                fontSize: 26,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: brand?.ink ?? "#0F172A",
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              {title}
            </Box>
            {subtitle && (
              <Box
                sx={{
                  fontSize: 13,
                  color: brand?.ink2 ?? "#475569",
                  mt: "4px",
                  fontFamily: "'Inter', system-ui, sans-serif",
                }}
              >
                {subtitle}
              </Box>
            )}
          </Box>
          {actionSlot && (
            // On mobile the action slot becomes a full-width row below the title.
            // On sm+ it stays right-aligned beside the title.
            <Box sx={{ display: "flex", gap: "8px", width: { xs: "100%", sm: "auto" } }}>
              {actionSlot}
            </Box>
          )}
        </Box>

        {/* TOC pill row — horizontal scroll on narrow screens per spec §Mobile layout rules.
            Pills never wrap to a second line; the strip scrolls instead. */}
        <Box
          component="nav"
          aria-label="Page sections"
          sx={{
            display: "flex",
            gap: "2px",
            mt: "14px",
            overflowX: "auto",
            // Hide scrollbar visually (spec shows clean pill strip with no visible scrollbar)
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            // iOS momentum scroll
            WebkitOverflowScrolling: "touch",
          }}
        >
          {tocItems.map((item) => {
            const isActive = item.key === activeAnchor;
            return (
              <ButtonBase
                key={item.key}
                component="button"
                onClick={() => handlePillClick(item.key)}
                aria-current={isActive ? "true" : undefined}
                sx={{
                  height: 28,
                  px: "10px",
                  borderRadius: "6px",
                  background: isActive ? (brand?.ink ?? "#0F172A") : "transparent",
                  color: isActive ? (brand?.paper ?? "#FFFFFF") : (brand?.ink2 ?? "#475569"),
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: 12,
                  fontWeight: isActive ? 600 : 500,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  // Prevent pills from shrinking inside the scroll container — each
                  // pill keeps its natural width so the row scrolls rather than squishing.
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                  // No position animation — just color swap per spec §Interactions
                  transition: `background ${brand?.motionFast ?? "150ms cubic-bezier(0.4,0,0.2,1)"}, color ${brand?.motionFast ?? "150ms"}`,
                  "&:focus-visible": {
                    outline: `2px solid ${brand?.blue ?? "#3B82F6"}`,
                    outlineOffset: 2,
                  },
                }}
              >
                {item.label}
                {item.hint && (
                  <Box
                    component="span"
                    sx={{
                      fontSize: "10.5px",
                      fontFamily: brand?.mono ?? "'JetBrains Mono', monospace",
                      color: isActive ? "rgba(248,250,252,0.6)" : (brand?.ink3 ?? "#94A3B8"),
                    }}
                  >
                    {item.hint}
                  </Box>
                )}
              </ButtonBase>
            );
          })}
        </Box>
      </Box>

      {/* Scrollable content — WorkflowCard children */}
      <Box
        sx={{
          // 32px horizontal gutter on desktop; 16px on mobile (spec §Spacing)
          px: { xs: 2, sm: 4 },
          pt: "20px",
          pb: "40px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          // Responsive cap. The spec said 1080px; on a 2000px display with
          // the rail collapsed to 56px that left ~600px of asymmetric
          // whitespace to the right of the content. Use a breakpoint-driven
          // ladder so content fills more horizontal space as the viewport
          // grows, while preserving readable line lengths on medium screens.
          maxWidth: { xs: "100%", md: 1200, lg: 1440, xl: 1680 },
          width: "100%",
          // Center content within the main area so when the rail toggles
          // between 240px and 56px, content stays optically balanced
          // instead of left-anchored with growing right-side whitespace.
          mx: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
