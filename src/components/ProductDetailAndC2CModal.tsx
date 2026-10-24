import React, { useState } from 'react';
import { useRentVibeStore } from '../store/useRentVibeStore';
import { MUMBAI_COLLEGES } from '../data/mumbaiData';
import {
  OutfitCategory,
  RentalDuration,
  SizeOption,
  GenderFilter
} from '../types/rentvibe';
import {
  X,
  ShieldCheck,
  MapPin,
  Sparkles,
  Check,
  Upload,
  AlertCircle,
  Ruler,
  Calendar
} from 'lucide-react';
import navratriImg from '../assets/images/outfit_navratri_chaniya_choli_1791730392542.jpg';
import onamImg from '../assets/images/outfit_onam_kasavu_saree_1791730404319.jpg';
import marathiImg from '../assets/images/outfit_marathi_nauvari_pheta_1791730416395.jpg';
import fashionShowImg from '../assets/images/outfit_fashion_show_avantgarde_1791730435972.jpg';

const SAMPLE_PHOTOS = [
  { label: 'Crimson Navratri Chaniya Choli', url: navratriImg },
  { label: 'Kerala Onam Kasavu Saree', url: onamImg },
  { label: 'Emerald Marathi Nauvari & Pheta', url: marathiImg },
  { label: 'Runway Metallic Statement Set', url: fashionShowImg }
];

