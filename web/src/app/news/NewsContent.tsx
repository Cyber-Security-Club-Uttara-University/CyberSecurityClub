"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type NewsCategory = string;
const DEFAULT_CATEGORIES = ["CTF Results", "Announcements", "Events", "General"];

export interface NewsItem {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  category: NewsCategory;
  image: string;
}

export default function NewsContent({ news }: { news: NewsItem[] }) {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>("All");

  const categories = ["All", ...Array.from(new Set(news.map((n) => n.category).filter(Boolean)))];
  for (const c of DEFAULT_CATEGORIES) if (!categories.includes(c)) categories.push(c);

  const filteredNews = news.filter((item) => activeCategory === "All" || item.category === activeCategory);

  return (
    <div className="min-h-screen">
      <section className="section-animated w-full flex flex-col items-center relative px-8 sm:px-16">
        <div className="heading-title heading-animated font-extrabold text-center text-black mt-[60px] text-[5rem] leading-[5rem] max-md:text-[3rem] max-md:leading-[3rem] max-sm:text-[2.5rem] max-sm:leading-[2.5rem]">
          News
        </div>
      </section>

      <section className="pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-3 mb-12 mt-10">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? "bg-[#0000ff] text-white" : "bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] text-black hover:bg-[rgba(211,210,211,0.5)]"}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item, i) => {
            const href = String(item.slug ?? "").trim() ? `/news/${item.slug}` : "";
            const key = String(item.slug ?? item.title ?? i);
            const cardClass =
              "group block bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] rounded-2xl overflow-hidden shadow-[0px_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0px_8px_24px_rgba(0,0,255,0.3)] hover:-translate-y-1 transition-all duration-300";
            const card = (
              <>
                <div className="relative h-48 overflow-hidden">
                  {String(item.image ?? "").trim() ? (
                    <Image src={String(item.image)} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[linear-gradient(135deg,#1a1a2e_0%,#16213e_50%,#0f3460_100%)] text-white/60 text-sm">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-[#0000ff]/10 text-[#0000ff] rounded-full text-xs font-medium">{item.category}</span>
                    <span className="text-xs text-[#525252]">{item.date}</span>
                  </div>
                  <h2 className="text-lg font-bold mb-2 text-black group-hover:text-[#0000ff] transition-colors">{item.title}</h2>
                  <p className="text-sm text-[#525252] line-clamp-2">{item.excerpt}</p>
                </div>
              </>
            );

            return href ? (
              <Link key={key} href={href} className={cardClass}>
                {card}
              </Link>
            ) : (
              <div key={key} className={cardClass}>
                {card}
              </div>
            );
          })}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12"><p className="text-[#525252]">No news found in this category.</p></div>
        )}
      </section>
    </div>
  );
}
