import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SETTINGS_DEFAULTS } from "@/content/defaults";
import { getCurrentUser } from "@/lib/session";
import { canEditSettings } from "@/lib/roles";
import SettingsEditor from "@/components/admin/SettingsEditor";

export const dynamic = "force-dynamic";

export default async function SettingsAdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!canEditSettings(user.role)) redirect("/admin");

  const block = await db.contentBlock.findUnique({ where: { key: "site-settings" } });
  const stored = block ? (block.data as Record<string, string>) : null;
  const initial = stored ? { ...SETTINGS_DEFAULTS, ...stored } : SETTINGS_DEFAULTS;

  return <SettingsEditor initial={initial} exists={!!block} />;
}
