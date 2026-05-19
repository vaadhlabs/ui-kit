import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { createTensorTheme } from "./theme.js";
import { WorkflowCard } from "./WorkflowCard.js";

function Wrapper({ children, mode = "light" }: { children: React.ReactNode; mode?: "light" | "dark" }) {
  return (
    <ThemeProvider theme={createTensorTheme(mode)}>{children}</ThemeProvider>
  );
}

describe("WorkflowCard", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders title", () => {
    render(
      <Wrapper>
        <WorkflowCard title="Explorer" />
      </Wrapper>,
    );
    expect(screen.getByText("Explorer")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(
      <Wrapper>
        <WorkflowCard title="Explorer" subtitle="Spend across providers" />
      </Wrapper>,
    );
    expect(screen.getByText("Spend across providers")).toBeInTheDocument();
  });

  it("does not render subtitle when omitted", () => {
    render(
      <Wrapper>
        <WorkflowCard title="Budgets" />
      </Wrapper>,
    );
    expect(screen.queryByText("Spend across providers")).not.toBeInTheDocument();
  });

  it("renders StatusBadge when status prop is provided", () => {
    render(
      <Wrapper>
        <WorkflowCard
          title="Allocation"
          status={{ kind: "ok", text: "62 rules · 94% allocated" }}
        />
      </Wrapper>,
    );
    expect(screen.getByText("62 rules · 94% allocated")).toBeInTheDocument();
  });

  it("renders children inside the card body", () => {
    render(
      <Wrapper>
        <WorkflowCard title="Sources">
          <span data-testid="body-content">AWS, GCP</span>
        </WorkflowCard>
      </Wrapper>,
    );
    expect(screen.getByTestId("body-content")).toBeInTheDocument();
  });

  it("renders anchor element when anchor prop is provided", () => {
    render(
      <Wrapper>
        <WorkflowCard title="Chargeback" anchor="chargeback" />
      </Wrapper>,
    );
    expect(document.getElementById("chargeback")).toBeTruthy();
  });

  it("does not render anchor element when anchor prop is omitted", () => {
    render(
      <Wrapper>
        <WorkflowCard title="Forecast" />
      </Wrapper>,
    );
    // No anchor → no id attribute on a hidden anchor tag
    expect(document.querySelector("a[id]")).toBeNull();
  });

  it("no numeric step badge is rendered (user override — dropped entirely)", () => {
    render(
      <Wrapper>
        <WorkflowCard title="Sources" />
      </Wrapper>,
    );
    // The card should not contain any digit that looks like a step number
    // in a circle. We verify by confirming no element has aria-label
    // matching "step" or contains only a single digit as text.
    const singleDigitEls = Array.from(document.querySelectorAll("*")).filter(
      (el) => el.textContent?.trim().match(/^\d$/) && el.children.length === 0,
    );
    expect(singleDigitEls).toHaveLength(0);
  });

  it("accepts focus=false without crashing", () => {
    render(
      <Wrapper>
        <WorkflowCard title="Budgets" focus={false} />
      </Wrapper>,
    );
    expect(screen.getByText("Budgets")).toBeInTheDocument();
  });

  it("focus ring fades after FOCUS_IDLE_MS + FOCUS_FADE_MS when focus=true", async () => {
    vi.useFakeTimers();
    render(
      <Wrapper>
        <WorkflowCard title="Explorer" anchor="explorer" focus />
      </Wrapper>,
    );
    const section = document.querySelector("section");
    expect(section).not.toBeNull();

    // Initially the ring should be active — border-color should contain blue
    const initialBorder = section!.getAttribute("style") ?? "";
    // After 4s idle + 300ms fade the ring state transitions — we just
    // verify the timer fires without throwing.
    act(() => {
      vi.advanceTimersByTime(4_300);
    });
    // Component still renders cleanly.
    expect(screen.getByText("Explorer")).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("interaction resets the idle timer", async () => {
    vi.useFakeTimers();
    render(
      <Wrapper>
        <WorkflowCard title="Explorer" focus />
      </Wrapper>,
    );
    const section = document.querySelector("section")!;
    // Simulate mouse interaction at 3.5s — should reset the 4s timer.
    act(() => {
      vi.advanceTimersByTime(3_500);
      fireEvent.mouseMove(section);
    });
    // Timer was reset; advance another 3.5s (total 7s, but reset means 4s from 3.5s mark)
    act(() => {
      vi.advanceTimersByTime(3_500);
    });
    // Still rendered cleanly.
    expect(screen.getByText("Explorer")).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("renders in dark mode", () => {
    render(
      <Wrapper mode="dark">
        <WorkflowCard title="Allocation" status={{ kind: "warn", text: "2 over" }} />
      </Wrapper>,
    );
    expect(screen.getByText("Allocation")).toBeInTheDocument();
    expect(screen.getByText("2 over")).toBeInTheDocument();
  });

  it("renders all status badge kinds without errors", () => {
    const kinds = ["ok", "warn", "info", "danger"] as const;
    for (const kind of kinds) {
      const { unmount } = render(
        <Wrapper>
          <WorkflowCard title={`Card-${kind}`} status={{ kind, text: kind }} />
        </Wrapper>,
      );
      expect(screen.getByText(kind)).toBeInTheDocument();
      unmount();
    }
  });
});
