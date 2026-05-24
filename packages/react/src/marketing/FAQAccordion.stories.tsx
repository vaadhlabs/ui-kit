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
    question: "How does Acme integrate with my existing tools?",
    answer: "<p>Acme connects via OAuth or API key to the services you already use. Setup takes about five minutes and requires no changes to your existing code or infrastructure.</p>",
  },
  {
    id: 2,
    question: "Which plans include team collaboration features?",
    answer: "<p>All paid plans support unlimited team members, shared workspaces, and role-based access. The free tier is limited to a single user.</p>",
  },
  {
    id: 3,
    question: "How is my data kept private?",
    answer: "<p>Acme processes only the metadata needed to run your workflows — never the raw content of your files or messages. All data is encrypted in transit and at rest.</p>",
  },
  {
    id: 4,
    question: "Can I cancel at any time?",
    answer: "<p>Yes. You can cancel your subscription from the billing settings page. Your data is available for export for 30 days after cancellation.</p>",
  },
  {
    id: 5,
    question: "Is there an on-premise or self-hosted option?",
    answer: "<p>Self-hosted deployments are available on the Enterprise plan. Contact us for a scoping call.</p>",
  },
];

export const Default: Story = {
  args: {
    title: "Frequently asked questions",
    subtitle: "Still have questions? Email us at support@example.com.",
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
