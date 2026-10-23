import React from 'react';
import { useApp } from '../../context/AppContext';
import { ASSETS, OFFICIAL_COMPANY_DETAILS } from '../../data/companyDetails';
import {
  ShieldCheck,
  CheckCircle,
  Building2,
  Users,
  Award,
  Truck,
  Layers,
  FileCheck2,
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { siteContent } = useApp();

  return (
    <section id="about-section" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Story & Vision */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                About KlickKar.com
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                {siteContent?.aboutHeadline || "Building Tomorrow's Modular & Automated Infrastructure Today"}
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {siteContent?.aboutDescription || (
                <>
                  <strong className="text-slate-900">KlickKar.com</strong> was founded with a singular mission: to eliminate the friction, unreliability, and inflated contractor markups traditionally associated with heavy fabrication, modular prefabrication, and facility automation across North India.
                </>
              )}
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Operated under corporate governance by <strong className="text-slate-800">{OFFICIAL_COMPANY_DETAILS.legalEntity}</strong> (CIN: {OFFICIAL_COMPANY_DETAILS.cin}), we blend in-house factory manufacturing in Noida with digital tracking, upfront transparent BOQ pricing, and strict compliance with Indian statutory GST standards.
            </p>

            {/* Credential Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <div className="text-2xl font-black text-blue-700 font-mono">500+</div>
                <div className="text-[11px] text-slate-600 font-medium mt-1">Cabins & Gates Fabricated</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <div className="text-2xl font-black text-rose-600 font-mono">100%</div>
                <div className="text-[11px] text-slate-600 font-medium mt-1">GST Tax Compliant</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <div className="text-2xl font-black text-emerald-600 font-mono">2-Yr</div>
                <div className="text-[11px] text-slate-600 font-medium mt-1">Motor Warranty</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <div className="text-2xl font-black text-indigo-700 font-mono">24h</div>
                <div className="text-[11px] text-slate-600 font-medium mt-1">Site Inspection NCR</div>
              </div>
            </div>

            {/* Key commitments */}
            <div className="space-y-2 pt-2">
              {[
                'Direct ownership of modern welding & laser cutting fabrication plant in Noida',
                'Transparent quotes with labor and materials listed separately',
                'Official corporate billing with MSME UDYAM certification',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Brand Card & Video Intro */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 group">
              <img
                src={ASSETS.mascotBadge}
                alt="KlickKar Just Click Kar"
                className="w-full h-80 object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="text-xs font-mono text-sky-400 font-bold uppercase tracking-wider">
                  Noida Fabrication Hub
                </div>
                <div className="text-lg font-bold">Mitaksh Infra (OPC) Private Limited</div>
                <div className="text-xs text-slate-300 mt-1">
                  Vill Sardarpur, Noida, Gautam Buddha Nagar, UP – 201301
                </div>
              </div>
            </div>

            {/* Corporate Certification Card without stamp */}
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900">Direct Corporate Governance</div>
                <div className="text-slate-500">
                  All engineering projects and invoices are directly managed and backed by Mitaksh Infra (OPC) Private Limited.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
