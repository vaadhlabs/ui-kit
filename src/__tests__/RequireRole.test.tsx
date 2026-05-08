import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { RequireRole } from "../RequireRole.js";

describe("RequireRole", () => {
  it("renders children when the user has an allowed role", () => {
    render(
      <RequireRole allow={["tenant_admin"]} userRoles={["tenant_admin"]}>
        <div>secret content</div>
      </RequireRole>,
    );
    expect(screen.getByText("secret content")).toBeInTheDocument();
  });

  it("renders the denial panel when the user has no allowed role", () => {
    render(
      <RequireRole allow={["global_admin"]} userRoles={["user"]}>
        <div>secret content</div>
      </RequireRole>,
    );
    expect(screen.queryByText("secret content")).not.toBeInTheDocument();
    expect(screen.getByText("You don't have access to this page")).toBeInTheDocument();
  });

  it("global_admin satisfies any allowlist (cross-tenant operator)", () => {
    render(
      <RequireRole allow={["tenant_admin"]} userRoles={["global_admin"]}>
        <div>secret content</div>
      </RequireRole>,
    );
    expect(screen.getByText("secret content")).toBeInTheDocument();
  });

  it("default-denies when userRoles is undefined (still loading /me)", () => {
    render(
      <RequireRole allow={["tenant_admin"]} userRoles={undefined}>
        <div>secret content</div>
      </RequireRole>,
    );
    expect(screen.queryByText("secret content")).not.toBeInTheDocument();
    expect(screen.getByText("You don't have access to this page")).toBeInTheDocument();
  });

  it("default-denies when userRoles is empty (membership not yet derived)", () => {
    render(
      <RequireRole allow={["tenant_admin"]} userRoles={[]}>
        <div>secret content</div>
      </RequireRole>,
    );
    expect(screen.queryByText("secret content")).not.toBeInTheDocument();
  });

  it("respects deniedTitle / deniedBody overrides", () => {
    render(
      <RequireRole
        allow={["global_admin"]}
        userRoles={["user"]}
        deniedTitle="Operators only"
        deniedBody="Ping #ops to be added."
      >
        <div>x</div>
      </RequireRole>,
    );
    expect(screen.getByText("Operators only")).toBeInTheDocument();
    expect(screen.getByText("Ping #ops to be added.")).toBeInTheDocument();
  });

  it("does not auto-elevate tenant_finance to tenant_admin surfaces", () => {
    // Finance is a peer, not a subset — it must not satisfy a tenant_admin
    // allowlist unless explicitly listed.
    render(
      <RequireRole allow={["tenant_admin"]} userRoles={["tenant_finance"]}>
        <div>secret</div>
      </RequireRole>,
    );
    expect(screen.queryByText("secret")).not.toBeInTheDocument();
  });
});
