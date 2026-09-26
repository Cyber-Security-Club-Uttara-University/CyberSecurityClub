import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminFromCookie } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminLogout from "@/components/admin/AdminLogout";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminFromCookie();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-[60px] flex-shrink-0 bg-white border-b border-black/10 flex items-center justify-between px-6">
          <div className="text-sm text-[#525252]">
            Signed in as <span className="font-semibold text-black">{admin.username}</span>
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
        <main className="flex-1 p-6 overflow-x-auto">{children}</main>
      </div>
    </div>
  );
}
