import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Moon, Sun, X, Droplets } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { DEFAULT_PREFS as DEFAULTS, loadPrefs, savePrefs, type Prefs } from "@/lib/prefs";

export function SettingsGear({ open }: { open: boolean }) {
  const teeth = Array.from({ length: 8 });
  return (
    <svg viewBox="0 0 48 48" className="h-6 w-6" fill="none">
      <g
        className="origin-center transition-transform duration-700 ease-[cubic-bezier(.6,-0.2,.2,1.4)] group-hover:rotate-[135deg]"
        style={{ transformBox: "fill-box", transform: open ? "rotate(225deg) scale(0.9)" : undefined }}
      >
        {teeth.map((_, i) => (
          <rect
            key={i}
            x="21.5" y={open ? 20 : 4} width="5" height={open ? 8 : 9} rx="2"
            fill="currentColor"
            className="transition-all duration-500 group-hover:[y:2px]"
            style={{ transform: `rotate(${i * 45}deg)`, transformOrigin: "24px 24px", opacity: open && i % 2 ? 0 : 1 }}
          />
        ))}
        <circle cx="24" cy="24" r={open ? 0 : 12} stroke="currentColor" strokeWidth="4.5" className="transition-all duration-500" />
        <circle cx="24" cy="24" r={open ? 0 : 3.5} fill="currentColor" className="transition-all duration-500 group-hover:[r:5px]" />
        {open && (
          <>
            <rect x="22" y="8" width="4" height="32" rx="2" fill="currentColor" style={{ transform: "rotate(-45deg)", transformOrigin: "24px 24px" }} />
            <rect x="22" y="8" width="4" height="32" rx="2" fill="currentColor" style={{ transform: "rotate(45deg)", transformOrigin: "24px 24px" }} />
          </>
        )}
      </g>
    </svg>
  );
}

export function SettingsControl({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  useEffect(() => {
    setPrefs(loadPrefs());
  }, []);
  const update = <K extends keyof Prefs>(k: K, v: Prefs[K]) => {
    const next = { ...prefs, [k]: v };
    setPrefs(next);
    savePrefs(next);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        type="button"
        aria-label={open ? "Close settings" : "Open settings"}
        title="Settings"
        className={`group glass liquid-press relative z-[60] flex h-12 w-12 items-center justify-center rounded-full text-foreground ${className}`}
      >
        <SettingsGear open={open} />
      </Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="end" sideOffset={12} collisionPadding={16}
        aria-labelledby="settings-title" className="settings-popover glass z-[70] w-72 max-w-[calc(100vw-2rem)] rounded-[1.75rem] p-5 text-foreground">
        <div className="mb-5 flex items-center justify-between">
          <h2 id="settings-title" className="text-lg font-medium">Settings</h2>
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-muted-foreground" aria-label="Dismiss settings" title="Close settings" onClick={() => setOpen(false)}><X className="h-4 w-4" /></Button>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium">Theme</span>
          <div className="flex items-center gap-2">
            <Sun aria-hidden className={`h-4 w-4 ${prefs.theme === "light" ? "text-foreground" : "text-muted-foreground"}`} />
            <Switch checked={prefs.theme === "dark"} onCheckedChange={(dark) => update("theme", dark ? "dark" : "light")} aria-label="Dark theme" />
            <Moon aria-hidden className={`h-4 w-4 ${prefs.theme === "dark" ? "text-foreground" : "text-muted-foreground"}`} />
          </div>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{prefs.theme === "dark" ? "Dark" : "Light"}</p>
        <div className="mt-5 border-t border-border pt-5">
          <div className="flex items-center justify-between text-sm"><label htmlFor="settings-frost" className="flex items-center gap-2 font-medium"><Droplets aria-hidden className="h-4 w-4 text-muted-foreground" />Frost</label><span className="text-xs tabular-nums text-muted-foreground">{Math.round((prefs.blur - 4) / 44 * 100)}%</span></div>
          <Slider id="settings-frost" className="mt-4 mb-2" min={4} max={48} step={1} value={[prefs.blur]} onValueChange={([v]) => update("blur", v ?? prefs.blur)} aria-label="Frost" />
        </div>
      </PopoverContent>
    </Popover>
  );
}
