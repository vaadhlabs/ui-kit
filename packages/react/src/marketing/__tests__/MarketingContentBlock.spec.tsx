import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeShellProvider } from "../../ThemeShellProvider.js";
import { MarketingContentBlock } from "../MarketingContentBlock.js";

function wrap(ui: React.ReactNode) {
  return render(<ThemeShellProvider mode="light">{ui}</ThemeShellProvider>);
}

describe("MarketingContentBlock", () => {
  it("renders without crashing with no props", () => {
    const { container } = wrap(<MarketingContentBlock />);
    expect(container.querySelector("section")).toBeTruthy();
  });

  it("renders the title when provided", () => {
    wrap(<MarketingContentBlock title="How it works" />);
    expect(screen.getByText("How it works")).toBeInTheDocument();
  });

  it("accepts `heading` as alias for `title`", () => {
    wrap(<MarketingContentBlock heading="Via heading prop" />);
    expect(screen.getByText("Via heading prop")).toBeInTheDocument();
  });

  it("renders the eyebrow label", () => {
    wrap(<MarketingContentBlock eyebrow="Phase one" />);
    expect(screen.getByText("Phase one")).toBeInTheDocument();
  });

  it("renders markdown body content", () => {
    wrap(<MarketingContentBlock content={"**Bold text** in markdown"} />);
    expect(screen.getByText("Bold text")).toBeInTheDocument();
  });

  it("accepts `body` as alias for `content`", () => {
    wrap(<MarketingContentBlock body={"Body via legacy alias"} />);
    expect(screen.getByText("Body via legacy alias")).toBeInTheDocument();
  });
});
