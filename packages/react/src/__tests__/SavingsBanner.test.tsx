import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SavingsBanner, formatBannerCopy } from "../SavingsBanner.js";

describe("SavingsBanner — full variant", () => {
  it("renders headline and supporting metrics with $/yr annualized number", async () => {
    const onClick = vi.fn();
    render(
      <SavingsBanner
        openSavingsAnnualizedCents={1_200_000} // $12,000/yr
        openCount={3}
        verifiedSavingsCents={450_000} // $4,500 verified
        onViewRecommendations={onClick}
        variant="full"
      />,
    );
    expect(screen.getByTestId("savings-banner")).toHaveAttribute("data-variant", "full");
    expect(screen.getByText(/\$12,000\/yr of model-routing savings/)).toBeInTheDocument();
    expect(screen.getByText(/3 open recommendations/)).toBeInTheDocument();
    expect(screen.getByText(/\$4,500/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /view recommendations/i }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe("SavingsBanner — compact variant", () => {
  it("renders single-line strip with headline + cta", () => {
    render(
      <SavingsBanner
        openSavingsAnnualizedCents={500_000} // $5,000/yr
        openCount={1}
        verifiedSavingsCents={0}
        onViewRecommendations={() => undefined}
        variant="compact"
      />,
    );
    const banner = screen.getByTestId("savings-banner");
    expect(banner).toHaveAttribute("data-variant", "compact");
    expect(screen.getByText(/\$5,000\/yr/)).toBeInTheDocument();
    expect(screen.getByText(/1 open recommendation\b/)).toBeInTheDocument();
  });
});

describe("SavingsBanner — empty / hidden states", () => {
  it("renders the all-applied success message when openCount === 0 and verified > 0", () => {
    render(
      <SavingsBanner
        openSavingsAnnualizedCents={0}
        openCount={0}
        verifiedSavingsCents={120_000}
        variant="full"
      />,
    );
    expect(screen.getByTestId("savings-banner")).toHaveAttribute("data-tone", "applied");
    expect(screen.getByText(/All recommendations applied/)).toBeInTheDocument();
    expect(screen.getByText(/\$1,200 verified savings YTD/)).toBeInTheDocument();
  });

  it("returns null when both counts are zero, and when hidden=true", () => {
    const { container, rerender } = render(
      <SavingsBanner
        openSavingsAnnualizedCents={0}
        openCount={0}
        verifiedSavingsCents={0}
      />,
    );
    expect(container.firstChild).toBeNull();
    rerender(
      <SavingsBanner
        openSavingsAnnualizedCents={1_000_000}
        openCount={2}
        verifiedSavingsCents={0}
        hidden
      />,
    );
    expect(container.firstChild).toBeNull();
  });
});

describe("formatBannerCopy", () => {
  it("renders annualized headline + open-count detail when there are open recs", () => {
    const c = formatBannerCopy(1_200_000, 3, 0);
    expect(c.headline).toMatch(/\$12,000\/yr of model-routing savings/);
    expect(c.detail).toBe("3 open recommendations");
    expect(c.tone).toBe("savings");
  });

  it("rounds annualized cents to the nearest $100", () => {
    // 1_249_900 cents == $12,499 → rounds to $12,500
    const c = formatBannerCopy(1_249_900, 1, 0);
    expect(c.headline).toMatch(/\$12,500\/yr/);
  });

  it("collapses the headline when annualized < $1,000/yr", () => {
    const c = formatBannerCopy(50_000, 2, 0);
    expect(c.headline).toBe("2 open recommendations");
    expect(c.detail).toBeNull();
  });

  it("returns null headline when both open and verified are zero", () => {
    const c = formatBannerCopy(0, 0, 0);
    expect(c.headline).toBeNull();
  });
});
