import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { canManageUsers } from "@/lib/roles";
import WhitelistManager from "@/components/admin/WhitelistManager";

export const dynamic = "force-dynamic";

export default async function WhitelistAdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!canManageUsers(user.role)) redirect("/admin");

  const entries = await db.whitelistEntry.findMany({ orderBy: { id: "asc" } });

  return <WhitelistManager initial={entries} />;
}
