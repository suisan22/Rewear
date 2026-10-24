import React, { useState } from 'react';
import { useRentVibeStore } from '../store/useRentVibeStore';
import { MUMBAI_COLLEGES } from '../data/mumbaiData';
import {
  ShoppingBag,
  Trash2,
  Tag,
  CheckCircle2,
  MapPin,
  Smartphone,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

const UPI_APPS: ('GPay' | 'PhonePe' | 'Paytm' | 'BHIM UPI')[] = [
  'GPay',
  'PhonePe',
  'Paytm',
  'BHIM UPI'
];

export const CartBagView: React.FC = () => {
  const {
    isDarkMode,
    cart,
    removeFromCart,
    updateCartItemPickup,
    promoCodeInput,
    setPromoCodeInput,
    appliedPromoCode,
    applyPromoCode,
    completeCheckout,
    currentUserVerification,
    selectedCollegeId,
    setActiveTab
  } = useRentVibeStore();

  const [selectedUpi, setSelectedUpi] = useState<'GPay' | 'PhonePe' | 'Paytm' | 'BHIM UPI'>('GPay');
  const [upiIdInput, setUpiIdInput] = useState('aarav.nair@okaxis');
  const [promoMsg, setPromoMsg] = useState<string | null>(null);
  const [checkoutSuccessOrderNo, setCheckoutSuccessOrderNo] = useState<string | null>(null);

  const isVerified = currentUserVerification.status === 'Verified Student';
  const activeHub =
    MUMBAI_COLLEGES.find((c) => c.id === selectedCollegeId)?.hubName ||
    MUMBAI_COLLEGES[0].hubName;

  // Cart Calculations
  const rawRentalSubtotal = cart.reduce(
    (sum, item) => sum + item.listing.dailyPrice * item.durationDays,
    0
  );
  const deliveryFeeTotal = cart.reduce(
    (sum, item) => sum + (item.pickupMode === 'Home Delivery (₹60)' ? 60 : 0),
    0
  );
  const verified15Discount = isVerified ? Math.round(rawRentalSubtotal * 0.15) : 0;
  const promo10Discount = appliedPromoCode ? Math.round(rawRentalSubtotal * 0.1) : 0;
  const totalDiscount = verified15Discount + promo10Discount;
  const securityDepositTotal = isVerified
    ? 0
    : cart.reduce((sum, item) => sum + item.listing.securityDeposit, 0);
  const grandTotal = Math.max(
    0,
    rawRentalSubtotal - totalDiscount + deliveryFeeTotal + securityDepositTotal
  );

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyPromoCode(promoCodeInput);
    setPromoMsg(res.message);
  };

  const handlePayNow = () => {
    const order = completeCheckout(selectedUpi, activeHub);
    if (order) {
      setCheckoutSuccessOrderNo(order.orderNumber);
    }
  };

  return (
    <div className="space-y-8">
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
            🛍️ YOUR RENTAL BAG & BILLING CHECKOUT
          </div>
          <h1
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-[#161B7F]'
            }`}
          >
            Student Rental Bag & Instant UPI Billing
          </h1>
          <p className={`text-xs sm:text-sm mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Review items, select campus pickup vs local rider, apply student promo codes, and pay with zero platform fees.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('discover')}
          className={`h-10 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            isDarkMode
              ? 'bg-[#161B7F] text-white hover:bg-[#223CCF]'
              : 'bg-[#F0F4FF] text-[#161B7F] hover:bg-[#223CCF] hover:text-white border border-[#223CCF]/25'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#ED3D63]" />
          Browse More Outfits
        </button>
      </div>

      {checkoutSuccessOrderNo && (
        <div className="p-5 rounded-2xl border border-[#0683D7] bg-gradient-to-r from-[#223CCF] to-[#8D3FD0] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 shrink-0 text-white" />
            <div className="text-xs sm:text-sm">
              <span className="font-extrabold text-base block sm:inline mr-2">
                🎉 Order {checkoutSuccessOrderNo} Confirmed!
              </span>
              UPI payment verified via {selectedUpi}. Your outfit is being prepared for pickup at{' '}
              <strong className="underline">{activeHub}</strong>.
            </div>
          </div>
          <button
            onClick={() => setActiveTab('orders')}
            className="px-4 py-2 rounded-xl bg-white text-[#161B7F] hover:bg-slate-100 font-extrabold text-xs whitespace-nowrap cursor-pointer shadow-md transition-all self-start sm:self-auto"
          >
            Track in Orders & Care →
          </button>
        </div>
      )}

      {/* Grid: Left = Itemized Bag; Right = Billing & UPI Checkout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Itemized Rental Bag */}
        <div
          className={`lg:col-span-7 rounded-3xl border p-6 space-y-5 shadow-lg ${
            isDarkMode ? 'bg-[#080917] border-[#223CCF]/50' : 'bg-white border-[#223CCF]/25'
          }`}
        >
          <div className="flex items-center justify-between">
            <h2
              className={`text-lg font-extrabold flex items-center gap-2 ${
                isDarkMode ? 'text-white' : 'text-[#161B7F]'
              }`}
            >
              <ShoppingBag className="w-5 h-5 text-[#ED3D63]" />
              01. Bag Items ({cart.length})
            </h2>
            <span
              className={`text-xs font-mono font-bold ${
                isDarkMode ? 'text-[#0683D7]' : 'text-[#8D3FD0]'
              }`}
            >
              {isVerified ? '🪪 15% Student Discount Active' : 'Standard Rates'}
            </span>
          </div>

          {cart.length === 0 ? (
            <div
              className={`p-10 text-center space-y-3 border border-dashed rounded-2xl ${
                isDarkMode ? 'border-[#223CCF]' : 'border-[#223CCF]/40 bg-[#F4F7FF]'
              }`}
            >
              <p
                className={`text-sm font-bold ${
                  isDarkMode ? 'text-white' : 'text-[#161B7F]'
                }`}
              >
                🛍️ Your rental bag is currently empty.
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Explore Navratri Chaniya Choli, Onam Kasavu, Marathi Nauvari, Tuxedos or Farewell outfits below ₹500/day.
              </p>
              <button
                onClick={() => setActiveTab('discover')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ED3D63] to-[#8D3FD0] text-white font-bold text-xs cursor-pointer shadow-md transition-all hover:scale-105"
              >
                ✨ Explore Campus Feed
              </button>
            </div>
          ) : (
            <div
              className={`divide-y ${
                isDarkMode ? 'divide-[#223CCF]/40' : 'divide-[#223CCF]/20'
              }`}
            >
              {cart.map((item) => (
                <div key={item.listing.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  <img
                    src={item.listing.imageUrl}
                    alt={item.listing.title}
                    referrerPolicy="no-referrer"
                    className="w-24 h-24 rounded-xl object-cover shrink-0 border border-[#223CCF]"
                  />
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={`text-sm font-extrabold truncate ${
                          isDarkMode ? 'text-white' : 'text-[#161B7F]'
                        }`}
                      >
                        {item.listing.title}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.listing.id)}
                        className="text-slate-400 hover:text-[#ED3D63] p-1 cursor-pointer transition-colors"
                        title="Remove outfit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div
                      className={`text-xs font-mono font-medium ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      📏 Size: <strong className="text-[#ED3D63]">{item.selectedSize}</strong> · ⏳ Duration: {item.durationDays} Days · 📅 From: {item.startDate}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      {/* Pickup Mode Toggle per item */}
                      <div className="flex items-center gap-1.5">
                        {(['Campus Hub (Free)', 'Home Delivery (₹60)'] as const).map((mode) => (
                          <button
                            key={mode}
                            onClick={() => updateCartItemPickup(item.listing.id, mode)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                              item.pickupMode === mode
                                ? 'border-[#ED3D63] bg-[#ED3D63] text-white shadow-xs'
                                : isDarkMode
                                ? 'border-[#223CCF] bg-[#161B7F]/50 text-slate-200 hover:bg-[#223CCF]'
                                : 'border-[#223CCF]/30 bg-[#F0F4FF] text-[#161B7F] hover:bg-[#223CCF] hover:text-white'
                            }`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>

                      <div className="text-right font-mono tabular-nums">
                        <span
                          className={`text-xs ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-600'
                          }`}
                        >
                          ₹{item.listing.dailyPrice} × {item.durationDays}d ={' '}
                        </span>
                        <span className="text-sm font-extrabold text-[#ED3D63]">
                          ₹{item.listing.dailyPrice * item.durationDays}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Student Promo Code Applier */}
          <form
            onSubmit={handleApplyPromo}
            className={`p-4 rounded-2xl border space-y-2 ${
              isDarkMode
                ? 'bg-[#05050B] border-[#223CCF]'
                : 'bg-[#F4F7FF] border-[#223CCF]/30'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span
                className={`font-bold flex items-center gap-1.5 ${
                  isDarkMode ? 'text-white' : 'text-[#161B7F]'
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-[#ED3D63]" />
                🎟️ Mumbai Student Promo Code
              </span>
              <span
                className={`font-mono text-[11px] font-bold ${
                  isDarkMode ? 'text-[#0683D7]' : 'text-[#8D3FD0]'
                }`}
              >
                Active: {appliedPromoCode || 'None (Try MUMBAI_STUDENT10)'}
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value)}
                placeholder="Enter MUMBAI_STUDENT10"
                className={`flex-1 h-10 px-3.5 rounded-xl border text-xs font-mono uppercase font-bold ${
                  isDarkMode
                    ? 'bg-[#080917] border-[#223CCF] text-white'
                    : 'bg-white border-[#223CCF]/30 text-[#161B7F]'
                }`}
              />
              <button
                type="submit"
                className="h-10 px-4 rounded-xl bg-[#8D3FD0] hover:bg-[#ED3D63] text-xs font-bold text-white cursor-pointer transition-colors shadow-sm"
              >
                Apply Code
              </button>
            </div>
            {promoMsg && <div className="text-[11px] font-bold text-[#ED3D63]">{promoMsg}</div>}
          </form>
        </div>

        {/* Right 5 Cols: Billing Breakdown & Instant UPI Payment Gateway */}
        <div
          className={`lg:col-span-5 rounded-3xl border p-6 space-y-5 shadow-lg ${
            isDarkMode ? 'bg-[#080917] border-[#223CCF]/50' : 'bg-white border-[#223CCF]/25'
          }`}
        >
          <h2
            className={`text-lg font-extrabold ${
              isDarkMode ? 'text-white' : 'text-[#161B7F]'
            }`}
          >
            💳 02. Billing Breakdown & UPI Checkout
          </h2>

          <div
            className={`space-y-2.5 text-xs font-mono tabular-nums border-b pb-4 ${
              isDarkMode ? 'border-[#223CCF]/50' : 'border-[#223CCF]/20'
            }`}
          >
            <div className="flex justify-between">
              <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                Rental Subtotal
              </span>
              <span className="font-bold">₹{rawRentalSubtotal}</span>
            </div>
            <div
              className={`flex justify-between font-bold ${
                isDarkMode ? 'text-[#0683D7]' : 'text-[#223CCF]'
              }`}
            >
              <span>
                Verified Student 15% Off ({isVerified ? 'Active' : 'Verify ID to unlock'})
              </span>
              <span>-₹{verified15Discount}</span>
            </div>
            <div className="flex justify-between font-bold text-[#8D3FD0]">
              <span>Promo Code ({appliedPromoCode || 'None'})</span>
              <span>-₹{promo10Discount}</span>
            </div>
            <div className="flex justify-between">
              <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                Security Deposit ({isVerified ? 'Waived for Verified ID' : 'Refundable'})
              </span>
              <span className="font-bold">₹{securityDepositTotal}</span>
            </div>
            <div className="flex justify-between">
              <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                Campus Canteen / Delivery Fee
              </span>
              <span className="font-bold">
                {deliveryFeeTotal === 0 ? '₹0 (Free Campus Hub)' : `₹${deliveryFeeTotal}`}
              </span>
            </div>
            <div
              className={`pt-2 border-t flex justify-between text-base font-extrabold text-[#ED3D63] ${
                isDarkMode ? 'border-[#223CCF]/50' : 'border-[#223CCF]/20'
              }`}
            >
              <span>Total Payable</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>

          {/* Selected Campus Pickup Hub Display */}
          <div
            className={`p-3.5 rounded-xl border text-xs space-y-1 ${
              isDarkMode
                ? 'bg-[#05050B] border-[#223CCF]'
                : 'bg-[#F4F7FF] border-[#223CCF]/30'
            }`}
          >
            <div
              className={`text-[11px] font-mono font-bold flex items-center gap-1.5 ${
                isDarkMode ? 'text-[#0683D7]' : 'text-[#223CCF]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#ED3D63]" />
              📍 DESIGNATED EXCHANGE POINT
            </div>
            <div className="font-bold">{activeHub}</div>
            <div className={`text-[11px] ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Show your Digital Student Pass QR at the canteen counter to collect your sealed
              garment bag.
            </div>
          </div>

          {/* UPI Payment Selector (GPay / PhonePe / Paytm / BHIM) */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold">
              📱 Select Instant UPI App (Zero MDR Student Gateway)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {UPI_APPS.map((app) => (
                <button
                  type="button"
                  key={app}
                  onClick={() => setSelectedUpi(app)}
                  className={`h-10 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    selectedUpi === app
                      ? 'bg-[#223CCF] text-white border-[#0683D7] shadow-md'
                      : isDarkMode
                      ? 'bg-[#161B7F]/60 border-[#223CCF] text-white hover:bg-[#8D3FD0]'
                      : 'bg-[#F0F4FF] border-[#223CCF]/30 text-[#161B7F] hover:bg-[#223CCF] hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  {app}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={upiIdInput}
              onChange={(e) => setUpiIdInput(e.target.value)}
              placeholder="yourname@okicici"
              className={`w-full h-10 px-3.5 rounded-xl border text-xs font-mono font-semibold ${
                isDarkMode
                  ? 'bg-[#05050B] border-[#223CCF] text-white'
                  : 'bg-[#F4F7FF] border-[#223CCF]/30 text-[#161B7F]'
              }`}
            />
          </div>

          <button
            disabled={cart.length === 0}
            onClick={handlePayNow}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-[#ED3D63] via-[#8D3FD0] to-[#223CCF] hover:opacity-95 disabled:opacity-40 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#ED3D63]/30"
          >
            ⚡ Pay ₹{grandTotal} via {selectedUpi} & Reserve Outfit
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
