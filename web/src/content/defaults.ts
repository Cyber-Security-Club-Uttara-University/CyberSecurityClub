import resourceCategories from "@/app/resources/data";

type AnyRow = Record<string, string | number | boolean | undefined | Record<string, number>>;

const heroSlides: AnyRow[] = [
  { src: "/images/slideshow/Cybercon24.jpeg", alt: "CyberCon 2024" },
  { src: "/images/slideshow/MIST2025.jpg", alt: "MIST CTF 2025" },
  { src: "/images/slideshow/OWASP.jpeg", alt: "OWASP Workshop" },
  { src: "/images/slideshow/bupctf25.jpg", alt: "BUP CTF 2025" },
  { src: "/images/slideshow/CID24.jpg", alt: "CID 2024" },
];

const homeEvents: AnyRow[] = [
  { name: "Binary CTF 2k25", date: "TBA", location: "Online, Capture the Flag", href: "/events", status: "Upcoming" },
  { name: "CTF Night 0x3", date: "TBA", location: "", href: "/events", status: "Upcoming" },
  { name: "CyberCon25", date: "27 November 2025", location: "MultiPurpose Hall, Uttara University", href: "/cybercon", status: "Previous" },
  { name: "CyberCon CTF", date: "26 November 2025", location: "511,514 | 5th floor | Uttara University", href: "/events", status: "Previous" },
];

const events: AnyRow[] = [
  { alt: "Binary CTF 2k25", src: "" },
  { alt: "CTF Night 0x3", src: "" },
  { alt: "CyberCon25", src: "" },
  { alt: "CyberCon CTF", src: "" },
  { alt: "Binary CTF 2024", src: "" },
  { alt: "Binary CTF 2023", src: "" },
  { alt: "CyberCon23", src: "" },
];

const gallery: AnyRow[] = [
  { src: "/images/Gallery/2025/bupctf25.jpg", alt: "BUP CTF 2025" },
  { src: "/images/Gallery/2025/Cyberseige25.jpeg", alt: "Cyber Siege 2025" },
  { src: "/images/Gallery/2025/diucybercon25.jpg", alt: "DIU CyberCon 2025" },
  { src: "/images/Gallery/2025/hackathon25.jpg", alt: "Hackathon 2025" },
  { src: "/images/Gallery/2025/MIST25.jpg", alt: "MIST 2025" },
  { src: "/images/Gallery/2025/PhoniexSummit25.jpg", alt: "Phoenix Summit 2025" },
  { src: "/images/Gallery/2024/ruetCTF24.jpg", alt: "RUET CTF 2024" },
  { src: "/images/slideshow/Cybercon24.jpeg", alt: "CyberCon 2024" },
  { src: "/images/slideshow/MIST2025.jpg", alt: "MIST 2025" },
  { src: "/images/slideshow/OWASP.jpeg", alt: "OWASP Workshop" },
];

const sponsors: AnyRow[] = [
  { alt: "HackTheBox", description: "Penetration testing labs and CTF platform", src: "" },
  { alt: "TryHackMe", description: "Interactive cybersecurity learning platform", src: "" },
  { alt: "PortSwigger", description: "Web security tools and training", src: "" },
  { alt: "TCM Security", description: "Practical cybersecurity training and certifications", src: "" },
];

