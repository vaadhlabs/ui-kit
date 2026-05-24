import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeShellProvider } from "../../ThemeShellProvider.js";
import { Testimonials } from "../Testimonials.js";

function wrap(ui: React.ReactNode) {
  return render(<ThemeShellProvider mode="light">{ui}</ThemeShellProvider>);
}

const ITEMS = [
  { id: 1, quote: "First quote.", authorName: "Alice Jones", rating: 5 },
  { id: 2, quote: "Second quote.", authorName: "Bob Smith", rating: 4 },
  { id: 3, quote: "Third quote.", authorName: "Carol Lee", rating: 3 },
];

describe("Testimonials", () => {
  it("renders without crashing with no items", () => {
    const { container } = wrap(<Testimonials />);
    expect(container.querySelector("section")).toBeTruthy();
  });

  it("renders the section title", () => {
    wrap(<Testimonials title="What customers say" items={ITEMS} />);
    expect(screen.getByText("What customers say")).toBeInTheDocument();
  });

  it("shows the first testimonial in carousel mode", () => {
    wrap(<Testimonials items={ITEMS} displayMode="carousel" />);
    expect(screen.getByText(/First quote/)).toBeInTheDocument();
  });

  it("renders 3 cards in grid mode", () => {
    wrap(<Testimonials items={ITEMS} displayMode="grid" />);
    expect(screen.getAllByTestId("testimonial-card")).toHaveLength(3);
  });

  it("prev/next buttons are rendered when carousel has multiple items", () => {
    wrap(<Testimonials items={ITEMS} displayMode="carousel" />);
    expect(screen.getByRole("button", { name: /previous testimonial/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next testimonial/i })).toBeInTheDocument();
  });

  it("navigates to next testimonial on next button click", async () => {
    const user = userEvent.setup();
    wrap(<Testimonials items={ITEMS} displayMode="carousel" />);
    await user.click(screen.getByRole("button", { name: /next testimonial/i }));
    expect(screen.getByText(/Second quote/)).toBeInTheDocument();
  });

  it("renders author name", () => {
    wrap(<Testimonials items={[ITEMS[0]]} displayMode="carousel" />);
    expect(screen.getByText("Alice Jones")).toBeInTheDocument();
  });
});
