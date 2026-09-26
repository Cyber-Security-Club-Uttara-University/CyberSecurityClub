import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getSection } from "@/content/sections";
import { DEFAULTS } from "@/content/defaults";
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

  const block = await db.contentBlock.findUnique({ where: { key: id } });
  const stored = block ? (block.data as unknown as Row[]) : null;
  const initial = Array.isArray(stored) && stored.length > 0 ? stored : (DEFAULTS[id] ?? []);

  return <SectionEditor section={section} initial={initial} exists={!!block} />;
}