const newsPosts: AnyRow[] = [
  { title: "CTF Night 0x2 - Results!", slug: "ctf-night-0x2-results", excerpt: "Congratulations to all participants! Here are the final standings.", body: "Congratulations to all participants! Here are the final standings and highlights from CTF Night 0x2.\n\nThe competition ran through the night with teams racing across web, crypto, forensics and reverse-engineering challenges. A huge thank you to everyone who played, and to the organisers who wrote and tested the tasks.\n\nFull writeups for each challenge will be published shortly. Head over to the CTF portal for the live scoreboard.", date: "1 Nov 2025", author: "CSC Team", category: "CTF Results", image: "/images/CTF/CTF-NIGHT0x2.jpg" },
  { title: "Weekly CTF 0x1 - Results published", slug: "weekly-ctf-0x1-results", excerpt: "Results from the first Weekly CTF are now live.", body: "Results from the first Weekly CTF are now live. Check out the scoreboard and solution writeups.\n\nNineteen teams took part in Weekly CTF 0x1, covering a mixed set of beginner-to-intermediate challenges. Congratulations to taki for taking first place, with S4M and monjur0x0x rounding out the podium.\n\nEvery participant's overall points and streak level are listed on the leaderboard page for the full table.", date: "12 Oct 2025", author: "CSC Team", category: "CTF Results", image: "/images/CTF/Weekly-ctf-0x1.jpg" },
  { title: "New Executive Board 2025-2026", slug: "new-executive-board-2025-2026", excerpt: "Meet the newly elected executive board members.", body: "Meet the newly elected executive board members for the 2025-2026 term of Cyber Security Club.\n\nThe new committee was elected by the general body and will be responsible for organising CTFs, workshops, seminars and community outreach for the coming academic year.\n\nYou can see the full committee, including previous terms, on the About page.", date: "5 Sep 2025", author: "CSC Team", category: "Announcements", image: "/images/News/Exe_25.png" },
  { title: "CSC Store is Opening Soon", slug: "csc-store-opening-soon", excerpt: "The official CSC merchandise store will be launching soon.", body: "Exciting news! The official CSC merchandise store will be launching soon.\n\nExpect sticker packs, CyberCon exclusive T-shirts and more. Members will get early access before the public launch.\n\nKeep an eye on the Store page for updates.", date: "7 Sep 2025", author: "CSC Team", category: "General", image: "/images/News/csc-Store-Open.png" },
  { title: "CTF Night 0x1: Competition Event", slug: "ctf-night-0x1-competition-event", excerpt: "Join us for CTF Night 0x1, our first monthly capture the flag competition.", body: "Join us for CTF Night 0x1, our first monthly capture the flag competition.\n\nCTF Night is our flagship overnight event: a full night of hands-on challenges spanning web exploitation, cryptography, forensics and reverse engineering. Beginners are welcome — mentors will be on hand throughout.\n\nRegistration is open to all Uttara University students. Bring your laptop and your curiosity.", date: "10 Aug 2025", author: "CSC Team", category: "Events", image: "/images/News/CTF_Night0x1.png" },
  { title: "CTF Night 0x1 - Results!", slug: "ctf-night-0x1-results", excerpt: "Results from CTF Night 0x1 are out.", body: "Results from CTF Night 0x1 are out. Congratulations to the top teams!\n\nThank you to everyone who took part in our first CTF Night. The top three teams were awarded prizes at the closing ceremony.\n\nSolutions and writeups will be shared with all participants over the coming week.", date: "12 Aug 2025", author: "CSC Team", category: "CTF Results", image: "/images/CTF/CTF-NIGHT0x1.jpg" },
];

