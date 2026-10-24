import React, { useState } from 'react';
import { useRentVibeStore } from '../store/useRentVibeStore';
import { MUMBAI_COLLEGES } from '../data/mumbaiData';
import { MumbaiHubMap } from '../components/MumbaiHubMap';
import {
  MumbaiZone,
  OutfitCategory,
  RentalDuration,
  GenderFilter,
  SizeOption,
  OutfitListing
} from '../types/rentvibe';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Plus,
  Sparkles,
  Check,
  ShieldCheck,
  ArrowUpRight,
  Heart,
  Flame
} from 'lucide-react';
import { motion } from 'motion/react';

const MUMBAI_ZONES: MumbaiZone[] = [
  'All Mumbai',
  'Vile Parle & Andheri',
  'South Bombay',
  'Bandra & Khar',
  'Kurla & Vidyavihar',
  'Matunga & Dadar'
];

const EVENT_CATEGORIES: {
  id: OutfitCategory;
  emoji: string;
  label: string;
  subItems: string;
  accentBg: string;
}[] = [
  {
    id: 'All',
    emoji: '✨',
    label: 'All Fest Fits',
    subItems: '₹300–₹500/day Cap',
    accentBg: 'from-[#ED3D63] to-[#8D3FD0]'
  },
  {
    id: 'Gujarati / Navratri',
    emoji: '💃',
    label: 'Garba & Navratri',
    subItems: 'Chaniya Choli · Kediya · Mirror Work',
    accentBg: 'from-[#ED3D63] to-[#223CCF]'
  },
  {
    id: 'South Indian / Onam',
    emoji: '🥥',
    label: 'Onam & South Fest',
    subItems: 'Kasavu Saree · Veshti · Temple Gold',
    accentBg: 'from-[#0683D7] to-[#223CCF]'
  },
  {
    id: 'Marathi Traditional',
    emoji: '👑',
    label: 'Marathi Traditional',
    subItems: 'Nauvari · Kurta & Peshwai Pheta',
    accentBg: 'from-[#8D3FD0] to-[#161B7F]'
  },
  {
    id: 'College Fests & Western',
    emoji: '🕶️',
    label: 'Prom & Western',
    subItems: 'Tuxedos · Corset Gowns · Blazers',
    accentBg: 'from-[#223CCF] to-[#161B7F]'
  },
  {
    id: 'Farewell Special',
    emoji: '🥂',
    label: 'Farewell Special',
    subItems: 'Organza Sarees · Suits · Fusion',
    accentBg: 'from-[#ED3D63] to-[#0683D7]'
  },
  {
    id: 'Fashion Show & Statement Accessories',
    emoji: '👠',
    label: 'Runway & Bags',
    subItems: 'Avant-Garde · Chunky Silver · Props',
    accentBg: 'from-[#8D3FD0] to-[#ED3D63]'
  }
];

const DURATIONS: RentalDuration[] = [1, 3, 5];
const SIZES: (SizeOption | 'All')[] = ['All', 'XS', 'S', 'M', 'L', 'XL', 'Free Size'];
const GENDERS: GenderFilter[] = ['All', 'Women', 'Men', 'Unisex'];

