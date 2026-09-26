import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CTF Rulebook",
};

const rules = [
  { title: "Fair Play Policy", content: "All participants must compete with integrity. Collusion between teams, sharing flags, or any form of cheating will result in immediate disqualification." },
  { title: "No Attacking Infrastructure", content: "Do not attack, probe, or exploit the CTF infrastructure, servers, or competition platform. Only the challenges and services provided within the CTF environment are in scope." },
  { title: "Flag Submission Format", content: "Flags must be submitted in the format: FLAG{...} or CSC{...} unless otherwise specified. Flags are case-sensitive and must be submitted exactly as found." },
  { title: "Scoring System", content: "Challenges carry varying point values based on difficulty. Points are awarded upon successful flag submission. Dynamic scoring may be used where earlier solves earn more points." },
  { title: "Disqualification Criteria", content: "Teams may be disqualified for: attacking other teams, sharing flags, exploiting unintended vulnerabilities, using automated tools against the platform, or any unsportsmanlike behavior." },
  { title: "Rules & Disputes", content: "The organizers' decisions are final. Any disputes must be raised through official channels during the competition. Rules may be updated at any time." },
];

export default function RulebookPage() {
  return (
    <div className="min-h-screen">
      <section className="section-animated w-full flex flex-col items-center relative px-8 sm:px-16">
        <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#1a1a2e_0%,#16213e_50%,#0f3460_100%)] p-10 text-white text-center mb-12 mt-[60px] max-w-[80rem] mx-auto w-[calc(100%-2.5rem)]">
          <h1 className="text-4xl font-bold mb-3">CTF Rulebook</h1>
          <p className="text-lg opacity-90">Official rules and guidelines for all CSC Capture The Flag competitions.</p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rules.map((rule) => (
            <div key={rule.title} className="bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] rounded-2xl p-8 shadow-[0px_4px_16px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:shadow-[0px_8px_24px_rgba(0,0,255,0.3)] transition-all duration-300">
              <h2 className="text-xl font-bold mb-4 text-[#0000ff]">{rule.title}</h2>
              <p className="text-[#525252] leading-relaxed">{rule.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
