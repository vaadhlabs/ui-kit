import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";

import { createWorkshopTheme } from "../workshop-theme.js";
import { SectionProvider, useSection } from "../section.js";
import { SectionHeader } from "../SectionHeader.js";
import { MetricCardWorkshop } from "../MetricCardWorkshop.js";

function ProbeSection(): JSX.Element {
  const { accent, tint, id } = useSection();
  return (
    <div data-testid="probe" data-accent={accent} data-tint={tint} data-id={id ?? ""} />
  );
}

describe("createWorkshopTheme", () => {
  it("light variant exposes the 4 section tokens with hex accents", () => {
    const t = createWorkshopTheme("light");
    expect(t.palette.mode).toBe("light");
    expect(t.palette.workshop.section.observe.accent).toBe("#2563EB");
    expect(t.palette.workshop.section.optimize.accent).toBe("#0F766E");
    expect(t.palette.workshop.section.operations.accent).toBe("#7C3AED");
    expect(t.palette.workshop.section.govern.accent).toBe("#B45309");
  });

  it("dark variant swaps tints to translucent overlays so they read on dark panels", () => {
    const t = createWorkshopTheme("dark");
    expect(t.palette.mode).toBe("dark");
    expect(t.palette.workshop.section.observe.tint).toMatch(/^rgba\(/);
    expect(t.palette.workshop.section.observe.accent).toBe("#60A5FA");
  });

  it("borderRadius default is 12 (cards/buttons; chips override to 10 via component overrides)", () => {
    const t = createWorkshopTheme();
    expect(t.shape.borderRadius).toBe(12);
  });

  it("typography h1 is the 44px hero per the Workshop spec", () => {
    const t = createWorkshopTheme();
    expect(t.typography.h1.fontSize).toBe("2.75rem");
  });
});

describe("useSection", () => {
  it("returns null id + primary accent outside any SectionProvider", () => {
    const t = createWorkshopTheme();
    const { getByTestId } = render(
      <ThemeProvider theme={t}>
        <ProbeSection />
      </ThemeProvider>,
    );
    const probe = getByTestId("probe");
    expect(probe.getAttribute("data-id")).toBe("");
    expect(probe.getAttribute("data-accent")).toBe(t.palette.primary.main);
  });

  it("returns the section tokens when wrapped in SectionProvider", () => {
    const t = createWorkshopTheme();
    const { getByTestId } = render(
      <ThemeProvider theme={t}>
        <SectionProvider section="govern">
          <ProbeSection />
        </SectionProvider>
      </ThemeProvider>,
    );
    const probe = getByTestId("probe");
    expect(probe.getAttribute("data-id")).toBe("govern");
    expect(probe.getAttribute("data-accent")).toBe("#B45309");
  });
});

describe("SectionHeader", () => {
  it("renders kicker + title + subtitle inside a SectionProvider", () => {
    const t = createWorkshopTheme();
    const { getByText } = render(
      <ThemeProvider theme={t}>
        <SectionProvider section="optimize">
          <SectionHeader kicker="OPTIMIZE" title="Routing" subtitle="What changed last week" />
        </SectionProvider>
      </ThemeProvider>,
    );
    expect(getByText("OPTIMIZE")).toBeInTheDocument();
    expect(getByText("Routing")).toBeInTheDocument();
    expect(getByText("What changed last week")).toBeInTheDocument();
  });
});

describe("MetricCardWorkshop", () => {
  it("renders the value and label", () => {
    const t = createWorkshopTheme();
    const { getByText } = render(
      <ThemeProvider theme={t}>
        <SectionProvider section="observe">
          <MetricCardWorkshop label="Monthly AI spend" value="$128k" caption="vs $360k budget" delta="+34%" tone="bad" />
        </SectionProvider>
      </ThemeProvider>,
    );
    expect(getByText("Monthly AI spend")).toBeInTheDocument();
    expect(getByText("$128k")).toBeInTheDocument();
    expect(getByText("+34%")).toBeInTheDocument();
  });
});
