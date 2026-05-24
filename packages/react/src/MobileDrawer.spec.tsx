import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { Dashboard as DashboardIcon, AttachMoney as AttachMoneyIcon } from "@mui/icons-material";
import { createTensorTheme } from "./theme.js";
import { MobileDrawer, type MobileNavItem, type MobileDrawerUser } from "./MobileDrawer.js";

const ITEMS: MobileNavItem[] = [
  { key: "home",  label: "Home",     icon: DashboardIcon,   path: "/" },
  { key: "costs", label: "Cost ops", icon: AttachMoneyIcon, path: "/costs", hint: "$55k" },
];

const USER: MobileDrawerUser = { email: "dani@acme.com", role: "platform / finops" };

function Wrapper({ children, mode = "light" }: { children: React.ReactNode; mode?: "light" | "dark" }) {
  return (
    <ThemeProvider theme={createTensorTheme(mode)}>{children}</ThemeProvider>
  );
}

function renderDrawer(props: Partial<React.ComponentProps<typeof MobileDrawer>> = {}) {
  return render(
    <Wrapper>
      <MobileDrawer
        open={true}
        active="home"
        items={ITEMS}
        tenant="acme"
        env="production"
        user={USER}
        alertsCount={0}
        onClose={vi.fn()}
        {...props}
      />
    </Wrapper>,
  );
}

describe("MobileDrawer — render", () => {
  it("renders brand wordmark when open", () => {
    renderDrawer();
    expect(screen.getByText("TensorCost")).toBeInTheDocument();
  });

  it("renders tenant name", () => {
    renderDrawer();
    expect(screen.getByText("acme")).toBeInTheDocument();
  });

  it("renders nav items", () => {
    renderDrawer();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Cost ops")).toBeInTheDocument();
  });

  it("renders user email", () => {
    renderDrawer();
    expect(screen.getByText("dani@acme.com")).toBeInTheDocument();
  });

  it("renders user role", () => {
    renderDrawer();
    expect(screen.getByText("platform / finops")).toBeInTheDocument();
  });

  it("active item has aria-current=page", () => {
    renderDrawer({ active: "home" });
    const homeLink = screen.getByRole("link", { name: /home/i });
    expect(homeLink).toHaveAttribute("aria-current", "page");
  });

  it("renders search input", () => {
    renderDrawer();
    expect(screen.getByText("Find anything")).toBeInTheDocument();
  });
});

describe("MobileDrawer — open/close animation state", () => {
  it("drawer is visible (not translateX(-100%)) when open=true", () => {
    const { container } = renderDrawer({ open: true });
    const drawer = container.querySelector("aside");
    expect(drawer).not.toBeNull();
    // When open, transform should be translateX(0)
    const style = window.getComputedStyle(drawer!);
    // We can't easily test CSS-in-JS transform via jsdom computed styles,
    // so test that the aria-hidden state is correct instead.
    const outerBox = container.querySelector("[aria-hidden]");
    // aria-hidden should be "false" (or absent) when open
    expect(outerBox?.getAttribute("aria-hidden")).toBe("false");
  });

  it("drawer has aria-hidden=true when open=false", () => {
    const { container } = renderDrawer({ open: false });
    const outerBox = container.querySelector("[aria-hidden]");
    expect(outerBox?.getAttribute("aria-hidden")).toBe("true");
  });
});

