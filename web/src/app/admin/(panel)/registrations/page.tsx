import { db } from "@/lib/db";
import { getRecordConfig } from "@/content/records";
import RecordAdmin from "@/components/admin/RecordAdmin";
import JoinFormSettings from "@/components/admin/JoinFormSettings";

export const dynamic = "force-dynamic";

export default async function RegistrationsAdminPage() {
  const config = getRecordConfig("registrations")!;
  const rows = await db.registration.findMany({ orderBy: { id: "desc" } });
  return (
    <div className="space-y-6">
      <RecordAdmin config={config} initial={rows as never} />
      <JoinFormSettings />
    </div>
  );
}
