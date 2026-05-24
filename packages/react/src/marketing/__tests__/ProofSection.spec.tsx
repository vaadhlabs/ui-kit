import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeShellProvider } from "../../ThemeShellProvider.js";
import { ProofSection } from "../ProofSection.js";

function wrap(ui: React.ReactNode) {
  return render(<ThemeShellProvider mode="light">{ui}</ThemeShellProvider>);
}

describe("ProofSection", () => {
  it("renders without crashing with no props", () => {
    const { container } = wrap(<ProofSection />);
    expect(container.querySelector("section")).toBeTruthy();
  });

  it("renders the default title", () => {
    wrap(<ProofSection />);
    expect(screen.getByText("Verify it yourself.")).toBeInTheDocument();
  });

  it("renders a custom title", () => {
    wrap(<ProofSection title="Check the numbers." />);
    expect(screen.getByText("Check the numbers.")).toBeInTheDocument();
  });

  it("renders the terminal block", () => {
    wrap(<ProofSection />);
    expect(screen.getByTestId("proof-terminal")).toBeInTheDocument();
  });

  it("renders the command text (without leading $)", () => {
    wrap(<ProofSection command="$ sha256sum ledger.csv" />);
    expect(screen.getByText("sha256sum ledger.csv")).toBeInTheDocument();
  });

  it("renders the output line", () => {
    wrap(<ProofSection output="abc123 ledger.csv" />);
    expect(screen.getByText("abc123 ledger.csv")).toBeInTheDocument();
  });

  it("renders the markdown body when provided", () => {
    wrap(<ProofSection body={"Every hash is **verified**."} />);
    expect(screen.getByText("verified")).toBeInTheDocument();
  });

  it("renders a CTA link when ctaText and ctaLink are provided", () => {
    wrap(<ProofSection ctaText="Read the guide" ctaLink="https://tensorcost.com/proof" />);
    const link = screen.getByRole("link", { name: /Read the guide/ });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://tensorcost.com/proof");
  });

  it("does not render a CTA link when props are omitted", () => {
    wrap(<ProofSection title="No CTA" />);
    expect(screen.queryByRole("link")).toBeNull();
  });
});
