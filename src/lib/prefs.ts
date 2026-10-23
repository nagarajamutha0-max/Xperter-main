export type Prefs = { theme: "light" | "dark"; motion: boolean; glyphs: boolean; sounds: boolean; compact: boolean; blur: number; alpha: number; hue: number };
export const PREFS_KEY = "lumen-prefs";
export const DEFAULT_PREFS: Prefs = { theme: "dark", motion: true, glyphs: true, sounds: false, compact: false, blur: 26, alpha: 38, hue: 240 };
export const TINTS = [
  { label: "Pearl", hue: 240 },
  { label: "Champagne", hue: 70 },
  { label: "Mist", hue: 190 },
  { label: "Blush", hue: 20 },
];

export function loadPrefs(): Prefs {
  try { return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(PREFS_KEY) || "{}") }; } catch { return DEFAULT_PREFS; }
}

export function applyPrefs(p: Prefs) {
  const r = document.documentElement;
  r.classList.toggle("dark", p.theme === "dark");
  r.style.colorScheme = p.theme;
  r.style.setProperty("--glass-blur", `${p.blur}px`);
  r.style.setProperty("--glass-alpha", String(p.alpha / 100));
  r.style.setProperty("--glass-hue", String(p.hue));
  r.dataset["motion"] = p.motion ? "on" : "off";
}

export function savePrefs(p: Prefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(p));
  applyPrefs(p);
}
