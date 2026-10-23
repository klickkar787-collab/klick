import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatDateIN } from '../../utils/gstHelper';
import { exportInvoicePDF } from '../../utils/pdfGenerator';
import {
  FileText,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Printer,
  Download,
  Plus,
  Search,
  ExternalLink,
  ChevronRight,
  User,
  ShieldCheck,
  CreditCard,
  Building,
  Lock,
  ArrowRight,
  Eye,
} from 'lucide-react';

export const CustomerPortal: React.FC = () => {
  const {
    bookings,
    quotations,
    invoices,
    currentUser,
    openAuthModal,
    setSelectedInvoice,
    setSelectedQuotation,
    setIsBookingModalOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'invoices' | 'quotes'>('orders');
  const [searchTerm, setSearchTerm] = useState('');

  // Strict Privacy Enforcement: If user is not logged in as a customer or admin, prompt for login
  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden text-center p-8 sm:p-12">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <Lock className="w-8 h-8" />
          </div>
          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider border border-blue-200">
            Protected Customer Account Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
            Sign In to View Your Bookings & GST Invoices
          </h2>
          <p className="text-slate-600 text-sm max-w-lg mx-auto mt-2 mb-8">
            To protect your privacy and corporate data, project orders, itemized quotations, and GST tax invoices are strictly accessible only by registered account holders.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openAuthModal('customer')}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Customer Sign In</span>
            </button>
            <button
              onClick={() => openAuthModal('customer')}
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-3 rounded-xl text-sm border border-slate-300 transition-all cursor-pointer"
            >
              <span>Register New Account</span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 max-w-md mx-auto">
            <p className="text-xs text-slate-500 mb-2 font-medium">Demo Customer Access:</p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">Anil Gupta</span> (Sharma Enterprises)
                <div className="text-[11px] text-slate-500 font-mono">anil.gupta@sharmaenterprises.in</div>
              </div>
              <button
                onClick={() => openAuthModal('customer')}
                className="bg-blue-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Strict Data Isolation:
  // If customer is logged in, ONLY show their bookings/quotations/invoices!
  const userEmail = currentUser.email.toLowerCase();
  const userPhone = currentUser.phone ? currentUser.phone.replace(/[^0-9]/g, '').slice(-10) : '';

  const myBookings = bookings.filter((b) => {
    if (currentUser.role === 'admin') return true; // Admins can audit all
    const matchesEmail = b.customerEmail.toLowerCase() === userEmail;
    const matchesPhone = userPhone && b.customerPhone.replace(/[^0-9]/g, '').slice(-10) === userPhone;
    return matchesEmail || matchesPhone;
  });

  const myQuotations = quotations.filter((q) => {
    if (currentUser.role === 'admin') return true;
    const matchesEmail = q.customerEmail.toLowerCase() === userEmail;
    const matchesPhone = userPhone && q.customerPhone.replace(/[^0-9]/g, '').slice(-10) === userPhone;
    return matchesEmail || matchesPhone;
  });

  const myInvoices = invoices.filter((inv) => {
    if (currentUser.role === 'admin') return true;
    const matchesEmail = inv.customerEmail.toLowerCase() === userEmail;
    const matchesPhone = userPhone && inv.customerPhone.replace(/[^0-9]/g, '').slice(-10) === userPhone;
    return matchesEmail || matchesPhone;
  });

  const filteredBookings = myBookings.filter(
    (b) =>
      b.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Scheduled':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'Quote Sent':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Accepted':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'Under Review':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner with User Account Greeting */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-200 uppercase font-mono font-bold tracking-wider mb-1">
            <User className="w-4 h-4 text-sky-400" />
            <span>Welcome, {currentUser.name}</span>
            {currentUser.companyName && (
              <span className="text-blue-300 font-normal">({currentUser.companyName})</span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            My Project Bookings & GST Invoices
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
            Track site inspections, review itemized quotations, and download official GST-compliant tax invoices for your projects.
          </p>
        </div>

        <button
          onClick={() => setIsBookingModalOpen(true)}
          className="bg-white hover:bg-slate-100 text-blue-900 font-bold px-5 py-2.5 rounded-xl text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-blue-700" />
          <span>New Project Booking</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Bookings ({myBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'quotes'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Official Quotations ({myQuotations.length})
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'invoices'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            GST Tax Invoices ({myInvoices.length})
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search my records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Tab 1: Bookings List */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No project bookings found</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                You have not placed any project requests under this account yet.
              </p>
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs"
              >
                Book Your First Service
              </button>
            </div>
          ) : (
            filteredBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow p-5 sm:p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded border border-slate-200">
                        {b.bookingNumber}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${getStatusBadge(
                          b.status
                        )}`}
                      >
                        {b.status}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-2">
                      {b.serviceName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    {b.quotationId && (
                      <button
                        onClick={() => {
                          const quote = quotations.find((q) => q.id === b.quotationId);
                          if (quote) setSelectedQuotation(quote);
                        }}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileCheck2 className="w-4 h-4 text-amber-600" />
                        <span>View Quotation</span>
                      </button>
                    )}

                    {b.invoiceId && (
                      <button
                        onClick={() => {
                          const inv = invoices.find((i) => i.id === b.invoiceId);
                          if (inv) setSelectedInvoice(inv);
                        }}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span>View GST Invoice</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs text-slate-600">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase">Site Details</div>
                    <div className="flex items-start gap-1.5 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{b.customerAddress}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Scheduled: {formatDateIN(b.preferredDate)} ({b.preferredTimeSlot})</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase">Engineering Desk</div>
                    <div className="text-slate-800 font-semibold">
                      {/* PRIVACY ENFORCEMENT: Never reveal internal third-party vendor name to customer */}
                      KlickKar Noida Technical Team
                    </div>
                    <div className="text-[11px] text-emerald-700 font-medium">
                      ✓ Verified Project Supervisor Assigned
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase">Estimated Budget</div>
                    <div className="text-base font-extrabold text-blue-700">
                      {formatINR(b.budgetEstimate || 0)}
                    </div>
                    <div className="text-[10px] text-slate-500">+ Applicable 18% GST with ITC</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">Execution Milestone Progress</span>
                    <span className="font-bold text-blue-600">{b.progressPercentage || 10}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${b.progressPercentage || 10}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Quotations */}
      {activeTab === 'quotes' && (
        <div className="space-y-4">
          {myQuotations.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <FileCheck2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No official quotations found</h3>
              <p className="text-xs text-slate-500 mt-1">
                Quotations issued by our project engineering desk will be listed here with itemized material & labour breakdowns.
              </p>
            </div>
          ) : (
            myQuotations.map((q) => (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded">
                      {q.quotationNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Dated: {formatDateIN(q.date)}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {q.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-2">
                    {q.serviceCategory} Itemized Estimate
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {q.items.length} line items (Material, Labour & Equipment) • Valid till {formatDateIN(q.validUntil)}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400 font-bold uppercase">Grand Total (Incl. GST)</div>
                    <div className="text-lg font-black text-slate-900">{formatINR(q.grandTotal)}</div>
                  </div>

                  <button
                    onClick={() => setSelectedQuotation(q)}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Review Proposal</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: GST Tax Invoices */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          {myInvoices.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No GST tax invoices issued yet</h3>
              <p className="text-xs text-slate-500 mt-1">
                Official GST-compliant tax invoices under Mitaksh Infra (OPC) Private Limited will appear here once generated for completed milestones.
              </p>
            </div>
          ) : (
            myInvoices.map((inv) => (
              <div
                key={inv.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-0.5 rounded">
                      {inv.invoiceNumber}
                    </span>
                    <span className="text-xs text-slate-500">
                      Date: {formatDateIN(inv.invoiceDate)}
                    </span>
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

                  <h3 className="text-base font-bold text-slate-900 mt-2">
                    Tax Invoice ({inv.items.map((i) => i.description).slice(0, 1).join(', ')})
                  </h3>

                  <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                    <span>Taxable: {formatINR(inv.taxableAmount)}</span>
                    <span>•</span>
                    <span>GST (18%): {formatINR(inv.totalCgst + inv.totalSgst + inv.totalIgst)}</span>
                    <span>•</span>
                    <span>Place of Supply: {inv.placeOfSupply}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400 font-bold uppercase">Invoice Total</div>
                    <div className="text-lg font-black text-blue-700">{formatINR(inv.grandTotal)}</div>
                  </div>

                  <button
                    onClick={() => setSelectedInvoice(inv)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View / Print</span>
                  </button>

                  <button
                    onClick={() => exportInvoicePDF(inv)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-2 rounded-xl text-xs border border-slate-300 transition-all flex items-center gap-1 cursor-pointer"
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4 text-slate-600" />
                    <span className="hidden sm:inline">PDF</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