describe("MobileDrawer — dismiss behaviors", () => {
  it("calls onClose when scrim is clicked", () => {
    const onClose = vi.fn();
    const { container } = renderDrawer({ onClose });
    // Scrim is the first div inside the outer box (before the aside)
    const scrim = container.querySelector("[aria-label='Close navigation menu']");
    expect(scrim).not.toBeNull();
    fireEvent.click(scrim!);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when ESC key is pressed", () => {
    const onClose = vi.fn();
    renderDrawer({ onClose, open: true });
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does not call onClose on ESC when drawer is closed", () => {
    const onClose = vi.fn();
    renderDrawer({ onClose, open: false });
    fireEvent.keyDown(document, { key: "Escape" });
    // When closed the event listener is not registered
    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls onClose when swipe-left >40px", () => {
    const onClose = vi.fn();
    const { container } = renderDrawer({ onClose, open: true });
    const drawer = container.querySelector("aside")!;

    // Simulate swipe from x=200 to x=150 (delta=-50, which is <-40)
    fireEvent.touchStart(drawer, { touches: [{ clientX: 200 }] });
    fireEvent.touchEnd(drawer, { changedTouches: [{ clientX: 150 }] });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does not call onClose when swipe-left is less than threshold (40px)", () => {
    const onClose = vi.fn();
    const { container } = renderDrawer({ onClose, open: true });
    const drawer = container.querySelector("aside")!;

    // Swipe from 200 to 170 (delta=-30, which is >-40)
    fireEvent.touchStart(drawer, { touches: [{ clientX: 200 }] });
    fireEvent.touchEnd(drawer, { changedTouches: [{ clientX: 170 }] });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("does not call onClose on swipe-right", () => {
    const onClose = vi.fn();
    const { container } = renderDrawer({ onClose, open: true });
    const drawer = container.querySelector("aside")!;

    fireEvent.touchStart(drawer, { touches: [{ clientX: 100 }] });
    fireEvent.touchEnd(drawer, { changedTouches: [{ clientX: 200 }] });
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe("MobileDrawer — callbacks", () => {
  it("calls onItemClick when a nav item is clicked", () => {
    const onItemClick = vi.fn();
    renderDrawer({ onItemClick });
    fireEvent.click(screen.getByRole("link", { name: /cost ops/i }));
    expect(onItemClick).toHaveBeenCalledWith(expect.objectContaining({ key: "costs" }));
  });

  it("calls onTenantClick when tenant chip is clicked", () => {
    const onTenantClick = vi.fn();
    renderDrawer({ onTenantClick });
    fireEvent.click(screen.getByRole("button", { name: /switch tenant/i }));
    expect(onTenantClick).toHaveBeenCalledOnce();
  });

  it("calls onUserSettingsClick when settings icon is clicked", () => {
    const onUserSettingsClick = vi.fn();
    renderDrawer({ onUserSettingsClick });
    fireEvent.click(screen.getByRole("button", { name: /user settings/i }));
    expect(onUserSettingsClick).toHaveBeenCalledOnce();
  });
});

describe("MobileDrawer — dark mode", () => {
  it("renders in dark mode without errors", () => {
    render(
      <Wrapper mode="dark">
        <MobileDrawer
          open={true}
          active="home"
          items={ITEMS}
          tenant="acme"
          env="production"
          user={USER}
          alertsCount={2}
          onClose={vi.fn()}
        />
      </Wrapper>,
    );
    expect(screen.getByText("TensorCost")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// onEnvClick — split tenant chip
// ---------------------------------------------------------------------------

describe("MobileDrawer — onEnvClick (split chip)", () => {
  it("renders two separate buttons when onEnvClick is provided", () => {
    const onTenantClick = vi.fn();
    const onEnvClick = vi.fn();
    renderDrawer({ onTenantClick, onEnvClick });
    expect(screen.getByRole("button", { name: /switch tenant: acme/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /switch environment: production/i })).toBeInTheDocument();
  });

  it("left zone fires onTenantClick", () => {
    const onTenantClick = vi.fn();
    const onEnvClick = vi.fn();
    renderDrawer({ onTenantClick, onEnvClick });
    fireEvent.click(screen.getByRole("button", { name: /switch tenant: acme/i }));
    expect(onTenantClick).toHaveBeenCalledOnce();
    expect(onEnvClick).not.toHaveBeenCalled();
  });

  it("right zone fires onEnvClick", () => {
    const onTenantClick = vi.fn();
    const onEnvClick = vi.fn();
    renderDrawer({ onTenantClick, onEnvClick });
    fireEvent.click(screen.getByRole("button", { name: /switch environment: production/i }));
    expect(onEnvClick).toHaveBeenCalledOnce();
    expect(onTenantClick).not.toHaveBeenCalled();
  });

  it("single combined button when onEnvClick is omitted (backwards-compat)", () => {
    const onTenantClick = vi.fn();
    renderDrawer({ onTenantClick });
    const btn = screen.getByRole("button", { name: /switch tenant: acme \/ production/i });
    fireEvent.click(btn);
    expect(onTenantClick).toHaveBeenCalledOnce();
  });
});

// ---------------------------------------------------------------------------
// logoSlot — user feedback 2026-05-19
// ---------------------------------------------------------------------------

describe("MobileDrawer — logoSlot prop", () => {
  it("renders logoSlot node when provided", () => {
    renderDrawer({ logoSlot: <span>REAL-LOGO</span> });
    expect(screen.getByText("REAL-LOGO")).toBeInTheDocument();
    expect(screen.queryByText("TensorCost")).not.toBeInTheDocument();
  });

  it("falls back to gradient + TensorCost text when logoSlot is omitted", () => {
    renderDrawer();
    expect(screen.getByText("TensorCost")).toBeInTheDocument();
  });
});
