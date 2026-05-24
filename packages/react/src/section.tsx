import { createContext, useContext, type ReactElement, type ReactNode } from "react";
import { useTheme } from "@mui/material/styles";
import type { Section } from "./workshop-theme.js";

/**
 * Section identity — the single source of truth for "which Workshop
 * section is this part of the tree in." Consumers wrap a route subtree
 * (or a self-contained component) in `<SectionProvider section="govern">`
 * and components below read it via `useSection()`.
 *
 * Why a context rather than a prop on every component:
 *
 *   1. Sections are a property of the page or major section header,
 *      not of each card / button. Threading the prop manually means
 *      40+ component signatures gain a `section` field they pass
 *      through verbatim.
 *   2. The escape hatch — when a component sits outside a section
 *      entirely (the shell, a modal, the login page) — is "don't
 *      render a SectionProvider above it." `useSection()` returns null
 *      and components fall back to a neutral default tint.
 *
 * Section ⟹ colour mapping comes from the Workshop theme (see
 * `workshop-theme.ts`). This module never hard-codes colour values; it
 * reads them from `theme.palette.workshop.section[<id>]` at use time so
 * the dark/light variant is honoured automatically.
 */
const SectionContext = createContext<Section | null>(null);

export interface SectionProviderProps {
  section: Section;
  children: ReactNode;
}

export function SectionProvider({ section, children }: SectionProviderProps): ReactElement {
  return <SectionContext.Provider value={section}>{children}</SectionContext.Provider>;
}

/** Current section id from the surrounding `<SectionProvider>`, or null
 *  when the caller is outside any section (shell-level chrome, modals,
 *  login). */
export function useSectionId(): Section | null {
  return useContext(SectionContext);
}

/**
 * Resolved tokens for the current section — accent + tint.
 *
 * When no section is active (outside any provider), returns the primary
 * theme colour as the accent and a transparent tint. That keeps
 * consumers branch-free: `const { accent, tint } = useSection();
 * <Box borderTop={`3px solid ${accent}`} />` always works.
 */
export function useSection(): { accent: string; tint: string; id: Section | null } {
  const id = useSectionId();
  const theme = useTheme();
  const sectionMap = theme.palette.workshop?.section;
  if (id && sectionMap) {
    return { ...sectionMap[id], id };
  }
  return { accent: theme.palette.primary.main, tint: "transparent", id: null };
}
