/**
 * TensorCost typography tokens — font family and type scale overrides
 * shared between createTensorTheme and any non-MUI consumer.
 *
 * The MUI typography object in theme.ts builds on these values via
 * getTypographyTokens(). Non-MUI consumers (e.g. the slides pipeline)
 * import this directly and map the values to their own rendering layer.
 */

export interface TypographyTokens {
  fontFamily: string;
  h4: { fontWeight: number; fontSize: string; letterSpacing: string };
  h5: { fontWeight: number; fontSize: string; letterSpacing: string };
  h6: { fontWeight: number; fontSize: string; letterSpacing: string };
  overline: { fontWeight: number; letterSpacing: string; fontSize: string };
  button: { textTransform: string; fontWeight: number };
}

export const TYPOGRAPHY_TOKENS: TypographyTokens = {
  fontFamily: "'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif",
  h4: { fontWeight: 700, fontSize: "1.5rem",     letterSpacing: "-0.02em" },
  h5: { fontWeight: 600, fontSize: "1.125rem",   letterSpacing: "-0.01em" },
  h6: { fontWeight: 600, fontSize: "0.9375rem",  letterSpacing: "-0.01em" },
  overline: { fontWeight: 700, letterSpacing: "0.08em", fontSize: "0.625rem" },
  button: { textTransform: "none", fontWeight: 600 },
};
