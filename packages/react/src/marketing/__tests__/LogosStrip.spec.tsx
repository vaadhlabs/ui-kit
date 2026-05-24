import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { LogosStrip } from "../LogosStrip.js";

const logos = [
  { name: "Stripe" },
  { name: "Anthropic", outline: true },
  { name: "OpenAI", image: "https://example.com/openai.png", alt: "OpenAI" },
];

describe("LogosStrip", () => {
  it("renders without crashing with no props", () => {
    const { container } = render(<LogosStrip />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders eyebrow title and subtitle", () => {
    render(<LogosStrip title="Trusted by" subtitle="Teams worldwide" logos={[]} />);
    expect(screen.getByText("Trusted by")).toBeInTheDocument();
    expect(screen.getByText("Teams worldwide")).toBeInTheDocument();
  });

  it("renders text logos", () => {
    render(<LogosStrip logos={[{ name: "Stripe" }, { name: "Cohere" }]} />);
    expect(screen.getByText("Stripe")).toBeInTheDocument();
    expect(screen.getByText("Cohere")).toBeInTheDocument();
  });

  it("renders an img for image logos", () => {
    render(
      <LogosStrip
        logos={[{ name: "OpenAI", image: "https://example.com/openai.png", alt: "OpenAI" }]}
      />,
    );
    const img = screen.getByRole("img", { name: "OpenAI" });
    expect(img).toHaveAttribute("src", "https://example.com/openai.png");
  });

  it("wraps image logo in an anchor when website is set", () => {
    render(
      <LogosStrip
        logos={[
          {
            name: "Stripe",
            image: "https://example.com/stripe.png",
            website: "https://stripe.com",
          },
        ]}
      />,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://stripe.com");
  });

  it("renders all three logo types from mixed list", () => {
    render(<LogosStrip logos={logos} />);
    expect(screen.getByText("Stripe")).toBeInTheDocument();
    expect(screen.getByText("Anthropic")).toBeInTheDocument();
    const img = screen.getByRole("img", { name: "OpenAI" });
    expect(img).toBeInTheDocument();
  });
});
