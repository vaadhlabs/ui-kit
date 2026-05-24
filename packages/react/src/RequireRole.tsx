import type { ReactElement, ReactNode } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { LockOutlined as LockIcon } from "@mui/icons-material";

/**
 * Role-gate wrapper for tenant-facing pages whose backends are protected by
 * `@RequireRole(...)` server-side. The newest admin pages do not inline-check
 * roles — a curious tenant_admin who URL-types `/admin/plan-defaults` reaches
 * the page, sees the title, and waits on a spinner that never resolves until
 * the GET 403s. That UX is bad even though the backend correctly refuses the
 * call.
 *
 * `<RequireRole>` short-circuits that path: if the caller's effective roles
 * don't intersect the `allow` allowlist, render a friendly "no access" panel
 * instead of mounting the page body. The backend 403 still stands as
 * defense-in-depth — this wrapper is purely UX.
 *
 * Roles are passed in by the caller (typically pulled from the MF-SDK's
 * `useShellConfig().user?.roles`) so the wrapper itself stays decoupled from
 * any specific auth context module — the same component works in the shell,
 * in MFs, and in widget mounts where the role source differs.
 *
 * Tenant_finance users are NEVER auto-included. If a page should be visible
 * to finance, list `tenant_finance` explicitly in `allow`.
 */
export type RequireRoleRole =
  | "user"
  | "tenant_admin"
  | "tenant_finance"
  | "global_admin";

export interface RequireRoleProps {
  /** Roles that may view the children. Empty array hides from everyone. */
  allow: ReadonlyArray<RequireRoleRole>;
  /** Caller's effective roles on the active tenant. `undefined` is treated as "still loading" (default-deny). */
  userRoles: ReadonlyArray<RequireRoleRole> | undefined;
  children: ReactNode;
  /** Optional override for the friendly heading shown on denial. */
  deniedTitle?: string;
  /** Optional override for the friendly body shown on denial. */
  deniedBody?: string;
}

export function RequireRole({
  allow,
  userRoles,
  children,
  deniedTitle = "You don't have access to this page",
  deniedBody = "Your account doesn't have the role required to view this page. If you think this is a mistake, ask a tenant admin to grant the right membership role.",
}: RequireRoleProps): ReactElement {
  // global_admin is the cross-tenant operator and satisfies every gate —
  // mirrors the server-side @RequireRole semantics.
  const granted =
    !!userRoles &&
    (userRoles.includes("global_admin") || userRoles.some((r) => allow.includes(r)));

  if (granted) return <>{children}</>;

  return (
    <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          maxWidth: 560,
          p: 4,
          textAlign: "center",
          borderColor: "divider",
        }}
        role="alert"
        aria-live="polite"
      >
        <LockIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {deniedTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {deniedBody}
        </Typography>
      </Paper>
    </Box>
  );
}
