import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeShellProvider } from "../../ThemeShellProvider.js";
import { MarkdownBody } from "../MarkdownBody.js";

function wrap(ui: React.ReactNode) {
  return render(<ThemeShellProvider mode="light">{ui}</ThemeShellProvider>);
}

describe("MarkdownBody", () => {
  it("renders without crashing with no content", () => {
    const { container } = wrap(<MarkdownBody />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders plain markdown text", () => {
    wrap(<MarkdownBody>{"Hello **world**"}</MarkdownBody>);
    expect(screen.getByText(/Hello/)).toBeInTheDocument();
  });

  it("renders a heading from markdown", () => {
    wrap(<MarkdownBody>{"## Section title"}</MarkdownBody>);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("renders links with anchor elements", () => {
    wrap(<MarkdownBody>{"Visit [docs](https://example.com)"}</MarkdownBody>);
    const link = screen.getByRole("link", { name: "docs" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://example.com");
  });

  it("accepts component overrides that replace the default", () => {
    wrap(
      <MarkdownBody
        components={{
          p: ({ node: _node, ...p }: Record<string, unknown>) => (
            <p data-testid="custom-p" {...(p as React.ComponentPropsWithoutRef<"p">)} />
          ),
        }}
      >
        {"A paragraph."}
      </MarkdownBody>,
    );
    expect(screen.getByTestId("custom-p")).toBeInTheDocument();
  });

  it("applies sx prop to the wrapper Box", () => {
    const { container } = wrap(
      <MarkdownBody sx={{ fontSize: "2rem" }}>{"text"}</MarkdownBody>,
    );
    // MUI Box renders a div — just verify the component doesn't crash with sx
    expect(container.querySelector("div")).toBeTruthy();
  });
});
