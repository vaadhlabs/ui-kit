import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeShellProvider } from "../../ThemeShellProvider.js";
import { FAQAccordion } from "../FAQAccordion.js";

function wrap(ui: React.ReactNode) {
  return render(<ThemeShellProvider mode="light">{ui}</ThemeShellProvider>);
}

const ITEMS = [
  { id: 1, question: "Question one?", answer: "Answer one." },
  { id: 2, question: "Question two?", answer: "Answer two." },
  { id: 3, question: "Question three?", answer: "Answer three." },
];

describe("FAQAccordion", () => {
  it("renders without crashing with no items", () => {
    const { container } = wrap(<FAQAccordion />);
    expect(container.querySelector("section")).toBeTruthy();
  });

  it("renders the section title and subtitle", () => {
    wrap(<FAQAccordion title="FAQ" subtitle="Common questions" />);
    expect(screen.getByText("FAQ")).toBeInTheDocument();
    expect(screen.getByText("Common questions")).toBeInTheDocument();
  });

  it("renders 3 FAQ items", () => {
    wrap(<FAQAccordion items={ITEMS} />);
    expect(screen.getAllByTestId("faq-item")).toHaveLength(3);
  });

  it("shows question text for all items", () => {
    wrap(<FAQAccordion items={ITEMS} />);
    expect(screen.getByText("Question one?")).toBeInTheDocument();
    expect(screen.getByText("Question two?")).toBeInTheDocument();
    expect(screen.getByText("Question three?")).toBeInTheDocument();
  });

  it("answer is not visible before clicking (collapsed)", () => {
    wrap(<FAQAccordion items={[ITEMS[0]]} />);
    // MUI Accordion uses aria-expanded on the summary button
    const summary = screen.getByRole("button", { name: /Question one/i });
    expect(summary).toHaveAttribute("aria-expanded", "false");
  });

  it("expands item when clicked", async () => {
    const user = userEvent.setup();
    wrap(<FAQAccordion items={[ITEMS[0]]} />);
    const summary = screen.getByRole("button", { name: /Question one/i });
    await user.click(summary);
    expect(summary).toHaveAttribute("aria-expanded", "true");
  });

  it("collapses an expanded item when clicked again", async () => {
    const user = userEvent.setup();
    wrap(<FAQAccordion items={[ITEMS[0]]} />);
    const summary = screen.getByRole("button", { name: /Question one/i });
    await user.click(summary); // open
    await user.click(summary); // close
    expect(summary).toHaveAttribute("aria-expanded", "false");
  });

  it("closes other items in single-open mode when a new one opens", async () => {
    const user = userEvent.setup();
    wrap(<FAQAccordion items={ITEMS} allowMultipleOpen={false} />);
    await user.click(screen.getByRole("button", { name: /Question one/i }));
    await user.click(screen.getByRole("button", { name: /Question two/i }));
    expect(screen.getByRole("button", { name: /Question one/i })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: /Question two/i })).toHaveAttribute("aria-expanded", "true");
  });

  it("allows multiple open items in allowMultipleOpen mode", async () => {
    const user = userEvent.setup();
    wrap(<FAQAccordion items={ITEMS} allowMultipleOpen />);
    await user.click(screen.getByRole("button", { name: /Question one/i }));
    await user.click(screen.getByRole("button", { name: /Question two/i }));
    expect(screen.getByRole("button", { name: /Question one/i })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: /Question two/i })).toHaveAttribute("aria-expanded", "true");
  });
});
