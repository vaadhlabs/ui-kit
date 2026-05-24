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
    quote: "Acme reduced our monthly spend by 40% in the first two weeks. The audit trail gives our finance team exactly the visibility they were asking for.",
    authorName: "Sarah Chen",
    authorTitle: "VP Engineering",
    authorCompany: "Luminary AI",
    rating: 5,
  },
  {
    id: 2,
    quote: "We were paying for work that didn't need a premium service. Acme figured that out automatically and rerouted it.",
    authorName: "Marcus Webb",
    authorTitle: "CTO",
    authorCompany: "Nexus Data",
    rating: 5,
  },
  {
    id: 3,
    quote: "Integration took 15 minutes. We just changed one environment variable.",
    authorName: "Priya Nair",
    authorTitle: "Lead Engineer",
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
