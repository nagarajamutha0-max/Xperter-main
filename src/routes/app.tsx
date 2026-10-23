import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { MessageCircle, Orbit, Triangle, Infinity as Loop, Square, CircleDashed, Menu, PanelLeftClose } from "lucide-react";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { SilkBackground } from "@/components/SilkBackground";
import { BrandMark } from "@/components/BrandMark";
import { SettingsControl } from "@/components/SettingsControl";
import { APP_PAGES } from "@/lib/config";

export const Route = createFileRoute("/app")({
  component: AppShell,
});

const icons = [MessageCircle, Orbit, Triangle, Loop, Square, CircleDashed];

export function AppShell() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (r) => r.location.pathname });
  const activeIndex = Math.max(0, APP_PAGES.findIndex((p) => path.startsWith(p.to)));
  return (
    <div className="h-dvh p-2.5 text-foreground sm:p-3 md:p-4">
      <SilkBackground />
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open navigation" title="Open navigation" className="glass liquid-press fixed left-5 top-5 z-30 h-10 w-10 rounded-full sm:left-6 sm:top-6 sm:h-11 sm:w-11">
            <Menu className="h-4 w-4" />
          </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="workspace-nav-overlay fixed inset-0 z-40" />
          <Dialog.Content aria-describedby={undefined} className="workspace-nav-panel glass fixed inset-y-2.5 left-2.5 z-50 flex w-72 max-w-[calc(100vw-1.25rem)] flex-col rounded-[1.5rem] p-4 text-foreground outline-none sm:inset-y-3 sm:left-3 sm:rounded-[1.75rem] md:inset-y-4 md:left-4">
        <Dialog.Title className="sr-only">Workspace navigation</Dialog.Title>
        <div className="flex items-center justify-between gap-3 px-1 py-1">
          <BrandMark />
          <Dialog.Close asChild>
            <Button variant="ghost" size="icon" aria-label="Close navigation" title="Close navigation" className="liquid-press shrink-0 rounded-full"><PanelLeftClose /></Button>
          </Dialog.Close>
        </div>
        <nav className="relative mt-8 flex min-h-0 flex-1 flex-col overflow-y-auto" aria-label="Workspace">
          <span aria-hidden className="btn-ink pointer-events-none absolute inset-x-0 top-0 h-11 rounded-2xl transition-transform duration-700 ease-[cubic-bezier(0.34,1.45,0.64,1)]" style={{ transform: `translateY(${activeIndex * 48}px)` }} />
          {APP_PAGES.map((p, i) => {
            const Icon = icons[i] ?? MessageCircle;
            return (
              <Link key={p.to} to={p.to} onClick={() => setOpen(false)}
                className="relative mb-1 flex h-11 items-center gap-3 rounded-2xl px-3 text-sm text-muted-foreground transition-all duration-500 hover:translate-x-1 hover:text-foreground"
                activeProps={{ className: "!text-primary-foreground hover:!translate-x-0" }}>
                <Icon className="h-4 w-4" strokeWidth={1.6} />
                <span className="flex-1">{p.label}</span>
                <span className="text-[10px] opacity-60">{p.short}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center justify-between">
          <Link to="/welcome" onClick={() => setOpen(false)} className="text-xs text-muted-foreground hover:text-foreground">Account</Link>
          <SettingsControl />
        </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <main className="h-full min-w-0"><div key={path} className="animate-liquid h-full"><Outlet /></div></main>
    </div>
  );
}
