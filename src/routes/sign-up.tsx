import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { AuthLayout, Field, InkButton, GoogleButton, Divider } from "@/components/auth/AuthUI";
import { setUser } from "@/lib/auth";

export const Route = createFileRoute("/sign-up")({
  head: () => ({
    meta: [
      { title: "Create account — Lumen" },
      { name: "description", content: "Create your Lumen account in a few seconds." },
      { property: "og:title", content: "Create account — Lumen" },
      { property: "og:description", content: "Create your Lumen account in a few seconds." },
    ],
  }),
  component: SignUp,
});

function SignUp() {
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", email: "", pw: "", pw2: "", agree: false });
  const [err, setErr] = useState<Partial<Record<"name" | "email" | "pw" | "pw2" | "agree", string>>>({});
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Partial<Record<"name" | "email" | "pw" | "pw2" | "agree", string>> = {};
    if (!f.name.trim()) er.name = "Enter your name";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = "Enter a valid email address";
    if (f.pw.length < 8) er.pw = "At least 8 characters";
    if (f.pw !== f.pw2) er.pw2 = "Passwords don't match";
    if (!f.agree) er.agree = "Please accept the terms";
    setErr(er);
    if (Object.keys(er).length) return;
    setUser({ name: f.name, email: f.email });
    nav({ to: "/welcome" });
  };
  return (
    <AuthLayout title="Create account" subtitle="Get started in a few seconds">
      <GoogleButton onClick={() => { setUser({ name: "Jane Appleseed", email: "jane@gmail.com" }); nav({ to: "/welcome" }); }} />
      <Divider />
      <form onSubmit={submit} noValidate>
        <Field label="Full name" icon={User} placeholder="Jane Appleseed" value={f.name} onChange={set("name")} error={err.name} />
        <Field label="Email address" icon={Mail} type="email" placeholder="name@example.com" value={f.email} onChange={set("email")} error={err.email} />
        <Field label="Password" icon={Lock} type="password" placeholder="At least 8 characters" value={f.pw} onChange={set("pw")} error={err.pw} />
        <Field label="Confirm password" icon={Lock} type="password" placeholder="Re-enter your password" value={f.pw2} onChange={set("pw2")} error={err.pw2} />
        <label className="mb-6 flex items-center gap-2.5 text-sm text-muted-foreground">
          <input type="checkbox" checked={f.agree} onChange={set("agree")} className="h-4 w-4 accent-primary" />
          I agree to the <span className="text-foreground">Terms of Service</span> and <span className="text-foreground">Privacy Policy</span>
        </label>
        {err.agree && <p className="-mt-4 mb-4 text-xs text-destructive">{err.agree}</p>}
        <InkButton type="submit">Create account</InkButton>
      </form>
      <p className="mt-8 text-center text-[15px] text-muted-foreground">Already have an account? <Link to="/sign-in" className="text-foreground hover:underline">Sign in</Link></p>
    </AuthLayout>
  );
}
