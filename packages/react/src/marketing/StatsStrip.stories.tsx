import type { Meta, StoryObj } from "@storybook/react";
import { StatsStrip } from "./StatsStrip.js";

const meta: Meta<typeof StatsStrip> = {
  title: "Marketing/StatsStrip",
  component: StatsStrip,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof StatsStrip>;

const STATS = [
  { value: "40", suffix: "%", label: "avg cost reduction" },
  { value: "$4M", label: "saved across pilots" },
  { value: "200", suffix: "ms", label: "median routing latency" },
  { value: "99.9", suffix: "%", label: "uptime SLA" },
];

export const Light: Story = {
  args: {
    title: "By the numbers",
    stats: STATS,
    variant: "light",
  },
};

export const Dark: Story = {
  args: {
    title: "Platform at scale",
    subtitle: "Real numbers from production deployments",
    stats: STATS,
    variant: "dark",
  },
};
