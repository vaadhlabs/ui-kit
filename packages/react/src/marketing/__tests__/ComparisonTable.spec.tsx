import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ComparisonTable } from "../ComparisonTable.js";

const rows = [
  { left: "Manual CSV exports", right: "Real-time unified view" },
  { left: "No budget alerts", right: "Alerts before cap is hit" },
];

describe("ComparisonTable", () => {
  it("renders without crashing with no props", () => {
    const { container } = render(<ComparisonTable />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders title and subtitle", () => {
    render(
      <ComparisonTable
        title="Before and after"
        subtitle="A clear difference"
        rows={[]}
      />,
    );
    expect(screen.getByText("Before and after")).toBeInTheDocument();
    expect(screen.getByText("A clear difference")).toBeInTheDocument();
  });

  it("renders column header labels", () => {
    render(
      <ComparisonTable
        leftLabel="Without TensorCost"
        rightLabel="With TensorCost"
        rows={rows}
      />,
    );
    // Column headers appear at least once (could be once wide, once narrow layout)
    expect(screen.getAllByText("Without TensorCost").length).toBeGreaterThan(0);
    expect(screen.getAllByText("With TensorCost").length).toBeGreaterThan(0);
  });

  it("renders all row values", () => {
    render(<ComparisonTable rows={rows} />);
    expect(screen.getByText("Manual CSV exports")).toBeInTheDocument();
    expect(screen.getByText("Real-time unified view")).toBeInTheDocument();
    expect(screen.getByText("No budget alerts")).toBeInTheDocument();
    expect(screen.getByText("Alerts before cap is hit")).toBeInTheDocument();
  });

  it("renders empty state without crashing", () => {
    const { container } = render(
      <ComparisonTable leftLabel="A" rightLabel="B" rows={[]} />,
    );
    expect(container.firstChild).toBeTruthy();
  });
});
