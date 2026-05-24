import type { Meta, StoryObj } from "@storybook/react";
import { Table } from "./Table.js";
import { Tag } from "./Tag.js";

const meta: Meta<typeof Table> = {
  title: "Blueprint/Table",
  component: Table,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Table>;

export const DecisionFeed: Story = {
  args: {
    cols: [
      { key: "t", label: "T", mono: true, w: "60px" },
      { key: "from", label: "From", mono: true },
      { key: "to", label: "To", mono: true },
      { key: "out", label: "Outcome", w: "140px" },
      { key: "qd", label: "QΔ", mono: true, w: "80px", align: "right" },
      { key: "sav", label: "Save", mono: true, w: "90px", align: "right" },
    ],
    rows: [
      { t: "0s", from: "gpt-4-turbo", to: "claude-sonnet-4.5", out: <Tag variant="accent">routed</Tag>, qd: "+0.02", sav: "$0.041" },
      { t: "0s", from: "gpt-4-turbo", to: "—", out: <Tag variant="good">pass·safe</Tag>, qd: "—", sav: "—" },
      { t: "1s", from: "claude-opus", to: "—", out: <Tag variant="red">blocked</Tag>, qd: "—", sav: "policy" },
      { t: "1s", from: "llama-3.1-70b", to: "llama-3.1-8b", out: <Tag variant="accent">routed</Tag>, qd: "−0.01", sav: "$0.008" },
      { t: "2s", from: "gpt-4", to: "cache", out: <Tag variant="good">cache hit</Tag>, qd: "n/a", sav: "$0.012" },
    ],
  },
};

export const ModelEval: Story = {
  args: {
    cols: [
      { key: "m", label: "Model", mono: true, w: "2fr" },
      { key: "s", label: "Score", mono: true, w: "1fr", align: "right" },
      { key: "d", label: "vs prev", mono: true, w: "1fr", align: "right" },
      { key: "v", label: "Verdict", w: "1fr" },
    ],
    rows: [
      { m: "gpt-4-turbo", s: "0.91", d: "+0.02", v: <Tag variant="good">accept</Tag> },
      { m: "claude-sonnet-4.5", s: "0.89", d: "+0.04", v: <Tag variant="good">accept</Tag> },
      { m: "claude-opus", s: "0.94", d: "+0.01", v: <Tag variant="warn">cost</Tag> },
      { m: "phi-3-mini", s: "0.61", d: "+0.00", v: <Tag variant="red">below floor</Tag> },
    ],
  },
};
