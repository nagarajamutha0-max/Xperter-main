import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthLayout, InkButton } from "@/components/auth/AuthUI";
import { getUser, signOut, type DemoUser } from "@/lib/auth";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome — Lumen" },
      { name: "description", content: "You're signed in to Lumen." },
      { property: "og:title", content: "Welcome — Lumen" },
      { property: "og:description", content: "You're signed in to Lumen." },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const nav = useNavigate();
  const [u, setU] = useState<DemoUser | null>(null);
  useEffect(() => { const x = getUser(); if (!x) nav({ to: "/sign-in" }); else setU(x); }, [nav]);
  return (
    <AuthLayout title={`Hello, ${u?.name ?? "there"}`} subtitle="You're signed in successfully">
      <div className="glass-input mb-7 flex items-center gap-4 rounded-2xl p-4">
        <div className="btn-ink flex h-11 w-11 items-center justify-center rounded-full text-sm">{u?.name?.[0]?.toUpperCase()}</div>
        <div className="min-w-0"><p className="truncate text-sm font-medium">{u?.name}</p><p className="truncate text-xs text-muted-foreground">{u?.email}</p></div>
      </div>
      <Link to="/app/messages"><InkButton>Open workspace</InkButton></Link>
      <button onClick={() => { signOut(); nav({ to: "/sign-in" }); }} className="mt-5 w-full text-center text-sm text-muted-foreground hover:text-foreground">Sign out</button>
    </AuthLayout>
  );
}