const blogPosts: AnyRow[] = [
  { title: "BUP CTF 2025 Writeup", slug: "bup-ctf-2025-writeup", excerpt: "A detailed writeup covering our experience and solutions at BUP CTF 2025.", body: "A detailed writeup covering our experience and solutions at BUP CTF 2025, including web exploitation, crypto, and forensics challenges.\n\nWe fielded two teams at BUP CTF 2025 and came away with a wealth of new techniques. This post walks through the challenges we solved, the ones that beat us, and what we would do differently next time.", date: "27 Sep 2025", author: "CSC Team", category: "CTF Writeups", readingTime: "12 min read", image: "/images/slideshow/bupctf25.jpg" },
  { title: "DIU CyberCon 25 CTF Writeup", slug: "diu-cybercon-25-ctf-writeup", excerpt: "Breakdown of challenges and solutions from DIU CyberCon 25 CTF.", body: "Breakdown of the challenges and solutions from DIU CyberCon 25 CTF competition held in October 2025.\n\nOur members represented the club at DIU CyberCon, competing against teams from universities across the country. Below is a full breakdown of the tasks we tackled.", date: "28 Oct 2025", author: "Nullsec", category: "CTF Writeups", readingTime: "10 min read", image: "/images/slideshow/bupctf25.jpg" },
  { title: "MIST CTF 2025 Experience", slug: "mist-ctf-2025-experience", excerpt: "Our team's journey and key takeaways from participating in MIST CTF 2025.", body: "Our team's journey and key takeaways from participating in MIST CTF 2025.\n\nMIST CTF is one of the strongest collegiate competitions in the region. Here is how our team prepared, what the environment was like, and the lessons we brought home.", date: "15 Sep 2025", author: "Hackalypse", category: "Events", readingTime: "8 min read", image: "/images/slideshow/MIST2025.jpg" },
  { title: "Introduction to Nmap Scanning", slug: "introduction-to-nmap-scanning", excerpt: "Learn the basics of network scanning with Nmap.", body: "Learn the basics of network scanning with Nmap. From host discovery to service enumeration.\n\nThis tutorial covers installing Nmap, the common scan types, reading NSE scripts, and how to interpret the output without getting overwhelmed.", date: "1 Oct 2025", author: "CSC Admin", category: "Tutorials", readingTime: "15 min read", image: "" },
  { title: "OWASP Top 10 Explained", slug: "owasp-top-10-explained", excerpt: "A comprehensive breakdown of the OWASP Top 10 web application security risks.", body: "A comprehensive breakdown of the OWASP Top 10 web application security risks.\n\nEach risk is explained with a plain-language description, a realistic example, and the mitigations you should reach for first.", date: "20 Sep 2025", author: "CSC Admin", category: "Tutorials", readingTime: "20 min read", image: "" },
  { title: "Linux Commands for Beginners", slug: "linux-commands-for-beginners", excerpt: "Essential Linux commands every cybersecurity enthusiast should know.", body: "Essential Linux commands every cybersecurity enthusiast should know.\n\nFrom navigating the filesystem to handling processes, permissions and networking — the commands you will use every day.", date: "5 Sep 2025", author: "CSC Admin", category: "Tutorials", readingTime: "10 min read", image: "" },
];

