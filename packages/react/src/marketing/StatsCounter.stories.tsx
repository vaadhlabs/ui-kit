import type { Meta, StoryObj } from "@storybook/react";
import { StatsCounter } from "./StatsCounter.js";

const meta: Meta<typeof StatsCounter> = {
  title: "Marketing/StatsCounter",
  component: StatsCounter,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof StatsCounter>;

const STATS = [
  { id: 1, icon: "cost", prefix: "$", value: "4000000", suffix: "+", label: "Saved across pilots" },
  { id: 2, icon: "throughput", value: "40", suffix: "%", label: "Avg cost reduction" },
  { id: 3, icon: "ml", value: "200", suffix: "ms", label: "Median routing latency" },
  { id: 4, icon: "shield", value: "99", suffix: "%", label: "Uptime SLA" },
];

export const Default: Story = {
  args: {
    title: "Proven at scale",
    subtitle: "Numbers from production deployments.",
    stats: STATS,
    animateOnScroll: false,
  },
};

export const Gradient: Story = {
  args: {
    title: "Platform impact",
    stats: STATS,
    gradientFrom: "#6366f1",
    gradientTo: "#4f46e5",
    animateOnScroll: false,
  },
};

export const AnimateOnScroll: Story = {
  name: "Animate on scroll (live)",
  args: {
    title: "Scroll to animate",
    stats: STATS,
    animateOnScroll: true,
  },
};
