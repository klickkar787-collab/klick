export type UserRole = 'customer' | 'provider' | 'admin';

export type BookingStatus =
  | 'Requested'
  | 'Under Review'
  | 'Quote Sent'
  | 'Accepted'
  | 'Scheduled'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled'
  | 'Rejected'
  | 'Awaiting Information';

export type BookingType =
  | 'Service Booking'
  | 'Project Booking'
  | 'Product Booking'
  | 'Job Work Booking'
  | 'AMC / Maintenance Booking'
  | 'Site Visit / Inspection Booking';

export type PaymentMode =
  | 'Pay Now (Online)'
  | 'UPI'
  | 'NEFT'
  | 'RTGS'
  | 'IMPS'
  | 'Bank Transfer'
  | 'Demand Draft (DD)'
  | 'Cash on Site';

export type PaymentStatus =
  | 'Pending'
  | 'Paid'
  | 'Partially Paid'
  | 'Failed'
  | 'Refunded';

export type PaymentPlanType =
  | 'Advance Payment'
  | 'Part Payment'
  | 'Full Payment';

export interface PaymentRecord {
  id: string;
  receiptNumber: string; // e.g. "KK-REC-2026-001"
  bookingId?: string;
  bookingNumber?: string;
  quotationId?: string;
  invoiceId?: string;
  invoiceNumber?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  amount: number;
  paymentPlan: PaymentPlanType;
  paymentMode: PaymentMode;
  status: PaymentStatus;
  transactionRef?: string; // UTR or Txn ID or DD Number
  bankName?: string;
  date: string;
  notes?: string;
  recordedBy?: string; // e.g. "Admin Manual" or "Customer Online Gateway"
  totalBillAmount?: number;
  balanceRemaining?: number;
}

export interface PaymentTermsConfig {
  standardAdvancePercentage: number; // e.g. 40
  allowCashOnSite: boolean;
  cashOnSiteMaxLimit: number;
  termsClauses: string[];
  cancellationRefundPolicy: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  hsnSac: string;
  description: string;
  basePrice: number;
  unit: string;
  imageUrl: string;
  features: string[];
  popular?: boolean;
  itemType?: 'service' | 'product' | 'jobwork';
  inStock?: boolean;
}

export interface QuotationItem {
  id: string;
  description: string;
  hsnSac: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
  type: 'material' | 'labour' | 'equipment';
}

export interface Quotation {
  id: string;
  bookingId: string;
  quotationNumber: string;
  date: string;
  validUntil: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  serviceCategory: string;
  items: QuotationItem[];
  subtotal: number;
  discount: number;
  gstRate: number; // e.g. 18
  gstType: 'CGST_SGST' | 'IGST';
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  grandTotal: number;
  terms: string[];
  status: 'Draft' | 'Sent' | 'Approved' | 'Rejected' | 'Expired';
  providerNotes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  hsnSac: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  taxableValue: number;
  gstRate: number; // 18%
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  total: number;
}

export interface GSTInvoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  bookingId?: string;
  quotationId?: string;
  placeOfSupply: string; // "09-Uttar Pradesh" or "07-Delhi"
  stateCode: string;
  reverseCharge: 'Yes' | 'No';
  // Customer details
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  customerGstin?: string;
  customerPan?: string;
  // Items & totals
  items: InvoiceItem[];
  taxableAmount: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  grandTotal: number;
  amountInWords: string;
  paymentStatus: PaymentStatus;
  paymentMode?: PaymentMode;
  paymentDate?: string;
  notes?: string;
  paidAmount?: number;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  bookingType: BookingType;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  serviceArea: string;
  preferredDate: string;
  preferredTimeSlot: string;
  description: string;
  budgetEstimate?: number;
  urgency: 'Standard' | 'Urgent (Within 24 Hrs)' | 'Emergency';
  status: BookingStatus;
  createdAt: string;
  assignedProviderId?: string;
  assignedProviderName?: string;
  quotationId?: string;
  invoiceId?: string;
  statusNotes?: string;
  progressPercentage?: number;
  images?: string[];
  // Payment tracking & Terms
  paymentStatus: PaymentStatus;
  paidAmount: number;
  paymentMode?: PaymentMode;
  paymentPlan?: PaymentPlanType;
  termsAccepted: boolean;
}

export interface TelegramLead {
  id: string;
  telegramChatId: string;
  username?: string;
  name: string;
  phone: string;
  serviceRequired: string;
  location: string;
  budget: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Closed';
  createdAt: string;
  chatHistory: {
    sender: 'user' | 'bot' | 'admin';
    message: string;
    timestamp: string;
  }[];
  adminNotes?: string;
  linkedBookingId?: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  phone: string;
  email: string;
  specialization: string[];
  rating: number;
  completedJobs: number;
  activeJobs: number;
  experienceYears: number;
  status: 'Active' | 'Busy' | 'Offline';
  panNumber: string;
}

export interface AIChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface AIChatSession {
  id: string;
  startTime: string;
  messages: AIChatMessage[];
  leadCaptured?: {
    name?: string;
    phone?: string;
    serviceRequired?: string;
    location?: string;
    budget?: string;
  };
  status: 'Active' | 'Lead Captured' | 'Escalated to Human' | 'Closed';
}

export interface AppSettings {
  companyName: string;
  legalEntity: string;
  gstin: string;
  cin: string;
  pan: string;
  tan: string;
  msme: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  shopCode: string;
  googleProfileUrl: string;
  bankAccount: {
    accountHolder: string;
    bankName: string;
    accountNumber: string;
    ifsc: string;
    branch: string;
  };
  whatsapp: {
    enabled: boolean;
    phoneNumber: string;
    defaultMessage: string;
  };
  telegram: {
    enabled: boolean;
    botToken: string;
    botUsername: string;
    autoReply: boolean;
  };
  aiChatbot: {
    enabled: boolean;
    welcomeMessage: string;
    botName: string;
  };
  paymentTerms: PaymentTermsConfig;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string;
  companyName?: string;
  gstin?: string;
  address?: string;
  status: 'Active' | 'Suspended' | 'Pending';
  createdAt: string;
  lastLogin?: string;
  providerSpecialization?: string[];
}

export interface OfferItem {
  id: string;
  code: string;
  title: string;
  discountPercentage: number;
  maxDiscount?: number;
  description: string;
  validUntil: string;
  active: boolean;
  serviceCategory?: string;
}

export interface SiteContent {
  heroTagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  announcementBar: string;
  aboutHeadline: string;
  aboutDescription: string;
  footerNotice: string;
}
