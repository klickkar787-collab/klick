import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking, BookingStatus, QuotationItem } from '../../types';
import { formatINR, formatDateIN, calculateGSTBreakdown } from '../../utils/gstHelper';
import {
  Wrench,
  CheckCircle,
  Clock,
  Plus,
  Trash2,
  FileText,
  User,
  MapPin,
  Send,
  Building,
  Award,
  DollarSign,
  TrendingUp,
  Lock,
  ArrowRight,
  Eye,
} from 'lucide-react';

export const ProviderPortal: React.FC = () => {
  const {
    bookings,
    providers,
    currentUser,
    openAuthModal,
    updateBookingStatus,
    addQuotation,
    setSelectedQuotation,
    quotations,
  } = useApp();

  // Strict RBAC: Check if user is authenticated as a provider or admin
  if (!currentUser || (currentUser.role !== 'provider' && currentUser.role !== 'admin')) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden text-center p-8 sm:p-12">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-100">
            <Lock className="w-8 h-8" />
          </div>
          <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200">
            Password Protected Vendor Desk
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
            Vendor & Technician Authentication Required
          </h2>
          <p className="text-slate-600 text-sm max-w-lg mx-auto mt-2 mb-8">
            Access to job assignments, technical specifications, milestone updates, and contractor payouts is restricted to verified KlickKar partner technicians.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openAuthModal('provider')}
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Wrench className="w-4 h-4" />
              <span>Log In as Vendor</span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 max-w-md mx-auto">
            <p className="text-xs text-slate-500 mb-2 font-medium">Demo Vendor Account:</p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">Rajesh Sharma</span> (Fabrication Lead)
                <div className="text-[11px] text-slate-500 font-mono">rajesh.fab@klickkar.com</div>
              </div>
              <button
                onClick={() => openAuthModal('provider')}
                className="bg-amber-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg hover:bg-amber-700 cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Provider mapping
  const vendorId = currentUser.role === 'provider' ? currentUser.id : 'prov-1';
  const matchedProvider = providers.find((p) => p.id === vendorId || p.email === currentUser.email) || providers[0];

  const [activeJobFilter, setActiveJobFilter] = useState<'all' | 'assigned' | 'completed'>('assigned');
  const [selectedBookingForQuote, setSelectedBookingForQuote] = useState<Booking | null>(null);

  // Status update modal state
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [newStatus, setNewStatus] = useState<BookingStatus>('In Progress');
  const [statusNotes, setStatusNotes] = useState('');
  const [progressVal, setProgressVal] = useState(50);

  // Quote builder form
  const [quoteItems, setQuoteItems] = useState<QuotationItem[]>([
    {
      id: '1',
      description: 'Raw Materials & Hardware (Structural MS Pipe & PUF panels)',
      hsnSac: '7308',
      quantity: 1,
      unit: 'Lot',
      unitPrice: 45000,
      amount: 45000,
      type: 'material',
    },
    {
      id: '2',
      description: 'Certified Welding, Precision Fabrication & Assembly Labour',
      hsnSac: '9954',
      quantity: 1,
      unit: 'Job',
      unitPrice: 12000,
      amount: 12000,
      type: 'labour',
    },
  ]);
  const [discountVal, setDiscountVal] = useState(0);

  // Strict vendor data isolation: only jobs assigned to this specific vendor
  const myAssignedJobs = bookings.filter((b) => {
    if (currentUser.role === 'admin') return true;
    return b.assignedProviderId === vendorId || b.assignedProviderId === matchedProvider.id;
  });

  const displayedJobs =
    activeJobFilter === 'completed'
      ? myAssignedJobs.filter((b) => b.status === 'Completed')
      : activeJobFilter === 'assigned'
      ? myAssignedJobs.filter((b) => b.status !== 'Completed' && b.status !== 'Cancelled')
      : myAssignedJobs;

  const totalEarnings = myAssignedJobs
    .filter((b) => b.status === 'Completed')
    .reduce((acc, curr) => acc + (curr.budgetEstimate || 0), 0);

  const handleAddItem = () => {
    setQuoteItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        description: 'New Scope Line Item',
        hsnSac: '9954',
        quantity: 1,
        unit: 'Unit',
        unitPrice: 5000,
        amount: 5000,
        type: 'material',
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setQuoteItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleItemChange = (id: string, field: keyof QuotationItem, value: any) => {
    setQuoteItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.amount = Number(updated.quantity) * Number(updated.unitPrice);
        }
        return updated;
      })
    );
  };

  const handleSaveQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForQuote) return;

    const subtotal = quoteItems.reduce((acc, it) => acc + it.amount, 0);
    const taxableAfterDiscount = Math.max(0, subtotal - discountVal);
    const gstBreak = calculateGSTBreakdown(taxableAfterDiscount, '09', 18);

    const newQuote = addQuotation({
      bookingId: selectedBookingForQuote.id,
      validUntil: new Date(Date.now() + 86400000 * 15).toISOString().split('T')[0],
      customerName: selectedBookingForQuote.customerName,
      customerPhone: selectedBookingForQuote.customerPhone,
      customerEmail: selectedBookingForQuote.customerEmail,
      customerAddress: selectedBookingForQuote.customerAddress,
      serviceCategory: selectedBookingForQuote.serviceCategory,
      items: quoteItems,
      subtotal,
      discount: discountVal,
      gstRate: 18,
      gstType: gstBreak.type,
      cgstAmount: gstBreak.cgstAmount,
      sgstAmount: gstBreak.sgstAmount,
      igstAmount: gstBreak.igstAmount,
      grandTotal: gstBreak.grandTotal,
      terms: [
        '50% Advance with order confirmation, balance on delivery.',
        '100% genuine factory grade materials.',
        'Site inspection and measurements verified by vendor.',
      ],
      status: 'Sent',
      providerNotes: `Quotation prepared by ${currentUser.name}`,
    });

    setSelectedBookingForQuote(null);
    setSelectedQuotation(newQuote);
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;

    updateBookingStatus(
      editingBooking.id,
      newStatus,
      statusNotes || editingBooking.statusNotes,
      progressVal
    );
    setEditingBooking(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Profile Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Wrench className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                Verified Vendor Partner
              </span>
              <span className="text-xs text-slate-400">Account: {currentUser.email}</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              {currentUser.name}
            </h1>
            <p className="text-xs text-slate-400">
              Specialization: {matchedProvider.specialization?.join(' • ') || 'Engineering & Fabrication'}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 text-center w-full md:w-auto">
          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
            <div className="text-xs text-slate-400">My Active Jobs</div>
            <div className="text-xl font-bold font-mono text-amber-400">
              {myAssignedJobs.filter((b) => b.status !== 'Completed').length}
            </div>
          </div>
          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
            <div className="text-xs text-slate-400">Completed</div>
            <div className="text-xl font-bold font-mono text-emerald-400">
              {myAssignedJobs.filter((b) => b.status === 'Completed').length}
            </div>
          </div>
          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
            <div className="text-xs text-slate-400">My Completed Volume</div>
            <div className="text-sm font-bold font-mono text-blue-400">
              {formatINR(totalEarnings)}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Filter */}
      <div className="flex items-center gap-2 mb-6 bg-slate-100 p-1.5 rounded-xl border border-slate-200 w-fit">
        <button
          onClick={() => setActiveJobFilter('assigned')}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeJobFilter === 'assigned'
              ? 'bg-white text-amber-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Active Work Orders ({myAssignedJobs.filter((b) => b.status !== 'Completed').length})
        </button>
        <button
          onClick={() => setActiveJobFilter('completed')}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeJobFilter === 'completed'
              ? 'bg-white text-amber-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Finished Projects ({myAssignedJobs.filter((b) => b.status === 'Completed').length})
        </button>
        <button
          onClick={() => setActiveJobFilter('all')}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeJobFilter === 'all'
              ? 'bg-white text-amber-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Assigned Records ({myAssignedJobs.length})
        </button>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {displayedJobs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No work orders assigned</h3>
            <p className="text-xs text-slate-500 mt-1">
              New projects assigned to you by KlickKar operations will appear here for site survey and fabrication.
            </p>
          </div>
        ) : (
          displayedJobs.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded border border-slate-200">
                      {b.bookingNumber}
                    </span>
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      {b.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">{b.serviceName}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Customer: <span className="font-bold text-slate-800">{b.customerName}</span> • Phone: <a href={`tel:${b.customerPhone}`} className="text-blue-600 font-semibold">{b.customerPhone}</a>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingBooking(b);
                      setNewStatus(b.status);
                      setStatusNotes(b.statusNotes || '');
                      setProgressVal(b.progressPercentage || 50);
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Update Status & Progress</span>
                  </button>

                  <button
                    onClick={() => setSelectedBookingForQuote(b)}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create / Send Quotation</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs text-slate-600">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Site Location</div>
                  <div className="flex items-start gap-1 mt-1 text-slate-800">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{b.customerAddress}</span>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Site Survey Appointment</div>
                  <div className="flex items-center gap-1 mt-1 text-slate-800">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>{formatDateIN(b.preferredDate)} ({b.preferredTimeSlot})</span>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Work Progress ({b.progressPercentage || 10}%)</div>
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all"
                      style={{ width: `${b.progressPercentage || 10}%` }}
                    ></div>
                  </div>
                  {b.statusNotes && (
                    <div className="text-[11px] text-slate-500 mt-1 italic">
                      "{b.statusNotes}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Update Status */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Update Execution Status: {editingBooking.bookingNumber}
            </h3>
            <p className="text-xs text-slate-500 mb-4">{editingBooking.serviceName}</p>

            <form onSubmit={handleSaveStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as BookingStatus)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Under Review">Under Review</option>
                  <option value="Scheduled">Scheduled for Site Inspection</option>
                  <option value="In Progress">In Progress (Fabrication / Installation)</option>
                  <option value="Completed">Completed (Final Delivery Sign-off)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Progress Percentage ({progressVal}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={progressVal}
                  onChange={(e) => setProgressVal(Number(e.target.value))}
                  className="w-full accent-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Field Progress Notes
                </label>
                <textarea
                  rows={3}
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="e.g. MS structural frame cut and welded, applying anti-rust primer today."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Quotation */}
      {selectedBookingForQuote && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Prepare Itemized Quotation for {selectedBookingForQuote.customerName}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Project: {selectedBookingForQuote.serviceName} ({selectedBookingForQuote.bookingNumber})
            </p>

            <form onSubmit={handleSaveQuotation} className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase">Quotation Line Items</span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs text-amber-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                {quoteItems.map((item, idx) => (
                  <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600">Item #{idx + 1}</span>
                      {quoteItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-rose-600 hover:text-rose-800 text-xs font-bold"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Item description (e.g. 50mm PUF Wall Panels)"
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                      required
                    />
                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold uppercase">HSN/SAC</label>
                        <input
                          type="text"
                          value={item.hsnSac}
                          onChange={(e) => handleItemChange(item.id, 'hsnSac', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold uppercase">Qty</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold uppercase">Rate (₹)</label>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold uppercase">Amount</label>
                        <div className="p-1.5 bg-slate-100 rounded-lg text-xs font-bold font-mono text-slate-800">
                          {formatINR(item.amount)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedBookingForQuote(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs"
                >
                  Generate & Send Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