const committee: AnyRow[] = [
  { name: "Abu Said", role: "President", year: "2025-2026", yearLabel: "2025", image: "/images/2025eboard/Said.jpeg", linkedin: "https://www.linkedin.com/in/0xsaid/" },
  { name: "Md Ashiqur Rahman", role: "Vice President", year: "2025-2026", yearLabel: "2025", image: "/images/2025eboard/Ashiq.jpeg", linkedin: "https://www.linkedin.com/in/md-ashiqur-rahman-a97638331/" },
  { name: "Eftasib Araf Depro", role: "General Secretary", year: "2025-2026", yearLabel: "2025", image: "/images/2025eboard/depro.png", linkedin: "https://www.linkedin.com/in/depro0x/" },
  { name: "Pranto Kumar Shil (Pritom)", role: "Organizing Secretary", year: "2025-2026", yearLabel: "2025", image: "/images/2025eboard/pran0x.jpg", linkedin: "https://www.linkedin.com/in/pran0x" },
  { name: "Abdullah Bin Shawon", role: "CTF Administrator", year: "2025-2026", yearLabel: "2025", image: "/images/2025eboard/Shawon.jpeg", linkedin: "https://www.linkedin.com/in/abdullah-bin-shawon-2b4068263/" },
  { name: "Maidul islam Fahim", role: "Treasurer", year: "2025-2026", yearLabel: "2025", image: "/images/2025eboard/pran0x.jpg", linkedin: "https://www.linkedin.com/in/pran0x" },
  { name: "Seam Shikder Nahid", role: "Research Secretary", year: "2025-2026", yearLabel: "2025", image: "/images/2025eboard/pran0x.jpg", linkedin: "https://www.linkedin.com/in/pran0x" },
  { name: "Bishal", role: "Media Secretary", year: "2025-2026", yearLabel: "2025", image: "/images/2025eboard/pran0x.jpg", linkedin: "https://www.linkedin.com/in/pran0x" },
  { name: "Syda Tammanna", role: "Media Secretary", year: "2025-2026", yearLabel: "2025", image: "/images/2025eboard/pran0x.jpg", linkedin: "https://www.linkedin.com/in/pran0x" },
  { name: "Anika", role: "Office Secretary", year: "2025-2026", yearLabel: "2025", image: "/images/2025eboard/pran0x.jpg", linkedin: "https://www.linkedin.com/in/pran0x" },
  { name: "Abu Said", role: "President", year: "2024-2025", yearLabel: "2024", image: "/images/2025eboard/Said.jpeg", linkedin: "https://www.linkedin.com/in/0xsaid/" },
  { name: "Md Ashiqur Rahman", role: "Vice President", year: "2024-2025", yearLabel: "2024", image: "/images/2025eboard/Ashiq.jpeg", linkedin: "https://www.linkedin.com/in/md-ashiqur-rahman-a97638331/" },
  { name: "Pranto Kumar Shil (Pritom)", role: "Media Secretary", year: "2024-2025", yearLabel: "2024", image: "/images/2025eboard/pran0x.jpg", linkedin: "https://www.linkedin.com/in/pran0x" },
  { name: "Abdullah Bin Shawon", role: "CTF Administrator", year: "2024-2025", yearLabel: "2024", image: "/images/2025eboard/Shawon.jpeg", linkedin: "https://www.linkedin.com/in/abdullah-bin-shawon-2b4068263/" },
  { name: "Tariqul Islam", role: "President", year: "2023-2024", yearLabel: "2023", image: "/images/Alumni/Tariqul.jpg", linkedin: "" },
  { name: "Md. Bakhtiar Mazrur", role: "Vice President", year: "2023-2024", yearLabel: "2023", image: "/images/not-available.png", linkedin: "" },
  { name: "Rakibul Hasan Mishu", role: "General Secretary", year: "2023-2024", yearLabel: "2023", image: "/images/Alumni/mishu.jpg", linkedin: "" },
  { name: "Jubayer Ahmed Shawon", role: "Organizing Secretary", year: "2023-2024", yearLabel: "2023", image: "/images/not-available.png", linkedin: "" },
  { name: "Md. Yeasin Ahammed", role: "Executive Member", year: "2023-2024", yearLabel: "2023", image: "/images/not-available.png", linkedin: "" },
  { name: "Md. Ashiqur Rahman Bhuiyan", role: "Executive Member", year: "2023-2024", yearLabel: "2023", image: "/images/2025eboard/Ashiq.jpeg", linkedin: "" },
  { name: "Abu Said", role: "Executive Member", year: "2023-2024", yearLabel: "2023", image: "/images/2025eboard/Said.jpeg", linkedin: "" },
  { name: "Mosaddik Asif", role: "Executive Member", year: "2023-2024", yearLabel: "2023", image: "/images/not-available.png", linkedin: "" },
  { name: "Tariqul Islam", role: "President", year: "2022-2023", yearLabel: "2022", image: "/images/Alumni/Tariqul.jpg", linkedin: "" },
  { name: "Alimul Haque", role: "Vice President", year: "2022-2023", yearLabel: "2022", image: "/images/not-available.png", linkedin: "" },
  { name: "Deepro Das", role: "Organizing Secretary", year: "2022-2023", yearLabel: "2022", image: "/images/Alumni/depro.jpg", linkedin: "" },
  { name: "Mohammad Hasem", role: "Event Secretary", year: "2022-2023", yearLabel: "2022", image: "/images/not-available.png", linkedin: "" },
  { name: "Roufin Ahmed", role: "Media Secretary", year: "2022-2023", yearLabel: "2022", image: "/images/not-available.png", linkedin: "" },
  { name: "Md. Bakhtiar Mazrur", role: "Media Secretary", year: "2022-2023", yearLabel: "2022", image: "/images/not-available.png", linkedin: "" },
  { name: "Shah Moazzem", role: "Executive Member", year: "2022-2023", yearLabel: "2022", image: "/images/not-available.png", linkedin: "" },
  { name: "Sadman Sakib", role: "Executive Member", year: "2022-2023", yearLabel: "2022", image: "/images/not-available.png", linkedin: "" },
];

