import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Booking,
  BookingStatus,
  GSTInvoice,
  Quotation,
  TelegramLead,
  InvoiceItem,
  AIChatSession,
  ServiceItem,
  OfferItem,
  UserAccount,
  UserRole,
} from '../../types';
import { formatINR, formatDateIN, calculateGSTBreakdown } from '../../utils/gstHelper';
import { exportInvoicePDF } from '../../utils/pdfGenerator';
import { OFFICIAL_COMPANY_DETAILS, ASSETS, SERVICE_AREAS } from '../../data/companyDetails';
import {
  Building2,
  TrendingUp,
  FileCheck2,
  Users,
  Send,
  MessageCircle,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Download,
  Printer,
  FileText,
  Clock,
  Sparkles,
  Bot,
  Settings,
  Landmark,
  ShieldAlert,
  ArrowRight,
  Eye,
  Check,
  Edit,
  Trash2,
  Tag,
  Percent,
  Image,
  Globe,
  Lock,
  ShieldCheck,
  KeyRound,
  AlertTriangle,
  UserCheck,
  Layers,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    openAuthModal,
    bookings,
    quotations,
    invoices,
    leads,
    aiSessions,
    providers,
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
    users,
    addUser,
    updateUserStatus,
    resetUserPassword,
    deleteUser,
    settings,
    updateBookingStatus,
    assignProviderToBooking,
    createInvoiceFromBookingOrQuote,
    updateInvoicePayment,
    setSelectedInvoice,
    setSelectedQuotation,
    replyToTelegramLead,
    updateLeadStatus,
    convertLeadToBooking,
    updateSettings,
    resetAllData,
  } = useApp();

  // Strict Password Protection & RBAC check for Admin
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl shadow-xl border border-rose-200 overflow-hidden text-center p-8 sm:p-12">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-wider border border-rose-200">
            Restricted Administrative Area
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
            Admin Authentication & Password Required
          </h2>
          <p className="text-slate-600 text-sm max-w-lg mx-auto mt-2 mb-8">
            This control center provides administrative control over service pricing, CMS website content, vendor assignments, customer data, and GST invoicing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openAuthModal('admin')}
              className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Enter Admin Password</span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 max-w-md mx-auto">
            <p className="text-xs text-slate-500 mb-2 font-medium">Official Admin Account:</p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">Admin</span> (Executive Director)
                <div className="text-[11px] text-slate-500 font-mono">admin@klickkar.com</div>
              </div>
              <button
                onClick={() => openAuthModal('admin')}
                className="bg-rose-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg hover:bg-rose-700 cursor-pointer"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<
    'overview' | 'services' | 'content_offers' | 'bookings' | 'invoices' | 'quotations' | 'leads' | 'users_rbac' | 'settings'
  >('overview');

  const [bookingFilter, setBookingFilter] = useState<string>('All');
  const [invoiceFilter, setInvoiceFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Service Management Modal States
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [serviceName, setServiceName] = useState('');
  const [serviceCategory, setServiceCategory] = useState('Prefabrication');
  const [serviceHsn, setServiceHsn] = useState('7308');
  const [servicePrice, setServicePrice] = useState(180000);
  const [serviceUnit, setServiceUnit] = useState('per unit');
  const [serviceImg, setServiceImg] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [serviceFeatures, setServiceFeatures] = useState('');
  const [servicePopular, setServicePopular] = useState(false);

  // Offers Management States
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerCode, setOfferCode] = useState('');
  const [offerTitle, setOfferTitle] = useState('');
  const [offerPercent, setOfferPercent] = useState(10);
  const [offerMax, setOfferMax] = useState(25000);
  const [offerDesc, setOfferDesc] = useState('');
  const [offerValidTill, setOfferValidTill] = useState('2026-12-31');

  // Website Content CMS Form States
  const [contentForm, setContentForm] = useState(siteContent);
  const [contentSavedMsg, setContentSavedMsg] = useState(false);

  // User RBAC Management States
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPass, setNewUserPass] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('provider');
  const [newUserPhone, setNewUserPhone] = useState('+91 ');
  const [newUserCompany, setNewUserCompany] = useState('');
  const [resetPassModalUser, setResetPassModalUser] = useState<UserAccount | null>(null);
  const [newPassVal, setNewPassVal] = useState('');

  // Invoice Generator Modal
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [newInvCustomer, setNewInvCustomer] = useState('');
  const [newInvPhone, setNewInvPhone] = useState('+91 ');
  const [newInvAddress, setNewInvAddress] = useState('Noida, Uttar Pradesh');
  const [newInvGstin, setNewInvGstin] = useState('');
  const [newInvPlaceOfSupply, setNewInvPlaceOfSupply] = useState('09-Uttar Pradesh');
  const [newInvDesc, setNewInvDesc] = useState('Prefabrication Porta Cabin Structure Fabrication');
  const [newInvHsn, setNewInvHsn] = useState('7308');
  const [newInvAmount, setNewInvAmount] = useState<number>(180000);

  // Lead chat reply state
  const [activeLeadForReply, setActiveLeadForReply] = useState<TelegramLead | null>(null);
  const [replyText, setReplyText] = useState('');

  // Metrics
  const totalRevenue = invoices
    .filter((inv) => inv.paymentStatus === 'Paid')
    .reduce((acc, inv) => acc + inv.grandTotal, 0);

  const pendingRevenue = invoices
    .filter((inv) => inv.paymentStatus !== 'Paid' && inv.paymentStatus !== 'Cancelled')
    .reduce((acc, inv) => acc + inv.grandTotal, 0);

  const activeBookingsCount = bookings.filter(
    (b) => b.status !== 'Completed' && b.status !== 'Cancelled'
  ).length;

  const totalLeadsCount = leads.length + aiSessions.filter((s) => s.leadCaptured).length;

  // Handlers for Services
  const openNewServiceModal = () => {
    setEditingService(null);
    setServiceName('');
    setServiceCategory('Prefabrication');
    setServiceHsn('7308');
    setServicePrice(15000);
    setServiceUnit('per unit');
    setServiceImg('https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=800');
    setServiceDesc('');
    setServiceFeatures('Heavy-duty grade materials\nPrecision engineering\n1-Year comprehensive warranty');
    setServicePopular(false);
    setShowServiceModal(true);
  };

  const openEditServiceModal = (s: ServiceItem) => {
    setEditingService(s);
    setServiceName(s.name);
    setServiceCategory(s.category);
    setServiceHsn(s.hsnSac);
    setServicePrice(s.basePrice);
    setServiceUnit(s.unit);
    setServiceImg(s.imageUrl);
    setServiceDesc(s.description);
    setServiceFeatures(s.features.join('\n'));
    setServicePopular(!!s.popular);
    setShowServiceModal(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    const featArray = serviceFeatures
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    if (editingService) {
      updateService({
        ...editingService,
        name: serviceName,
        category: serviceCategory,
        hsnSac: serviceHsn,
        basePrice: Number(servicePrice),
        unit: serviceUnit,
        imageUrl: serviceImg || editingService.imageUrl,
        description: serviceDesc,
        features: featArray,
        popular: servicePopular,
      });
    } else {
      addService({
        name: serviceName,
        category: serviceCategory,
        hsnSac: serviceHsn,
        basePrice: Number(servicePrice),
        unit: serviceUnit,
        imageUrl: serviceImg || 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=800',
        description: serviceDesc,
        features: featArray,
        popular: servicePopular,
      });
    }
    setShowServiceModal(false);
  };

  // Handlers for Offers
  const handleSaveOffer = (e: React.FormEvent) => {
    e.preventDefault();
    addOffer({
      code: offerCode.toUpperCase().trim(),
      title: offerTitle.trim(),
      discountPercentage: Number(offerPercent),
      maxDiscount: Number(offerMax),
      description: offerDesc.trim(),
      validUntil: offerValidTill,
      active: true,
    });
    setShowOfferModal(false);
    setOfferCode('');
    setOfferTitle('');
    setOfferDesc('');
  };

  // Handlers for Content CMS
  const handleSaveContentCMS = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteContent(contentForm);
    setContentSavedMsg(true);
    setTimeout(() => setContentSavedMsg(false), 3000);
  };

  // Handlers for User RBAC
  const handleSaveNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail || !newUserPass) return;
    addUser({
      name: newUserName,
      email: newUserEmail.toLowerCase().trim(),
      password: newUserPass.trim(),
      role: newUserRole,
      phone: newUserPhone,
      companyName: newUserCompany,
      status: 'Active',
    });
    setShowUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPass('');
  };

  const handleCreateCustomInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const stateCode = newInvPlaceOfSupply.split('-')[0] || '09';
    const gstBreak = calculateGSTBreakdown(newInvAmount, stateCode, 18);

    const items: InvoiceItem[] = [
      {
        id: `item-${Date.now()}`,
        description: newInvDesc,
        hsnSac: newInvHsn,
        quantity: 1,
        unit: 'Job',
        unitPrice: newInvAmount,
        taxableValue: newInvAmount,
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

    const newInv = createInvoiceFromBookingOrQuote(undefined, undefined, {
      customerName: newInvCustomer || 'Corporate Client',
      customerPhone: newInvPhone,
      customerAddress: newInvAddress,
      customerGstin: newInvGstin,
      placeOfSupply: newInvPlaceOfSupply,
      items,
      paymentStatus: 'Unpaid',
    });

    setShowCreateInvoiceModal(false);
    setSelectedInvoice(newInv);
  };

  const handleSendLeadReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLeadForReply || !replyText.trim()) return;

    replyToTelegramLead(activeLeadForReply.id, replyText.trim(), 'admin');
    setReplyText('');
    const updated = leads.find((l) => l.id === activeLeadForReply.id);
    if (updated) setActiveLeadForReply(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Business KPIs */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950 px-2.5 py-0.5 rounded border border-rose-800 uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Master Control Panel</span>
              </span>
              <span className="text-xs text-slate-400">Noida Head Office</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              KlickKar.com Enterprise Operations
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Legal: {settings.legalEntity} • GSTIN: {settings.gstin} • Kotak Bank A/C: {settings.bankAccount.accountNumber}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowCreateInvoiceModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Generate GST Invoice</span>
            </button>
            <button
              onClick={openNewServiceModal}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Service</span>
            </button>
            <button
              onClick={resetAllData}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-2.5 rounded-xl border border-slate-700 transition-all cursor-pointer"
              title="Reset all dummy data back to seed state"
            >
              Reset Data
            </button>
          </div>
        </div>

        {/* 4 Key Business Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Paid GST Revenue</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400 mt-1">
              {formatINR(totalRevenue)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Verified Bank Credits</div>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Receivables / Unpaid</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-amber-400 mt-1">
              {formatINR(pendingRevenue)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Outstanding Invoices</div>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Active Work Orders</span>
              <FileCheck2 className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-sky-400 mt-1">
              {activeBookingsCount}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Assigned to Technicians</div>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Captured Leads</span>
              <Bot className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-rose-400 mt-1">
              {totalLeadsCount}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Telegram & AI Chat</div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Analytics & Reports</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-2 ${
            activeTab === 'services'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Services CMS ({services.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('content_offers')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-2 ${
            activeTab === 'content_offers'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Website Content & Offers</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-2 ${
            activeTab === 'bookings'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Bookings & Vendors ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-2 ${
            activeTab === 'invoices'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>GST Invoices ({invoices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quotations')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-2 ${
            activeTab === 'quotations'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Quotations ({quotations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-2 ${
            activeTab === 'leads'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Send className="w-4 h-4 text-sky-500" />
          <span>Leads & Telegram ({leads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users_rbac')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-2 ${
            activeTab === 'users_rbac'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users & RBAC ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Company & Settings</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Financial Performance & Tax Summary</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500">Gross Taxable Value</div>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-1">
                    {formatINR(invoices.reduce((acc, i) => acc + i.taxableAmount, 0))}
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500">Total GST Liability (18%)</div>
                  <div className="text-lg font-bold font-mono text-blue-700 mt-1">
                    {formatINR(invoices.reduce((acc, i) => acc + i.totalCgst + i.totalSgst + i.totalIgst, 0))}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">CGST 9% + SGST 9% / IGST 18%</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500">Total Invoiced Amount</div>
                  <div className="text-lg font-bold font-mono text-emerald-700 mt-1">
                    {formatINR(invoices.reduce((acc, i) => acc + i.grandTotal, 0))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-700 uppercase mb-3">Statutory Banking Records</h3>
                <div className="bg-slate-900 text-white p-4 rounded-xl text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bank Name:</span>
                    <span className="font-bold">{settings.bankAccount.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Account Holder:</span>
                    <span className="font-bold">{settings.bankAccount.accountHolder}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Account Number:</span>
                    <span className="font-mono font-bold text-amber-400">{settings.bankAccount.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">IFSC Code:</span>
                    <span className="font-mono font-bold text-amber-400">{settings.bankAccount.ifsc}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Branch Location:</span>
                    <span>{settings.bankAccount.branch}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" />
                <span>Field Technicians & Capacity</span>
              </h2>

              <div className="space-y-3">
                {providers.map((p) => (
                  <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{p.name}</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                        {p.status}
                      </span>
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      {p.specialization.join(', ')}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-600">
                      <span>Assigned Jobs: {bookings.filter((b) => b.assignedProviderId === p.id).length}</span>
                      <span>Rating: ⭐ {p.rating} / 5</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SERVICES CMS */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Live Service Catalog & Pricing Rules</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Add, edit, or delete services, upload images, set base rates, HSN codes, and bullet specifications.
              </p>
            </div>
            <button
              onClick={openNewServiceModal}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Service</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div
                key={s.id}
                className="rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow bg-white"
              >
                <div>
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img src={s.imageUrl} alt={s.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {s.category}
                    </span>
                    {s.popular && (
                      <span className="absolute top-2.5 right-2.5 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        Popular
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-sm text-slate-900">{s.name}</h3>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        HSN: {s.hsnSac}
                      </span>
                    </div>

                    <div className="text-xs font-black text-blue-700">
                      {formatINR(s.basePrice)} <span className="text-slate-500 font-normal">{s.unit}</span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">{s.description}</p>

                    <div className="pt-2 border-t border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Key Features</div>
                      <ul className="text-[11px] text-slate-600 space-y-0.5 list-disc pl-4">
                        {s.features.slice(0, 3).map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => openEditServiceModal(s)}
                    className="text-xs text-blue-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Service</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${s.name}?`)) {
                        deleteService(s.id);
                      }
                    }}
                    className="text-xs text-rose-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: WEBSITE CONTENT & OFFERS CMS */}
      {activeTab === 'content_offers' && (
        <div className="space-y-6">
          {/* Website Content Editor */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <span>Website Content CMS (Home, Banners & About Us)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live updates to headlines, banner text, and corporate descriptions.
                </p>
              </div>
              {contentSavedMsg && (
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                  ✓ Website Content Saved!
                </span>
              )}
            </div>

            <form onSubmit={handleSaveContentCMS} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Top Announcement Bar</label>
                  <input
                    type="text"
                    value={contentForm.announcementBar}
                    onChange={(e) => setContentForm({ ...contentForm, announcementBar: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Hero Tagline</label>
                  <input
                    type="text"
                    value={contentForm.heroTagline}
                    onChange={(e) => setContentForm({ ...contentForm, heroTagline: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Hero Main Headline</label>
                <input
                  type="text"
                  value={contentForm.heroHeadline}
                  onChange={(e) => setContentForm({ ...contentForm, heroHeadline: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Hero Subheadline</label>
                <textarea
                  rows={2}
                  value={contentForm.heroSubheadline}
                  onChange={(e) => setContentForm({ ...contentForm, heroSubheadline: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">About Us Section Headline</label>
                  <input
                    type="text"
                    value={contentForm.aboutHeadline}
                    onChange={(e) => setContentForm({ ...contentForm, aboutHeadline: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Footer Statutory Notice</label>
                  <input
                    type="text"
                    value={contentForm.footerNotice}
                    onChange={(e) => setContentForm({ ...contentForm, footerNotice: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  Save Website Content Changes
                </button>
              </div>
            </form>
          </div>

          {/* Offers & Discounts CMS */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-amber-600" />
                  <span>Offers, Coupons & Discounts</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure promo codes and percentage discounts applied during quotation estimation.
                </p>
              </div>
              <button
                onClick={() => setShowOfferModal(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Offer</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {offers.map((off) => (
                <div
                  key={off.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    off.active ? 'bg-amber-50/50 border-amber-300' : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm bg-amber-600 text-white px-2 py-0.5 rounded-lg">
                      {off.code}
                    </span>
                    <button
                      onClick={() => toggleOffer(off.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer ${
                        off.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {off.active ? 'Active' : 'Disabled'}
                    </button>
                  </div>

                  <h3 className="font-bold text-xs text-slate-900 mt-2">{off.title}</h3>
                  <div className="text-base font-black text-amber-900 mt-0.5">
                    {off.discountPercentage}% OFF
                    {off.maxDiscount && (
                      <span className="text-xs font-normal text-slate-500 ml-1">
                        (Up to {formatINR(off.maxDiscount)})
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">{off.description}</p>
                  <div className="mt-3 pt-2 border-t border-amber-200/60 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Valid till: {off.validUntil}</span>
                    <button
                      onClick={() => deleteOffer(off.id)}
                      className="text-rose-600 font-bold hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BOOKINGS & VENDOR ASSIGNMENT */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Project Bookings & Vendor Delegation</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Assign jobs to field technicians, update milestones, and prepare official quotations.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold">Filter:</span>
              <select
                value={bookingFilter}
                onChange={(e) => setBookingFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Requested">Requested</option>
                <option value="Under Review">Under Review</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {bookings
              .filter((b) => (bookingFilter === 'All' ? true : b.status === bookingFilter))
              .map((b) => (
                <div
                  key={b.id}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all bg-white shadow-xs space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded border border-slate-200">
                          {b.bookingNumber}
                        </span>
                        <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                          {b.status}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          Created: {b.createdAt}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{b.serviceName}</h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Client: <span className="font-bold text-slate-800">{b.customerName}</span> ({b.customerPhone}) • {b.customerAddress}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => {
                          const quote = quotations.find((q) => q.bookingId === b.id);
                          if (quote) setSelectedQuotation(quote);
                        }}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                      >
                        Quotation
                      </button>

                      <button
                        onClick={() => {
                          const inv = createInvoiceFromBookingOrQuote(b.id);
                          setSelectedInvoice(inv);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl cursor-pointer shadow-xs"
                      >
                        Generate GST Invoice
                      </button>
                    </div>
                  </div>

                  {/* Vendor Assignment Dropdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Assigned Vendor / Technician
                      </label>
                      <select
                        value={b.assignedProviderId || ''}
                        onChange={(e) => assignProviderToBooking(b.id, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Unassigned</option>
                        {providers.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.specialization[0]})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Status & Lifecycle
                      </label>
                      <select
                        value={b.status}
                        onChange={(e) => updateBookingStatus(b.id, e.target.value as BookingStatus)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Requested">Requested</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Quote Sent">Quote Sent</option>
                        <option value="Accepted">Accepted</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Estimated Scope Value
                      </label>
                      <div className="text-base font-black text-slate-900">
                        {formatINR(b.budgetEstimate || 0)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 5: GST TAX INVOICES */}
      {activeTab === 'invoices' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">GST-Compliant Tax Invoices</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Official invoices with CGST/SGST/IGST breakdown, HSN/SAC codes, and instant PDF generation.
              </p>
            </div>
            <button
              onClick={() => setShowCreateInvoiceModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Tax Invoice</span>
            </button>
          </div>

          <div className="space-y-4">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-blue-50 text-blue-900 px-2.5 py-0.5 rounded border border-blue-200">
                      {inv.invoiceNumber}
                    </span>
                    <span className="text-xs text-slate-500">Date: {formatDateIN(inv.invoiceDate)}</span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                        inv.paymentStatus === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}
                    >
                      {inv.paymentStatus}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 mt-1.5">
                    {inv.customerName} {inv.customerGstin && `(GSTIN: ${inv.customerGstin})`}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Taxable: {formatINR(inv.taxableAmount)} • Tax: {formatINR(inv.totalCgst + inv.totalSgst + inv.totalIgst)} • Supply: {inv.placeOfSupply}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Grand Total</div>
                    <div className="text-lg font-black text-blue-700 font-mono">
                      {formatINR(inv.grandTotal)}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedInvoice(inv)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View / Print</span>
                  </button>

                  <button
                    onClick={() => exportInvoicePDF(inv)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 py-2 rounded-xl border border-slate-300 transition-all cursor-pointer flex items-center gap-1"
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4 text-slate-600" />
                    <span>PDF</span>
                  </button>

                  {inv.paymentStatus !== 'Paid' && (
                    <button
                      onClick={() => updateInvoicePayment(inv.id, 'Paid', 'Bank Transfer (NEFT/RTGS)')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer"
                      title="Mark as Paid"
                    >
                      Mark Paid
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: QUOTATIONS */}
      {activeTab === 'quotations' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Itemized Commercial Quotations</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Detailed scope proposals with materials, labour, equipment breakdown, and customer acceptance tracking.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {quotations.map((q) => (
              <div
                key={q.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-amber-50 text-amber-900 px-2.5 py-0.5 rounded border border-amber-200">
                      {q.quotationNumber}
                    </span>
                    <span className="text-xs text-slate-500">Date: {formatDateIN(q.date)}</span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {q.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mt-1.5">
                    {q.customerName} • {q.serviceCategory}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {q.items.length} line items • Valid until: {formatDateIN(q.validUntil)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Estimated Total</div>
                    <div className="text-lg font-black text-slate-900 font-mono">
                      {formatINR(q.grandTotal)}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedQuotation(q)}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Quotation</span>
                  </button>

                  <button
                    onClick={() => {
                      const inv = createInvoiceFromBookingOrQuote(undefined, q.id);
                      setSelectedInvoice(inv);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>Convert to Invoice</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: LEADS & TELEGRAM */}
      {activeTab === 'leads' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-5 h-5 text-sky-500" />
                <span>Captured Telegram & AI Chat Leads</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct two-way messaging, lead qualification, and one-click booking conversion.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Leads List */}
            <div className="lg:col-span-1 space-y-3">
              {leads.map((l) => (
                <div
                  key={l.id}
                  onClick={() => setActiveLeadForReply(l)}
                  className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                    activeLeadForReply?.id === l.id
                      ? 'bg-sky-50/70 border-sky-400 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{l.name}</span>
                    <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full">{l.status}</span>
                  </div>
                  <div className="text-slate-600 text-[11px] mt-1 font-semibold">{l.serviceRequired}</div>
                  <div className="text-slate-500 text-[10px] mt-0.5">{l.location} • Budget: {l.budget}</div>
                </div>
              ))}
            </div>

            {/* Conversation Window */}
            <div className="lg:col-span-2 bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between h-[450px]">
              {activeLeadForReply ? (
                <>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <div className="font-bold text-sm text-slate-900">{activeLeadForReply.name}</div>
                      <div className="text-xs text-slate-500">
                        Phone: {activeLeadForReply.phone} • TG ID: {activeLeadForReply.telegramChatId}
                      </div>
                    </div>

                    <button
                      onClick={() => convertLeadToBooking(activeLeadForReply.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      Convert to Official Booking
                    </button>
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 overflow-y-auto space-y-3 p-2 my-3">
                    {activeLeadForReply.chatHistory.map((m, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col ${
                          m.sender === 'user' ? 'items-start' : 'items-end'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs ${
                            m.sender === 'user'
                              ? 'bg-white border border-slate-200 text-slate-800'
                              : m.sender === 'bot'
                              ? 'bg-sky-100 text-sky-900'
                              : 'bg-rose-600 text-white'
                          }`}
                        >
                          <div className="text-[9px] font-bold opacity-75 uppercase mb-0.5">
                            {m.sender === 'user' ? 'Customer' : m.sender === 'bot' ? 'Automated Bot' : 'Admin'}
                          </div>
                          <p>{m.message}</p>
                          <span className="text-[9px] opacity-60 text-right block mt-0.5">
                            {m.timestamp}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reply Input */}
                  <form onSubmit={handleSendLeadReply} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type official reply to client's Telegram..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <button
                      type="submit"
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs">
                  <Send className="w-10 h-10 mb-2 opacity-40" />
                  <span>Select a captured lead from the left to view message history or reply.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: USERS & RBAC MANAGEMENT */}
      {activeTab === 'users_rbac' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-rose-600" />
                <span>Role-Based Access Control (RBAC) & Accounts</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage all three separate login levels: Administrators, Field Vendors, and Customers.
              </p>
            </div>
            <button
              onClick={() => setShowUserModal(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Account</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3 rounded-l-lg">User Name & Firm</th>
                  <th className="p-3">Email & Phone</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Last Login</th>
                  <th className="p-3 text-right rounded-r-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{u.name}</div>
                      {u.companyName && (
                        <div className="text-[11px] text-slate-500">{u.companyName}</div>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="text-slate-800 font-mono">{u.email}</div>
                      <div className="text-[11px] text-slate-500">{u.phone}</div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                          u.role === 'admin'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : u.role === 'provider'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {u.role === 'provider' ? 'Vendor' : u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => updateUserStatus(u.id, u.status === 'Active' ? 'Suspended' : 'Active')}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer ${
                          u.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                        title="Click to toggle Active / Suspended"
                      >
                        {u.status}
                      </button>
                    </td>
                    <td className="p-3 text-slate-500 text-[11px]">{u.lastLogin || 'Never'}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setResetPassModalUser(u);
                          setNewPassVal('');
                        }}
                        className="text-blue-600 hover:underline font-bold text-[11px] cursor-pointer"
                      >
                        Reset Password
                      </button>

                      {u.id !== currentUser.id && (
                        <button
                          onClick={() => {
                            if (confirm(`Delete account for ${u.name}?`)) {
                              deleteUser(u.id);
                            }
                          }}
                          className="text-rose-600 hover:underline font-bold text-[11px] cursor-pointer"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 9: COMPANY SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-slate-700" />
              <span>Official Company Statutory & Banking Parameters</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              These details strictly appear on all official GST tax invoices, quotations, and footers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 uppercase text-[11px]">Mitaksh Infra Statutory Record</h3>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Legal Entity:</span>
                <span className="font-bold">{settings.legalEntity}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">GSTIN:</span>
                <span className="font-mono font-bold text-blue-700">{settings.gstin}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">CIN:</span>
                <span className="font-mono font-bold">{settings.cin}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">PAN / TAN:</span>
                <span className="font-mono font-bold">{settings.pan} / {settings.tan}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">MSME Udyam:</span>
                <span className="font-mono font-bold">{settings.msme}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 uppercase text-[11px]">Kotak Mahindra Current Account</h3>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Account Holder:</span>
                <span className="font-bold">{settings.bankAccount.accountHolder}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Account Number:</span>
                <span className="font-mono font-bold text-blue-700">{settings.bankAccount.accountNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">IFSC Code:</span>
                <span className="font-mono font-bold text-blue-700">{settings.bankAccount.ifsc}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Branch:</span>
                <span>{settings.bankAccount.branch}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT SERVICE */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900">
              {editingService ? `Edit Service: ${editingService.name}` : 'Add New Service'}
            </h3>

            <form onSubmit={handleSaveService} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Service Name *</label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  required
                  placeholder="e.g. Modular Security Guard Cabin"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="Prefabrication">Prefabrication</option>
                    <option value="Fabrication">Fabrication</option>
                    <option value="Automation">Automation</option>
                    <option value="Security">Security</option>
                    <option value="Renovation">Renovation</option>
                    <option value="Construction">Construction</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="KlickKar Property">KlickKar Property</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">HSN / SAC Code</label>
                  <input
                    type="text"
                    value={serviceHsn}
                    onChange={(e) => setServiceHsn(e.target.value)}
                    placeholder="7308 / 9954"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    value={servicePrice}
                    onChange={(e) => setServicePrice(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Pricing Unit</label>
                  <input
                    type="text"
                    value={serviceUnit}
                    onChange={(e) => setServiceUnit(e.target.value)}
                    placeholder="per unit / per sq. ft / per job"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Image URL</label>
                <input
                  type="url"
                  value={serviceImg}
                  onChange={(e) => setServiceImg(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={serviceDesc}
                  onChange={(e) => setServiceDesc(e.target.value)}
                  placeholder="Detailed engineering scope of work..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Features (One per line)</label>
                <textarea
                  rows={3}
                  value={serviceFeatures}
                  onChange={(e) => setServiceFeatures(e.target.value)}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="popCheck"
                  checked={servicePopular}
                  onChange={(e) => setServicePopular(e.target.checked)}
                  className="accent-rose-600 rounded"
                />
                <label htmlFor="popCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Mark as Popular / Featured Service
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
                >
                  {editingService ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE OFFER */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Create Promotional Discount Offer</h3>

            <form onSubmit={handleSaveOffer} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    value={offerCode}
                    onChange={(e) => setOfferCode(e.target.value)}
                    required
                    placeholder="e.g. MONSOON15"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Discount % *</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={offerPercent}
                    onChange={(e) => setOfferPercent(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Offer Title *</label>
                <input
                  type="text"
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  required
                  placeholder="e.g. Pre-Fabrication Seasonal Rebate"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Max Cap (₹)</label>
                <input
                  type="number"
                  value={offerMax}
                  onChange={(e) => setOfferMax(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={offerDesc}
                  onChange={(e) => setOfferDesc(e.target.value)}
                  placeholder="Terms and conditions..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Valid Until</label>
                <input
                  type="date"
                  value={offerValidTill}
                  onChange={(e) => setOfferValidTill(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs"
                >
                  Publish Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW USER */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add User / Partner Account</h3>

            <form onSubmit={handleSaveNewUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Account Role *</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                >
                  <option value="provider">Vendor / Field Technician</option>
                  <option value="customer">Customer</option>
                  <option value="admin">Administrator (Full Access)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  required
                  placeholder="e.g. Satish Sharma"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Email *</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  required
                  placeholder="satish@example.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Password *</label>
                <input
                  type="text"
                  value={newUserPass}
                  onChange={(e) => setNewUserPass(e.target.value)}
                  required
                  placeholder="Set initial password"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Firm Name</label>
                  <input
                    type="text"
                    value={newUserCompany}
                    onChange={(e) => setNewUserCompany(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESET PASSWORD */}
      {resetPassModalUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Reset Password for {resetPassModalUser.name}
            </h3>
            <p className="text-xs text-slate-500">
              Account: {resetPassModalUser.email} ({resetPassModalUser.role})
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newPassVal.trim()) {
                  resetUserPassword(resetPassModalUser.id, newPassVal.trim());
                  setResetPassModalUser(null);
                }
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  New Password
                </label>
                <input
                  type="text"
                  required
                  value={newPassVal}
                  onChange={(e) => setNewPassVal(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResetPassModalUser(null)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE CUSTOM INVOICE */}
      {showCreateInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900">Generate Official GST Tax Invoice</h3>
            <p className="text-xs text-slate-500">
              Under Mitaksh Infra (OPC) Private Limited • GSTIN: {settings.gstin}
            </p>

            <form onSubmit={handleCreateCustomInvoice} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Customer / Firm Name *</label>
                <input
                  type="text"
                  required
                  value={newInvCustomer}
                  onChange={(e) => setNewInvCustomer(e.target.value)}
                  placeholder="e.g. Apex Industrial Solutions Ltd"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newInvPhone}
                    onChange={(e) => setNewInvPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Client GSTIN</label>
                  <input
                    type="text"
                    value={newInvGstin}
                    onChange={(e) => setNewInvGstin(e.target.value)}
                    placeholder="e.g. 09AABCS1429B1Z8"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Place of Supply *</label>
                <select
                  value={newInvPlaceOfSupply}
                  onChange={(e) => setNewInvPlaceOfSupply(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                >
                  <option value="09-Uttar Pradesh">09-Uttar Pradesh (Intra-State: CGST 9% + SGST 9%)</option>
                  <option value="07-Delhi">07-Delhi (Inter-State: IGST 18%)</option>
                  <option value="06-Haryana">06-Haryana (Inter-State: IGST 18%)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Site / Billing Address</label>
                <input
                  type="text"
                  value={newInvAddress}
                  onChange={(e) => setNewInvAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Service Description</label>
                <input
                  type="text"
                  value={newInvDesc}
                  onChange={(e) => setNewInvDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">HSN/SAC Code</label>
                  <input
                    type="text"
                    value={newInvHsn}
                    onChange={(e) => setNewInvHsn(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Taxable Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newInvAmount}
                    onChange={(e) => setNewInvAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl text-blue-900 border border-blue-200">
                <div className="flex justify-between font-bold">
                  <span>Grand Total (with 18% GST):</span>
                  <span>{formatINR(newInvAmount * 1.18)}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateInvoiceModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs"
                >
                  Generate Tax Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
