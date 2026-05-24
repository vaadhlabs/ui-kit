import type { Meta, StoryObj } from "@storybook/react";
import { StatLine } from "./StatLine.js";

const meta: Meta<typeof StatLine> = {
  title: "Blueprint/StatLine",
  component: StatLine,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof StatLine>;

export const RouterLive: Story = {
  args: {
    items: [
      { label: "Decisions / sec", value: "24.4", delta: "peak 64.2 today" },
      { label: "Saved · today", value: "$342", delta: "at this rate · $124k/yr" },
      { label: "Active fallbacks", value: "1", delta: "vertex · half-open", deltaKind: "warn" },
      { label: "Quality drift", value: "−0.4", unit: "pp", delta: "below floor", deltaKind: "red" },
    ],
  },
};

export const ThreeStats: Story = {
  args: {
    items: [
      { label: "Connected", value: "3", unit: "accounts", delta: "+ 1 this month", deltaKind: "good" },
      { label: "Last sync", value: "12", unit: "min ago" },
      { label: "Anomalies", value: "0", delta: "30d", deltaKind: "good" },
    ],
  },
};
