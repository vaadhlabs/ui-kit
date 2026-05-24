import type { BrandTokens } from "./brand.js";

/**
 * Builds the :root / [data-theme="dark"] CSS custom-property block that
 * non-MUI consumers can read. The React package calls this at theme-creation
 * time and injects the result via MuiCssBaseline's globalStyles.
 */
export function buildCssVars(t: BrandTokens): string {
  return `
    --paper: ${t.paper};
    --bgPage: ${t.bgPage};
    --bgSoft: ${t.bgSoft};
    --ink: ${t.ink};
    --ink2: ${t.ink2};
    --ink3: ${t.ink3};
    --ink4: ${t.ink4};
    --border: ${t.border};
    --borderStrong: ${t.borderStrong};
    --bgHover: ${t.bgHover};
    --selected: ${t.selected};
    --blue: ${t.blue};
    --cyan: ${t.cyan};
    --positive: ${t.positive};
    --warn: ${t.warn};
    --danger: ${t.danger};
    --purple: ${t.purple};
    --radius-sm: ${t.radiusSm};
    --radius-md: ${t.radiusMd};
    --radius-lg: ${t.radiusLg};
    --radius-xl: ${t.radiusXl};
    --radius-pill: ${t.radiusPill};
  `.trim();
}
