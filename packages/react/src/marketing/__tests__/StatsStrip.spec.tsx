import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatsStrip } from "../StatsStrip.js";

const stats = [
  { value: "40", suffix: "%", label: "cost reduction" },
  { value: "$4M", label: "saved" },
];

describe("StatsStrip", () => {
  it("renders without crashing with no props", () => {
    const { container } = render(<StatsStrip />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders title and subtitle", () => {
    render(<StatsStrip title="By the numbers" subtitle="From real pilots" stats={[]} />);
    expect(screen.getByText("By the numbers")).toBeInTheDocument();
    expect(screen.getByText("From real pilots")).toBeInTheDocument();
  });

  it("renders stat values and labels", () => {
    render(<StatsStrip stats={stats} />);
    expect(screen.getByText("40")).toBeInTheDocument();
    expect(screen.getByText("cost reduction")).toBeInTheDocument();
    expect(screen.getByText("$4M")).toBeInTheDocument();
    expect(screen.getByText("saved")).toBeInTheDocument();
  });

  it("renders suffix text when provided", () => {
    render(<StatsStrip stats={[{ value: "99.9", suffix: "%", label: "uptime" }]} />);
    expect(screen.getByText("%")).toBeInTheDocument();
  });

  it("renders in dark variant without crashing", () => {
    const { container } = render(<StatsStrip stats={stats} variant="dark" />);
    expect(container.firstChild).toBeTruthy();
  });
});
