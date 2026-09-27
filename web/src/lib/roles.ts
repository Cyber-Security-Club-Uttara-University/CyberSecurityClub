import { SECTIONS } from "@/content/sections";

export const ROLES = [
  "President",
  "Vice President",
  "General Secretary",
  "Organizing Secretary",
  "Office Secretary",
] as const;

export type Role = (typeof ROLES)[number];

/** Roles that may add, edit and remove accounts (President = main admin). */
export const USER_MANAGEMENT_ROLES: Role[] = ["President"];
/** Roles that may read the audit log. */
export const LOG_ROLES: Role[] = ["President", "Vice President", "General Secretary"];
/** Roles that may change site settings. */
export const SETTINGS_ROLES: Role[] = ["President", "Vice President", "General Secretary"];
/** Roles that may manage the CTF arena (players, scores, CTFd API). */
export const CTF_ROLES: Role[] = [
  "President",
  "Vice President",
  "General Secretary",
  "Organizing Secretary",
];

/** Sections the Office Secretary may edit. */
const OFFICE_SECRETARY_SECTIONS = ["news-posts", "blog-posts"];
/** Groups the Organizing Secretary may edit. */
const ORGANIZING_SECRETARY_GROUPS = ["Content", "People", "CTF"];

export function normalizeRole(value: unknown): Role {
  const v = String(value ?? "").trim();
  return (ROLES as readonly string[]).includes(v) ? (v as Role) : "Office Secretary";
}

export function isPresident(role: Role) {
  return role === "President";
}

export function canManageUsers(role: Role) {
  return USER_MANAGEMENT_ROLES.includes(role);
}

export function canViewLogs(role: Role) {
  return LOG_ROLES.includes(role);
}

export function canEditSettings(role: Role) {
  return SETTINGS_ROLES.includes(role);
}

/** CTF arena: President, VP, General Secretary and Organizing Secretary. */
export function canManageCtf(role: Role) {
  return CTF_ROLES.includes(role);
}

/** Section ids this role may open, or "all". */
export function allowedSectionIds(role: Role): string[] | "all" {
  if (role === "Office Secretary") return [...OFFICE_SECRETARY_SECTIONS];
  if (role === "Organizing Secretary") {
    return SECTIONS.filter((s) => ORGANIZING_SECRETARY_GROUPS.includes(s.group)).map((s) => s.id);
  }
  return "all";
}

export function canAccessSection(role: Role, sectionId: string) {
  const allowed = allowedSectionIds(role);
  return allowed === "all" || allowed.includes(sectionId);
}
