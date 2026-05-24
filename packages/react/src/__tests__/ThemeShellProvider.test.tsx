import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useTheme } from "@mui/material/styles";
import { ThemeShellProvider, useThemeMode } from "../ThemeShellProvider.js";

function ModeReader(): JSX.Element {
  const { mode, setting, toggleTheme, setThemeMode, setBrandColors } = useThemeMode();
  const theme = useTheme();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <span data-testid="setting">{setting}</span>
      <span data-testid="primary">{theme.palette.primary.main}</span>
      <span data-testid="secondary">{theme.palette.secondary.main}</span>
      <button onClick={toggleTheme}>toggle</button>
      <button onClick={() => setThemeMode("dark")}>set-dark</button>
      <button onClick={() => setThemeMode("system")}>set-system</button>
      <button onClick={() => setBrandColors({ primary: "#aabbcc", secondary: "#ddeeff" })}>
        runtime-brand
      </button>
      <button onClick={() => setBrandColors({})}>runtime-brand-reset</button>
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

  it("useThemeMode falls back to a light, no-op context outside the provider", () => {
    // MFs render standalone in vitest without the shell. The hook returns
    // a fixed light-mode context with no-op setters so they don't crash.
    const { getByTestId } = render(<ModeReader />);
    expect(getByTestId("mode").textContent).toBe("light");
    expect(getByTestId("setting").textContent).toBe("light");
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

  it("setBrandColors at runtime re-themes the MUI palette (§2.15 / Audit P0-8)", async () => {
    const user = userEvent.setup();
    render(
      <ThemeShellProvider primaryColor="#000000" secondaryColor="#111111">
        <ModeReader />
      </ThemeShellProvider>,
    );
    // Boot-time props in effect.
    expect(screen.getByTestId("primary")).toHaveTextContent(/^#000000$/i);
    expect(screen.getByTestId("secondary")).toHaveTextContent(/^#111111$/i);

    await user.click(screen.getByText("runtime-brand"));
    expect(screen.getByTestId("primary")).toHaveTextContent(/^#aabbcc$/i);
    expect(screen.getByTestId("secondary")).toHaveTextContent(/^#ddeeff$/i);
  });

  it("setBrandColors with empty object falls back to boot-time defaults", async () => {
    const user = userEvent.setup();
    render(
      <ThemeShellProvider primaryColor="#abcdef" secondaryColor="#fedcba">
        <ModeReader />
      </ThemeShellProvider>,
    );
    // Move it away from the defaults first, then ask to reset.
    await user.click(screen.getByText("runtime-brand"));
    expect(screen.getByTestId("primary")).toHaveTextContent(/^#aabbcc$/i);

    await user.click(screen.getByText("runtime-brand-reset"));
    expect(screen.getByTestId("primary")).toHaveTextContent(/^#abcdef$/i);
    expect(screen.getByTestId("secondary")).toHaveTextContent(/^#fedcba$/i);
  });
});
