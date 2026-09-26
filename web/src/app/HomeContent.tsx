"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export type Slide = { src: string; alt: string };
export type NewsItem = { href: string; image: string; title: string; date: string };
export type HomeEvent = { name: string; date: string; location?: string; href: string; status: string };

type Props = {
  slides: Slide[];
  newsItems: NewsItem[];
  events: HomeEvent[];
  tagline: string;
};

function EventCard({ ev, animated = false }: { ev: HomeEvent; animated?: boolean }) {
  return (
    <Link
      href={ev.href}
      className={`w-full cursor-pointer rounded-lg border border-transparent p-4 opacity-100 no-underline grid grid-cols-[1fr_40px] shadow-[0px_4px_16px_rgba(0,0,0,0.2)] transition-all duration-150 bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] hover:border-2 hover:border-[#2323FF] hover:bg-[#e2e2e7] hover:-translate-y-px hover:scale-[1.05] ${animated ? "card-animated" : ""}`}
    >
      <div>
        <div className="font-bold text-[#0000ff] mb-2 text-xl leading-6">{ev.name}</div>
        <div className="flex font-normal text-[#0000ff] opacity-70 text-[1.05rem] leading-5">
          {ev.date}
          {ev.location ? (
            <>
              <br />
              {ev.location}
            </>
          ) : null}
        </div>
      </div>
      <div className="w-full h-full flex justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#0000ff" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
      </div>
    </Link>
  );
}

export default function HomeContent({ slides: slideshowImages, newsItems, events, tagline }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentNewsSlide, setCurrentNewsSlide] = useState(0);
  const itemsPerSlide = 3;
  const totalNewsSlides = Math.max(1, Math.ceil(newsItems.length / itemsPerSlide));
  const upcomingEvents = events.filter((e) => e.status !== "Previous");
  const previousEvents = events.filter((e) => e.status === "Previous");

  useEffect(() => {
    if (slideshowImages.length < 2) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshowImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slideshowImages.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentNewsSlide((prev) => (prev + 1) % totalNewsSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [totalNewsSlides]);

  const startIdx = currentNewsSlide * itemsPerSlide;
  const visibleNews = newsItems.slice(startIdx, startIdx + itemsPerSlide);

  return (
    <main className="page-content" aria-label="Content">
      <div>
        {/* Hero Section - fullscreen image with club name centered */}
        <section className="section-animated relative w-full h-[calc(100vh-100px)] min-h-[540px] overflow-hidden">
          <div className="absolute inset-0">
            {slideshowImages.map((img, i) => (
              <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="100vw"
                  priority={i === 0}
                  className="object-cover"
                />
              </div>
            ))}
            <div className="absolute inset-0 z-20 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.75)_100%)]" />
          </div>

          <div className="relative z-30 h-full w-full flex flex-col items-center justify-center text-center px-6">
            <div className="heading-title heading-animated font-extrabold text-white text-[5rem] leading-[1.05] max-md:text-[3rem] max-sm:text-[2.2rem]">
              Cyber Security Club
            </div>
            <div className="heading-subtitle heading-animated font-extrabold text-white text-[3.5rem] leading-[1.05] mt-3 max-md:text-[2rem] max-sm:text-[1.3rem]">
              Uttara University
            </div>
            <span className="type-animate heading-animated font-semibold text-[#3b6dff] mt-7 text-[1.3rem] leading-8 max-md:text-[1.15rem] max-md:leading-7 max-sm:text-[1rem] relative inline-block">
              {/* Invisible sizer: gives the wrapper the exact text width so it never shifts while typing */}
              <span className="invisible whitespace-nowrap" aria-hidden="true">
                {tagline}
              </span>
              <span
                className="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap text-[#3b6dff] border-r-[0.15em] border-[#3b6dff]"
                style={{
                  width: 0,
                  animation: `typing 3.5s steps(${tagline.length}, end) 0.8s both, blink-caret 0.75s step-end infinite 0.8s`,
                }}
              >
                {tagline}
              </span>
            </span>

            <a href="#home-news"
              className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-colors animate-bounce"
              aria-label="Scroll to content">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          </div>
        </section>

        {/* News Section */}
        <section id="home-news" className="section-animated py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="news-header">
            <h2 className="text-3xl font-bold text-center mb-10">Latest News &amp; Highlights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleNews.map((item, i) => (
              <Link
                key={`${currentNewsSlide}-${i}`}
                href={item.href}
                className="group block bg-white rounded-2xl overflow-hidden shadow-[0px_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0px_8px_24px_rgba(0,0,255,0.3)] hover:-translate-y-1 transition-all duration-300"
                style={{ animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-[#0000ff] transition-colors">{item.title}</h3>
                  <p className="text-sm text-[#525252]">{item.date}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalNewsSlides }).map((_, i) => (
              <button key={i} onClick={() => setCurrentNewsSlide(i)}
                className={`w-3 h-3 rounded-full transition-colors ${i === currentNewsSlide ? "bg-[#0000ff]" : "bg-gray-300"}`} />
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/news" className="inline-block px-6 py-3 bg-[#0000ff] text-white rounded-lg font-medium hover:bg-[#0000cc] transition-colors">View All</Link>
          </div>
        </section>

        {/* Upcoming Events - matches old events style */}
        <div className="section-animated max-w-[80rem] mx-auto mb-8 px-5 max-sm:px-5">
          <div className="section-animated events-section-title text-[#000000] opacity-75 text-xl leading-7 font-semibold mb-4">Upcoming Events</div>
          <div className="w-full mt-6 flex flex-col flex-wrap gap-5 justify-center">
            {upcomingEvents.map((ev, i) => (
              <EventCard key={`up-${i}`} ev={ev} animated />
            ))}
          </div>
        </div>

        {/* Previous Events */}
        <div className="max-w-[80rem] mx-auto mb-8 px-5">
          <div className="events-section-title text-[#000000] opacity-75 text-xl leading-7 font-semibold mb-4">Previous Events</div>
          <div className="w-full mt-6 flex flex-col flex-wrap gap-5 justify-center">
            {previousEvents.map((ev, i) => (
              <EventCard key={`prev-${i}`} ev={ev} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
