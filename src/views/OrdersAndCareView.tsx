import React, { useState } from 'react';
import { useRentVibeStore } from '../store/useRentVibeStore';
import { OrderTimelineStatus } from '../types/rentvibe';
import {
  Clock,
  Calendar,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  PackageCheck,
  RotateCcw,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

const TIMELINE_STEPS: OrderTimelineStatus[] = [
  'Approved',
  'Ready for Pickup',
  'Rented',
  'Returned'
];

export const OrdersAndCareView: React.FC = () => {
  const {
    isDarkMode,
    activeOrders,
    advanceOrderStatus,
    scheduleOrderReturnSlot,
    supportTickets,
    submitSupportTicket,
    setActiveTab
  } = useRentVibeStore();

  // Return Slot Scheduler state
  const [customSlotInput, setCustomSlotInput] = useState(
    'Tomorrow · 1:15 PM Lunch Break @ Campus Locker'
  );

  // Support / Damage Report Form state
  const [ticketOrderNo, setTicketOrderNo] = useState(
    activeOrders[0]?.orderNumber || 'RV-MUM-8492'
  );
  const [ticketIssueType, setTicketIssueType] = useState<
    | 'Damaged Item on Pickup'
    | 'Wrong Size / Fit Issue'
    | 'Minor Spill Protection Claim'
    | 'Late Return Grace Request'
  >('Late Return Grace Request');
  const [ticketDesc, setTicketDesc] = useState('');
  const [whatsAppToast, setWhatsAppToast] = useState<string | null>(null);
  const [ticketSuccessMsg, setTicketSuccessMsg] = useState<string | null>(null);

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketDesc.trim()) return;
    submitSupportTicket({
      orderNumber: ticketOrderNo,
      issueType: ticketIssueType,
      description: ticketDesc.trim()
    });
    setTicketDesc('');
    setTicketSuccessMsg(`Ticket submitted for Order #${ticketOrderNo}! Campus support will reach out in ~3 mins.`);
    setTimeout(() => setTicketSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div
        className={`flex flex-wrap items-center justify-between gap-4 border-b pb-4 ${
          isDarkMode ? 'border-[#223CCF]/50' : 'border-[#223CCF]/20'
        }`}
      >
        <div>
          <div
            className={`text-xs font-mono font-bold ${
              isDarkMode ? 'text-[#0683D7]' : 'text-[#8D3FD0]'
            }`}
          >
            📦 CAMPUS ORDERS & STUDENT CARE CONCIERGE
          </div>
          <h1
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-[#161B7F]'
            }`}
          >
            Active Orders, Return Countdown & Support
          </h1>
          <p className={`text-xs sm:text-sm mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Track ordered outfits with real-time return timers, schedule canteen locker drop slots, and report damage/size issues.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-[#ED3D63]/15 text-[#ED3D63] text-xs font-mono font-bold border border-[#ED3D63]/30">
            {activeOrders.length} Ordered Outfit(s)
          </span>
          <button
            onClick={() => setActiveTab('discover')}
            className={`h-10 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              isDarkMode
                ? 'bg-[#161B7F] text-white hover:bg-[#223CCF]'
                : 'bg-[#F0F4FF] text-[#161B7F] hover:bg-[#223CCF] hover:text-white border border-[#223CCF]/25'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ED3D63]" />
            Discover Outfits
          </button>
        </div>
      </div>

      {/* SECTION 1: ORDERED OUTFIT CARDS & LIVE RETURN COUNTDOWN TIMERS */}
      <section
        className={`rounded-3xl border p-6 sm:p-8 space-y-6 shadow-lg ${
          isDarkMode ? 'bg-[#080917] border-[#223CCF]/50' : 'bg-white border-[#223CCF]/25'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div
              className={`text-xs font-mono font-bold ${
                isDarkMode ? 'text-[#0683D7]' : 'text-[#8D3FD0]'
              }`}
            >
              ⏱️ REAL-TIME CAMPUS LOCKER LOGISTICS
            </div>
            <h2
              className={`text-xl font-extrabold ${
                isDarkMode ? 'text-white' : 'text-[#161B7F]'
              }`}
            >
              Ordered Outfits & Return Deadlines
            </h2>
          </div>
          <span className="text-xs font-mono font-medium text-slate-400">
            Click any status step below to simulate lifecycle changes
          </span>
        </div>

        {activeOrders.length === 0 ? (
          <div
            className={`p-10 text-center space-y-3 border border-dashed rounded-2xl ${
              isDarkMode ? 'border-[#223CCF]' : 'border-[#223CCF]/40 bg-[#F4F7FF]'
            }`}
          >
            <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#161B7F]'}`}>
              📦 No active orders yet.
            </p>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Check your rental bag to complete UPI checkout, or discover college fest outfits.
            </p>
            <button
              onClick={() => setActiveTab('cart')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ED3D63] to-[#8D3FD0] text-white font-bold text-xs cursor-pointer shadow-md"
            >
              Go to Bag & Checkout
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {activeOrders.map((ord) => {
              const currentStepIdx = TIMELINE_STEPS.indexOf(ord.status);
              return (
                <div
                  key={ord.id}
                  className={`p-5 sm:p-6 rounded-2xl border space-y-5 transition-all ${
                    isDarkMode
                      ? 'bg-[#05050B] border-[#223CCF]'
                      : 'bg-[#F4F7FF] border-[#223CCF]/30'
                  }`}
                >
                  <div
                    className={`flex flex-wrap items-center justify-between gap-4 border-b pb-4 ${
                      isDarkMode ? 'border-[#223CCF]/40' : 'border-[#223CCF]/20'
                    }`}
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span
                          className={`text-sm font-extrabold font-mono ${
                            isDarkMode ? 'text-[#0683D7]' : 'text-[#161B7F]'
                          }`}
                        >
                          Order #{ord.orderNumber}
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            isDarkMode ? 'text-slate-300' : 'text-slate-600'
                          }`}
                        >
                          · Paid via {ord.upiMethod}
                        </span>
                        <span className="text-xs font-mono text-[#ED3D63] font-extrabold">
                          · ₹{ord.finalAmountPaid}
                        </span>
                      </div>
                      <div
                        className={`text-xs mt-1 ${
                          isDarkMode ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        Pickup/Drop Hub: <strong className="text-[#ED3D63]">{ord.pickupHubName}</strong>
                      </div>
                    </div>

                    {/* Countdown Timer for Return Deadline */}
                    <div className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ED3D63] to-[#8D3FD0] text-right font-mono tabular-nums text-white shadow-md">
                      <div className="text-[10px] uppercase opacity-90 font-bold flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3" />
                        Return Deadline Countdown
                      </div>
                      <div className="text-sm font-extrabold mt-0.5">
                        {ord.status === 'Returned'
                          ? '✓ Returned & Deposit Cleared'
                          : '37h : 42m : 18s Remaining'}
                      </div>
                    </div>
                  </div>

                  {/* 4-Step Interactive Status Timeline */}
                  <div className="space-y-2">
                    <div
                      className={`flex items-center justify-between text-xs font-medium ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      <span>Order Lifecycle Timeline (Click stage to advance):</span>
                      <span className="font-mono font-bold text-[#ED3D63]">
                        Current Stage: {ord.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {TIMELINE_STEPS.map((step, idx) => {
                        const isDone = idx <= currentStepIdx;
                        return (
                          <button
                            key={step}
                            onClick={() => advanceOrderStatus(ord.id, step)}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              isDone
                                ? 'border-[#0683D7] bg-gradient-to-r from-[#223CCF] to-[#8D3FD0] text-white shadow-md'
                                : isDarkMode
                                ? 'border-[#223CCF] bg-[#161B7F]/40 text-slate-300 hover:bg-[#223CCF]'
                                : 'border-[#223CCF]/25 bg-white text-slate-600 hover:border-[#223CCF]'
                            }`}
                          >
                            <div className="text-[10px] font-mono opacity-85 font-bold">
                              STEP 0{idx + 1}
                            </div>
                            <div className="text-xs font-extrabold mt-0.5">{step}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Return Pickup / Drop-Off Slot Scheduler */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#ED3D63] shrink-0" />
                      <span>
                        Scheduled Return Drop:{' '}
                        <strong className={isDarkMode ? 'text-[#0683D7]' : 'text-[#223CCF]'}>
                          {ord.returnScheduledSlot || 'Not scheduled yet'}
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={customSlotInput}
                        onChange={(e) => setCustomSlotInput(e.target.value)}
                        className={`h-9 px-3 rounded-lg border text-xs font-medium ${
                          isDarkMode
                            ? 'bg-[#080917] border-[#223CCF] text-white'
                            : 'bg-white border-[#223CCF]/30 text-[#161B7F]'
                        }`}
                      />
                      <button
                        onClick={() => scheduleOrderReturnSlot(ord.id, customSlotInput)}
                        className="h-9 px-3.5 rounded-lg bg-[#8D3FD0] hover:bg-[#ED3D63] text-white font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors shadow-sm"
                      >
                        Update Drop Slot
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SECTION 2: REPORT DAMAGE, WRONG SIZE & MUMBAI STUDENT CARE CONCIERGE */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Damaged Item / Wrong Size Reporting Form */}
        <form
          onSubmit={handleSupportSubmit}
          className={`lg:col-span-7 rounded-3xl border p-6 sm:p-8 space-y-4 shadow-lg ${
            isDarkMode ? 'bg-[#080917] border-[#223CCF]/50' : 'bg-white border-[#223CCF]/25'
          }`}
        >
          <div>
            <div
              className={`text-xs font-mono font-bold ${
                isDarkMode ? 'text-[#0683D7]' : 'text-[#8D3FD0]'
              }`}
            >
              🛠️ REPORT DAMAGE & INSTANT SWAP
            </div>
            <h2
              className={`text-xl font-extrabold ${
                isDarkMode ? 'text-white' : 'text-[#161B7F]'
              }`}
            >
              Report Damaged Item, Wrong Size or Delayed Train
            </h2>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Report size mismatch within 2 hours of campus locker pickup for free backup size swaps, or claim spill protection.
            </p>
          </div>

          {ticketSuccessMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{ticketSuccessMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1">Select Order Number</label>
              <select
                value={ticketOrderNo}
                onChange={(e) => setTicketOrderNo(e.target.value)}
                className={`w-full h-10 px-3 rounded-xl border text-xs font-mono font-bold ${
                  isDarkMode
                    ? 'bg-[#05050B] border-[#223CCF] text-white'
                    : 'bg-[#F4F7FF] border-[#223CCF]/30 text-[#161B7F]'
                }`}
              >
                {activeOrders.map((o) => (
                  <option key={o.id} value={o.orderNumber}>
                    #{o.orderNumber} ({o.pickupHubName})
                  </option>
                ))}
                <option value="RV-MUM-8492">#RV-MUM-8492 (Sample Active Order)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Issue Category</label>
              <select
                value={ticketIssueType}
                onChange={(e) => setTicketIssueType(e.target.value as any)}
                className={`w-full h-10 px-3 rounded-xl border text-xs font-semibold ${
                  isDarkMode
                    ? 'bg-[#05050B] border-[#223CCF] text-white'
                    : 'bg-[#F4F7FF] border-[#223CCF]/30 text-[#161B7F]'
                }`}
              >
                <option value="Late Return Grace Request">Late Return Grace Request</option>
                <option value="Wrong Size / Fit Issue">Wrong Size / Fit Issue</option>
                <option value="Damaged Item on Pickup">Damaged Item on Pickup</option>
                <option value="Minor Spill Protection Claim">Minor Spill Protection Claim</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">
              Describe Issue (Locker details, missing hooks, chai/sweat stain, or train delay)
            </label>
            <textarea
              rows={3}
              required
              value={ticketDesc}
              onChange={(e) => setTicketDesc(e.target.value)}
              placeholder="e.g., Picked up outfit at Mithibai Gate 2, blouse hook needs quick safety pin, or requesting 1-hour train delay grace..."
              className={`w-full p-3 rounded-xl border text-xs font-medium ${
                isDarkMode
                  ? 'bg-[#05050B] border-[#223CCF] text-white'
                  : 'bg-[#F4F7FF] border-[#223CCF]/30 text-[#0B0F29]'
              }`}
            />
          </div>

          <button
            type="submit"
            className="h-10 px-6 rounded-xl bg-gradient-to-r from-[#ED3D63] to-[#8D3FD0] hover:opacity-95 text-white font-bold text-xs cursor-pointer transition-all shadow-md flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            Submit Damage / Support Ticket
          </button>

          {/* Ticket History */}
          <div
            className={`pt-3 border-t space-y-2 ${
              isDarkMode ? 'border-[#223CCF]/40' : 'border-[#223CCF]/20'
            }`}
          >
            <div className="text-xs font-bold flex items-center justify-between">
              <span>Your Support & Dispute Tickets ({supportTickets.length})</span>
              <span className="text-[11px] font-mono text-[#0683D7]">Live status</span>
            </div>
            {supportTickets.map((t) => (
              <div
                key={t.id}
                className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                  isDarkMode
                    ? 'bg-[#05050B] border-[#223CCF]'
                    : 'bg-[#F4F7FF] border-[#223CCF]/25'
                }`}
              >
                <div className="min-w-0">
                  <div
                    className={`font-mono font-bold ${
                      isDarkMode ? 'text-[#0683D7]' : 'text-[#161B7F]'
                    }`}
                  >
                    #{t.orderNumber} · {t.issueType}
                  </div>
                  <div
                    className={`truncate ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {t.description}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-[#ED3D63]/15 border border-[#ED3D63]/30 font-mono text-[11px] text-[#ED3D63] font-extrabold shrink-0">
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </form>

        {/* Student FAQ & WhatsApp Direct Concierge */}
        <div
          className={`lg:col-span-5 rounded-3xl border p-6 space-y-5 shadow-lg ${
            isDarkMode ? 'bg-[#080917] border-[#223CCF]/50' : 'bg-white border-[#223CCF]/25'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div
                className={`text-xs font-mono font-bold ${
                  isDarkMode ? 'text-[#0683D7]' : 'text-[#8D3FD0]'
                }`}
              >
                💬 INSTANT CONCIERGE
              </div>
              <h2
                className={`text-lg font-extrabold ${
                  isDarkMode ? 'text-white' : 'text-[#161B7F]'
                }`}
              >
                Mumbai Student FAQs
              </h2>
            </div>
            <button
              onClick={() =>
                setWhatsAppToast(
                  'Connected to RentVibe Mumbai Campus Desk (+91 98201-XXXXX) — Average reply: 3 mins'
                )
              }
              className="h-9 px-3.5 rounded-xl bg-gradient-to-r from-[#ED3D63] to-[#8D3FD0] hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp Desk
            </button>
          </div>

          {whatsAppToast && (
            <div className="p-3 rounded-xl bg-[#223CCF] text-white text-xs font-bold">
              {whatsAppToast}
            </div>
          )}

          <div className="space-y-3 text-xs">
            <div
              className={`p-4 rounded-2xl border ${
                isDarkMode
                  ? 'bg-[#05050B] border-[#223CCF]'
                  : 'bg-[#F4F7FF] border-[#223CCF]/25'
              }`}
            >
              <div className="font-extrabold text-[#ED3D63]">
                1. Haldi, sweat or canteen chai spills? ☕
              </div>
              <p
                className={`mt-1 leading-relaxed ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Never wash silk or mirror embroidery at home! Every rental includes complimentary eco dry-cleaning. Minor stains are 100% covered.
              </p>
            </div>

            <div
              className={`p-4 rounded-2xl border ${
                isDarkMode
                  ? 'bg-[#05050B] border-[#223CCF]'
                  : 'bg-[#F4F7FF] border-[#223CCF]/25'
              }`}
            >
              <div className="font-extrabold text-[#223CCF] dark:text-[#0683D7]">
                2. Delayed Mumbai local train or exam? 🚆
              </div>
              <p
                className={`mt-1 leading-relaxed ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Free 3-hour Local & Practical Exam grace period. Tap "Update Drop Slot" to adjust your locker handover time.
              </p>
            </div>

            <div
              className={`p-4 rounded-2xl border ${
                isDarkMode
                  ? 'bg-[#05050B] border-[#223CCF]'
                  : 'bg-[#F4F7FF] border-[#223CCF]/25'
              }`}
            >
              <div className="font-extrabold text-[#8D3FD0]">
                3. Size doesn’t fit at the college trial? 👗
              </div>
              <p
                className={`mt-1 leading-relaxed ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Select "Wrong Size / Fit Issue" above within 2 hours of collection for an instant backup size swap or full UPI refund.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
