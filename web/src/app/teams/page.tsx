import type { Metadata } from "next";
import Image from "next/image";
import { getSectionData } from "@/lib/content";

export const metadata: Metadata = {
  title: "Teams",
};

type Member = { name: string; avatar: string };
type Team = { name: string; members: Member[] };

export default async function TeamsPage() {
  const rows = (await getSectionData("team-members")) as {
    team: string;
    name: string;
    avatar: string;
  }[];

  const teams: Team[] = [];
  for (const row of rows) {
    const existing = teams.find((t) => t.name === row.team);
    const member = { name: row.name, avatar: row.avatar };
    if (existing) existing.members.push(member);
    else teams.push({ name: row.team, members: [member] });
  }
  return (
    <div className="min-h-screen">
      {/* Title */}
      <section className="section-animated w-full flex flex-col items-center relative px-8 sm:px-16">
        <div className="heading-title heading-animated font-extrabold text-center text-black mt-[60px] text-[5rem] leading-[5rem] max-md:text-[3rem] max-md:leading-[3rem] max-sm:text-[2.5rem] max-sm:leading-[2.5rem]">
          Teams
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-12">
          {teams.map((team) => (
            <div key={team.name}>
              <h2 className="about-section-heading font-extrabold text-center text-black text-[2.5rem] leading-[2.5rem] mb-8">{team.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {team.members.map((member) => (
                  <div key={member.name}
                    className="flex flex-col items-center p-6 bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] rounded-2xl shadow-[0px_4px_16px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_8px_24px_rgba(0,0,255,0.3)]">
                    <div className="relative w-28 h-28 mb-4 overflow-hidden rounded-full">
                      <Image src={member.avatar} alt={member.name} fill className="object-cover" sizes="112px" />
                    </div>
                    <h3 className="font-semibold text-lg text-black">{member.name}</h3>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
