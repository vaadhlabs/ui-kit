import type { Meta, StoryObj } from "@storybook/react";
import { MarketingContentBlock } from "./MarketingContentBlock.js";

const meta: Meta<typeof MarketingContentBlock> = {
  title: "Marketing/MarketingContentBlock",
  component: MarketingContentBlock,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof MarketingContentBlock>;

const BODY = `
TensorCost intercepts every LLM API call and routes it to the cheapest model that
meets your latency and quality SLA — **without changing a line of your code**.

### How it works

1. Install the proxy SDK.
2. Replace your OpenAI base URL with \`api.tensorcost.com\`.
3. Savings begin immediately.

See [the docs](https://tensorcost.com/docs) for a full integration walkthrough.
`;

export const Default: Story = {
  args: {
    eyebrow: "How it works",
    title: "Automatic model routing that saves you money",
    content: BODY,
  },
};

export const Centered: Story = {
  args: {
    eyebrow: "Our approach",
    title: "Built for engineering teams",
    content: "Drop-in integration. No vendor lock-in. Full audit trail.",
    alignment: "center",
    maxWidth: "small",
  },
};

export const DarkBackground: Story = {
  args: {
    eyebrow: "Transparency",
    title: "Every saving is on-chain",
    content: "We publish a SHA-256 hash of every ledger entry so you can verify independently.",
    backgroundColor: "#0b1220",
    textColor: "#e2e8f0",
    alignment: "center",
  },
};
