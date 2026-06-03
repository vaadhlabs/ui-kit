import { describe, expect, it, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import {
  DEFAULT_RAIL_ITEMS,
  Frame,
  RailV2,
  SubTabs,
  Surface,
  SurfaceFramed,
  TopBar,
} from "../index.js";
import type { RailItem, SubTab, SurfaceId } from "../index.js";
import { BLUEPRINT_LIGHT } from "@tensorcost/tokens";

function rgb(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

// ----------------------------------------------------------------------------
// Frame
// ----------------------------------------------------------------------------

describe("Frame", () => {
  it("renders the path title in uppercase mono", () => {
    const { getByText } = render(<Frame title="/router · live">body</Frame>);
    const el = getByText("/router · live");
    expect(el.style.textTransform).toBe("uppercase");
    expect(el.style.fontFamily.toLowerCase()).toContain("plex mono");
  });

  it("hairline ink border on the outer container, default 1280 wide", () => {
    const { container } = render(<Frame title="/x">body</Frame>);
    const outer = container.firstChild as HTMLElement;
    expect(outer.style.border).toBe(`1px solid ${rgb(BLUEPRINT_LIGHT.ink)}`);
    expect(outer.style.width).toBe("1280px");
  });

  it("mobile default is 380px wide", () => {
    const { container } = render(<Frame mobile>body</Frame>);
    expect((container.firstChild as HTMLElement).style.width).toBe("380px");
  });

  it("renders three traffic-light squares aria-hidden", () => {
    const { container } = render(<Frame title="/x">body</Frame>);
    const dots = container.querySelectorAll('span[aria-hidden] > span');
    expect(dots.length).toBe(3);
  });
});

// ----------------------------------------------------------------------------
// RailV2
// ----------------------------------------------------------------------------

describe("RailV2", () => {
  it("ships 5 surfaces by default in the right order", () => {
    expect(DEFAULT_RAIL_ITEMS.map((i) => i.id)).toEqual([
      "router", "money", "policy", "build", "trust",
    ]);
  });

  it("renders 5 nav buttons with the names visible", () => {
    const { container } = render(<RailV2 active="router" />);
    const buttons = container.querySelectorAll('nav[aria-label="Primary"] li button');
    expect(buttons.length).toBe(5);
    expect(container.textContent).toContain("Router");
    expect(container.textContent).toContain("Trust");
  });

  it("active surface gets aria-current=page + paper3 fill + accent left-border", () => {
    const { container } = render(<RailV2 active="policy" />);
    const buttons = container.querySelectorAll<HTMLButtonElement>('li button');
    const policy = buttons[2]!;  // 3rd = policy
    expect(policy.getAttribute("aria-current")).toBe("page");
    // Redesign 2026-06: active fill softened from solid ink to paper3 —
    // the gradient left bar (borderImage) carries the active accent.
    expect(policy.style.background).toBe(rgb(BLUEPRINT_LIGHT.paper3));
    // Per-side longhand widths + single borderColor; active = accent.
    expect(policy.style.borderLeftWidth).toBe("3px");
    expect(policy.style.borderTopWidth).toBe("0px");
    expect(policy.style.borderColor).toBe(rgb(BLUEPRINT_LIGHT.accent));
  });

  it("non-active surfaces have transparent left border", () => {
    const { container } = render(<RailV2 active="policy" />);
    const buttons = container.querySelectorAll<HTMLButtonElement>('li button');
    expect(buttons[0]!.getAttribute("aria-current")).toBeNull();
    expect(buttons[0]!.style.background).toBe("transparent");
  });

  it("onItemClick fires with the clicked item", () => {
    const clicks: SurfaceId[] = [];
    const { container } = render(
      <RailV2 active="router" onItemClick={(it: RailItem) => clicks.push(it.id)} />,
    );
    const moneyButton = container.querySelectorAll<HTMLButtonElement>("li button")[1]!;
    fireEvent.click(moneyButton);
    expect(clicks).toEqual(["money"]);
  });

  it("tenant + environment render with separate aria-labels when onEnvClick supplied", () => {
    const { getByLabelText } = render(
      <RailV2
        active="router"
        tenant="Acme AI"
        environment="prod · eu-west-1"
        onTenantClick={vi.fn()}
        onEnvClick={vi.fn()}
      />,
    );
    expect(getByLabelText(/^Tenant Acme AI$/)).toBeTruthy();
    expect(getByLabelText(/^Environment prod · eu-west-1$/)).toBeTruthy();
  });

  it("env row stays a static span when onEnvClick is omitted (single-tenant case)", () => {
    const { queryByLabelText, getByText } = render(
      <RailV2
        active="router"
        tenant="Acme AI"
        environment="prod · eu-west-1"
        onTenantClick={vi.fn()}
      />,
    );
    // The text renders but no Environment-labelled button exists.
    expect(getByText("prod · eu-west-1")).toBeTruthy();
    expect(queryByLabelText(/Environment/)).toBeNull();
  });

  it("tenant click handler fires", () => {
    const onTenantClick = vi.fn();
    const { getByLabelText } = render(
      <RailV2 active="router" tenant="Acme AI" onTenantClick={onTenantClick} />,
    );
    fireEvent.click(getByLabelText(/Tenant Acme AI/));
    expect(onTenantClick).toHaveBeenCalledOnce();
  });

  it("env click handler fires independently of tenant click", () => {
    const onTenantClick = vi.fn();
    const onEnvClick = vi.fn();
    const { getByLabelText } = render(
      <RailV2
        active="router"
        tenant="Acme AI"
        environment="prod"
        onTenantClick={onTenantClick}
        onEnvClick={onEnvClick}
      />,
    );
    fireEvent.click(getByLabelText(/Environment prod/));
    expect(onEnvClick).toHaveBeenCalledOnce();
    expect(onTenantClick).not.toHaveBeenCalled();
  });

  it("logoSlot overrides the default word-mark", () => {
    const { getByTestId, queryByText } = render(
      <RailV2 active="router" logoSlot={<span data-testid="custom-logo">Acme</span>} />,
    );
    expect(getByTestId("custom-logo")).toBeTruthy();
    expect(queryByText("tensorcost")).toBeNull();
  });

  it("versionLabel renders below the word-mark", () => {
    const { getByText } = render(<RailV2 active="router" versionLabel="v2026.6 · prod" />);
    expect(getByText("v2026.6 · prod")).toBeTruthy();
  });
});

// ----------------------------------------------------------------------------
// TopBar
// ----------------------------------------------------------------------------

describe("TopBar", () => {
  it("renders title with optional eyebrow above", () => {
    const { getByText } = render(<TopBar title="Live router" sub="01 · Router · Live" />);
    expect(getByText("Live router")).toBeTruthy();
    expect(getByText("01 · Router · Live")).toBeTruthy();
  });

  it("status slot renders to the right of title; actions further right", () => {
    const { getByText } = render(
      <TopBar
        title="Spend"
        status={<span>enforcement on</span>}
        actions={<button type="button">Pause</button>}
      />,
    );
    expect(getByText("enforcement on")).toBeTruthy();
    expect(getByText("Pause")).toBeTruthy();
  });

  it("bottom border is 1px solid ink", () => {
    const { container } = render(<TopBar title="x" />);
    const header = container.querySelector("header")!;
    expect(header.getAttribute("style") ?? "").toMatch(
      /border-bottom:\s*1px\s+solid\s+rgb\(10,\s*10,\s*10\)/,
    );
  });
});

// ----------------------------------------------------------------------------
// SubTabs
// ----------------------------------------------------------------------------

describe("SubTabs", () => {
  const tabs: SubTab[] = [
    { id: "live", label: "Live", active: true },
    { id: "models", label: "Models", count: 12 },
    { id: "fleet", label: "Fleet", count: 32 },
    { id: "eval", label: "Eval", count: 5 },
  ];

  it("renders all 4 tabs with the active one underlined + bolded", () => {
    const { container } = render(<SubTabs items={tabs} />);
    const buttons = container.querySelectorAll<HTMLButtonElement>("button");
    expect(buttons.length).toBe(4);
    expect(buttons[0]!.getAttribute("aria-selected")).toBe("true");
    expect(buttons[0]!.style.borderBottomWidth).toBe("2px");
    expect(buttons[0]!.style.borderColor).toBe(rgb(BLUEPRINT_LIGHT.ink));
    expect(buttons[0]!.style.fontWeight).toBe("600");
    expect(buttons[1]!.getAttribute("aria-selected")).toBe("false");
    // Inactive tab has transparent border, same width to avoid layout shift.
    expect(buttons[1]!.style.borderBottomWidth).toBe("2px");
    expect(buttons[1]!.style.borderColor).toBe("transparent");
  });

  it("counts render as mono digits", () => {
    const { container } = render(<SubTabs items={tabs} />);
    expect(container.textContent).toMatch(/Models\s*12/);
    expect(container.textContent).toMatch(/Fleet\s*32/);
  });

  it("onTabClick fires with the clicked tab", () => {
    const onTabClick = vi.fn();
    const { container } = render(<SubTabs items={tabs} onTabClick={onTabClick} />);
    fireEvent.click(container.querySelectorAll<HTMLButtonElement>("button")[2]!);
    expect(onTabClick).toHaveBeenCalledWith(expect.objectContaining({ id: "fleet" }));
  });

  it("warns when more than 4 tabs are supplied", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const five: SubTab[] = [...tabs, { id: "extra", label: "Extra" }];
    render(<SubTabs items={five} />);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});

// ----------------------------------------------------------------------------
// Surface + SurfaceFramed
// ----------------------------------------------------------------------------

describe("Surface", () => {
  it("composes TopBar + SubTabs + body content", () => {
    const { getByText, container } = render(
      <Surface
        title="Live router"
        sub="01 · Router · Live"
        tabs={[
          { id: "live", label: "Live", active: true },
          { id: "models", label: "Models", count: 12 },
        ]}
      >
        <div>HERO</div>
      </Surface>,
    );
    expect(getByText("Live router")).toBeTruthy();
    expect(getByText("HERO")).toBeTruthy();
    expect(container.querySelectorAll('button[role="tab"]').length).toBe(2);
  });

  it("default 28px body padding", () => {
    const { container } = render(
      <Surface title="x">
        <div>body</div>
      </Surface>,
    );
    // The body div is the 3rd direct child (TopBar, ?SubTabs, body)
    const section = container.querySelector("section")!;
    const body = section.lastElementChild as HTMLElement;
    expect(body.style.padding).toBe("28px");
  });
});

describe("SurfaceFramed", () => {
  it("wraps Surface in a Frame and mounts RailV2", () => {
    const { container, getByText } = render(
      <SurfaceFramed active="router" title="Live router">
        <div>HERO</div>
      </SurfaceFramed>,
    );
    // The frame title bar uses the path syntax.
    expect(getByText("/router")).toBeTruthy();
    expect(container.querySelector('nav[aria-label="Primary"]')).toBeTruthy();
  });
});