const ADVISOR_YEAR_META: Record<string, { heading: string; description?: string }> = {
  "2025": { heading: "2025-2026" },
  "2024": { heading: "2024-2025" },
  "2023": { heading: "2022-2023", description: "Advisors for the 2022-2023 academic year" },
  "2022": { heading: "2021-2022", description: "Advisors for the 2021-2022 academic year" },
};

const advisors: AnyRow[] = [
  { name: "MD Sadikul Islam Akash", role: "Red Team Researcher", org: "BEETLES CYBER SECURITY", year: "2025", group: "Current Student", image: "/images/Alumni/akash.jpg", linkedin: "https://www.linkedin.com/in/mdsadikulislam/" },
  { name: "Alwoares Naeem", role: "CEO", org: "ZeroRisk Cyber Security", year: "2025", group: "Current Student", image: "/images/Alumni/naeem.jpg", linkedin: "https://www.linkedin.com/in/a1woares/" },
  { name: "Rakibul Islam Mishu", role: "Data Engineer", org: "Prime Bank Securities Ltd", year: "2025", group: "Current Student", image: "/images/Alumni/mishu.jpg", linkedin: "https://www.linkedin.com/in/rakibul-hasan-mishu/" },
  { name: "Md Asif Hossain", role: "Security Researcher", org: "HackerOne|BugCrowd|Yogosha", year: "2025", group: "Alumni", image: "/images/Alumni/asif.jpg", linkedin: "https://www.linkedin.com/in/0x0asif/" },
  { name: "Tariqul Islam", role: "Project Coordinator", org: "TQLSOFT", year: "2025", group: "Alumni", image: "/images/Alumni/Tariqul.jpg", linkedin: "https://www.linkedin.com/in/tariqultais/" },
  { name: "Deepro Das", role: "Technical Officer", org: "Dhaka Mercantile Bank LTD.", year: "2025", group: "Alumni", image: "/images/Alumni/depro.jpg", linkedin: "https://www.linkedin.com/in/deepro-das-a4216929b/" },
  { name: "MD Sadikul Islam Akash", role: "Red Team Researcher", org: "BEETLES CYBER SECURITY", year: "2024", group: "Current Student", image: "/images/Alumni/akash.jpg", linkedin: "https://www.linkedin.com/in/mdsadikulislam/" },
  { name: "Alwoares Naeem", role: "CEO", org: "ZeroRisk Cyber Security", year: "2024", group: "Current Student", image: "/images/Alumni/naeem.jpg", linkedin: "https://www.linkedin.com/in/a1woares/" },
  { name: "Rakibul Islam Mishu", role: "Data Engineer", org: "Prime Bank Securities Ltd", year: "2024", group: "Current Student", image: "/images/Alumni/mishu.jpg", linkedin: "https://www.linkedin.com/in/rakibul-hasan-mishu/" },
  { name: "Md Asif Hossain", role: "Security Researcher", org: "HackerOne|BugCrowd|Yogosha", year: "2024", group: "Alumni", image: "/images/Alumni/asif.jpg", linkedin: "https://www.linkedin.com/in/0x0asif/" },
  { name: "Tariqul Islam", role: "Project Coordinator", org: "TQLSOFT", year: "2024", group: "Alumni", image: "/images/Alumni/Tariqul.jpg", linkedin: "https://www.linkedin.com/in/tariqultais/" },
  { name: "Deepro Das", role: "Technical Officer", org: "Dhaka Mercantile Bank LTD.", year: "2024", group: "Alumni", image: "/images/Alumni/depro.jpg", linkedin: "https://www.linkedin.com/in/deepro-das-a4216929b/" },
  { name: "Advisor Name", role: "Position", org: "Company/Organization", year: "2023", group: "Advisors", image: "/images/Alumni/Tariqul.jpg", linkedin: "https://www.linkedin.com/company/cscuu/?viewAsMember=true" },
  { name: "Advisor Name", role: "Position", org: "Company/Organization", year: "2022", group: "Advisors", image: "/images/Alumni/depro.jpg", linkedin: "https://www.linkedin.com/company/cscuu/?viewAsMember=true" },
].map((r) => ({ ...r, ...ADVISOR_YEAR_META[r.year as string] }));

