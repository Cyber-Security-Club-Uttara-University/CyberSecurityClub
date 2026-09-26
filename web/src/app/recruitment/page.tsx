"use client";

import { useState, FormEvent } from "react";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  studentId: string;
  university: string;
  department: string;
  batch: string;
  section: string;
  queries: string;
  paymentNumber: string;
  transactionId: string;
}

const initialData: FormData = {
  fullName: "", email: "", phone: "", studentId: "", university: "",
  department: "", batch: "", section: "", queries: "", paymentNumber: "", transactionId: "",
};

export default function RecruitmentPage() {
  const [form, setForm] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const requiredFields: (keyof FormData)[] = ["fullName", "email", "phone", "studentId", "university", "department", "batch", "section", "paymentNumber", "transactionId"];

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    for (const field of requiredFields) { if (!form[field].trim()) newErrors[field] = "This field is required."; }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Enter a valid email address.";
    if (form.studentId && form.studentId.length !== 10) newErrors.studentId = "Student ID must be 10 digits.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      console.log("Form submitted:", form);
      alert("Application submitted successfully! We will contact you soon.");
      setForm(initialData);
    } catch { alert("Something went wrong. Please try again."); }
    finally { setSubmitting(false); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const inputClass = (field: keyof FormData) =>
    `w-full px-4 py-3 bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] border ${errors[field] ? "border-red-500" : "border-transparent"} rounded-lg focus:outline-none focus:border-[#0000ff] transition-colors text-sm text-black placeholder:text-[#525252]`;

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <h1 className="heading-title font-extrabold text-center text-black text-[5rem] leading-[5rem] max-md:text-[3rem] max-md:leading-[3rem] max-sm:text-[2.5rem] max-sm:leading-[2.5rem]">Join Us</h1>
      <p className="text-[#525252] text-center mb-12 mt-4">Fill out the form below to apply for membership in the Cyber Security Club.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {[
          { id: "fullName", label: "Full Name", type: "text", placeholder: "John Doe" },
          { id: "email", label: "Email", type: "email", placeholder: "you@example.com" },
          { id: "phone", label: "Phone Number", type: "tel", placeholder: "+880 1XXXXXXXXX" },
          { id: "studentId", label: "Student ID", type: "text", placeholder: "10-digit student ID" },
          { id: "university", label: "University", type: "text", placeholder: "Uttara University" },
        ].map(({ id, label, type, placeholder }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-sm font-medium mb-1.5 text-black">{label} <span className="text-red-500">*</span></label>
            <input id={id} name={id} type={type} value={form[id as keyof FormData]} onChange={handleChange} className={inputClass(id as keyof FormData)} placeholder={placeholder} />
            {errors[id as keyof FormData] && <p className="text-red-500 text-xs mt-1">{errors[id as keyof FormData]}</p>}
          </div>
        ))}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[{ id: "department", label: "Department", placeholder: "CSE" }, { id: "batch", label: "Batch", placeholder: "22" }].map(({ id, label, placeholder }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-sm font-medium mb-1.5 text-black">{label} <span className="text-red-500">*</span></label>
              <input id={id} name={id} type="text" value={form[id as keyof FormData]} onChange={handleChange} className={inputClass(id as keyof FormData)} placeholder={placeholder} />
              {errors[id as keyof FormData] && <p className="text-red-500 text-xs mt-1">{errors[id as keyof FormData]}</p>}
            </div>
          ))}
        </div>

        <div>
          <label htmlFor="section" className="block text-sm font-medium mb-1.5 text-black">Section <span className="text-red-500">*</span></label>
          <input id="section" name="section" type="text" value={form.section} onChange={handleChange} className={inputClass("section")} placeholder="A" />
          {errors.section && <p className="text-red-500 text-xs mt-1">{errors.section}</p>}
        </div>

        <div>
          <label htmlFor="paymentNumber" className="block text-sm font-medium mb-1.5 text-black">bKash / Nagad Number <span className="text-red-500">*</span></label>
          <input id="paymentNumber" name="paymentNumber" type="tel" value={form.paymentNumber} onChange={handleChange} className={inputClass("paymentNumber")} placeholder="01XXXXXXXXX" />
          {errors.paymentNumber && <p className="text-red-500 text-xs mt-1">{errors.paymentNumber}</p>}
        </div>

        <div>
          <label htmlFor="transactionId" className="block text-sm font-medium mb-1.5 text-black">Transaction ID <span className="text-red-500">*</span></label>
          <input id="transactionId" name="transactionId" type="text" value={form.transactionId} onChange={handleChange} className={inputClass("transactionId")} placeholder="Enter transaction ID from payment" />
          {errors.transactionId && <p className="text-red-500 text-xs mt-1">{errors.transactionId}</p>}
        </div>

        <div>
          <label htmlFor="queries" className="block text-sm font-medium mb-1.5 text-black">Questions or Comments</label>
          <textarea id="queries" name="queries" value={form.queries} onChange={handleChange} rows={4} className={inputClass("queries")} placeholder="Anything you'd like us to know (optional)" />
        </div>

        <button type="submit" disabled={submitting}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#0000ff] text-white rounded-lg font-medium hover:bg-[#0000cc] disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
          {submitting ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}
