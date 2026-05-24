import type { Meta, StoryObj } from "@storybook/react";
import { Timeline } from "./Timeline.js";

const meta: Meta<typeof Timeline> = {
  title: "Marketing/Timeline",
  component: Timeline,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Timeline>;

const ITEMS = [
  {
    id: 1,
    date: "Day 1",
    title: "Install the SDK",
    description: "<p>Run <code>npm install @tensorcost/sdk</code> and swap your base URL.</p>",
    icon: "Code",
  },
  {
    id: 2,
    date: "Day 2",
    title: "Configure your SLA",
    description: "<p>Set your latency and quality thresholds in the dashboard. TensorCost uses them to route each call.</p>",
    icon: "Settings",
  },
  {
    id: 3,
    date: "Week 1",
    title: "See your savings",
    description: "<p>The savings ledger updates in real time. Your CFO can export the SHA-256-verified audit trail at any time.</p>",
    icon: "forecast",
  },
  {
    id: 4,
    date: "Month 1",
    title: "Verify independently",
    description: "<p>Run <code>sha256sum savings-ledger.csv</code> and compare against our published hash.</p>",
    icon: "ledger",
  },
];

export const Default: Story = {
  args: {
    title: "How it works",
    items: ITEMS,
  },
};

export const CustomAccentColor: Story = {
  args: {
    title: "Getting started",
    items: ITEMS,
    accentColor: "#10B981",
    backgroundColor: "#f8fafc",
  },
};
