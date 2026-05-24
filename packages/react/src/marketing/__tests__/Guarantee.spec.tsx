import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Guarantee } from "../Guarantee.js";

describe("Guarantee", () => {
  it("renders without crashing with no props", () => {
    const { container } = render(<Guarantee />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders badge, title, and body", () => {
    render(
      <Guarantee
        badge="30-Day Guarantee"
        title="Risk-free pilot"
        body="Full refund if we don't find savings."
      />,
    );
    expect(screen.getByText("30-Day Guarantee")).toBeInTheDocument();
    expect(screen.getByText("Risk-free pilot")).toBeInTheDocument();
    expect(screen.getByText("Full refund if we don't find savings.")).toBeInTheDocument();
  });

  it("renders the checkmark badge circle", () => {
    render(<Guarantee />);
    expect(screen.getByText("✓")).toBeInTheDocument();
  });

  it("renders with only title", () => {
    render(<Guarantee title="Enterprise SLA" />);
    expect(screen.getByText("Enterprise SLA")).toBeInTheDocument();
    expect(screen.queryByText("✓")).toBeTruthy(); // badge circle always renders
  });

  it("renders body text including content with newlines", () => {
    render(
      <Guarantee body={"Line one.\nLine two."} />,
    );
    // The DOM normalises whitespace; test that the text node content is
    // accessible. `whiteSpace: pre-line` governs visual rendering, not storage.
    const bodyEl = screen.getByText((content) =>
      content.includes("Line one.") && content.includes("Line two."),
    );
    expect(bodyEl).toBeInTheDocument();
  });
});
