import type { Meta, StoryObj } from "@storybook/react";
import { TopBar } from "./TopBar.js";
import { Btn } from "./Btn.js";
import { Tag } from "./Tag.js";

const meta: Meta<typeof TopBar> = {
  title: "Blueprint/TopBar",
  component: TopBar,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof TopBar>;

export const Default: Story = {
  args: {
    title: "Live router",
    sub: "01 · Router · Live",
  },
};

export const WithStatus: Story = {
  args: {
    title: "Live router",
    sub: "01 · Router · Live",
    status: (
      <>
        <Tag variant="good">enforcement on</Tag>
        <Tag>dry-run off</Tag>
        <Tag variant="accent">★ Bet 1.1</Tag>
      </>
    ),
  },
};

export const Full: Story = {
  args: {
    title: "Live router",
    sub: "01 · Router · Live",
    status: (
      <>
        <Tag variant="good">enforcement on</Tag>
        <Tag variant="accent">★ Bet 1.1</Tag>
      </>
    ),
    actions: (
      <>
        <Btn>Pause router</Btn>
        <Btn variant="inked">Tune policies →</Btn>
      </>
    ),
  },
};
