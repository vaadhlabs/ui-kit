import type { Meta, StoryObj } from "@storybook/react";
import { VideoEmbed } from "./VideoEmbed.js";

const meta: Meta<typeof VideoEmbed> = {
  title: "Marketing/VideoEmbed",
  component: VideoEmbed,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof VideoEmbed>;

export const YouTubeWithPoster: Story = {
  args: {
    title: "See Acme in action",
    description: "A 90-second product demo — setup, core workflow, and reporting.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    videoType: "youtube",
    posterImage: "https://placehold.co/1280x720/4f46e5/ffffff?text=Click+to+play",
    aspectRatio: "16:9",
  },
};

export const VimeoEmbed: Story = {
  args: {
    title: "Vimeo demo",
    videoUrl: "https://vimeo.com/123456789",
    videoType: "vimeo",
    aspectRatio: "16:9",
  },
};

export const NoPoster: Story = {
  name: "YouTube — no poster",
  args: {
    title: "No poster image",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    videoType: "youtube",
  },
};
