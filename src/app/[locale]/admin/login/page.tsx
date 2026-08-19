"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { KeyRound, Loader2 } from "lucide-react";
import { signIn } from "@/lib/actions/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) ?? "en";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await signIn(locale, { email, password });
    setLoading(false);
    if (result.success) {
      router.push(`/${locale}/admin`);
      router.refresh();
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-premium">
        <div className="mb-7 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-champagne/15 text-champagne-dark">
            <KeyRound className="h-5 w-5" />
          </span>
          <h1 className="mt-4 font-serif text-xl font-semibold text-charcoal">Gold Gravity Admin</h1>
          <p className="mt-1 text-sm text-charcoal/50">Sign in to manage the website</p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-charcoal/15 px-4 py-3 text-sm outline-none focus:border-champagne"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-charcoal/15 px-4 py-3 text-sm outline-none focus:border-champagne"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex items-center justify-center gap-2 rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-warmwhite transition-colors hover:bg-charcoal/90 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-charcoal/40">
          Admin accounts are created in Supabase — see README for setup instructions.
        </p>
      </div>
    </div>
  );
}
