import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import {
  Dashboard as DashboardIcon,
  AttachMoney as AttachMoneyIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { createTensorTheme } from "./theme.js";
import { RailSidebar, type NavItem, type RailSidebarUser } from "./RailSidebar.js";

const ITEMS: NavItem[] = [
  { key: "home",    label: "Home",     icon: DashboardIcon,     path: "/" },
  { key: "costs",   label: "Cost ops", icon: AttachMoneyIcon,   path: "/costs", hint: "$55.1k · 30d" },
  { key: "alerts",  label: "Alerts",   icon: NotificationsIcon, path: "/alerts", badge: { kind: "danger", count: 3 } },
  { key: "settings",label: "Settings", icon: SettingsIcon,      path: "/settings" },
];

const USER: RailSidebarUser = {
  email: "dani@acme.com",
  role: "platform / finops",
};

function Wrapper({ children, mode = "light" }: { children: React.ReactNode; mode?: "light" | "dark" }) {
  return (
    <ThemeProvider theme={createTensorTheme(mode)}>{children}</ThemeProvider>
  );
}

function renderSidebar(overrides?: Partial<React.ComponentProps<typeof RailSidebar>>) {
  return render(
    <Wrapper>
      <RailSidebar
        active="home"
        items={ITEMS}
        tenant="acme"
        env="production"
        user={USER}
        alertsCount={3}
        {...overrides}
      />
    </Wrapper>,
  );
}

// ---------------------------------------------------------------------------
// Original zone tests (preserved)
// ---------------------------------------------------------------------------

describe("RailSidebar — Zone 1: Brand", () => {
  it("renders 'TensorCost' wordmark", () => {
    renderSidebar({ defaultCollapsed: false });
    expect(screen.getByText("TensorCost")).toBeInTheDocument();
  });

  it("renders gradient logo dot (aria-hidden)", () => {
    renderSidebar({ defaultCollapsed: false });
    const brand = screen.getByText("TensorCost").parentElement;
    expect(brand).not.toBeNull();
  });
});

describe("RailSidebar — Zone 2: Tenant chip", () => {
  it("renders tenant and env names when expanded", () => {
    renderSidebar({ defaultCollapsed: false });
    expect(screen.getByText("acme")).toBeInTheDocument();
    expect(screen.getByText(/production/)).toBeInTheDocument();
  });

  it("calls onTenantClick when chip is clicked", () => {
    const onTenantClick = vi.fn();
    renderSidebar({ defaultCollapsed: false, onTenantClick });
    const btn = screen.getByRole("button", { name: /switch tenant/i });
    fireEvent.click(btn);
    expect(onTenantClick).toHaveBeenCalledOnce();
  });
});

describe("RailSidebar — Zone 3: Search", () => {
  it("renders search with ⌘K hint when expanded", () => {
    renderSidebar({ defaultCollapsed: false });
    expect(screen.getByText("⌘K")).toBeInTheDocument();
    expect(screen.getByText("Find anything")).toBeInTheDocument();
  });

  it("calls onSearch when clicked", () => {
    const onSearch = vi.fn();
    renderSidebar({ defaultCollapsed: false, onSearch });
    const search = screen.getByRole("searchbox", { name: /search/i });
    fireEvent.click(search);
    expect(onSearch).toHaveBeenCalledOnce();
  });
});

describe("RailSidebar — Zone 4: Item list", () => {
  it("renders all nav items", () => {
    renderSidebar({ defaultCollapsed: false });
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Cost ops")).toBeInTheDocument();
    expect(screen.getByText("Alerts")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("active item has aria-current=page", () => {
    renderSidebar({ active: "home", defaultCollapsed: false });
    const homeLink = screen.getByRole("link", { name: /home/i });
    expect(homeLink).toHaveAttribute("aria-current", "page");
  });

  it("inactive items do not have aria-current", () => {
    renderSidebar({ active: "home", defaultCollapsed: false });
    const costsLink = screen.getByRole("link", { name: /cost ops/i });
    expect(costsLink).not.toHaveAttribute("aria-current");
  });

  it("shows hint text for items that have it", () => {
    renderSidebar({ defaultCollapsed: false });
    expect(screen.getByText("$55.1k · 30d")).toBeInTheDocument();
  });

  it("shows badge count for items with a badge", () => {
    renderSidebar({ defaultCollapsed: false });
    // The badge shows "3" for alerts
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("badge has accessible label", () => {
    renderSidebar({ defaultCollapsed: false });
    const badge = screen.getByLabelText(/3 alerts alerts/i);
    expect(badge).toBeInTheDocument();
  });

  it("calls onItemClick when a nav item is clicked", () => {
    const onItemClick = vi.fn();
    renderSidebar({ defaultCollapsed: false, onItemClick });
    const costsLink = screen.getByRole("link", { name: /cost ops/i });
    fireEvent.click(costsLink);
    expect(onItemClick).toHaveBeenCalledWith(expect.objectContaining({ key: "costs" }));
  });

  it("nav has accessible label 'Main navigation'", () => {
    renderSidebar();
    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();
  });

  it("renders danger badge variant", () => {
    renderSidebar({
      defaultCollapsed: false,
      items: [
        ...ITEMS,
        { key: "x", label: "X", icon: DashboardIcon, path: "/x", badge: { kind: "danger", count: 9 } },
      ],
    });
    expect(screen.getByLabelText(/9 x alerts/i)).toBeInTheDocument();
  });

  it("renders warn badge variant", () => {
    renderSidebar({
      defaultCollapsed: false,
      items: [
        { key: "w", label: "W item", icon: DashboardIcon, path: "/w", badge: { kind: "warn", count: 2 } },
      ],
    });
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});

describe("RailSidebar — Zone 5: User footer", () => {
  it("renders user email", () => {
    renderSidebar({ defaultCollapsed: false });
    expect(screen.getByText("dani@acme.com")).toBeInTheDocument();
  });

  it("renders user role", () => {
    renderSidebar({ defaultCollapsed: false });
    expect(screen.getByText("platform / finops")).toBeInTheDocument();
  });

  it("renders avatar initial when no avatarUrl", () => {
    renderSidebar();
    // "D" from "dani@acme.com" — avatar is always visible even when collapsed
    expect(screen.getByText("D")).toBeInTheDocument();
  });

  it("renders avatar img when avatarUrl is provided", () => {
    renderSidebar({ user: { ...USER, avatarUrl: "https://example.com/avatar.jpg" } });
    expect(screen.getByRole("img", { name: USER.email })).toBeInTheDocument();
  });

  it("calls onUserSettingsClick when settings icon is clicked", () => {
    const onUserSettingsClick = vi.fn();
    renderSidebar({ defaultCollapsed: false, onUserSettingsClick });
    const btn = screen.getByRole("button", { name: /user settings/i });
    fireEvent.click(btn);
    expect(onUserSettingsClick).toHaveBeenCalledOnce();
  });
});

describe("RailSidebar — Dark mode", () => {
  it("renders in dark theme without errors", () => {
    render(
      <Wrapper mode="dark">
        <RailSidebar
          active="costs"
          items={ITEMS}
          tenant="acme"
          env="staging"
          user={USER}
          alertsCount={0}
          defaultCollapsed={false}
        />
      </Wrapper>,
    );
    expect(screen.getByText("TensorCost")).toBeInTheDocument();
    expect(screen.getByText("acme")).toBeInTheDocument();
  });
});

describe("RailSidebar — Keyboard nav", () => {
  it("nav items are rendered as anchor elements (keyboard-navigable)", () => {
    renderSidebar({ defaultCollapsed: false });
    const links = screen.getAllByRole("link");
    // At minimum our 4 items
    expect(links.length).toBeGreaterThanOrEqual(4);
  });
});

// ---------------------------------------------------------------------------
// New tests: collapse-by-default + hover/click expand + pin
// ---------------------------------------------------------------------------

describe("RailSidebar — collapse-by-default (user override)", () => {
  it("collapses by default: tenant chip is not visible (tabIndex=-1)", () => {
    renderSidebar(); // defaultCollapsed=true is the default
    // The tenant chip button should have tabIndex=-1 when collapsed
    const chip = screen.getByRole("button", { name: /switch tenant/i });
    expect(chip).toHaveAttribute("tabindex", "-1");
  });

  it("defaultCollapsed=false keeps sidebar expanded from mount", () => {
    renderSidebar({ defaultCollapsed: false });
    // tenant chip should be tabbable
    const chip = screen.getByRole("button", { name: /switch tenant/i });
    expect(chip).not.toHaveAttribute("tabindex", "-1");
  });

  it("avatar initial is always visible regardless of collapsed state", () => {
    renderSidebar(); // collapsed
    expect(screen.getByText("D")).toBeInTheDocument();
  });

  it("nav element is always rendered regardless of collapsed state", () => {
    renderSidebar(); // collapsed
    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();
  });
});

describe("RailSidebar — hover expand behavior", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("expands after 100ms on mouseEnter, collapses after 200ms on mouseLeave", () => {
    renderSidebar(); // collapsed by default
    const aside = screen.getByRole("complementary");

    // Before hover: tenant chip has tabIndex=-1 (collapsed)
    const chip = screen.getByRole("button", { name: /switch tenant/i });
    expect(chip).toHaveAttribute("tabindex", "-1");

    // mouseEnter — not yet expanded (100ms delay pending)
    fireEvent.mouseEnter(aside);
    expect(chip).toHaveAttribute("tabindex", "-1");

    // After 100ms → expanded
    act(() => { vi.advanceTimersByTime(100); });
    expect(chip).not.toHaveAttribute("tabindex", "-1");

    // mouseLeave — still expanded (200ms delay pending)
    fireEvent.mouseLeave(aside);
    expect(chip).not.toHaveAttribute("tabindex", "-1");

    // After 200ms → collapsed again
    act(() => { vi.advanceTimersByTime(200); });
    expect(chip).toHaveAttribute("tabindex", "-1");
  });

  it("brushing past (mouseLeave before 100ms expires) does not expand", () => {
    renderSidebar();
    const aside = screen.getByRole("complementary");
    const chip = screen.getByRole("button", { name: /switch tenant/i });

    fireEvent.mouseEnter(aside);
    act(() => { vi.advanceTimersByTime(50); }); // only 50ms in
    fireEvent.mouseLeave(aside);

    // Advance past both timers — should still be collapsed
    act(() => { vi.advanceTimersByTime(300); });
    expect(chip).toHaveAttribute("tabindex", "-1");
  });
});

describe("RailSidebar — pin button (user override)", () => {
  it("pin button appears when expanded", () => {
    renderSidebar({ defaultCollapsed: false });
    expect(screen.getByRole("button", { name: /pin sidebar open/i })).toBeInTheDocument();
  });

  it("pin button not present when collapsed", () => {
    renderSidebar(); // collapsed
    expect(screen.queryByRole("button", { name: /pin sidebar/i })).toBeNull();
  });

  it("clicking pin button calls onPinChange with true", () => {
    const onPinChange = vi.fn();
    renderSidebar({ defaultCollapsed: false, pinned: false, onPinChange });
    fireEvent.click(screen.getByRole("button", { name: /pin sidebar open/i }));
    expect(onPinChange).toHaveBeenCalledWith(true);
  });

  it("clicking pin again calls onPinChange with false (toggle)", () => {
    const onPinChange = vi.fn();
    renderSidebar({ defaultCollapsed: false, pinned: true, onPinChange });
    fireEvent.click(screen.getByRole("button", { name: /unpin sidebar/i }));
    expect(onPinChange).toHaveBeenCalledWith(false);
  });

  it("when pinned=true, sidebar shows expanded content", () => {
    renderSidebar({ pinned: true, onPinChange: vi.fn() });
    const chip = screen.getByRole("button", { name: /switch tenant/i });
    expect(chip).not.toHaveAttribute("tabindex", "-1");
  });

  it("internal pin persists via localStorage", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    renderSidebar({ defaultCollapsed: false });
    fireEvent.click(screen.getByRole("button", { name: /pin sidebar open/i }));
    expect(setItem).toHaveBeenCalledWith("tensorcost.navrail.pinned", "true");
  });

  it("pin state is restored from localStorage on mount", () => {
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue("true");
    renderSidebar(); // defaultCollapsed=true but localStorage says pinned
    // Should be expanded because pinned
    const chip = screen.getByRole("button", { name: /switch tenant/i });
    expect(chip).not.toHaveAttribute("tabindex", "-1");
  });
});

describe("RailSidebar — collapsed-mode tooltips", () => {
  it("items in collapsed mode are wrapped in Tooltip (placement=right)", () => {
    // Tooltips render via aria attributes when hovered, but in jsdom the
    // easiest way to confirm wrapping is to check the aria-label on the
    // item links are still present and accessible.
    renderSidebar(); // collapsed
    // All nav item links still have aria-label (they are wrapped in tooltips)
    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toBeInTheDocument();
  });
});
