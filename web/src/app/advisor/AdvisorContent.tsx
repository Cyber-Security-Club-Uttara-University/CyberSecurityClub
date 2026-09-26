"use client";

import Image from "next/image";
import { useState } from "react";


type Advisor = {
  name: string;
  role: string;
  org: string;
  image: string;
  linkedin?: string;
};

export type YearGroup = {
  key: string;
  label: string;
  heading: string;
  description?: string;
  sections: { title?: string; advisors: Advisor[] }[];
};

type Props = { yearGroups: YearGroup[] };

function AdvisorCard({ advisor, index }: { advisor: Advisor; index: number }) {
  return (
    <div
      className="member_container relative w-full max-w-[250px] h-[350px] rounded-2xl overflow-hidden bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] shadow-[0px_4px_16px_rgba(0,0,0,0.2)] transition-all duration-150 hover:-translate-y-[5px] hover:shadow-[0px_8px_24px_rgba(0,0,255,0.3)] justify-self-center"
      style={{ animation: `fadeInScale 0.6s ease-out ${0.1 + index * 0.1}s both` }}
    >
      <div className="member_avatar-container relative w-full h-[230px] overflow-hidden">
        <Image
          src={advisor.image}
          alt={`${advisor.name} avatar`}
          fill
          sizes="250px"
          className="member_avatar object-cover shadow-[0px_4px_64px_rgba(0,0,0,0.2)]"
        />
      </div>
      <div className="member_info w-full h-[120px] flex flex-col justify-center items-center px-5 py-1.5 overflow-hidden text-center">
        <div className="member_title text-[1.05rem] font-bold text-black mb-1 w-full truncate">{advisor.name}</div>
        <span className="text-[#0000FF] opacity-90 text-sm truncate w-full">{advisor.role}</span>
        <div className="member_details text-sm mt-0.5">
          <span className="text-[#0000FF] opacity-100 font-extrabold">{advisor.org}</span>
        </div>
        <div className="member_socials w-full mt-1 flex justify-center gap-3.5">
          {advisor.linkedin && (
            <a href={advisor.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
              <svg className="h-5 w-5 text-[#525252] transition-all duration-100 hover:text-[#0000ff]" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function AdvisorContent({ yearGroups }: Props) {
  const [activeYear, setActiveYear] = useState(yearGroups[0]?.key ?? "");
  const active = yearGroups.find((g) => g.key === activeYear) ?? yearGroups[0];

  if (!active) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#525252]">
        No advisors have been added yet.
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Title */}
      <section className="section-animated w-full flex flex-col items-center relative px-8 sm:px-16">
        <div className="heading-title heading-animated font-extrabold text-center text-black mt-[60px] text-[5rem] leading-[5rem] max-md:text-[3rem] max-md:leading-[3rem] max-sm:text-[2.5rem] max-sm:leading-[2.5rem]">
          Advisor
        </div>
        <div className="heading-subtitle heading-animated font-semibold text-center text-[#525252] mt-3 mb-2 text-[1.3rem] leading-8 max-w-[90%]">
          Meet all of our wonderful advisor!
        </div>
      </section>

      {/* Year selector */}
      <div className="year-selector-wrapper sticky top-[100px] z-40 w-full flex justify-center mt-8 px-4">
        <div className="year-selector flex flex-wrap justify-center gap-2 p-2 rounded-full bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] shadow-[0px_4px_16px_rgba(0,0,0,0.2)]">
          {yearGroups.map((group) => (
            <button
              key={group.key}
              onClick={() => setActiveYear(group.key)}
              className={`year-btn px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeYear === group.key
                  ? "bg-[#0000ff] text-white shadow-[0_4px_15px_rgba(0,0,255,0.3)] -translate-y-0.5"
                  : "text-black hover:bg-[rgba(211,210,211,0.5)] hover:-translate-y-0.5"
              }`}
            >
              {group.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active year content */}
      <div className="graduation-group" key={active.key}>
        <div className="about-section-heading heading-animated font-extrabold text-center text-black mt-[40px] text-[2.5rem] leading-[2.5rem]">
          {active.heading}
        </div>
        {active.description && (
          <div className="about-section-description text-center text-[#525252] mt-3 text-[1.05rem]">
            {active.description}
          </div>
        )}

        {active.sections.map((section) => (
          <section key={section.title ?? active.key} className="members-section section-animated">
            {section.title && (
              <div className="about-section-heading font-extrabold text-center text-black mt-[30px] text-[1.75rem] leading-[1.75rem]">
                {section.title}
              </div>
            )}
            <div className="members-container w-full flex justify-center mt-[30px] mb-12 px-8 sm:px-16">
              <div
                className="members-grid w-full max-w-[85%] grid gap-8 justify-center"
                style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 250px))" }}
              >
                {section.advisors.map((advisor, i) => (
                  <AdvisorCard key={`${active.key}-${section.title ?? ""}-${advisor.name}`} advisor={advisor} index={i} />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

