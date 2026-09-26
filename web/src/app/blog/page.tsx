import type { Metadata } from "next";
import BlogContent, { type BlogPost } from "./BlogContent";
import { getSectionData } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "Writeups, tutorials and field notes from Cyber Security Club Uttara University.",
};

export default async function BlogPage() {
  const posts = (await getSectionData("blog-posts")) as unknown as BlogPost[];
  return <BlogContent posts={posts} />;
}
