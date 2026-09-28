/**
 * Join Us form definition + validation.
 *
 * The shape is admin-editable (roles and extra fields live in a ContentBlock),
 * so both the public form and the API validate against the *stored* config.
 * Nothing here touches the database — it is safe to import from a client
 * component.
 */

export type JoinFieldType = "paragraph" | "short" | "link";

export type JoinFormField = {
  id: string;
  label: string;
  type: JoinFieldType;
  required?: boolean;
};

export type JoinFormConfig = {
  /** Preferred-role options shown in the dropdown. */
  roles: string[];
  /** Extra questions appended after the fixed sections. */
  fields: JoinFormField[];
};

export const JOIN_FORM_KEY = "join-form-config";

export const UNIVERSITY_NAME = "Uttara University";

export const STUDENT_EMAIL_DOMAINS = ["uttarauniversity.edu.bd", "uttara.ac.bd"];

export const MAX_RESUME_BYTES = 10 * 1024 * 1024;

export const JOIN_FIELD_TYPES: JoinFieldType[] = ["paragraph", "short", "link"];

export const JOIN_FIELD_TYPE_LABELS: Record<JoinFieldType, string> = {
  paragraph: "Paragraph",
  short: "Short message",
  link: "Link",
};

export const DEFAULT_ROLES = [
  "General Member (03.01)",
  "Executive Member (03.02)",
  "Executive Committee (03.03)",
];

export const DEFAULT_JOIN_FORM: JoinFormConfig = {
  roles: [...DEFAULT_ROLES],
  fields: [],
};

/** Fixed sections of the form, in render order (§1-§12 of the brief). */
export const FIXED_FIELDS = [
  { id: "fullName", label: "Full name (as per Student ID card)", type: "text" },
  { id: "email", label: "Student Email", type: "email" },
  { id: "studentId", label: "Student ID", type: "text" },
  { id: "phone", label: "Phone Number", type: "tel" },
  { id: "university", label: "University", type: "text" },
  { id: "department", label: "Department", type: "text" },
  { id: "batch", label: "Batch", type: "text" },
  { id: "section", label: "Section", type: "text" },
] as const;

const clean = (v: unknown) => String(v ?? "").trim();

const words = (v: string) => v.split(/\s+/).filter(Boolean);

