import type { Meta, StoryObj } from "@storybook/react";
import { Dim } from "./Dim.js";

const meta: Meta<typeof Dim> = {
  title: "Blueprint/Dim",
  component: Dim,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Dim>;

export const Default: Story = { args: { w: 280, label: "240 px · sidebar width" } };

export const Wide: Story = { args: { w: 480, label: "1180 px · canvas" } };
