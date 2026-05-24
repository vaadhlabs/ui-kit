/**
 * blueprint.stories.tsx — visual reference for the v2 token vocabulary.
 *
 * The architectural-drawing palette + type ramp + spacing grid + stroke
 * styles. Use this story to confirm the warm vellum + signal-orange
 * identity renders correctly before consuming primitives in surface
 * builds.
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  BLUEPRINT_DARK,
  BLUEPRINT_FAMILIES,
  BLUEPRINT_LIGHT,
  BLUEPRINT_SPACING,
  BLUEPRINT_TYPE,
  strokeFor,
} from "./blueprint.js";

function PaletteCard({
  palette,
  name,
}: {
  palette: typeof BLUEPRINT_LIGHT;
  name: string;
}) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h3 style={{ fontSize: 13, fontFamily: BLUEPRINT_FAMILIES.mono, color: palette.ink2, marginBottom: 8 }}>
        {name}
      </h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {Object.entries(palette).map(([key, val]) => (
          <div key={key} style={{ display: "flex", flexDirection: "column", gap: 4, width: 96 }}>
            <div
              style={{
                width: 96,
                height: 56,
                background: val,
                border: `1px solid ${palette.ink}`,
              }}
            />
            <span style={{ fontFamily: BLUEPRINT_FAMILIES.mono, fontSize: 10, color: palette.ink2 }}>
              {key}
            </span>
            <span style={{ fontFamily: BLUEPRINT_FAMILIES.mono, fontSize: 9, color: palette.ink3 }}>
              {val}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TypeRamp() {
  return (
    <div style={{ background: BLUEPRINT_LIGHT.paper, padding: 32 }}>
      <h1
        style={{
          fontFamily: BLUEPRINT_FAMILIES.display,
          fontSize: BLUEPRINT_TYPE.h1.fontSize,
          fontWeight: BLUEPRINT_TYPE.h1.fontWeight,
          lineHeight: BLUEPRINT_TYPE.h1.lineHeight,
          letterSpacing: BLUEPRINT_TYPE.h1.letterSpacing,
          margin: "0 0 16px 0",
          color: BLUEPRINT_LIGHT.ink,
        }}
      >
        H1 · the router product
      </h1>
      <h2
        style={{
          fontFamily: BLUEPRINT_FAMILIES.display,
          fontSize: BLUEPRINT_TYPE.h2.fontSize,
          fontWeight: BLUEPRINT_TYPE.h2.fontWeight,
          lineHeight: BLUEPRINT_TYPE.h2.lineHeight,
          letterSpacing: BLUEPRINT_TYPE.h2.letterSpacing,
          margin: "0 0 12px 0",
          color: BLUEPRINT_LIGHT.ink,
        }}
      >
        H2 · section header
      </h2>
      <h3
        style={{
          fontFamily: BLUEPRINT_FAMILIES.display,
          fontSize: BLUEPRINT_TYPE.h3.fontSize,
          fontWeight: BLUEPRINT_TYPE.h3.fontWeight,
          lineHeight: BLUEPRINT_TYPE.h3.lineHeight,
          letterSpacing: BLUEPRINT_TYPE.h3.letterSpacing,
          margin: "0 0 12px 0",
          color: BLUEPRINT_LIGHT.ink,
        }}
      >
        H3 · sub-section
      </h3>
      <p
        style={{
          fontFamily: BLUEPRINT_FAMILIES.body,
          fontSize: BLUEPRINT_TYPE.body.fontSize,
          lineHeight: BLUEPRINT_TYPE.body.lineHeight,
          color: BLUEPRINT_LIGHT.ink2,
          margin: "0 0 12px 0",
          maxWidth: 560,
        }}
      >
        Body — the default prose primitive. Inter 13px, line-height 1.45.
        Reads at comfortable density without crowding.
      </p>
      <p style={{ fontFamily: BLUEPRINT_FAMILIES.mono, fontSize: BLUEPRINT_TYPE.mono.fontSize, color: BLUEPRINT_LIGHT.ink2 }}>
        Mono — IBM Plex Mono 11px · 0.821 · 240 · g4dn-prod-12
      </p>
      <p style={{ fontFamily: BLUEPRINT_FAMILIES.mono, fontSize: BLUEPRINT_TYPE.num.fontSize, color: BLUEPRINT_LIGHT.ink, fontWeight: 500 }}>
        $8,420
      </p>
      <span style={{
        fontFamily: BLUEPRINT_TYPE.eyebrow.fontFamily,
        fontSize: BLUEPRINT_TYPE.eyebrow.fontSize,
        fontWeight: BLUEPRINT_TYPE.eyebrow.fontWeight,
        letterSpacing: BLUEPRINT_TYPE.eyebrow.letterSpacing,
        textTransform: BLUEPRINT_TYPE.eyebrow.textTransform,
        color: BLUEPRINT_LIGHT.ink3,
      }}>
        Eyebrow · 10px uppercase mono kicker
      </span>
    </div>
  );
}

function SpacingScale() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {Object.entries(BLUEPRINT_SPACING).map(([key, val]) => {
        if (key === "n") return null;
        return (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: BLUEPRINT_FAMILIES.mono, fontSize: 11 }}>
            <span style={{ width: 40, color: BLUEPRINT_LIGHT.ink3 }}>{key}</span>
            <div style={{ height: 8, width: val as string, background: BLUEPRINT_LIGHT.ink }} />
            <span style={{ color: BLUEPRINT_LIGHT.ink2 }}>{val as string}</span>
          </div>
        );
      })}
    </div>
  );
}

function StrokeStyles() {
  const s = strokeFor(BLUEPRINT_LIGHT);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {Object.entries(s).map(([key, val]) => (
        <div key={key}>
          <div style={{ fontFamily: BLUEPRINT_FAMILIES.mono, fontSize: 10, color: BLUEPRINT_LIGHT.ink3, marginBottom: 6 }}>
            {key} · {val}
          </div>
          <div style={{ width: 200, height: 1, border: val, borderWidth: "1px 0 0 0" }} />
        </div>
      ))}
    </div>
  );
}

function BlueprintOverview() {
  return (
    <div style={{ padding: 32, background: BLUEPRINT_LIGHT.paper, color: BLUEPRINT_LIGHT.ink, fontFamily: BLUEPRINT_FAMILIES.body }}>
      <h2 style={{ fontFamily: BLUEPRINT_FAMILIES.display, fontSize: 28, fontWeight: 500, margin: "0 0 24px 0" }}>
        Blueprint tokens
      </h2>
      <section style={{ marginBottom: 36 }}>
        <h3 style={{ fontFamily: BLUEPRINT_FAMILIES.display, fontSize: 20, fontWeight: 500, margin: "0 0 12px 0" }}>
          Palette
        </h3>
        <PaletteCard palette={BLUEPRINT_LIGHT} name="BLUEPRINT_LIGHT" />
        <PaletteCard palette={BLUEPRINT_DARK} name="BLUEPRINT_DARK (post-GA stub)" />
      </section>
      <section style={{ marginBottom: 36 }}>
        <h3 style={{ fontFamily: BLUEPRINT_FAMILIES.display, fontSize: 20, fontWeight: 500, margin: "0 0 12px 0" }}>
          Type ramp
        </h3>
        <TypeRamp />
      </section>
      <section style={{ marginBottom: 36 }}>
        <h3 style={{ fontFamily: BLUEPRINT_FAMILIES.display, fontSize: 20, fontWeight: 500, margin: "0 0 12px 0" }}>
          Spacing scale (8-px grid)
        </h3>
        <SpacingScale />
      </section>
      <section>
        <h3 style={{ fontFamily: BLUEPRINT_FAMILIES.display, fontSize: 20, fontWeight: 500, margin: "0 0 12px 0" }}>
          Stroke styles
        </h3>
        <StrokeStyles />
      </section>
    </div>
  );
}

const meta: Meta<typeof BlueprintOverview> = {
  title: "Foundation/Blueprint",
  component: BlueprintOverview,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof BlueprintOverview>;

export const Overview: Story = {};
