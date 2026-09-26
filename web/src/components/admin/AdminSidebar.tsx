"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SECTIONS, SECTION_GROUPS } from "@/content/sections";
import {
  allowedSectionIds,
  canEditSettings,
  canManageUsers,
  canViewLogs,
  type Role,
} from "@/lib/roles";

const DATA_LINKS = [
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/contacts", label: "Contact Inbox" },
  { href: "/admin/registrations", label: "Registrations" },
  { href: "/admin/products", label: "Store Products" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");
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

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="px-3 mb-1 text-[11px] font-bold uppercase tracking-wider text-white/40">
        {label}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

export default function AdminSidebar({ role }: { role: Role }) {
  const allowed = allowedSectionIds(role);
  const visibleSections = SECTIONS.filter(
    (s) => allowed === "all" || allowed.includes(s.id)
  );

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

        {SECTION_GROUPS.map((group) => {
          const rows = visibleSections.filter((s) => s.group === group);
          if (rows.length === 0) return null;
          return (
            <Group key={group} label={group}>
              {rows.map((s) => (
                <NavLink key={s.id} href={`/admin/sections/${s.id}`} label={s.label} />
              ))}
            </Group>
          );
        })}

        <Group label="Data">
          {DATA_LINKS.map((l) => (
            <NavLink key={l.href} href={l.href} label={l.label} />
          ))}
        </Group>

        {canEditSettings(role) && (
          <Group label="Site">
            <NavLink href="/admin/settings" label="Settings" />
          </Group>
        )}

        {(canManageUsers(role) || canViewLogs(role)) && (
          <Group label="Access">
            {canManageUsers(role) && (
              <>
                <NavLink href="/admin/users" label="Users" />
                <NavLink href="/admin/whitelist" label="Whitelist" />
              </>
            )}
            {canViewLogs(role) && <NavLink href="/admin/logs" label="Logs" />}
          </Group>
        )}
      </nav>
    </aside>
  );
}
