"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SECTIONS, SECTION_GROUPS } from "@/content/sections";

const DATA_LINKS = [
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/contacts", label: "Contact Inbox" },
  { href: "/admin/registrations", label: "Registrations" },
  { href: "/admin/products", label: "Store Products" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`block px-3 py-1.5 rounded-md text-sm transition-colors ${
        active
          ? "bg-white/15 text-white font-semibold"
          : "text-white/60 hover:text-white hover:bg-white/10"
      }`}
    >
      {label}
    </Link>
  );
}

export default function AdminSidebar() {
  return (
    <aside className="w-[250px] flex-shrink-0 bg-[linear-gradient(180deg,#1a1a2e_0%,#16213e_50%,#0f3460_100%)] border-r border-white/10 min-h-screen">
      <div className="p-4">
        <Link href="/admin" className="block px-3 py-2 text-white font-extrabold text-lg">
          CSC Admin
        </Link>
      </div>

      <nav className="px-3 pb-10 space-y-5">
        <div>
          <NavLink href="/admin" label="Dashboard" />
        </div>

        {SECTION_GROUPS.map((group) => (
          <div key={group}>
            <div className="px-3 mb-1 text-[11px] font-bold uppercase tracking-wider text-white/40">
              {group}
            </div>
            <div className="space-y-0.5">
              {SECTIONS.filter((s) => s.group === group).map((s) => (
                <NavLink key={s.id} href={`/admin/sections/${s.id}`} label={s.label} />
              ))}
            </div>
          </div>
        ))}

        <div>
          <div className="px-3 mb-1 text-[11px] font-bold uppercase tracking-wider text-white/40">
            Data
          </div>
          <div className="space-y-0.5">
            {DATA_LINKS.map((l) => (
              <NavLink key={l.href} href={l.href} label={l.label} />
            ))}
          </div>
        </div>

        <div>
          <div className="px-3 mb-1 text-[11px] font-bold uppercase tracking-wider text-white/40">
            Site
          </div>
          <div className="space-y-0.5">
            <NavLink href="/admin/settings" label="Settings" />
          </div>
        </div>
      </nav>
    </aside>
  );
}
