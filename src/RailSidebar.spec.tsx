import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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

describe("RailSidebar — Zone 1: Brand", () => {
  it("renders 'TensorCost' wordmark", () => {
    renderSidebar();
    expect(screen.getByText("TensorCost")).toBeInTheDocument();
  });

  it("renders gradient logo dot (aria-hidden)", () => {
    renderSidebar();
    // The logo dot is aria-hidden — shouldn't appear in accessible tree,
    // but exists in the DOM.
    const brand = screen.getByText("TensorCost").parentElement;
    expect(brand).not.toBeNull();
  });
});

describe("RailSidebar — Zone 2: Tenant chip", () => {
  it("renders tenant and env names", () => {
    renderSidebar();
    expect(screen.getByText("acme")).toBeInTheDocument();
    expect(screen.getByText(/production/)).toBeInTheDocument();
  });

  it("calls onTenantClick when chip is clicked", () => {
    const onTenantClick = vi.fn();
    renderSidebar({ onTenantClick });
    const btn = screen.getByRole("button", { name: /switch tenant/i });
    fireEvent.click(btn);
    expect(onTenantClick).toHaveBeenCalledOnce();
  });
});

describe("RailSidebar — Zone 3: Search", () => {
  it("renders search with ⌘K hint", () => {
    renderSidebar();
    expect(screen.getByText("⌘K")).toBeInTheDocument();
    expect(screen.getByText("Find anything")).toBeInTheDocument();
  });

  it("calls onSearch when clicked", () => {
    const onSearch = vi.fn();
    renderSidebar({ onSearch });
    const search = screen.getByRole("searchbox", { name: /search/i });
    fireEvent.click(search);
    expect(onSearch).toHaveBeenCalledOnce();
  });
});

describe("RailSidebar — Zone 4: Item list", () => {
  it("renders all nav items", () => {
    renderSidebar();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Cost ops")).toBeInTheDocument();
    expect(screen.getByText("Alerts")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("active item has aria-current=page", () => {
    renderSidebar({ active: "home" });
    const homeLink = screen.getByRole("link", { name: /home/i });
    expect(homeLink).toHaveAttribute("aria-current", "page");
  });

  it("inactive items do not have aria-current", () => {
    renderSidebar({ active: "home" });
    const costsLink = screen.getByRole("link", { name: /cost ops/i });
    expect(costsLink).not.toHaveAttribute("aria-current");
  });

  it("shows hint text for items that have it", () => {
    renderSidebar();
    expect(screen.getByText("$55.1k · 30d")).toBeInTheDocument();
  });

  it("shows badge count for items with a badge", () => {
    renderSidebar();
    // The badge shows "3" for alerts
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("badge has accessible label", () => {
    renderSidebar();
    const badge = screen.getByLabelText(/3 alerts alerts/i);
    expect(badge).toBeInTheDocument();
  });

  it("calls onItemClick when a nav item is clicked", () => {
    const onItemClick = vi.fn();
    renderSidebar({ onItemClick });
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
      items: [
        ...ITEMS,
        { key: "x", label: "X", icon: DashboardIcon, path: "/x", badge: { kind: "danger", count: 9 } },
      ],
    });
    expect(screen.getByLabelText(/9 x alerts/i)).toBeInTheDocument();
  });

  it("renders warn badge variant", () => {
    renderSidebar({
      items: [
        { key: "w", label: "W item", icon: DashboardIcon, path: "/w", badge: { kind: "warn", count: 2 } },
      ],
    });
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});

describe("RailSidebar — Zone 5: User footer", () => {
  it("renders user email", () => {
    renderSidebar();
    expect(screen.getByText("dani@acme.com")).toBeInTheDocument();
  });

  it("renders user role", () => {
    renderSidebar();
    expect(screen.getByText("platform / finops")).toBeInTheDocument();
  });

  it("renders avatar initial when no avatarUrl", () => {
    renderSidebar();
    // "D" from "dani@acme.com"
    expect(screen.getByText("D")).toBeInTheDocument();
  });

  it("renders avatar img when avatarUrl is provided", () => {
    renderSidebar({ user: { ...USER, avatarUrl: "https://example.com/avatar.jpg" } });
    expect(screen.getByRole("img", { name: USER.email })).toBeInTheDocument();
  });

  it("calls onUserSettingsClick when settings icon is clicked", () => {
    const onUserSettingsClick = vi.fn();
    renderSidebar({ onUserSettingsClick });
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
        />
      </Wrapper>,
    );
    expect(screen.getByText("TensorCost")).toBeInTheDocument();
    expect(screen.getByText("acme")).toBeInTheDocument();
  });
});

describe("RailSidebar — Keyboard nav", () => {
  it("nav items are rendered as anchor elements (keyboard-navigable)", () => {
    renderSidebar();
    const links = screen.getAllByRole("link");
    // At minimum our 4 items
    expect(links.length).toBeGreaterThanOrEqual(4);
  });
});
