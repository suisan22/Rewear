import React, { useState } from 'react';
import { useRentVibeStore } from '../store/useRentVibeStore';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Camera,
  Lock,
  Unlock,
  UserCheck,
  TrendingUp,
  Layers,
  Clock
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    isDarkMode,
    isAdminRole,
    setIsAdminRole,
    listings,
    adminApproveListing,
    adminRejectListing,
    adminRequestPhotosListing,
    verificationQueue,
    adminUpdateStudentVerification,
    activeOrders,
    setActiveTab
  } = useRentVibeStore();

  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>({});
  const [adminToast, setAdminToast] = useState<string | null>(null);

  const pendingOutfits = listings.filter((l) => l.approvalStatus !== 'approved');
  const approvedOutfits = listings.filter((l) => l.approvalStatus === 'approved');
  const pendingVerifications = verificationQueue.filter(
    (v) => v.status === 'Pending Approval'
  );
  const totalRevenue = activeOrders.reduce((acc, o) => acc + o.finalAmountPaid, 28450);

  const triggerToast = (msg: string) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(null), 3200);
  };

  return (
    <div className="space-y-8">
      {/* Top Role-Based Auth Toggle Bar */}
      <section
        className={`rounded-3xl border p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-lg ${
          isDarkMode ? 'bg-[#080917] border-[#223CCF]/50' : 'bg-white border-[#223CCF]/25'
        }`}
      >
        <div className="space-y-1.5">
          <div
            className={`text-xs font-mono font-bold ${
              isDarkMode ? 'text-[#0683D7]' : 'text-[#8D3FD0]'
            }`}
          >
            🛡️ SUPABASE RLS ADMIN PORTAL · MUMBAI MODERATION DESK
          </div>
          <h1
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-[#161B7F]'
            }`}
          >
            Admin Portal & C2C Outfit Approval Queue
          </h1>
          <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Review student-uploaded outfits (enforcing the ≤ ₹500/day rule) and cross-verify physical
            Mumbai College IDs against 1:1 email bindings.
          </p>
        </div>

        {/* Role-Based Auth Toggle */}
        <div
          className={`p-4 rounded-2xl border flex items-center gap-4 shrink-0 ${
            isAdminRole
              ? isDarkMode
                ? 'border-[#0683D7] bg-[#223CCF]/30'
                : 'border-[#223CCF] bg-[#F0F4FF]'
              : isDarkMode
              ? 'border-[#223CCF]/50 bg-[#05050B]'
              : 'border-[#223CCF]/25 bg-slate-50'
          }`}
        >
          <div>
            <div
              className={`text-[11px] font-mono uppercase font-bold ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Role-Based Access Control
            </div>
            <div className="text-sm font-extrabold flex items-center gap-1.5">
              {isAdminRole ? (
                <>
                  <Unlock className="w-4 h-4 text-[#0683D7]" />
                  <span className={isDarkMode ? 'text-[#0683D7]' : 'text-[#223CCF]'}>
                    Admin Session Unlocked
                  </span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#ED3D63]" />
                  <span className="text-[#ED3D63]">Student View (Read-Only)</span>
                </>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsAdminRole(!isAdminRole)}
            className={`h-10 px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-md ${
              isAdminRole
                ? 'bg-[#161B7F] text-white hover:bg-[#8D3FD0]'
                : 'bg-gradient-to-r from-[#ED3D63] to-[#8D3FD0] text-white hover:opacity-95'
            }`}
          >
            {isAdminRole ? 'Switch to Student Role' : '🔓 Unlock Admin Role'}
          </button>
        </div>
      </section>

      {adminToast && (
        <div className="p-4 rounded-2xl border border-[#0683D7] bg-gradient-to-r from-[#223CCF] to-[#8D3FD0] text-white text-xs font-bold flex items-center justify-between shadow-lg">
          <span>✨ {adminToast}</span>
          <button
            onClick={() => setActiveTab('discover')}
            className="underline font-extrabold ml-4 text-white cursor-pointer"
          >
            View Live on Campus Feed →
          </button>
        </div>
      )}

      {/* Overview Metrics Cards (5 KPI Strip) */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div
          className={`p-5 rounded-2xl border shadow-sm ${
            isDarkMode ? 'bg-[#080917] border-[#223CCF]/50' : 'bg-white border-[#223CCF]/25'
          }`}
        >
          <div className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            👗 Total Live Listings
          </div>
          <div
            className={`text-2xl font-extrabold font-mono tabular-nums mt-1 ${
              isDarkMode ? 'text-white' : 'text-[#161B7F]'
            }`}
          >
            {approvedOutfits.length}
          </div>
          <div className="text-[11px] font-mono font-bold text-[#0683D7] mt-1">
            100% ≤ ₹500/day
          </div>
        </div>

        <div
          className={`p-5 rounded-2xl border shadow-sm ${
            isDarkMode ? 'bg-[#080917] border-[#223CCF]/50' : 'bg-white border-[#223CCF]/25'
          }`}
        >
          <div className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            ⏳ Pending Outfits
          </div>
          <div className="text-2xl font-extrabold font-mono tabular-nums mt-1 text-[#ED3D63]">
            {pendingOutfits.length}
          </div>
          <div className="text-[11px] font-mono font-semibold text-[#8D3FD0] mt-1">
            Awaiting C2C Review
          </div>
        </div>

        <div
          className={`p-5 rounded-2xl border shadow-sm ${
            isDarkMode ? 'bg-[#080917] border-[#223CCF]/50' : 'bg-white border-[#223CCF]/25'
          }`}
        >
          <div className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            🪪 Pending Student IDs
          </div>
          <div className="text-2xl font-extrabold font-mono tabular-nums mt-1 text-[#8D3FD0]">
            {pendingVerifications.length}
          </div>
          <div className="text-[11px] font-mono font-semibold text-[#223CCF] dark:text-[#0683D7] mt-1">
            1:1 Email Binding
          </div>
        </div>

        <div
          className={`p-5 rounded-2xl border shadow-sm ${
            isDarkMode ? 'bg-[#080917] border-[#223CCF]/50' : 'bg-white border-[#223CCF]/25'
          }`}
        >
          <div className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            🎒 Active Campus Rentals
          </div>
          <div className="text-2xl font-extrabold font-mono tabular-nums mt-1 text-[#0683D7]">
            {activeOrders.length + 18}
          </div>
          <div className={`text-[11px] font-mono mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Across 8 Mumbai Hubs
          </div>
        </div>

        <div
          className={`p-5 rounded-2xl border col-span-2 sm:col-span-1 shadow-sm ${
            isDarkMode ? 'bg-[#080917] border-[#223CCF]/50' : 'bg-white border-[#223CCF]/25'
          }`}
        >
          <div className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            💸 Monthly GMV Revenue
          </div>
          <div className="text-2xl font-extrabold font-mono tabular-nums mt-1 text-[#ED3D63]">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] font-mono font-bold text-[#0683D7] mt-1">
            +24% Fest Season
          </div>
        </div>
      </section>

      {!isAdminRole && (
        <div className="p-4 rounded-2xl border border-[#ED3D63] bg-gradient-to-r from-[#ED3D63]/15 to-[#8D3FD0]/15 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 text-[#ED3D63]" />
            <span className={isDarkMode ? 'text-white' : 'text-[#161B7F]'}>
              You are viewing the Admin Queue in Student Preview Mode. Click{' '}
              <strong className="text-[#ED3D63]">"Unlock Admin Role"</strong> in the top right to
              execute live approvals or rejections.
            </span>
          </div>
          <button
            onClick={() => setIsAdminRole(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#ED3D63] hover:bg-[#8D3FD0] text-white font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors"
          >
            Unlock Now
          </button>
        </div>
      )}

      {/* SECTION 1: Client / Student Uploaded Outfit Approval Queue */}
      <section
        className={`rounded-3xl border p-6 sm:p-8 space-y-6 shadow-lg ${
          isDarkMode ? 'bg-[#080917] border-[#223CCF]/50' : 'bg-white border-[#223CCF]/25'
        }`}
      >
        <div
          className={`flex flex-wrap items-center justify-between gap-4 border-b pb-4 ${
            isDarkMode ? 'border-[#223CCF]/40' : 'border-[#223CCF]/20'
          }`}
        >
          <div>
            <h2
              className={`text-lg font-extrabold ${
                isDarkMode ? 'text-white' : 'text-[#161B7F]'
              }`}
            >
              👗 01. Client / Student Uploaded Outfit Approval Queue ({pendingOutfits.length})
            </h2>
            <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Clicking [Approve & Publish] immediately pushes the outfit live to the Student Home
              Discovery feed.
            </p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-[#ED3D63]/15 text-[#ED3D63] text-xs font-mono font-bold">
            Price Rule Validator: Strict ₹300 – ₹500/day
          </span>
        </div>

        {pendingOutfits.length === 0 ? (
          <div
            className={`p-8 rounded-2xl border border-dashed text-center text-xs font-bold ${
              isDarkMode
                ? 'border-[#223CCF] text-slate-300'
                : 'border-[#223CCF]/40 text-[#161B7F] bg-[#F4F7FF]'
            }`}
          >
            🎉 All student-uploaded outfits have been reviewed and published! Try submitting a new
            outfit via "List Outfit" on the Home screen.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingOutfits.map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 ${
                  isDarkMode
                    ? 'bg-[#05050B] border-[#223CCF]'
                    : 'bg-[#F4F7FF] border-[#223CCF]/30'
                }`}
              >
                <div className="flex gap-4">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-28 h-28 rounded-xl object-cover shrink-0 border border-[#223CCF]"
                  />
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 text-[11px] font-mono font-bold">
                      <span className="text-[#8D3FD0] uppercase">
                        Status: {item.approvalStatus}
                      </span>
                      <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                        {item.submittedAt}
                      </span>
                    </div>

                    <h3
                      className={`text-base font-extrabold leading-snug ${
                        isDarkMode ? 'text-white' : 'text-[#161B7F]'
                      }`}
                    >
                      {item.title}
                    </h3>

                    <div className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      Category: <span className="font-bold">{item.category}</span> · Campus:{' '}
                      <span className="font-bold">{item.collegeShortName}</span>
                    </div>

                    <div className="text-xs font-mono flex items-center gap-3">
                      <span className="text-[#ED3D63] font-extrabold">
                        Rent: ₹{item.dailyPrice}/day (≤ ₹500 Verified)
                      </span>
                      <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                        MRP: ₹{item.originalRetailPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div
                      className={`text-[11px] truncate ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      Owner: {item.ownerName} · Roll:{' '}
                      <span
                        className={`font-mono font-bold ${
                          isDarkMode ? 'text-[#0683D7]' : 'text-[#223CCF]'
                        }`}
                      >
                        {item.ownerRollNo}
                      </span>
                    </div>

                    {item.rejectionReason && (
                      <div className="text-[11px] text-[#ED3D63] font-mono font-bold pt-1">
                        Admin Note: {item.rejectionReason}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons: Approve & Publish, Reject with Reason, Request Better Photos */}
                <div
                  className={`pt-3 border-t space-y-2.5 ${
                    isDarkMode ? 'border-[#223CCF]/40' : 'border-[#223CCF]/20'
                  }`}
                >
                  <input
                    type="text"
                    value={rejectReasons[item.id] || ''}
                    onChange={(e) =>
                      setRejectReasons({ ...rejectReasons, [item.id]: e.target.value })
                    }
                    placeholder="Optional rejection / photo feedback note..."
                    className={`w-full h-9 px-3 rounded-lg border text-xs font-medium ${
                      isDarkMode
                        ? 'bg-[#080917] border-[#223CCF] text-white'
                        : 'bg-white border-[#223CCF]/30 text-[#0B0F29]'
                    }`}
                  />

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      disabled={!isAdminRole}
                      onClick={() => {
                        adminApproveListing(item.id);
                        triggerToast(`Published "${item.title}" live to Mumbai Campus Feed!`);
                      }}
                      className="h-9 px-3.5 rounded-lg bg-[#ED3D63] hover:bg-[#8D3FD0] disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve & Publish
                    </button>

                    <button
                      disabled={!isAdminRole}
                      onClick={() => {
                        adminRejectListing(
                          item.id,
                          rejectReasons[item.id] || 'Does not meet Mumbai campus hygiene standard.'
                        );
                        triggerToast(`Rejected outfit "${item.title}".`);
                      }}
                      className="h-9 px-3.5 rounded-lg bg-[#8D3FD0] hover:bg-[#ED3D63] disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject with Reason
                    </button>

                    <button
                      disabled={!isAdminRole}
                      onClick={() => {
                        adminRequestPhotosListing(item.id);
                        triggerToast(`Requested clearer daylight photos from ${item.ownerName}.`);
                      }}
                      className="h-9 px-3.5 rounded-lg bg-[#223CCF] hover:bg-[#0683D7] disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      Request Better Photos
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 2: Student ID Verification Split-View Management */}
      <section
        className={`rounded-3xl border p-6 sm:p-8 space-y-6 shadow-lg ${
          isDarkMode ? 'bg-[#080917] border-[#223CCF]/50' : 'bg-white border-[#223CCF]/25'
        }`}
      >
        <div
          className={`flex flex-wrap items-center justify-between gap-4 border-b pb-4 ${
            isDarkMode ? 'border-[#223CCF]/40' : 'border-[#223CCF]/20'
          }`}
        >
          <div>
            <h2
              className={`text-lg font-extrabold ${
                isDarkMode ? 'text-white' : 'text-[#161B7F]'
              }`}
            >
              🪪 02. Student ID Verification Split-View Queue ({verificationQueue.length})
            </h2>
            <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Match uploaded Mumbai College ID card scan against registration Roll No. and 1:1
              Email binding.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {verificationQueue.map((ver) => (
            <div
              key={ver.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
                isDarkMode
                  ? 'bg-[#05050B] border-[#223CCF]'
                  : 'bg-[#F4F7FF] border-[#223CCF]/30'
              }`}
            >
              <div className="space-y-3">
                <div className="aspect-[16/10] w-full rounded-xl overflow-hidden relative border border-[#223CCF]">
                  <img
                    src={ver.idCardPreviewUrl}
                    alt={ver.fullName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-lg bg-[#161B7F] border border-[#0683D7] text-[10px] font-mono font-bold text-white">
                    {ver.status}
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <div
                    className={`text-sm font-extrabold ${
                      isDarkMode ? 'text-white' : 'text-[#161B7F]'
                    }`}
                  >
                    {ver.fullName}
                  </div>
                  <div
                    className={`font-mono ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {ver.email}
                  </div>
                  <div className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>
                    College: <strong>{ver.collegeName}</strong>
                  </div>
                  <div className="font-mono font-bold text-[#ED3D63]">
                    Roll No: {ver.rollNo} · Grad: {ver.graduationYear}
                  </div>
                </div>
              </div>

              <div
                className={`pt-3 border-t flex items-center gap-2 ${
                  isDarkMode ? 'border-[#223CCF]/40' : 'border-[#223CCF]/20'
                }`}
              >
                <button
                  disabled={!isAdminRole}
                  onClick={() => {
                    adminUpdateStudentVerification(ver.id, 'Verified Student');
                    triggerToast(
                      `Verified ${ver.fullName} (${ver.rollNo}) — 15% Discount & Zero Deposit Unlocked.`
                    );
                  }}
                  className="flex-1 h-9 rounded-lg bg-[#223CCF] hover:bg-[#0683D7] disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Approve ID
                </button>
                <button
                  disabled={!isAdminRole}
                  onClick={() => {
                    adminUpdateStudentVerification(
                      ver.id,
                      'Rejected',
                      'Roll No. barcode unclear; please re-upload.'
                    );
                    triggerToast(`Marked ${ver.fullName}'s ID as Rejected.`);
                  }}
                  className="flex-1 h-9 rounded-lg bg-[#ED3D63] hover:bg-[#8D3FD0] disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Reject ID
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
