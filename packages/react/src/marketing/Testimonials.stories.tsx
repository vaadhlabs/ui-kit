import type { Meta, StoryObj } from "@storybook/react";
import { Testimonials } from "./Testimonials.js";

const meta: Meta<typeof Testimonials> = {
  title: "Marketing/Testimonials",
  component: Testimonials,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Testimonials>;

const ITEMS = [
  {
    id: 1,
    quote: "TensorCost cut our monthly inference bill by 52% in the first week. The SHA-256 ledger gives our CFO exactly the audit trail they needed.",
    authorName: "Sarah Chen",
    authorTitle: "VP Engineering",
    authorCompany: "Luminary AI",
    rating: 5,
  },
  {
    id: 2,
    quote: "We were spending $40k/month on GPT-4 calls that didn't need GPT-4. TensorCost figured that out automatically.",
    authorName: "Marcus Webb",
    authorTitle: "CTO",
    authorCompany: "Nexus Data",
    rating: 5,
  },
  {
    id: 3,
    quote: "Integration took 15 minutes. We just changed one environment variable.",
    authorName: "Priya Nair",
    authorTitle: "Lead ML Engineer",
    authorCompany: "Orbit Labs",
    rating: 4,
  },
];

export const Carousel: Story = {
  args: {
    title: "Trusted by engineering teams",
    subtitle: "Real results from real customers.",
    items: ITEMS,
    displayMode: "carousel",
  },
};

export const Grid: Story = {
  args: {
    title: "What our customers say",
    items: ITEMS,
    displayMode: "grid",
    backgroundColor: "#ffffff",
  },
};
