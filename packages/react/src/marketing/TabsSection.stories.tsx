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
    content: `## How savings work\n\nTensorCost intercepts every API call and picks the cheapest model that meets your SLA.\n\n- **No code changes** — just swap the base URL.\n- Savings verified via on-chain ledger.`,
  },
  {
    label: "Integration",
    icon: "Code",
    content: `## Quick start\n\n\`\`\`bash\nnpm install @tensorcost/sdk\n\`\`\`\n\nThen replace \`openai.baseURL\` with \`api.tensorcost.com/v1\`.`,
  },
  {
    label: "Reporting",
    icon: "cfo",
    content: `## CFO dashboard\n\nEvery routing decision is logged with the cost delta, model used, and a SHA-256 hash of the response.`,
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
