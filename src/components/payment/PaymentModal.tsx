import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Booking,
  GSTInvoice,
  Quotation,
  PaymentMode,
  PaymentPlanType,
  PaymentRecord,
} from '../../types';
import { formatINR } from '../../utils/gstHelper';
import confetti from 'canvas-confetti';
import {
  X,
  CreditCard,
  QrCode,
  Building,
  Landmark,
  CheckCircle2,
  Copy,
  Check,
  FileText,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Banknote,
  Smartphone,
} from 'lucide-react';

export const PaymentModal: React.FC = () => {
  const {
    activePaymentModal,
    closePaymentModal,
    settings,
    recordPayment,
    setActiveReceipt,
    currentUser,
  } = useApp();

  const [paymentPlan, setPaymentPlan] = useState<PaymentPlanType>('Advance Payment');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Pay Now (Online)');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [bankName, setBankName] = useState<string>('Kotak Mahindra Bank');
  const [paymentNotes, setPaymentNotes] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!activePaymentModal || !activePaymentModal.isOpen) return null;

  const { booking, invoice, quotation } = activePaymentModal;

  // Determine total bill and balance
  const totalAmount = invoice
    ? invoice.grandTotal
    : quotation
    ? quotation.grandTotal
    : booking?.budgetEstimate || 50000;

  const alreadyPaid = booking?.paidAmount || invoice?.paidAmount || 0;
  const balanceDue = Math.max(0, totalAmount - alreadyPaid);

  const defaultAdvance = Math.round(totalAmount * (settings.paymentTerms?.standardAdvancePercentage || 40) / 100);

  const effectiveAmount =
    paymentPlan === 'Full Payment'
      ? balanceDue
      : customAmount
      ? Number(customAmount)
      : Math.min(balanceDue, defaultAdvance);

  const customerName =
    invoice?.customerName || booking?.customerName || quotation?.customerName || currentUser?.name || 'Valued Customer';
  const customerPhone =
    invoice?.customerPhone || booking?.customerPhone || quotation?.customerPhone || currentUser?.phone || '+91 96546 10640';
  const customerEmail =
    invoice?.customerEmail || booking?.customerEmail || quotation?.customerEmail || currentUser?.email || 'customer@klickkar.com';

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      const generatedRef =
        transactionRef.trim() ||
        (paymentMode === 'Pay Now (Online)'
          ? `PG-${Date.now().toString().slice(-8)}`
          : paymentMode === 'UPI'
          ? `UPI-${Math.floor(100000000000 + Math.random() * 900000000000)}`
          : paymentMode === 'Cash on Site'
          ? `CASH-ON-SITE`
          : `KKBK-${Math.floor(10000000 + Math.random() * 90000000)}`);

      const newReceipt = recordPayment({
        bookingId: booking?.id,
        bookingNumber: booking?.bookingNumber,
        invoiceId: invoice?.id,
        invoiceNumber: invoice?.invoiceNumber,
        quotationId: quotation?.id,
        customerName,
        customerPhone,
        customerEmail,
        amount: Number(effectiveAmount),
        paymentPlan,
        paymentMode,
        status: 'Paid',
        transactionRef: generatedRef,
        bankName:
          paymentMode === 'Cash on Site'
            ? 'Handover to Noida Site Engineer'
            : paymentMode === 'UPI'
            ? 'Kotak Mahindra Bank (UPI)'
            : bankName,
        date: new Date().toISOString().split('T')[0],
        notes: paymentNotes || `${paymentPlan} of ${formatINR(effectiveAmount)} received via ${paymentMode}`,
        recordedBy: currentUser ? `${currentUser.name} (${currentUser.role})` : 'Online Portal',
        totalBillAmount: totalAmount,
        balanceRemaining: Math.max(0, balanceDue - Number(effectiveAmount)),
      });

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });

      closePaymentModal();
      setActiveReceipt(newReceipt);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 rounded-xl">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 uppercase font-bold">
                  Payment Processing
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {booking?.bookingNumber || invoice?.invoiceNumber || quotation?.quotationNumber || 'Order Checkout'}
                </span>
              </div>
              <h3 className="text-lg font-black text-white mt-0.5">
                Complete Payment & Receive Instant Receipt
              </h3>
            </div>
          </div>
          <button
            onClick={closePaymentModal}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handlePaySubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-700 flex-1">
          {/* Order Summary Strip */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Order Reference</span>
              <div className="text-sm font-bold text-slate-900">
                {invoice?.invoiceNumber || booking?.serviceName || quotation?.serviceCategory || 'Fabrication & Engineering'}
              </div>
              <div className="text-slate-500 text-[11px]">
                Client: {customerName} • {customerPhone}
              </div>
            </div>
            <div className="flex items-center gap-4 text-right">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Value</span>
                <span className="text-sm font-mono font-bold text-slate-900">{formatINR(totalAmount)}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Balance Due</span>
                <span className="text-sm font-mono font-bold text-rose-600">{formatINR(balanceDue)}</span>
              </div>
            </div>
          </div>

          {/* Payment Plan: Advance vs Full */}
          <div>
            <label className="font-bold text-slate-900 block mb-2">Select Payment Plan:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setPaymentPlan('Advance Payment');
                  setCustomAmount(String(defaultAdvance));
                }}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  paymentPlan === 'Advance Payment'
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Advance Deposit ({settings.paymentTerms?.standardAdvancePercentage || 40}%)</span>
                  {paymentPlan === 'Advance Payment' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <div className="text-blue-700 font-mono font-bold text-base mt-1">
                  {formatINR(defaultAdvance)}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Order confirmation & raw material booking</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaymentPlan('Full Payment');
                  setCustomAmount(String(balanceDue));
                }}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  paymentPlan === 'Full Payment'
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Full Settlement (100%)</span>
                  {paymentPlan === 'Full Payment' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <div className="text-emerald-700 font-mono font-bold text-base mt-1">
                  {formatINR(balanceDue)}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Clear entire pending order balance</div>
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-900">Amount to Remit (₹):</label>
              <span className="text-[11px] text-slate-500">Custom advance amount accepted</span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
              <input
                type="number"
                value={customAmount || effectiveAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                min="500"
                max={balanceDue || 5000000}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Payment Mode Selection */}
          <div>
            <label className="font-bold text-slate-900 block mb-2">Select Payment Method:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'Pay Now (Online)' as PaymentMode, label: 'Pay Now (Online)', icon: CreditCard },
                { id: 'UPI' as PaymentMode, label: 'UPI / QR Code', icon: QrCode },
                { id: 'Bank Transfer' as PaymentMode, label: 'NEFT / RTGS', icon: Landmark },
                { id: 'Cash on Site' as PaymentMode, label: 'Cash on Site', icon: Banknote },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMode === m.id;
                const isDisabled = m.id === 'Cash on Site' && !settings.paymentTerms?.allowCashOnSite;

                return (
                  <button
                    key={m.id}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => setPaymentMode(m.id)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold ring-1 ring-blue-500'
                        : isDisabled
                        ? 'opacity-40 cursor-not-allowed bg-slate-50 border-slate-200 text-slate-400'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`} />
                    <span className="text-[11px]">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DYNAMIC MODE DETAILS */}

          {/* 1. Pay Now (Online Gateway) */}
          {paymentMode === 'Pay Now (Online)' && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Instant Online Gateway Simulation</span>
              </div>
              <p className="text-[11px] text-slate-600">
                You will be charged <strong>{formatINR(effectiveAmount)}</strong> securely through our payment gateway. Supports all Indian Credit/Debit cards, NetBanking (SBI, HDFC, ICICI, Kotak, Axis), and instant UPI intents.
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-700 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>256-bit SSL encrypted • Instant official tax receipt generation</span>
              </div>
            </div>
          )}

          {/* 2. UPI / QR Code */}
          {paymentMode === 'UPI' && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Simulated QR Box */}
                <div className="bg-white p-3 rounded-2xl border-2 border-slate-300 shadow-sm text-center shrink-0">
                  <div className="w-28 h-28 bg-slate-900 rounded-xl flex items-center justify-center text-white text-[11px] font-mono p-2">
                    <div className="space-y-1">
                      <QrCode className="w-12 h-12 mx-auto text-white" />
                      <div className="text-[9px] text-emerald-400">BHIM UPI QR</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">Scan via any UPI App</span>
                </div>

                <div className="space-y-2 flex-1">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Official Kotak VPA / UPI ID:</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <code className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 font-mono font-bold text-slate-900 text-xs">
                        mitakshinfra@kotak
                      </code>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('mitakshinfra@kotak', 'upi')}
                        className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 cursor-pointer"
                        title="Copy UPI ID"
                      >
                        {copiedField === 'upi' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Beneficiary Name:</span>
                    <span className="font-bold text-slate-800 text-xs">{settings.legalEntity}</span>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Open GPay, PhonePe, Paytm, or BHIM. Pay <strong>{formatINR(effectiveAmount)}</strong>, then enter the 12-digit UTR reference below.
                  </p>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-900 block mb-1">Enter 12-Digit UPI UTR / Reference Number:</label>
                <input
                  type="text"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="e.g. 62918402910"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:border-blue-500 outline-none"
                  required
                />
              </div>
            </div>
          )}

          {/* 3. NEFT / RTGS / Bank Transfer */}
          {paymentMode === 'Bank Transfer' && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between text-slate-900 font-bold">
                <div className="flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-blue-600" />
                  <span>Kotak Mahindra Bank Transfer Details</span>
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-mono">
                  Verified Corporate Current A/C
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Account Holder</span>
                  <span className="font-bold text-slate-900">{settings.bankAccount.accountHolder}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block">Bank & Branch</span>
                  <span className="font-bold text-slate-900">{settings.bankAccount.bankName} • {settings.bankAccount.branch}</span>
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                  <div>
                    <span className="text-[10px] text-slate-400 block">A/C Number</span>
                    <span className="font-mono font-black text-blue-700 text-sm">{settings.bankAccount.accountNumber}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(settings.bankAccount.accountNumber, 'ac')}
                    className="p-1 rounded text-slate-500 hover:text-slate-900 cursor-pointer"
                  >
                    {copiedField === 'ac' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                  <div>
                    <span className="text-[10px] text-slate-400 block">IFSC Code</span>
                    <span className="font-mono font-black text-amber-700 text-sm">{settings.bankAccount.ifsc}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(settings.bankAccount.ifsc, 'ifsc')}
                    className="p-1 rounded text-slate-500 hover:text-slate-900 cursor-pointer"
                  >
                    {copiedField === 'ifsc' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Bank UTR / Transaction No:</label>
                  <input
                    type="text"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="e.g. KKBKH2629410182"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:border-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Remitting Bank Name:</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g. HDFC Bank, SBI, ICICI"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-blue-500 outline-none"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. Cash on Site */}
          {paymentMode === 'Cash on Site' && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Cash on Site Terms & Maximum Limit</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                As per KlickKar company policy, cash collection is permitted up to <strong>{formatINR(settings.paymentTerms?.cashOnSiteMaxLimit || 20000)}</strong> per job. Cash must be handed over strictly to the designated certified KlickKar technician against an immediate SMS / portal acknowledgment.
              </p>
              <div className="text-[11px] text-amber-900 font-mono">
                Order advance: {formatINR(effectiveAmount)} will be collected on site visit.
              </div>
            </div>
          )}

          {/* Customer Confirmation */}
          <div className="border-t border-slate-200 pt-3 space-y-2">
            <span className="font-bold text-slate-900 block">Receipt Recipient Details:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 block">Name</span>
                <span className="font-semibold text-slate-800">{customerName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Phone</span>
                <span className="font-semibold text-slate-800">{customerPhone}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Email</span>
                <span className="font-mono text-slate-800 truncate block">{customerEmail}</span>
              </div>
            </div>
          </div>

          {/* Optional notes */}
          <div>
            <label className="font-bold text-slate-900 block mb-1">Optional Notes / Remarks:</label>
            <input
              type="text"
              value={paymentNotes}
              onChange={(e) => setPaymentNotes(e.target.value)}
              placeholder="e.g. 40% Advance for automatic sliding gate motor"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-blue-500 outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              {isProcessing ? (
                <span>Generating Receipt...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>Confirm Payment of {formatINR(effectiveAmount)} & View Receipt</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
