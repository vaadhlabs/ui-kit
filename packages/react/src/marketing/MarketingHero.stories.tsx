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
    eyebrow: "Workflow automation",
    title: "Stop doing the boring parts manually",
    subtitle: "Acme automates the repetitive work so your team can focus on what actually matters.",
    cta: { text: "Get started free", link: "#", style: "primary" },
    secondaryCta: { text: "Read the docs", link: "#", style: "outline" },
    trustLine: "No credit card required · 5-minute setup",
    variant: "gradient",
  },
};

export const Dark: Story = {
  args: {
    eyebrow: "For engineering teams",
    title: "Full audit trail. Zero vendor lock-in.",
    subtitle: "Every action is logged and attributable.",
    cta: { text: "Start free trial", link: "#" },
    variant: "dark",
  },
};

export const Light: Story = {
  args: {
    title: "The fastest way to ship reliable software",
    subtitle: "Works with GitHub, GitLab, Bitbucket, and self-hosted repos.",
    cta: { text: "Get started", link: "#" },
    variant: "light",
    alignment: "left",
    minHeight: "60vh",
  },
};
