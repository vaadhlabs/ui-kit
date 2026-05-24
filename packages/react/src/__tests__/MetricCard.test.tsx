import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricCard } from "../MetricCard.js";

function Icon(): JSX.Element {
  return <svg data-testid="icon" />;
}

describe("MetricCard", () => {
  it("renders title, value, and subtitle", () => {
    render(<MetricCard title="GPUs" value={42} icon={<Icon />} subtitle="online" />);
    expect(screen.getByText("GPUs")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("online")).toBeInTheDocument();
  });

  it("falls back to primary for unknown color names", () => {
    render(<MetricCard title="X" value="$1" icon={<Icon />} color="not-a-real-key" />);
    expect(screen.getByText("X")).toBeInTheDocument();
  });

  it("accepts hex colors directly", () => {
    render(<MetricCard title="X" value="$1" icon={<Icon />} color="#112233" />);
    expect(screen.getByText("X")).toBeInTheDocument();
  });

  it("renders without subtitle", () => {
    render(<MetricCard title="A" value={0} icon={<Icon />} color="success" />);
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.queryByText("online")).not.toBeInTheDocument();
  });
});
