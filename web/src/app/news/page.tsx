import type { Metadata } from "next";
import NewsContent, { type NewsItem } from "./NewsContent";
import { getSectionData } from "@/lib/content";

export const metadata: Metadata = {
  title: "News",
  description: "Latest news, CTF results, announcements, and events from Cyber Security Club Uttara University.",
};

export default async function NewsPage() {
  const news = (await getSectionData("news-posts")) as unknown as NewsItem[];
  return <NewsContent news={news} />;
}
