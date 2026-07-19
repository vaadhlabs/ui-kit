import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import {
  B,
  Body,
  Box,
  Btn,
  Callout,
  Eye,
  Eyebrow,
  H1,
  H2,
  H3,
  Mono,
  Num,
  Tag,
  defaultInkForRole,
} from "../index.js";
import { BLUEPRINT_DARK, BLUEPRINT_LIGHT } from "@tensorcost/tokens";

// jsdom normalizes `#RRGGBB` inline-styles to `rgb(r, g, b)` strings.
// Converting hex tokens to rgb at assertion time keeps the spec readable
// and decoupled from the serializer's choice.
function rgb(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

// ----------------------------------------------------------------------------
// Text primitives
// ----------------------------------------------------------------------------

describe("Eyebrow / Eye", () => {
  it("renders uppercase mono kicker", () => {
    const { container } = render(<Eyebrow>section · 01</Eyebrow>);
    const el = container.querySelector("span")!;
    expect(el.textContent).toBe("section · 01");
    expect(el.style.textTransform).toBe("uppercase");
    expect(el.style.fontFamily.toLowerCase()).toContain("plex mono");
  });

  it("Eye is an alias for Eyebrow", () => {
    expect(Eye).toBe(Eyebrow);
  });

  it("passes through HTML attrs (data-*, aria-*) — regression for the 2026-07-19 silent-drop bug", () => {
    const { container } = render(<Eyebrow data-testid="eb" aria-label="kicker">x</Eyebrow>);
    const el = container.querySelector("span")!;
    expect(el.getAttribute("data-testid")).toBe("eb");
    expect(el.getAttribute("aria-label")).toBe("kicker");
  });
});

describe("Headings", () => {
  it("H1 renders <h1> with display font, weight 500", () => {
    const { container } = render(<H1>router · live</H1>);
    const el = container.querySelector("h1")!;
    expect(el.textContent).toBe("router · live");
    expect(el.style.fontFamily.toLowerCase()).toContain("inter tight");
    expect(el.style.fontWeight).toBe("500");
    expect(el.style.fontSize).toBe("3.5rem");
  });

  it("H2 renders <h2>", () => {
    const { container } = render(<H2>section</H2>);
    expect(container.querySelector("h2")).toBeTruthy();
  });

  it("H3 renders <h3>", () => {
    const { container } = render(<H3>card</H3>);
    expect(container.querySelector("h3")).toBeTruthy();
  });

  it("size prop overrides default — number becomes px", () => {
    const { container } = render(<H1 size={88}>thesis</H1>);
    expect(container.querySelector("h1")!.style.fontSize).toBe("88px");
  });

  it("size prop accepts a string passthrough (rem)", () => {
    // jsdom rejects unknown CSS functions (clamp/min/max) by silently
    // emptying the value. Plain length units pass through fine — that's
    // enough to prove the prop isn't number-only.
    const { container } = render(<H1 size="5.5rem">thesis</H1>);
    expect(container.querySelector("h1")!.style.fontSize).toBe("5.5rem");
  });

  it("passes through HTML attrs on H1/H2/H3 — regression for the 2026-07-19 silent-drop bug", () => {
    const { container: c1 } = render(<H1 data-testid="h1-hero">x</H1>);
    expect(c1.querySelector("h1")!.getAttribute("data-testid")).toBe("h1-hero");
    const { container: c2 } = render(<H2 data-testid="h2-section">x</H2>);
    expect(c2.querySelector("h2")!.getAttribute("data-testid")).toBe("h2-section");
    const { container: c3 } = render(<H3 data-testid="h3-card">x</H3>);
    expect(c3.querySelector("h3")!.getAttribute("data-testid")).toBe("h3-card");
  });
});

describe("Body / B", () => {
  it("Body renders Inter body prose", () => {
    const { container } = render(<Body>routing intervention available</Body>);
    const el = container.querySelector("div")!;
    expect(el.textContent).toContain("routing intervention");
    expect(el.style.fontFamily.toLowerCase()).toMatch(/\binter\b/);
  });

  it("B is an alias for Body", () => {
    expect(B).toBe(Body);
  });

  it("passes through HTML attrs — regression for the 2026-07-19 silent-drop bug", () => {
    const { container } = render(<Body data-testid="body-prose">x</Body>);
    expect(container.querySelector("div")!.getAttribute("data-testid")).toBe("body-prose");
  });
});

describe("Mono", () => {
  it("renders IBM Plex Mono", () => {
    const { container } = render(<Mono>0.82</Mono>);
    const el = container.querySelector("span")!;
    expect(el.style.fontFamily.toLowerCase()).toContain("plex mono");
    // jsdom doesn't reliably expose fontFeatureSettings via the CSSOM
    // typed attrs, but the inline style attr always carries it.
    expect((el.getAttribute("style") ?? "").toLowerCase()).toContain("font-feature-settings");
  });

  // Regression test for the 2026-07-19 bug: Mono silently dropped
  // data-testid (and any other unknown prop) with no warning and no type
  // error, forcing shell pages to wrap it in an extra <div data-testid=...>
  // just to make it findable in tests (see TeamScorecardPage.tsx).
  it("passes through data-testid and other HTML attrs onto the rendered span", () => {
    const { container } = render(
      <Mono data-testid="team-scorecard-basis" aria-label="basis line" onClick={() => {}}>
        Day 3 of 7
      </Mono>,
    );
    const el = container.querySelector("span")!;
    expect(el.getAttribute("data-testid")).toBe("team-scorecard-basis");
    expect(el.getAttribute("aria-label")).toBe("basis line");
  });
});

describe("Num", () => {
  it("renders mono with tabular-nums for digit alignment", () => {
    const { container } = render(<Num>$8,420</Num>);
    const el = container.querySelector("span")!;
    expect(el.style.fontFamily.toLowerCase()).toContain("plex mono");
    expect(el.style.fontVariantNumeric).toBe("tabular-nums");
  });

  it("default size is the hero default", () => {
    const { container } = render(<Num>24.4</Num>);
    expect(container.querySelector("span")!.style.fontSize).toBe("2rem");
  });

  it("passes through HTML attrs — regression for the 2026-07-19 silent-drop bug", () => {
    const { container } = render(<Num data-testid="hero-figure">$8,420</Num>);
    expect(container.querySelector("span")!.getAttribute("data-testid")).toBe("hero-figure");
  });
});

describe("defaultInkForRole", () => {
  it("display → ink, body → ink2, label → ink3 on light palette", () => {
    expect(defaultInkForRole("display")).toBe(BLUEPRINT_LIGHT.ink);
    expect(defaultInkForRole("body")).toBe(BLUEPRINT_LIGHT.ink2);
    expect(defaultInkForRole("label")).toBe(BLUEPRINT_LIGHT.ink3);
  });
  it("respects the supplied palette (dark)", () => {
    expect(defaultInkForRole("display", BLUEPRINT_DARK)).toBe(BLUEPRINT_DARK.ink);
    expect(defaultInkForRole("body", BLUEPRINT_DARK)).toBe(BLUEPRINT_DARK.ink2);
  });
});

// ----------------------------------------------------------------------------
// Box
// ----------------------------------------------------------------------------

describe("Box", () => {
  it("solid variant uses paper bg + 1px ink border", () => {
    const { container } = render(<Box>content</Box>);
    const el = container.querySelector("div")!;
    expect(el.style.background).toBe(rgb(BLUEPRINT_LIGHT.paper));
    expect(el.style.border).toBe(`1px solid ${rgb(BLUEPRINT_LIGHT.ink)}`);
  });

  it("accent variant uses accentBg + accent border", () => {
    const { container } = render(<Box variant="accent">bet</Box>);
    const el = container.querySelector("div")!;
    expect(el.style.background).toBe(rgb(BLUEPRINT_LIGHT.accentBg));
    expect(el.style.border).toBe(`1px solid ${rgb(BLUEPRINT_LIGHT.accent)}`);
  });

  it("ghost variant uses dashed faint border", () => {
    const { container } = render(<Box variant="ghost">placeholder</Box>);
    const el = container.querySelector("div")!;
    expect(el.style.border).toBe(`1px dashed ${rgb(BLUEPRINT_LIGHT.faint)}`);
  });

  it("passes through HTML attrs (data-*, aria-*)", () => {
    const { container } = render(<Box data-testid="surface" aria-label="card" />);
    const el = container.querySelector("div")!;
    expect(el.getAttribute("data-testid")).toBe("surface");
    expect(el.getAttribute("aria-label")).toBe("card");
  });

  it("respects w / h / p props", () => {
    const { container } = render(<Box w={240} h={120} p={20} />);
    const el = container.querySelector("div")!;
    expect(el.style.width).toBe("240px");
    expect(el.style.height).toBe("120px");
    expect(el.style.padding).toBe("20px");
  });
});

// ----------------------------------------------------------------------------
// Tag
// ----------------------------------------------------------------------------

describe("Tag", () => {
  it("default variant — ink2 text, ink3 border, transparent fill", () => {
    const { container } = render(<Tag>live</Tag>);
    const el = container.querySelector("span")!;
    expect(el.style.color).toBe(rgb(BLUEPRINT_LIGHT.ink2));
    expect(el.style.border).toBe(`1px solid ${rgb(BLUEPRINT_LIGHT.ink3)}`);
    expect(el.style.background).toBe("transparent");
  });

  it("accent variant — accent + accentBg", () => {
    const { container } = render(<Tag variant="accent">★ bet</Tag>);
    const el = container.querySelector("span")!;
    expect(el.style.color).toBe(rgb(BLUEPRINT_LIGHT.accent));
    expect(el.style.background).toBe(rgb(BLUEPRINT_LIGHT.accentBg));
  });

  it("inked variant — inverted", () => {
    const { container } = render(<Tag variant="inked">routed</Tag>);
    const el = container.querySelector("span")!;
    expect(el.style.color).toBe(rgb(BLUEPRINT_LIGHT.paper));
    expect(el.style.background).toBe(rgb(BLUEPRINT_LIGHT.ink));
  });

  it("good / warn / red status variants render their tones", () => {
    const cases: Array<["good" | "warn" | "red", string]> = [
      ["good", BLUEPRINT_LIGHT.good],
      ["warn", BLUEPRINT_LIGHT.warn],
      ["red", BLUEPRINT_LIGHT.danger],
    ];
    for (const [variant, tone] of cases) {
      const { container } = render(<Tag variant={variant}>x</Tag>);
      expect(container.querySelector("span")!.style.color).toBe(rgb(tone));
    }
  });

  it("renders uppercase mono with 9px font and wide tracking", () => {
    const { container } = render(<Tag>chip</Tag>);
    const el = container.querySelector("span")!;
    expect(el.style.textTransform).toBe("uppercase");
    expect(el.style.fontSize).toBe("9px");
    expect(el.style.letterSpacing).toBe("0.1em");
  });
});

// ----------------------------------------------------------------------------
// Btn
// ----------------------------------------------------------------------------

describe("Btn", () => {
  it("renders a real <button type='button'>", () => {
    const { container } = render(<Btn>Pause router</Btn>);
    const btn = container.querySelector("button")!;
    expect(btn).toBeTruthy();
    expect(btn.getAttribute("type")).toBe("button");
    expect(btn.textContent).toBe("Pause router");
  });

  it("inked variant inverts foreground", () => {
    const { container } = render(<Btn variant="inked">Tune policies</Btn>);
    const el = container.querySelector("button")!;
    expect(el.style.background).toBe(rgb(BLUEPRINT_LIGHT.ink));
    expect(el.style.color).toBe(rgb(BLUEPRINT_LIGHT.paper));
  });

  it("accent variant uses accent bg + white text", () => {
    const { container } = render(<Btn variant="accent">View intervention →</Btn>);
    const el = container.querySelector("button")!;
    expect(el.style.background).toBe(rgb(BLUEPRINT_LIGHT.accent));
    expect(el.style.color).toBe("rgb(255, 255, 255)");
  });

  it("size sm renders smaller padding + font", () => {
    const { container } = render(<Btn size="sm">x</Btn>);
    const el = container.querySelector("button")!;
    expect(el.style.fontSize).toBe("11px");
    expect(el.style.padding).toBe("4px 10px");
  });

  it("disabled state dims + cursor not-allowed", () => {
    const { container } = render(<Btn disabled>x</Btn>);
    const btn = container.querySelector("button")!;
    expect(btn.hasAttribute("disabled")).toBe(true);
    expect(btn.style.cursor).toBe("not-allowed");
    expect(btn.style.opacity).toBe("0.55");
  });

  it("forwards onClick", () => {
    let clicked = false;
    const { container } = render(
      <Btn onClick={() => { clicked = true; }}>x</Btn>,
    );
    container.querySelector("button")!.click();
    expect(clicked).toBe(true);
  });
});

// ----------------------------------------------------------------------------
// Callout
// ----------------------------------------------------------------------------

describe("Callout", () => {
  it("renders a circular brand-gradient chip with the number", () => {
    const { container } = render(<Callout n={2} />);
    const el = container.querySelector("span")!;
    expect(el.textContent).toBe("2");
    expect(el.style.borderRadius).toBe("50%");
    expect(el.style.background).toContain("linear-gradient");
  });

  it("size prop scales font proportionally", () => {
    const { container } = render(<Callout n={1} size={32} />);
    const el = container.querySelector("span")!;
    expect(el.style.width).toBe("32px");
    // 32 * 0.55 = 17.6
    expect(el.style.fontSize).toBe("17.6px");
  });

  it("passes through HTML attrs — regression for the 2026-07-19 silent-drop bug", () => {
    const { container } = render(<Callout n={3} data-testid="leader-chip" />);
    expect(container.querySelector("span")!.getAttribute("data-testid")).toBe("leader-chip");
  });
});
