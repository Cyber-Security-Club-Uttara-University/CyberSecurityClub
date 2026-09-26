import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import AnnouncementBanner from "@/components/layout/AnnouncementBanner";
import { getAnnouncements } from "@/lib/content";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Home | Cyber Security Club",
    template: "%s | Cyber Security Club",
  },
  description: "Cyber Security Club, Uttara University | Hunt Together, Defend Together.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cybersecurity.club.uttara.ac.bd",
    siteName: "Cyber Security Club | Uttara University",
    title: "Cyber Security Club Uttara University | Official Website",
    description: "Official website of Cyber Security Club at Uttara University (CSC UU). Learn ethical hacking, digital forensics, cybersecurity awareness.",
    images: [{ url: "https://cybersecurity.club.uttara.ac.bd/images/csc_white.png", width: 1200, height: 630, alt: "Cyber Security Club - Uttara University Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cyber Security Club Uttara University | CSC UU",
    description: "Official website of Cyber Security Club at Uttara University.",
    images: ["https://cybersecurity.club.uttara.ac.bd/images/csc_white.png"],
    site: "@csc_uu",
    creator: "@csc_uu",
  },
  metadataBase: new URL("https://cybersecurity.club.uttara.ac.bd"),
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  icons: { icon: "/images/favicon/favicon.ico", shortcut: "/images/favicon/favicon.ico", apple: "/images/favicon/apple-touch-icon.png" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const announcements = await getAnnouncements();

  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["WebSite", "Organization", "EducationalOrganization"],
          name: "Cyber Security Club Uttara University",
          alternateName: ["CSC UU", "Cyber Security Club UU"],
          url: "https://cybersecurity.club.uttara.ac.bd",
          logo: "https://cybersecurity.club.uttara.ac.bd/images/csc_white.png",
          description: "Official Cyber Security Club at Uttara University offering ethical hacking, digital forensics, cybersecurity training, CTF competitions.",
          foundingDate: "2020",
          address: { "@type": "PostalAddress", streetAddress: "Holding 77, Beribadh Road, Turag", addressLocality: "Uttara", addressRegion: "Dhaka", postalCode: "1230", addressCountry: "BD" },
          geo: { "@type": "GeoCoordinates", latitude: "23.8041", longitude: "90.4152" },
          sameAs: ["https://facebook.com/csc.uu.bd", "https://www.linkedin.com/company/cscuu/?viewAsMember=true", "https://discord.gg/N83SjBHjzG", "https://github.com/Cyber-Security-Club-Uttara-University"],
          contactPoint: { "@type": "ContactPoint", email: "cybersecurity@club.uttara.ac.bd", contactType: "customer service", areaServed: "BD", availableLanguage: ["English", "Bengali"] },
        }) }} />
      </head>
      <body className={`${jetbrainsMono.variable} min-h-screen flex flex-col font-mono antialiased`} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
        <Navbar />
        <AnnouncementBanner items={announcements} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
