import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatsCounter } from "../StatsCounter.js";

const stats = [
  { id: 1, value: "40", suffix: "%", label: "Cost reduction" },
  { id: 2, value: "200", suffix: "ms", label: "Latency" },
];

describe("StatsCounter", () => {
  it("renders without crashing with no props", () => {
    const { container } = render(<StatsCounter />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders section title and subtitle", () => {
    render(
      <StatsCounter
        title="Proven scale"
        subtitle="From real deployments"
        stats={[]}
        animateOnScroll={false}
      />,
    );
    expect(screen.getByText("Proven scale")).toBeInTheDocument();
    expect(screen.getByText("From real deployments")).toBeInTheDocument();
  });

  it("renders stat labels when animateOnScroll is false", () => {
    render(<StatsCounter stats={stats} animateOnScroll={false} />);
    expect(screen.getByText("Cost reduction")).toBeInTheDocument();
    expect(screen.getByText("Latency")).toBeInTheDocument();
  });

  it("shows the raw value immediately when animateOnScroll is false", () => {
    render(
      <StatsCounter
        stats={[{ value: "42", label: "Widgets" }]}
        animateOnScroll={false}
      />,
    );
    // When not animating the display value is set to the raw value on first render.
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders with a gradient background without crashing", () => {
    const { container } = render(
      <StatsCounter
        stats={stats}
        gradientFrom="#6366f1"
        gradientTo="#4f46e5"
        animateOnScroll={false}
      />,
    );
    expect(container.firstChild).toBeTruthy();
  });
});
