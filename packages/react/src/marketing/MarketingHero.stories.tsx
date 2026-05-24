import type { Meta, StoryObj } from "@storybook/react";
import { MarketingHero } from "./MarketingHero.js";

const meta: Meta<typeof MarketingHero> = {
  title: "Marketing/MarketingHero",
  component: MarketingHero,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof MarketingHero>;

export const Gradient: Story = {
  args: {
    eyebrow: "Intelligent model routing",
    title: "Stop overpaying for LLM inference",
    subtitle: "TensorCost routes every API call to the cheapest model that meets your SLA — automatically.",
    cta: { text: "Get started free", link: "#", style: "primary" },
    secondaryCta: { text: "Read the docs", link: "#", style: "outline" },
    trustLine: "No credit card required · 5-minute integration",
    variant: "gradient",
  },
};

export const Dark: Story = {
  args: {
    eyebrow: "For engineering teams",
    title: "Full audit trail. Zero vendor lock-in.",
    subtitle: "Every routing decision is logged and hashed.",
    cta: { text: "Start saving", link: "#" },
    variant: "dark",
  },
};

export const Light: Story = {
  args: {
    title: "The fastest way to cut LLM costs",
    subtitle: "Works with OpenAI, Anthropic, Mistral, and self-hosted models.",
    cta: { text: "Get started", link: "#" },
    variant: "light",
    alignment: "left",
    minHeight: "60vh",
  },
};
