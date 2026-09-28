"use client";

import { useState } from "react";
import Image from "next/image";

type Step = "enter-id" | "preview";

export default function CertificatePage() {
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [step, setStep] = useState<Step>("enter-id");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);

  const handleLookup = async () => {
    if (studentId.length !== 10) { setError("Student ID must be exactly 10 digits."); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/certificate/lookup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ studentId }) });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Student not found."); setLoading(false); return; }
      setStudentName(data.name); setStep("preview");
    } catch { setError("Failed to look up student. Please try again."); }
    finally { setLoading(false); }
  };

  const handleGenerate = async () => {
    setGenerating(true); setError("");
    try {
      const res = await fetch("/api/certificate/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ studentId, name: studentName }) });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Failed to generate certificate."); setGenerating(false); return; }
      setCertificateUrl(data.url || data.certificateUrl);
    } catch { setError("Failed to generate certificate. Please try again."); }
    finally { setGenerating(false); }
  };

  const handleDownload = () => {
    if (!certificateUrl) return;
    const link = document.createElement("a"); link.href = certificateUrl;
    link.download = `CSC-Certificate-${studentId}.png`; link.click();
  };

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowWelcome(false)} />
          <div className="relative bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] rounded-2xl p-8 max-w-md w-full text-center shadow-[0px_4px_16px_rgba(0,0,0,0.2)]">
            <Image src="/cert/cybercon25.png" alt="CyberCon 2025" width={400} height={250} className="rounded-xl mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2 text-black">CyberCon25 Certificate</h2>
            <p className="text-[#525252] text-sm mb-6">Generate your participation certificate for CyberCon25.</p>
            <button onClick={() => setShowWelcome(false)} className="px-6 py-2.5 bg-[#0000ff] text-white rounded-lg font-medium hover:bg-[#0000cc] transition-colors">Get Started</button>
          </div>
        </div>
      )}

      <h1 className="heading-title font-extrabold text-center text-black text-[5rem] leading-[5rem] max-md:text-[3rem] max-md:leading-[3rem] max-sm:text-[2.5rem] max-sm:leading-[2.5rem]">Certificate</h1>
      <p className="text-[#525252] text-center mb-12 mt-4">Enter your student ID to look up your name and generate your certificate.</p>

      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="flex items-center gap-2">
          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === "enter-id" ? "bg-[#0000ff] text-white" : "bg-[#0000ff]/10 text-[#0000ff]"}`}>1</span>
          <span className="text-sm font-medium text-black">Enter ID</span>
        </div>
        <div className="w-12 h-px bg-[rgba(211,210,211,0.5)]" />
        <div className="flex items-center gap-2">
          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === "preview" ? "bg-[#0000ff] text-white" : "bg-[rgba(211,210,211,0.35)] text-[#525252]"}`}>2</span>
          <span className="text-sm font-medium text-black">Generate</span>
        </div>
      </div>

      {error && <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl mb-6 text-sm">{error}</div>}

      {step === "enter-id" && (
        <div className="bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] rounded-2xl p-8 shadow-[0px_4px_16px_rgba(0,0,0,0.2)]">
          <h2 className="text-lg font-semibold mb-6 text-black">Student ID Verification</h2>
          <label htmlFor="studentId" className="block text-sm font-medium mb-1.5 text-black">Student ID <span className="text-red-500">*</span></label>
          <input id="studentId" type="text" value={studentId} onChange={(e) => { const val = e.target.value.replace(/\D/g, "").slice(0, 10); setStudentId(val); if (error) setError(""); }}
            placeholder="Enter your 10-digit student ID" maxLength={10}
            className="w-full px-4 py-3 bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] border border-transparent rounded-lg focus:outline-none focus:border-[#0000ff] transition-colors text-sm text-black placeholder:text-[#525252]" />
          <p className="text-xs text-[#525252] mt-2">{studentId.length}/10 digits</p>
          <button onClick={handleLookup} disabled={loading || studentId.length !== 10}
            className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-[#0000ff] text-white rounded-lg font-medium hover:bg-[#0000cc] disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
            {loading ? "Looking up..." : "Verify Student ID"}
          </button>
        </div>
      )}

      {step === "preview" && (
        <div className="bg-[rgba(211,210,211,0.35)] backdrop-blur-[16px] rounded-2xl p-8 shadow-[0px_4px_16px_rgba(0,0,0,0.2)] text-center">
          <h2 className="text-lg font-semibold mb-1 text-black">Student Found</h2>
          <p className="text-[#525252] mb-6"><span className="font-medium text-black">{studentName}</span><br /><span className="text-sm">ID: {studentId}</span></p>
          {certificateUrl ? (
            <div className="space-y-4">
              <div className="relative aspect-[1.414/1] w-full max-w-lg mx-auto bg-[rgba(211,210,211,0.35)] rounded-xl overflow-hidden">
                <Image src={certificateUrl} alt="Certificate" fill className="object-contain" />
              </div>
              <button onClick={handleDownload} className="inline-flex items-center gap-2 px-6 py-3 bg-[#0000ff] text-white rounded-lg font-medium hover:bg-[#0000cc] transition-colors">Download Certificate</button>
            </div>
          ) : (
            <div className="space-y-3">
              <button onClick={handleGenerate} disabled={generating}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#0000ff] text-white rounded-lg font-medium hover:bg-[#0000cc] disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
                {generating ? "Generating..." : "Generate Certificate"}
              </button>
              <button onClick={() => { setStep("enter-id"); setStudentId(""); setStudentName(""); setCertificateUrl(""); setError(""); }}
                className="w-full py-3 border border-[rgba(211,210,211,0.5)] rounded-lg text-sm font-medium hover:bg-[rgba(211,210,211,0.35)] transition-colors text-black">Use Different ID</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
