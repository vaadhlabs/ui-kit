import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "./Box.js";
import { B, Eyebrow } from "./Text.js";

const meta: Meta<typeof Box> = {
  title: "Blueprint/Box",
  component: Box,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Box>;

export const Solid: Story = {
  args: { variant: "solid", w: 280, children: "solid · default chrome" },
};

export const Soft: Story = {
  args: { variant: "soft", w: 280, children: "soft · in-card nested" },
};

export const Accent: Story = {
  args: { variant: "accent", w: 280, children: "accent · the bet" },
};

export const Inked: Story = {
  args: { variant: "inked", w: 280, children: "inked · inverted block" },
};

export const Ghost: Story = {
  args: { variant: "ghost", w: 280, children: "ghost · drop zone" },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, maxWidth: 900 }}>
      {(["solid", "soft", "accent", "inked", "ghost"] as const).map((v) => (
        <Box key={v} variant={v} p={20}>
          <Eyebrow>{v}</Eyebrow>
          <B style={{ marginTop: 8 }}>The {v} variant.</B>
        </Box>
      ))}
    </div>
  ),
};
