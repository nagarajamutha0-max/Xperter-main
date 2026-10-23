import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { AuthLayout, Field, InkButton } from "@/components/auth/AuthUI";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset password — Lumen" },
      { name: "description", content: "Reset the password for your Lumen account." },
      { property: "og:title", content: "Reset password — Lumen" },
      { property: "og:description", content: "Reset the password for your Lumen account." },
    ],
  }),
  component: Forgot,
});

function Forgot() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  return (
    <AuthLayout title={sent ? "Check your inbox" : "Forgot password?"} subtitle={sent ? `If an account exists for ${email}, a reset link is on its way.` : "We'll send you a link to reset it"}>
      {sent ? (
        <div className="flex flex-col items-center gap-6">
          <CheckCircle2 className="h-10 w-10 text-muted-foreground" strokeWidth={1.2} />
          <Link to="/sign-in" className="w-full"><InkButton>Back to sign in</InkButton></Link>
        </div>
      ) : (
        <form noValidate onSubmit={(e) => { e.preventDefault(); if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("Enter a valid email address"); setSent(true); }}>
          <Field label="Email address" icon={Mail} type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} error={err} />
          <InkButton type="submit" className="mt-2">Send reset link</InkButton>
          <p className="mt-8 text-center text-[15px] text-muted-foreground">Remembered it? <Link to="/sign-in" className="text-foreground hover:underline">Sign in</Link></p>
        </form>
      )}
    </AuthLayout>
  );
}
