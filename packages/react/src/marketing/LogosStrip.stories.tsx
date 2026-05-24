import type { Meta, StoryObj } from "@storybook/react";
import { LogosStrip } from "./LogosStrip.js";

const meta: Meta<typeof LogosStrip> = {
  title: "Marketing/LogosStrip",
  component: LogosStrip,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof LogosStrip>;

const TEXT_LOGOS = [
  { name: "Stripe" },
  { name: "Anthropic" },
  { name: "OpenAI" },
  { name: "Cohere" },
  { name: "Mistral" },
];

const OUTLINE_LOGOS = [
  { name: "Your Logo", outline: true },
  { name: "Your Logo", outline: true },
  { name: "Your Logo", outline: true },
];

export const TextLogos: Story = {
  args: {
    title: "Trusted by teams using",
    logos: TEXT_LOGOS,
  },
};

export const MutedVariant: Story = {
  args: {
    title: "Works with every provider",
    subtitle: "Drop-in proxy — no code changes needed",
    logos: TEXT_LOGOS,
    variant: "muted",
  },
};

export const OutlinePlaceholders: Story = {
  args: {
    title: "Could be your logo here",
    logos: OUTLINE_LOGOS,
    variant: "muted",
  },
};
