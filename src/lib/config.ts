export const APP_NAME = "Lumen";

export const APP_PAGES = [
  { to: "/app/messages", label: "Messages", short: "01" },
  { to: "/app/page-2", label: "Orbit", short: "02", glyph: "rings" },
  { to: "/app/page-3", label: "Vector", short: "03", glyph: "cross" },
  { to: "/app/page-4", label: "Loop", short: "04", glyph: "knot" },
  { to: "/app/page-5", label: "Facet", short: "05", glyph: "square" },
  { to: "/app/page-6", label: "Halo", short: "06", glyph: "segments" },
] as const;
