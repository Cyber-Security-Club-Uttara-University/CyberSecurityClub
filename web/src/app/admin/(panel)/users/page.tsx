import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { canManageUsers, normalizeRole } from "@/lib/roles";
import UsersManager from "@/components/admin/UsersManager";

export const dynamic = "force-dynamic";

export default async function UsersAdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!canManageUsers(user.role)) redirect("/admin");

  const users = await db.admin.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
      createdAt: true,
    },
    orderBy: [{ role: "asc" }, { id: "asc" }],
  });

  const rows = users.map((u) => ({ ...u, role: normalizeRole(u.role) }));

  return <UsersManager initial={rows} currentId={user.id} />;
}
