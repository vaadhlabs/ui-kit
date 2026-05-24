import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PilotFindings } from "../PilotFindings.js";

const findings = [
  { range: "20–40%", label: "cost reduction", note: "From smart routing." },
  { range: "$10k–$50k", label: "unattributed spend", note: "Revealed by attribution." },
];

describe("PilotFindings", () => {
  it("renders without crashing with no props", () => {
    const { container } = render(<PilotFindings />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders default title when none is provided", () => {
    render(<PilotFindings />);
    expect(
      screen.getByText("What a two-week pilot typically finds"),
    ).toBeInTheDocument();
  });

  it("renders custom title and subtitle", () => {
    render(
      <PilotFindings
        title="Pilot results"
        subtitle="Based on 40+ pilots"
        findings={[]}
      />,
    );
    expect(screen.getByText("Pilot results")).toBeInTheDocument();
    expect(screen.getByText("Based on 40+ pilots")).toBeInTheDocument();
  });

  it("renders finding range, label, and note", () => {
    render(<PilotFindings findings={findings} />);
    expect(screen.getByText("20–40%")).toBeInTheDocument();
    expect(screen.getByText("cost reduction")).toBeInTheDocument();
    expect(screen.getByText("From smart routing.")).toBeInTheDocument();
  });

  it("renders the CTA button when cta prop is provided", () => {
    render(
      <PilotFindings
        findings={[]}
        cta={{ text: "Start a pilot", link: "/pilot" }}
      />,
    );
    const btn = screen.getByRole("link", { name: /start a pilot/i });
    expect(btn).toHaveAttribute("href", "/pilot");
  });

  it("renders the footnote when provided", () => {
    render(<PilotFindings findings={[]} footnote="Results vary." />);
    expect(screen.getByText("Results vary.")).toBeInTheDocument();
  });
});
