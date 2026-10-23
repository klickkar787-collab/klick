import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { GSTInvoice } from '../../types';
import { ASSETS, OFFICIAL_COMPANY_DETAILS } from '../../data/companyDetails';
import { formatINR, formatDateIN } from '../../utils/gstHelper';
import { exportInvoicePDF } from '../../utils/pdfGenerator';
import {
  X,
  Printer,
  Download,
  Building,
  CheckCircle,
  Clock,
  Landmark,
  ShieldCheck,
  CreditCard,
  FileCheck2,
} from 'lucide-react';

export const GSTInvoiceModal: React.FC = () => {
  const { selectedInvoice, setSelectedInvoice, updateInvoicePayment, role } = useApp();
  const printRef = useRef<HTMLDivElement>(null);

  if (!selectedInvoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    exportInvoicePDF(selectedInvoice);
  };

  const isIntraState = selectedInvoice.placeOfSupply?.startsWith('09');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 flex flex-col max-h-[92vh]">
        {/* Top Control Bar (Hidden on print) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/30 border border-blue-400 rounded-lg">
              <FileCheck2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">GST Tax Invoice</h3>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    selectedInvoice.paymentStatus === 'Paid'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : selectedInvoice.paymentStatus === 'Partially Paid'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {selectedInvoice.paymentStatus}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {selectedInvoice.invoiceNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {role === 'admin' && (
              <select
                value={selectedInvoice.paymentStatus}
                onChange={(e) =>
                  updateInvoicePayment(
                    selectedInvoice.id,
                    e.target.value as GSTInvoice['paymentStatus']
                  )
                }
                className="bg-slate-800 text-xs border border-slate-700 text-white rounded-lg px-2.5 py-1.5 focus:outline-hidden"
              >
                <option value="Unpaid">Mark Unpaid</option>
                <option value="Partially Paid">Mark Partially Paid</option>
                <option value="Paid">Mark Paid</option>
                <option value="Cancelled">Cancel Invoice</option>
              </select>
            )}

            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              title="Print Invoice"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={() => setSelectedInvoice(null)}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-100 print:bg-white print:p-0">
          <div
            id="printable-invoice"
            ref={printRef}
            className="bg-white p-8 sm:p-12 shadow-md rounded-xl border border-slate-200 print:shadow-none print:border-none print:p-0 text-slate-800 max-w-3xl mx-auto"
          >
            {/* Top Heading Banner */}
            <div className="border-b-2 border-blue-700 pb-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <img
                    src={ASSETS.logo}
                    alt="KlickKar.com"
                    className="h-16 w-auto object-contain mb-2"
                  />
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                    An Engineering & Industrial Services Venture by
                  </div>
                  <h1 className="text-base font-extrabold text-slate-900">
                    {OFFICIAL_COMPANY_DETAILS.legalEntity}
                  </h1>
                  <p className="text-xs text-slate-600 max-w-md mt-1 leading-relaxed">
                    {OFFICIAL_COMPANY_DETAILS.address}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Phone: <span className="font-semibold">{OFFICIAL_COMPANY_DETAILS.phone}</span> | Email:{' '}
                    <span className="font-semibold">{OFFICIAL_COMPANY_DETAILS.email}</span>
                  </p>
                </div>

                <div className="text-right sm:self-start bg-blue-50/80 p-4 rounded-xl border border-blue-100 min-w-[220px]">
                  <div className="text-sm font-extrabold text-blue-900 tracking-wider">
                    TAX INVOICE
                  </div>
                  <div className="text-[10px] text-blue-700 mb-2 font-medium">
                    (Original for Recipient)
                  </div>
                  <div className="text-xs space-y-1 text-slate-700">
                    <div>
                      <span className="text-slate-500">Invoice No:</span>{' '}
                      <strong className="font-mono text-slate-900">{selectedInvoice.invoiceNumber}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Date:</span>{' '}
                      <strong>{formatDateIN(selectedInvoice.invoiceDate)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Place of Supply:</span>{' '}
                      <strong>{selectedInvoice.placeOfSupply}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Reverse Charge:</span>{' '}
                      <strong>{selectedInvoice.reverseCharge}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tax & Legal Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-200 text-[11px] font-mono">
                <div className="bg-slate-50 p-2 rounded">
                  <span className="text-slate-500 block text-[10px] font-sans">GSTIN</span>
                  <span className="font-bold text-blue-700">{OFFICIAL_COMPANY_DETAILS.gstin}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded">
                  <span className="text-slate-500 block text-[10px] font-sans">PAN</span>
                  <span className="font-bold text-slate-800">{OFFICIAL_COMPANY_DETAILS.pan}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded">
                  <span className="text-slate-500 block text-[10px] font-sans">CIN</span>
                  <span className="font-bold text-slate-800">{OFFICIAL_COMPANY_DETAILS.cin}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded">
                  <span className="text-slate-500 block text-[10px] font-sans">MSME REG.</span>
                  <span className="font-bold text-emerald-700">{OFFICIAL_COMPANY_DETAILS.msme}</span>
                </div>
              </div>
            </div>

            {/* Billed To / Recipient Details */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Billed To (Customer / Client):
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="font-bold text-sm text-slate-900">{selectedInvoice.customerName}</div>
                  <div className="text-slate-600 mt-0.5">{selectedInvoice.customerAddress}</div>
                  <div className="text-slate-600 mt-1">
                    Phone: <span className="font-semibold text-slate-800">{selectedInvoice.customerPhone}</span>
                  </div>
                  {selectedInvoice.customerEmail && (
                    <div className="text-slate-600">Email: {selectedInvoice.customerEmail}</div>
                  )}
                </div>

                <div className="space-y-1 sm:text-right">
                  {selectedInvoice.customerGstin ? (
                    <div>
                      <span className="text-slate-500">Customer GSTIN:</span>{' '}
                      <span className="font-bold font-mono text-blue-800">{selectedInvoice.customerGstin}</span>
                    </div>
                  ) : (
                    <div className="text-slate-500 italic">Unregistered Consumer (B2C)</div>
                  )}
                  {selectedInvoice.customerPan && (
                    <div>
                      <span className="text-slate-500">Customer PAN:</span>{' '}
                      <span className="font-mono font-semibold">{selectedInvoice.customerPan}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-500">State / Code:</span>{' '}
                    <span className="font-semibold">{selectedInvoice.placeOfSupply}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-xs text-left border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-blue-700 text-white">
                    <th className="py-2.5 px-3 border border-blue-600 w-8 text-center">#</th>
                    <th className="py-2.5 px-3 border border-blue-600">Description of Goods / Services</th>
                    <th className="py-2.5 px-2 border border-blue-600 text-center">HSN/SAC</th>
                    <th className="py-2.5 px-2 border border-blue-600 text-center">Qty</th>
                    <th className="py-2.5 px-3 border border-blue-600 text-right">Rate</th>
                    <th className="py-2.5 px-3 border border-blue-600 text-right">Taxable Value</th>
                    <th className="py-2.5 px-3 border border-blue-600 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {selectedInvoice.items.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 text-center border border-slate-200 text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-3 border border-slate-200">
                        <span className="font-semibold text-slate-900 block">{item.description}</span>
                        <span className="text-[10px] text-slate-500">
                          {isIntraState ? `GST: 18% (CGST 9% + SGST 9%)` : `GST: 18% (IGST 18%)`}
                        </span>
                      </td>
                      <td className="py-3 px-2 border border-slate-200 text-center font-mono font-medium text-slate-700">
                        {item.hsnSac || '9954'}
                      </td>
                      <td className="py-3 px-2 border border-slate-200 text-center">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="py-3 px-3 border border-slate-200 text-right font-mono">
                        {formatINR(item.unitPrice)}
                      </td>
                      <td className="py-3 px-3 border border-slate-200 text-right font-mono font-semibold">
                        {formatINR(item.taxableValue)}
                      </td>
                      <td className="py-3 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                        {formatINR(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations & GST Breakup */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {/* Left: Amount in Words & Notes */}
              <div className="space-y-4 text-xs">
                <div>
                  <div className="font-bold text-slate-700 mb-1">Invoice Amount in Words:</div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 italic font-medium text-slate-800">
                    {selectedInvoice.amountInWords || 'Amount in words calculated'}
                  </div>
                </div>

                {selectedInvoice.notes && (
                  <div>
                    <div className="font-bold text-slate-700 mb-1">Terms & Notes:</div>
                    <div className="text-slate-600 text-[11px] leading-relaxed">
                      {selectedInvoice.notes}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Tax Summary Table */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Total Taxable Value:</span>
                  <span className="font-mono font-semibold text-slate-900">{formatINR(selectedInvoice.taxableAmount)}</span>
                </div>

                {isIntraState ? (
                  <>
                    <div className="flex justify-between text-slate-600">
                      <span>Central GST (CGST @ 9%):</span>
                      <span className="font-mono font-semibold text-slate-900">{formatINR(selectedInvoice.totalCgst)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>State GST (SGST @ 9%):</span>
                      <span className="font-mono font-semibold text-slate-900">{formatINR(selectedInvoice.totalSgst)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-slate-600">
                    <span>Integrated GST (IGST @ 18%):</span>
                    <span className="font-mono font-semibold text-slate-900">{formatINR(selectedInvoice.totalIgst)}</span>
                  </div>
                )}

                <div className="border-t-2 border-slate-300 pt-2 flex justify-between items-center text-sm">
                  <span className="font-extrabold text-slate-900">Grand Total (INR):</span>
                  <span className="font-mono font-extrabold text-blue-700 text-base">
                    {formatINR(selectedInvoice.grandTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Official Bank Details & Seal / Signatory Block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t-2 border-slate-200">
              {/* Bank Details */}
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 text-xs">
                <div className="flex items-center gap-2 font-bold text-blue-900 mb-2">
                  <Landmark className="w-4 h-4 text-blue-700" />
                  <span>OFFICIAL BANK PAYMENT DETAILS</span>
                </div>
                <div className="space-y-1 text-slate-700">
                  <div>
                    <span className="text-slate-500">Bank:</span>{' '}
                    <strong className="text-slate-900">{OFFICIAL_COMPANY_DETAILS.bankAccount.bankName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Account Holder:</span>{' '}
                    <strong>{OFFICIAL_COMPANY_DETAILS.bankAccount.accountHolder}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Account Number:</span>{' '}
                    <strong className="font-mono text-emerald-800 text-sm">
                      {OFFICIAL_COMPANY_DETAILS.bankAccount.accountNumber}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500">IFSC Code:</span>{' '}
                    <strong className="font-mono text-slate-900">{OFFICIAL_COMPANY_DETAILS.bankAccount.ifsc}</strong>{' '}
                    <span className="text-slate-400">|</span> Branch:{' '}
                    <strong>{OFFICIAL_COMPANY_DETAILS.bankAccount.branch}</strong>
                  </div>
                </div>
              </div>

              {/* Authorized Signatory Block without stamp */}
              <div className="flex flex-col justify-between p-4 border border-slate-200 rounded-xl bg-slate-50/50 min-h-[140px]">
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider text-right">
                  For {OFFICIAL_COMPANY_DETAILS.legalEntity}
                </div>

                <div className="text-right pt-8">
                  <div className="inline-block border-t border-slate-400 pt-1 text-center min-w-[180px]">
                    <div className="text-xs font-bold text-slate-900">Authorized Signatory</div>
                    <div className="text-[10px] text-slate-500">Mitaksh Infra (OPC) Pvt Ltd • Noida</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400 space-y-1">
              <div>
                This is a computer generated invoice issued by Mitaksh Infra (OPC) Private Limited under the Central Goods and Services Tax Act, 2017.
              </div>
              <div>
                All disputes are subject to Gautam Buddha Nagar (Noida), Uttar Pradesh jurisdiction only.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
