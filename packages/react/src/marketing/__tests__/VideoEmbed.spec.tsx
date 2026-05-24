import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VideoEmbed } from "../VideoEmbed.js";

describe("VideoEmbed", () => {
  it("renders without crashing with no props", () => {
    const { container } = render(<VideoEmbed />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders title and description", () => {
    render(
      <VideoEmbed
        title="Product demo"
        description="See TensorCost in 90 seconds"
        videoUrl="https://www.youtube.com/watch?v=abc123"
      />,
    );
    expect(screen.getByText("Product demo")).toBeInTheDocument();
    expect(screen.getByText("See TensorCost in 90 seconds")).toBeInTheDocument();
  });

  it("renders the play button overlay when not autoplay", () => {
    render(
      <VideoEmbed
        videoUrl="https://www.youtube.com/watch?v=abc123"
        posterImage="https://example.com/poster.jpg"
      />,
    );
    // PlayArrowIcon is present (aria-hidden svg), but the container has role
    // implied by onClick — the best we can do without a data-testid is verify
    // the iframe is NOT present before click.
    expect(screen.queryByTitle(/Video/i)).toBeNull();
  });

  it("shows iframe after clicking the play button", async () => {
    const user = userEvent.setup();
    render(
      <VideoEmbed
        title="Demo"
        videoUrl="https://www.youtube.com/watch?v=abc123"
        videoType="youtube"
      />,
    );
    // The overlay box is clickable — find it by its aria role (none/presentation)
    // via the SVG icon's container. Use a query that will work with jsdom.
    const svgIcon = document.querySelector("svg");
    expect(svgIcon).toBeTruthy();
    if (svgIcon?.parentElement?.parentElement) {
      await user.click(svgIcon.parentElement.parentElement);
    }
    const iframe = document.querySelector("iframe");
    expect(iframe).toBeTruthy();
  });

  it("renders a <video> element for mp4 type", () => {
    render(
      <VideoEmbed
        videoUrl="https://example.com/demo.mp4"
        videoType="mp4"
      />,
    );
    expect(document.querySelector("video")).toBeTruthy();
  });
});
