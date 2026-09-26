import type { Metadata } from "next";
import { AboutContent } from "./AboutContent";
import { getSectionData, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about the Cyber Security Club at Uttara University — our mission, executive committee, and the team behind CSC UU.",
};

type Row = { name: string; role: string; year: string; yearLabel?: string; image: string; linkedin?: string };

export default async function AboutPage() {
  const [rowsRaw, settings] = await Promise.all([
    getSectionData("committee"),
    getSettings(),
  ]);
  const rows = rowsRaw as unknown as Row[];

  const committees: Record<string, { name: string; role: string; image: string; linkedin?: string }[]> = {};
  const yearLabels: Record<string, string> = {};

  for (const r of rows) {
    if (!committees[r.year]) committees[r.year] = [];
    committees[r.year].push({
      name: r.name,
      role: r.role,
      image: r.image,
      linkedin: r.linkedin || undefined,
    });
    if (r.yearLabel && !yearLabels[r.year]) yearLabels[r.year] = r.yearLabel;
  }

  for (const year of Object.keys(committees)) {
    if (!yearLabels[year]) yearLabels[year] = year.split("-")[0];
  }

  return (
    <AboutContent
      committees={committees}
      yearLabels={yearLabels}
      aboutText={settings.aboutText}
    />
  );
}
