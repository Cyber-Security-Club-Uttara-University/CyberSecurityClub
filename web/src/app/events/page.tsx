import type { Metadata } from "next";
import Image from "next/image";
import { getSectionData } from "@/lib/content";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming and past events hosted by Cyber Security Club Uttara University.",
};

type EventPhoto = {
  alt: string;
  /** Add an image path (e.g. "/images/Previous Event/Cybercon24.png") to display it. */
  src?: string;
};

/**
 * Rows are managed from /admin/sections/events. Falls back to built-in defaults
 * when the section has never been saved.
 */
export default async function EventsPage() {
  const events = (await getSectionData("events")) as EventPhoto[];

  return (
    <div className="min-h-screen">
      {/* Title */}
      <section className="section-animated w-full flex flex-col items-center relative px-8 sm:px-16">
        <div className="heading-title heading-animated font-extrabold text-center text-black mt-[60px] text-[5rem] leading-[5rem] max-md:text-[3rem] max-md:leading-[3rem] max-sm:text-[2.5rem] max-sm:leading-[2.5rem]">
          Events
        </div>
      </section>

      {/* Gallery grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, i) => (
            <div
              key={event.alt}
              className="group relative overflow-hidden rounded-2xl bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] shadow-[0px_4px_16px_rgba(0,0,0,0.2)] aspect-[4/3] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_8px_24px_rgba(0,0,255,0.3)]"
              style={{ animation: `fadeInUp 0.6s ease-out ${i * 0.08}s both` }}
            >
              {event.src ? (
                <Image
                  src={event.src}
                  alt={event.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] transition-transform duration-300 group-hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-10 w-10 text-white/40">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 10-6 0 3 3 0 006 0z" />
                  </svg>
                  <span className="text-white/50 text-xs uppercase tracking-widest">Image coming soon</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <p className="absolute bottom-4 left-4 right-4 text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">{event.alt}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
