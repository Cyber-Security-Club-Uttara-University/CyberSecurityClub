import { db } from "@/lib/db";
import { getRecordConfig } from "@/content/records";
import RecordAdmin from "@/components/admin/RecordAdmin";

export const dynamic = "force-dynamic";

export default async function ProductsAdminPage() {
  const config = getRecordConfig("products")!;
  const rows = await db.product.findMany({ orderBy: { id: "desc" } });
  return <RecordAdmin config={config} initial={rows as never} />;
}
