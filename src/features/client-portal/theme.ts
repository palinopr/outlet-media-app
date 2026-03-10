import type { CSSProperties } from "react";

export interface ClientPortalTheme {
  accentRgb: string;
  secondaryRgb: string;
  highlightRgb: string;
  shellBackground: string;
  sidebarBackground: string;
  heroBackground: string;
  brandLogoSrc: string | null;
  brandLogoAlt: string | null;
  brandLogoWidth: number | null;
  brandLogoHeight: number | null;
  brandBadge: string;
  style: CSSProperties;
}

const DEFAULT_THEME = createTheme({
  accentRgb: "34 211 238",
  secondaryRgb: "168 85 247",
  highlightRgb: "250 204 21",
  shellBackground:
    "radial-gradient(circle at top left, rgba(34, 211, 238, 0.14), transparent 28%), radial-gradient(circle at top right, rgba(168, 85, 247, 0.16), transparent 28%), linear-gradient(180deg, #07111d 0%, #050b13 100%)",
  sidebarBackground:
    "linear-gradient(180deg, rgba(8, 15, 27, 0.98) 0%, rgba(7, 12, 20, 0.98) 100%)",
  heroBackground:
    "linear-gradient(135deg, rgba(34, 211, 238, 0.12) 0%, rgba(168, 85, 247, 0.08) 58%, rgba(250, 204, 21, 0.06) 100%)",
  brandLogoSrc: null,
  brandLogoAlt: null,
  brandLogoWidth: null,
  brandLogoHeight: null,
  brandBadge: "Outlet Media",
});

const HOMEBUYER_ALIASES = new Set([
  "homebuyer",
  "homebuyer-readiness",
  "homebuyer_readiness",
]);

const HOMEBUYER_THEME = createTheme({
  accentRgb: "48 134 209",
  secondaryRgb: "86 175 72",
  highlightRgb: "243 196 65",
  shellBackground:
    "radial-gradient(circle at top left, rgba(48, 134, 209, 0.2), transparent 30%), radial-gradient(circle at 92% 12%, rgba(86, 175, 72, 0.18), transparent 24%), linear-gradient(180deg, #07111d 0%, #081624 42%, #071019 100%)",
  sidebarBackground:
    "linear-gradient(180deg, rgba(7, 17, 31, 0.99) 0%, rgba(8, 22, 36, 0.97) 100%)",
  heroBackground:
    "linear-gradient(135deg, rgba(48, 134, 209, 0.16) 0%, rgba(7, 17, 31, 0.04) 46%, rgba(86, 175, 72, 0.14) 100%)",
  brandLogoSrc: "/images/client-brands/homebuyer-readiness-logo.jpg",
  brandLogoAlt: "Homebuyer Readiness",
  brandLogoWidth: 568,
  brandLogoHeight: 320,
  brandBadge: "Homebuyer Readiness",
});

export function getClientPortalTheme(slug: string): ClientPortalTheme {
  const normalized = slug.trim().toLowerCase();
  if (HOMEBUYER_ALIASES.has(normalized)) return HOMEBUYER_THEME;
  return DEFAULT_THEME;
}

function createTheme(
  input: Omit<ClientPortalTheme, "style">,
): ClientPortalTheme {
  return {
    ...input,
    style: {
      "--portal-accent-rgb": input.accentRgb,
      "--portal-secondary-rgb": input.secondaryRgb,
      "--portal-highlight-rgb": input.highlightRgb,
    } as CSSProperties,
  };
}
