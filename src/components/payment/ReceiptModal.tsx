import React from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentRecord } from '../../types';
import { formatINR, formatDateIN, numberToIndianWords } from '../../utils/gstHelper';
import { ASSETS } from '../../data/companyDetails';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  Landmark,
  Building,
  Receipt,
  FileCheck2,
  Share2,
} from 'lucide-react';

interface ReceiptModalProps {
  receipt: PaymentRecord | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, onClose }) => {
  const { settings } = useApp();

  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Actions Bar (Top) */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-600 rounded-xl">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Official Payment Receipt</h3>
              <p className="text-[11px] text-slate-400 font-mono">Receipt: {receipt.receiptNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div id="payment-receipt-print-area" className="p-6 sm:p-8 space-y-6 bg-white text-slate-800 text-xs">
          {/* Company & Receipt Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b-2 border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <img
                  src={ASSETS.logo}
                  alt="KlickKar.com"
                  className="h-10 w-auto object-contain"
                />
                <span className="text-xl font-black text-slate-900 tracking-tight">KlickKar.com</span>
              </div>
              <p className="text-[11px] font-bold text-slate-700 mt-1">{settings.legalEntity}</p>
              <p className="text-[11px] text-slate-500 max-w-sm mt-0.5">{settings.address}</p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600 mt-1 font-mono">
                <span>GSTIN: <strong className="text-slate-900">{settings.gstin}</strong></span>
                <span>PAN: <strong className="text-slate-900">{settings.pan}</strong></span>
                <span>Phone: {settings.phone}</span>
              </div>
            </div>

            <div className="text-left sm:text-right bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl shrink-0">
              <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded uppercase">
                Payment Received
              </span>
              <div className="text-sm font-black font-mono text-slate-900 mt-1">{receipt.receiptNumber}</div>
              <div className="text-[11px] text-slate-600 mt-0.5">Date: {formatDateIN(receipt.date)}</div>
              <div className="text-[10px] text-slate-500 font-mono">Mode: {receipt.paymentMode}</div>
            </div>
          </div>

          {/* Customer & Reference Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Received From:</span>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{receipt.customerName}</div>
              <div className="text-slate-600 mt-0.5">{receipt.customerPhone}</div>
              <div className="text-slate-500 font-mono text-[11px]">{receipt.customerEmail}</div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Payment Details:</span>
              <div className="text-slate-700 mt-0.5">
                Plan: <strong className="text-slate-900">{receipt.paymentPlan}</strong>
              </div>
              {receipt.bookingNumber && (
                <div className="text-slate-600">
                  Booking Ref: <span className="font-mono font-bold text-blue-700">{receipt.bookingNumber}</span>
                </div>
              )}
              {receipt.invoiceNumber && (
                <div className="text-slate-600">
                  Tax Invoice Ref: <span className="font-mono font-bold text-emerald-700">{receipt.invoiceNumber}</span>
                </div>
              )}
              {receipt.transactionRef && (
                <div className="text-slate-600 font-mono text-[11px]">
                  Txn / UTR: <strong className="text-slate-900">{receipt.transactionRef}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Amount Box */}
          <div className="bg-emerald-600 text-white rounded-2xl p-5 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs uppercase font-bold text-emerald-100 tracking-wider">Total Amount Received</span>
                <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white mt-0.5">
                  {formatINR(receipt.amount)}
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-emerald-200 uppercase font-mono block">Payment Status</span>
                <span className="inline-flex items-center gap-1 bg-white/20 px-2.5 py-1 rounded-lg text-xs font-bold font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Verified & Credited</span>
                </span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-emerald-500/60 text-xs text-emerald-50 font-serif italic">
              Amount in words: {numberToIndianWords(receipt.amount)}
            </div>
          </div>

          {/* Balance Remaining (if partial/advance) */}
          {receipt.totalBillAmount && receipt.totalBillAmount > receipt.amount && (
            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-center justify-between text-xs">
              <div>
                <span className="text-amber-800 font-bold block">Milestone / Advance Payment Summary:</span>
                <span className="text-slate-600 text-[11px]">
                  Total Order Value: {formatINR(receipt.totalBillAmount)} • Paid: {formatINR(receipt.amount)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-amber-700 block uppercase font-mono">Balance Due</span>
                <span className="font-mono font-bold text-amber-900 text-sm">
                  {formatINR(receipt.balanceRemaining ?? (receipt.totalBillAmount - receipt.amount))}
                </span>
              </div>
            </div>
          )}

          {/* Banking Destination */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Landmark className="w-4 h-4 text-blue-600" />
              <span>Remittance Credited To Corporate Account</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600 pt-1">
              <div>
                <span className="text-slate-400 block text-[10px]">Bank</span>
                <span className="font-semibold text-slate-800">{settings.bankAccount.bankName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Account No</span>
                <span className="font-mono font-bold text-slate-800">{settings.bankAccount.accountNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">IFSC</span>
                <span className="font-mono font-bold text-slate-800">{settings.bankAccount.ifsc}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Branch</span>
                <span className="text-slate-800">{settings.bankAccount.branch}</span>
              </div>
            </div>
            {receipt.notes && (
              <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 mt-2 italic">
                Notes: {receipt.notes}
              </p>
            )}
          </div>

          {/* Statutory Sign-off */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 text-[11px] text-slate-500">
            <div>
              <p className="font-medium text-slate-700">Thank you for choosing KlickKar.com!</p>
              <p className="text-[10px]">Computer-generated official receipt. Requires no physical signature.</p>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-800 font-mono">For {settings.legalEntity}</div>
              <div className="text-[10px] text-slate-400 mt-1">Authorized Signatory / Accounts Dept</div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={handlePrint}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2 rounded-xl text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
