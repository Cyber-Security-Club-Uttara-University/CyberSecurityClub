"use client";

import { FormEvent, useRef, useState } from "react";
import {
  MAX_RESUME_BYTES,
  STUDENT_EMAIL_DOMAINS,
  UNIVERSITY_NAME,
  validateJoinForm,
  type JoinFormConfig,
  type JoinValues,
} from "@/content/joinForm";

function initialValues(config: JoinFormConfig): JoinValues {
  const values: JoinValues = {
    fullName: "",
    email: "",
    studentId: "",
    phone: "",
    university: UNIVERSITY_NAME,
    department: "",
    batch: "",
    section: "",
    preferredRole: "",
    facebook: "",
    linkedin: "",
    github: "",
    queries: "",
  };
  for (const field of config.fields) values[field.id] = "";
  return values;
}

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

function FieldError({ errors, field }: { errors: Record<string, string>; field: string }) {
  return errors[field] ? <p className="text-red-500 text-xs mt-1">{errors[field]}</p> : null;
}

function Label({
  htmlFor,
  children,
  required = true,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium mb-1.5 text-black">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

export default function JoinForm({ config }: { config: JoinFormConfig }) {
  const [values, setValues] = useState<JoinValues>(() => initialValues(config));
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const set = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));
  };

  const acceptFile = (next: File | null | undefined) => {
    if (!next) {
      setFile(null);
      return;
    }
    const isPdf = next.type === "application/pdf" || /\.pdf$/i.test(next.name);
    if (!isPdf) {
      setErrors((prev) => ({ ...prev, resume: "Resume must be a PDF file." }));
      return;
    }
    if (next.size > MAX_RESUME_BYTES) {
      setErrors((prev) => ({
        ...prev,
        resume: `Resume must be ${MAX_RESUME_BYTES / 1024 / 1024} MB or smaller.`,
      }));
      return;
    }
    setFile(next);
    setErrors((prev) => ({ ...prev, resume: "" }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    const found = validateJoinForm(
      values,
      config,
      file ? { name: file.name, size: file.size, mime: file.type } : null
    );
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setFormError("Please correct the highlighted fields.");
      document.getElementById(Object.keys(found)[0])?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    try {
      const body = new FormData();
      for (const [key, value] of Object.entries(values)) body.append(key, value);
      if (file) body.append("resume", file);

      const res = await fetch("/api/registrations", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors(data.fields ?? {});
        setFormError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setDone(data.ticketId || "");
      setValues(initialValues(config));
      setFile(null);
      if (fileInput.current) fileInput.current.value = "";
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (key: string) =>
    `w-full px-4 py-3 bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] border ${
      errors[key] ? "border-red-500" : "border-transparent"
    } rounded-lg focus:outline-none focus:border-[#0000ff] transition-colors text-sm text-black placeholder:text-[#525252]`;

  if (done) {
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <h1 className="heading-title font-extrabold text-center text-black text-[3rem] leading-[3rem] max-sm:text-[2rem] max-sm:leading-[2rem]">Thank you!</h1>
        <div className="mt-8 bg-white rounded-xl border border-emerald-300 bg-emerald-50 p-6 text-center">
          <p className="text-black font-semibold">Your application has been submitted.</p>
          {done && (
            <p className="mt-3 text-sm text-[#525252]">
              Application ID: <span className="font-bold text-black tabular-nums">{done}</span>
            </p>
          )}
          <button
            onClick={() => {
              setDone("");
              setErrors({});
              setFormError("");
            }}
            className="mt-5 px-5 py-2.5 rounded-lg bg-[#0000ff] text-white text-sm font-semibold hover:bg-[#0000cc]"
          >
            Submit another application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <h1 className="heading-title font-extrabold text-center text-black text-[5rem] leading-[5rem] max-md:text-[3rem] max-md:leading-[3rem] max-sm:text-[2.5rem] max-sm:leading-[2.5rem]">
        Join Us
      </h1>
      <p className="text-[#525252] text-center mb-12 mt-4">
        Fill out the form below to apply for membership in the Cyber Security Club.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <Label htmlFor="fullName">Full Name (as per Student ID card)</Label>
          <input id="fullName" name="fullName" type="text" value={values.fullName} onChange={(e) => set("fullName", e.target.value)} className={inputClass("fullName")} placeholder="As printed on your ID card" />
          <FieldError errors={errors} field="fullName" />
        </div>

        <div>
          <Label htmlFor="email">Student Email</Label>
          <input id="email" name="email" type="email" value={values.email} onChange={(e) => set("email", e.target.value)} className={inputClass("email")} placeholder={`you@student.${STUDENT_EMAIL_DOMAINS[0]}`} />
          <p className="text-xs text-[#525252] mt-1">
            Must end with @{STUDENT_EMAIL_DOMAINS[0]} or @{STUDENT_EMAIL_DOMAINS[1]}
          </p>
          <FieldError errors={errors} field="email" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="studentId">Student ID</Label>
            <input id="studentId" name="studentId" type="text" inputMode="numeric" maxLength={10} value={values.studentId} onChange={(e) => set("studentId", e.target.value.replace(/\D/g, ""))} className={inputClass("studentId")} placeholder="Max 10 digits" />
            <FieldError errors={errors} field="studentId" />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <input id="phone" name="phone" type="tel" value={values.phone} onChange={(e) => set("phone", e.target.value)} className={inputClass("phone")} placeholder="01XXXXXXXXX" />
            <p className="text-xs text-[#525252] mt-1">WhatsApp preferable</p>
            <FieldError errors={errors} field="phone" />
          </div>
        </div>

        <div>
          <Label htmlFor="university">University</Label>
          <input id="university" name="university" type="text" value={values.university} readOnly disabled aria-readonly="true" className={`${inputClass("university")} cursor-not-allowed opacity-80`} />
          <p className="text-xs text-[#525252] mt-1">Locked — {UNIVERSITY_NAME} only.</p>
          <FieldError errors={errors} field="university" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="sm:col-span-2">
            <Label htmlFor="department">Department</Label>
            <input id="department" name="department" type="text" value={values.department} onChange={(e) => set("department", e.target.value)} className={inputClass("department")} placeholder="e.g. Computer Science" />
            <p className="text-xs text-[#525252] mt-1">Short name — maximum 5 words.</p>
            <FieldError errors={errors} field="department" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="batch">Batch</Label>
              <input id="batch" name="batch" type="text" inputMode="numeric" maxLength={2} value={values.batch} onChange={(e) => set("batch", e.target.value.replace(/\D/g, ""))} className={inputClass("batch")} placeholder="22" />
              <FieldError errors={errors} field="batch" />
            </div>
            <div>
              <Label htmlFor="section">Section</Label>
              <input id="section" name="section" type="text" maxLength={1} value={values.section} onChange={(e) => set("section", e.target.value.replace(/[^A-Za-z]/g, "").toUpperCase())} className={inputClass("section")} placeholder="A" />
              <FieldError errors={errors} field="section" />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="resume">Upload Resume</Label>
          <input
            ref={fileInput}
            id="resume"
            name="resume"
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => acceptFile(e.target.files?.[0])}
          />
          <div
            onClick={() => fileInput.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              acceptFile(e.dataTransfer.files?.[0]);
            }}
            className={`flex items-center justify-between gap-3 rounded-lg border-2 border-dashed px-4 py-5 cursor-pointer transition-colors ${
              errors.resume ? "border-red-500 bg-red-50" : "border-black/25 bg-[rgba(211,210,211,0.35)] hover:border-[#0000ff]"
            }`}
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-black truncate">
                {file ? file.name : "Click to choose your resume, or drop a file here"}
              </p>
              <p className="text-xs text-[#525252] mt-0.5">
                {file ? formatSize(file.size) : "PDF only · maximum 10 MB"}
              </p>
            </div>
            <span className="shrink-0 px-3 py-1.5 rounded-lg bg-[#0000ff] text-white text-xs font-semibold">
              {file ? "Replace" : "Upload PDF"}
            </span>
          </div>
          {file && (
            <button
              type="button"
              onClick={() => {
                setFile(null);
                if (fileInput.current) fileInput.current.value = "";
              }}
              className="mt-2 text-xs font-semibold text-red-600 hover:underline"
            >
              Remove file
            </button>
          )}
          <FieldError errors={errors} field="resume" />
        </div>

        {config.roles.length > 0 && (
          <div>
            <Label htmlFor="preferredRole">Preferred Role</Label>
            <select
              id="preferredRole"
              name="preferredRole"
              value={values.preferredRole}
              onChange={(e) => set("preferredRole", e.target.value)}
              className={`${inputClass("preferredRole")} cursor-pointer`}
            >
              <option value="">Select a role</option>
              {config.roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <FieldError errors={errors} field="preferredRole" />
          </div>
        )}

        <div>
          <span className="block text-sm font-medium mb-1.5 text-black">Social Media IDs</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { key: "facebook", label: "Facebook" },
              { key: "linkedin", label: "LinkedIn" },
              { key: "github", label: "GitHub" },
            ].map(({ key, label }) => (
              <div key={key}>
                <input id={key} name={key} type="text" value={values[key]} onChange={(e) => set(key, e.target.value)} className={inputClass(key)} placeholder={`${label} (optional)`} aria-label={label} />
                <FieldError errors={errors} field={key} />
              </div>
            ))}
          </div>
        </div>

        {config.fields.map((field) => (
          <div key={field.id}>
            <Label htmlFor={field.id} required={Boolean(field.required)}>
              {field.label}
            </Label>
            {field.type === "paragraph" ? (
              <textarea id={field.id} name={field.id} rows={4} value={values[field.id] ?? ""} onChange={(e) => set(field.id, e.target.value)} className={inputClass(field.id)} placeholder="Your answer" />
            ) : (
              <input id={field.id} name={field.id} type={field.type === "link" ? "url" : "text"} value={values[field.id] ?? ""} onChange={(e) => set(field.id, e.target.value)} className={inputClass(field.id)} placeholder={field.type === "link" ? "https://" : "Your answer"} />
            )}
            <FieldError errors={errors} field={field.id} />
          </div>
        ))}

        <div>
          <Label htmlFor="queries" required={false}>
            Any Questions or Comments?
          </Label>
          <textarea id="queries" name="queries" rows={4} value={values.queries} onChange={(e) => set("queries", e.target.value)} className={inputClass("queries")} placeholder="Anything you'd like us to know (optional)" />
          <FieldError errors={errors} field="queries" />
        </div>

        {formError && (
          <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-300 text-red-700 text-sm font-semibold">
            {formError}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#0000ff] text-white rounded-lg font-medium hover:bg-[#0000cc] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
