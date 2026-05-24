export * from "./theme.js";
export * from "./workshop-theme.js";
export * from "./section.js";
export * from "./SectionHeader.js";
export * from "./ThemeShellProvider.js";
export * from "./MetricCard.js";
export * from "./MetricCardWorkshop.js";
export * from "./WorkshopCard.js";
export * from "./tone.js";
export * from "./charts.js";
export * from "./DataTable.js";
export * from "./DataListPage.js";
export * from "./RowDetailsDialog.js";
export * from "./SavingsBanner.js";
export * from "./useSavingsBanner.js";
export * from "./RequireRole.js";

// Navrail (2026-05-19) — Rail redesign primitives
// Spec: design_handoff_navigation_rail/README.md
export * from "./StatusBadge.js";
export * from "./WorkflowCard.js";
export * from "./WorkflowPage.js";
export * from "./RailSidebar.js";
export * from "./MobileTopBar.js";
export * from "./MobileDrawer.js";
export * from "./RowPreviewDrawer.js";

// Marketing primitives (Phase 3a, 2026-05-24) — ported from @tensorcost/component-library
// CMS-driven sections for landing pages and product overviews.
// See marketing/index.ts for the per-component map.
export * from "./marketing/index.js";

// v2 blueprint primitives (W1-2, 2026-05-24) — architectural-drawing
// vocabulary for the 5-surface IA. Hairline ink on warm vellum, single
// signal accent, no rounded corners. Ships alongside Workshop primitives
// in 1.0.0; Workshop sunsets in 2.0.0 after MFs migrate.
// See blueprint/index.ts for the per-component map.
export * from "./blueprint/index.js";