const teamMembers: AnyRow[] = [
  { team: "Nullsec", name: "Said", avatar: "/images/CTF-Teams/Nullsec/Said.jpeg" },
  { team: "Nullsec", name: "Ashiq", avatar: "/images/CTF-Teams/Nullsec/Ashiq.jpeg" },
  { team: "Nullsec", name: "Depro", avatar: "/images/CTF-Teams/Nullsec/depro.png" },
  { team: "Nullsec", name: "Shawon", avatar: "/images/CTF-Teams/Nullsec/Shawon.jpeg" },
  { team: "Team Hackalypse", name: "Khaled", avatar: "/images/CTF-Teams/Team-Hackaypse/khaled.jpg" },
  { team: "Team Hackalypse", name: "Pran0x", avatar: "/images/CTF-Teams/Team-Hackaypse/pran0x.jpg" },
  { team: "Team Hackalypse", name: "Sani", avatar: "/images/CTF-Teams/Team-Hackaypse/sani.jpg" },
  { team: "Team Hackalypse", name: "Ziku", avatar: "/images/CTF-Teams/Team-Hackaypse/ziku.jpg" },
  { team: "Intra-2", name: "Kanon", avatar: "/images/CTF-Teams/intra-2/kanon.jpg" },
  { team: "Intra-2", name: "Mehedi", avatar: "/images/CTF-Teams/intra-2/mehedi.jpg" },
  { team: "Intra-2", name: "Rana", avatar: "/images/CTF-Teams/intra-2/rana.jpg" },
];

const ctfEvents: AnyRow[] = [
  { tab: "Weekly CTF 0x1", title: "Weekly CTF 0x1", date: "11 October 2025", note: "" },
  { tab: "Monthly CTF Night 0x1", title: "Monthly CTF Night 0x1", date: "10 August 2025", note: "Standings for this event have not been published yet. Rows below are placeholders." },
  { tab: "Overall", title: "Overall Standings", date: "All published events", note: "Every participant's points from all published events, ranked together." },
];

const weeklyStandings: AnyRow[] = [
  { place: 1, team: "taki", score: 4470 },
  { place: 2, team: "S4M", score: 3960 },
  { place: 3, team: "monjur0x0", score: 2090 },
  { place: 4, team: "panda", score: 2090 },
  { place: 5, team: "Mashrif", score: 1940 },
  { place: 6, team: "r4k1br053", score: 1640 },
  { place: 7, team: "Sahbir", score: 1640 },
  { place: 8, team: "XR4G0", score: 1160 },
  { place: 9, team: "Antu", score: 1140 },
  { place: 10, team: "3v1L_k4n09", score: 1110 },
  { place: 11, team: "Sn1per Sh3LL", score: 1010 },
  { place: 12, team: "n0man", score: 910 },
  { place: 13, team: "Arafat Chowdhury", score: 710 },
  { place: 14, team: "P1k4chu", score: 710 },
  { place: 15, team: "jony369", score: 700 },
  { place: 16, team: "PhantomSolver", score: 510 },
  { place: 17, team: "ss", score: 500 },
  { place: 18, team: "MissOxRoot", score: 410 },
  { place: 19, team: "mamun007", score: 400 },
];

