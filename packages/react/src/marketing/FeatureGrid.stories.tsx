import type { Meta, StoryObj } from "@storybook/react";
import { FeatureGrid } from "./FeatureGrid.js";

const meta: Meta<typeof FeatureGrid> = {
  title: "Marketing/FeatureGrid",
  component: FeatureGrid,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof FeatureGrid>;

const SAMPLE_FEATURES = [
  {
    id: 1,
    icon: "cost",
    title: "Cost Visibility",
    description:
      "See exactly which models and API keys are driving spend — broken down by team, environment, and request type.",
    link: "/features/cost",
    linkText: "Explore cost tracking",
  },
  {
    id: 2,
    icon: "ml",
    title: "Model Intelligence",
    description:
      "Automatic routing suggestions based on **latency**, quality, and cost trade-offs across 40+ hosted models.",
  },
  {
    id: 3,
    icon: "shield",
    title: "Guardrails",
    description:
      "Budget caps, rate limits, and PII redaction that apply before a token hits the wire.",
  },
  {
    id: 4,
    icon: "throughput",
    title: "Throughput Monitoring",
    description:
      "Real-time p50/p95/p99 latency per model, with anomaly alerts and historical comparison.",
  },
  {
    id: 5,
    icon: "ledger",
    title: "Audit Trail",
    description:
      "Immutable per-request log for compliance — who called what, when, with what prompt hash.",
  },
  {
    id: 6,
    icon: "route",
    title: "Smart Routing",
    description:
      "Rule-based and ML-backed routing across providers. Failover in < 50 ms.",
  },
];

export const Default: Story = {
  args: {
    title: "Everything you need to control AI costs",
    subtitle:
      "Acme gives platform teams a single pane for visibility, guardrails, and optimization across every service provider.",
    columns: 3,
    features: SAMPLE_FEATURES,
  },
};

export const TwoColumn: Story = {
  args: {
    title: "Key capabilities",
    columns: 2,
    features: SAMPLE_FEATURES.slice(0, 4),
  },
};

export const WithLinks: Story = {
  args: {
    title: "Platform features",
    columns: 3,
    features: SAMPLE_FEATURES.map((f) => ({
      ...f,
      link: `/features/${f.id}`,
      linkText: "Learn more",
    })),
  },
};
