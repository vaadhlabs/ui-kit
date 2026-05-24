import type { Meta, StoryObj } from "@storybook/react";
import { Plot } from "./Plot.js";

const meta: Meta<typeof Plot> = {
  title: "Blueprint/Plot",
  component: Plot,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Plot>;

export const Line: Story = {
  args: { kind: "line", w: 360, h: 140, label: "actual vs forecast", sub: "30d · USD" },
};

export const Area: Story = {
  args: { kind: "area", w: 360, h: 140, label: "Saved · 30d" },
};

export const Bars: Story = {
  args: { kind: "bars", w: 360, h: 140, label: "Daily decisions" },
};

export const Spark: Story = {
  args: { kind: "spark", w: 220, h: 60, label: "Adoption" },
};

export const Step: Story = {
  args: { kind: "step", w: 360, h: 140, label: "Forecast vs budget" },
};

export const AllKinds: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24, maxWidth: 800 }}>
      <Plot kind="line" w="100%" h={140} label="line · actual vs forecast" />
      <Plot kind="area" w="100%" h={140} label="area" />
      <Plot kind="bars" w="100%" h={140} label="bars · last column accent" />
      <Plot kind="step" w="100%" h={140} label="step" />
      <Plot kind="spark" w="100%" h={60} label="spark" />
    </div>
  ),
};
