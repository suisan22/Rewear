import { create } from 'zustand';
import {
  VerificationStatus,
  MumbaiZone,
  OutfitCategory,
  RentalDuration,
  GenderFilter,
  SizeOption,
  OutfitListing,
  StudentVerificationRecord,
  CartItem,
  ActiveRentalOrder,
  OrderTimelineStatus,
  SupportTicket
} from '../types/rentvibe';
import {
  INITIAL_OUTFIT_LISTINGS,
  INITIAL_STUDENT_VERIFICATIONS,
  INITIAL_ACTIVE_ORDERS,
  MUMBAI_COLLEGES
} from '../data/mumbaiData';

export type ActiveTab =
  | 'discover'
  | 'verify'
  | 'cart'
  | 'orders'
  | 'admin';

interface RentVibeState {
  // Navigation & Theme
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isAdminRole: boolean;
  setIsAdminRole: (isAdmin: boolean) => void;

  // Discovery & Filters
  selectedCollegeId: string;
  setSelectedCollegeId: (collegeId: string) => void;
  selectedZone: MumbaiZone;
  setSelectedZone: (zone: MumbaiZone) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: OutfitCategory;
  setSelectedCategory: (cat: OutfitCategory) => void;
  maxDailyPrice: number; // Strictly 300 to 500
  setMaxDailyPrice: (price: number) => void;
  selectedDuration: RentalDuration;
  setSelectedDuration: (days: RentalDuration) => void;
  selectedSize: SizeOption | 'All';
  setSelectedSize: (size: SizeOption | 'All') => void;
  selectedGender: GenderFilter;
  setSelectedGender: (gender: GenderFilter) => void;
  maxDistanceKm: number;
  setMaxDistanceKm: (km: number) => void;

  // Product Detail & C2C Modal
  selectedProductForDetail: OutfitListing | null;
  setSelectedProductForDetail: (product: OutfitListing | null) => void;
  isListWardrobeOpen: boolean;
  setIsListWardrobeOpen: (open: boolean) => void;

  // Student Verification (Strict One Email = One Student ID Rule)
  currentUserVerification: StudentVerificationRecord;
  registeredEmailsMap: Record<string, string>; // email -> rollNo (enforces 1:1 rule)
  submitStudentVerification: (payload: {
    fullName: string;
    email: string;
    collegeName: string;
    rollNo: string;
    graduationYear: string;
    idCardPreviewUrl: string;
  }) => { success: boolean; message: string };
  simulateQuickVerify: (status: VerificationStatus) => void;

  // Listings & Admin Approval Queue
  listings: OutfitListing[];
  submitNewOutfitListing: (newListing: Omit<OutfitListing, 'id' | 'approvalStatus' | 'submittedAt' | 'rating' | 'rentalsCompleted'>) => void;
  adminApproveListing: (id: string) => void;
  adminRejectListing: (id: string, reason: string) => void;
  adminRequestPhotosListing: (id: string) => void;

  // Admin Student Verification Queue
  verificationQueue: StudentVerificationRecord[];
  adminUpdateStudentVerification: (id: string, status: VerificationStatus, rejectionNote?: string) => void;

  // Cart & Promo & Checkout
  cart: CartItem[];
  promoCodeInput: string;
  appliedPromoCode: string | null;
  setPromoCodeInput: (code: string) => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  addToCart: (item: CartItem) => void;
  removeFromCart: (listingId: string) => void;
  updateCartItemPickup: (listingId: string, mode: 'Campus Hub (Free)' | 'Home Delivery (₹60)') => void;
  completeCheckout: (upiMethod: 'GPay' | 'PhonePe' | 'Paytm' | 'BHIM UPI', pickupHubName: string) => ActiveRentalOrder | null;

  // Active Orders & Support
  activeOrders: ActiveRentalOrder[];
  advanceOrderStatus: (orderId: string, nextStatus: OrderTimelineStatus) => void;
  scheduleOrderReturnSlot: (orderId: string, slotText: string) => void;
  supportTickets: SupportTicket[];
  submitSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'status' | 'createdAt'>) => void;
}

