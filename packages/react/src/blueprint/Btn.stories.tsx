import type { Meta, StoryObj } from "@storybook/react";
import { Btn } from "./Btn.js";

const meta: Meta<typeof Btn> = {
  title: "Blueprint/Btn",
  component: Btn,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Btn>;

export const Default: Story = { args: { children: "Pause router" } };
export const Inked: Story = { args: { variant: "inked", children: "Tune policies →" } };
export const Accent: Story = { args: { variant: "accent", children: "View intervention →" } };
export const Ghost: Story = { args: { variant: "ghost", children: "edit ›" } };
export const Small: Story = { args: { size: "sm", children: "filter" } };
export const Disabled: Story = { args: { disabled: true, children: "Run" } };

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <Btn>default</Btn>
      <Btn variant="inked">inked</Btn>
      <Btn variant="accent">accent</Btn>
      <Btn variant="ghost">ghost</Btn>
      <Btn size="sm">sm</Btn>
      <Btn disabled>disabled</Btn>
    </div>
  ),
};
