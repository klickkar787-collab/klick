import React from 'react';
import { useApp } from '../../context/AppContext';
import { ASSETS, OFFICIAL_COMPANY_DETAILS } from '../../data/companyDetails';
import { formatINR, formatDateIN } from '../../utils/gstHelper';
import { exportQuotationPDF } from '../../utils/pdfGenerator';
import {
  X,
  Printer,
  Download,
  CheckCircle,
  XCircle,
  FileText,
  Landmark,
  ShieldCheck,
  Send,
  ArrowRight,
} from 'lucide-react';

export const QuotationModal: React.FC = () => {
  const {
    selectedQuotation,
    setSelectedQuotation,
    approveQuotation,
    rejectQuotation,
    createInvoiceFromBookingOrQuote,
    setSelectedInvoice,
    role,
  } = useApp();

  if (!selectedQuotation) return null;

  const handleApprove = () => {
    approveQuotation(selectedQuotation.id);
    setSelectedQuotation(null);
  };

  const handleReject = () => {
    rejectQuotation(selectedQuotation.id);
    setSelectedQuotation(null);
  };

  const handleConvertToInvoice = () => {
    const newInv = createInvoiceFromBookingOrQuote(
      selectedQuotation.bookingId,
      selectedQuotation.id
    );
    setSelectedQuotation(null);
    setSelectedInvoice(newInv);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 flex flex-col max-h-[92vh]">
        {/* Top Control Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/30 border border-blue-400 rounded-lg">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">Formal Engineering Quotation</h3>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    selectedQuotation.status === 'Approved'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : selectedQuotation.status === 'Rejected'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}
                >
                  {selectedQuotation.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {selectedQuotation.quotationNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {role === 'customer' && selectedQuotation.status === 'Sent' && (
              <>
                <button
                  onClick={handleReject}
                  className="bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border border-rose-500/30 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Decline</span>
                </button>
                <button
                  onClick={handleApprove}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve & Accept</span>
                </button>
              </>
            )}

            {role === 'admin' && (
              <button
                onClick={handleConvertToInvoice}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <span>Generate GST Invoice</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => exportQuotationPDF(selectedQuotation)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-700 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </button>

            <button
              onClick={() => setSelectedQuotation(null)}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quotation Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-100">
          <div className="bg-white p-8 sm:p-12 shadow-md rounded-xl border border-slate-200 text-slate-800 max-w-3xl mx-auto">
            {/* Header */}
            <div className="border-b-2 border-blue-700 pb-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <img
                    src={ASSETS.logo}
                    alt="KlickKar.com"
                    className="h-16 w-auto object-contain mb-2"
                  />
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                    Official Quotation by
                  </div>
                  <h1 className="text-base font-extrabold text-slate-900">
                    {OFFICIAL_COMPANY_DETAILS.legalEntity}
                  </h1>
                  <p className="text-xs text-slate-600 max-w-md mt-1 leading-relaxed">
                    {OFFICIAL_COMPANY_DETAILS.address}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Phone: <span className="font-semibold">{OFFICIAL_COMPANY_DETAILS.phone}</span> | GSTIN:{' '}
                    <span className="font-mono font-semibold text-blue-700">{OFFICIAL_COMPANY_DETAILS.gstin}</span>
                  </p>
                </div>

                <div className="text-right sm:self-start bg-slate-50 p-4 rounded-xl border border-slate-200 min-w-[200px]">
                  <div className="text-sm font-extrabold text-slate-900 tracking-wider">
                    ESTIMATE / QUOTE
                  </div>
                  <div className="text-xs space-y-1 text-slate-700 mt-2">
                    <div>
                      <span className="text-slate-500">Quote No:</span>{' '}
                      <strong className="font-mono text-slate-900">{selectedQuotation.quotationNumber}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Date:</span>{' '}
                      <strong>{formatDateIN(selectedQuotation.date)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Valid Until:</span>{' '}
                      <strong className="text-rose-600">{formatDateIN(selectedQuotation.validUntil)}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Info */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-xs">
              <div className="font-bold text-slate-500 uppercase tracking-wider mb-1">
                Prepared For:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="font-bold text-sm text-slate-900">{selectedQuotation.customerName}</div>
                  <div className="text-slate-600 mt-0.5">{selectedQuotation.customerAddress}</div>
                </div>
                <div className="sm:text-right text-slate-600 space-y-1">
                  <div>Phone: <strong className="text-slate-900">{selectedQuotation.customerPhone}</strong></div>
                  <div>Category: <span className="font-semibold text-blue-700">{selectedQuotation.serviceCategory}</span></div>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-xs text-left border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-blue-700 text-white">
                    <th className="py-2.5 px-3 border border-blue-600 w-8 text-center">#</th>
                    <th className="py-2.5 px-3 border border-blue-600">Scope of Work / Specification</th>
                    <th className="py-2.5 px-2 border border-blue-600 text-center">Type</th>
                    <th className="py-2.5 px-2 border border-blue-600 text-center">Qty</th>
                    <th className="py-2.5 px-3 border border-blue-600 text-right">Unit Rate</th>
                    <th className="py-2.5 px-3 border border-blue-600 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {selectedQuotation.items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="py-3 px-3 text-center border border-slate-200 text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-3 border border-slate-200">
                        <span className="font-semibold text-slate-900 block">{item.description}</span>
                        <span className="text-[10px] text-slate-500">HSN/SAC: {item.hsnSac}</span>
                      </td>
                      <td className="py-3 px-2 border border-slate-200 text-center capitalize text-slate-600">
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3 px-2 border border-slate-200 text-center">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="py-3 px-3 border border-slate-200 text-right font-mono">
                        {formatINR(item.unitPrice)}
                      </td>
                      <td className="py-3 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                        {formatINR(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-xs">
              <div>
                <div className="font-bold text-slate-700 mb-2">Terms & Commercial Conditions:</div>
                <ul className="space-y-1.5 text-slate-600 list-disc pl-4 text-[11px]">
                  {selectedQuotation.terms.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold text-slate-900">{formatINR(selectedQuotation.subtotal)}</span>
                </div>
                {selectedQuotation.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount:</span>
                    <span className="font-mono font-semibold">-{formatINR(selectedQuotation.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Estimated GST (18%):</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {formatINR(selectedQuotation.cgstAmount + selectedQuotation.sgstAmount + selectedQuotation.igstAmount)}
                  </span>
                </div>
                <div className="border-t-2 border-slate-300 pt-2 flex justify-between items-center text-sm">
                  <span className="font-extrabold text-slate-900">Grand Total:</span>
                  <span className="font-mono font-extrabold text-blue-700 text-base">
                    {formatINR(selectedQuotation.grandTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bank details */}
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 text-xs">
              <div className="flex items-center gap-2 font-bold text-blue-900 mb-1">
                <Landmark className="w-4 h-4 text-blue-700" />
                <span>BANK ACCOUNT FOR WORK ADVANCE</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                {OFFICIAL_COMPANY_DETAILS.bankAccount.bankName} • A/C:{' '}
                <strong className="text-slate-900 font-mono">{OFFICIAL_COMPANY_DETAILS.bankAccount.accountNumber}</strong> •
                IFSC: <strong className="text-slate-900 font-mono">{OFFICIAL_COMPANY_DETAILS.bankAccount.ifsc}</strong> •
                Branch: {OFFICIAL_COMPANY_DETAILS.bankAccount.branch}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
