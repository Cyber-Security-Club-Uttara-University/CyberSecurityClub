import type { Metadata } from "next";
import { getSectionData } from "@/lib/content";

export const metadata: Metadata = {
  title: "Resources",
  description: "Comprehensive collection of free tools, courses, and learning materials",
};

type Link = { name: string; href: string };
type Card = { title: string; desc: string; links: Link[] };
type Category = { title: string; icon: string; cards: Card[] };

type CatRow = { title?: string; icon?: string };
type CardRow = { title?: string; desc?: string; category?: string };
type LinkRow = { name?: string; href?: string; card?: string };

const iconPaths: Record<string, string> = {
  "fas fa-laptop-code":
    "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5",
  "fas fa-flag":
    "M3 3v18h18V3M7.5 3v11.25a3.75 3.75 0 007.5 0V3M7.5 3h9",
  "fas fa-hammer":
    "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877m-5.108.233c-.55.164-1.163.188-1.743.14a4.5 4.5 0 00-4.486 6.444l5.4-5.4m5.937 4.616l-5.4-5.4M9.75 4.5L4.5 9.75",
  "fas fa-tools":
    "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63M6 18l.75-.75",
  "fas fa-book":
    "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
  "fab fa-youtube":
    "M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z",
};

function CategoryIcon({ name }: { name: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      aria-hidden="true"
      className="h-6 w-6 shrink-0"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={iconPaths[name] ?? iconPaths["fas fa-book"]} />
    </svg>
  );
}

export default async function ResourcesPage() {
  const [catRows, cardRows, linkRows] = await Promise.all([
    getSectionData("resource-categories"),
    getSectionData("resource-cards"),
    getSectionData("resource-links"),
  ]);

  const cats = catRows as unknown as CatRow[];
  const cards = cardRows as unknown as CardRow[];
  const links = linkRows as unknown as LinkRow[];

  const categories: Category[] = cats.map((c) => ({
    title: String(c.title ?? ""),
    icon: String(c.icon ?? ""),
    cards: cards
      .filter((k) => k.category === c.title)
      .map((k) => ({
        title: String(k.title ?? ""),
        desc: String(k.desc ?? ""),
        links: links
          .filter((l) => l.card === k.title)
          .map((l) => ({ name: String(l.name ?? ""), href: String(l.href ?? "") })),
      })),
  }));

  return (
    <div className="min-h-screen">
      {/* Title */}
      <section className="section-animated w-full flex flex-col items-center relative px-8 sm:px-16">
        <div className="heading-title heading-animated font-extrabold text-center text-black mt-[60px] text-[5rem] leading-[5rem] max-md:text-[3rem] max-md:leading-[3rem] max-sm:text-[2.5rem] max-sm:leading-[2.5rem]">
          Free Resources
        </div>
        <div className="heading-subtitle heading-animated font-semibold text-center text-[#525252] mt-3 mb-2 text-[1.3rem] leading-8 max-w-[90%] max-sm:text-[1.05rem]">
          Comprehensive collection of free tools, courses, and learning materials
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[90rem] mx-auto flex flex-col gap-16">
        {categories.map((category) => (
          <div key={category.title} className="section-animated">
            <h2 className="category-title flex items-center gap-3 text-[#0000ff] font-extrabold text-[2rem] leading-[2.5rem] mb-8 max-sm:text-[1.5rem]">
              <CategoryIcon name={category.icon} />
              <span>{category.title}</span>
            </h2>

            <div className="resource-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {category.cards.map((card, i) => (
                <div
                  key={`${category.title}-${card.title}`}
                  className="resource-card bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] rounded-2xl p-6 shadow-[0px_4px_16px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_8px_24px_rgba(0,0,255,0.3)] flex flex-col"
                  style={{ animation: `fadeInUp 0.6s ease-out ${Math.min(i * 0.06, 0.4)}s both` }}
                >
                  <h3 className="font-bold text-black text-[1.15rem] leading-6 mb-2">{card.title}</h3>
                  <p className="text-[#525252] text-sm leading-6 mb-4">{card.desc}</p>

                  <div className="multi-links flex flex-wrap gap-2 mt-auto">
                    {card.links.map((link) => (
                      <a
                        key={`${card.title}-${link.name}`}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="resource-link-mini inline-block px-3 py-1.5 rounded-full text-xs font-semibold text-[#0000ff] bg-[rgba(255,255,255,0.65)] border border-[rgba(0,0,255,0.25)] hover:bg-[#0000ff] hover:text-white hover:border-[#0000ff] transition-colors duration-200"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
