import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeShellProvider } from "../../ThemeShellProvider.js";
import { Timeline } from "../Timeline.js";

function wrap(ui: React.ReactNode) {
  return render(<ThemeShellProvider mode="light">{ui}</ThemeShellProvider>);
}

const ITEMS = [
  { id: 1, title: "Step one", description: "Description one.", date: "Day 1" },
  { id: 2, title: "Step two", description: "Description two.", date: "Day 2" },
  { id: 3, title: "Step three", description: "Description three.", date: "Day 3" },
];

describe("Timeline", () => {
  it("renders without crashing with no items", () => {
    const { container } = wrap(<Timeline />);
    expect(container.querySelector("section")).toBeTruthy();
  });

  it("renders the section title", () => {
    wrap(<Timeline title="How it works" />);
    expect(screen.getByText("How it works")).toBeInTheDocument();
  });

  it("renders 3 timeline items", () => {
    wrap(<Timeline items={ITEMS} />);
    expect(screen.getAllByTestId("timeline-item")).toHaveLength(3);
  });

  it("renders item titles", () => {
    wrap(<Timeline items={ITEMS} />);
    expect(screen.getByText("Step one")).toBeInTheDocument();
    expect(screen.getByText("Step two")).toBeInTheDocument();
    expect(screen.getByText("Step three")).toBeInTheDocument();
  });

  it("renders item dates", () => {
    wrap(<Timeline items={ITEMS} />);
    expect(screen.getByText("Day 1")).toBeInTheDocument();
  });

  it("renders descriptions via dangerouslySetInnerHTML", () => {
    const items = [{ id: 1, title: "T", description: "<p>HTML body</p>" }];
    wrap(<Timeline items={items} />);
    expect(screen.getByText("HTML body")).toBeInTheDocument();
  });

  it("renders an icon when a recognised icon name is provided", () => {
    const items = [{ id: 1, title: "ML step", icon: "BrainCircuit" }];
    wrap(<Timeline items={items} />);
    // Just verify no crash and item is rendered
    expect(screen.getByTestId("timeline-item")).toBeTruthy();
  });

  it("falls back to numbered dot when icon name is unknown", () => {
    const items = [{ id: 1, title: "Unknown icon step", icon: "NonExistentIcon" }];
    wrap(<Timeline items={items} />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
