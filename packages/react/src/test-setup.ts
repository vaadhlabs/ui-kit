import "@testing-library/jest-dom/vitest";

// jsdom has no matchMedia. Stub it so `prefersReduced()` (marketing/_motion)
// reports reduced motion in tests — animated visuals (count-ups, bars) then
// render their final state immediately, making assertions deterministic.
// All other media queries report non-matching, which is MUI's safe default.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
