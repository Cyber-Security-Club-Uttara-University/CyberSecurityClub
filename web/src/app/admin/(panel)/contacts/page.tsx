import { db } from "@/lib/db";
import { getRecordConfig } from "@/content/records";
import RecordAdmin from "@/components/admin/RecordAdmin";

export const dynamic = "force-dynamic";

export default async function ContactsAdminPage() {
  const config = getRecordConfig("contacts")!;
  const rows = await db.contact.findMany({ orderBy: { id: "desc" } });
  return <RecordAdmin config={config} initial={rows as never} />;
}
