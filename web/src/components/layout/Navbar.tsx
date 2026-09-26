"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavChild = { href: string; label: string; external?: boolean };
type NavLink = {
  href?: string;
  label: string;
  children?: NavChild[];
};

const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/advisor", label: "Advisor" },
  {
    href: "/ctf",
    label: "CTF",
    children: [
      { href: "/ctf", label: "Leaderboard" },
      { href: "http://ctf-cybersecurity-club-uttara.duckdns.org/scoreboard", label: "Live Scoreboard", external: true },
    ],
  },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/teams", label: "Teams" },
  { href: "/resources", label: "Resources" },
  { href: "/sponsors", label: "Sponsors" },
  {
    label: "Article",
    children: [
      { href: "/news", label: "News" },
      { href: "/news#highlights", label: "Highlights" },
      { href: "/blog", label: "Blog" },
    ],
  },
  { href: "/certificate", label: "Certificate" },
  {
    href: "/membership",
    label: "Membership",
    children: [
      { href: "/membership", label: "Membership Process" },
      { href: "/recruitment", label: "Join Us" },
    ],
  },
  {
    label: "More",
    children: [
      { href: "/store", label: "Store" },
      { href: "/logo", label: "CSC - Logo & Guidelines" },
    ],
  },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY >= 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const isActive = (href?: string) => href && pathname === href;

  return (
    <nav
      className={cn(
        "header sticky top-0 w-full min-h-[100px] z-50 flex items-center",
        "bg-[linear-gradient(135deg,#1a1a2e_0%,#16213e_50%,#0f3460_100%)]",
        "backdrop-blur-[16px] border-b border-transparent transition-all duration-150"
      )}
    >
      <div className="header-wrapper flex flex-1 justify-between items-center max-w-[90rem] mx-auto px-5">
        {/* Logo */}
        <div className="header-image-container w-auto flex-shrink-0 z-[105]">
          <Link href="/" className="flex items-center h-full" title="Cyber Security Club Homepage">
            <div className="h-[100px] w-[200px] bg-contain bg-no-repeat bg-center"
              style={{ backgroundImage: "url(/images/csc_white.png)" }} />
          </Link>
        </div>

        {/* Desktop Nav */}
        <ul className={cn(
          "navbar-links hidden lg:flex justify-center items-start gap-[2px] flex-1 z-20 ml-[60px] mr-5"
        )}>
          {navLinks.map((link) =>
            link.children ? (
              <li
                key={link.label}
                className="relative list-none"
                onMouseEnter={() => setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 px-2 py-2 text-[0.95rem] font-semibold rounded-md transition-all duration-150 hover:opacity-100 hover:-translate-y-px text-white opacity-70 hover:text-white">
                  <span className="navbar-slash text-white">|</span>
                  {link.label}
                  <svg className="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeDropdown === link.label && (
                  <div className="dropdown-content absolute top-full left-0 mt-1 w-56 bg-[linear-gradient(135deg,#1a1a2e_0%,#16213e_50%,#0f3460_100%)] backdrop-blur-[16px] rounded-xl shadow-lg border border-white/10 py-2 z-50">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        target={child.external ? "_blank" : undefined}
                        rel={child.external ? "noopener noreferrer" : undefined}
                        className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ) : link.href ? (
              <li key={link.href} className="list-none">
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center px-2 py-2 text-[0.95rem] font-semibold rounded-md transition-all duration-150",
                    isActive(link.href)
                      ? "text-white opacity-100"
                      : "text-white opacity-70 hover:opacity-100 hover:text-white hover:-translate-y-px"
                  )}
                >
                  <span className="navbar-slash text-white">|</span>
                  {link.label}
                </Link>
              </li>
            ) : null
          )}
        </ul>

        {/* Burger */}
        <div className="navbar-controls flex items-center gap-4 flex-shrink-0 lg:hidden">
          <div
            className="navbar-burger cursor-pointer z-20"
            onClick={() => {
              setMobileOpen(!mobileOpen);
              setIsOpen(!isOpen);
            }}
          >
            <div className={cn("w-[25px] h-[2px] bg-white opacity-70 my-[5px] transition-all duration-300", isOpen && "rotate-[-45deg] translate-x-[-5px] translate-y-[5px]")} />
            <div className={cn("w-[25px] h-[2px] bg-white opacity-70 my-[5px] transition-all duration-300", isOpen && "opacity-0")} />
            <div className={cn("w-[25px] h-[2px] bg-white opacity-70 my-[5px] transition-all duration-300", isOpen && "rotate-[45deg] translate-x-[-5px] translate-y-[-5px]")} />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "navbar-links lg:hidden absolute top-0 right-0 h-screen bg-[linear-gradient(135deg,#1a1a2e_0%,#16213e_50%,#0f3460_100%)] backdrop-blur-[16px] border-l border-white/10 flex flex-col gap-5 pt-[100px] z-[15] transition-transform duration-500 ease-in-out w-full max-w-[320px] min-w-[280px]",
        mobileOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {navLinks.map((link, i) => (
          <div
            key={link.label}
            className={cn(
              "px-5 opacity-0",
              mobileOpen && "opacity-100"
            )}
            style={{ animation: mobileOpen ? `navbar-link-fade 0.5s ease forwards ${0.2 + i * 0.05}s` : "none" }}
          >
            {link.children ? (
              <>
                <button
                  onClick={() => setActiveDropdown(activeDropdown === link.label ? null : link.label)}
                  className="flex items-center justify-between w-full py-2 text-sm font-semibold text-white/70 hover:text-white border-b border-white/10"
                >
                  {link.label}
                  <svg className={cn("w-4 h-4 transition-transform", activeDropdown === link.label && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeDropdown === link.label && (
                  <div className="pl-4 pb-2">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        target={child.external ? "_blank" : undefined}
                        className="block py-2 text-sm text-white/50 hover:text-white transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : link.href ? (
              <Link
                href={link.href}
                className={cn(
                  "block py-2 text-sm font-semibold border-b border-white/10",
                  isActive(link.href) ? "text-white" : "text-white/70 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </nav>
  );
}