export const HomeDiscoveryView: React.FC = () => {
  const {
    isDarkMode,
    selectedCollegeId,
    setSelectedCollegeId,
    selectedZone,
    setSelectedZone,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    maxDailyPrice,
    setMaxDailyPrice,
    selectedDuration,
    setSelectedDuration,
    selectedSize,
    setSelectedSize,
    selectedGender,
    setSelectedGender,
    maxDistanceKm,
    setMaxDistanceKm,
    listings,
    setSelectedProductForDetail,
    setIsListWardrobeOpen,
    addToCart,
    currentUserVerification,
    setActiveTab
  } = useRentVibeStore();

  const [showMapPanel, setShowMapPanel] = useState(true);
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({ 'rv-mum-101': true });

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter approved listings
  const approvedListings = listings.filter((item) => item.approvalStatus === 'approved');

  const filteredListings = approvedListings.filter((item) => {
    if (selectedZone !== 'All Mumbai' && item.zone !== selectedZone) return false;
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (item.dailyPrice > maxDailyPrice) return false;
    if (selectedSize !== 'All' && !item.sizes.includes(selectedSize)) return false;
    if (selectedGender !== 'All' && item.gender !== selectedGender && item.gender !== 'Unisex') {
      return false;
    }
    if (item.distanceKm > maxDistanceKm) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCol = item.collegeShortName.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      const matchHub = item.canteenPickupSpot.toLowerCase().includes(q);
      if (!matchTitle && !matchCol && !matchCat && !matchHub) return false;
    }
    return true;
  });

  const handleQuickAdd = (e: React.MouseEvent, item: OutfitListing) => {
    e.stopPropagation();
    addToCart({
      listing: item,
      selectedSize: item.sizes[0] || 'M',
      durationDays: selectedDuration,
      startDate: '2026-10-16',
      pickupMode: 'Campus Hub (Free)'
    });
    setQuickAddedId(item.id);
    setTimeout(() => setQuickAddedId(null), 1400);
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Gen-Z Editorial Fashion Hero & Campus Closet Controls */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className={`rounded-3xl border-2 p-6 sm:p-8 lg:p-10 relative overflow-hidden transition-colors ${
          isDarkMode
            ? 'bg-gradient-to-br from-[#161B7F]/90 via-[#0B0F2E] to-[#223CCF]/40 border-[#223CCF]'
            : 'bg-gradient-to-br from-white via-[#F0F5FF] to-[#F6EEFF] border-[#223CCF]/30 shadow-lg shadow-[#223CCF]/5'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
          {/* Left Hero Copy & Interactive Campus Controls */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#ED3D63] to-[#8D3FD0] text-white text-xs font-bold tracking-wide shadow-sm">
                <span>👗✨ MUMBAI GEN-Z CAMPUS CLOSET</span>
                <span>·</span>
                <span className="font-mono">₹300–₹500/DAY LOCK</span>
              </div>

              <h1
                className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.08] ${
                  isDarkMode ? 'text-white' : 'text-[#161B7F]'
                }`}
              >
                Slay every college fest fit without breaking your pocket money 💃🔥
              </h1>

              <p
                className={`text-sm sm:text-base max-w-2xl leading-relaxed font-medium ${
                  isDarkMode ? 'text-slate-200' : 'text-[#161B7F]/80'
                }`}
              >
                Rent verified Chaniya Cholis 🪩, Onam Kasavu Sarees 🥥, Marathi Nauvaris 👑, and
                Malhar Runway Couture 👠 directly from peers at Mithibai, Xavier’s, NMIMS & DBIT
                canteen gates.
              </p>

              {/* Floating Fashion Vibe Quick-Tags (Interactive Category Shortcuts) */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={() => setSelectedCategory('Gujarati / Navratri')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-transform hover:scale-105 cursor-pointer ${
                    isDarkMode
                      ? 'bg-[#8D3FD0]/40 border border-[#8D3FD0] text-white hover:bg-[#ED3D63]'
                      : 'bg-[#8D3FD0]/15 border border-[#8D3FD0]/40 text-[#161B7F] hover:bg-[#8D3FD0] hover:text-white'
                  }`}
                >
                  🪩 Garba Night Ready
                </button>
                <button
                  onClick={() => setSelectedCategory('Marathi Traditional')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-transform hover:scale-105 cursor-pointer ${
                    isDarkMode
                      ? 'bg-[#223CCF]/50 border border-[#0683D7] text-white hover:bg-[#0683D7]'
                      : 'bg-[#0683D7]/15 border border-[#0683D7]/40 text-[#161B7F] hover:bg-[#0683D7] hover:text-white'
                  }`}
                >
                  👑 Traditional Day Icons
                </button>
                <button
                  onClick={() => setSelectedCategory('Fashion Show & Statement Accessories')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-transform hover:scale-105 cursor-pointer ${
                    isDarkMode
                      ? 'bg-[#ED3D63]/40 border border-[#ED3D63] text-white hover:bg-[#ED3D63]'
                      : 'bg-[#ED3D63]/15 border border-[#ED3D63]/40 text-[#ED3D63] hover:bg-[#ED3D63] hover:text-white'
                  }`}
                >
                  👠 Fashion Show & Bags
                </button>
              </div>
            </div>

            {/* Interactive Campus Selector & Search Bar */}
            <div
              className={`p-4 rounded-2xl border space-y-3 ${
                isDarkMode
                  ? 'bg-[#07091E]/85 border-[#223CCF]/60'
                  : 'bg-white border-[#223CCF]/25 shadow-sm'
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                {/* College Selector Dropdown */}
                <div className="sm:col-span-4">
                  <label
                    className={`block text-[11px] font-bold mb-1 ${
                      isDarkMode ? 'text-[#0683D7]' : 'text-[#223CCF]'
                    }`}
                  >
                    🎓 Your Mumbai Campus Hub
                  </label>
                  <select
                    value={selectedCollegeId}
                    onChange={(e) => setSelectedCollegeId(e.target.value)}
                    className={`w-full h-11 px-3 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#ED3D63] ${
                      isDarkMode
                        ? 'bg-[#161B7F] border-[#223CCF] text-white'
                        : 'bg-[#F4F7FF] border-[#223CCF]/40 text-[#161B7F]'
                    }`}
                  >
                    {MUMBAI_COLLEGES.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.shortName} ({col.activeListingsCount})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mumbai Zone Selector */}
                <div className="sm:col-span-3">
                  <label
                    className={`block text-[11px] font-bold mb-1 ${
                      isDarkMode ? 'text-[#0683D7]' : 'text-[#223CCF]'
                    }`}
                  >
                    🚆 Mumbai Line / Zone
                  </label>
                  <select
                    value={selectedZone}
                    onChange={(e) => setSelectedZone(e.target.value as MumbaiZone)}
                    className={`w-full h-11 px-3 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#ED3D63] ${
                      isDarkMode
                        ? 'bg-[#161B7F] border-[#223CCF] text-white'
                        : 'bg-[#F4F7FF] border-[#223CCF]/40 text-[#161B7F]'
                    }`}
                  >
                    {MUMBAI_ZONES.map((z) => (
                      <option key={z} value={z}>
                        {z}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Input */}
                <div className="sm:col-span-5">
                  <label
                    className={`block text-[11px] font-bold mb-1 ${
                      isDarkMode ? 'text-[#0683D7]' : 'text-[#223CCF]'
                    }`}
                  >
                    🔍 Search Outfit, Fest, or Canteen
                  </label>
                  <div className="relative">
                    <Search
                      className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                        isDarkMode ? 'text-[#0683D7]' : 'text-[#223CCF]'
                      }`}
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Try 'Nauvari', 'Kasavu', 'Mithibai', 'Tuxedo'..."
                      className={`w-full h-11 pl-10 pr-4 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#ED3D63] ${
                        isDarkMode
                          ? 'bg-[#161B7F] border-[#223CCF] text-white placeholder:text-slate-300'
                          : 'bg-[#F4F7FF] border-[#223CCF]/40 text-[#161B7F] placeholder:text-[#161B7F]/50'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Action Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setIsListWardrobeOpen(true)}
                    className="h-11 px-5 rounded-xl bg-[#ED3D63] hover:bg-[#8D3FD0] text-white font-bold text-xs flex items-center gap-2 transition-all hover:scale-103 active:scale-97 whitespace-nowrap shrink-0 cursor-pointer shadow-md shadow-[#ED3D63]/30"
                  >
                    <Plus className="w-4 h-4" />
                    🧥 List Your Wardrobe (Earn ₹300–₹500/day)
                  </button>
                  <button
                    onClick={() => setShowMapPanel(!showMapPanel)}
                    className={`h-11 px-4 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all hover:scale-103 whitespace-nowrap shrink-0 cursor-pointer ${
                      isDarkMode
                        ? 'border-[#0683D7] bg-[#223CCF] hover:bg-[#0683D7] text-white'
                        : 'border-[#223CCF] bg-[#223CCF] hover:bg-[#161B7F] text-white shadow-xs'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-white" />
                    {showMapPanel ? '🗺️ Hide Campus Map' : '🗺️ Show Campus Pickup Map'}
                  </button>
                </div>

                {/* Live Student Verification Status Strip */}
                <button
                  onClick={() => setActiveTab('verify')}
                  className={`text-xs font-bold flex items-center gap-1.5 underline-offset-4 hover:underline cursor-pointer ${
                    isDarkMode ? 'text-[#0683D7]' : 'text-[#ED3D63]'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>
                    🪪 {currentUserVerification.status} (
                    {currentUserVerification.status === 'Verified Student'
                      ? '15% Off + ₹0 Deposit Active'
                      : 'Tap to Unlock ₹0 Deposit'}
                    )
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Hero Featured Lookbook Card with Animated Floating Tag */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border-2 border-[#ED3D63] min-h-[300px] flex flex-col justify-end group">
            <img
              src={approvedListings[0]?.imageUrl}
              alt="Featured Mumbai College Fest Collection"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161B7F]/95 via-[#161B7F]/45 to-transparent" />

            {/* Floating Animated Top Badge */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <span className="animate-float-slow px-3 py-1.5 rounded-xl bg-[#ED3D63] text-white text-xs font-extrabold shadow-lg flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                🔥 HOT FEST LOOKBOOK
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-[#161B7F]/90 border border-[#0683D7] text-[#0683D7] font-mono text-xs font-bold">
                ₹0 Canteen Pickup
              </span>
            </div>

            <div className="relative p-6 space-y-2 text-white">
              <div className="text-xs font-mono text-[#0683D7] font-bold">
                ✨ VILE PARLE · BANDRA · CHURCHGATE · VIDYAVIHAR
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold leading-snug">
                Navratri Raas 💃, Onam Sadhya 🥥 & Malhar Runway Edit 👠
              </h2>
              <p className="text-xs text-slate-200">
                Every outfit is hospital-grade steam sanitized, dry-cleaned, and strictly capped at
                ₹500/day for Mumbai college students.
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs font-mono text-white font-bold tabular-nums">
                <span className="px-2.5 py-1 rounded-lg bg-[#8D3FD0]">421+ Student Closets</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#223CCF]">🧼 100% Dry-Cleaned</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section 2: Interactive Mumbai Campus Exchange Map (Collapsible) */}
      {showMapPanel && (
        <section>
          <MumbaiHubMap
            selectedCollegeId={selectedCollegeId}
            onSelectCollege={(id) => setSelectedCollegeId(id)}
            isDarkMode={isDarkMode}
          />
        </section>
      )}

      {/* Section 3: Animated Gen-Z Event Category Cards & Dynamic Filter Bar */}
      <section className="space-y-6">
        {/* Category Selector Cards */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2
              className={`text-xl font-extrabold tracking-tight flex items-center gap-2 ${
                isDarkMode ? 'text-white' : 'text-[#161B7F]'
              }`}
            >
              <span>🛍️ Pick Your College Fest Vibe</span>
            </h2>
            <span
              className={`text-xs font-mono font-bold tabular-nums px-3 py-1 rounded-xl ${
                isDarkMode
                  ? 'bg-[#161B7F] text-[#0683D7] border border-[#223CCF]'
                  : 'bg-[#223CCF]/10 text-[#161B7F]'
              }`}
            >
              ✨ Showing {filteredListings.length} of {approvedListings.length} Verified Fits
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {EVENT_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <motion.button
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? `bg-gradient-to-br ${cat.accentBg} text-white border-[#ED3D63] shadow-md shadow-[#ED3D63]/20`
                      : isDarkMode
                      ? 'bg-[#161B7F]/60 border-[#223CCF]/60 text-white hover:border-[#0683D7]'
                      : 'bg-white border-[#223CCF]/25 text-[#161B7F] hover:border-[#223CCF] shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{cat.emoji}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <div className="mt-2">
                    <div className="text-xs font-extrabold leading-snug">{cat.label}</div>
                    <div
                      className={`text-[11px] mt-1 line-clamp-1 font-medium ${
                        isSelected
                          ? 'text-white/90'
                          : isDarkMode
                          ? 'text-[#0683D7]'
                          : 'text-[#223CCF]'
                      }`}
                    >
                      {cat.subItems}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Filter Controls Bar (Strict Price Lock ₹300 - ₹500/day) */}
        <div
          className={`p-5 rounded-2xl border-2 grid grid-cols-1 md:grid-cols-12 gap-5 items-center ${
            isDarkMode
              ? 'bg-[#161B7F]/45 border-[#223CCF]/70 text-white'
              : 'bg-white border-[#223CCF]/25 text-[#161B7F] shadow-sm'
          }`}
        >
          {/* Price Range Slider: Fixed ₹300 to ₹500 */}
          <div className="md:col-span-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#ED3D63]" />
                💸 Student Price Lock (₹300–₹500)
              </span>
              <span className="font-mono font-extrabold text-white bg-[#ED3D63] px-2.5 py-0.5 rounded-lg tabular-nums">
                Max ₹{maxDailyPrice}/day
              </span>
            </div>
            <input
              type="range"
              min={300}
              max={500}
              step={10}
              value={maxDailyPrice}
              onChange={(e) => setMaxDailyPrice(Number(e.target.value))}
              className="w-full accent-[#ED3D63] cursor-pointer h-2 rounded-lg"
            />
            <div
              className={`flex justify-between text-[11px] font-mono font-semibold tabular-nums ${
                isDarkMode ? 'text-slate-300' : 'text-[#161B7F]/75'
              }`}
            >
              <span>Min ₹300/day</span>
              <span>₹400/day</span>
              <span>Cap ₹500/day</span>
            </div>
          </div>

          {/* Rental Duration (1 / 3 / 5 Days) */}
          <div className="md:col-span-3 space-y-1.5">
            <span className="block text-xs font-bold">⏳ Rental Duration</span>
            <div
              className={`grid grid-cols-3 gap-1 p-1 rounded-xl border ${
                isDarkMode
                  ? 'bg-[#07091E] border-[#223CCF]'
                  : 'bg-[#F4F7FF] border-[#223CCF]/30'
              }`}
            >
              {DURATIONS.map((days) => (
                <button
                  key={days}
                  onClick={() => setSelectedDuration(days)}
                  className={`py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    selectedDuration === days
                      ? 'bg-[#ED3D63] text-white shadow-xs'
                      : isDarkMode
                      ? 'text-slate-300 hover:bg-[#223CCF] hover:text-white'
                      : 'text-[#161B7F] hover:bg-[#223CCF] hover:text-white'
                  }`}
                >
                  {days} {days === 1 ? 'Day' : 'Days'}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="md:col-span-3 space-y-1.5">
            <span className="block text-xs font-bold">📏 Fit Size</span>
            <div className="flex flex-wrap gap-1">
              {SIZES.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-2.5 py-1.5 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    selectedSize === sz
                      ? 'bg-[#8D3FD0] text-white border-[#8D3FD0] shadow-xs'
                      : isDarkMode
                      ? 'bg-[#161B7F] border-[#223CCF] text-white hover:bg-[#223CCF]'
                      : 'bg-[#F4F7FF] border-[#223CCF]/30 text-[#161B7F] hover:bg-[#223CCF] hover:text-white'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Gender & Distance Reset */}
          <div className="md:col-span-2 flex flex-col justify-between space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">🚻 Gender</span>
              <span
                className={`text-[11px] font-mono font-bold ${
                  isDarkMode ? 'text-[#0683D7]' : 'text-[#223CCF]'
                }`}
              >
                ≤ {maxDistanceKm}km
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value as GenderFilter)}
                className={`w-full h-9 px-2.5 rounded-lg border text-xs font-bold focus:outline-none ${
                  isDarkMode
                    ? 'bg-[#161B7F] border-[#223CCF] text-white'
                    : 'bg-[#F4F7FF] border-[#223CCF]/40 text-[#161B7F]'
                }`}
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedZone('All Mumbai');
                  setMaxDailyPrice(500);
                  setSelectedSize('All');
                  setSelectedGender('All');
                  setMaxDistanceKm(5);
                  setSearchQuery('');
                }}
                className="h-9 px-3 rounded-lg bg-[#0683D7] hover:bg-[#ED3D63] text-xs text-white font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid (3 columns on desktop, vibrant Gen-Z fashion cards, high contrast in Light & Dark modes) */}
        {filteredListings.length === 0 ? (
          <div
            className={`p-12 rounded-3xl border-2 text-center space-y-3 ${
              isDarkMode
                ? 'bg-[#161B7F]/30 border-[#223CCF] text-white'
                : 'bg-white border-[#223CCF]/30 text-[#161B7F]'
            }`}
          >
            <p className="text-lg font-extrabold">
              🙈 No outfits match your current filter combo!
            </p>
            <p
              className={`text-xs max-w-md mx-auto ${
                isDarkMode ? 'text-slate-300' : 'text-[#161B7F]/75'
              }`}
            >
              All outfits are strictly capped between ₹300 and ₹500/day. Try expanding your Mumbai
              Zone or resetting the size filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedZone('All Mumbai');
                setMaxDailyPrice(500);
                setSelectedSize('All');
                setSelectedGender('All');
                setSearchQuery('');
              }}
              className="mt-2 px-5 py-2.5 rounded-xl bg-[#ED3D63] hover:bg-[#8D3FD0] text-white text-xs font-bold cursor-pointer shadow-md"
            >
              ✨ Show All Mumbai Outfits
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((item, index) => {
              const isAdded = quickAddedId === item.id;
              const isLiked = !!likedIds[item.id];
              const savingsPercent = Math.round(
                ((item.originalRetailPrice - item.dailyPrice) / item.originalRetailPrice) * 100
              );

              return (
                <motion.article
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  whileHover={{ y: -6 }}
                  key={item.id}
                  onClick={() => setSelectedProductForDetail(item)}
                  className={`group rounded-3xl border-2 overflow-hidden flex flex-col justify-between transition-all cursor-pointer ${
                    isDarkMode
                      ? 'bg-[#0D1238] border-[#223CCF]/80 hover:border-[#ED3D63] shadow-lg shadow-black/40'
                      : 'bg-white border-[#223CCF]/25 hover:border-[#ED3D63] shadow-md shadow-[#161B7F]/5'
                  }`}
                >
                  <div>
                    {/* 4:3 Image Container with Interactive Wishlist Heart & Savings Tag */}
                    <div className="aspect-[4/3] w-full relative overflow-hidden bg-[#161B7F]">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#161B7F]/95 via-transparent to-black/25" />

                      {/* Top Overlay Row: Savings % & Interactive Heart Button */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-lg bg-[#8D3FD0] text-white font-mono text-[11px] font-bold shadow-sm">
                          ✨ Save {savingsPercent}% vs MRP
                        </span>

                        <button
                          onClick={(e) => toggleLike(e, item.id)}
                          aria-label="Save to wishlist"
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-125 cursor-pointer ${
                            isLiked
                              ? 'bg-[#ED3D63] text-white shadow-md'
                              : 'bg-black/50 text-white hover:bg-[#ED3D63]'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Bottom Image Scrim Info */}
                      <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-white">
                        <span className="font-bold truncate">🎓 {item.collegeShortName} Hub</span>
                        <span className="font-mono font-bold tabular-nums px-2 py-0.5 rounded bg-[#0683D7] text-white shrink-0">
                          📍 {item.distanceKm} km
                        </span>
                      </div>
                    </div>

                    {/* Card Body — Clean Unboxed Metadata with Fashion Emojis */}
                    <div className="p-5 space-y-2.5">
                      <div
                        className={`flex items-center gap-1.5 text-xs font-bold ${
                          isDarkMode ? 'text-[#0683D7]' : 'text-[#223CCF]'
                        }`}
                      >
                        <span>👗 {item.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>🧼 Sanitized</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums text-[#ED3D63]">
                          ★ {item.rating.toFixed(1)}
                        </span>
                      </div>

                      <h3
                        className={`text-base font-extrabold leading-snug line-clamp-2 transition-colors ${
                          isDarkMode
                            ? 'text-white group-hover:text-[#ED3D63]'
                            : 'text-[#161B7F] group-hover:text-[#ED3D63]'
                        }`}
                      >
                        {item.title}
                      </h3>

                      <p
                        className={`text-xs font-medium line-clamp-1 ${
                          isDarkMode ? 'text-slate-300' : 'text-[#161B7F]/75'
                        }`}
                      >
                        🤝 Free Pickup: {item.canteenPickupSpot}
                      </p>

                      <div
                        className={`text-xs font-semibold flex items-center gap-2 pt-1 ${
                          isDarkMode ? 'text-slate-300' : 'text-[#161B7F]/80'
                        }`}
                      >
                        <span>📏 Sizes: {item.sizes.join(', ')}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums line-through opacity-75">
                          MRP ₹{item.originalRetailPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: High-Contrast Price & Vibrant Gradient Action Button */}
                  <div
                    className={`px-5 py-3.5 border-t flex items-center justify-between gap-3 ${
                      isDarkMode
                        ? 'border-[#223CCF]/50 bg-[#07091E]'
                        : 'border-[#223CCF]/20 bg-[#F4F7FF]'
                    }`}
                  >
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span
                          className={`text-lg font-extrabold font-mono tabular-nums ${
                            isDarkMode ? 'text-[#0683D7]' : 'text-[#ED3D63]'
                          }`}
                        >
                          ₹{item.dailyPrice}
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            isDarkMode ? 'text-slate-300' : 'text-[#161B7F]/75'
                          }`}
                        >
                          / day
                        </span>
                      </div>
                      <div
                        className={`text-[11px] font-mono font-semibold tabular-nums ${
                          isDarkMode ? 'text-slate-400' : 'text-[#223CCF]'
                        }`}
                      >
                        {selectedDuration}d total: ₹{item.dailyPrice * selectedDuration}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleQuickAdd(e, item)}
                        className={`h-10 px-4 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 whitespace-nowrap shrink-0 cursor-pointer shadow-sm ${
                          isAdded
                            ? 'bg-[#8D3FD0] text-white'
                            : 'bg-[#ED3D63] hover:bg-[#223CCF] text-white'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Added 🛍️
                          </>
                        ) : (
                          <>
                            ✨ Rent ({selectedDuration}d)
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </section>

      {/* Section 4: Peer Hygiene & Campus Exchange Guarantee */}
      <section
        className={`rounded-3xl border-2 p-6 grid grid-cols-1 md:grid-cols-3 gap-6 ${
          isDarkMode
            ? 'bg-[#161B7F]/40 border-[#223CCF]/70 text-white'
            : 'bg-white border-[#223CCF]/25 text-[#161B7F] shadow-sm'
        }`}
      >
        <div className="space-y-1.5">
          <div className="text-xs font-mono font-bold text-[#ED3D63]">
            💸 01. STUDENT POCKET-MONEY LOCK
          </div>
          <h3 className="text-sm font-extrabold">Strict ₹300–₹500/Day Ceiling</h3>
          <p
            className={`text-xs leading-relaxed font-medium ${
              isDarkMode ? 'text-slate-300' : 'text-[#161B7F]/80'
            }`}
          >
            Smart contract validation prevents any peer listing above ₹500/day, keeping ₹10,000+
            designer ethnic wear affordable for every college fest.
          </p>
        </div>
        <div className="space-y-1.5">
          <div className="text-xs font-mono font-bold text-[#0683D7]">
            🎓 02. CAMPUS CANTEEN LOCKERS
          </div>
          <h3 className="text-sm font-extrabold">Zero Delivery Fees at 8+ Mumbai Colleges</h3>
          <p
            className={`text-xs leading-relaxed font-medium ${
              isDarkMode ? 'text-slate-300' : 'text-[#161B7F]/80'
            }`}
          >
            Collect and return outfits at Mithibai Gate 2, NMIMS Atrium, Xavier’s Woods, DBIT Kurla,
            or Somaiya Gargi Plaza during break slots.
          </p>
        </div>
        <div className="space-y-1.5">
          <div className="text-xs font-mono font-bold text-[#8D3FD0]">
            🧼 03. HYGIENE & CHAI SPILL SHIELD
          </div>
          <h3 className="text-sm font-extrabold">Steam & Ozone Sanitized Before Handover</h3>
          <p
            className={`text-xs leading-relaxed font-medium ${
              isDarkMode ? 'text-slate-300' : 'text-[#161B7F]/80'
            }`}
          >
            Every outfit carries a verified dry-clean tag. Minor garba sweat or canteen chai
            splashes are covered under our student-friendly Spill Shield.
          </p>
        </div>
      </section>
    </div>
  );
};
