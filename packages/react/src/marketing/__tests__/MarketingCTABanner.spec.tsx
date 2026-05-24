import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeShellProvider } from "../../ThemeShellProvider.js";
import { MarketingCTABanner } from "../MarketingCTABanner.js";

function wrap(ui: React.ReactNode) {
  return render(<ThemeShellProvider mode="light">{ui}</ThemeShellProvider>);
}

describe("MarketingCTABanner", () => {
  it("renders without crashing with no props", () => {
    const { container } = wrap(<MarketingCTABanner />);
    expect(container.querySelector("section")).toBeTruthy();
  });

  it("renders the title", () => {
    wrap(<MarketingCTABanner title="Start saving today" />);
    expect(screen.getByText("Start saving today")).toBeInTheDocument();
  });

  it("renders the subtitle", () => {
    wrap(<MarketingCTABanner subtitle="No credit card required" />);
    expect(screen.getByText("No credit card required")).toBeInTheDocument();
  });

  it("renders a button link when button prop is provided", () => {
    wrap(<MarketingCTABanner button={{ text: "Get started", link: "/signup" }} />);
    const btn = screen.getByRole("link", { name: "Get started" });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("href", "/signup");
  });

  it("renders nothing for button when button prop is omitted", () => {
    wrap(<MarketingCTABanner title="Banner without button" />);
    expect(screen.queryByRole("link")).toBeNull();
  });
});
