import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ImageGallery } from "../ImageGallery.js";

const images = [
  { url: "https://example.com/img1.png", alt: "Screenshot 1" },
  { url: "https://example.com/img2.png", alt: "Screenshot 2" },
  { url: "https://example.com/img3.png", alt: "Screenshot 3" },
];

describe("ImageGallery", () => {
  it("renders without crashing with no props", () => {
    const { container } = render(<ImageGallery />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders the section title", () => {
    render(<ImageGallery title="Product screenshots" images={images} />);
    expect(screen.getByText("Product screenshots")).toBeInTheDocument();
  });

  it("renders all image thumbnails", () => {
    render(<ImageGallery images={images} />);
    const imgs = screen.getAllByRole("img");
    expect(imgs).toHaveLength(images.length);
  });

  it("uses alt text for each image", () => {
    render(<ImageGallery images={images} />);
    expect(screen.getByAltText("Screenshot 1")).toBeInTheDocument();
    expect(screen.getByAltText("Screenshot 2")).toBeInTheDocument();
  });

  it("renders with Strapi data-wrapper shape", () => {
    const strapiImages = {
      data: [
        { attributes: { url: "https://example.com/s1.png", alternativeText: "Strapi img 1" } },
        { attributes: { url: "https://example.com/s2.png", alternativeText: "Strapi img 2" } },
      ],
    };
    render(<ImageGallery images={strapiImages} />);
    const imgs = screen.getAllByRole("img");
    expect(imgs).toHaveLength(2);
  });

  it("renders empty gallery when images is empty array", () => {
    render(<ImageGallery images={[]} />);
    expect(screen.queryByRole("img")).toBeNull();
  });
});
