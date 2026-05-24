import type { Meta, StoryObj } from "@storybook/react";
import { TabsSection } from "./TabsSection.js";

const meta: Meta<typeof TabsSection> = {
  title: "Marketing/TabsSection",
  component: TabsSection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof TabsSection>;

const TABS = [
  {
    label: "Overview",
    icon: "LineChart",
    content: `## How it works\n\nAcme automates your workflow and routes each task to the right service at the lowest cost.\n\n- **No code changes** — just point at the proxy endpoint.\n- Every action is logged with a tamper-evident audit trail.`,
  },
  {
    label: "Integration",
    icon: "Code",
    content: `## Quick start\n\n\`\`\`bash\nnpm install @acme/sdk\n\`\`\`\n\nThen replace your service base URL with \`api.example.com/v1\`.`,
  },
  {
    label: "Reporting",
    icon: "cfo",
    content: `## Reporting dashboard\n\nEvery action is logged with a timestamp, cost delta, and a SHA-256 hash for independent verification.`,
  },
];

export const Default: Story = {
  args: {
    title: "Everything you need",
    tabs: TABS,
    tabStyle: "underline",
  },
};

export const Pills: Story = {
  args: {
    title: "Feature tabs",
    tabs: TABS,
    tabStyle: "pills",
    backgroundColor: "#f8fafc",
  },
};

export const Boxed: Story = {
  args: {
    title: "Boxed tabs",
    tabs: TABS,
    tabStyle: "boxed",
  },
};
