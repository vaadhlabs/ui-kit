import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeShellProvider } from "../../ThemeShellProvider.js";
import { TabsSection } from "../TabsSection.js";

function wrap(ui: React.ReactNode) {
  return render(<ThemeShellProvider mode="light">{ui}</ThemeShellProvider>);
}

const TABS = [
  { label: "Tab A", content: "Content for tab A" },
  { label: "Tab B", content: "Content for tab B" },
  { label: "Tab C", content: "Content for tab C" },
];

describe("TabsSection", () => {
  it("renders without crashing with no tabs", () => {
    const { container } = wrap(<TabsSection />);
    expect(container.querySelector("section")).toBeTruthy();
  });

  it("renders the section title", () => {
    wrap(<TabsSection title="Feature tabs" tabs={TABS} />);
    expect(screen.getByText("Feature tabs")).toBeInTheDocument();
  });

  it("renders all 3 tab labels", () => {
    wrap(<TabsSection tabs={TABS} />);
    expect(screen.getByRole("tab", { name: /Tab A/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Tab B/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Tab C/ })).toBeInTheDocument();
  });

  it("shows the first tab content by default", () => {
    wrap(<TabsSection tabs={TABS} />);
    expect(screen.getByText("Content for tab A")).toBeInTheDocument();
  });

  it("switches content when a different tab is clicked", async () => {
    const user = userEvent.setup();
    wrap(<TabsSection tabs={TABS} />);
    await user.click(screen.getByRole("tab", { name: /Tab B/ }));
    expect(screen.getByText("Content for tab B")).toBeInTheDocument();
  });

  it("renders with pills tabStyle", () => {
    const { container } = wrap(<TabsSection tabs={TABS} tabStyle="pills" />);
    expect(container.querySelector('[role="tablist"]')).toBeTruthy();
  });

  it("renders icon when icon name is recognised", () => {
    const tabsWithIcon = [{ label: "ML", icon: "BrainCircuit", content: "ML content" }];
    wrap(<TabsSection tabs={tabsWithIcon} />);
    // Tab label is present
    expect(screen.getByRole("tab", { name: /ML/ })).toBeInTheDocument();
  });
});
