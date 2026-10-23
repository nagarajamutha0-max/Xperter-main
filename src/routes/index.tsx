import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, MessageCircle, Phone, Video } from "lucide-react";
import { SilkBackground } from "@/components/SilkBackground";
import { BrandMark } from "@/components/BrandMark";
import { GlassCard } from "@/components/GlassCard";
import { SettingsControl } from "@/components/SettingsControl";
import { ChromeGlyph } from "@/components/three/ChromeGlyph";
import { APP_PAGES } from "@/lib/config";
import type { GlyphKind } from "@/components/three/ChromeScene";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumen — Conversations, cast in chrome" },
      { name: "description", content: "An immersive chrome-and-glass space for text, voice and video conversations." },
      { property: "og:title", content: "Lumen — Conversations, cast in chrome" },
      { property: "og:description", content: "An immersive chrome-and-glass space for text, voice and video conversations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: MessageCircle, title: "Text", body: "Threads that stay calm, quick and readable." },
  { icon: Phone, title: "Voice", body: "One tap to talk. Clear, light, unhurried." },
  { icon: Video, title: "Video", body: "Face to face, framed in frosted glass." },
];

function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden text-foreground">
      <SilkBackground />
      <header className="fixed inset-x-0 top-0 z-50 mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6 sm:py-4 lg:px-10 lg:py-5">
        <BrandMark />
        <nav className="glass hidden items-center gap-1 rounded-full p-1 text-sm sm:flex">
          <a href="#work" className="liquid-press whitespace-nowrap rounded-full px-3.5 py-1.5 hover:bg-glass-strong md:px-4 md:py-2">Spaces</a>
          <a href="#features" className="liquid-press whitespace-nowrap rounded-full px-3.5 py-1.5 hover:bg-glass-strong md:px-4 md:py-2">Features</a>
          <Link to="/sign-in" className="liquid-press whitespace-nowrap rounded-full px-3.5 py-1.5 hover:bg-glass-strong md:px-4 md:py-2">Sign in</Link>
          <Link to="/sign-up" className="btn-ink liquid-press whitespace-nowrap rounded-full px-3.5 py-1.5 md:px-4 md:py-2">Get started</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/sign-in" className="glass liquid-press rounded-full px-3.5 py-1.5 text-xs font-medium sm:hidden">
            Sign in
          </Link>
          <SettingsControl />
        </div>
      </header>

      <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 pt-24 pb-16 sm:px-8 md:px-10">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="glass animate-blob absolute left-[6%] top-[16%] h-28 w-28 rounded-full sm:left-[8%] sm:top-[18%] sm:h-40 sm:w-40" />
          <div className="glass animate-blob absolute right-[8%] top-[24%] h-20 w-20 rounded-full sm:right-[10%] sm:top-[26%] sm:h-24 sm:w-24" style={{ animationDelay: "-5s" }} />
          <div className="glass animate-blob absolute bottom-[16%] left-[38%] h-14 w-14 rounded-full sm:bottom-[18%] sm:left-[42%] sm:h-16 sm:w-16" style={{ animationDelay: "-9s" }} />
        </div>
        <ChromeGlyph kind="hero" className="absolute inset-0 cursor-grab" />
        <div
          className="pointer-events-none relative z-10 flex w-full max-w-7xl flex-col items-center justify-end gap-6 text-center sm:items-start sm:gap-8 sm:text-left lg:flex-row lg:items-end lg:justify-between lg:gap-10"
          style={{ minHeight: "68vh" }}
        >
          <h1 className="animate-rise text-[15vw] leading-[0.88] sm:text-[12vw] md:text-[10.5vw] lg:text-[9vw] lg:leading-[0.85]">
            Talk,<br /><span className="text-muted-foreground">in chrome.</span>
          </h1>
          <div className="animate-rise pointer-events-auto max-w-sm pb-2 sm:max-w-md lg:max-w-xs lg:pb-4" style={{ animationDelay: "0.2s" }}>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              A quiet, tactile place for text, voice and video — made of glass, light and polished metal. Move your cursor to turn the form.
            </p>
            <Link to="/sign-up" className="btn-ink liquid-press mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm sm:mt-6">
              Enter Lumen <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <p className="absolute bottom-5 text-xs uppercase tracking-[0.3em] text-muted-foreground sm:bottom-6">Scroll</p>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-32">
        <div className="text-center sm:text-left">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">01 — Conversation</p>
          <h2 className="mx-auto mt-3 max-w-3xl text-balance text-3xl sm:mx-0 sm:mt-4 sm:text-4xl md:text-5xl lg:text-6xl">
            Every way to reach someone, under one pane of glass.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:mt-16 lg:grid-cols-3">
          {features.map((f, index) => (
            <GlassCard
              key={f.title}
              variant="interactive"
              padding="md"
              className={`group flex flex-col items-center text-center sm:items-start sm:text-left ${
                index === features.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="btn-ink flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-500 group-hover:rotate-12">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-6 text-2xl sm:mt-8 sm:text-3xl lg:mt-10">{f.title}</h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground sm:text-base">{f.body}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section id="work" className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-24 lg:px-10 lg:pb-32">
        <div className="text-center sm:text-left">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">02 — Spaces</p>
          <h2 className="mt-3 text-balance text-3xl sm:mt-4 sm:text-4xl md:text-5xl lg:text-6xl">
            Six spaces. One is open.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:mt-16 lg:grid-cols-3">
          {APP_PAGES.map((p) => (
            <GlassCard
              key={p.to}
              asChild
              variant="interactive"
              padding="none"
              className="group relative aspect-[4/3] overflow-hidden p-5 sm:p-6"
            >
              <Link to={p.to}>
                {"glyph" in p ? (
                  <ChromeGlyph
                    kind={p.glyph as GlyphKind}
                    interactive={false}
                    className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MessageCircle className="h-16 w-16 text-muted-foreground transition-transform duration-700 group-hover:scale-110 sm:h-20 sm:w-20" strokeWidth={1} />
                  </div>
                )}
                <div className="relative flex h-full flex-col justify-between">
                  <span className="text-xs text-muted-foreground">{p.short}</span>
                  <div className="flex items-end justify-between gap-2">
                    <span className="text-xl font-light sm:text-2xl">{p.label}</span>
                    <span className="glass rounded-full px-3 py-1 text-xs">{"glyph" in p ? "Coming soon" : "Live"}</span>
                  </div>
                </div>
              </Link>
            </GlassCard>
          ))}
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-glass-edge px-5 py-8 text-center text-sm text-muted-foreground sm:flex-row sm:px-8 sm:py-10 sm:text-left lg:px-10">
        <span>© 2026 Lumen</span>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link to="/sign-in" className="hover:text-foreground">Sign in</Link>
          <Link to="/sign-up" className="hover:text-foreground">Create account</Link>
          <Link to="/app/messages" className="hover:text-foreground">Workspace</Link>
        </div>
      </footer>
    </div>
  );
}
