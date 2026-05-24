import { useEffect, useState } from "react";
import type { SavingsBannerProps } from "./SavingsBanner.js";

/**
 * Wire shape from cost-service `/v1/api/cost/cfo/summary` — re-declared
 * here so ui-kit doesn't need to reach into costs-mf for the type. Only
 * the fields the banner consumes are listed; extra fields on the wire are
 * tolerated.
 */
interface CfoSummarySliceForBanner {
  open_recommendations_count: number;
  open_recommendations_total_cents: number;
  realized_savings_ytd_cents: number;
}

export interface UseSavingsBannerResult extends SavingsBannerProps {
  error: Error | null;
}

export interface UseSavingsBannerOptions {
  /** Override the fetcher (tests). Defaults to global fetch. */
  fetcher?: typeof fetch;
}

/**
 * Fetches the recommendations summary from cost-service's CFO endpoint
 * and reshapes it into props the SavingsBanner can consume. Annualises
 * the monthly `open_recommendations_total_cents` (×12) — the banner is
 * pitched as a yearly figure because that's the lens CFOs use when
 * reading recommendation impact.
 *
 * Failure mode: on error we set `hidden: true` so the banner self-suppresses
 * — we don't want to mislead a CFO with stale/zero numbers when the
 * source-of-truth is unavailable. The error is also returned for callers
 * that want to surface it elsewhere.
 */
export function useSavingsBanner(
  apiBaseUrl: string,
  opts: UseSavingsBannerOptions = {},
): UseSavingsBannerResult {
  const fetcher = opts.fetcher ?? fetch;
  const [state, setState] = useState<{
    open: number;
    annualized: number;
    verified: number;
    loading: boolean;
    error: Error | null;
  }>({ open: 0, annualized: 0, verified: 0, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    const url = new URL("/v1/api/cost/cfo/summary", apiBaseUrl).toString();
    fetcher(url)
      .then(async (res) => {
        if (!res.ok) throw new Error(`cfo summary failed: ${res.status}`);
        return (await res.json()) as CfoSummarySliceForBanner;
      })
      .then((data) => {
        if (cancelled) return;
        setState({
          open: data.open_recommendations_count ?? 0,
          annualized: (data.open_recommendations_total_cents ?? 0) * 12,
          verified: data.realized_savings_ytd_cents ?? 0,
          loading: false,
          error: null,
        });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err : new Error(String(err)),
        }));
      });
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, fetcher]);

  return {
    openCount: state.open,
    openSavingsAnnualizedCents: state.annualized,
    verifiedSavingsCents: state.verified,
    loading: state.loading,
    hidden: state.error !== null,
    error: state.error,
  };
}
