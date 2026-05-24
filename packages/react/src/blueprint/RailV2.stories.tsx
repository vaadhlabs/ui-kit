import type { Meta, StoryObj } from "@storybook/react";
import { RailV2 } from "./RailV2.js";

const meta: Meta<typeof RailV2> = {
  title: "Blueprint/RailV2",
  component: RailV2,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof RailV2>;

const story = (active: "router" | "money" | "policy" | "build" | "trust"): Story => ({
  args: {
    active,
    tenant: "Acme AI",
    environment: "prod · eu-west-1",
    versionLabel: "v2026.6 · prod",
  },
  render: (args) => (
    <div style={{ display: "flex", height: 600, border: "1px solid #0a0a0a" }}>
      <RailV2 {...args} />
      <div style={{ flex: 1, padding: 32, background: "#fbfaf6" }}>
        active = {active}
      </div>
    </div>
  ),
});

export const Router = story("router");
export const Money = story("money");
export const Policy = story("policy");
export const Build = story("build");
export const Trust = story("trust");

export const WithoutTenantChip: Story = {
  args: { active: "router" },
  render: (args) => (
    <div style={{ display: "flex", height: 600, border: "1px solid #0a0a0a" }}>
      <RailV2 {...args} />
      <div style={{ flex: 1, padding: 32, background: "#fbfaf6" }}>
        No tenant chip shown when the prop is omitted.
      </div>
    </div>
  ),
};
