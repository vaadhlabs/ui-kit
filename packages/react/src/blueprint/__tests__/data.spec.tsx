import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import {
  Dim,
  LeaderCallout,
  Plot,
  SectionDivider,
  StatLine,
  Table,
} from "../index.js";
import type { TableColumn, TableRow } from "../index.js";
import { BLUEPRINT_LIGHT } from "@tensorcost/tokens";

function rgb(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

// ----------------------------------------------------------------------------
// StatLine
// ----------------------------------------------------------------------------

describe("StatLine", () => {
  const items = [
    { label: "Saved · today", value: "$342", unit: "/day", delta: "+ 31%", deltaKind: "good" as const },
    { label: "Decisions / sec", value: "24.4" },
    { label: "Active fallbacks", value: "1", delta: "vertex · half-open", deltaKind: "warn" as const },
  ];

  it("renders one cell per item", () => {
    const { container } = render(<StatLine items={items} />);
    // Top-level row + 3 cells.
    const cells = container.querySelectorAll(":scope > div > div");
    expect(cells.length).toBe(3);
  });

  it("first cell shows label + value + unit + delta with good-tone color", () => {
    const { container, getByText } = render(<StatLine items={items} />);
    expect(getByText("Saved · today")).toBeTruthy();
    expect(getByText("$342")).toBeTruthy();
    expect(getByText("/day")).toBeTruthy();
    const delta = getByText("+ 31%");
    expect(delta.style.color).toBe(rgb(BLUEPRINT_LIGHT.good));
    expect(container).toBeTruthy();
  });

  it("warn delta picks warn color", () => {
    const { getByText } = render(<StatLine items={items} />);
    expect(getByText("vertex · half-open").style.color).toBe(rgb(BLUEPRINT_LIGHT.warn));
  });

  it("outer container has top + bottom ink borders, no side borders", () => {
    const { container } = render(<StatLine items={items} />);
    const outer = container.firstChild as HTMLElement;
    expect(outer.style.borderTopWidth).toBe("1px");
    expect(outer.style.borderBottomWidth).toBe("1px");
    expect(outer.style.borderLeftWidth).toBe("0px");
    expect(outer.style.borderRightWidth).toBe("0px");
    expect(outer.style.borderColor).toBe(rgb(BLUEPRINT_LIGHT.ink));
  });
});

// ----------------------------------------------------------------------------
// Table
// ----------------------------------------------------------------------------

describe("Table", () => {
  const cols: TableColumn[] = [
    { key: "name", label: "Name" },
    { key: "score", label: "Score", mono: true, align: "right" },
    { key: "verdict", label: "Verdict" },
  ];
  const rows: TableRow[] = [
    { name: "gpt-4-turbo", score: "0.91", verdict: "accept" },
    { name: "claude-sonnet-4.5", score: "0.89", verdict: "accept" },
    { name: "phi-3-mini", score: "0.61", verdict: "below floor" },
  ];

  it("renders a role=table with header + body rows", () => {
    const { container } = render(<Table cols={cols} rows={rows} />);
    expect(container.querySelector('[role="table"]')).toBeTruthy();
    // 1 header row + 3 body rows = 4 total
    expect(container.querySelectorAll('[role="row"]').length).toBe(4);
    expect(container.querySelectorAll('[role="columnheader"]').length).toBe(3);
    expect(container.querySelectorAll('[role="cell"]').length).toBe(9);
  });

  it("header labels are visible and uppercase mono", () => {
    const { getByText } = render(<Table cols={cols} rows={rows} />);
    const header = getByText("Name");
    expect(header.style.textTransform).toBe("uppercase");
    expect(header.style.fontFamily.toLowerCase()).toContain("plex mono");
  });

  it("mono column cells render in mono font", () => {
    const { container } = render(<Table cols={cols} rows={rows} />);
    // First body row, 2nd cell = "0.91" (mono col)
    const bodyCells = container.querySelectorAll<HTMLDivElement>('[role="cell"]');
    const scoreCell = bodyCells[1]!;
    expect(scoreCell.style.fontFamily.toLowerCase()).toContain("plex mono");
    expect(scoreCell.style.textAlign).toBe("right");
  });

  it("zebra striping flips alternate rows", () => {
    const { container } = render(<Table cols={cols} rows={rows} />);
    const bodyRows = container.querySelectorAll<HTMLDivElement>('[role="row"]');
    // bodyRows[0] is the header; rows[0] body even idx → transparent, rows[1] odd → paper.
    expect(bodyRows[1]!.style.background).toBe("transparent");
    expect(bodyRows[2]!.style.background).toBe(rgb(BLUEPRINT_LIGHT.paper));
  });

  it("respects per-row __bg override", () => {
    const overridden: TableRow[] = [...rows];
    overridden[0] = { ...rows[0]!, __bg: BLUEPRINT_LIGHT.accentBg };
    const { container } = render(<Table cols={cols} rows={overridden} />);
    const firstBodyRow = container.querySelectorAll<HTMLDivElement>('[role="row"]')[1]!;
    expect(firstBodyRow.style.background).toBe(rgb(BLUEPRINT_LIGHT.accentBg));
  });

  it("renders ReactNode cell values", () => {
    const richRows: TableRow[] = [
      { name: <strong data-testid="rich">gpt</strong>, score: "0.9", verdict: "ok" },
    ];
    const { getByTestId } = render(<Table cols={cols} rows={richRows} />);
    expect(getByTestId("rich")).toBeTruthy();
  });
});

// ----------------------------------------------------------------------------
// Plot
// ----------------------------------------------------------------------------

describe("Plot", () => {
  it("renders an SVG with role=img + aria-label when label is string", () => {
    const { container } = render(<Plot kind="line" label="Score over time" />);
    const svg = container.querySelector("svg")!;
    expect(svg).toBeTruthy();
    expect(svg.getAttribute("role")).toBe("img");
    expect(svg.getAttribute("aria-label")).toBe("Score over time");
  });

  it("line kind emits two paths (solid + dashed)", () => {
    const { container } = render(<Plot kind="line" />);
    const paths = container.querySelectorAll("path");
    expect(paths.length).toBe(2);
    // The dashed forecast line has stroke-dasharray
    expect(paths[1]!.getAttribute("stroke-dasharray")).toBe("3 2");
  });

  it("bars kind emits 12 rects with the last in accent", () => {
    const { container } = render(<Plot kind="bars" />);
    const rects = container.querySelectorAll("rect");
    expect(rects.length).toBe(12);
    expect(rects[11]!.getAttribute("fill")).toBe(BLUEPRINT_LIGHT.accent);
  });

  it("area kind emits a filled path + a stroke path", () => {
    const { container } = render(<Plot kind="area" />);
    const paths = container.querySelectorAll("path");
    expect(paths.length).toBe(2);
    expect(paths[0]!.getAttribute("fill")).toBe(BLUEPRINT_LIGHT.accent);
    expect(paths[0]!.getAttribute("opacity")).toBe("0.16");
  });

  it("spark + step render polylines", () => {
    for (const kind of ["spark", "step"] as const) {
      const { container } = render(<Plot kind={kind} />);
      expect(container.querySelector("polyline")).toBeTruthy();
    }
  });
});

// ----------------------------------------------------------------------------
// LeaderCallout
// ----------------------------------------------------------------------------

describe("LeaderCallout", () => {
  it("renders the chip number + title + body", () => {
    const { container, getByText } = render(
      <LeaderCallout n={2} title="Quality is continuous" body="A 1% judge sample runs against every routed call." />,
    );
    expect(container.querySelector("span")!.textContent).toBe("2");  // Callout
    expect(getByText("Quality is continuous")).toBeTruthy();
    expect(getByText(/judge sample/)).toBeTruthy();
  });

  it("direction left → row, right → row-reverse", () => {
    const { container: left } = render(<LeaderCallout n={1} title="t" body="b" direction="left" />);
    expect((left.firstChild as HTMLElement).style.flexDirection).toBe("row");
    const { container: right } = render(<LeaderCallout n={1} title="t" body="b" direction="right" />);
    expect((right.firstChild as HTMLElement).style.flexDirection).toBe("row-reverse");
  });
});

// ----------------------------------------------------------------------------
// Dim
// ----------------------------------------------------------------------------

describe("Dim", () => {
  it("renders 5 children (cap, line, label, line, cap) and the label text", () => {
    const { container } = render(<Dim label="240 px" />);
    const outer = container.firstChild as HTMLElement;
    expect(outer.children.length).toBe(5);
    expect(outer.textContent).toBe("240 px");
  });

  it("uses accent color by default", () => {
    const { container } = render(<Dim label="x" />);
    const labelEl = (container.firstChild as HTMLElement).children[2] as HTMLElement;
    expect(labelEl.style.color).toBe(rgb(BLUEPRINT_LIGHT.accent));
  });

  it("aria-hidden because it's decorative", () => {
    const { container } = render(<Dim label="x" />);
    expect((container.firstChild as HTMLElement).getAttribute("aria-hidden")).toBe("true");
  });
});

// ----------------------------------------------------------------------------
// SectionDivider
// ----------------------------------------------------------------------------

describe("SectionDivider", () => {
  it("renders number + kicker + h1 title + body", () => {
    const { container, getByText } = render(
      <SectionDivider
        no="01"
        kicker="01 · Router · the homepage"
        title="Router-first IA"
        body="The first thing every buyer sees is the live router."
      />,
    );
    expect(container.querySelector("h1")?.textContent).toBe("Router-first IA");
    expect(getByText("01")).toBeTruthy();
    expect(getByText(/Router · the homepage/)).toBeTruthy();
    expect(getByText(/first thing every buyer/)).toBeTruthy();
  });

  it("number defaults to accent color, can be overridden", () => {
    const { container: a } = render(<SectionDivider no="01" kicker="k" title="t" />);
    const aNum = (a.firstChild as HTMLElement).children[0]!.children[0] as HTMLElement;
    expect(aNum.style.color).toBe(rgb(BLUEPRINT_LIGHT.accent));

    const { container: b } = render(<SectionDivider no="02" kicker="k" title="t" accent="#000" />);
    const bNum = (b.firstChild as HTMLElement).children[0]!.children[0] as HTMLElement;
    expect(bNum.style.color).toBe("rgb(0, 0, 0)");
  });
});
