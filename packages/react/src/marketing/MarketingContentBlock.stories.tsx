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
Acme automates the boring parts of your workflow so your team can focus on what actually matters —
**without changing a line of your existing code**.

### How it works

1. Install the SDK.
2. Point your integration at \`api.example.com\`.
3. Automation begins immediately.

See [the docs](https://example.com/docs) for a full integration walkthrough.
`;

export const Default: Story = {
  args: {
    eyebrow: "How it works",
    title: "Automation that works the way your team already does",
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
    title: "Every action is auditable",
    content: "We publish a tamper-evident log of every operation so you can verify independently.",
    backgroundColor: "#0b1220",
    textColor: "#e2e8f0",
    alignment: "center",
  },
};
