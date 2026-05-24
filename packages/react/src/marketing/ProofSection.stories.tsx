import type { Meta, StoryObj } from "@storybook/react";
import { ProofSection } from "./ProofSection.js";

const meta: Meta<typeof ProofSection> = {
  title: "Marketing/ProofSection",
  component: ProofSection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof ProofSection>;

export const Default: Story = {
  args: {
    title: "Verify it yourself.",
    body: "Every audit report is published as a SHA-256 hash of the underlying data export. Run the command on the left to confirm our numbers match yours.\n\nSee [the verification guide](https://example.com/proof) for a full walkthrough.",
    ctaText: "Read the guide",
    ctaLink: "https://example.com/proof",
    command: "$ sha256sum audit-report.csv",
    output: "a3f2c9b88e1d4f6a9c0b5d8e72f1a4b6c8d9e0f12  audit-report.csv",
  },
};

export const Stacked: Story = {
  args: {
    title: "Zero trust required.",
    body: "We publish every audit hash publicly. Check it yourself.",
    variant: "stacked",
    ctaText: "View public audit log",
    ctaLink: "https://example.com/audit",
  },
};

export const TerminalOnly: Story = {
  args: {
    title: "Run the check.",
    command: "$ sha256sum invoice-2026-05.csv",
    output: "d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3  invoice-2026-05.csv",
  },
};
