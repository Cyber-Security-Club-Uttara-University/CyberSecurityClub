import type { Metadata } from "next";
import { AdvisorContent, type YearGroup } from "./AdvisorContent";
import { getSectionData } from "@/lib/content";

export const metadata: Metadata = {
  title: "Advisor",
};

type Row = {
  name: string;
  role: string;
  org?: string;
  year: string;
  heading?: string;
  description?: string;
  group?: string;
  image: string;
  linkedin?: string;
};

export default async function AdvisorPage() {
  const rows = (await getSectionData("advisors")) as Row[];

  const yearGroups: YearGroup[] = [];

  for (const r of rows) {
    let group = yearGroups.find((g) => g.key === r.year);
    if (!group) {
      group = {
        key: r.year,
        label: r.year,
        heading: r.heading || r.year,
        description: r.description || undefined,
        sections: [],
      };
      yearGroups.push(group);
    }

    const title = r.group && r.group !== "Advisors" ? r.group : undefined;
    let section = group.sections.find((s) => s.title === title);
    if (!section) {
      section = { title, advisors: [] };
      group.sections.push(section);
    }

    section.advisors.push({
      name: r.name,
      role: r.role,
      org: r.org || "",
      image: r.image,
      linkedin: r.linkedin || undefined,
    });
  }

  return <AdvisorContent yearGroups={yearGroups} />;
}
