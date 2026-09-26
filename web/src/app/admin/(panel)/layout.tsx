import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/session";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminLogout from "@/components/admin/AdminLogout";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

function initials(user: { name?: string | null; username: string }) {
  const source = (user.name || user.username).trim();
  const parts = source.split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? parts[0][0] + parts[1][0] : source.slice(0, 2)).toUpperCase();
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  const displayName = user.name || user.username;

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex">
      <AdminSidebar role={user.role} />
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-[60px] flex-shrink-0 bg-white border-b border-black/10 flex items-center justify-between px-6">
          <div className="text-sm text-[#525252]">
            Signed in as <span className="font-semibold text-black">{displayName}</span>
            <span className="ml-2 px-2 py-0.5 rounded-full bg-[#0000ff]/10 text-[#0000ff] text-[11px] font-bold uppercase tracking-wide">
              {user.role}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-sm text-[#0000ff] font-semibold hover:underline"
            >
              View site
            </Link>
            <AdminLogout />
          </div>
        </header>
        <main className="flex-1 p-6 overflow-x-auto pb-24">{children}</main>
      </div>

      {/* Current active user — bottom right */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className="flex items-center gap-3 rounded-full bg-white/95 backdrop-blur border border-black/10 shadow-[0px_8px_24px_rgba(0,0,0,0.16)] pl-1.5 pr-4 py-1.5">
          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-[#0000ff]/40 bg-[#0000ff]/10 flex items-center justify-center">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={displayName}
                fill
                sizes="40px"
                className="rounded-full object-cover"
              />
            ) : (
              <span className="text-xs font-extrabold text-[#0000ff]">{initials(user)}</span>
            )}
          </span>
          <span className="leading-tight min-w-0">
            <span className="block text-sm font-bold text-black truncate max-w-[160px]">
              {displayName}
            </span>
            <span className="block text-[11px] text-[#525252] truncate max-w-[160px]">
              {user.role}
            </span>
          </span>
          <span
            className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.25)]"
            title="Active session"
          />
        </div>
      </div>
    </div>
  );
}