export const useRentVibeStore = create<RentVibeState>((set, get) => ({
  activeTab: 'discover',
  setActiveTab: (tab) => set({ activeTab: tab }),
  isDarkMode: true,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  isAdminRole: false,
  setIsAdminRole: (isAdmin) => set({ isAdminRole: isAdmin }),

  selectedCollegeId: 'mithibai',
  setSelectedCollegeId: (collegeId) => set({ selectedCollegeId: collegeId }),
  selectedZone: 'All Mumbai',
  setSelectedZone: (zone) => set({ selectedZone: zone }),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  selectedCategory: 'All',
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
  maxDailyPrice: 500,
  setMaxDailyPrice: (price) => set({ maxDailyPrice: Math.min(500, Math.max(300, price)) }),
  selectedDuration: 3,
  setSelectedDuration: (days) => set({ selectedDuration: days }),
  selectedSize: 'All',
  setSelectedSize: (size) => set({ selectedSize: size }),
  selectedGender: 'All',
  setSelectedGender: (gender) => set({ selectedGender: gender }),
  maxDistanceKm: 5,
  setMaxDistanceKm: (km) => set({ maxDistanceKm: km }),

  selectedProductForDetail: null,
  setSelectedProductForDetail: (product) => set({ selectedProductForDetail: product }),
  isListWardrobeOpen: false,
  setIsListWardrobeOpen: (open) => set({ isListWardrobeOpen: open }),

  currentUserVerification: {
    id: 'ver-user-active',
    fullName: 'Aarav Nair',
    email: 'aarav.nair@xaviers.edu',
    collegeName: "St. Xavier's College",
    rollNo: 'TYBSC-IT-2026-009',
    graduationYear: '2026',
    idCardPreviewUrl: INITIAL_STUDENT_VERIFICATIONS[2].idCardPreviewUrl,
    status: 'Verified Student',
    submittedAt: 'Verified via Mumbai University DigiLocker & College ID'
  },
  registeredEmailsMap: {
    'rohan.deshmukh@dbit.in': 'BE-EXTC-2026-044',
    'krisha.chokshi@mithibai.edu.in': 'SYJC-COMM-2027-211',
    'aarav.nair@xaviers.edu': 'TYBSC-IT-2026-009'
  },

  submitStudentVerification: (payload) => {
    const normalizedEmail = payload.email.trim().toLowerCase();
    const normalizedRoll = payload.rollNo.trim().toUpperCase();
    const existingMap = get().registeredEmailsMap;

    // Enforce Strict One Email = One Student ID Rule
    if (existingMap[normalizedEmail] && existingMap[normalizedEmail] !== normalizedRoll) {
      return {
        success: false,
        message: `Strict 1-Email = 1-Student-ID violation: ${normalizedEmail} is already permanently linked to Roll No. ${existingMap[normalizedEmail]}.`
      };
    }

    const duplicateRollOwner = Object.entries(existingMap).find(
      ([em, roll]) => roll === normalizedRoll && em !== normalizedEmail
    );
    if (duplicateRollOwner) {
      return {
        success: false,
        message: `Student ID Roll No. ${normalizedRoll} is already bound to another student account (${duplicateRollOwner[0]}).`
      };
    }

    const newRecord: StudentVerificationRecord = {
      id: `ver-${Date.now()}`,
      fullName: payload.fullName,
      email: normalizedEmail,
      collegeName: payload.collegeName,
      rollNo: normalizedRoll,
      graduationYear: payload.graduationYear,
      idCardPreviewUrl: payload.idCardPreviewUrl,
      status: 'Pending Approval',
      submittedAt: 'Just now'
    };

    set((state) => ({
      currentUserVerification: newRecord,
      registeredEmailsMap: {
        ...state.registeredEmailsMap,
        [normalizedEmail]: normalizedRoll
      },
      verificationQueue: [newRecord, ...state.verificationQueue]
    }));

    return {
      success: true,
      message: 'Student ID bound to email and queued for Admin Verification.'
    };
  },

  simulateQuickVerify: (status) =>
    set((state) => ({
      currentUserVerification: {
        ...state.currentUserVerification,
        status
      }
    })),

  listings: INITIAL_OUTFIT_LISTINGS,

  submitNewOutfitListing: (newListing) => {
    const clampedPrice = Math.min(500, Math.max(300, newListing.dailyPrice));
    const created: OutfitListing = {
      ...newListing,
      dailyPrice: clampedPrice,
      id: `rv-mum-${Math.floor(300 + Math.random() * 699)}`,
      approvalStatus: 'pending',
      submittedAt: 'Just now',
      rating: 5.0,
      rentalsCompleted: 0
    };
    set((state) => ({
      listings: [created, ...state.listings],
      isListWardrobeOpen: false
    }));
  },

  adminApproveListing: (id) =>
    set((state) => ({
      listings: state.listings.map((item) =>
        item.id === id ? { ...item, approvalStatus: 'approved', rejectionReason: undefined } : item
      )
    })),

  adminRejectListing: (id, reason) =>
    set((state) => ({
      listings: state.listings.map((item) =>
        item.id === id ? { ...item, approvalStatus: 'rejected', rejectionReason: reason } : item
      )
    })),

  adminRequestPhotosListing: (id) =>
    set((state) => ({
      listings: state.listings.map((item) =>
        item.id === id
          ? {
              ...item,
              approvalStatus: 'needs_photos',
              rejectionReason: 'Please upload clear daylight front/back shots and dry-clean tag.'
            }
          : item
      )
    })),

  verificationQueue: INITIAL_STUDENT_VERIFICATIONS,

  adminUpdateStudentVerification: (id, status, rejectionNote) =>
    set((state) => {
      const updatedQueue = state.verificationQueue.map((ver) =>
        ver.id === id ? { ...ver, status, rejectionNote } : ver
      );
      const matchedCurrent =
        state.currentUserVerification.id === id
          ? { ...state.currentUserVerification, status, rejectionNote }
          : state.currentUserVerification;

      return {
        verificationQueue: updatedQueue,
        currentUserVerification: matchedCurrent
      };
    }),

  cart: [
    {
      listing: INITIAL_OUTFIT_LISTINGS[2], // Marathi Nauvari & Pheta
      selectedSize: 'M',
      durationDays: 3,
      startDate: '2026-10-15',
      pickupMode: 'Campus Hub (Free)'
    }
  ],
  promoCodeInput: 'MUMBAI_STUDENT10',
  appliedPromoCode: 'MUMBAI_STUDENT10',

  setPromoCodeInput: (code) => set({ promoCodeInput: code }),

  applyPromoCode: (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'MUMBAI_STUDENT10' || clean === 'MALHAR15' || clean === 'GARBA50') {
      set({ appliedPromoCode: clean, promoCodeInput: clean });
      return { success: true, message: `Promo ${clean} applied (10% extra festival rebate).` };
    }
    return {
      success: false,
      message: 'Try MUMBAI_STUDENT10 for verified Mumbai student savings.'
    };
  },

  addToCart: (newItem) =>
    set((state) => {
      const exists = state.cart.find((c) => c.listing.id === newItem.listing.id);
      if (exists) {
        return {
          cart: state.cart.map((c) =>
            c.listing.id === newItem.listing.id ? newItem : c
          )
        };
      }
      return { cart: [...state.cart, newItem] };
    }),

  removeFromCart: (listingId) =>
    set((state) => ({
      cart: state.cart.filter((c) => c.listing.id !== listingId)
    })),

  updateCartItemPickup: (listingId, mode) =>
    set((state) => ({
      cart: state.cart.map((c) =>
        c.listing.id === listingId ? { ...c, pickupMode: mode } : c
      )
    })),

  completeCheckout: (upiMethod, pickupHubName) => {
    const state = get();
    if (state.cart.length === 0) return null;

    const isVerified = state.currentUserVerification.status === 'Verified Student';
    const rawRentalTotal = state.cart.reduce(
      (sum, item) => sum + item.listing.dailyPrice * item.durationDays,
      0
    );
    const deliveryTotal = state.cart.reduce(
      (sum, item) => sum + (item.pickupMode === 'Home Delivery (₹60)' ? 60 : 0),
      0
    );
    // Verified students get 15% off + Zero Security Deposit
    const verifiedDiscount = isVerified ? Math.round(rawRentalTotal * 0.15) : 0;
    const promoDiscount = state.appliedPromoCode ? Math.round(rawRentalTotal * 0.1) : 0;
    const totalDiscount = verifiedDiscount + promoDiscount;

    const totalDeposit = isVerified
      ? 0
      : state.cart.reduce((sum, item) => sum + item.listing.securityDeposit, 0);

    const finalAmountPaid = Math.max(0, rawRentalTotal - totalDiscount + deliveryTotal + totalDeposit);

    const newOrder: ActiveRentalOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `RV-MUM-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [...state.cart],
      totalRentalFee: rawRentalTotal,
      securityDepositPaid: totalDeposit,
      discountApplied: totalDiscount,
      finalAmountPaid,
      upiMethod,
      pickupHubName: pickupHubName || MUMBAI_COLLEGES[0].hubName,
      status: 'Approved',
      returnDeadlineIso: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
      createdAt: 'Just now'
    };

    set((s) => ({
      activeOrders: [newOrder, ...s.activeOrders],
      cart: [],
      activeTab: 'orders'
    }));

    return newOrder;
  },

  activeOrders: INITIAL_ACTIVE_ORDERS,

  advanceOrderStatus: (orderId, nextStatus) =>
    set((state) => ({
      activeOrders: state.activeOrders.map((o) =>
        o.id === orderId ? { ...o, status: nextStatus } : o
      )
    })),

  scheduleOrderReturnSlot: (orderId, slotText) =>
    set((state) => ({
      activeOrders: state.activeOrders.map((o) =>
        o.id === orderId ? { ...o, returnScheduledSlot: slotText } : o
      )
    })),

  supportTickets: [
    {
      id: 'tkt-1',
      orderNumber: 'RV-MUM-8492',
      issueType: 'Late Return Grace Request',
      description: 'Western Line train delay at Dadar; requesting 45-min grace at Mithibai Gate 2 locker.',
      status: 'Resolved',
      createdAt: 'Yesterday'
    }
  ],

  submitSupportTicket: (ticket) =>
    set((state) => ({
      supportTickets: [
        {
          ...ticket,
          id: `tkt-${Date.now()}`,
          status: 'Open',
          createdAt: 'Just now'
        },
        ...state.supportTickets
      ]
    }))
}));
