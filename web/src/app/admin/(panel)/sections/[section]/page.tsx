import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSection } from "@/content/sections";
import { DEFAULTS } from "@/content/defaults";
import { getCurrentUser } from "@/lib/session";
import { canAccessSection } from "@/lib/roles";
import SectionEditor from "@/components/admin/SectionEditor";

export const dynamic = "force-dynamic";

type Row = Record<string, string | number | boolean | undefined>;

export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: id } = await params;

  const section = getSection(id);
  if (!section) notFound();

  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!canAccessSection(user.role, id)) redirect("/admin");

  const block = await db.contentBlock.findUnique({ where: { key: id } });
  const initial = !block
    ? ((DEFAULTS[id] ?? []) as Row[])
    : Array.isArray(block.data)
      ? (block.data as unknown as Row[])
      : [];

  return <SectionEditor section={section} initial={initial} exists={!!block} />;
}
