import type { Meta, StoryObj } from "@storybook/react";
import { ComparisonTable } from "./ComparisonTable.js";

const meta: Meta<typeof ComparisonTable> = {
  title: "Marketing/ComparisonTable",
  component: ComparisonTable,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof ComparisonTable>;

const ROWS = [
  {
    left: "Manually export CSVs from each provider dashboard",
    right: "Unified real-time cost view across all providers",
  },
  {
    left: "Discover overspend weeks later in the invoice",
    right: "Budget alerts fire before the cap is hit",
  },
  {
    left: "No visibility into which team or project is responsible",
    right: "Per-team, per-environment cost attribution out of the box",
  },
  {
    left: "Model choice based on gut feel",
    right: "Automated routing recommendations based on cost + quality",
  },
  {
    left: "No audit trail for compliance",
    right: "Immutable per-request log with prompt hash",
  },
];

export const Default: Story = {
  args: {
    title: "Before and after Acme",
    subtitle: "A two-week pilot typically surfaces 20–40% of unnecessary spend.",
    leftLabel: "Without Acme",
    rightLabel: "With Acme",
    rows: ROWS,
  },
};

export const NoHeader: Story = {
  args: {
    leftLabel: "Legacy approach",
    rightLabel: "Modern approach",
    rows: ROWS.slice(0, 3),
  },
};
