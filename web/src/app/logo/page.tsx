import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Logo & Guidelines",
};

type LogoVersion = {
  name: string;
  desc: string;
  src: string;
  width: number;
  height: number;
  dark: boolean;
};

const logoVersions: LogoVersion[] = [
  {
    name: "Blue Logo",
    desc: "Use on White backgrounds for maximum visibility and contrast.",
    src: "/assets/logo/Blue-Cyber Security Logo sticker-whiteBG.png",
    width: 9435,
    height: 5307,
    dark: false,
  },
  {
    name: "White Logo",
    desc: "Primary logo version for dark backgrounds and general use.",
    src: "/assets/logo/White-Cyber Security Logo sticker@3x.png",
    width: 9435,
    height: 5307,
    dark: true,
  },
  {
    name: "Black Logo",
    desc: "Primary logo version for light backgrounds and general use.",
    src: "/assets/logo/Black-Cyber-Security-logo-sticker.png",
    width: 9435,
    height: 5307,
    dark: false,
  },
  {
    name: "Blue-White Logo",
    desc: "Primary logo version for light backgrounds and general use.",
    src: "/assets/logo/Blue-White-Cyber-Security-logo.png",
    width: 1000,
    height: 1000,
    dark: false,
  },
  {
    name: "Blue Logo",
    desc: "Primary logo version for light backgrounds and general use.",
    src: "/assets/logo/Blue-Cyber Security Logo sticker-transparent.png",
    width: 9435,
    height: 5307,
    dark: true,
  },
  {
    name: "White Logo",
    desc: "Primary logo version for light backgrounds and general use.",
    src: "/assets/logo/White-Cyber-Security-logo-sticker.png",
    width: 648,
    height: 630,
    dark: true,
  },
  {
    name: "Black Logo",
    desc: "Primary logo version for light backgrounds and general use.",
    src: "/assets/logo/Black-Cyber-Security-logo-sticker-Transparent.png",
    width: 1000,
    height: 1000,
    dark: false,
  },
];

const brandColors = [
  { name: "Primary Blue", hex: "#233886", rgb: "35, 56, 134" },
  { name: "White", hex: "#ffffff", rgb: "255, 255, 255" },
  { name: "Black", hex: "#000000", rgb: "0, 0, 0" },
];

const dos = [
  "Use official logo files",
  "Maintain aspect ratio",
  "Use on contrasting backgrounds",
  "Keep adequate clear space",
  "Use approved colors",
];

const donts = [
  "Stretch or distort the logo",
  "Change logo colors",
  "Add effects or shadows",
  "Rotate the logo",
  "Place on busy backgrounds",
];

const detailedGuidelines = [
  {
    title: "Color Usage",
    body: "Use the white logo on dark backgrounds and the blue logo on light backgrounds. Ensure sufficient contrast for readability.",
  },
  {
    title: "File Formats",
    body: "Use PNG for digital applications with transparency. For print, request vector files (SVG/EPS) for best quality.",
  },
  {
    title: "Print Quality",
    body: "Ensure logo is at least 300 DPI for print materials. Never upscale low-resolution versions.",
  },
  {
    title: "Digital Usage",
    body: "For web and mobile, use PNG format. Ensure logo is clearly visible at all screen sizes.",
  },
  {
    title: "Prohibited Uses",
    body: "Do not use for commercial purposes without permission. Do not modify or alter the logo. Do not use as part of another logo.",
  },
  {
    title: "Brand Protection",
    body: "The CSC logo is a registered trademark. Use only with proper authorization and in accordance with these guidelines.",
  },
];

const quickReference = [
  {
    title: "Download Assets",
    body: "All logo files are available for download above. For vector formats (SVG, EPS, AI), please contact us.",
  },
  {
    title: "Have Questions?",
    body: "Not sure which version to use? Contact our team for guidance and support.",
  },
  {
    title: "Commercial Use",
    body: "Commercial use requires explicit permission. Please submit a request for approval.",
  },
];

const cardSurface =
  "bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] rounded-2xl shadow-[0px_4px_16px_rgba(0,0,0,0.2)]";

