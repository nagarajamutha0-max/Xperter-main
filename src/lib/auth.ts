// Demo-only auth stored in the browser. Replace with a real backend for production.
export type DemoUser = { name: string; email: string };
const KEY = "lumen-demo-user";

export function getUser(): DemoUser | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; }
}
export function setUser(u: DemoUser) { localStorage.setItem(KEY, JSON.stringify(u)); }
export function signOut() { localStorage.removeItem(KEY); }
