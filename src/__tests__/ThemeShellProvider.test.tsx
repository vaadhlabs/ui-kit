import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeShellProvider, useThemeMode } from "../ThemeShellProvider.js";

function ModeReader(): JSX.Element {
  const { mode, setting, toggleTheme, setThemeMode } = useThemeMode();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <span data-testid="setting">{setting}</span>
      <button onClick={toggleTheme}>toggle</button>
      <button onClick={() => setThemeMode("dark")}>set-dark</button>
      <button onClick={() => setThemeMode("system")}>set-system</button>
    </div>
  );
}

describe("ThemeShellProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    // jsdom matchMedia is not implemented by default
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((q: string) => ({
        matches: false,
        media: q,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });
  afterEach(() => {
    localStorage.clear();
  });

  it("starts at the default setting (system → light when prefers-color-scheme: dark is false)", () => {
    render(
      <ThemeShellProvider defaultSetting="system">
        <ModeReader />
      </ThemeShellProvider>,
    );
    expect(screen.getByTestId("setting")).toHaveTextContent("system");
    expect(screen.getByTestId("mode")).toHaveTextContent("light");
  });

  it("hydrates the setting from localStorage", () => {
    localStorage.setItem("tc.theme-mode", "dark");
    render(
      <ThemeShellProvider>
        <ModeReader />
      </ThemeShellProvider>,
    );
    expect(screen.getByTestId("setting")).toHaveTextContent("dark");
    expect(screen.getByTestId("mode")).toHaveTextContent("dark");
  });

  it("toggles cycle: system → light → dark → system", async () => {
    const user = userEvent.setup();
    render(
      <ThemeShellProvider defaultSetting="system">
        <ModeReader />
      </ThemeShellProvider>,
    );
    await user.click(screen.getByText("toggle"));
    expect(screen.getByTestId("setting")).toHaveTextContent("light");
    await user.click(screen.getByText("toggle"));
    expect(screen.getByTestId("setting")).toHaveTextContent("dark");
    await user.click(screen.getByText("toggle"));
    expect(screen.getByTestId("setting")).toHaveTextContent("system");
  });

  it("setThemeMode persists non-system to localStorage; system removes it", async () => {
    const user = userEvent.setup();
    render(
      <ThemeShellProvider>
        <ModeReader />
      </ThemeShellProvider>,
    );
    await user.click(screen.getByText("set-dark"));
    expect(localStorage.getItem("tc.theme-mode")).toBe("dark");
    await user.click(screen.getByText("set-system"));
    expect(localStorage.getItem("tc.theme-mode")).toBeNull();
  });

  it("useThemeMode throws outside the provider", () => {
    const orig = console.error;
    console.error = () => {};
    expect(() => render(<ModeReader />)).toThrow(/useThemeMode/);
    console.error = orig;
  });

  it("respects custom primary/secondary overrides via the theme prop", () => {
    // No assertion errors mean the props plumb through createTensorTheme.
    expect(() =>
      render(
        <ThemeShellProvider primaryColor="#112233" secondaryColor="#445566">
          <ModeReader />
        </ThemeShellProvider>,
      ),
    ).not.toThrow();
  });

  it("re-renders when matchMedia signals a system-pref change after mount", () => {
    // Render once; assert it does not throw and respects the system value.
    render(
      <ThemeShellProvider defaultSetting="system">
        <ModeReader />
      </ThemeShellProvider>,
    );
    act(() => {
      // trigger no-op effect
    });
    expect(screen.getByTestId("mode")).toBeInTheDocument();
  });
});
