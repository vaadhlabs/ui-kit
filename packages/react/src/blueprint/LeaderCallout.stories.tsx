import type { Meta, StoryObj } from "@storybook/react";
import { LeaderCallout } from "./LeaderCallout.js";

const meta: Meta<typeof LeaderCallout> = {
  title: "Blueprint/LeaderCallout",
  component: LeaderCallout,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof LeaderCallout>;

export const Default: Story = {
  args: {
    n: 1,
    title: "The frontier is the product",
    body: "Every model is plotted by realised cost and judge-evaluated quality. Only the top-left rectangle is allowed to receive routed traffic.",
  },
};

export const Right: Story = {
  args: {
    n: 2,
    direction: "right",
    title: "Quality is continuous",
    body: "A 1% judge sample runs against every routed call. Drift > 0.5pp re-opens the policy.",
  },
};

export const Stack: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 320 }}>
      {[
        { n: 1, title: "The frontier is the product", body: "Every model is plotted by realised cost and judge-evaluated quality." },
        { n: 2, title: "Quality is continuous", body: "A 1% judge sample runs against every routed call." },
        { n: 3, title: "Edits feel like physics", body: "Drag the floor up — fewer models qualify. The buyer sees the trade in real-time." },
      ].map((c) => (
        <LeaderCallout key={c.n} n={c.n} title={c.title} body={c.body} w="100%" />
      ))}
    </div>
  ),
};
