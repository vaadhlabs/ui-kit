/**
 * Shared scroll-into-view animation hook for marketing visuals (Phase 5).
 *
 * Drives a 0→1 progress value with an eased rAF tween once the element scrolls
 * into view. Uses a manual rect check (not IntersectionObserver) so it also
 * works inside iframes/preview panes. Respects prefers-reduced-motion.
 */
import { useEffect, useRef, useState, type RefObject } from "react";

export function prefersReduced(): boolean {
  return (
    typeof window !== "undefined" &&
    !!window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function useScrollProgress(duration = 1500): [RefObject<HTMLDivElement>, number] {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    // Reduced motion: skip both the scroll gate and the tween — show the
    // final state immediately. (Also makes jsdom tests deterministic, where
    // getBoundingClientRect is all zeros and the gate would never open.)
    if (prefersReduced()) {
      setP(1);
      return undefined;
    }
    let raf = 0;
    let t0 = 0;
    let done = false;

    const run = () => {
      if (prefersReduced()) {
        setP(1);
        return;
      }
      const tick = (t: number) => {
        if (!t0) t0 = t;
        const k = Math.min(1, (t - t0) / duration);
        setP(1 - Math.pow(1 - k, 3));
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const check = () => {
      if (done || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.top < vh * 0.85 && r.bottom > 0) {
        done = true;
        run();
        cleanup();
      }
    };
    const cleanup = () => {
      window.removeEventListener("scroll", check, true);
      window.removeEventListener("resize", check);
    };

    window.addEventListener("scroll", check, true);
    window.addEventListener("resize", check);
    check();
    const t1 = setTimeout(check, 60);
    const t2 = setTimeout(check, 320);
    return () => {
      cleanup();
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [duration]);

  return [ref, p];
}

/** Count-up number that animates from 0 → value when scrolled into view. */
export function useCountUp(value: number, duration = 1400): [RefObject<HTMLDivElement>, number] {
  const [ref, p] = useScrollProgress(duration);
  const shown = value % 1 !== 0 ? Math.round(value * p * 10) / 10 : Math.round(value * p);
  return [ref, shown];
}
