# Porting plan — @tensorcost/component-library → @tensorcost/ui-kit

Read-only classification done 2026-05-24. No code changes in this commit. Phase 3 of the
ui-kit roadmap (see `../PLAN.md`).

---

## TL;DR

37 total exported symbols across 21 display/content/data/form components + 3 renderers +
6 hooks + 1 context. Classification: 13 PORT, 1 MERGE, 10 DROP (renderers + Strapi-bound
code), 13 DEFER (form primitives that duplicate MUI's built-in form system). No framer-motion
animation is actually used in any of these components despite it being listed as a runtime
dep — every visual transition is a CSS `transition` on inline styles. MUI 7 handles all of
that, so framer-motion does not follow the port. react-markdown + rehype-raw follow three
components (ContentBlock, MarkdownRichText, TabsSection). lucide-react is used heavily
across the display tier; the icon aliases in FeatureGrid and StatsCounter make bulk
replacement to `@mui/icons-material` straightforward for the common set (12 of ~18 aliases
map 1:1), with four marketing-specific icons (BrainCircuit, LineChart, Gauge, GitBranch)
that need a MUI fallback decision per icon.

Key risks: (1) DataTable name collision — both libraries export a `DataTable` and they are
fundamentally different contracts; the merge requires a conscious interface decision. (2)
PricingTable has live Stripe-fetch logic coupled to StrapiContext that must be untangled
before port. (3) MarkdownRichText carries rehype-raw (raw HTML passthrough) — acceptable
in a marketing context, a potential XSS vector if inadvertently exposed in the app shell.

Rough effort: Phase 3a ~2–3 days, Phase 3b ~1.5 days, Phase 3c ~1 day decision + 1 day
if we extract, Phase 3d ~0.5 day.

---

## Inventory by category

### content/

| Component | Purpose | Deps | ui-kit overlap | Class | Notes |
|---|---|---|---|---|---|
| `ContentBlock` | CMS long-form section: eyebrow + h2 + markdown body, configurable padding/alignment/bg | clsx, react-markdown, rehype-raw (via MarkdownRichText) | `SectionHeader` (partial — title+subtitle only, no body) | PORT | Rename to `<MarketingContentBlock>`. MUI `Typography` variants replace inline fontSize/fontWeight literals. Keep react-markdown for the body — a marketing CMS will always need markdown passthrough. |
| `CustomHTML` | Renders arbitrary HTML/CSS/JS either sandboxed in an iframe or injected directly | clsx | none | DROP | XSS footgun. Belongs in a `@tensorcost/strapi-renderer` package or stays in component-library. Not safe to expose from ui-kit. |
| `MarkdownRichText` | Thin wrapper around react-markdown + rehype-raw with shared element styling | clsx, react-markdown, rehype-raw | none | PORT | Rename to `<MarkdownBody>`. This is the shared primitive that ContentBlock, FeatureGrid, ProductScreenshot, and Proof all compose. Port it first. One security note: rehype-raw allows raw HTML nodes in markdown — document the trust boundary (only for CMS-authored content, never for user-submitted content). |

### data/

| Component | Purpose | Deps | ui-kit overlap | Class | Notes |
|---|---|---|---|---|---|
| `DataTable` | Marketing-page data table with search, sort, pagination; fetches from static data, a REST API, or Strapi | clsx, lucide-react (Search, ChevronUp/Down/Left/Right), StrapiContext | **`DataTable.tsx`** in `packages/react/src/DataTable.tsx` — MUI Table, TypeScript-generic, no built-in search/pagination | MERGE | Contracts differ significantly. The component-library version is a self-contained section-level table for CMS-driven content. The ui-kit version is a low-level controlled MUI table primitive. Plan: keep the ui-kit `DataTable` as the core primitive; expose a `<MarketingDataTable>` wrapper on top of it that adds the search + pagination shell. The Strapi data-source path (useStrapi hook) stays in the strapi-renderer package, not in ui-kit. |

### display/

| Component | Purpose | Deps | ui-kit overlap | Class | Notes |
|---|---|---|---|---|---|
| `CTABanner` | Full-width call-to-action strip with gradient/solid bg and one button | clsx, Button (internal) | `SavingsBanner.tsx` (`packages/react/src/SavingsBanner.tsx`) has the same visual shape (gradient Paper + headline + action button) but it's domain-specific (savings copy, cents inputs) | PORT | Rename to `<MarketingCTABanner>`. SavingsBanner is intentionally domain-specific — they don't conflict. MUI `Paper` + `Button` replace inline styles. |
| `Comparison` | Two-column "them vs us" table, self-contained CSS via injected `<style>` tag | clsx | none | PORT | Rename to `<ComparisonTable>`. Replace the injected `<style>` block with MUI `sx` props and CSS-in-JS — the injected style approach leaks into the global scope and is fragile in a micro-frontend context. |
| `FAQAccordion` | FAQ section with expand/collapse, single or multi-open | clsx, lucide-react (ChevronDown) | none | PORT | MUI `Accordion` / `AccordionSummary` / `AccordionDetails` give this for free with better accessibility. Replace lucide ChevronDown with MUI's built-in expansion icon. Rename to `<FAQAccordion>` (same name is fine; the content is unique). |
| `FeatureGrid` | Feature cards in a responsive grid, each card with icon (lucide), image, title, markdown description, optional link | clsx, lucide-react (`* as Icons`), react-markdown, rehype-raw | none | PORT | Rename to `<FeatureGrid>`. Icon resolution: the 18-name `ICON_ALIASES` map all have 1:1 counterparts in `@mui/icons-material` (DollarSign → AttachMoney is the one rename; all others are exact). Drop the wildcard lucide import; convert to named MUI icon imports per alias. |
| `Guarantee` | Trust callout card with a badge circle, eyebrow, title, body | clsx | none | PORT | Clean, no external deps beyond clsx. MUI Paper + Typography + Avatar replace inline styles. |
| `Hero` | Marketing hero section with gradient/dark/light/wave/split variants, optional bg image/video, two CTAs, eyebrow, trust line | clsx, Button (internal) | none | PORT | Rename to `<MarketingHero>`. No framer-motion calls despite it being listed as a dep. MUI `Box` replaces inline styles; keep the video/overlay logic as-is. The `variant` prop maps cleanly to `sx` theme variants. |
| `ImageGallery` | Responsive image grid with lightbox carousel | clsx, lucide-react (X, ChevronLeft, ChevronRight) | none | PORT | Rename to `<ImageGallery>`. MUI Dialog replaces the custom fixed-position lightbox — better keyboard handling, focus trap, a11y. lucide icons can swap to MUI (Close, ChevronLeft, ChevronRight all exist in `@mui/icons-material`). |
| `LogosStrip` | Customer/partner logo row, grayscale-on-hover, handles img + text + outline variants | clsx | none | PORT | Clean visually. MUI Box + theming handles the hover grayscale transition via sx. No icon dep. |
| `PilotFindings` | Stat-card grid showing pilot findings with a large numeric range, label, note, optional CTA | clsx | `MetricCard.tsx` (`packages/react/src/MetricCard.tsx`) shares the "big number + label" card shape | PORT | They serve different purposes (PilotFindings is a marketing section; MetricCard is a dashboard primitive), so no merge. But the porting agent should look at MetricCard's Card/Typography patterns as a reference implementation — the visual shape is close enough to converge on the same MUI component stack. |
| `PricingTable` | Monthly/yearly toggle + plan cards with feature checklist; fetches live Stripe prices via StrapiContext when static `plans` is empty | clsx, lucide-react (Check, X), Button (internal), StrapiContext (optional) | none | PORT (with untangling) | This is the most complex PORT. The Stripe-fetch path uses `useStrapi()` — that coupling must be extracted before port. Plan: ui-kit receives `plans` as a prop only (pure display). A companion `useLivePricing()` hook in `@tensorcost/strapi-renderer` wraps the fetch and passes plans down. The grouping logic (`groupStripePricesByTier`, `tierToCard`) is pure data transformation with zero React — move to a shared utils module in the port. |
| `ProductScreenshot` | Split or centered layout with eyebrow/title/body text + screenshot frame; includes a hardcoded `DashboardMockup` component as a fallback when no image is provided | clsx, react-markdown, rehype-raw (via MarkdownRichText) | none | PORT | Rename to `<ProductScreenshot>`. The `DashboardMockup` inner component hardcodes TensorCost product data (savings rows, "tensorcost.app" URL bar) — it's a marketing asset, not a generic component. Either extract it to a separate file (`<TensorCostDashboardMockup>`) or leave it inlined; document that it's not a generic primitive. |
| `Proof` | Dark-background "verify it yourself" section with a macOS-style terminal block and copy + CTA | clsx, react-markdown, rehype-raw (via MarkdownRichText) | none | PORT | Clean split-layout. The terminal mockup is pure CSS. Rename to `<ProofSection>` to avoid conflict with any future assertion library export. |
| `StatsCounter` | Animated count-up stats grid on scroll visibility (IntersectionObserver) | clsx, lucide-react (`* as Icons`) | `MetricCard.tsx` partially — MetricCard shows a single metric with formatting, no animation | PORT | Keep the IntersectionObserver animation logic — it's a marketing page feature MUI doesn't replicate. MUI icons replace lucide for the icon slot. |
| `StatsStrip` | Simple horizontal stats bar with large colored numbers and small labels, light/dark variant | clsx | `MetricCard.tsx` has a similar single-stat shape | PORT | Simpler than StatsCounter. No deps beyond clsx. MetricCard is the dashboard primitive; StatsStrip is the marketing-page section. They don't conflict. |
| `TabsSection` | Tab navigation with underline/pills/boxed style, tab content rendered as markdown | clsx, lucide-react (`* as Icons`), react-markdown, rehype-raw | none | PORT | MUI `Tabs` / `Tab` replaces the hand-rolled tab header (better a11y, ARIA roles, keyboard nav). Keep react-markdown for tab content. lucide icons in tab headers → MUI icons. |
| `Testimonials` | Carousel or grid of testimonial cards with auto-advance, star rating, author avatar | clsx, lucide-react (ChevronLeft, ChevronRight, Star) | none | PORT | MUI Card replaces inline card styling. The carousel auto-advance logic is fine as-is. Star → MUI `StarIcon`; ChevronLeft/Right → MUI equivalents. |
| `Timeline` | Vertical alternating timeline with icon dots and content cards | clsx, lucide-react (`* as Icons`) | none | PORT | Clean implementation. MUI `Timeline` in `@mui/lab` is an option but adds a dev dep; given the simple visual requirements, a custom MUI Box/Paper layout is lighter. Decision left to porting agent. |
| `VideoEmbed` | YouTube/Vimeo/mp4 embed with poster image, play button overlay, and lazy load | clsx, lucide-react (Play) | none | PORT | Rename to `<VideoEmbed>`. Play → MUI `PlayArrowIcon`. Otherwise self-contained. |

### forms/

All seven standalone form primitives (Button, Checkbox, DatePicker, FileUpload, RadioGroup,
Select, TextArea, TextField) are hand-rolled HTML form controls with custom styling. MUI 7
ships `Button`, `Checkbox`, `DatePicker` (via `@mui/x-date-pickers`), `Select`, `TextField`,
`TextArea` (via `TextField` multiline), and `RadioGroup` with fully accessible, themeable
implementations. Porting these as custom components into ui-kit would immediately create a
parallel form system alongside MUI, which is what we're trying to avoid.

| Component | Class | Notes |
|---|---|---|
| `Button` | DEFER/DROP | MUI `Button` covers all variants (primary, secondary, outlined, text). The "scroll target" feature (`type="scroll"`) is a minor addition — can be a small `<ScrollButton>` wrapper if website/ needs it. No standalone port into ui-kit. |
| `Checkbox` | DEFER/DROP | MUI `Checkbox` + `FormControlLabel`. |
| `DatePicker` | DEFER/DROP | `@mui/x-date-pickers` `DatePicker`. |
| `FileUpload` | DEFER | No MUI built-in equivalent. If website/ needs a styled dropzone, port as `<FileDropzone>` in Phase 3b or later, wrapping a plain `<input type="file">` in MUI Paper styling. |
| `FormSection` | DROP | Strapi form schema renderer. Belongs in `@tensorcost/strapi-renderer`. Its submission logic (`onFormSubmit` prop → `StrapiContext.submitForm`) is explicitly Strapi-coupled. |
| `RadioGroup` | DEFER/DROP | MUI `RadioGroup` + `FormControlLabel`. |
| `Select` | DEFER/DROP | MUI `Select`. |
| `TextArea` | DEFER/DROP | MUI `TextField` multiline. |
| `TextField` | DEFER/DROP | MUI `TextField`. |

> Decision rule on DEFER vs DROP for the native form primitives: they are DROP from the
> ui-kit perspective (don't add them as named exports). They stay alive in component-library
> for as long as `FormRenderer` (a DROP) needs them. When `@tensorcost/strapi-renderer` is
> extracted (Phase 3c), the form primitives either follow it or get replaced by MUI.

---

## Non-component code

- **`context/StrapiContext.jsx`** — DROP from ui-kit. Provides `apiUrl`, `siteSlug`, and
  fetch/submit helpers scoped to a Strapi instance. This is a runtime dependency on Strapi's
  API shape; it belongs in a `@tensorcost/strapi-renderer` package (new) or stays in
  component-library if we don't extract.

- **`renderer/PageRenderer.jsx`** — DROP. Renders a complete page from Strapi page data by
  delegating to ComponentRenderer. Entirely Strapi-schema-aware (`page.attributes.layout`,
  `page.documentId`, etc.). No place in ui-kit.

- **`renderer/ComponentRenderer.jsx`** — DROP. The Strapi component registry
  (`layout.hero` → `<Hero>`, etc.). This is the glue between the CMS and the display
  components; it belongs in `@tensorcost/strapi-renderer`.

- **`renderer/FormRenderer.jsx`** — DROP. Dynamic form renderer driven by a Strapi form
  definition. Depends on `useForm` hook and all form primitives. Same package boundary as
  ComponentRenderer.

- **`hooks/useAnalytics.js`** — DROP from ui-kit. Injects GA4, GTM, Facebook Pixel, and
  Hotjar scripts via DOM manipulation. Marketing-site-specific; belongs in component-library
  or a future `@tensorcost/analytics` package. Not a UI primitive.

- **`hooks/useForm.js`** — DEFER. A Strapi-field-schema-aware form state manager (validation,
  conditional display, touched/error tracking). It's reasonably generic — the only schema
  coupling is `field.conditionalDisplay`. If the porting team extracts `@tensorcost/strapi-renderer`
  in Phase 3c, this hook goes there. If we want a generic form-state hook in ui-kit later,
  write a new one based on MUI patterns (or use react-hook-form). Don't bring this one in as-is.

- **`hooks/useFormSubmission.js`** — DROP. Thin wrapper around `StrapiContext.submitForm`.
  Strapi-coupled. Goes to `@tensorcost/strapi-renderer`.

- **`hooks/useNavigation.js`** — DROP. Fetches all Strapi pages and builds a navigation
  tree. Strapi-coupled (`fetchAllPages`, `page.attributes`, `parentPage.data.attributes.slug`).
  Goes to `@tensorcost/strapi-renderer`.

- **`hooks/usePage.js`** — DROP. Fetches a Strapi page by `pageType` enum or `customSlug`.
  The `PAGE_TYPE_ROUTES` map is the tensorcost marketing-site URL structure hardcoded into a
  hook. Not a generic primitive. Goes to `@tensorcost/strapi-renderer`.

- **`hooks/useSiteConfig.js`** — DROP. Fetches Strapi site config (branding, navigation,
  footer, analytics integrations). Strapi-coupled. Goes to `@tensorcost/strapi-renderer`.

---

## Runtime dependencies to absorb

**If all 13 PORT components land in ui-kit**, the new dependencies ui-kit picks up:

| Dep | Version | What needs it | Decision |
|---|---|---|---|
| `react-markdown` | `^9.0.1` | MarkdownBody, ContentBlock, FeatureGrid, ProductScreenshot, Proof, TabsSection | **Add as peer dep.** Marketing components are the only callers; app-shell consumers shouldn't pay the parse cost. |
| `rehype-raw` | `^7.0.0` | Same as above | **Add as peer dep** alongside react-markdown. |
| `framer-motion` | `^11.15.0` | **None** — not actually used in any component despite being in package.json | **Do not add.** component-library listed it as a dep but no component imports it. |

ui-kit currently peer-deps: `@emotion/react`, `@emotion/styled`, `@mui/icons-material ^5.16`,
`@mui/material ^5.16`, `react ^18.3`, `react-dom ^18.3`, `recharts ^2.13`. The MUI icons
package already covers all lucide icons used across the PORT components except two (see below).

**Icon decision record** — lucide-react vs. `@mui/icons-material`:

The PORT components use lucide-react for ~20 distinct icons. The `ICON_ALIASES` in
FeatureGrid map 18 semantic names. Cross-referencing against `@mui/icons-material`:

| lucide | MUI equivalent | 1:1? |
|---|---|---|
| ChevronDown, ChevronUp, ChevronLeft, ChevronRight | same names | yes |
| Search | SearchIcon | yes |
| Check | CheckIcon | yes |
| X, XCircle | CloseIcon | close (visual equivalent) |
| Star | StarIcon | yes |
| Play | PlayArrowIcon | yes (shape is equivalent) |
| Calendar | CalendarTodayIcon | yes |
| Upload | UploadIcon | yes |
| File | InsertDriveFileIcon | close |
| DollarSign (alias: cost) | AttachMoneyIcon | yes (renamed) |
| Cpu (alias: gpu, cpu) | MemoryIcon | close |
| Shield | SecurityIcon | yes |
| RefreshCw (alias: sync) | SyncIcon | yes |
| FileCheck2 (alias: ledger) | FactCheckIcon | close |
| Lightbulb | LightbulbIcon | yes |
| PieChart (alias: cfo) | PieChartIcon | yes |
| BrainCircuit (alias: ml) | **no 1:1** | use `PsychologyIcon` or keep lucide |
| GitBranch (alias: route) | **no 1:1** | use `AccountTreeIcon` or keep lucide |
| Receipt (alias: finance) | ReceiptIcon | yes |
| Server (alias: platform) | StorageIcon | close |
| Database (alias: cache) | StorageIcon | duplicate of above — pick one |
| Gauge (alias: throughput) | SpeedIcon | yes |
| LineChart (alias: forecast) | ShowChartIcon | yes |
| AlertTriangle (alias: alert) | WarningAmberIcon | yes |

**Ruling**: replace all lucide icons with MUI equivalents except `BrainCircuit` and
`GitBranch` — keep lucide as a secondary icon source for those two. Document this as a
footnote in the ported `FeatureGrid` file. Do not add lucide-react as a new peer dep;
reference it as an optional peer dep for components that use it.

---

## Overlaps with existing ui-kit components

| component-library | ui-kit equivalent | Relationship | Merge strategy |
|---|---|---|---|
| `DataTable` (`components/data/DataTable.jsx`) | `DataTable.tsx` (`packages/react/src/DataTable.tsx`) | Name collision; different contracts. CL version: self-contained section-level table with search/pagination/strapi-fetch. ui-kit version: lean TypeScript-generic MUI Table primitive, no search/pagination. | Keep ui-kit `DataTable` as the core primitive. Port CL's search+pagination shell as `<MarketingDataTable>` wrapping the ui-kit table. Cite: `packages/react/src/DataTable.tsx` as the merge target. |
| `CTABanner` (display) | `SavingsBanner.tsx` (`packages/react/src/SavingsBanner.tsx`) | Same visual pattern (gradient Paper + headline + CTA button) but SavingsBanner is domain-specific. | No merge. SavingsBanner stays; CTABanner ports as `<MarketingCTABanner>`. |
| Any form primitive (Button, Checkbox, etc.) | MUI's own Button, Checkbox, etc. | MUI ships these natively in `@mui/material`. | No port. CL form primitives are DEFER/DROP; consumers rewrite to MUI directly. |
| `SectionHeader` analogy in Hero/ContentBlock | `SectionHeader.tsx` (`packages/react/src/SectionHeader.tsx`) | SectionHeader in ui-kit is a dashboard section header (title + action slot). ContentBlock's eyebrow+h2+body is a marketing content block. | No conflict; different contexts. Port ContentBlock as `<MarketingContentBlock>`. |
| `PilotFindings` large-number cards | `MetricCard.tsx` (`packages/react/src/MetricCard.tsx`) | Both show "big number + label" but MetricCard is a dashboard tile (MUI Card, click interactions, trend line); PilotFindings is a marketing section with a different layout. | Reference MetricCard patterns during port but no merge. |
| `StatsCounter` animated stats | `MetricCard.tsx` | Same visual neighborhood. | Port StatsCounter independently; the scroll-triggered count-up animation is not in MetricCard. |

---

## Recommended phase split

### Phase 3a — Port the clean, zero-overlap, no-Strapi components first

Low blast radius. These have no dependency on StrapiContext and no ui-kit name collision:

1. `MarkdownRichText` → `<MarkdownBody>` (prerequisite for everything below that uses it)
2. `LogosStrip` → `<LogosStrip>`
3. `Guarantee` → `<GuaranteeCard>`
4. `StatsStrip` → `<StatsStrip>`
5. `Comparison` → `<ComparisonTable>`
6. `VideoEmbed` → `<VideoEmbed>`
7. `ImageGallery` → `<ImageGallery>`
8. `Hero` → `<MarketingHero>`
9. `CTABanner` → `<MarketingCTABanner>`
10. `PilotFindings` → `<PilotFindings>`
11. `Proof` → `<ProofSection>`

All use clsx + lucide only (replacing icons per the decision table above). After 3a,
ui-kit has a complete marketing section library for the static parts of the site.

### Phase 3b — Port the components that need some untangling

12. `ContentBlock` → `<MarketingContentBlock>` (depends on MarkdownBody from 3a)
13. `FeatureGrid` → `<FeatureGrid>` (depends on MarkdownBody; icon alias table to convert)
14. `ProductScreenshot` → `<ProductScreenshot>` (depends on MarkdownBody; DashboardMockup extraction decision needed)
15. `StatsCounter` → `<StatsCounter>` (IntersectionObserver animation, lucide wildcard import to replace)
16. `TabsSection` → `<TabsSection>` (react-markdown + lucide wildcard to replace)
17. `Testimonials` → `<Testimonials>` (straightforward, star icons)
18. `Timeline` → `<Timeline>` (MUI Timeline vs. custom Box decision)
19. `FAQAccordion` → `<FAQAccordion>` (MUI Accordion vs. custom — see note above)
20. `PricingTable` → `<PricingTable>` (decouple Stripe-fetch; keep `groupStripePricesByTier` as pure util)
21. `DataTable` merge → `<MarketingDataTable>` wrapping ui-kit `DataTable`

### Phase 3c — Decide on Strapi renderer extraction

Either:

**Option A**: extract `@tensorcost/strapi-renderer` as a new package in `websites/ui-kit/`
(or a sibling repo) that depends on `@tensorcost/ui-kit`. It would contain:
`StrapiContext`, `ComponentRenderer`, `PageRenderer`, `FormRenderer`, `FormSection`,
and all five Strapi-coupled hooks. The form primitives (Button, Checkbox, etc.) either
move here or are replaced by MUI.

**Option B**: keep component-library alive as a Strapi-only shim. The display components
redirect to `@tensorcost/ui-kit`; the Strapi machinery stays in component-library. This is
lower effort short-term but perpetuates the dual-library situation.

The recommendation is Option A if the website/ codebase is actively maintained;
Option B if it's heading toward a static build (e.g. Next.js ISR or static export)
where the Strapi runtime is less central.

### Phase 3d — Migrate `websites/website/` imports

Once 3a–3c are done:

- Update `websites/website/` to import display components from `@tensorcost/ui-kit`
  instead of `@tensorcost/component-library`.
- If Option A: update to import renderer/context from `@tensorcost/strapi-renderer`.
- If Option B: component-library's display imports become re-exports from ui-kit; the
  package stays alive as a compatibility shim until fully deprecating.
- Verify with a production build — the component-library is Rollup-built; the new
  consumers will be vite or Next.js; import resolution behavior can differ for
  dynamic re-exports.

---

## Open questions

1. **Does `websites/website/` import any component-library internals (renderer/ or context/)
   directly?** ComponentRenderer is a public export and the website's entry point almost
   certainly uses it to render Strapi pages. These imports must keep working through
   Phase 3c — confirm by grepping `websites/website/` before Phase 3d starts.

2. **MUI `@mui/lab` for Timeline/FAQAccordion vs. hand-rolled?** `@mui/lab` ships Accordion
   in `@mui/material` core (stable since MUI v5), so FAQAccordion can use it without a lab
   dep. Timeline is still in `@mui/lab`. If ui-kit doesn't already depend on `@mui/lab`,
   adding it for one component may not be worth it — a custom MUI Box layout is fine.

3. **`BrainCircuit` and `GitBranch` lucide icons** — are these visible on any high-traffic
   marketing surface? If yes, lucide-react should be an optional peer dep for the FeatureGrid
   and StatsCounter ports. If these icons are only used in FeatureGrid seed data for a single
   page, swap them for `PsychologyIcon` / `AccountTreeIcon` from MUI and avoid the lucide dep
   entirely.

4. **PricingTable's `DashboardMockup`** — the hardcoded CFO summary data (exact dollar amounts,
   hash values, "tensorcost.app" URL bar) makes `ProductScreenshot` a marketing asset, not a
   generic ui-kit component. The fallback mockup should either be provided as a render prop
   (so ui-kit stays generic) or extracted to the marketing site package. Decision needed before
   Phase 3b.

5. **framer-motion as listed dep** — component-library's `package.json` lists `framer-motion
   ^11.15.0` as a runtime dependency but no component imports it. This looks like a dependency
   that was added speculatively and never wired up. Confirm by running `grep -r "framer-motion"
   websites/component-library/src/` before the port; if confirmed unused, drop it from
   component-library too (out of scope for this plan, but worth flagging).

6. **Rollup vs. tsup bundle format** — component-library is Rollup-built (CJS + ESM), ui-kit
   is tsup-built (ESM + CJS via `tsup`). Consumers that have `"type": "module"` in their
   package.json will need the ESM path. Verify that `websites/website/` pkg type and its
   bundler (likely Vite) resolves the ui-kit ESM export correctly after the migration.

---

## Effort estimate

| Phase | Scope | Rough estimate |
|---|---|---|
| 3a | 11 clean PORT components + MarkdownBody prerequisite | 2–2.5 days |
| 3b | 10 PORT-with-untangling components + DataTable merge | 2–3 days |
| 3c | strapi-renderer extraction decision + implementation | 0.5 day (decision) + 1–2 days (Option A extraction) |
| 3d | website/ import migration + smoke test | 0.5–1 day |
| **Total** | | **5–8.5 days** |

Parallelism: 3a and 3b can run in parallel once MarkdownBody is done (it's the only
cross-3a/3b dependency). Two agents can work simultaneously after the MarkdownBody port
lands. 3c blocks 3d; 3a/3b do not block each other or 3c.
