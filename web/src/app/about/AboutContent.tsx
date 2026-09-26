"use client";

import Image from "next/image";
import { useState } from "react";

type Member = {
  name: string;
  role: string;
  image: string;
  linkedin?: string;
};

type CommitteeData = { [year: string]: Member[] };

type Props = {
  committees: CommitteeData;
  yearLabels: { [key: string]: string };
  aboutText: string;
};

export function AboutContent({ committees, yearLabels, aboutText }: Props) {
  const years = Object.keys(committees);
  const [selectedYear, setSelectedYear] = useState(years[0]);

  return (
    <div className="about-container w-full max-w-[120rem] mx-auto">
      {/* Title */}
      <section className="section-animated w-full flex flex-col items-center relative px-8 sm:px-16">
        <div className="heading-title heading-animated font-extrabold text-center text-black mt-[60px] text-[5rem] leading-[5rem] max-md:text-[3rem] max-md:leading-[3rem] max-sm:text-[2.5rem] max-sm:leading-[2.5rem]">
          About Us
        </div>
      </section>

      {/* Description */}
      <section className="section-animated w-full flex flex-col items-center relative px-8 sm:px-16 mt-6">
        <div className="w-full max-w-[70%] max-md:max-w-[90%]">
          <div className="heading-description font-semibold text-center text-[#525252] mt-4 text-[1.3rem] leading-8 max-sm:text-[1.05rem] max-sm:leading-7">
            {aboutText}
          </div>
        </div>
      </section>

      {/* Executive Committee */}
      <section className="section-animated w-full flex flex-col items-center relative px-8 sm:px-16">
        <div className="about-section-heading font-extrabold text-center text-black mt-[30px] text-[2.5rem] leading-[2.5rem]">
          Executive Committee
        </div>

        {/* Year Selector */}
        <div className="year-selector flex flex-wrap justify-center gap-2 mt-8 mb-12">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`year-btn px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border border-transparent ${
                selectedYear === year
                  ? "bg-[#0000ff] text-white shadow-[0_4px_15px_rgba(0,0,255,0.3)] -translate-y-0.5"
                  : "bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] text-black hover:bg-[rgba(211,210,211,0.5)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,255,0.15)]"
              }`}
            >
              {yearLabels[year]}
            </button>
          ))}
        </div>

        {/* Year Heading */}
        <div className="about-section-heading font-extrabold text-center text-black text-[2.5rem] leading-[2.5rem]">
          {selectedYear}
        </div>

        {/* Members Grid */}
        <div className="members-container w-full flex justify-center mt-[30px] mb-12 px-8 sm:px-16">
          <div
            className="members-grid w-full max-w-[85%] grid gap-8 justify-center max-[1024px]:max-w-[90%]"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 250px))" }}
          >
            {committees[selectedYear].map((member, i) => (
              <div
                key={`${selectedYear}-${member.name}`}
                className="member_container grid-item-animated relative w-full max-w-[250px] h-[350px] rounded-2xl overflow-hidden bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] shadow-[0px_4px_16px_rgba(0,0,0,0.2)] transition-all duration-150 hover:-translate-y-[5px] hover:shadow-[0px_8px_24px_rgba(0,0,255,0.3)] justify-self-center"
                style={{ animation: `fadeInScale 0.6s ease-out ${0.1 + Math.min(i * 0.08, 0.8)}s both` }}
              >
                {/* Avatar */}
                <div className="member_avatar-container relative w-full h-[230px] overflow-hidden">
                  <Image
                    src={member.image}
                    alt={`${member.name} avatar`}
                    fill
                    sizes="250px"
                    className="member_avatar object-cover shadow-[0px_4px_64px_rgba(0,0,0,0.2)]"
                  />
                </div>
                {/* Info */}
                <div className="member_info w-full h-[120px] flex flex-col justify-center items-center px-5 py-1.5 overflow-hidden text-center">
                  <div className="member_title text-[1.1rem] font-bold text-black mb-1 truncate w-full">
                    {member.name}
                  </div>
                  <div className="member_details text-base font-normal overflow-hidden whitespace-nowrap flex-grow flex items-center">
                    <span className="text-[#0000ff] opacity-100 font-extrabold">{member.role}</span>
                  </div>
                  <div className="member_socials w-full mt-0.5 px-2.5 flex justify-center gap-3.5">
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                        <svg className="member_social-link h-5 w-5 text-[#525252] transition-all duration-100 hover:opacity-100 hover:text-[#0000ff]" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
