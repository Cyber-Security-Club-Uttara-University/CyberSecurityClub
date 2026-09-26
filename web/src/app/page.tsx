import type { Metadata } from "next";
import HomeContent, { type Slide, type NewsItem, type HomeEvent } from "./HomeContent";
import { getSectionData, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Cyber Security Club, Uttara University",
  description:
    "Official website of the Cyber Security Club at Uttara University — CTF competitions, workshops, events, and security resources.",
};

type NewsPost = {
  title?: string;
  slug?: string;
  date?: string;
  image?: string;
};

export default async function HomePage() {
  const [slides, newsPosts, homeEvents, settings] = await Promise.all([
    getSectionData("hero-slides"),
    getSectionData("news-posts"),
    getSectionData("home-events"),
    getSettings(),
  ]);

  // Homepage "Latest News" mirrors the News Posts section, top of list first.
  const newsItems: NewsItem[] = ((newsPosts ?? []) as NewsPost[]).map((p) => {
    const slug = String(p.slug ?? "").trim();
    const image = String(p.image ?? "").trim();
    return {
      title: String(p.title ?? ""),
      date: String(p.date ?? ""),
      href: slug ? `/news/${slug}` : "/news",
      image: image || "/images/not-available.png",
    };
  });

  return (
    <HomeContent
      slides={slides as Slide[]}
      newsItems={newsItems}
      events={homeEvents as HomeEvent[]}
      tagline={settings.tagline || "Hunt Together, Defend Together"}
    />
  );
}
