export type FieldKind =
  | "text"
  | "textarea"
  | "image"
  | "url"
  | "number"
  | "boolean"
  | "date"
  | "select"
  | "file";

export type Field = {
  key: string;
  label: string;
  kind: FieldKind;
  options?: string[];
  placeholder?: string;
  required?: boolean;
};

export type Section = {
  id: string;
  label: string;
  description: string;
  group: "Content" | "People" | "Resources" | "CTF";
  itemLabel: string;
  fields: Field[];
  columns: string[];
  /** When true, newly added rows are inserted at the top instead of the bottom. */
  prependNew?: boolean;
};

export const SECTIONS: Section[] = [
  {
    id: "hero-slides",
    label: "Hero Slideshow",
    description: "Background images rotating on the homepage hero.",
    group: "Content",
    itemLabel: "Slide",
    fields: [
      { key: "src", label: "Image path", kind: "image", required: true, placeholder: "/images/slideshow/Cybercon24.jpeg" },
      { key: "alt", label: "Alt text", kind: "text", required: true },
    ],
    columns: ["src", "alt"],
  },
  {
    id: "home-events",
    label: "Home Event Cards",
    description: "Upcoming / Previous event cards on the homepage.",
    group: "Content",
    itemLabel: "Event",
    fields: [
      { key: "name", label: "Event name", kind: "text", required: true },
      { key: "date", label: "Date or status", kind: "text", required: true, placeholder: "TBA" },
      { key: "location", label: "Location / note", kind: "text", placeholder: "Online, Capture the Flag" },
      { key: "href", label: "Link", kind: "text", required: true, placeholder: "/events" },
      { key: "status", label: "Status", kind: "select", required: true, options: ["Upcoming", "Previous"] },
    ],
    columns: ["name", "date", "status"],
  },
  {
    id: "events",
    label: "Events Gallery",
    description: "Tiles shown on the Events page.",
    group: "Content",
    itemLabel: "Event",
    fields: [
      { key: "alt", label: "Event name", kind: "text", required: true },
      { key: "src", label: "Image path (optional)", kind: "image", placeholder: "/images/Previous Event/Cybercon24.png" },
    ],
    columns: ["alt", "src"],
  },
  {
    id: "gallery",
    label: "Gallery Photos",
    description: "Photos shown on the Gallery page.",
    group: "Content",
    itemLabel: "Photo",
    fields: [
      { key: "alt", label: "Caption", kind: "text", required: true },
      { key: "src", label: "Image path", kind: "image", required: true },
    ],
    columns: ["alt", "src"],
  },
  {
    id: "sponsors",
    label: "Sponsors",
    description: "Sponsor cards on the Sponsors page.",
    group: "Content",
    itemLabel: "Sponsor",
    fields: [
      { key: "alt", label: "Sponsor name", kind: "text", required: true },
      { key: "description", label: "Description", kind: "text" },
      { key: "src", label: "Logo path (optional)", kind: "image" },
    ],
    columns: ["alt", "description"],
  },
  {
    id: "news-posts",
    label: "News Posts",
    description: "Entries on the News page and the homepage Latest News section (top of list = first shown).",
    group: "Content",
    itemLabel: "Post",
    prependNew: true,
    fields: [
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "slug", label: "Slug", kind: "text", required: true, placeholder: "ctf-night-0x1-results" },
      { key: "excerpt", label: "Excerpt", kind: "textarea" },
      { key: "body", label: "Article body", kind: "textarea" },
      { key: "date", label: "Date", kind: "date", placeholder: "1 Nov 2025" },
      { key: "author", label: "Author", kind: "text", placeholder: "CSC Team" },
      { key: "category", label: "Category", kind: "select", options: ["CTF Results", "Announcements", "Events", "General"] },
      { key: "image", label: "Image path", kind: "image" },
    ],
    columns: ["title", "date", "category"],
  },
  {
    id: "blog-posts",
    label: "Blog Posts",
    description: "Entries on the Blog page (top of list = first shown).",
    group: "Content",
    itemLabel: "Post",
    prependNew: true,
    fields: [
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "slug", label: "Slug", kind: "text", required: true, placeholder: "owasp-top-10-explained" },
      { key: "excerpt", label: "Excerpt", kind: "textarea" },
      { key: "body", label: "Article body", kind: "textarea" },
      { key: "date", label: "Date", kind: "date", placeholder: "20 Sep 2025" },
      { key: "author", label: "Author", kind: "text", required: true, placeholder: "CSC Admin" },
      { key: "category", label: "Category", kind: "select", required: true, options: ["CTF Writeups", "Events", "Tutorials", "Tools"] },
      { key: "readingTime", label: "Reading time", kind: "text", placeholder: "10 min read" },
      { key: "image", label: "Image path", kind: "image" },
    ],
    columns: ["title", "date", "category", "author"],
  },
  {
    id: "committee",
    label: "Executive Committee",
    description: "Members grouped by term year on the About page.",
    group: "People",
    itemLabel: "Member",
    fields: [
      { key: "name", label: "Name", kind: "text", required: true },
      { key: "role", label: "Role", kind: "text", required: true },
      { key: "year", label: "Term", kind: "text", required: true, placeholder: "2025-2026" },
      { key: "yearLabel", label: "Tab label", kind: "text", placeholder: "2025" },
      { key: "image", label: "Photo path", kind: "image" },
      { key: "linkedin", label: "LinkedIn", kind: "url" },
    ],
    columns: ["name", "role", "year"],
  },
  {
    id: "advisors",
    label: "Advisors",
    description: "Faculty advisors shown on the Advisor page.",
    group: "People",
    itemLabel: "Advisor",
    fields: [
      { key: "name", label: "Name", kind: "text", required: true },
      { key: "role", label: "Role", kind: "text", required: true },
      { key: "org", label: "Organization", kind: "text" },
      { key: "year", label: "Term", kind: "text", required: true, placeholder: "2025" },
      { key: "heading", label: "Year heading", kind: "text", placeholder: "2025-2026" },
      { key: "description", label: "Year description", kind: "text" },
      { key: "group", label: "Group", kind: "select", options: ["Current Student", "Alumni", "Advisors"] },
      { key: "image", label: "Photo path", kind: "image" },
      { key: "linkedin", label: "LinkedIn", kind: "url" },
    ],
    columns: ["name", "role", "year", "group"],
  },
  {
    id: "team-members",
    label: "Teams",
    description: "CTF team members on the Teams page. Rows sharing a team name form one team.",
    group: "People",
    itemLabel: "Team member",
    fields: [
      { key: "team", label: "Team name", kind: "text", required: true, placeholder: "Nullsec" },
      { key: "name", label: "Member name", kind: "text", required: true },
      { key: "avatar", label: "Avatar path", kind: "image" },
    ],
    columns: ["team", "name", "avatar"],
  },
  {
    id: "ctf-events",
    label: "CTF Events",
    description: "Events shown in the CTF leaderboard selector.",
    group: "CTF",
    itemLabel: "Event",
    fields: [
      { key: "tab", label: "Tab label", kind: "text", required: true, placeholder: "Weekly CTF 0x1" },
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "date", label: "Date", kind: "text" },
      { key: "note", label: "Note", kind: "textarea" },
    ],
    columns: ["tab", "title", "date"],
  },
  {
    id: "ctf-standings",
    label: "CTF Standings",
    description: "Per-event standings rows. `event` must match a CTF Event tab.",
    group: "CTF",
    itemLabel: "Standing",
    fields: [
      { key: "event", label: "Event tab", kind: "text", required: true, placeholder: "Weekly CTF 0x1" },
      { key: "place", label: "Place", kind: "number", required: true },
      { key: "team", label: "Team / User", kind: "text", required: true },
      { key: "score", label: "Score", kind: "number", required: true },
      { key: "placeholder", label: "Placeholder row", kind: "boolean" },
    ],
    columns: ["event", "place", "team", "score"],
  },
  {
    id: "resource-categories",
    label: "Resource Categories",
    description: "Top level grouping on the Resources page.",
    group: "Resources",
    itemLabel: "Category",
    fields: [
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "icon", label: "Icon (lucide name)", kind: "text", required: true, placeholder: "BookOpen" },
    ],
    columns: ["title", "icon"],
  },
  {
    id: "resource-cards",
    label: "Resource Cards",
    description: "Cards inside each category. `category` must match a Resource Category title.",
    group: "Resources",
    itemLabel: "Card",
    fields: [
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "desc", label: "Description", kind: "textarea" },
      { key: "category", label: "Category", kind: "text", required: true },
    ],
    columns: ["title", "category", "desc"],
  },
  {
    id: "resource-links",
    label: "Resource Links",
    description: "Individual links. `card` must match a Resource Card title.",
    group: "Resources",
    itemLabel: "Link",
    fields: [
      { key: "name", label: "Name", kind: "text", required: true },
      { key: "href", label: "URL", kind: "url", required: true },
      { key: "card", label: "Card", kind: "text", required: true },
    ],
    columns: ["name", "href", "card"],
  },
];

export const SECTION_GROUPS = ["Content", "People", "Resources", "CTF"] as const;

export function getSection(id: string): Section | undefined {
  return SECTIONS.find((s) => s.id === id);
}
