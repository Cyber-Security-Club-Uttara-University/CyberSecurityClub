"use client";

import { useState } from "react";
import Link from "next/link";

type BlogCategory = string;
const DEFAULT_BLOG_CATEGORIES = ["CTF Writeups", "Events", "Tutorials", "Tools"];

export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  author: string;
  category: BlogCategory;
  readingTime: string;
}

export default function BlogContent({ posts }: { posts: BlogPost[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<BlogCategory>("All");

  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))];
  for (const c of DEFAULT_BLOG_CATEGORIES) if (!categories.includes(c)) categories.push(c);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <section className="section-animated w-full flex flex-col items-center relative px-8 sm:px-16">
        <div className="heading-title heading-animated font-extrabold text-center text-black mt-[60px] text-[5rem] leading-[5rem] max-md:text-[3rem] max-md:leading-[3rem] max-sm:text-[2.5rem] max-sm:leading-[2.5rem]">
          Blog
        </div>
      </section>

      <section className="pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-md mx-auto mb-8">
          <input type="text" placeholder="Search posts..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] rounded-lg border border-transparent focus:outline-none focus:border-[#0000ff] transition-all text-black placeholder:text-[#525252]" />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? "bg-[#0000ff] text-white" : "bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] text-black hover:bg-[rgba(211,210,211,0.5)]"}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => {
            const href = post.slug ? `/blog/${post.slug}` : "";
            const cls =
              "group block bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] rounded-2xl p-6 shadow-[0px_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0px_8px_24px_rgba(0,0,255,0.3)] hover:-translate-y-1 transition-all duration-300";
            const inner = (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-[#0000ff]/10 text-[#0000ff] rounded-full text-xs font-medium">{post.category}</span>
                </div>
                <h2 className="text-xl font-bold mb-2 text-black group-hover:text-[#0000ff] transition-colors">{post.title}</h2>
                <p className="text-sm text-[#525252] mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-[#525252]">
                  <span>{post.author}</span>
                  <span>{post.date}</span>
                  <span>{post.readingTime}</span>
                </div>
              </>
            );
            return href ? (
              <Link key={post.slug} href={href} className={cls}>
                {inner}
              </Link>
            ) : (
              <div key={post.title} className={cls}>
                {inner}
              </div>
            );
          })}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12"><p className="text-[#525252]">No posts found matching your criteria.</p></div>
        )}
      </section>
    </div>
  );
}
