import React, { useState } from 'react';
import { useRentVibeStore } from '../store/useRentVibeStore';
import { MUMBAI_COLLEGES } from '../data/mumbaiData';
import { VerificationStatus } from '../types/rentvibe';
import {
  ShieldCheck,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Lock,
  Sparkles,
  FileBadge
} from 'lucide-react';
import marathiImg from '../assets/images/outfit_marathi_nauvari_pheta_1791730416395.jpg';

export const StudentVerificationView: React.FC = () => {
  const {
    isDarkMode,
    currentUserVerification,
    registeredEmailsMap,
    submitStudentVerification,
    simulateQuickVerify
  } = useRentVibeStore();

  const [fullName, setFullName] = useState(currentUserVerification.fullName);
  const [email, setEmail] = useState(currentUserVerification.email);
  const [collegeName, setCollegeName] = useState(currentUserVerification.collegeName);
  const [rollNo, setRollNo] = useState(currentUserVerification.rollNo);
  const [graduationYear, setGraduationYear] = useState(currentUserVerification.graduationYear);
  const [idCardPreviewUrl, setIdCardPreviewUrl] = useState(
    currentUserVerification.idCardPreviewUrl || marathiImg
  );
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  const handleImageDropOrSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setIdCardPreviewUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setFeedback({
        type: 'error',
        text: 'Please provide a valid college (.edu / .ac.in) or personal student email.'
      });
      return;
    }
    if (!rollNo.trim() || rollNo.trim().length < 4) {
      setFeedback({
        type: 'error',
        text: 'Please enter your complete Mumbai College Roll Number (e.g., TYBMM-2026-084).'
      });
      return;
    }

    const res = submitStudentVerification({
      fullName,
      email,
      collegeName,
      rollNo,
      graduationYear,
      idCardPreviewUrl
    });

    setFeedback({
      type: res.success ? 'success' : 'error',
      text: res.message
    });
  };

  const statusColor =
    currentUserVerification.status === 'Verified Student'
      ? isDarkMode
        ? 'text-white border-[#0683D7] bg-gradient-to-br from-[#223CCF]/60 to-[#161B7F]/80'
        : 'text-white border-[#223CCF] bg-gradient-to-br from-[#223CCF] to-[#161B7F]'
      : currentUserVerification.status === 'Pending Approval'
      ? 'text-white border-[#8D3FD0] bg-gradient-to-br from-[#8D3FD0] to-[#223CCF]'
      : 'text-white border-[#ED3D63] bg-gradient-to-br from-[#ED3D63] to-[#8D3FD0]';

  return (
    <div className="space-y-8">
      {/* Header & Live Verification Status Banner */}
      <section
        className={`rounded-3xl border p-6 sm:p-8 transition-colors shadow-lg ${
          isDarkMode ? 'bg-[#080917] border-[#223CCF]/50' : 'bg-white border-[#223CCF]/25'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div
              className={`text-xs font-mono font-bold ${
                isDarkMode ? 'text-[#0683D7]' : 'text-[#8D3FD0]'
              }`}
            >
              🪪 SUPABASE AUTH + COLLEGE ID CRYPTOGRAPHIC BINDING
            </div>
            <h1
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                isDarkMode ? 'text-white' : 'text-[#161B7F]'
              }`}
            >
              🎓 Student Verification & Zero-Deposit Onboarding
            </h1>
            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Strict{' '}
              <span className="font-bold text-[#ED3D63]">One Email = One Student ID</span> rule
              prevents duplicate rentals and unlocks an instant 15% student discount plus ₹0
              security deposit across all Mumbai college canteen hubs. ✨
            </p>
          </div>

          {/* Live Status Card */}
          <div className={`p-5 rounded-2xl border min-w-[280px] shadow-lg ${statusColor}`}>
            <div className="flex items-center gap-2.5">
              {currentUserVerification.status === 'Verified Student' && (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-[#0683D7]" />
              )}
              {currentUserVerification.status === 'Pending Approval' && (
                <Clock className="w-5 h-5 shrink-0 text-white" />
              )}
              {currentUserVerification.status === 'Rejected' && (
                <AlertTriangle className="w-5 h-5 shrink-0 text-white" />
              )}
              <div>
                <div className="text-[11px] font-mono uppercase opacity-90">
                  Live Verification Status
                </div>
                <div className="text-base font-extrabold">{currentUserVerification.status}</div>
              </div>
            </div>
            <div className="text-xs mt-2 opacity-95 font-medium">
              {currentUserVerification.status === 'Verified Student'
                ? '🎉 Unlocks 15% Discount + Zero Deposit Option at Checkout'
                : currentUserVerification.status === 'Pending Approval'
                ? '⏳ Queued in Admin Portal — Approve from Admin tab or test below'
                : currentUserVerification.rejectionNote || 'ID mismatch or blurry Roll No.'}
            </div>

            {/* Interactive State Switcher for Instant Demo Testing */}
            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between gap-1.5">
              <span className="text-[10px] font-mono font-bold">Simulate State:</span>
              <div className="flex gap-1">
                {(
                  ['Pending Approval', 'Verified Student', 'Rejected'] as VerificationStatus[]
                ).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => simulateQuickVerify(st)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      currentUserVerification.status === st
                        ? 'bg-[#ED3D63] text-white shadow-sm scale-105'
                        : 'bg-black/40 text-white hover:bg-[#0683D7]'
                    }`}
                  >
                    {st.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Split Verification Form & Student ID Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Left Column */}
        <form
          onSubmit={handleFormSubmit}
          className={`lg:col-span-7 rounded-3xl border p-6 sm:p-8 space-y-5 shadow-lg ${
            isDarkMode ? 'bg-[#080917] border-[#223CCF]/50' : 'bg-white border-[#223CCF]/25'
          }`}
        >
          <div
            className={`flex items-center justify-between border-b pb-4 ${
              isDarkMode ? 'border-[#223CCF]/40' : 'border-[#223CCF]/20'
            }`}
          >
            <div>
              <h2
                className={`text-lg font-extrabold ${
                  isDarkMode ? 'text-white' : 'text-[#161B7F]'
                }`}
              >
                🔐 01. Bind Email to Mumbai College Roll No.
              </h2>
              <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Both `.edu.in` institutional emails and personal Gmail accounts are accepted with a
                valid physical ID scan.
              </p>
            </div>
            <Lock className="w-5 h-5 text-[#ED3D63] shrink-0" />
          </div>

          {feedback && (
            <div
              className={`p-4 rounded-xl border text-xs font-bold flex items-start gap-2.5 ${
                feedback.type === 'success'
                  ? isDarkMode
                    ? 'bg-[#223CCF]/30 border-[#0683D7] text-[#0683D7]'
                    : 'bg-[#0683D7]/15 border-[#0683D7] text-[#161B7F]'
                  : 'bg-[#ED3D63]/20 border-[#ED3D63] text-[#ED3D63]'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#0683D7]" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#ED3D63]" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5">
                👤 Full Name (As on College ID)
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g., Aarav Nair"
                className={`w-full h-11 px-3.5 rounded-xl border text-xs font-medium ${
                  isDarkMode
                    ? 'bg-[#05050B] border-[#223CCF] text-white'
                    : 'bg-[#F4F7FF] border-[#223CCF]/30 text-[#0B0F29]'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5">
                📧 Student Email (.edu.in or Personal)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarav.nair@xaviers.edu"
                className={`w-full h-11 px-3.5 rounded-xl border text-xs font-mono font-medium ${
                  isDarkMode
                    ? 'bg-[#05050B] border-[#223CCF] text-white'
                    : 'bg-[#F4F7FF] border-[#223CCF]/30 text-[#0B0F29]'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold mb-1.5">🏫 Mumbai College Name</label>
              <select
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                className={`w-full h-11 px-3 rounded-xl border text-xs font-semibold ${
                  isDarkMode
                    ? 'bg-[#05050B] border-[#223CCF] text-white'
                    : 'bg-[#F4F7FF] border-[#223CCF]/30 text-[#161B7F]'
                }`}
              >
                {MUMBAI_COLLEGES.map((col) => (
                  <option key={col.id} value={col.shortName}>
                    {col.shortName}
                  </option>
                ))}
                <option value="Jai Hind College Churchgate">Jai Hind College Churchgate</option>
                <option value="DJ Sanghvi Engineering">DJ Sanghvi Engineering</option>
                <option value="VJTI Matunga">VJTI Matunga</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5">
                🔢 Unique College Roll No. / PRN
              </label>
              <input
                type="text"
                required
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                placeholder="TYBSC-IT-2026-009"
                className={`w-full h-11 px-3.5 rounded-xl border text-xs font-mono uppercase font-bold ${
                  isDarkMode
                    ? 'bg-[#05050B] border-[#223CCF] text-[#0683D7]'
                    : 'bg-[#F4F7FF] border-[#223CCF]/30 text-[#ED3D63]'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5">🎓 Graduation Year</label>
              <select
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                className={`w-full h-11 px-3 rounded-xl border text-xs font-mono font-bold ${
                  isDarkMode
                    ? 'bg-[#05050B] border-[#223CCF] text-white'
                    : 'bg-[#F4F7FF] border-[#223CCF]/30 text-[#161B7F]'
                }`}
              >
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
                <option value="2029">2029</option>
              </select>
            </div>
          </div>

          {/* Drag-and-Drop Camera / Gallery Picker */}
          <div className="space-y-2">
            <label className="block text-xs font-bold">
              📸 Upload Physical College ID Card (Front showing Photo, Barcode & Roll No.)
            </label>
            <label
              className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed transition-colors cursor-pointer ${
                isDarkMode
                  ? 'border-[#8D3FD0] bg-[#05050B] hover:border-[#0683D7]'
                  : 'border-[#223CCF]/40 bg-[#F4F7FF] hover:border-[#ED3D63]'
              }`}
            >
              <Upload className="w-6 h-6 text-[#ED3D63] mb-2" />
              <span
                className={`text-xs font-bold ${
                  isDarkMode ? 'text-white' : 'text-[#161B7F]'
                }`}
              >
                Click to select from Gallery / Camera or Drag & Drop ID Scan
              </span>
              <span
                className={`text-[11px] mt-1 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Encrypted & stored in private Supabase Storage bucket (`student-id-vault`)
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageDropOrSelect}
                className="hidden"
              />
            </label>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
            <div
              className={`text-[11px] font-mono font-bold ${
                isDarkMode ? 'text-[#0683D7]' : 'text-[#223CCF]'
              }`}
            >
              🔒 1:1 Registry Check: {Object.keys(registeredEmailsMap).length} Mumbai Student IDs Bound
            </div>
            <button
              type="submit"
              className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#ED3D63] via-[#8D3FD0] to-[#223CCF] hover:opacity-95 text-white font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#ED3D63]/25"
            >
              <ShieldCheck className="w-4 h-4" />
              ✨ Verify & Link Student ID
            </button>
          </div>
        </form>

        {/* Right Column: Live ID Card Preview & Strict 1:1 Registry Table */}
        <div className="lg:col-span-5 space-y-6">
          <div
            className={`rounded-3xl border p-6 space-y-4 shadow-lg ${
              isDarkMode ? 'bg-[#080917] border-[#223CCF]/50' : 'bg-white border-[#223CCF]/25'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-mono font-bold ${
                  isDarkMode ? 'text-[#0683D7]' : 'text-[#8D3FD0]'
                }`}
              >
                🪪 DIGITAL CAMPUS PASS PREVIEW
              </span>
              <FileBadge className="w-4 h-4 text-[#ED3D63]" />
            </div>

            <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden relative border-2 border-[#223CCF] bg-[#05050B] shadow-md">
              <img
                src={idCardPreviewUrl}
                alt="Student ID Card Preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05050B] via-[#161B7F]/45 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between">
                <div>
                  <div className="text-[10px] font-mono font-bold text-[#0683D7] uppercase">
                    🎓 {collegeName}
                  </div>
                  <div className="text-base font-extrabold">{fullName || 'Student Name'}</div>
                  <div className="text-xs font-mono text-slate-200 mt-0.5">
                    Roll: {rollNo} · Batch of {graduationYear}
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-[#ED3D63] text-white font-mono font-bold text-[10px]">
                  1:1 EMAIL BOUND
                </div>
              </div>
            </div>

            {/* Active Registry Ledger demonstrating Strict One Email = One Student ID */}
            <div className="pt-2 space-y-2">
              <div
                className={`text-xs font-bold ${
                  isDarkMode ? 'text-white' : 'text-[#161B7F]'
                }`}
              >
                📋 Active 1-Email = 1-ID Cryptographic Ledger (Test Duplicate Prevention)
              </div>
              <p className={`text-[11px] ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Try submitting one of the emails below with a different Roll No. to test the strict
                1:1 constraint validator:
              </p>
              <div
                className={`rounded-xl border divide-y text-xs font-mono ${
                  isDarkMode
                    ? 'bg-[#05050B] border-[#223CCF] divide-[#223CCF]/40'
                    : 'bg-[#F4F7FF] border-[#223CCF]/25 divide-[#223CCF]/15'
                }`}
              >
                {Object.entries(registeredEmailsMap).map(([em, rl]) => (
                  <div key={em} className="px-3.5 py-2.5 flex items-center justify-between gap-2">
                    <span
                      className={`truncate font-medium ${
                        isDarkMode ? 'text-slate-200' : 'text-[#161B7F]'
                      }`}
                    >
                      {em}
                    </span>
                    <span className="text-[#ED3D63] font-bold shrink-0">{rl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
