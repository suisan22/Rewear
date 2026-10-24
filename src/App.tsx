import React from 'react';
import { useRentVibeStore, ActiveTab } from './store/useRentVibeStore';
import { HomeDiscoveryView } from './views/HomeDiscoveryView';
import { StudentVerificationView } from './views/StudentVerificationView';
import { CartBagView } from './views/CartBagView';
import { OrdersAndCareView } from './views/OrdersAndCareView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { ProductDetailAndC2CModal } from './components/ProductDetailAndC2CModal';
import {
  Compass,
  ShieldCheck,
  ShoppingBag,
  Clock,
  LayoutDashboard,
  Sun,
  Moon,
  Plus
} from 'lucide-react';

export default function App() {
  const {
    activeTab,
    setActiveTab,
    isDarkMode,
    toggleDarkMode,
    cart,
    listings,
    setIsListWardrobeOpen
  } = useRentVibeStore();

  const pendingApprovalsCount = listings.filter((l) => l.approvalStatus !== 'approved').length;

  const NAV_ITEMS: { id: ActiveTab; label: string }[] = [
    { id: 'discover', label: '✨ Discover' },
    { id: 'verify', label: '🪪 Verify ID' },
    { id: 'cart', label: `🛍️ Bag (${cart.length})` },
    { id: 'orders', label: '📦 Orders & Care' },
    { id: 'admin', label: `⚡ Admin (${pendingApprovalsCount})` }
  ];

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        isDarkMode ? 'bg-[#07091E] text-white' : 'bg-[#F4F7FF] text-[#161B7F]'
      }`}
    >
      {/* Top Bar Contract: 3 Zones separated by gap-8 */}
      <header
        className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors ${
          isDarkMode
            ? 'bg-[#07091E]/90 border-[#223CCF]/40'
            : 'bg-white/95 border-[#223CCF]/20 shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setActiveTab('discover')}
            className={`text-lg sm:text-xl font-extrabold tracking-tight font-display whitespace-nowrap shrink-0 cursor-pointer text-left ${
              isDarkMode ? 'text-white' : 'text-[#161B7F]'
            }`}
          >
            👗 RentVibe Mumbai
          </button>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`py-1.5 transition-all whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                    isActive
                      ? 'border-[#ED3D63] text-[#ED3D63] font-bold scale-105'
                      : isDarkMode
                      ? 'border-transparent text-slate-300 hover:text-[#0683D7]'
                      : 'border-transparent text-[#161B7F]/75 hover:text-[#223CCF]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsListWardrobeOpen(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#ED3D63] to-[#8D3FD0] hover:from-[#8D3FD0] hover:to-[#223CCF] rounded-xl transition-all duration-150 hover:scale-105 active:scale-95 whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 shadow-md shadow-[#ED3D63]/25"
            >
              <Plus className="w-3.5 h-3.5" />
              ✨ List Outfit
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-12">
        {/* Workspace Toolbar below header for Theme Toggle & Color Swatch Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 text-xs">
          <div className="flex items-center gap-2 font-mono">
            <span className={isDarkMode ? 'text-slate-300' : 'text-[#161B7F] font-semibold'}>
              🔥 MUMBAI GEN-Z CAMPUS CLOSET
            </span>
            <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>·</span>
            <span
              className={`font-bold ${
                isDarkMode ? 'text-[#0683D7]' : 'text-[#ED3D63]'
              }`}
            >
              💸 ₹300 – ₹500/DAY LOCK
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleDarkMode}
              className={`px-3.5 py-1.5 rounded-xl border font-semibold flex items-center gap-1.5 transition-all hover:scale-103 cursor-pointer ${
                isDarkMode
                  ? 'border-[#0683D7]/60 bg-[#223CCF] text-white hover:bg-[#8D3FD0]'
                  : 'border-[#161B7F] bg-[#161B7F] text-white hover:bg-[#ED3D63] hover:border-[#ED3D63]'
              }`}
              aria-label="Toggle Dark or Light Mode"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#FFDF6B]" />
                  <span>☀️ Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-white" />
                  <span>🌙 Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Active View Router */}
        {activeTab === 'discover' && <HomeDiscoveryView />}
        {activeTab === 'verify' && <StudentVerificationView />}
        {activeTab === 'cart' && <CartBagView />}
        {activeTab === 'orders' && <OrdersAndCareView />}
        {activeTab === 'admin' && <AdminDashboardView />}
      </main>

      {/* Product Detail (PDP) & C2C "List Your Wardrobe" Modals */}
      <ProductDetailAndC2CModal />

      {/* Mobile Ergonomic Bottom Tab Bar (Thumb-Zone Navigation for Smartphone Viewports) */}
      <nav
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-md grid grid-cols-5 items-center h-16 px-2 ${
          isDarkMode
            ? 'bg-[#07091E]/95 border-[#223CCF]/50 text-slate-300'
            : 'bg-white/95 border-[#223CCF]/25 text-[#161B7F]'
        }`}
      >
        <button
          onClick={() => setActiveTab('discover')}
          className={`flex flex-col items-center justify-center min-h-[44px] cursor-pointer ${
            activeTab === 'discover' ? 'text-[#ED3D63] font-bold' : ''
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] mt-1">Discover</span>
        </button>

        <button
          onClick={() => setActiveTab('verify')}
          className={`flex flex-col items-center justify-center min-h-[44px] cursor-pointer ${
            activeTab === 'verify' ? 'text-[#ED3D63] font-bold' : ''
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] mt-1">Verify ID</span>
        </button>

        <button
          onClick={() => setActiveTab('cart')}
          className={`flex flex-col items-center justify-center min-h-[44px] cursor-pointer ${
            activeTab === 'cart' ? 'text-[#ED3D63] font-bold' : ''
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] mt-1">Bag ({cart.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center justify-center min-h-[44px] cursor-pointer ${
            activeTab === 'orders' ? 'text-[#ED3D63] font-bold' : ''
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px] mt-1">Orders</span>
        </button>

        <button
          onClick={() => setActiveTab('admin')}
          className={`flex flex-col items-center justify-center min-h-[44px] cursor-pointer ${
            activeTab === 'admin' ? 'text-[#ED3D63] font-bold' : ''
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-1">Admin ({pendingApprovalsCount})</span>
        </button>
      </nav>

      {/* Quiet Footer */}
      <footer
        className={`border-t py-6 text-xs hidden md:block ${
          isDarkMode
            ? 'border-[#223CCF]/30 bg-[#07091E] text-slate-400'
            : 'border-[#223CCF]/20 bg-white text-[#161B7F]/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <span>
            👗 RentVibe Mumbai · Peer-to-Peer College Fest Wardrobe Exchange (₹300–₹500/day Price Lock)
          </span>
          <div className="flex items-center gap-4 font-medium">
            <button
              onClick={() => setActiveTab('verify')}
              className="hover:text-[#ED3D63] cursor-pointer"
            >
              🪪 1-Email = 1-Student-ID Policy
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

