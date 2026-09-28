import type { Metadata } from "next";
import Image from "next/image";
import { getSectionData } from "@/lib/content";

export const metadata: Metadata = {
  title: "Gallery",
};

type Photo = { src: string; alt: string };

export default async function GalleryPage() {
  const photos = (await getSectionData("gallery")) as Photo[];
  return (
    <div className="min-h-screen">
      {/* Title */}
      <section className="section-animated w-full flex flex-col items-center relative px-8 sm:px-16">
        <div className="heading-title heading-animated font-extrabold text-center text-black mt-[60px] text-[5rem] leading-[5rem] max-md:text-[3rem] max-md:leading-[3rem] max-sm:text-[2.5rem] max-sm:leading-[2.5rem]">
          Gallery
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, i) => (
            <div key={i}
              className="group relative overflow-hidden rounded-2xl bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] shadow-[0px_4px_16px_rgba(0,0,0,0.2)] aspect-[4/3] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_8px_24px_rgba(0,0,255,0.3)]">
              <Image src={photo.src} alt={photo.alt} fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <p className="absolute bottom-4 left-4 right-4 text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">{photo.alt}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
