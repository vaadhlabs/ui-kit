import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeShellProvider } from "../../ThemeShellProvider.js";
import { MarketingHero } from "../MarketingHero.js";

function wrap(ui: React.ReactNode) {
  return render(<ThemeShellProvider mode="light">{ui}</ThemeShellProvider>);
}

describe("MarketingHero", () => {
  it("renders without crashing with no props", () => {
    const { container } = wrap(<MarketingHero />);
    expect(container.querySelector("section")).toBeTruthy();
  });

  it("renders the title as an h1", () => {
    wrap(<MarketingHero title="Hero heading" />);
    expect(screen.getByRole("heading", { level: 1, name: "Hero heading" })).toBeInTheDocument();
  });

  it("renders the subtitle", () => {
    wrap(<MarketingHero subtitle="Sub copy" />);
    expect(screen.getByText("Sub copy")).toBeInTheDocument();
  });

  it("renders the eyebrow", () => {
    wrap(<MarketingHero eyebrow="New feature" />);
    expect(screen.getByText("New feature")).toBeInTheDocument();
  });

  it("renders the trustLine", () => {
    wrap(<MarketingHero trustLine="No CC required" />);
    expect(screen.getByText("No CC required")).toBeInTheDocument();
  });

  it("renders a primary CTA button", () => {
    wrap(<MarketingHero cta={{ text: "Get started", link: "/start" }} />);
    const btn = screen.getByRole("link", { name: "Get started" });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("href", "/start");
  });

  it("renders both CTA buttons when both are provided", () => {
    wrap(
      <MarketingHero
        cta={{ text: "Primary", link: "/p" }}
        secondaryCta={{ text: "Secondary", link: "/s" }}
      />,
    );
    expect(screen.getByRole("link", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Secondary" })).toBeInTheDocument();
  });

  it("accepts legacy primaryButton prop", () => {
    wrap(<MarketingHero primaryButton={{ text: "Legacy btn", link: "/l" }} />);
    expect(screen.getByRole("link", { name: "Legacy btn" })).toBeInTheDocument();
  });

  it("renders a video element when backgroundVideo is provided", () => {
    const { container } = wrap(<MarketingHero backgroundVideo="https://example.com/bg.mp4" />);
    expect(container.querySelector("video")).toBeTruthy();
  });
});
