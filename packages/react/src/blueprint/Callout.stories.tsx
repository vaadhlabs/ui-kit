import type { Meta, StoryObj } from "@storybook/react";
import { Callout } from "./Callout.js";

const meta: Meta<typeof Callout> = {
  title: "Blueprint/Callout",
  component: Callout,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Callout>;

export const Default: Story = { args: { n: 1 } };

export const Larger: Story = { args: { n: 2, size: 32 } };

export const Row: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Callout key={n} n={n} />
      ))}
    </div>
  ),
};
