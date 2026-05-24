import type { Meta, StoryObj } from "@storybook/react";
import { FAQAccordion } from "./FAQAccordion.js";

const meta: Meta<typeof FAQAccordion> = {
  title: "Marketing/FAQAccordion",
  component: FAQAccordion,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof FAQAccordion>;

const ITEMS = [
  {
    id: 1,
    question: "How does TensorCost route my API calls?",
    answer: "<p>TensorCost intercepts each call and evaluates the prompt against your configured latency and quality SLA. It then routes to the cheapest model that satisfies both constraints.</p>",
  },
  {
    id: 2,
    question: "Which LLM providers are supported?",
    answer: "<p>OpenAI, Anthropic, Mistral, Cohere, and any OpenAI-compatible endpoint. More providers are added monthly.</p>",
  },
  {
    id: 3,
    question: "How is my data kept private?",
    answer: "<p>TensorCost processes metadata (token count, model, latency) — never the content of your prompts or completions. All metadata is encrypted in transit and at rest.</p>",
  },
  {
    id: 4,
    question: "Can I override routing for specific endpoints?",
    answer: "<p>Yes. You can pin any endpoint to a specific model or provider via routing rules in the dashboard.</p>",
  },
];

export const Default: Story = {
  args: {
    title: "Frequently asked questions",
    subtitle: "Still have questions? Email us at support@tensorcost.com.",
    items: ITEMS,
  },
};

export const MultipleOpen: Story = {
  args: {
    title: "FAQ — multiple open",
    items: ITEMS,
    allowMultipleOpen: true,
    backgroundColor: "#f8fafc",
  },
};
