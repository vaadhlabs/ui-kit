import type { Meta, StoryObj } from "@storybook/react";
import { Surface, SurfaceFramed } from "./Surface.js";
import { Btn } from "./Btn.js";
import { Tag } from "./Tag.js";
import { Body, Eyebrow, H1, Num } from "./Text.js";

const meta: Meta = {
  title: "Blueprint/Surface",
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

const heroBody = (
  <div>
    <Eyebrow>Last 30 days · vs no-routing baseline</Eyebrow>
    <div style={{ marginTop: 10, display: "flex", alignItems: "baseline", gap: 14 }}>
      <Num size={88}>$8,420</Num>
      <Num size={24}>+ 31%</Num>
    </div>
    <Body style={{ marginTop: 14, maxWidth: 540 }}>
      The router moved <strong>410 decisions</strong> out of <strong>1,240 eligible</strong>.
      Quality drifted -0.4 pp (below floor). Latency p95 added 28 ms.
    </Body>
  </div>
);

export const Shell: Story = {
  render: () => (
    <div style={{ display: "flex", height: 800, border: "1px solid #0a0a0a" }}>
      <div style={{ width: 8, background: "#fbfaf6" }} />
      <Surface
        title="Live router"
        sub="01 · Router · Live"
        status={
          <>
            <Tag variant="good">enforcement on</Tag>
            <Tag variant="accent">★ Bet 1.1</Tag>
          </>
        }
        actions={
          <>
            <Btn>Pause router</Btn>
            <Btn variant="inked">Tune policies →</Btn>
          </>
        }
        tabs={[
          { id: "live", label: "Live", active: true },
          { id: "models", label: "Models", count: 12 },
          { id: "fleet", label: "Fleet", count: 32 },
          { id: "eval", label: "Eval", count: 5 },
        ]}
      >
        {heroBody}
      </Surface>
    </div>
  ),
};

export const Framed: Story = {
  render: () => (
    <SurfaceFramed
      active="router"
      frame={{ h: 800 }}
      rail={{ tenant: "Acme AI", environment: "prod · eu-west-1", versionLabel: "v2026.6 · prod" }}
      title="Live router"
      sub="01 · Router · Live"
      tabs={[
        { id: "live", label: "Live", active: true },
        { id: "models", label: "Models", count: 12 },
      ]}
    >
      {heroBody}
    </SurfaceFramed>
  ),
};

export const Thesis: Story = {
  render: () => (
    <SurfaceFramed active="router" frame={{ h: 600 }} title="Thesis" tabs={undefined}>
      <H1 size={88}>
        Tensor Cost is the{" "}
        <span style={{ background: "#FF4814", color: "#fff", padding: "0 12px" }}>router product.</span>
      </H1>
    </SurfaceFramed>
  ),
};
