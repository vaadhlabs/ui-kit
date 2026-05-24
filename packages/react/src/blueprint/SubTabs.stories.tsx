import type { Meta, StoryObj } from "@storybook/react";
import { SubTabs } from "./SubTabs.js";

const meta: Meta<typeof SubTabs> = {
  title: "Blueprint/SubTabs",
  component: SubTabs,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof SubTabs>;

export const FourTabs: Story = {
  args: {
    items: [
      { id: "live", label: "Live", active: true },
      { id: "models", label: "Models", count: 12 },
      { id: "fleet", label: "Fleet", count: 32 },
      { id: "eval", label: "Eval", count: 5 },
    ],
  },
};

export const TwoTabs: Story = {
  args: {
    items: [
      { id: "library", label: "Library", count: 14 },
      { id: "editor", label: "Editor", active: true },
    ],
  },
};