export const ProductDetailAndC2CModal: React.FC = () => {
  const {
    isDarkMode,
    selectedProductForDetail,
    setSelectedProductForDetail,
    isListWardrobeOpen,
    setIsListWardrobeOpen,
    addToCart,
    currentUserVerification,
    submitNewOutfitListing,
    setActiveTab
  } = useRentVibeStore();

  // PDP Local State
  const [selectedSize, setSelectedSize] = useState<SizeOption>('M');
  const [durationDays, setDurationDays] = useState<RentalDuration>(3);
  const [startDate, setStartDate] = useState('2026-10-16');
  const [pickupMode, setPickupMode] = useState<'Campus Hub (Free)' | 'Home Delivery (₹60)'>(
    'Campus Hub (Free)'
  );
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // C2C Form State
  const [c2cTitle, setC2cTitle] = useState('');
  const [c2cCategory, setC2cCategory] = useState<Exclude<OutfitCategory, 'All'>>(
    'Gujarati / Navratri'
  );
  const [c2cDailyPrice, setC2cDailyPrice] = useState<number>(380);
  const [c2cRetailPrice, setC2cRetailPrice] = useState<number>(6500);
  const [c2cCollegeId, setC2cCollegeId] = useState<string>('mithibai');
  const [c2cGender, setC2cGender] = useState<Exclude<GenderFilter, 'All'>>('Women');
  const [c2cSizes, setC2cSizes] = useState<SizeOption[]>(['S', 'M']);
  const [c2cFabric, setC2cFabric] = useState('Pure Handloom Silk with Mirror Embroidery');
  const [c2cCanteenSpot, setC2cCanteenSpot] = useState('Mithibai Gate 2 · Anand Stall Locker');
  const [c2cPhotoUrl, setC2cPhotoUrl] = useState<string>(navratriImg);
  const [c2cError, setC2cError] = useState<string | null>(null);
  const [c2cSubmittedSuccess, setC2cSubmittedSuccess] = useState(false);

  const handleSizeToggle = (sz: SizeOption) => {
    if (c2cSizes.includes(sz)) {
      if (c2cSizes.length > 1) setC2cSizes(c2cSizes.filter((s) => s !== sz));
    } else {
      setC2cSizes([...c2cSizes, sz]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setC2cPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleC2CSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!c2cTitle.trim()) {
      setC2cError('Please enter a descriptive outfit title.');
      return;
    }
    if (c2cDailyPrice < 300 || c2cDailyPrice > 500) {
      setC2cError('Strict Mumbai Student Price Lock: Daily rent must be between ₹300 and ₹500.');
      return;
    }

    const col = MUMBAI_COLLEGES.find((c) => c.id === c2cCollegeId) || MUMBAI_COLLEGES[0];

    submitNewOutfitListing({
      title: c2cTitle.trim(),
      category: c2cCategory,
      dailyPrice: c2cDailyPrice,
      originalRetailPrice: c2cRetailPrice,
      securityDeposit: 450,
      sizes: c2cSizes,
      gender: c2cGender,
      collegeId: col.id,
      collegeShortName: col.shortName,
      zone: col.zone,
      distanceKm: 0.6,
      ownerName: `${currentUserVerification.email} (${currentUserVerification.fullName})`,
      ownerRollNo: currentUserVerification.rollNo,
      ownerVerified: currentUserVerification.status === 'Verified Student',
      hygieneVerified: true,
      lastSanitizedDate: 'Freshly Dry-Cleaned & Verified',
      canteenPickupSpot: c2cCanteenSpot || col.hubName,
      imageUrl: c2cPhotoUrl,
      secondaryAngleLabel: 'Student Peer Closet Verified Upload',
      fabricDetails: c2cFabric,
      fitNotes: 'Standard student adjustable fit; dry-clean tag attached.',
      includedItems: [c2cTitle.trim(), 'Breathable Garment Cover']
    });

    setC2cTitle('');
    setC2cError(null);
    setC2cSubmittedSuccess(true);
    setTimeout(() => setC2cSubmittedSuccess(false), 3000);
  };

  // Render PDP Modal if a product is selected
  if (selectedProductForDetail) {
    const p = selectedProductForDetail;
    const isVerifiedStudent = currentUserVerification.status === 'Verified Student';
    const baseRent = p.dailyPrice * durationDays;
    const studentDiscount = isVerifiedStudent ? Math.round(baseRent * 0.15) : 0;
    const effectiveDeposit = isVerifiedStudent ? 0 : p.securityDeposit;
    const deliveryFee = pickupMode === 'Home Delivery (₹60)' ? 60 : 0;
    const netPayable = baseRent - studentDiscount + effectiveDeposit + deliveryFee;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <div
          className={`relative w-full max-w-4xl rounded-3xl border overflow-hidden my-8 shadow-2xl ${
            isDarkMode
              ? 'bg-[#080917] border-[#223CCF] text-white'
              : 'bg-white border-[#223CCF]/30 text-[#0B0F29]'
          }`}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedProductForDetail(null)}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[#ED3D63] text-white flex items-center justify-center hover:bg-[#8D3FD0] transition-colors cursor-pointer shadow-lg"
            aria-label="Close product details"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Contiguous Split Purchase Module */}
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Gallery & Hygiene Details */}
            <div
              className={`lg:col-span-6 flex flex-col justify-between ${
                isDarkMode ? 'bg-[#05050B]' : 'bg-[#F4F7FF]'
              }`}
            >
              <div className="aspect-[4/3] w-full relative overflow-hidden">
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-[#05050B]/90 border border-[#0683D7]/60 backdrop-blur-md text-xs text-white flex items-center justify-between">
                  <span>📸 {p.secondaryAngleLabel}</span>
                  <span className="font-mono text-[#0683D7] font-bold shrink-0 ml-2">
                    ★ {p.rating}
                  </span>
                </div>
              </div>

              <div
                className={`p-6 space-y-4 border-t ${
                  isDarkMode
                    ? 'text-slate-200 border-[#223CCF]/40'
                    : 'text-slate-700 border-[#223CCF]/20'
                }`}
              >
                <div
                  className={`flex items-center gap-2 text-xs font-bold ${
                    isDarkMode ? 'text-[#0683D7]' : 'text-[#223CCF]'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 shrink-0 text-[#ED3D63]" />
                  <span>✨ Hygiene Verified: {p.lastSanitizedDate} · Dry-Cleaned & Sanitized</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="font-bold text-[#8D3FD0]">🧵 Fabric & Craft:</span>{' '}
                    {p.fabricDetails}
                  </div>
                  <div>
                    <span className="font-bold text-[#8D3FD0]">📏 Fit & Margin Notes:</span>{' '}
                    {p.fitNotes}
                  </div>
                  <div>
                    <span className="font-bold text-[#8D3FD0]">🎓 Peer Owner:</span> {p.ownerName} ·
                    Roll No.{' '}
                    <span
                      className={`font-mono font-bold ${
                        isDarkMode ? 'text-[#0683D7]' : 'text-[#223CCF]'
                      }`}
                    >
                      {p.ownerRollNo}
                    </span>
                  </div>
                </div>

                <div
                  className={`pt-3 border-t ${
                    isDarkMode ? 'border-[#223CCF]/40' : 'border-[#223CCF]/20'
                  }`}
                >
                  <div
                    className={`text-[11px] font-mono font-bold mb-1.5 ${
                      isDarkMode ? 'text-[#0683D7]' : 'text-[#161B7F]'
                    }`}
                  >
                    🛍️ INCLUDED IN RENTAL BAG:
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-medium">
                    {p.includedItems.map((inc, idx) => (
                      <span
                        key={idx}
                        className={`px-2.5 py-1 rounded-lg border ${
                          isDarkMode
                            ? 'bg-[#161B7F]/50 border-[#223CCF] text-white'
                            : 'bg-white border-[#223CCF]/30 text-[#161B7F]'
                        }`}
                      >
                        ✓ {inc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Contiguous Purchase Module */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div
                  className={`text-xs font-mono font-bold ${
                    isDarkMode ? 'text-[#0683D7]' : 'text-[#8D3FD0]'
                  }`}
                >
                  👗 {p.category} · 🎓 {p.collegeShortName} · 🔥 {p.rentalsCompleted} Campus Rentals
                </div>
                <h2
                  className={`text-2xl font-extrabold leading-snug ${
                    isDarkMode ? 'text-white' : 'text-[#161B7F]'
                  }`}
                >
                  {p.title}
                </h2>

                {/* Price Breakdown Header */}
                <div
                  className={`p-4 rounded-2xl border flex items-center justify-between ${
                    isDarkMode
                      ? 'bg-[#05050B] border-[#223CCF]'
                      : 'bg-[#F4F7FF] border-[#223CCF]/30'
                  }`}
                >
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold font-mono tabular-nums text-[#ED3D63]">
                        ₹{p.dailyPrice}
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-600'
                        }`}
                      >
                        / day · Retail ₹{p.originalRetailPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div
                      className={`text-xs mt-1 font-bold ${
                        isDarkMode ? 'text-[#0683D7]' : 'text-[#223CCF]'
                      }`}
                    >
                      {isVerifiedStudent
                        ? '🪪 Verified Student: 15% Off + ₹0 Security Deposit Applied'
                        : `Standard Refundable Deposit: ₹${p.securityDeposit}`}
                    </div>
                  </div>
                  <div className="text-right font-mono tabular-nums">
                    <div
                      className={`text-xs font-bold ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      Net Payable
                    </div>
                    <div
                      className={`text-xl font-extrabold ${
                        isDarkMode ? 'text-[#0683D7]' : 'text-[#161B7F]'
                      }`}
                    >
                      ₹{netPayable}
                    </div>
                  </div>
                </div>

                {/* Size Selector & Size Guide Toggle */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold">📏 Select Size</span>
                    <button
                      onClick={() => setShowSizeGuide(!showSizeGuide)}
                      className={`font-bold hover:underline flex items-center gap-1 cursor-pointer ${
                        isDarkMode ? 'text-[#0683D7]' : 'text-[#223CCF]'
                      }`}
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      {showSizeGuide ? 'Hide Size Guide' : 'Indian Fest Size Guide'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {p.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`h-10 px-4 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                          selectedSize === sz
                            ? 'bg-gradient-to-r from-[#ED3D63] to-[#8D3FD0] text-white border-[#ED3D63] shadow-md scale-105'
                            : isDarkMode
                            ? 'bg-[#161B7F]/60 border-[#223CCF] text-white hover:bg-[#223CCF]'
                            : 'bg-[#F0F4FF] border-[#223CCF]/30 text-[#161B7F] hover:bg-[#223CCF] hover:text-white'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                  {showSizeGuide && (
                    <div
                      className={`p-3 rounded-xl border text-xs font-mono space-y-1 ${
                        isDarkMode
                          ? 'bg-[#05050B] border-[#223CCF] text-slate-200'
                          : 'bg-[#F4F7FF] border-[#223CCF]/30 text-[#161B7F]'
                      }`}
                    >
                      <div>XS: Chest 32-34" · Waist 26-28"</div>
                      <div>S: Chest 35-36" · Waist 28-30"</div>
                      <div>M: Chest 38-40" · Waist 31-33"</div>
                      <div>L: Chest 41-43" · Waist 34-36"</div>
                      <div>Free Size: Pre-pleated Saree / Drawstring Lehenga (Fits XS–XL)</div>
                    </div>
                  )}
                </div>

                {/* Duration & Pickup Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1.5">⏳ Rental Duration</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {([1, 3, 5] as RentalDuration[]).map((d) => (
                        <button
                          key={d}
                          onClick={() => setDurationDays(d)}
                          className={`h-10 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                            durationDays === d
                              ? 'bg-[#223CCF] text-white border-[#0683D7] shadow-md'
                              : isDarkMode
                              ? 'bg-[#161B7F]/60 border-[#223CCF] text-white hover:bg-[#8D3FD0]'
                              : 'bg-[#F0F4FF] border-[#223CCF]/30 text-[#161B7F] hover:bg-[#223CCF] hover:text-white'
                          }`}
                        >
                          {d}d
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1.5">📅 Fest / Event Start Date</label>
                    <div className="relative">
                      <Calendar className="w-3.5 h-3.5 text-[#ED3D63] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className={`w-full h-10 pl-9 pr-3 rounded-xl border text-xs font-mono font-semibold ${
                          isDarkMode
                            ? 'bg-[#05050B] border-[#223CCF] text-white'
                            : 'bg-[#F4F7FF] border-[#223CCF]/30 text-[#161B7F]'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Canteen Pickup vs Home Delivery */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold">
                    📍 Campus Canteen Pickup Estimator
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => setPickupMode('Campus Hub (Free)')}
                      className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        pickupMode === 'Campus Hub (Free)'
                          ? 'border-[#ED3D63] bg-gradient-to-r from-[#ED3D63]/20 to-[#8D3FD0]/20 font-bold'
                          : isDarkMode
                          ? 'border-[#223CCF] bg-[#05050B] text-slate-300'
                          : 'border-[#223CCF]/25 bg-[#F4F7FF] text-slate-700'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>🏫 Campus Hub Pickup</span>
                        <span className="font-mono text-[#0683D7] font-extrabold">FREE</span>
                      </div>
                      <div
                        className={`text-[11px] truncate mt-0.5 ${
                          isDarkMode ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        {p.canteenPickupSpot}
                      </div>
                    </button>

                    <button
                      onClick={() => setPickupMode('Home Delivery (₹60)')}
                      className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        pickupMode === 'Home Delivery (₹60)'
                          ? 'border-[#ED3D63] bg-gradient-to-r from-[#ED3D63]/20 to-[#8D3FD0]/20 font-bold'
                          : isDarkMode
                          ? 'border-[#223CCF] bg-[#05050B] text-slate-300'
                          : 'border-[#223CCF]/25 bg-[#F4F7FF] text-slate-700'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>🛵 Mumbai Local Rider</span>
                        <span className="font-mono text-[#ED3D63] font-extrabold">₹60</span>
                      </div>
                      <div
                        className={`text-[11px] mt-0.5 ${
                          isDarkMode ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        Same-day WeFast / Dunzo delivery
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Primary CTA */}
              <div
                className={`pt-4 border-t flex items-center gap-3 ${
                  isDarkMode ? 'border-[#223CCF]/40' : 'border-[#223CCF]/20'
                }`}
              >
                <button
                  onClick={() => {
                    addToCart({
                      listing: p,
                      selectedSize,
                      durationDays,
                      startDate,
                      pickupMode
                    });
                    setSelectedProductForDetail(null);
                    setActiveTab('cart');
                  }}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#ED3D63] via-[#8D3FD0] to-[#223CCF] hover:opacity-95 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#ED3D63]/30"
                >
                  <Check className="w-4 h-4" />
                  🛍️ Add to Rental Bag · ₹{netPayable} ({durationDays} Days)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render C2C "List Your Wardrobe" Modal if open
  if (isListWardrobeOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <div
          className={`relative w-full max-w-2xl rounded-3xl border p-6 sm:p-8 my-8 shadow-2xl ${
            isDarkMode
              ? 'bg-[#080917] border-[#223CCF] text-white'
              : 'bg-white border-[#223CCF]/30 text-[#0B0F29]'
          }`}
        >
          <button
            onClick={() => setIsListWardrobeOpen(false)}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#ED3D63] text-white flex items-center justify-center hover:bg-[#8D3FD0] cursor-pointer shadow-md"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="space-y-1 mb-6">
            <div
              className={`text-xs font-mono font-bold ${
                isDarkMode ? 'text-[#0683D7]' : 'text-[#8D3FD0]'
              }`}
            >
              💸 PEER-TO-PEER STUDENT WARDROBE MONETIZATION
            </div>
            <h2
              className={`text-2xl font-extrabold ${
                isDarkMode ? 'text-white' : 'text-[#161B7F]'
              }`}
            >
              👗 List Your Outfit for Mumbai College Peers
            </h2>
            <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Submitted outfits go directly into the Admin Approval Queue before publishing live on
              the campus feed. Daily price is locked between ₹300 and ₹500.
            </p>
          </div>

          <form onSubmit={handleC2CSubmit} className="space-y-4">
            {c2cError && (
              <div className="p-3 rounded-xl bg-[#ED3D63]/15 border border-[#ED3D63] text-[#ED3D63] text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{c2cError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold mb-1">
                ✨ Outfit Title (Include Fest / Style Name)
              </label>
              <input
                type="text"
                required
                value={c2cTitle}
                onChange={(e) => setC2cTitle(e.target.value)}
                placeholder="e.g., Bandhani Mirror-Work Garba Chaniya Choli Set"
                className={`w-full h-11 px-3.5 rounded-xl border text-xs font-medium ${
                  isDarkMode
                    ? 'bg-[#05050B] border-[#223CCF] text-white'
                    : 'bg-[#F4F7FF] border-[#223CCF]/30 text-[#0B0F29]'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">🎭 Fest Category</label>
                <select
                  value={c2cCategory}
                  onChange={(e) =>
                    setC2cCategory(e.target.value as Exclude<OutfitCategory, 'All'>)
                  }
                  className={`w-full h-11 px-3 rounded-xl border text-xs font-semibold ${
                    isDarkMode
                      ? 'bg-[#05050B] border-[#223CCF] text-white'
                      : 'bg-[#F4F7FF] border-[#223CCF]/30 text-[#161B7F]'
                  }`}
                >
                  <option value="Gujarati / Navratri">Gujarati / Navratri</option>
                  <option value="South Indian / Onam">South Indian / Onam</option>
                  <option value="Marathi Traditional">Marathi Traditional</option>
                  <option value="College Fests & Western">College Fests & Western</option>
                  <option value="Farewell Special">Farewell Special</option>
                  <option value="Fashion Show & Statement Accessories">
                    Fashion Show & Statement
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">
                  🏷️ Daily Rent (₹300–₹500 Cap)
                </label>
                <input
                  type="number"
                  min={300}
                  max={500}
                  required
                  value={c2cDailyPrice}
                  onChange={(e) => setC2cDailyPrice(Number(e.target.value))}
                  className={`w-full h-11 px-3.5 rounded-xl border text-xs font-mono font-bold ${
                    isDarkMode
                      ? 'bg-[#05050B] border-[#223CCF] text-[#ED3D63]'
                      : 'bg-[#F4F7FF] border-[#223CCF]/30 text-[#ED3D63]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">💎 Original Retail MRP (₹)</label>
                <input
                  type="number"
                  min={1500}
                  max={50000}
                  value={c2cRetailPrice}
                  onChange={(e) => setC2cRetailPrice(Number(e.target.value))}
                  className={`w-full h-11 px-3.5 rounded-xl border text-xs font-mono font-semibold ${
                    isDarkMode
                      ? 'bg-[#05050B] border-[#223CCF] text-white'
                      : 'bg-[#F4F7FF] border-[#223CCF]/30 text-[#161B7F]'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">🎓 Your Mumbai Campus Hub</label>
                <select
                  value={c2cCollegeId}
                  onChange={(e) => {
                    setC2cCollegeId(e.target.value);
                    const found = MUMBAI_COLLEGES.find((c) => c.id === e.target.value);
                    if (found) setC2cCanteenSpot(found.hubName);
                  }}
                  className={`w-full h-11 px-3 rounded-xl border text-xs font-semibold ${
                    isDarkMode
                      ? 'bg-[#05050B] border-[#223CCF] text-white'
                      : 'bg-[#F4F7FF] border-[#223CCF]/30 text-[#161B7F]'
                  }`}
                >
                  {MUMBAI_COLLEGES.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.shortName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">
                  📍 Exact Canteen / Gate Exchange Spot
                </label>
                <input
                  type="text"
                  value={c2cCanteenSpot}
                  onChange={(e) => setC2cCanteenSpot(e.target.value)}
                  className={`w-full h-11 px-3.5 rounded-xl border text-xs font-medium ${
                    isDarkMode
                      ? 'bg-[#05050B] border-[#223CCF] text-white'
                      : 'bg-[#F4F7FF] border-[#223CCF]/30 text-[#0B0F29]'
                  }`}
                />
              </div>
            </div>

            {/* Sizes & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">📏 Supported Sizes</label>
                <div className="flex flex-wrap gap-1.5">
                  {(['XS', 'S', 'M', 'L', 'XL', 'Free Size'] as SizeOption[]).map((sz) => (
                    <button
                      type="button"
                      key={sz}
                      onClick={() => handleSizeToggle(sz)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold cursor-pointer transition-all ${
                        c2cSizes.includes(sz)
                          ? 'bg-[#ED3D63] text-white border-[#ED3D63] shadow-sm'
                          : isDarkMode
                          ? 'bg-[#161B7F]/60 border-[#223CCF] text-slate-200 hover:bg-[#223CCF]'
                          : 'bg-[#F0F4FF] border-[#223CCF]/30 text-[#161B7F] hover:bg-[#223CCF] hover:text-white'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">🕺 Fit Gender</label>
                <select
                  value={c2cGender}
                  onChange={(e) =>
                    setC2cGender(e.target.value as Exclude<GenderFilter, 'All'>)
                  }
                  className={`w-full h-11 px-3 rounded-xl border text-xs font-semibold ${
                    isDarkMode
                      ? 'bg-[#05050B] border-[#223CCF] text-white'
                      : 'bg-[#F4F7FF] border-[#223CCF]/30 text-[#161B7F]'
                  }`}
                >
                  <option value="Women">Women</option>
                  <option value="Men">Men</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>
            </div>

            {/* Photo Picker / Preset Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold">
                📸 Outfit Photo (Upload via Cloudinary/Supabase Storage or Select Studio Preset)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SAMPLE_PHOTOS.map((ph, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setC2cPhotoUrl(ph.url)}
                    className={`p-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                      c2cPhotoUrl === ph.url
                        ? 'border-[#ED3D63] ring-2 ring-[#ED3D63]/40'
                        : 'border-[#223CCF]/40 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={ph.url}
                      alt={ph.label}
                      referrerPolicy="no-referrer"
                      className="w-full h-14 object-cover rounded-lg"
                    />
                    <div className="text-[10px] font-semibold truncate mt-1">{ph.label}</div>
                  </button>
                ))}
              </div>

              <label
                className={`mt-2 flex items-center justify-center gap-2 h-11 rounded-xl border border-dashed text-xs font-bold cursor-pointer transition-colors ${
                  isDarkMode
                    ? 'border-[#8D3FD0] hover:border-[#0683D7] text-white bg-[#161B7F]/30'
                    : 'border-[#223CCF]/50 hover:border-[#ED3D63] text-[#161B7F] bg-[#F4F7FF]'
                }`}
              >
                <Upload className="w-4 h-4 text-[#ED3D63]" />
                <span>Or upload custom photo from your device gallery</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsListWardrobeOpen(false)}
                className={`h-11 px-5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  isDarkMode
                    ? 'bg-[#161B7F] hover:bg-[#223CCF] text-white'
                    : 'bg-[#F0F4FF] hover:bg-slate-200 text-[#161B7F]'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#ED3D63] via-[#8D3FD0] to-[#223CCF] hover:opacity-95 text-white font-extrabold text-xs cursor-pointer transition-all shadow-lg shadow-[#ED3D63]/30"
              >
                🚀 Submit to Admin Approval Queue
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return null;
};
