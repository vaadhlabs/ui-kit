import type { Meta, StoryObj } from "@storybook/react";
import { Tag } from "./Tag.js";

const meta: Meta<typeof Tag> = {
  title: "Blueprint/Tag",
  component: Tag,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = { args: { children: "live" } };
export const Accent: Story = { args: { variant: "accent", children: "★ bet 1.1" } };
export const Inked: Story = { args: { variant: "inked", children: "routed" } };
export const Good: Story = { args: { variant: "good", children: "pass · safe" } };
export const Warn: Story = { args: { variant: "warn", children: "fallback" } };
export const Red: Story = { args: { variant: "red", children: "blocked" } };

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <Tag>default</Tag>
      <Tag variant="accent">accent</Tag>
      <Tag variant="inked">inked</Tag>
      <Tag variant="good">good</Tag>
      <Tag variant="warn">warn</Tag>
      <Tag variant="red">red</Tag>
    </div>
  ),
};