const ctfStandings: AnyRow[] = [
  ...weeklyStandings.map((r) => ({ ...r, event: "Weekly CTF 0x1", placeholder: false })),
  { event: "Monthly CTF Night 0x1", place: 1, team: "Placeholder Team 01", score: 3200, placeholder: true },
  { event: "Monthly CTF Night 0x1", place: 2, team: "Placeholder Team 02", score: 2810, placeholder: true },
  { event: "Monthly CTF Night 0x1", place: 3, team: "Placeholder Team 03", score: 2450, placeholder: true },
  { event: "Monthly CTF Night 0x1", place: 4, team: "Placeholder Team 04", score: 1900, placeholder: true },
  { event: "Monthly CTF Night 0x1", place: 5, team: "Placeholder Team 05", score: 1450, placeholder: true },
  { event: "Monthly CTF Night 0x1", place: 6, team: "Placeholder Team 06", score: 900, placeholder: true },
];

/**
 * Leaderboard roster managed from the CTF admin section. Seeded from the
 * published weekly standings so the board is populated on a fresh install;
 * profile pictures and CTFd-synced scores are layered on top from there.
 */
const ctfPlayers: AnyRow[] = weeklyStandings.map((r) => ({
  handle: r.team,
  name: "",
  email: "",
  avatar: "",
  githubUrl: "",
  score: r.score,
  scores: { "Weekly CTF 0x1": Number(r.score) || 0 },
  tag: "",
  event: "Weekly CTF 0x1",
  source: "manual",
  active: true,
}));

const resourceCategoryRows: AnyRow[] = resourceCategories.map((c) => ({
  title: c.title,
  icon: c.icon,
}));

const resourceCardRows: AnyRow[] = resourceCategories.flatMap((c) =>
  c.cards.map((card) => ({ title: card.title, desc: card.desc, category: c.title }))
);

const resourceLinkRows: AnyRow[] = resourceCategories.flatMap((c) =>
  c.cards.flatMap((card) =>
    card.links.map((link) => ({ name: link.name, href: link.href, card: card.title }))
  )
);

export const DEFAULTS: Record<string, AnyRow[]> = {
  "hero-slides": heroSlides,
  "home-events": homeEvents,
  events,
  gallery,
  sponsors,
  "news-posts": newsPosts,
  "blog-posts": blogPosts,
  committee,
  advisors,
  "team-members": teamMembers,
  "ctf-events": ctfEvents,
  "ctf-standings": ctfStandings,
  "ctf-players": ctfPlayers,
  "resource-categories": resourceCategoryRows,
  "resource-cards": resourceCardRows,
  "resource-links": resourceLinkRows,
};

export const SETTINGS_DEFAULTS: Record<string, string> = {
  tagline: "Hunt Together, Defend Together",
  aboutText:
    "Cyber Security Club is a vibrant and dynamic community of students and faculty at Uttara University dedicated to exploring the latest trends and technologies in the field of cybersecurity. Our goal is to promote awareness and education about cybersecurity among our members and the wider community. We organize workshops, seminars, and hands-on training sessions to equip our members with the necessary skills and knowledge to defend against cyber threats. Our club also provides opportunities for networking, collaboration, and professional development.",
  sponsorEmail: "cybersecurity@club.uttara.ac.bd",
  contactEmail: "cybersecurity@club.uttara.ac.bd",
  ctfPortalUrl: "http://ctf-cybersecurity-club-uttara.duckdns.org/scoreboard",
};
