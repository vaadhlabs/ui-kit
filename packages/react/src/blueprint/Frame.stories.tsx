import type { Meta, StoryObj } from "@storybook/react";
import { Frame } from "./Frame.js";
import { Body, Eyebrow, H2 } from "./Text.js";

const meta: Meta<typeof Frame> = {
  title: "Blueprint/Frame",
  component: Frame,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Frame>;

export const Desktop: Story = {
  args: {
    title: "/router · live",
    sub: "01 · Router · Live",
    h: 600,
  },
  render: (args) => (
    <Frame {...args}>
      <div style={{ padding: 32 }}>
        <Eyebrow>Last 30 days</Eyebrow>
        <H2 style={{ marginTop: 6 }}>Live router</H2>
        <Body style={{ marginTop: 12 }}>
          Hairline drawn-screen window. The title-bar path reads as an architectural label;
          the three squares in the top right are a visual nod to a screen capture.
        </Body>
      </div>
    </Frame>
  ),
};

export const Mobile: Story = {
  args: { title: "/router", mobile: true, h: 500 },
  render: (args) => (
    <Frame {...args}>
      <div style={{ padding: 16 }}>
        <Eyebrow>Mobile · 380px</Eyebrow>
        <H2 size={20} style={{ marginTop: 6 }}>Live router</H2>
      </div>
    </Frame>
  ),
};
