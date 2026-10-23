import React from 'react';
import { ASSETS, OFFICIAL_COMPANY_DETAILS } from '../../data/companyDetails';
import {
  ShieldCheck,
  Award,
  Clock,
  Wrench,
  FileCheck,
  CheckCircle2,
  Building2,
  Sparkles,
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const points = [
    {
      title: 'Factory-Direct Pricing',
      desc: 'No middlemen or local sub-contractors. We manufacture in our dedicated fabrication plant in Noida, offering wholesale structural steel rates.',
      icon: <Building2 className="w-5 h-5 text-blue-600" />,
    },
    {
      title: '100% GST Invoiced & ITC Eligible',
      desc: 'All projects include itemized HSN/SAC codes, CGST/SGST/IGST breakdown, and verifiable invoices under Mitaksh Infra (OPC) Pvt Ltd for corporate tax credit.',
      icon: <FileCheck className="w-5 h-5 text-emerald-600" />,
    },
    {
      title: '2-Year Automation Motor Warranty',
      desc: 'Our Italian sliding and swing gate motors come with a direct 2-Year replacement warranty, plus free quarterly preventative servicing.',
      icon: <Award className="w-5 h-5 text-amber-600" />,
    },
    {
      title: 'Strict Milestones & SLA Deadlines',
      desc: 'Pre-agreed project delivery schedules with liquidated damages protection. Complete transparency via our live online tracking portal.',
      icon: <Clock className="w-5 h-5 text-purple-600" />,
    },
    {
      title: 'Certified MSME & Corporate Entity',
      desc: `Registered under Ministry of Corporate Affairs (CIN: ${OFFICIAL_COMPANY_DETAILS.cin}) and MSME (UDYAM: ${OFFICIAL_COMPANY_DETAILS.msme}).`,
      icon: <ShieldCheck className="w-5 h-5 text-rose-600" />,
    },
    {
      title: 'Kotak Mahindra Verified Bank Desk',
      desc: 'Direct company bank account billing. Every quotation and invoice carries our official seal and authorized signature.',
      icon: <Sparkles className="w-5 h-5 text-sky-600" />,
    },
  ];

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Credentials */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl shadow-xl space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                  <Building2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs text-sky-400 font-bold uppercase tracking-wider block">
                    Registered Office
                  </span>
                  <h3 className="text-base font-bold text-white">
                    {OFFICIAL_COMPANY_DETAILS.legalEntity}
                  </h3>
                  <div className="text-xs text-slate-300 font-mono mt-0.5">
                    Noida, Uttar Pradesh – 201301
                  </div>
                </div>
              </div>

              <div className="relative rounded-xl overflow-hidden bg-slate-950 p-4 border border-slate-700 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">GSTIN:</span>
                  <span className="font-mono text-amber-300 font-bold">{OFFICIAL_COMPANY_DETAILS.gstin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Shop Code:</span>
                  <span className="font-mono text-sky-300">{OFFICIAL_COMPANY_DETAILS.shopCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Primary Bank:</span>
                  <span className="font-semibold text-white">Kotak Mahindra Bank</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Account Number:</span>
                  <span className="font-mono text-emerald-400 font-bold">{OFFICIAL_COMPANY_DETAILS.bankAccount.accountNumber}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-blue-950/60 p-3 rounded-xl border border-blue-800/60 text-xs text-blue-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Genuine Materials (Jindal, Tata Steel, Italian Motors)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Why Choose Grid */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-950 px-3 py-1 rounded-full border border-blue-800">
                The KlickKar Assurance
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-3">
                Why Business & Property Owners Choose KlickKar.com
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                We combine heavy industrial manufacturing with modern digital convenience.
                No ambiguity, no inflated local vendor pricing.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {points.map((pt, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 hover:border-slate-600 transition-all space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-slate-700/60 rounded-lg">
                      {pt.icon}
                    </div>
                    <h4 className="font-bold text-sm text-white">{pt.title}</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {pt.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
