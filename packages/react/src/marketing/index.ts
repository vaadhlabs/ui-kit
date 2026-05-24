// Marketing primitives — ported from @tensorcost/component-library in Phase 3a.
//
// Two tiers in @tensorcost/ui-kit: app-chrome primitives (MetricCard, DataTable,
// RailSidebar, etc., exported from packages/react/src/index.ts) and marketing
// primitives (this barrel — CMS-driven sections built for landing pages,
// product overviews, marketing site).
//
// Naming convention: marketing components that overlap with a generic name
// from the app-chrome tier are prefixed `Marketing*` (e.g., MarketingHero,
// MarketingContentBlock, MarketingCTABanner). Standalone marketing primitives
// keep their natural name (Testimonials, FeatureGrid, etc.).

// Content & markdown
export * from "./MarkdownBody.js";
export * from "./MarketingContentBlock.js";
export * from "./TabsSection.js";

// Top-of-page conversion
export * from "./MarketingHero.js";
export * from "./MarketingCTABanner.js";

// Social proof tier
export * from "./Testimonials.js";
export * from "./FAQAccordion.js";
export * from "./Timeline.js";
export * from "./ProofSection.js";

// Display / data
export * from "./FeatureGrid.js";
export * from "./LogosStrip.js";
export * from "./StatsCounter.js";
export * from "./StatsStrip.js";
export * from "./ImageGallery.js";
export * from "./VideoEmbed.js";

// Comparison / pilot / guarantee
export * from "./ComparisonTable.js";
export * from "./PilotFindings.js";
export * from "./Guarantee.js";
