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

  // Scroll-state — flips the moment the sentinel above the sticky header
  // crosses out of view. Used to elevate the sticky header (rounded bottom
  // corners + soft shadow) so the content visibly slides under it instead
  // of butting up against a hairline border. At-rest the header has no
  // shadow so the page reads as one calm composition; only when the user
  // is actively scrolling does the elevation cue kick in.
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setIsScrolled(!entry.isIntersecting);
      },
      // root: null = viewport. threshold 1.0 = fire when fully in/out of view.
      { threshold: 1.0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Shadow intensity gracefully responds to theme — softer/larger in dark
  // (matches the lower contrast of slate-900 cards on slate-800 page) and
  // tighter/sharper in light. Both stay below the "elevation overload"
  // threshold (material spec calls this an elevation-2 surface).
  const stickyShadow = isScrolled
    ? isDark
      ? "0 6px 18px -6px rgba(0,0,0,0.55), 0 1px 0 0 rgba(255,255,255,0.04)"
      : "0 6px 16px -8px rgba(15,23,42,0.18), 0 1px 0 0 rgba(15,23,42,0.04)"
    : "none";

  return (
    <Box
      ref={containerRef}
      component="main"
      sx={{
        flex: 1,
        // The shell's outer <main> is the single scroll container for the
        // app on both mobile AND desktop. WorkflowPage MUST NOT establish
        // its own nested scroll context — when it did (height:100% +
        // overflowY:auto on md+), the sticky page header below stuck to
        // WorkflowPage's own scroll context rather than to the viewport,
        // which scrolled away with the document. User-visible symptom:
        // "the top menu strip isn't sticky anymore on desktop." Fix is to
        // make WorkflowPage a plain block — sticky `top: 0` then resolves
        // against the shell's main, exactly like MobileTopBar does.
        height: "auto",
        overflowY: "visible",
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
      {/* Scroll sentinel — invisible 1px tracer the IntersectionObserver
          above uses to detect when the user has scrolled past the page top.
          Lives outside the sticky header so the header's own sticky behaviour
          doesn't confuse the observer. */}
      <Box ref={sentinelRef} aria-hidden="true" sx={{ height: "1px", width: "100%" }} />

      {/* Sticky page header.
          - Rounded bottom corners (16px on sm+, square on xs since the
            mobile breakpoint butts the header to the screen edge anyway)
            give the strip an elegant card-like silhouette instead of a
            hard rectangle.
          - At rest: no shadow, just the page-tone background — reads as
            part of the page chrome.
          - On scroll: a soft shadow elevates the strip and the content
            below visibly slides UNDER it. Border-bottom is dropped while
            scrolled so the shadow does the visual work (a 1px hairline +
            shadow reads as two competing edges). */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          background: stickyBg,
          borderBottom: isScrolled ? "none" : `1px solid ${border}`,
          borderBottomLeftRadius: { xs: 0, sm: "16px" },
          borderBottomRightRadius: { xs: 0, sm: "16px" },
          // 32px horizontal gutter on desktop; 16px on mobile (spec §Spacing)
          px: { xs: 2, sm: 4 },
          pt: "18px",
          pb: "14px",
          zIndex: 10,
          boxShadow: stickyShadow,
          // Match the timing of the active-pill colour-swap so the elevation
          // cue feels coherent with the rest of the page's micro-motion.
          transition: `box-shadow ${brand?.motionFast ?? "200ms cubic-bezier(0.4,0,0.2,1)"}, border-color 200ms`,
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
                color: brand?.ink ?? theme.palette.text.primary,
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              {title}
            </Box>
            {subtitle && (
              <Box
                sx={{
                  fontSize: 13,
                  color: brand?.ink2 ?? theme.palette.text.secondary,
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

        {/* TOC pill row — horizontal scroll when pills overflow the page width.
            Pills never wrap to a second line; the strip scrolls instead.
            B30: previously the last pill clipped at the right edge with no
            visual cue that more content was hidden. Added a mask-image fade
            on the right so a designer's eye reads "there's more, scroll".
            Mask only kicks in when there's actually overflow — `mask` on a
            box that hasn't overflowed is a no-op visually. */}
        <Box
          component="nav"
          aria-label="Page sections"
          sx={{
            display: "flex",
            gap: "2px",
            mt: "14px",
            overflowX: "auto",
            // Soft fade on the trailing edge cues "more sections — scroll
            // right". The mask is 32px wide; the rest of the strip is fully
            // opaque. webkit-mask-image included for Safari compatibility.
            maskImage: "linear-gradient(to right, black 0, black calc(100% - 32px), transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, black 0, black calc(100% - 32px), transparent 100%)",
            // Reserve some bottom padding so the fade doesn't clip into the
            // active-pill rounded corner when content underneath scrolls.
            pb: "2px",
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
                  // Active-pill bg in workshop theme resolves to text.primary
                  // — that's #E6EDF3 (near-white) in dark mode and #1A1A1A
                  // (near-black) in light mode. The text colour has to invert
                  // against that, NOT fall back to a hard-coded white that
                  // disappears against the dark-mode active bg.
                  background: isActive ? (brand?.ink ?? theme.palette.text.primary) : "transparent",
                  color: isActive
                    ? (brand?.paper ?? theme.palette.background.default ?? "#FFFFFF")
                    : (brand?.ink2 ?? theme.palette.text.secondary),
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
                      // Active-state hint paints AGAINST the active pill bg
                      // (text.primary, see above). Use background.default at
                      // 70% alpha so the hint inverts cleanly in both modes
                      // — light-on-dark in light theme, dark-on-light in
                      // dark theme. The previous hard-coded 60%-white only
                      // worked in light mode and disappeared against the
                      // dark-mode active bg.
                      // Inactive-state hint stays on the page bg, where
                      // text.secondary reads as expected.
                      color: isActive
                        ? `color-mix(in srgb, ${theme.palette.background.default} 80%, transparent)`
                        : (brand?.ink3 ?? theme.palette.text.secondary),
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
