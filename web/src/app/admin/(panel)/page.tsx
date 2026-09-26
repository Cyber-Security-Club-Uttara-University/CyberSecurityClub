import Link from "next/link";
import { db } from "@/lib/db";
import { SECTIONS } from "@/content/sections";
import { getCurrentUser } from "@/lib/session";
import { allowedSectionIds, canManageUsers, canViewLogs } from "@/lib/roles";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const user = await getCurrentUser();

  const [
    announcements,
    contacts,
    registrations,
    products,
    contentBlocks,
    unreadContacts,
    accountCount,
    logCount,
  ] = await Promise.all([
    db.announcement.count(),
    db.contact.count(),
    db.registration.count(),
    db.product.count(),
    db.contentBlock.count(),
    db.contact.count({ where: { read: false } }),
    db.admin.count(),
    db.auditLog.count(),
  ]);

  const role = user?.role ?? "Office Secretary";
  const allowed = allowedSectionIds(role);
  const visibleSections = SECTIONS.filter((s) => allowed === "all" || allowed.includes(s.id));

  const cards = [
    { label: "Announcements", value: announcements, href: "/admin/announcements" },
    { label: "Contact messages", value: contacts, href: "/admin/contacts", badge: unreadContacts || undefined },
    { label: "Registrations", value: registrations, href: "/admin/registrations" },
    { label: "Products", value: products, href: "/admin/products" },
    { label: "Content sections saved", value: contentBlocks, href: `/admin/sections/${visibleSections[0]?.id ?? "hero-slides"}` },
    ...(canManageUsers(role)
      ? [{ label: "Accounts", value: accountCount, href: "/admin/users" }]
      : []),
    ...(canViewLogs(role)
      ? [{ label: "Audit log entries", value: logCount, href: "/admin/logs" }]
      : []),
  ];

  const unseeded = SECTIONS.length - contentBlocks;

  return (
    <div className="max-w-[1100px]">
      <h1 className="text-2xl font-extrabold text-black mb-1">Dashboard</h1>
      <p className="text-sm text-[#525252] mb-6">
        Manage everything the public site renders. You are signed in as{" "}
        <span className="font-semibold text-black">{user?.name || user?.username}</span> —{" "}
        <span className="font-semibold text-[#0000ff]">{role}</span>.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="block bg-white rounded-xl p-5 shadow-[0px_4px_16px_rgba(0,0,0,0.08)] hover:shadow-[0px_8px_24px_rgba(0,0,255,0.2)] transition-all hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-2">
              <span className="text-3xl font-extrabold text-[#0000ff]">{c.value}</span>
              {c.badge ? (
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                  {c.badge} new
                </span>
              ) : null}
            </div>
            <div className="text-sm text-[#525252] mt-1">{c.label}</div>
          </Link>
        ))}
      </div>

      {unseeded > 0 && canManageUsers(role) && (
        <div className="mb-8 px-4 py-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 text-sm">
          {unseeded} of {SECTIONS.length} content sections have not been saved yet. Open a
          section and press <strong>Save</strong> to start editing it, or leave it empty to
          keep using the built-in default.
        </div>
      )}

      <div className="bg-white rounded-xl p-5 shadow-[0px_4px_16px_rgba(0,0,0,0.08)]">
        <h2 className="font-bold text-black mb-1">Quick links</h2>
        <p className="text-xs text-[#525252] mb-3">
          Only sections your role can edit are listed ({visibleSections.length} of {SECTIONS.length}).
        </p>
        <div className="flex flex-wrap gap-2">
          {visibleSections.map((s) => (
            <Link
              key={s.id}
              href={`/admin/sections/${s.id}`}
              className="px-3 py-1.5 rounded-lg bg-[#0000ff]/8 text-[#0000ff] text-sm font-semibold hover:bg-[#0000ff]/15 transition-colors"
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
