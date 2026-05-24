import type { Meta, StoryObj } from "@storybook/react";
import { ImageGallery } from "./ImageGallery.js";

const meta: Meta<typeof ImageGallery> = {
  title: "Marketing/ImageGallery",
  component: ImageGallery,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof ImageGallery>;

const PLACEHOLDER_IMAGES = [
  { url: "https://placehold.co/800x600/6366f1/ffffff?text=Screenshot+1", alt: "Dashboard overview" },
  { url: "https://placehold.co/800x600/4f46e5/ffffff?text=Screenshot+2", alt: "Cost breakdown" },
  { url: "https://placehold.co/800x600/7c3aed/ffffff?text=Screenshot+3", alt: "Routing rules" },
  { url: "https://placehold.co/800x600/2563eb/ffffff?text=Screenshot+4", alt: "Model comparison" },
  { url: "https://placehold.co/800x600/0891b2/ffffff?text=Screenshot+5", alt: "Audit log" },
  { url: "https://placehold.co/800x600/059669/ffffff?text=Screenshot+6", alt: "Reports" },
];

export const ThreeColumn: Story = {
  args: {
    title: "Product screenshots",
    images: PLACEHOLDER_IMAGES,
    columns: 3,
    aspectRatio: "landscape",
  },
};

export const TwoColumn: Story = {
  args: {
    images: PLACEHOLDER_IMAGES.slice(0, 4),
    columns: 2,
    aspectRatio: "landscape",
  },
};

export const NoLightbox: Story = {
  args: {
    title: "Gallery (no lightbox)",
    images: PLACEHOLDER_IMAGES,
    columns: 3,
    enableLightbox: false,
    aspectRatio: "square",
  },
};