function isEmailLike(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isStudentEmail(value: string) {
  const email = clean(value).toLowerCase();
  if (!isEmailLike(email)) return false;
  return STUDENT_EMAIL_DOMAINS.some((d) => email.endsWith("@" + d));
}

function isPhone(value: string) {
  const digits = clean(value).replace(/[\s()-]/g, "");
  return /^(?:\+?880|0)?1[3-9]\d{8}$/.test(digits);
}

function isLink(value: string) {
  const v = clean(value);
  return /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([/?#][^\s]*)?$/.test(v) && v.length <= 200;
}

function isHandle(value: string) {
  return /^@?[A-Za-z0-9._-]{2,50}$/.test(clean(value));
}

export function normalizeJoinFormConfig(raw: unknown): JoinFormConfig {
  // No stored config (or unreadable): the built-in defaults. A stored list is
  // honoured as-is so an admin can remove every role to hide the dropdown.
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { roles: [...DEFAULT_ROLES], fields: [] };
  }
  const obj = raw as Record<string, unknown>;
  const roles = Array.isArray(obj.roles)
    ? obj.roles.map(clean).filter(Boolean).slice(0, 40)
    : [];
  const fields = Array.isArray(obj.fields)
    ? obj.fields
        .map((f): JoinFormField | null => {
          const row = (f && typeof f === "object" ? f : {}) as Record<string, unknown>;
          const type = JOIN_FIELD_TYPES.includes(row.type as JoinFieldType)
            ? (row.type as JoinFieldType)
            : "short";
          const label = clean(row.label).slice(0, 120);
          const id = clean(row.id).replace(/[^A-Za-z0-9_-]/g, "").slice(0, 40);
          if (!label || !id) return null;
          return { id, label, type, required: row.required === true };
        })
        .filter((f): f is JoinFormField => f !== null)
        .slice(0, 25)
    : [];
  return { roles, fields };
}

export type JoinValues = Record<string, string>;

export type ResumeInfo = { name: string; size: number; mime: string } | null;

/**
 * Full validation for one submission. Returns a map of field id → message;
 * an empty object means the submission is valid.
 *
 * `values` holds the fixed sections plus any admin-defined field ids.
 * Shared verbatim by the browser (before upload) and the API (after it).
 */
export function validateJoinForm(
  values: JoinValues,
  config: JoinFormConfig,
  resume: ResumeInfo
): Record<string, string> {
  const errors: Record<string, string> = {};
  const v = (k: string) => clean(values[k]);

  if (!v("fullName")) errors.fullName = "This field is required.";
  else if (v("fullName").length < 3) errors.fullName = "Enter your full name.";
  else if (v("fullName").length > 80) errors.fullName = "Keep it under 80 characters.";

  if (!v("email")) errors.email = "This field is required.";
  else if (!isStudentEmail(v("email")))
    errors.email = `Use your student email — it must end with @${STUDENT_EMAIL_DOMAINS[0]} or @${STUDENT_EMAIL_DOMAINS[1]}.`;

  if (!v("studentId")) errors.studentId = "This field is required.";
  else if (!/^\d{1,10}$/.test(v("studentId")))
    errors.studentId = "Student ID must be up to 10 digits.";

  if (!v("phone")) errors.phone = "This field is required.";
  else if (!isPhone(v("phone"))) errors.phone = "Enter a valid Bangladeshi mobile number (e.g. 01712345678).";

  if (v("university") !== UNIVERSITY_NAME)
    errors.university = `${UNIVERSITY_NAME} is the only option.`;

  if (!v("department")) errors.department = "This field is required.";
  else if (words(v("department")).length > 5)
    errors.department = "Use a short department name — maximum 5 words.";
  else if (v("department").length > 60) errors.department = "Keep it under 60 characters.";

  if (!v("batch")) errors.batch = "This field is required.";
  else if (!/^\d{2}$/.test(v("batch"))) errors.batch = "Batch must be exactly 2 digits.";

  if (!v("section")) errors.section = "This field is required.";
  else if (!/^[A-Za-z]$/.test(v("section"))) errors.section = "Section must be a single letter.";

  if (!resume) errors.resume = "Please upload your resume.";
  else if (resume.size <= 0) errors.resume = "That file is empty.";
  else if (resume.size > MAX_RESUME_BYTES)
    errors.resume = `Resume must be ${MAX_RESUME_BYTES / 1024 / 1024} MB or smaller.`;
  else if (resume.mime !== "application/pdf" && !/\.pdf$/i.test(resume.name))
    errors.resume = "Resume must be a PDF file.";

  if (config.roles.length) {
    if (!v("preferredRole")) errors.preferredRole = "Please choose a role.";
    else if (!config.roles.includes(v("preferredRole")))
      errors.preferredRole = "Choose one of the available roles.";
  }

  for (const key of ["facebook", "linkedin", "github"] as const) {
    const val = v(key);
    if (!val) continue;
    if (val.length > 120) errors[key] = "Keep it under 120 characters.";
    else if (!isLink(val) && !isHandle(val))
      errors[key] = "Enter a profile link or a username.";
  }

  if (v("queries").length > 2000) errors.queries = "Keep it under 2000 characters.";

  for (const field of config.fields) {
    const val = v(field.id);
    if (!val) {
      if (field.required) errors[field.id] = "This field is required.";
      continue;
    }
    if (field.type === "short" && val.length > 200)
      errors[field.id] = "Keep it under 200 characters.";
    if (field.type === "paragraph" && val.length > 2000)
      errors[field.id] = "Keep it under 2000 characters.";
    if (field.type === "link" && !isLink(val))
      errors[field.id] = "Enter a valid link (https://…).";
  }

  return errors;
}

/** Fields the API persists as columns (everything else goes into `extra`). */
export const CORE_VALUE_KEYS = [
  "fullName",
  "email",
  "phone",
  "studentId",
  "university",
  "department",
  "batch",
  "section",
  "queries",
  "preferredRole",
  "facebook",
  "linkedin",
  "github",
] as const;
