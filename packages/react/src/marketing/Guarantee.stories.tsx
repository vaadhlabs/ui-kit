import type { Meta, StoryObj } from "@storybook/react";
import { Guarantee } from "./Guarantee.js";

const meta: Meta<typeof Guarantee> = {
  title: "Marketing/Guarantee",
  component: Guarantee,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Guarantee>;

export const Default: Story = {
  args: {
    badge: "30-Day Money-Back Guarantee",
    title: "Risk-free pilot",
    body: "If TensorCost doesn't find at least 15% wasted AI spend in your first 30 days, we'll refund your subscription in full. No questions asked.",
  },
};

export const TitleOnly: Story = {
  args: {
    title: "Enterprise SLA included on all plans",
    badge: "Guarantee",
  },
};
