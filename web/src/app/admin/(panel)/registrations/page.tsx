import { db } from "@/lib/db";
import { getRecordConfig } from "@/content/records";
import RecordAdmin from "@/components/admin/RecordAdmin";

export const dynamic = "force-dynamic";

export default async function RegistrationsAdminPage() {
  const config = getRecordConfig("registrations")!;
  const rows = await db.registration.findMany({ orderBy: { id: "desc" } });
  return <RecordAdmin config={config} initial={rows as never} />;
}
