"use client";

import { useRouter } from "next/navigation";

export default function AdminLogout() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-white bg-white/10 hover:bg-white/20 transition-colors"
    >
      Sign out
    </button>
  );
}
