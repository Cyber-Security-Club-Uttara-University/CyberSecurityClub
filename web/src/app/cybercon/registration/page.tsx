"use client";

import { useState } from "react";
import Link from "next/link";

function generateTicketId(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export default function RegistrationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", studentId: "", university: "", department: "", batch: "", section: "", queries: "", paymentNumber: "", transactionId: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setForm({ ...form, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    const id = generateTicketId();
    setTicketId(id);
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-2 text-black">Registration Successful!</h1>
          <p className="text-[#525252] mb-6">Thank you for registering for CyberCon25.</p>
          <div className="bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] rounded-2xl p-6 shadow-[0px_4px_16px_rgba(0,0,0,0.2)] mb-6">
            <p className="text-sm text-[#525252] mb-1">Your Ticket ID</p>
            <span className="text-3xl font-bold text-[#0000ff]">{ticketId}</span>
            <p className="text-xs text-[#525252] mt-3">Save this ticket ID. You will need it at the event check-in.</p>
          </div>
          <Link href="/cybercon" className="inline-flex items-center gap-2 text-sm text-[#0000ff] hover:text-[#0000cc] transition-colors">&larr; Back to CyberCon25</Link>
        </div>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-2.5 bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] rounded-lg border border-transparent focus:outline-none focus:border-[#0000ff] transition-colors text-black placeholder:text-[#525252]";

  return (
    <div className="min-h-[80vh] bg-[linear-gradient(135deg,#1a1a2e_0%,#16213e_50%,#0f3460_100%)]">
      <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        <Link href="/cybercon" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-8">&larr; Back to CyberCon25</Link>

        <div className="text-center text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">Register Now</h1>
          <p className="text-white/70">Secure your spot at the premier cybersecurity conference</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] rounded-2xl p-8 shadow-[0px_4px_16px_rgba(0,0,0,0.2)] space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1.5 text-black">Full Name *</label>
              <input name="fullName" value={form.fullName} onChange={handleChange} required className={inputClass} placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-black">Email *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required className={inputClass} placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-black">Phone *</label>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} required className={inputClass} placeholder="+880 1XXX-XXXXXX" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-black">Student ID *</label>
              <input name="studentId" value={form.studentId} onChange={handleChange} required className={inputClass} placeholder="011-XX-XXXX" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-black">University *</label>
              <input name="university" value={form.university} onChange={handleChange} required className={inputClass} placeholder="Uttara University" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-black">Department *</label>
              <input name="department" value={form.department} onChange={handleChange} required className={inputClass} placeholder="CSE" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-black">Batch *</label>
              <input name="batch" value={form.batch} onChange={handleChange} required className={inputClass} placeholder="221" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-black">Section</label>
              <input name="section" value={form.section} onChange={handleChange} className={inputClass} placeholder="A" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-black">Payment bKash/Nagad Number *</label>
              <input name="paymentNumber" value={form.paymentNumber} onChange={handleChange} required className={inputClass} placeholder="01XXXXXXXXX" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-black">Transaction ID *</label>
              <input name="transactionId" value={form.transactionId} onChange={handleChange} required className={inputClass} placeholder="Transaction ID" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1.5 text-black">Queries (optional)</label>
              <textarea name="queries" value={form.queries} onChange={handleChange} rows={3} className={`${inputClass} resize-none`} placeholder="Any questions or special requirements?" />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input type="checkbox" id="terms" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 w-4 h-4 rounded" />
            <label htmlFor="terms" className="text-sm text-[#525252]">I agree to the terms and conditions of CyberCon25. I understand that the registration fee is non-refundable and I must present a valid student ID at the event.</label>
          </div>

          <button type="submit" disabled={loading || !agreed}
            className="w-full py-3 bg-[#0000ff] text-white rounded-lg font-bold text-lg hover:bg-[#0000cc] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? "Submitting..." : "Complete Registration"}
          </button>
        </form>
      </div>
    </div>
  );
}
