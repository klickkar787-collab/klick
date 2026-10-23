import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ShieldCheck,
  FileText,
  CreditCard,
  Lock,
  Building,
  CheckCircle2,
  AlertTriangle,
  Landmark,
  Scale,
  Download,
  Printer,
  ChevronRight,
} from 'lucide-react';

export const LegalModal: React.FC = () => {
  const { isLegalModalOpen, setIsLegalModalOpen, legalModalTab, setLegalModalTab, settings } = useApp();

  if (!isLegalModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800 uppercase font-bold">
                  Statutory & Compliance
                </span>
                <span className="text-xs text-slate-400">{settings.legalEntity}</span>
              </div>
              <h2 className="text-xl font-black text-white mt-0.5">
                Legal Policies, Terms & Conditions
              </h2>
            </div>
          </div>
          <button
            onClick={() => setIsLegalModalOpen(false)}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center gap-1 shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setLegalModalTab('privacy')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all ${
              legalModalTab === 'privacy'
                ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-4 h-4 text-blue-600" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setLegalModalTab('terms')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all ${
              legalModalTab === 'terms'
                ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Terms & Conditions</span>
          </button>

          <button
            onClick={() => setLegalModalTab('payment')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all ${
              legalModalTab === 'payment'
                ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4 text-amber-600" />
            <span>Payment Terms & Cancellation Policy</span>
          </button>
        </div>

        {/* Tab Content Area (Scrollable) */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed font-sans">
          {/* TAB 1: PRIVACY POLICY */}
          {legalModalTab === 'privacy' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900">
                  <strong className="font-bold">Strict Role-Based Privacy & Confidentiality Guarantee:</strong>{' '}
                  KlickKar.com enforces rigorous data isolation. Customers only see their own quotations, bookings, and invoices. Internal operational notes, contractor rates, and other customer data are permanently isolated behind password-protected roles.
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 mb-2">1. Introduction & Ownership</h3>
                <p>
                  This Privacy Policy outlines how <strong>{settings.legalEntity}</strong> (operating under the trade name <strong>KlickKar.com</strong>, CIN: <code>{settings.cin}</code>, GSTIN: <code>{settings.gstin}</code>) collects, uses, protects, and handles your personal and commercial data when you visit our website, book services, purchase products, or interact with our automated systems.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 mb-2">2. Information We Collect</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                  <li><strong>Personal Identification Data:</strong> Full name, telephone/mobile number, email address, physical site address, and company name.</li>
                  <li><strong>Statutory & Tax Data (for B2B):</strong> Goods & Services Tax Identification Number (GSTIN), Permanent Account Number (PAN), and billing state code for input tax credit claims.</li>
                  <li><strong>Technical & Site Requirements:</strong> Site photographs, CAD architectural drawings, gate opening dimensions, soil or floor specs, and power supply locations.</li>
                  <li><strong>Transactional Information:</strong> Payment reference (UTR numbers, bank name, payment date, receipt identifiers). We never store your raw banking passwords, card PINs, or CVV.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 mb-2">3. How We Use Your Data</h3>
                <p className="text-xs text-slate-600">
                  We use the information collected solely to:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
                  {[
                    'Generate accurate engineering BOQs, estimates, and Quotations',
                    'Dispatch verified Noida technical teams for site inspections',
                    'Issue GST-compliant e-invoices with CGST/SGST/IGST breakdown',
                    'Provide automated WhatsApp/Telegram order progress notifications',
                    'Fulfill warranty claims and periodic maintenance service contracts',
                    'Comply with Indian tax, corporate, and GST statutory guidelines',
                  ].map((item, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 mb-2">4. Zero Data Selling & Third-Party Protection</h3>
                <p className="text-xs text-slate-600">
                  We maintain a strict zero-tolerance policy against data brokers and unauthorized third parties. Your details are never sold, leased, or rented. Contact information is only provided to the assigned certified KlickKar technician strictly for the purpose of executing the agreed site visit or installation.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 mb-2">5. Data Retention & Security</h3>
                <p className="text-xs text-slate-600">
                  All customer bookings, invoices, and quotation archives are stored using standard encryption protocols. Tax invoices and GST payment records are preserved in accordance with the mandatory statutory retention period (6 years) specified under Section 36 of the CGST Act, 2017.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-1.5">
                <h4 className="font-bold text-slate-900">Grievance Officer & Registered Office</h4>
                <p className="text-slate-600">
                  {settings.legalEntity} • House no 605, Plot no 4, Vill Sardarpur, Noida, Uttar Pradesh, India – 201301.
                </p>
                <p className="text-slate-600">
                  Email: <a href={`mailto:${settings.email}`} className="text-blue-600 underline font-semibold">{settings.email}</a> • Phone: <strong>{settings.phone}</strong>
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: TERMS & CONDITIONS */}
          {legalModalTab === 'terms' && (
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                <FileText className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900">
                  <strong className="font-bold">Engineering SLA & Delivery Standards:</strong>{' '}
                  All fabrication, prefabrication, automation, and MEP contracts executed through KlickKar.com adhere strictly to Indian Standard (IS) codes, tested steel raw material certifications, and formal handover inspection protocols.
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 mb-2">1. Scope of Work & Quotation Validity</h3>
                <p className="text-xs text-slate-600">
                  Quotations issued by KlickKar.com are valid for a standard duration of <strong>15 calendar days</strong> from the date of issuance. Due to ongoing fluctuations in steel, zinc, PUF, and raw material commodities, quotations unconfirmed past the 15-day validity period are subject to re-pricing. Work commences strictly after formal quotation approval and receipt of the requisite advance deposit.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 mb-2">2. Site Readiness & Client Obligations</h3>
                <div className="space-y-2 text-xs text-slate-600">
                  <p>To ensure flawless execution and adhere to scheduled project milestones, the client is responsible for providing:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Unencumbered site access and municipal/society gate entry permissions for vehicles and machinery.</li>
                    <li>Adequate single-phase or three-phase 230V/415V electrical power supply and running water at the work point.</li>
                    <li>Designated dry storage space for dispatched fabrication materials, gate motors, and electronics.</li>
                    <li>Clearance of underlying utilities (hidden plumbing or high-voltage electric lines) prior to floor grouting or drilling.</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 mb-2">3. Product & Fabrication Warranties</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <span className="font-bold text-slate-900 text-xs block mb-1">Gate Automation Motors</span>
                    <span className="text-blue-600 font-bold text-sm block">2 Years Onsite</span>
                    <p className="text-[11px] text-slate-500 mt-1">Comprehensive replacement warranty on Italian gear motor against manufacturing defects.</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <span className="font-bold text-slate-900 text-xs block mb-1">Prefab Porta Cabins</span>
                    <span className="text-emerald-600 font-bold text-sm block">5 Years Structure</span>
                    <p className="text-[11px] text-slate-500 mt-1">Structural frame and PUF sandwich panel integrity warranty against rust & water seepage.</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <span className="font-bold text-slate-900 text-xs block mb-1">CCTV & Electronic Hardware</span>
                    <span className="text-amber-600 font-bold text-sm block">1 Year Replacement</span>
                    <p className="text-[11px] text-slate-500 mt-1">OEM warranty on cameras, NVRs, and power supplies. Optional extended AMC available.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 mb-2">4. Delivery, Cranage & Installation Timelines</h3>
                <p className="text-xs text-slate-600">
                  Prefabricated porta cabins and heavy structural steel gates are delivered on flatbed trailers. If crane unloading is required due to restricted site overhead clearance, crane hiring charges are communicated prior in the quotation or arranged by the client. Installation dates provided in quotation are good faith estimates subject to force majeure and weather suitability.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 mb-2">5. Jurisdiction & Legal Recourse</h3>
                <p className="text-xs text-slate-600">
                  Any dispute, controversy, or claim arising out of or relating to services rendered by KlickKar.com / {settings.legalEntity} shall be governed by the laws of India and subject to the exclusive jurisdiction of the competent courts in <strong>Gautam Buddha Nagar (Noida), Uttar Pradesh</strong>.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: PAYMENT TERMS & CANCELLATION */}
          {legalModalTab === 'payment' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <CreditCard className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <strong className="font-bold">Transparent Payment & Official Banking Policy:</strong>{' '}
                  All payments must be remitted strictly to our verified corporate bank account at <strong>Kotak Mahindra Bank</strong> or via official KlickKar UPI. Never make cash or direct payments to individual technicians without an official receipt.
                </div>
              </div>

              {/* Official Bank Account Box */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-3">
                  <Landmark className="w-4 h-4" />
                  <span>Official Kotak Mahindra Bank Remittance Account</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Beneficiary Name (Legal Entity)</span>
                    <span className="font-bold text-white text-sm">{settings.bankAccount.accountHolder}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Bank Name & Branch</span>
                    <span className="font-bold text-emerald-400 text-sm">
                      {settings.bankAccount.bankName} • {settings.bankAccount.branch}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Current Account Number</span>
                    <span className="font-mono font-black text-amber-300 text-lg tracking-wider">
                      {settings.bankAccount.accountNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">RTGS / NEFT / IMPS IFSC Code</span>
                    <span className="font-mono font-black text-amber-300 text-lg tracking-wider">
                      {settings.bankAccount.ifsc}
                    </span>
                  </div>
                </div>
              </div>

              {/* Supported Payment Modes */}
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-2">1. Supported Payment Modes</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  {[
                    { mode: 'Pay Now (Online)', desc: 'Instant Card, NetBanking & UPI' },
                    { mode: 'UPI / QR Code', desc: 'Scan & Pay to official Kotak VPA' },
                    { mode: 'NEFT Transfer', desc: 'Zero charge B2B bank remittance' },
                    { mode: 'RTGS Transfer', desc: 'Real-time gross settlement > ₹2 Lakh' },
                    { mode: 'IMPS Quick Pay', desc: 'Instant 24x7 mobile banking' },
                    { mode: 'Bank Transfer', desc: 'Direct corporate account transfer' },
                    { mode: 'Demand Draft (DD)', desc: 'Payable at Noida, UP' },
                    { mode: 'Cash on Site', desc: 'Max ₹20,000 (Subject to admin approval)' },
                  ].map((p, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                      <span className="font-bold text-slate-900 block text-xs">{p.mode}</span>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">{p.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestone Schedule */}
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-2">2. Standard Payment Milestone Schedule</h3>
                <div className="space-y-2 text-xs">
                  <div className="bg-slate-50 border-l-4 border-blue-600 p-3 rounded-r-xl flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900 block font-bold">1st Milestone: Advance Payment (40%)</strong>
                      <span className="text-slate-500">Payable upon order confirmation, technical drawing sign-off, and steel allocation.</span>
                    </div>
                    <span className="text-blue-700 font-mono font-bold text-sm shrink-0 pl-3">40%</span>
                  </div>

                  <div className="bg-slate-50 border-l-4 border-amber-500 p-3 rounded-r-xl flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900 block font-bold">2nd Milestone: Progress / Dispatch (40%)</strong>
                      <span className="text-slate-500">Payable upon factory fabrication completion and pre-dispatch inspection approval.</span>
                    </div>
                    <span className="text-amber-700 font-mono font-bold text-sm shrink-0 pl-3">40%</span>
                  </div>

                  <div className="bg-slate-50 border-l-4 border-emerald-600 p-3 rounded-r-xl flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900 block font-bold">3rd Milestone: Final Settlement (20%)</strong>
                      <span className="text-slate-500">Payable immediately upon site erection, operational motor testing, and joint handover sign-off.</span>
                    </div>
                    <span className="text-emerald-700 font-mono font-bold text-sm shrink-0 pl-3">20%</span>
                  </div>
                </div>
              </div>

              {/* Cancellation & Refund Policy */}
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-2">3. Cancellation & Refund Policy</h3>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2 text-slate-600">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p>
                      <strong>Full 100% Refund:</strong> If cancellation request is submitted in writing within 24 hours of booking and prior to site engineer inspection or raw material procurement mobilization.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p>
                      <strong>Custom Fabrication & Structural Steel Orders:</strong> Because MS/SS gates, railings, and insulated porta cabins are custom-cut according to your specific site dimensions, advance payments become non-refundable once steel sheets are cut or PUF sandwich panels are molded.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <p>
                      <strong>Refund Timeline:</strong> Approved refunds will be credited back via NEFT / UPI to the original remitting account within <strong>5 to 7 working banking days</strong> along with an official credit note.
                    </p>
                  </div>
                </div>
              </div>

              {/* GST & TDS Compliance */}
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-2">4. GST Invoicing & TDS Compliance</h3>
                <p className="text-xs text-slate-600">
                  Every transaction is accompanied by an authentic Tax Invoice under Rule 46 of the CGST Rules, 2017. For commercial business entities subject to TDS under Section 194C of the Income Tax Act (1% for individuals/HUFs, 2% for companies), please remit the net payment and provide Form 16A TDS certificates at the close of the financial quarter.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            <span>Official Policy Document • Last revised: October 2026 • Registered in Noida, UP</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => window.print()}
              className="flex-1 sm:flex-none bg-white hover:bg-slate-100 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs border border-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Policy</span>
            </button>
            <button
              onClick={() => setIsLegalModalOpen(false)}
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition-colors cursor-pointer"
            >
              I Understand & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
