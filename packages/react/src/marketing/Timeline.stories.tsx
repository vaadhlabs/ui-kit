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
    description: "<p>Run <code>npm install @acme/sdk</code> and point it at your environment.</p>",
    icon: "Code",
  },
  {
    id: 2,
    date: "Day 2",
    title: "Configure your rules",
    description: "<p>Set your thresholds and preferences in the dashboard. Acme applies them automatically to every action.</p>",
    icon: "Settings",
  },
  {
    id: 3,
    date: "Week 1",
    title: "Review your results",
    description: "<p>The activity log updates in real time. Export the full audit trail whenever you need it.</p>",
    icon: "forecast",
  },
  {
    id: 4,
    date: "Month 1",
    title: "Verify independently",
    description: "<p>Run <code>sha256sum activity-report.csv</code> and compare against our published hash.</p>",
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
