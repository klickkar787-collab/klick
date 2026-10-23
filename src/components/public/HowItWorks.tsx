import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Compass,
  FileCheck2,
  CheckCircle,
  Truck,
  ArrowRight,
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { setIsBookingModalOpen } = useApp();

  const steps = [
    {
      num: '01',
      title: 'Submit Requirement or Chat',
      desc: 'Tell us your project scope via our website booking, WhatsApp widget (+91 96546 10640), or our interactive Telegram Bot.',
      icon: <FileText className="w-6 h-6 text-blue-600" />,
    },
    {
      num: '02',
      title: 'Site Visit & CAD Engineering',
      desc: 'Our Noida licensed site engineer inspects your location within 24-48 hours, records exact laser measurements, and drafts CAD designs.',
      icon: <Compass className="w-6 h-6 text-indigo-600" />,
    },
    {
      num: '03',
      title: 'Transparent GST Quotation',
      desc: 'Receive an itemized commercial quotation with transparent material grades, labour breakdown, and statutory GST calculations.',
      icon: <FileCheck2 className="w-6 h-6 text-amber-600" />,
    },
    {
      num: '04',
      title: 'Factory Fabrication & Delivery',
      desc: 'Heavy fabrication carried out at our dedicated factory. Final installation, testing handover, and instant GST Tax Invoice generation.',
      icon: <Truck className="w-6 h-6 text-emerald-600" />,
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
            Transparent Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How KlickKar Works
          </h2>
          <p className="text-sm text-slate-600">
            From initial site measurement in Noida to final factory handover, experience seamless
            engineering with complete peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-200 relative flex flex-col justify-between hover:border-blue-300 transition-all shadow-xs hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200">
                    {step.icon}
                  </div>
                  <span className="text-3xl font-black font-mono text-slate-300">
                    {step.num}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-xs text-blue-600 font-semibold">
                <span>Step {idx + 1} of 4</span>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md transition-all cursor-pointer"
          >
            <span>Book Your Free Inspection Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
