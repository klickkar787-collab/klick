import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SERVICE_AREAS } from '../../data/companyDetails';
import confetti from 'canvas-confetti';
import {
  X,
  FileText,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const BookingModal: React.FC = () => {
  const {
    isBookingModalOpen,
    setIsBookingModalOpen,
    preselectedServiceId,
    services,
    addBooking,
    setRole,
    setActiveNav,
  } = useApp();

  const [serviceId, setServiceId] = useState<string>(services[0]?.id || '');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+91 ');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [serviceArea, setServiceArea] = useState('Noida');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('10:00 AM - 01:00 PM');
  const [urgency, setUrgency] = useState<'Standard' | 'Urgent (Within 24 Hrs)' | 'Emergency'>('Standard');
  const [description, setDescription] = useState('');
  const [budgetEstimate, setBudgetEstimate] = useState<number>(50000);

  const [submittedBookingNumber, setSubmittedBookingNumber] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedServiceId) {
      setServiceId(preselectedServiceId);
      const s = services.find((srv) => srv.id === preselectedServiceId);
      if (s) {
        setBudgetEstimate(s.basePrice);
      }
    }
  }, [preselectedServiceId, services]);

  if (!isBookingModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSrv = services.find((s) => s.id === serviceId) || services[0];

    const newBooking = addBooking({
      customerName: customerName || 'Valued Customer',
      customerPhone: customerPhone || '+91 96546 10640',
      customerEmail: customerEmail || 'customer@klickkar.com',
      customerAddress: customerAddress || `${serviceArea}, Delhi NCR`,
      serviceId: selectedSrv.id,
      serviceName: selectedSrv.name,
      serviceCategory: selectedSrv.category,
      serviceArea: serviceArea,
      preferredDate: preferredDate || new Date().toISOString().split('T')[0],
      preferredTimeSlot: preferredTimeSlot,
      description: description || `Requirement for ${selectedSrv.name} at ${serviceArea}`,
      budgetEstimate: Number(budgetEstimate),
      urgency: urgency,
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setSubmittedBookingNumber(newBooking.bookingNumber);
  };

  const handleClose = () => {
    setIsBookingModalOpen(false);
    setSubmittedBookingNumber(null);
  };

  const handleViewOrder = () => {
    setIsBookingModalOpen(false);
    setSubmittedBookingNumber(null);
    setRole('customer');
    setActiveNav('portal');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Book Service & Request Free Quotation</h3>
              <p className="text-xs text-slate-400">
                Direct factory pricing & fast site engineer inspection across Noida & NCR
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {submittedBookingNumber ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-extrabold text-slate-900">
              Booking Request Received Successfully!
            </h4>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your unique tracking number is{' '}
              <strong className="font-mono text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                {submittedBookingNumber}
              </strong>
              . Our engineering project manager will contact you within 30 minutes to finalize site measurements.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleViewOrder}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md transition-all cursor-pointer"
              >
                Track in Customer Dashboard
              </button>
              <button
                onClick={handleClose}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-6 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {/* Service & Urgency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Service Required *
                </label>
                <select
                  value={serviceId}
                  onChange={(e) => {
                    setServiceId(e.target.value);
                    const s = services.find((x) => x.id === e.target.value);
                    if (s) setBudgetEstimate(s.basePrice);
                  }}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:border-blue-600 bg-white"
                  required
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.category}: {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Timeline / Urgency
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:border-blue-600 bg-white"
                >
                  <option value="Standard">Standard Schedule (2-3 Days)</option>
                  <option value="Urgent (Within 24 Hrs)">Urgent (Within 24 Hours)</option>
                  <option value="Emergency">Emergency Same-Day Response</option>
                </select>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name / Company Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  WhatsApp / Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="+91 96546 10640"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 focus:outline-hidden focus:border-blue-600 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Email & Service Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Project Region / Location *
                </label>
                <select
                  value={serviceArea}
                  onChange={(e) => setServiceArea(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:border-blue-600 bg-white"
                >
                  {SERVICE_AREAS.map((a, i) => (
                    <option key={i} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Site Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Site / Delivery Address *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Plot/Flat No, Sector, Landmark, Pin code"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 focus:outline-hidden focus:border-blue-600"
                />
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Preferred Inspection Date
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Preferred Time Window
                </label>
                <select
                  value={preferredTimeSlot}
                  onChange={(e) => setPreferredTimeSlot(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:border-blue-600 bg-white"
                >
                  <option value="09:00 AM - 12:00 PM">Morning (09:00 AM - 12:00 PM)</option>
                  <option value="12:00 PM - 03:00 PM">Afternoon (12:00 PM - 03:00 PM)</option>
                  <option value="03:00 PM - 06:00 PM">Evening (03:00 PM - 06:00 PM)</option>
                </select>
              </div>
            </div>

            {/* Project Scope Description & Budget */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Detailed Requirement & Dimension Specifications
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Need 20x10 Porta Cabin with 2 windows and AC cut-out, or MS gate 16ft width with Italian automation motor..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-xl p-3 focus:outline-hidden focus:border-blue-600 resize-none"
              ></textarea>
            </div>

            {/* Submit Bar */}
            <div className="pt-2 flex items-center justify-between">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Free site visit & zero obligation estimate</span>
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Submit Booking</span>
                <CheckCircle className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
