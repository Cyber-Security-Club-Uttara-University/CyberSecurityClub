import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getSectionData } from "@/lib/content";

type Post = {
  title?: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  date?: string;
  author?: string;
  category?: string;
  image?: string;
};

async function findPost(rawSlug: string): Promise<Post | null> {
  const slug = decodeURIComponent(rawSlug).trim().toLowerCase();
  if (!slug) return null;
  const rows = (await getSectionData("news-posts")) as unknown as Post[];
  return rows.find((p) => String(p.slug ?? "").trim().toLowerCase() === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await findPost(slug);
  if (!post) return { title: "News Not Found" };
  return {
    title: post.title ?? "News",
    description: post.excerpt ?? undefined,
  };
}

function paragraphs(text: string) {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default async function NewsPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await findPost(slug);
  if (!post) notFound();

  const body = String(post.body ?? "").trim() || String(post.excerpt ?? "").trim();
  const image = String(post.image ?? "").trim();

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link
        href="/news"
        className="inline-flex items-center gap-2 text-[#525252] hover:text-[#0000ff] transition-colors mb-8"
      >
        &larr; Back to News
      </Link>

      <article>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {post.category && (
            <span className="px-3 py-1 bg-[#0000ff]/10 text-[#0000ff] rounded-full text-xs font-medium">
              {post.category}
            </span>
          )}
          {post.date && <span className="text-sm text-[#525252]">{post.date}</span>}
          {post.author && <span className="text-sm text-[#525252]">by {post.author}</span>}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-black">{post.title}</h1>

        {image && (
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-[0px_4px_16px_rgba(0,0,0,0.2)]">
            <Image
              src={image}
              alt={String(post.title ?? "")}
              fill
              sizes="(max-width: 768px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        )}

        <div className="bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] rounded-2xl p-8 shadow-[0px_4px_16px_rgba(0,0,0,0.2)]">
          {body ? (
            <div className="space-y-5">
              {paragraphs(body).map((p, i) => (
                <p key={i} className="text-lg text-[#525252] leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-lg text-[#525252] leading-relaxed">
              No content has been written for this article yet.
            </p>
          )}

          <div className="mt-10 pt-6 border-t border-[rgba(211,210,211,0.5)] flex flex-wrap gap-3">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0000ff] text-white text-sm font-medium hover:bg-[#0000cc] transition-colors"
            >
              All news
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#0000ff] text-[#0000ff] text-sm font-medium hover:bg-[#0000ff]/5 transition-colors"
            >
              Visit the Blog
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
