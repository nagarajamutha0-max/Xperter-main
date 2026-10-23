import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout, Field, InkButton, GoogleButton, Divider } from "@/components/auth/AuthUI";
import { setUser } from "@/lib/auth";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [
      { title: "Sign in — Lumen" },
      { name: "description", content: "Sign in to your Lumen account." },
      { property: "og:title", content: "Sign in — Lumen" },
      { property: "og:description", content: "Sign in to your Lumen account." },
    ],
  }),
  component: SignIn,
});

function SignIn() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<Partial<Record<"name" | "email" | "pw" | "pw2" | "agree", string>>>({});
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Partial<Record<"name" | "email" | "pw" | "pw2" | "agree", string>> = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) er.email = "Enter a valid email address";
    if (pw.length < 8) er.pw = "Password must be at least 8 characters";
    setErr(er);
    if (Object.keys(er).length) return;
    setUser({ name: email.split("@")[0] ?? email, email });
    toast.success("Signed in (demo)");
    nav({ to: "/welcome" });
  };
  const google = () => { setUser({ name: "Jane Appleseed", email: "jane@gmail.com" }); nav({ to: "/welcome" }); };
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account">
      <form onSubmit={submit} noValidate>
        <Field label="Email address" icon={Mail} type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} error={err.email} />
        <Field label="Password" icon={Lock} type="password" placeholder="Enter your password" value={pw} onChange={(e) => setPw(e.target.value)} error={err.pw} />
        <div className="mb-7 flex items-center justify-between text-[15px]">
          <label className="flex items-center gap-2.5 text-muted-foreground"><input type="checkbox" defaultChecked className="h-4 w-4 accent-primary" /> Remember me</label>
          <Link to="/forgot-password" className="text-foreground hover:underline">Forgot password?</Link>
        </div>
        <InkButton type="submit">Sign in</InkButton>
      </form>
      <Divider />
      <GoogleButton onClick={google} />
      <p className="mt-10 text-center text-[15px] text-muted-foreground">Don't have an account? <Link to="/sign-up" className="text-foreground hover:underline">Sign up</Link></p>
    </AuthLayout>
  );
}
