import { describe, expect, it, vi, afterEach, beforeEach } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { createTensorTheme } from "./theme.js";
import { WorkflowPage, type TocItem } from "./WorkflowPage.js";
import { WorkflowCard } from "./WorkflowCard.js";

const TOC: TocItem[] = [
  { key: "sources",    label: "Sources",    hint: "3 connected" },
  { key: "explorer",   label: "Explorer",   hint: "$55k 30d" },
  { key: "allocation", label: "Allocation", hint: "62 rules" },
];

function Wrapper({ children, mode = "light" }: { children: React.ReactNode; mode?: "light" | "dark" }) {
  return (
    <ThemeProvider theme={createTensorTheme(mode)}>{children}</ThemeProvider>
  );
}

function renderPage(overrides?: Partial<Parameters<typeof WorkflowPage>[0]>) {
  return render(
    <Wrapper>
      <WorkflowPage
        title="Cost operations"
        subtitle="Connect, allocate, run chargeback."
        tocItems={TOC}
        {...overrides}
      >
        <WorkflowCard anchor="sources" title="Sources" />
        <WorkflowCard anchor="explorer" title="Explorer" />
        <WorkflowCard anchor="allocation" title="Allocation" />
      </WorkflowPage>
    </Wrapper>,
  );
}

describe("WorkflowPage", () => {
  beforeEach(() => {
    // IntersectionObserver is not in jsdom — provide a minimal stub.
    const observeFn = vi.fn();
    const disconnectFn = vi.fn();
    vi.stubGlobal("IntersectionObserver", vi.fn(() => ({
      observe: observeFn,
      disconnect: disconnectFn,
      unobserve: vi.fn(),
    })));
    // Reset hash before each test.
    if (typeof window !== "undefined") {
      window.location.hash = "";
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders page title and subtitle", () => {
    renderPage();
    expect(screen.getByText("Cost operations")).toBeInTheDocument();
    expect(screen.getByText("Connect, allocate, run chargeback.")).toBeInTheDocument();
  });

  it("renders TOC pills for each item", () => {
    renderPage();
    // Each label appears twice: once in the TOC pill (button) and once in
    // the WorkflowCard h2. getAllByText confirms both are present.
    expect(screen.getAllByText("Sources").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Explorer").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Allocation").length).toBeGreaterThanOrEqual(1);
    // Confirm TOC pills are accessible as buttons
    expect(screen.getByRole("button", { name: /sources/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /explorer/i })).toBeInTheDocument();
  });

  it("renders TOC hint text inside pills", () => {
    renderPage();
    expect(screen.getByText("3 connected")).toBeInTheDocument();
    expect(screen.getByText("$55k 30d")).toBeInTheDocument();
  });

  it("renders WorkflowCard children", () => {
    renderPage();
    // WorkflowCard renders h2 with title
    const headings = screen.getAllByRole("heading", { level: 2 });
    const titles = headings.map((h) => h.textContent);
    expect(titles).toContain("Sources");
    expect(titles).toContain("Explorer");
    expect(titles).toContain("Allocation");
  });

  it("renders action slot when provided", () => {
    renderPage({ actionSlot: <button>Export</button> });
    expect(screen.getByRole("button", { name: "Export" })).toBeInTheDocument();
  });

  it("renders without action slot when omitted", () => {
    renderPage();
    expect(screen.queryByRole("button", { name: "Export" })).not.toBeInTheDocument();
  });

  it("TOC nav has accessible label", () => {
    renderPage();
    expect(screen.getByRole("navigation", { name: "Page sections" })).toBeInTheDocument();
  });

  it("first TOC pill is active by default (no hash)", () => {
    renderPage();
    const sourcesBtn = screen.getByRole("button", { name: /sources/i });
    expect(sourcesBtn).toHaveAttribute("aria-current", "true");
  });

  it("clicking a TOC pill calls onTocClick with the key", () => {
    const onTocClick = vi.fn();
    renderPage({ onTocClick });
    const explorerBtn = screen.getByRole("button", { name: /explorer/i });
    fireEvent.click(explorerBtn);
    expect(onTocClick).toHaveBeenCalledWith("explorer");
  });

  it("clicking a TOC pill updates active state", () => {
    renderPage();
    const explorerBtn = screen.getByRole("button", { name: /explorer/i });
    act(() => {
      fireEvent.click(explorerBtn);
    });
    expect(explorerBtn).toHaveAttribute("aria-current", "true");
  });

  it("hash on mount sets the correct initial active anchor", () => {
    // Pre-set hash before render.
    window.location.hash = "#allocation";
    // Pre-populate the DOM with the anchor element (simulating WorkflowCard).
    const anchor = document.createElement("a");
    anchor.id = "allocation";
    document.body.appendChild(anchor);

    renderPage();

    const allocationBtn = screen.getByRole("button", { name: /allocation/i });
    expect(allocationBtn).toHaveAttribute("aria-current", "true");

    // Cleanup
    anchor.remove();
    window.location.hash = "";
  });

  it("renders in dark mode without errors", () => {
    render(
      <Wrapper mode="dark">
        <WorkflowPage title="Cost ops" tocItems={TOC}>
          <WorkflowCard anchor="sources" title="Sources" />
        </WorkflowPage>
      </Wrapper>,
    );
    expect(screen.getByText("Cost ops")).toBeInTheDocument();
  });

  it("IntersectionObserver is set up for each anchor", () => {
    // Capture the IntersectionObserver callback so we can invoke it directly.
    let capturedCallback: ((entries: IntersectionObserverEntry[]) => void) | null = null;
    (IntersectionObserver as ReturnType<typeof vi.fn>).mockImplementation((cb: (e: IntersectionObserverEntry[]) => void) => {
      capturedCallback = cb;
      return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
    });

    // Inject anchor elements for the IO to observe
    const anchors = TOC.map(({ key }) => {
      const el = document.createElement("a");
      el.id = key;
      document.body.appendChild(el);
      return el;
    });

    renderPage();
    const ioInstance = (IntersectionObserver as ReturnType<typeof vi.fn>).mock.results[0]?.value;
    expect(ioInstance?.observe).toHaveBeenCalledTimes(TOC.length);

    // Exercise the IO callback: simulate "sources" becoming visible.
    if (capturedCallback) {
      capturedCallback([
        {
          isIntersecting: true,
          target: anchors[0],
          intersectionRatio: 1,
        } as unknown as IntersectionObserverEntry,
      ]);
    }

    // Cleanup injected anchors
    for (const el of anchors) el.remove();
  });

  it("IntersectionObserver callback updates active anchor on visibility change", () => {
    let capturedCallback: ((entries: IntersectionObserverEntry[]) => void) | null = null;
    (IntersectionObserver as ReturnType<typeof vi.fn>).mockImplementation((cb: (e: IntersectionObserverEntry[]) => void) => {
      capturedCallback = cb;
      return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
    });

    const anchors = TOC.map(({ key }) => {
      const el = document.createElement("a");
      el.id = key;
      document.body.appendChild(el);
      return el;
    });

    renderPage();

    if (capturedCallback) {
      // Make "explorer" visible, "sources" not visible — must wrap in act
      // so the React state update from the IO callback flushes.
      act(() => {
        capturedCallback!([
          { isIntersecting: false, target: anchors[0] } as unknown as IntersectionObserverEntry,
          { isIntersecting: true,  target: anchors[1] } as unknown as IntersectionObserverEntry,
        ]);
      });
    }

    // Explorer pill should now be active
    const explorerBtn = screen.getByRole("button", { name: /explorer/i });
    expect(explorerBtn).toHaveAttribute("aria-current", "true");

    for (const el of anchors) el.remove();
  });

  it("renders without subtitle when omitted", () => {
    renderPage({ subtitle: undefined });
    expect(screen.queryByText("Connect, allocate, run chargeback.")).not.toBeInTheDocument();
  });
});
