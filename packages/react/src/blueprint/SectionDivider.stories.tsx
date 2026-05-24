import type { Meta, StoryObj } from "@storybook/react";
import { SectionDivider } from "./SectionDivider.js";

const meta: Meta<typeof SectionDivider> = {
  title: "Blueprint/SectionDivider",
  component: SectionDivider,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof SectionDivider>;

export const Thesis: Story = {
  args: {
    no: "01",
    kicker: "Thesis · v2",
    title: "Tensor Cost is the router product.",
    body: "Not a FinOps tool with routing bolted on. The other surfaces exist to make the router safe, accountable, and adoptable.",
  },
};

export const Migration: Story = {
  args: {
    no: "08",
    kicker: "Migration · how we ship this from today",
    title: "The future is a rewrite. The plan is a strangler fig.",
    body: "Module federation already lets us run 16 MFs side by side. Each surface graduates from hosting old MFs to fully rewritten on its own track.",
  },
};
