import type { Meta, StoryObj } from "@storybook/react";
import { MarketingCTABanner } from "./MarketingCTABanner.js";

const meta: Meta<typeof MarketingCTABanner> = {
  title: "Marketing/MarketingCTABanner",
  component: MarketingCTABanner,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof MarketingCTABanner>;

export const Default: Story = {
  args: {
    title: "Start saving time and money today",
    subtitle: "No credit card required. 5-minute setup.",
    button: { text: "Get started free", link: "/signup" },
  },
};

export const Gradient: Story = {
  args: {
    title: "Save up to 50% on your operational costs",
    subtitle: "Acme automates the work that shouldn't need a human in the loop.",
    button: { text: "Start free trial", link: "/signup", style: "secondary" },
    gradientFrom: "#6366F1",
    gradientTo: "#0EA5E9",
  },
};

export const LeftAligned: Story = {
  args: {
    title: "Ready to get started?",
    subtitle: "Join 500+ engineering teams already saving.",
    button: { text: "Book a demo", link: "/demo", style: "outline" },
    backgroundColor: "#1e293b",
    alignment: "left",
  },
};
