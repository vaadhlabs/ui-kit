import type { Meta, StoryObj } from "@storybook/react";
import { PilotFindings } from "./PilotFindings.js";

const meta: Meta<typeof PilotFindings> = {
  title: "Marketing/PilotFindings",
  component: PilotFindings,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof PilotFindings>;

const FINDINGS = [
  {
    range: "20–40%",
    label: "reduction in LLM API costs",
    note: "From routing to cheaper models on requests where quality difference is below the threshold.",
  },
  {
    range: "$10k–$50k",
    label: "unattributed spend found",
    note: "Team-level attribution exposes shadow AI usage invisible to the finance team.",
  },
  {
    range: "3–8×",
    label: "faster cost anomaly detection",
    note: "Real-time alerts vs. waiting for the monthly invoice to surface overruns.",
  },
];

export const Default: Story = {
  args: {
    title: "What a two-week pilot typically finds",
    subtitle: "Based on data from 40+ production pilots in 2025.",
    findings: FINDINGS,
    footnote: "Results vary by organisation size and AI usage maturity.",
    cta: { text: "Start a free pilot", link: "/pilot" },
  },
};

export const NoCTA: Story = {
  args: {
    title: "Pilot results",
    findings: FINDINGS,
  },
};
