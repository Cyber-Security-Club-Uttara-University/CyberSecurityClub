import type { Metadata } from "next";
import Image from "next/image";
import { getSectionData, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Sponsors",
};

type SponsorPhoto = {
  alt: string;
  description?: string;
  src?: string;
};

/**
 * Rows are managed from /admin/sections/sponsors.
 */
export default async function SponsorsPage() {
  const sponsors = (await getSectionData("sponsors")) as SponsorPhoto[];
  const settings = await getSettings();
  return (
    <div className="min-h-screen">
      {/* Title */}
      <section className="section-animated w-full flex flex-col items-center relative px-8 sm:px-16">
        <div className="heading-title heading-animated font-extrabold text-center text-black mt-[60px] text-[5rem] leading-[5rem] max-md:text-[3rem] max-md:leading-[3rem] max-sm:text-[2.5rem] max-sm:leading-[2.5rem]">
          Our Sponsors
        </div>
      </section>

      {/* Gallery grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsors.map((sponsor, i) => (
            <div
              key={sponsor.alt}
              className="group relative overflow-hidden rounded-2xl bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] shadow-[0px_4px_16px_rgba(0,0,0,0.2)] aspect-[4/3] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_8px_24px_rgba(0,0,255,0.3)]"
              style={{ animation: `fadeInUp 0.6s ease-out ${i * 0.08}s both` }}
            >
              {sponsor.src ? (
                <Image
                  src={sponsor.src}
                  alt={sponsor.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-contain p-8 transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] transition-transform duration-300 group-hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-10 w-10 text-white/40">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 9v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-white/50 text-xs uppercase tracking-widest">Logo coming soon</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-white font-semibold">{sponsor.alt}</p>
                {sponsor.description && <p className="text-white/70 text-sm mt-0.5">{sponsor.description}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Become a sponsor */}
        <div className="mt-16 text-center p-8 bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] rounded-2xl shadow-[0px_4px_16px_rgba(0,0,0,0.2)]">
          <h2 className="text-2xl font-bold mb-3 text-black">Become a Sponsor</h2>
          <p className="text-[#525252] mb-4 max-w-xl mx-auto">Interested in supporting cybersecurity education? We would love to partner with your organization.</p>
          <a href={`mailto:${settings.sponsorEmail}`} className="inline-block px-6 py-3 bg-[#0000ff] text-white rounded-lg font-medium hover:bg-[#0000cc] transition-colors">Contact Us</a>
        </div>
      </section>
    </div>
  );
}
