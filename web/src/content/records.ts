import type { Field } from "./sections";

export type RecordConfig = {
  table: string;
  label: string;
  description: string;
  fields: Field[];
  columns: string[];
  readOnly?: boolean;
  /** Adds a "View" action that opens the full record (incl. attached files). */
  viewable?: boolean;
};

export const RECORDS: RecordConfig[] = [
  {
    table: "announcements",
    label: "Announcements",
    description: "Site-wide announcements shown to visitors.",
    fields: [
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "content", label: "Content", kind: "textarea", required: true },
      { key: "image", label: "Image path", kind: "image" },
      { key: "link", label: "Link", kind: "url" },
      { key: "published", label: "Published", kind: "boolean" },
    ],
    columns: ["title", "link", "published", "createdAt"],
  },
  {
    table: "contacts",
    label: "Contact Inbox",
    description: "Messages submitted through the contact form. Read-only.",
    readOnly: true,
    fields: [
      { key: "name", label: "Name", kind: "text" },
      { key: "email", label: "Email", kind: "text" },
      { key: "subject", label: "Subject", kind: "text" },
      { key: "message", label: "Message", kind: "textarea" },
    ],
    columns: ["name", "email", "subject", "read", "createdAt"],
  },
  {
    table: "registrations",
    label: "Registrations",
    description: "Join Us applications submitted through the recruitment form. Read-only.",
    readOnly: true,
    viewable: true,
    fields: [
      { key: "fullName", label: "Full name (as per ID card)", kind: "text" },
      { key: "email", label: "Student email", kind: "text" },
      { key: "phone", label: "Phone", kind: "text" },
      { key: "studentId", label: "Student ID", kind: "text" },
      { key: "university", label: "University", kind: "text" },
      { key: "department", label: "Department", kind: "text" },
      { key: "batch", label: "Batch", kind: "text" },
      { key: "section", label: "Section", kind: "text" },
      { key: "preferredRole", label: "Preferred role", kind: "text" },
      { key: "facebook", label: "Facebook", kind: "url" },
      { key: "linkedin", label: "LinkedIn", kind: "url" },
      { key: "github", label: "GitHub", kind: "url" },
      { key: "queries", label: "Questions or comments", kind: "textarea" },
      { key: "resume", label: "Resume (PDF)", kind: "file" },
      { key: "ticketId", label: "Application ID", kind: "text" },
    ],
    columns: ["fullName", "email", "studentId", "department", "batch", "preferredRole", "resume", "createdAt"],
  },
  {
    table: "products",
    label: "Store Products",
    description: "Items sold in the club store.",
    fields: [
      { key: "name", label: "Name", kind: "text", required: true },
      { key: "description", label: "Description", kind: "textarea", required: true },
      { key: "price", label: "Price (BDT)", kind: "number", required: true },
      {
        key: "category",
        label: "Category",
        kind: "select",
        options: ["Stickers", "Merchandise"],
        required: true,
      },
      { key: "imageUrl", label: "Image path", kind: "image" },
      { key: "inStock", label: "In stock", kind: "boolean" },
      { key: "featured", label: "Featured", kind: "boolean" },
    ],
    columns: ["name", "price", "category", "inStock", "featured"],
  },
];

export function getRecordConfig(table: string) {
  return RECORDS.find((r) => r.table === table);
}
