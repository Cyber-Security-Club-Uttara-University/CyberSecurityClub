"use client";

import Link from "next/link";

const steps = [
  { number: 1, title: "Fill Out the Recruitment Form", description: "Submit your application with your academic and contact details." },
  { number: 2, title: "Attend the Orientation Session", description: "Join our orientation to learn about the club, its mission, and what we do." },
  { number: 3, title: "Complete the Starter Challenges", description: "Prove your skills by solving beginner-friendly CTF challenges." },
  { number: 4, title: "Become an Official Member", description: "Welcome aboard! Gain full access to all club activities and resources." },
];

const benefits = [
  { title: "CTF Competitions", description: "Participate in internal and external Capture The Flag events." },
  { title: "Workshops & Training", description: "Hands-on sessions on ethical hacking, forensics, and more." },
  { title: "Networking", description: "Connect with like-minded students, alumni, and industry experts." },
  { title: "Resources & Tools", description: "Access to premium learning materials, lab environments, and tools." },
  { title: "Mentorship", description: "Guidance from experienced seniors and executive committee members." },
];

export default function MembershipPage() {
  return (
    <div>
      <section className="section-animated w-full flex flex-col items-center relative px-8 sm:px-16">
        <div className="heading-title heading-animated font-extrabold text-center text-black mt-[60px] text-[5rem] leading-[5rem] max-md:text-[3rem] max-md:leading-[3rem] max-sm:text-[2.5rem] max-sm:leading-[2.5rem]">
          Membership
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <h2 className="about-section-heading font-extrabold text-center text-black text-[2.5rem] leading-[2.5rem] mb-12">How to Join</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step) => (
            <div key={step.number}
              className="bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] rounded-2xl p-8 shadow-[0px_4px_16px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:shadow-[0px_8px_24px_rgba(0,0,255,0.3)] transition-all duration-300">
              <span className="text-xs font-mono text-[#0000ff] tracking-wider uppercase">Step {step.number}</span>
              <h3 className="text-lg font-semibold mt-1 text-black">{step.title}</h3>
              <p className="text-[#525252] mt-2 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/recruitment" className="inline-block px-8 py-3 bg-[#0000ff] text-white rounded-lg font-medium hover:bg-[#0000cc] transition-colors">Apply Now</Link>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="about-section-heading font-extrabold text-center text-black text-[2.5rem] leading-[2.5rem] mb-12">Member Benefits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title}
                className="bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] rounded-2xl p-6 hover:bg-[rgba(211,210,211,0.5)] transition-colors shadow-[0px_4px_16px_rgba(0,0,0,0.2)]">
                <h3 className="font-semibold mb-2 text-black">{benefit.title}</h3>
                <p className="text-sm text-[#525252] leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
