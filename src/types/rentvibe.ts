export type VerificationStatus = 'Pending Approval' | 'Verified Student' | 'Rejected';

export type MumbaiZone = 'All Mumbai' | 'Bandra & Khar' | 'Vile Parle & Andheri' | 'South Bombay' | 'Kurla & Vidyavihar' | 'Matunga & Dadar';

export type OutfitCategory =
  | 'All'
  | 'Gujarati / Navratri'
  | 'South Indian / Onam'
  | 'Marathi Traditional'
  | 'College Fests & Western'
  | 'Farewell Special'
  | 'Fashion Show & Statement Accessories';

export type RentalDuration = 1 | 3 | 5;

export type GenderFilter = 'All' | 'Women' | 'Men' | 'Unisex';

export type SizeOption = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'Free Size';

export interface MumbaiCollege {
  id: string;
  shortName: string;
  fullName: string;
  zone: Exclude<MumbaiZone, 'All Mumbai'>;
  hubName: string;
  nearestMetroOrStation: string;
  lat: number;
  lng: number;
  activeListingsCount: number;
  freeDropTiming: string;
}

export interface OutfitListing {
  id: string;
  title: string;
  category: Exclude<OutfitCategory, 'All'>;
  dailyPrice: number; // Strictly 300 to 500
  originalRetailPrice: number;
  securityDeposit: number;
  sizes: SizeOption[];
  gender: Exclude<GenderFilter, 'All'>;
  collegeId: string;
  collegeShortName: string;
  zone: Exclude<MumbaiZone, 'All Mumbai'>;
  distanceKm: number;
  ownerName: string;
  ownerRollNo: string;
  ownerVerified: boolean;
  hygieneVerified: boolean;
  lastSanitizedDate: string;
  canteenPickupSpot: string;
  imageUrl: string;
  secondaryAngleLabel: string;
  fabricDetails: string;
  fitNotes: string;
  includedItems: string[];
  approvalStatus: 'approved' | 'pending' | 'rejected' | 'needs_photos';
  rejectionReason?: string;
  submittedAt: string;
  rating: number;
  rentalsCompleted: number;
}

export interface StudentVerificationRecord {
  id: string;
  fullName: string;
  email: string;
  collegeName: string;
  rollNo: string;
  graduationYear: string;
  idCardPreviewUrl: string;
  status: VerificationStatus;
  submittedAt: string;
  rejectionNote?: string;
}

export interface CartItem {
  listing: OutfitListing;
  selectedSize: SizeOption;
  durationDays: RentalDuration;
  startDate: string;
  pickupMode: 'Campus Hub (Free)' | 'Home Delivery (₹60)';
}

export type OrderTimelineStatus = 'Approved' | 'Ready for Pickup' | 'Rented' | 'Returned';

export interface ActiveRentalOrder {
  id: string;
  orderNumber: string;
  items: CartItem[];
  totalRentalFee: number;
  securityDepositPaid: number;
  discountApplied: number;
  finalAmountPaid: number;
  upiMethod: 'GPay' | 'PhonePe' | 'Paytm' | 'BHIM UPI';
  pickupHubName: string;
  status: OrderTimelineStatus;
  returnDeadlineIso: string;
  createdAt: string;
  returnScheduledSlot?: string;
}

export interface SupportTicket {
  id: string;
  orderNumber: string;
  issueType: 'Damaged Item on Pickup' | 'Wrong Size / Fit Issue' | 'Minor Spill Protection Claim' | 'Late Return Grace Request';
  description: string;
  status: 'Open' | 'Resolved';
  createdAt: string;
}
