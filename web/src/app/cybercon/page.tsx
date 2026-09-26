"use client";

import Link from "next/link";

const schedule = [
  { time: "09:00 AM", event: "Registration & Check-in" },
  { time: "10:00 AM", event: "Opening Ceremony" },
  { time: "11:00 AM", event: "Keynote Speech" },
  { time: "01:00 PM", event: "Lunch Break" },
  { time: "02:00 PM", event: "Workshops & Villages" },
  { time: "05:00 PM", event: "CTF Competition" },
  { time: "08:00 PM", event: "Closing Ceremony & Awards" },
];

const villages = [
  { title: "Binary Village", description: "Reverse engineering, binary exploitation, and pwn challenges." },
  { title: "Forensics Village", description: "Digital forensics, memory analysis, and evidence recovery." },
  { title: "Web Village", description: "Web application security, SQL injection, XSS, and more." },
];

export default function CyberConPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#1a1a2e_0%,#16213e_50%,#0f3460_100%)]">
        <div className="absolute inset-0 bg-[url('/images/slideshow/Cybercon24.jpeg')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-mono mb-6">
            Cyber Security Club | Uttara University
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">CyberCon<span className="text-white/80">25</span></h1>
          <p className="text-xl md:text-2xl font-light mb-4 opacity-90">Premier Cybersecurity Conference</p>
          <div className="flex items-center justify-center gap-6 text-sm opacity-80 mb-8">
            <span>27 November 2025</span>
            <span>Uttara University</span>
          </div>
          <Link href="/cybercon/registration" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0f3460] rounded-xl font-bold text-lg hover:bg-white/90 transition-colors">Register Now</Link>
        </div>
      </section>

      {/* About */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-black">About CyberCon25</h2>
          <p className="text-[#525252] leading-relaxed text-lg">CyberCon25 is the premier cybersecurity conference organized by the Cyber Security Club at Uttara University. Join us for expert talks, workshops, CTF competitions, and interactive security villages.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
          {[
            { value: "500+", label: "Expected Attendees" },
            { value: "12+", label: "Expert Speakers" },
            { value: "3", label: "Security Villages" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-6 bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] rounded-2xl shadow-[0px_4px_16px_rgba(0,0,0,0.2)]">
              <h3 className="font-bold text-2xl text-[#0000ff]">{stat.value}</h3>
              <p className="text-sm text-[#525252] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Schedule */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-black">Schedule</h2>
        <div className="space-y-4">
          {schedule.map((item, i) => (
            <div key={i} className="flex items-center gap-6 p-5 bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] rounded-2xl shadow-[0px_4px_16px_rgba(0,0,0,0.2)]">
              <span className="text-sm font-mono text-[#0000ff] font-bold w-24 flex-shrink-0">{item.time}</span>
              <div className="w-px h-8 bg-[rgba(211,210,211,0.5)] flex-shrink-0" />
              <span className="font-medium text-black">{item.event}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Villages */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-black">Security Villages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {villages.map((village) => (
              <div key={village.title} className="bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] rounded-2xl p-8 shadow-[0px_4px_16px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:shadow-[0px_8px_24px_rgba(0,0,255,0.3)] transition-all duration-300">
                <h3 className="text-lg font-bold mb-2 text-[#0000ff]">{village.title}</h3>
                <p className="text-sm text-[#525252] leading-relaxed">{village.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[linear-gradient(135deg,#1a1a2e_0%,#16213e_50%,#0f3460_100%)] text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Join?</h2>
        <p className="text-lg opacity-80 mb-8 max-w-xl mx-auto">Register for CyberCon25 and be part of the largest cybersecurity gathering at Uttara University.</p>
        <Link href="/cybercon/registration" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0f3460] rounded-xl font-bold text-lg hover:bg-white/90 transition-colors">Register Now</Link>
      </section>
    </div>
  );
}
