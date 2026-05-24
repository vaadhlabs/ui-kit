import type { Meta, StoryObj } from "@storybook/react";
import { B, Body, Eyebrow, H1, H2, H3, Mono, Num } from "./index.js";

const meta: Meta = {
  title: "Blueprint/Text",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj;

export const Ramp: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 720 }}>
      <Eyebrow>Eyebrow · 10px uppercase mono kicker</Eyebrow>
      <H1>H1 · Router-first IA</H1>
      <H2>H2 · Section header</H2>
      <H3>H3 · Sub-section title</H3>
      <Body>
        Body — the default prose primitive. Inter 13px, line-height 1.45. Used for
        descriptions, captions, paragraph bodies on hero pages.
      </Body>
      <Mono>Mono · IBM Plex Mono 11px · 0.821 · 240 · g4dn-prod-12</Mono>
      <Num>$8,420</Num>
    </div>
  ),
};

export const HeroRamp: Story = {
  render: () => (
    <div>
      <Eyebrow>Last 30 days · vs no-routing baseline</Eyebrow>
      <div style={{ marginTop: 10, display: "flex", alignItems: "baseline", gap: 14 }}>
        <Num size={120}>$8,420</Num>
        <Num size={28}>+ 31%</Num>
      </div>
    </div>
  ),
};

export const AliasParity: Story = {
  render: () => (
    <div>
      <B>B is Body</B>
      <Body>Body is Body</Body>
    </div>
  ),
};