export default function LogoPage() {
  return (
    <div className="min-h-screen">
      {/* Title */}
      <section className="section-animated w-full flex flex-col items-center relative px-8 sm:px-16">
        <div className="heading-title heading-animated font-extrabold text-center text-black mt-[60px] text-[5rem] leading-[5rem] max-md:text-[3rem] max-md:leading-[3rem] max-sm:text-[2.5rem] max-sm:leading-[2.5rem]">
          Logo Usage Guidelines
        </div>
        <div className="heading-subtitle heading-animated font-semibold text-center text-[#525252] mt-4 mb-2 text-[1.25rem] leading-8 max-w-[75%] max-md:max-w-[90%] max-sm:text-[1.05rem]">
          Learn how to properly use the Cyber Security Club brand assets. Follow these guidelines to maintain brand
          consistency and integrity across all platforms and materials.
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[90rem] mx-auto flex flex-col gap-16">
        {/* Logo Versions */}
        <div className="section-animated">
          <h2 className="section-title text-2xl font-bold mb-3 text-[#0000ff]">Logo Versions</h2>
          <p className="text-[#525252] mb-8 max-w-3xl">
            We provide three primary logo versions optimized for different backgrounds. Always use the appropriate
            version to ensure maximum visibility and brand recognition.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {logoVersions.map((logo, i) => (
              <div
                key={`${logo.name}-${i}`}
                className={`${cardSurface} overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_8px_24px_rgba(0,0,255,0.3)]`}
                style={{ animation: `fadeInUp 0.6s ease-out ${Math.min(i * 0.07, 0.5)}s both` }}
              >
                <div
                  className={`logo-preview h-44 flex items-center justify-center p-6 ${
                    logo.dark ? "bg-[#0a0a0a]" : "bg-white"
                  }`}
                >
                  <Image
                    src={logo.src}
                    alt={`CSC ${logo.name}`}
                    width={logo.width}
                    height={logo.height}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="h-auto w-full max-h-32 object-contain"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-1 text-black">{logo.name}</h3>
                  <p className="text-[#525252] text-sm mb-4">{logo.desc}</p>
                  <a
                    href={logo.src}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-[#0000ff] text-white rounded-lg text-sm font-medium hover:bg-[#0000cc] transition-colors"
                  >
                    Download PNG
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clear Space & Minimum Size */}
        <div className="section-animated">
          <h2 className="section-title text-2xl font-bold mb-3 text-[#0000ff]">Clear Space &amp; Minimum Size</h2>
          <p className="text-[#525252] mb-6 max-w-3xl">
            Proper spacing ensures the logo remains clear and impactful. Never compromise on these minimum
            requirements.
          </p>
          <div className={`${cardSurface} p-6 mb-6 border-l-4 border-[#0000ff]`}>
            <h3 className="font-semibold text-black mb-1">Important Spacing Rule</h3>
            <p className="text-[#525252] text-sm">
              Always maintain adequate clear space around the logo. The minimum clear space should be equal to the
              height of the &quot;C&quot; in CSC.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className={`${cardSurface} p-6`}>
              <h3 className="font-semibold text-black mb-2">Minimum Width</h3>
              <ul className="text-[#525252] text-sm space-y-1">
                <li>Print: 25mm / 1 inch</li>
                <li>Digital: 150px</li>
              </ul>
            </div>
            <div className={`${cardSurface} p-6`}>
              <h3 className="font-semibold text-black mb-2">Clear Space</h3>
              <p className="text-[#525252] text-sm">
                Maintain clear space equal to the height of &quot;C&quot; on all sides.
              </p>
            </div>
          </div>
        </div>

        {/* Brand Colors */}
        <div className="section-animated">
          <h2 className="section-title text-2xl font-bold mb-3 text-[#0000ff]">Brand Colors</h2>
          <p className="text-[#525252] mb-8 max-w-3xl">
            Our brand colors represent innovation, trust, and security. Use these exact color values for all brand
            materials.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {brandColors.map((color) => (
              <div key={color.name} className={`${cardSurface} overflow-hidden`}>
                <div
                  className="h-28 border-b border-black/10"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="p-5">
                  <p className="font-semibold text-black mb-1">{color.name}</p>
                  <p className="text-[#525252] text-sm font-mono">HEX: {color.hex}</p>
                  <p className="text-[#525252] text-sm font-mono">RGB: {color.rgb}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Do's and Don'ts */}
        <div className="section-animated">
          <h2 className="section-title text-2xl font-bold mb-3 text-[#0000ff]">Do&apos;s and Don&apos;ts</h2>
          <p className="text-[#525252] mb-8 max-w-3xl">
            Follow these essential rules to maintain logo integrity and brand consistency across all applications.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${cardSurface} p-6`}>
              <h3 className="text-lg font-bold text-[#00aa44] mb-4">Do&apos;s</h3>
              <ul className="space-y-3">
                {dos.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[#525252]">
                    <span className="mt-1 w-2 h-2 rounded-full bg-[#00aa44] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`${cardSurface} p-6`}>
              <h3 className="text-lg font-bold text-[#dd0000] mb-4">Don&apos;ts</h3>
              <ul className="space-y-3">
                {donts.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[#525252]">
                    <span className="mt-1 w-2 h-2 rounded-full bg-[#dd0000] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Detailed Usage Guidelines */}
        <div className="section-animated">
          <h2 className="section-title text-2xl font-bold mb-3 text-[#0000ff]">Detailed Usage Guidelines</h2>
          <p className="text-[#525252] mb-8 max-w-3xl">
            Comprehensive guidelines for using our logo across different mediums and platforms.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {detailedGuidelines.map((item) => (
              <div key={item.title} className={`${cardSurface} p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_8px_24px_rgba(0,0,255,0.3)]`}>
                <h3 className="font-semibold text-black mb-2">{item.title}</h3>
                <p className="text-[#525252] text-sm leading-6">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Reference */}
        <div className="section-animated">
          <h2 className="section-title text-2xl font-bold mb-8 text-[#0000ff]">Quick Reference</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickReference.map((item) => (
              <div key={item.title} className={`${cardSurface} p-6`}>
                <h3 className="font-semibold text-black mb-2">{item.title}</h3>
                <p className="text-[#525252] text-sm leading-6">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className={`${cardSurface} section-animated p-8 text-center`}>
          <h2 className="text-2xl font-bold mb-3 text-black">Need Help or Special Permissions?</h2>
          <p className="text-[#525252] mb-4 max-w-2xl mx-auto">
            For additional logo formats, custom applications, or permission requests, please contact us:
          </p>
          <a
            href="mailto:cybersecurity@club.uttara.ac.bd"
            className="inline-block px-6 py-3 bg-[#0000ff] text-white rounded-lg font-medium hover:bg-[#0000cc] transition-colors"
          >
            cybersecurity@club.uttara.ac.bd
          </a>
          <p className="text-[#525252] text-sm mt-4">We typically respond within 2-3 business days.</p>
        </div>
      </section>
    </div>
  );
}
