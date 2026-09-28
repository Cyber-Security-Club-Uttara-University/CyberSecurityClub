import { db } from "@/lib/db";
import { getRecordConfig } from "@/content/records";
import RecordAdmin from "@/components/admin/RecordAdmin";

export const dynamic = "force-dynamic";

export default async function AnnouncementsAdminPage() {
  const config = getRecordConfig("announcements")!;
  const rows = await db.announcement.findMany({ orderBy: { id: "desc" } });
  return <RecordAdmin config={config} initial={rows as never} />;
}
