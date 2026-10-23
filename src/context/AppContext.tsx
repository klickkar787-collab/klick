import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Booking,
  BookingStatus,
  BookingType,
  Quotation,
  GSTInvoice,
  TelegramLead,
  ServiceItem,
  ServiceProvider,
  AppSettings,
  AIChatSession,
  UserAccount,
  OfferItem,
  SiteContent,
  PaymentRecord,
  PaymentMode,
  PaymentStatus,
  PaymentPlanType,
  PaymentTermsConfig,
} from '../types';
import {
  INITIAL_SERVICES,
  INITIAL_PROVIDERS,
  INITIAL_BOOKINGS,
  INITIAL_QUOTATIONS,
  INITIAL_INVOICES,
  INITIAL_TELEGRAM_LEADS,
  INITIAL_USERS,
  INITIAL_OFFERS,
  INITIAL_SITE_CONTENT,
  INITIAL_PAYMENTS,
} from '../data/initialData';
import { OFFICIAL_COMPANY_DETAILS } from '../data/companyDetails';
import { calculateGSTBreakdown, numberToIndianWords } from '../utils/gstHelper';

const INITIAL_AI_SESSIONS: AIChatSession[] = [
  {
    id: 'ai-sess-01',
    startTime: '2026-10-23T10:14:00Z',
    status: 'Lead Captured',
    messages: [
      {
        role: 'model',
        text: 'Namaste! I am KlickKar AI Assistant. How can our engineering & fabrication team assist your project today?',
        timestamp: '10:14 AM',
      },
      {
        role: 'user',
        text: 'Hello, what is the price for Italian automatic sliding gate motor in Noida Sector 76?',
        timestamp: '10:15 AM',
      },
      {
        role: 'model',
        text: 'Namaste! We supply and install heavy-duty Italian automatic sliding gate motors (up to 1000kg capacity) complete with wireless remotes, anti-pinch photocells, and gear rack. Complete kits start at approximately ₹38,000 + 18% GST with a 2-Year warranty. We can arrange a free site inspection in Sector 76 Noida tomorrow. May I know your name and phone number?',
        timestamp: '10:15 AM',
      },
      {
        role: 'user',
        text: 'My name is Alok Saxena, phone 9811455667. Please send technician.',
        timestamp: '10:16 AM',
      },
      {
        role: 'model',
        text: 'Thank you Alok ji! I have logged your request. Our Noida project engineer will call you on 9811455667 to schedule the site visit.',
        timestamp: '10:16 AM',
      },
    ],
    leadCaptured: {
      name: 'Alok Saxena',
      phone: '9811455667',
      serviceRequired: 'Smart Gate Automation',
      location: 'Sector 76, Noida',
      budget: '₹38,000 - ₹50,000',
    },
  },
];

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;

  // Authentication & RBAC
  currentUser: UserAccount | null;
  users: UserAccount[];
  login: (email: string, password: string, requiredRole?: UserRole) => { success: boolean; message?: string; user?: UserAccount };
  logout: () => void;
  registerCustomer: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address?: string;
    companyName?: string;
    gstin?: string;
  }) => { success: boolean; message?: string; user?: UserAccount };
  addUser: (user: Omit<UserAccount, 'id' | 'createdAt'>) => UserAccount;
  updateUserStatus: (id: string, status: UserAccount['status']) => void;
  resetUserPassword: (id: string, newPassword: string) => void;
  deleteUser: (id: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTargetRole: UserRole | null;
  openAuthModal: (targetRole?: UserRole) => void;

  // Data & Dynamic CMS
  services: ServiceItem[];
  addService: (service: Omit<ServiceItem, 'id'>) => ServiceItem;
  updateService: (service: ServiceItem) => void;
  deleteService: (id: string) => void;

  siteContent: SiteContent;
  updateSiteContent: (content: Partial<SiteContent>) => void;

  offers: OfferItem[];
  addOffer: (offer: Omit<OfferItem, 'id'>) => OfferItem;
  updateOffer: (offer: OfferItem) => void;
  deleteOffer: (id: string) => void;
  toggleOffer: (id: string) => void;

  providers: ServiceProvider[];
  bookings: Booking[];
  quotations: Quotation[];
  invoices: GSTInvoice[];
  leads: TelegramLead[];
  payments: PaymentRecord[];
  settings: AppSettings;

  // Modals & Active Items
  selectedInvoice: GSTInvoice | null;
  setSelectedInvoice: (invoice: GSTInvoice | null) => void;
  selectedQuotation: Quotation | null;
  setSelectedQuotation: (quote: Quotation | null) => void;
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  preselectedServiceId: string | null;
  openBookingForService: (serviceId: string) => void;
  isTelegramModalOpen: boolean;
  setIsTelegramModalOpen: (open: boolean) => void;

  // Payment & Receipts
  activePaymentModal: {
    isOpen: boolean;
    booking?: Booking;
    invoice?: GSTInvoice;
    quotation?: Quotation;
  } | null;
  openPaymentModal: (opts: { booking?: Booking; invoice?: GSTInvoice; quotation?: Quotation }) => void;
  closePaymentModal: () => void;
  activeReceipt: PaymentRecord | null;
  setActiveReceipt: (receipt: PaymentRecord | null) => void;
  recordPayment: (payment: Omit<PaymentRecord, 'id' | 'receiptNumber'>) => PaymentRecord;
  updatePaymentStatus: (id: string, status: PaymentStatus, transactionRef?: string) => void;
  updatePaymentTerms: (terms: Partial<PaymentTermsConfig>) => void;

  // Legal Modal
  isLegalModalOpen: boolean;
  setIsLegalModalOpen: (open: boolean) => void;
  legalModalTab: 'privacy' | 'terms' | 'payment';
  setLegalModalTab: (tab: 'privacy' | 'terms' | 'payment') => void;
  openLegalModal: (tab?: 'privacy' | 'terms' | 'payment') => void;

  // Operations
  addBooking: (
    booking: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt' | 'status' | 'paymentStatus' | 'paidAmount' | 'termsAccepted'> & {
      bookingType?: BookingType;
      paymentStatus?: PaymentStatus;
      paidAmount?: number;
      paymentMode?: PaymentMode;
      paymentPlan?: PaymentPlanType;
      termsAccepted?: boolean;
    }
  ) => Booking;
  updateBookingStatus: (id: string, status: BookingStatus, notes?: string, progress?: number) => void;
  assignProviderToBooking: (bookingId: string, providerId: string) => void;

  addQuotation: (quotation: Omit<Quotation, 'id' | 'quotationNumber' | 'date'>) => Quotation;
  approveQuotation: (id: string) => void;
  rejectQuotation: (id: string) => void;

  createInvoiceFromBookingOrQuote: (
    bookingId?: string,
    quotationId?: string,
    customData?: Partial<GSTInvoice>
  ) => GSTInvoice;
  updateInvoicePayment: (
    invoiceId: string,
    status: GSTInvoice['paymentStatus'],
    mode?: GSTInvoice['paymentMode'],
    notes?: string
  ) => void;

  addTelegramLead: (data: { name: string; phone: string; serviceRequired: string; location: string; budget: string; initialMessage?: string }) => TelegramLead;
  replyToTelegramLead: (leadId: string, message: string, sender?: 'admin' | 'bot') => void;
  updateLeadStatus: (leadId: string, status: TelegramLead['status']) => void;
  convertLeadToBooking: (leadId: string) => Booking;

  aiSessions: AIChatSession[];
  saveAiChatSession: (session: AIChatSession) => void;
  updateAiSessionStatus: (id: string, status: AIChatSession['status']) => void;

  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  BOOKINGS: 'klickkar_bookings_v2',
  QUOTATIONS: 'klickkar_quotations_v2',
  INVOICES: 'klickkar_invoices_v2',
  LEADS: 'klickkar_leads_v2',
  PAYMENTS: 'klickkar_payments_v2',
  SETTINGS: 'klickkar_settings_v2',
  ROLE: 'klickkar_user_role_v2',
  AI_SESSIONS: 'klickkar_ai_sessions_v2',
  AUTH_USER: 'klickkar_auth_user_v2',
  USERS: 'klickkar_users_v2',
  SERVICES: 'klickkar_services_v2',
  OFFERS: 'klickkar_offers_v2',
  SITE_CONTENT: 'klickkar_site_content_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication & Users
  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [role, setRoleState] = useState<UserRole>(() => {
    if (currentUser) return currentUser.role;
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved as UserRole) || 'customer';
  });

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem(STORAGE_KEYS.ROLE, newRole);
  };

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTargetRole, setAuthModalTargetRole] = useState<UserRole | null>(null);

  const openAuthModal = (targetRole?: UserRole) => {
    setAuthModalTargetRole(targetRole || null);
    setIsAuthModalOpen(true);
  };

  const [activeNav, setActiveNav] = useState<string>('home');

  // Dynamic Services CMS
  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return saved ? JSON.parse(saved) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  });

  // Dynamic Offers CMS
  const [offers, setOffers] = useState<OfferItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OFFERS);
      return saved ? JSON.parse(saved) : INITIAL_OFFERS;
    } catch {
      return INITIAL_OFFERS;
    }
  });

  // Dynamic Site Content CMS
  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SITE_CONTENT);
      return saved ? JSON.parse(saved) : INITIAL_SITE_CONTENT;
    } catch {
      return INITIAL_SITE_CONTENT;
    }
  });

  const [providers] = useState<ServiceProvider[]>(INITIAL_PROVIDERS);

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  const [quotations, setQuotations] = useState<Quotation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUOTATIONS);
      return saved ? JSON.parse(saved) : INITIAL_QUOTATIONS;
    } catch {
      return INITIAL_QUOTATIONS;
    }
  });

  const [invoices, setInvoices] = useState<GSTInvoice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
      return saved ? JSON.parse(saved) : INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
  });

  const [leads, setLeads] = useState<TelegramLead[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEADS);
      return saved ? JSON.parse(saved) : INITIAL_TELEGRAM_LEADS;
    } catch {
      return INITIAL_TELEGRAM_LEADS;
    }
  });

  const [aiSessions, setAiSessions] = useState<AIChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AI_SESSIONS);
      return saved ? JSON.parse(saved) : INITIAL_AI_SESSIONS;
    } catch {
      return INITIAL_AI_SESSIONS;
    }
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
    } catch {
      return INITIAL_PAYMENTS;
    }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : OFFICIAL_COMPANY_DETAILS;
    } catch {
      return OFFICIAL_COMPANY_DETAILS;
    }
  });

  // Modals
  const [selectedInvoice, setSelectedInvoice] = useState<GSTInvoice | null>(null);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | null>(null);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState<boolean>(false);

  // Payment & Receipt States
  const [activePaymentModal, setActivePaymentModal] = useState<{
    isOpen: boolean;
    booking?: Booking;
    invoice?: GSTInvoice;
    quotation?: Quotation;
  } | null>(null);
  const [activeReceipt, setActiveReceipt] = useState<PaymentRecord | null>(null);

  const openPaymentModal = (opts: { booking?: Booking; invoice?: GSTInvoice; quotation?: Quotation }) => {
    setActivePaymentModal({ isOpen: true, ...opts });
  };

  const closePaymentModal = () => {
    setActivePaymentModal(null);
  };

  // Legal Modal States
  const [isLegalModalOpen, setIsLegalModalOpen] = useState<boolean>(false);
  const [legalModalTab, setLegalModalTab] = useState<'privacy' | 'terms' | 'payment'>('privacy');

  const openLegalModal = (tab: 'privacy' | 'terms' | 'payment' = 'privacy') => {
    setLegalModalTab(tab);
    setIsLegalModalOpen(true);
  };

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }, [payments]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SITE_CONTENT, JSON.stringify(siteContent));
  }, [siteContent]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(quotations));
  }, [quotations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AI_SESSIONS, JSON.stringify(aiSessions));
  }, [aiSessions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Auth Operations
  const login = (email: string, password: string, requiredRole?: UserRole) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const user = users.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword
    );

    if (!user) {
      return { success: false, message: 'Invalid email address or password. Please check your credentials.' };
    }

    if (user.status === 'Suspended') {
      return { success: false, message: 'This account has been suspended by administration. Contact Info@klickkar.com.' };
    }

    if (requiredRole && user.role !== requiredRole) {
      const roleName = requiredRole === 'admin' ? 'Administrator' : requiredRole === 'provider' ? 'Vendor / Technician' : 'Customer';
      return {
        success: false,
        message: `These credentials belong to a ${user.role.toUpperCase()} account. Please switch to the ${roleName} login tab.`,
      };
    }

    const updatedUser = {
      ...user,
      lastLogin: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    };

    setUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
    setCurrentUser(updatedUser);
    setRole(updatedUser.role);
    setIsAuthModalOpen(false);

    return { success: true, user: updatedUser };
  };

  const logout = () => {
    setCurrentUser(null);
    setRole('customer');
    setActiveNav('home');
  };

  const registerCustomer = (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address?: string;
    companyName?: string;
    gstin?: string;
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      return { success: false, message: 'An account with this email already exists. Please log in.' };
    }

    const newUser: UserAccount = {
      id: `cust-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      password: data.password.trim(),
      phone: data.phone.trim(),
      role: 'customer',
      status: 'Active',
      address: data.address?.trim() || 'Noida, Uttar Pradesh',
      companyName: data.companyName?.trim() || '',
      gstin: data.gstin?.trim() || '',
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    setRole('customer');
    setIsAuthModalOpen(false);

    return { success: true, user: newUser };
  };

  const addUser = (userData: Omit<UserAccount, 'id' | 'createdAt'>) => {
    const newUser: UserAccount = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: userData.status || 'Active',
    };
    setUsers((prev) => [newUser, ...prev]);
    return newUser;
  };

  const updateUserStatus = (id: string, status: UserAccount['status']) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
  };

  const resetUserPassword = (id: string, newPassword: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, password: newPassword } : u))
    );
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // Dynamic Service CRUD
  const addService = (serviceData: Omit<ServiceItem, 'id'>) => {
    const newService: ServiceItem = {
      ...serviceData,
      id: `srv-${Date.now()}`,
    };
    setServices((prev) => [newService, ...prev]);
    return newService;
  };

  const updateService = (updated: ServiceItem) => {
    setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  // Dynamic Offers CMS
  const addOffer = (offerData: Omit<OfferItem, 'id'>) => {
    const newOffer: OfferItem = {
      ...offerData,
      id: `off-${Date.now()}`,
    };
    setOffers((prev) => [newOffer, ...prev]);
    return newOffer;
  };

  const updateOffer = (updated: OfferItem) => {
    setOffers((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  };

  const deleteOffer = (id: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
  };

  const toggleOffer = (id: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, active: !o.active } : o))
    );
  };

  // Dynamic Site Content CMS
  const updateSiteContent = (content: Partial<SiteContent>) => {
    setSiteContent((prev) => ({ ...prev, ...content }));
  };

  const openBookingForService = (serviceId: string) => {
    setPreselectedServiceId(serviceId);
    setIsBookingModalOpen(true);
  };

  // Add Booking
  const addBooking = (
    bookingData: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt' | 'status' | 'paymentStatus' | 'paidAmount' | 'termsAccepted'> & {
      bookingType?: BookingType;
      paymentStatus?: PaymentStatus;
      paidAmount?: number;
      paymentMode?: PaymentMode;
      paymentPlan?: PaymentPlanType;
      termsAccepted?: boolean;
    }
  ): Booking => {
    const nextNum = 100 + bookings.length + 1;
    const newBooking: Booking = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      bookingNumber: `KK-BK-2026-${String(nextNum).padStart(3, '0')}`,
      bookingType: bookingData.bookingType || 'Service Booking',
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Requested',
      progressPercentage: 5,
      paymentStatus: bookingData.paymentStatus || 'Pending',
      paidAmount: bookingData.paidAmount || 0,
      paymentMode: bookingData.paymentMode,
      paymentPlan: bookingData.paymentPlan,
      termsAccepted: bookingData.termsAccepted ?? true,
    };

    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  // Payment Recording & Receipt Generation
  const recordPayment = (
    paymentData: Omit<PaymentRecord, 'id' | 'receiptNumber'>
  ): PaymentRecord => {
    const nextNum = 100 + payments.length + 1;
    const newRecord: PaymentRecord = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      receiptNumber: `KK-REC-2026-${String(nextNum).padStart(3, '0')}`,
    };

    setPayments((prev) => [newRecord, ...prev]);

    // Synchronize linked booking
    if (paymentData.bookingId) {
      setBookings((prev) =>
        prev.map((b) => {
          if (b.id !== paymentData.bookingId) return b;
          const newPaid = (b.paidAmount || 0) + paymentData.amount;
          const targetTotal = b.budgetEstimate || paymentData.totalBillAmount || 0;
          const newStatus: PaymentStatus =
            targetTotal > 0 && newPaid >= targetTotal ? 'Paid' : 'Partially Paid';
          return {
            ...b,
            paidAmount: newPaid,
            paymentStatus: newStatus,
            paymentMode: paymentData.paymentMode,
            paymentPlan: paymentData.paymentPlan,
          };
        })
      );
    }

    // Synchronize linked invoice
    if (paymentData.invoiceId) {
      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.id !== paymentData.invoiceId) return inv;
          const newPaid = (inv.paidAmount || 0) + paymentData.amount;
          const newStatus: PaymentStatus =
            newPaid >= inv.grandTotal ? 'Paid' : 'Partially Paid';
          return {
            ...inv,
            paidAmount: newPaid,
            paymentStatus: newStatus,
            paymentMode: paymentData.paymentMode,
            paymentDate: paymentData.date,
          };
        })
      );
    }

    return newRecord;
  };

  const updatePaymentStatus = (id: string, status: PaymentStatus, transactionRef?: string) => {
    setPayments((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        return {
          ...p,
          status,
          transactionRef: transactionRef !== undefined ? transactionRef : p.transactionRef,
        };
      })
    );
  };

  const updatePaymentTerms = (newTerms: Partial<PaymentTermsConfig>) => {
    setSettings((prev) => ({
      ...prev,
      paymentTerms: {
        ...prev.paymentTerms,
        ...newTerms,
      },
    }));
  };

  const updateBookingStatus = (
    id: string,
    status: BookingStatus,
    notes?: string,
    progress?: number
  ) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        return {
          ...b,
          status,
          statusNotes: notes !== undefined ? notes : b.statusNotes,
          progressPercentage: progress !== undefined ? progress : b.progressPercentage,
        };
      })
    );
  };

  const assignProviderToBooking = (bookingId: string, providerId: string) => {
    const provider = providers.find((p) => p.id === providerId) || users.find((u) => u.id === providerId);
    const providerName = provider ? provider.name : 'Assigned Vendor';

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          assignedProviderId: providerId,
          assignedProviderName: providerName,
          status: b.status === 'Requested' ? 'Under Review' : b.status,
          statusNotes: `Technician ${providerName} assigned to site inspection.`,
        };
      })
    );
  };

  // Quotation Management
  const addQuotation = (
    quoteData: Omit<Quotation, 'id' | 'quotationNumber' | 'date'>
  ): Quotation => {
    const nextNum = 100 + quotations.length + 1;
    const newQuote: Quotation = {
      ...quoteData,
      id: `quot-${Date.now()}`,
      quotationNumber: `KK-QT-2026-${String(nextNum).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
    };

    setQuotations((prev) => [newQuote, ...prev]);

    if (quoteData.bookingId) {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === quoteData.bookingId
            ? { ...b, quotationId: newQuote.id, status: 'Quote Sent', progressPercentage: 25 }
            : b
        )
      );
    }

    return newQuote;
  };

  const approveQuotation = (id: string) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: 'Approved' } : q))
    );

    const quote = quotations.find((q) => q.id === id);
    if (quote && quote.bookingId) {
      updateBookingStatus(
        quote.bookingId,
        'Accepted',
        'Customer approved the quotation. Ready to schedule fabrication & execution.',
        40
      );
    }
  };

  const rejectQuotation = (id: string) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: 'Rejected' } : q))
    );
  };

  // GST Invoicing
  const createInvoiceFromBookingOrQuote = (
    bookingId?: string,
    quotationId?: string,
    customData?: Partial<GSTInvoice>
  ): GSTInvoice => {
    const nextNum = 100 + invoices.length + 1;
    const invNumber = `KK-INV-2026-${String(nextNum).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    const due = new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0];

    const quote = quotationId ? quotations.find((q) => q.id === quotationId) : undefined;
    const booking = bookingId ? bookings.find((b) => b.id === bookingId) : undefined;

    const baseCustomerName = customData?.customerName || quote?.customerName || booking?.customerName || 'Valued Client';
    const baseCustomerPhone = customData?.customerPhone || quote?.customerPhone || booking?.customerPhone || '+91 96546 10640';
    const baseCustomerEmail = customData?.customerEmail || quote?.customerEmail || booking?.customerEmail || 'billing@klickkar.com';
    const baseCustomerAddress = customData?.customerAddress || quote?.customerAddress || booking?.customerAddress || 'Noida, Uttar Pradesh, 201301';
    const placeOfSupply = customData?.placeOfSupply || '09-Uttar Pradesh';
    const stateCode = placeOfSupply.split('-')[0] || '09';

    let taxable = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;
    let grandTotal = 0;

    let items = customData?.items || [];

    if (items.length === 0 && quote) {
      items = quote.items.map((qi, idx) => {
        const gstBreak = calculateGSTBreakdown(qi.amount, stateCode, quote.gstRate || 18);
        return {
          id: `item-${idx}-${Date.now()}`,
          description: qi.description,
          hsnSac: qi.hsnSac || '7308',
          quantity: qi.quantity,
          unit: qi.unit,
          unitPrice: qi.unitPrice,
          taxableValue: qi.amount,
          gstRate: quote.gstRate || 18,
          cgstRate: gstBreak.cgstRate,
          cgstAmount: gstBreak.cgstAmount,
          sgstRate: gstBreak.sgstRate,
          sgstAmount: gstBreak.sgstAmount,
          igstRate: gstBreak.igstRate,
          igstAmount: gstBreak.igstAmount,
          total: gstBreak.grandTotal,
        };
      });
    } else if (items.length === 0 && booking) {
      const amount = booking.budgetEstimate || 45000;
      const gstBreak = calculateGSTBreakdown(amount, stateCode, 18);
      items = [
        {
          id: `item-bk-${Date.now()}`,
          description: `${booking.serviceName} - Site Execution & Materials`,
          hsnSac: '7308',
          quantity: 1,
          unit: 'Job',
          unitPrice: amount,
          taxableValue: amount,
          gstRate: 18,
          cgstRate: gstBreak.cgstRate,
          cgstAmount: gstBreak.cgstAmount,
          sgstRate: gstBreak.sgstRate,
          sgstAmount: gstBreak.sgstAmount,
          igstRate: gstBreak.igstRate,
          igstAmount: gstBreak.igstAmount,
          total: gstBreak.grandTotal,
        },
      ];
    }

    items.forEach((item) => {
      taxable += item.taxableValue;
      totalCgst += item.cgstAmount;
      totalSgst += item.sgstAmount;
      totalIgst += item.igstAmount;
      grandTotal += item.total;
    });

    const newInvoice: GSTInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invNumber,
      invoiceDate: today,
      dueDate: due,
      bookingId,
      quotationId,
      placeOfSupply,
      stateCode,
      reverseCharge: 'No',
      customerName: baseCustomerName,
      customerPhone: baseCustomerPhone,
      customerEmail: baseCustomerEmail,
      customerAddress: baseCustomerAddress,
      customerGstin: customData?.customerGstin || '',
      customerPan: customData?.customerPan || '',
      items,
      taxableAmount: taxable,
      totalCgst,
      totalSgst,
      totalIgst,
      grandTotal,
      amountInWords: numberToIndianWords(grandTotal),
      paymentStatus: customData?.paymentStatus || 'Unpaid',
      paymentMode: customData?.paymentMode,
      paymentDate: customData?.paymentDate,
      notes: customData?.notes || 'Thank you for your business. Subject to Noida jurisdiction.',
    };

    setInvoices((prev) => [newInvoice, ...prev]);

    if (bookingId) {
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, invoiceId: newInvoice.id } : b))
      );
    }

    return newInvoice;
  };

  const updateInvoicePayment = (
    invoiceId: string,
    status: GSTInvoice['paymentStatus'],
    mode?: GSTInvoice['paymentMode'],
    notes?: string
  ) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== invoiceId) return inv;
        return {
          ...inv,
          paymentStatus: status,
          paymentMode: mode || inv.paymentMode,
          paymentDate: status === 'Paid' ? new Date().toISOString().split('T')[0] : inv.paymentDate,
          notes: notes !== undefined ? notes : inv.notes,
        };
      })
    );
  };

  // Telegram Leads
  const addTelegramLead = (data: {
    name: string;
    phone: string;
    serviceRequired: string;
    location: string;
    budget: string;
    initialMessage?: string;
  }): TelegramLead => {
    const newLead: TelegramLead = {
      id: `lead-tg-${Date.now()}`,
      telegramChatId: String(Math.floor(100000000 + Math.random() * 900000000)),
      username: data.name.toLowerCase().replace(/\s+/g, '_'),
      name: data.name,
      phone: data.phone,
      serviceRequired: data.serviceRequired,
      location: data.location,
      budget: data.budget,
      status: 'New',
      createdAt: new Date().toISOString(),
      chatHistory: [
        {
          sender: 'user',
          message: data.initialMessage || `Interested in ${data.serviceRequired} at ${data.location}. Budget: ${data.budget}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        {
          sender: 'bot',
          message: `Namaste ${data.name}! KlickKar Lead Desk has received your enquiry for ${data.serviceRequired}. Our engineering manager is reviewing your requirements.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };

    setLeads((prev) => [newLead, ...prev]);
    return newLead;
  };

  const replyToTelegramLead = (leadId: string, message: string, sender: 'admin' | 'bot' = 'admin') => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== leadId) return lead;
        return {
          ...lead,
          status: lead.status === 'New' ? 'Contacted' : lead.status,
          chatHistory: [
            ...lead.chatHistory,
            {
              sender,
              message,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ],
        };
      })
    );
  };

  const updateLeadStatus = (leadId: string, status: TelegramLead['status']) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status } : l))
    );
  };

  const convertLeadToBooking = (leadId: string): Booking => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) throw new Error('Lead not found');

    const cleanBudget = parseInt(lead.budget.replace(/[^0-9]/g, ''), 10) || 50000;

    const matchedService = services.find(
      (s) =>
        s.name.toLowerCase().includes(lead.serviceRequired.toLowerCase()) ||
        s.category.toLowerCase().includes(lead.serviceRequired.toLowerCase())
    ) || services[0];

    const newBooking = addBooking({
      customerName: lead.name,
      customerPhone: lead.phone,
      customerEmail: `${lead.name.toLowerCase().replace(/\s+/g, '.')}@client.klickkar.com`,
      customerAddress: `${lead.location}, Uttar Pradesh`,
      serviceId: matchedService.id,
      serviceName: matchedService.name,
      serviceCategory: matchedService.category,
      serviceArea: lead.location.includes('Noida') ? 'Noida' : 'Delhi NCR',
      preferredDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      preferredTimeSlot: '11:00 AM - 02:00 PM',
      description: `Converted from Lead (${lead.id}). Service: ${lead.serviceRequired}. Budget: ${lead.budget}`,
      budgetEstimate: cleanBudget,
      urgency: 'Standard',
    });

    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId ? { ...l, status: 'Converted', linkedBookingId: newBooking.id } : l
      )
    );

    return newBooking;
  };

  // AI Chat Sessions
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
      bankAccount: {
        ...prev.bankAccount,
        ...(newSettings.bankAccount || {}),
      },
      whatsapp: {
        ...prev.whatsapp,
        ...(newSettings.whatsapp || {}),
      },
      telegram: {
        ...prev.telegram,
        ...(newSettings.telegram || {}),
      },
      aiChatbot: {
        ...prev.aiChatbot,
        ...(newSettings.aiChatbot || {}),
      },
    }));
  };

  const saveAiChatSession = (session: AIChatSession) => {
    setAiSessions((prev) => {
      const existingIdx = prev.findIndex((s) => s.id === session.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = session;
        return updated;
      }
      return [session, ...prev];
    });

    if (session.leadCaptured && session.leadCaptured.phone) {
      const phone = session.leadCaptured.phone;
      const alreadyLead = leads.some((l) => l.phone.includes(phone) || phone.includes(l.phone));
      if (!alreadyLead) {
        addTelegramLead({
          name: session.leadCaptured.name || 'AI Chat Customer',
          phone: session.leadCaptured.phone,
          serviceRequired: session.leadCaptured.serviceRequired || 'Engineering Service',
          location: session.leadCaptured.location || 'Noida NCR',
          budget: session.leadCaptured.budget || 'In Discussion',
          initialMessage: `Lead automatically captured via KlickKar Gemini AI Assistant (${session.messages.length} messages exchanged).`,
        });
      }
    }
  };

  const updateAiSessionStatus = (id: string, status: AIChatSession['status']) => {
    setAiSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const resetAllData = () => {
    setUsers(INITIAL_USERS);
    setCurrentUser(null);
    setRole('customer');
    setServices(INITIAL_SERVICES);
    setOffers(INITIAL_OFFERS);
    setSiteContent(INITIAL_SITE_CONTENT);
    setBookings(INITIAL_BOOKINGS);
    setQuotations(INITIAL_QUOTATIONS);
    setInvoices(INITIAL_INVOICES);
    setLeads(INITIAL_TELEGRAM_LEADS);
    setAiSessions(INITIAL_AI_SESSIONS);
    setSettings(OFFICIAL_COMPANY_DETAILS);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeNav,
        setActiveNav,
        currentUser,
        users,
        login,
        logout,
        registerCustomer,
        addUser,
        updateUserStatus,
        resetUserPassword,
        deleteUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTargetRole,
        openAuthModal,
        services,
        addService,
        updateService,
        deleteService,
        siteContent,
        updateSiteContent,
        offers,
        addOffer,
        updateOffer,
        deleteOffer,
        toggleOffer,
        providers,
        bookings,
        quotations,
        invoices,
        leads,
        settings,
        selectedInvoice,
        setSelectedInvoice,
        selectedQuotation,
        setSelectedQuotation,
        isBookingModalOpen,
        setIsBookingModalOpen,
        preselectedServiceId,
        openBookingForService,
        isTelegramModalOpen,
        setIsTelegramModalOpen,
        addBooking,
        updateBookingStatus,
        assignProviderToBooking,
        addQuotation,
        approveQuotation,
        rejectQuotation,
        createInvoiceFromBookingOrQuote,
        updateInvoicePayment,
        addTelegramLead,
        replyToTelegramLead,
        updateLeadStatus,
        convertLeadToBooking,
        aiSessions,
        saveAiChatSession,
        updateAiSessionStatus,
        updateSettings,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
