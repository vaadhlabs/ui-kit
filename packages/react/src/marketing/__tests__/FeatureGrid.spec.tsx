import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeatureGrid } from "../FeatureGrid.js";

const features = [
  {
    id: 1,
    icon: "cost",
    title: "Cost Visibility",
    description: "See your spend.",
  },
  {
    id: 2,
    icon: "ml",
    title: "Model Intelligence",
    description: "Smart routing.",
  },
];

describe("FeatureGrid", () => {
  it("renders without crashing with no props", () => {
    const { container } = render(<FeatureGrid />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders section title and subtitle", () => {
    render(
      <FeatureGrid
        title="All features"
        subtitle="Everything included."
        features={features}
      />,
    );
    expect(screen.getByText("All features")).toBeInTheDocument();
    expect(screen.getByText("Everything included.")).toBeInTheDocument();
  });

  it("renders feature card titles", () => {
    render(<FeatureGrid features={features} />);
    expect(screen.getByText("Cost Visibility")).toBeInTheDocument();
    expect(screen.getByText("Model Intelligence")).toBeInTheDocument();
  });

  it("renders a CTA link when provided", () => {
    render(
      <FeatureGrid
        features={[
          {
            id: 1,
            title: "Routing",
            link: "/routing",
            linkText: "Explore routing",
          },
        ]}
      />,
    );
    const link = screen.getByRole("link", { name: /explore routing/i });
    expect(link).toHaveAttribute("href", "/routing");
  });

  it("renders no feature cards when features array is empty", () => {
    render(<FeatureGrid title="Empty" features={[]} />);
    expect(screen.queryByRole("link")).toBeNull();
  });
});
