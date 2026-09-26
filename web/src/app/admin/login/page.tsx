"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Login failed");
        setLoading(false);
        return;
      }
      const next = params.get("next") || "/admin";
      router.replace(next);
      router.refresh();
    } catch {
      setError("Network error");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-[#f5f5f7]">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-[420px] bg-white rounded-2xl shadow-[0px_4px_16px_rgba(0,0,0,0.12)] p-8"
      >
        <div className="text-center mb-7">
          <div className="text-2xl font-extrabold text-black">CSC Admin</div>
          <div className="text-sm text-[#525252] mt-1">Sign in to manage site content</div>
        </div>

        <label className="block text-sm font-semibold text-black mb-1.5">Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          className="w-full px-3.5 py-2.5 rounded-lg border border-black/15 text-black mb-4 focus:outline-none focus:border-[#0000ff]"
        />

        <label className="block text-sm font-semibold text-black mb-1.5">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="w-full px-3.5 py-2.5 rounded-lg border border-black/15 text-black mb-5 focus:outline-none focus:border-[#0000ff]"
        />

        {error && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-[#0000ff] text-white font-semibold hover:bg-[#0000cc] transition-colors disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
