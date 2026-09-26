import type { Field } from "./sections";

export type RecordConfig = {
  table: string;
  label: string;
  description: string;
  fields: Field[];
  columns: string[];
  readOnly?: boolean;
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
    description: "CyberCon event registrations. Read-only.",
    readOnly: true,
    fields: [
      { key: "fullName", label: "Full name", kind: "text" },
      { key: "email", label: "Email", kind: "text" },
      { key: "studentId", label: "Student ID", kind: "text" },
      { key: "ticketId", label: "Ticket ID", kind: "text" },
    ],
    columns: ["fullName", "email", "studentId", "ticketId", "createdAt"],
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
