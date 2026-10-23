import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ASSETS, OFFICIAL_COMPANY_DETAILS } from '../../data/companyDetails';
import { formatINR } from '../../utils/gstHelper';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  PhoneCall,
  Calculator,
  Sparkles,
  Send,
  Building,
  Wrench,
  Cpu,
  Video,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const {
    setIsBookingModalOpen,
    setIsTelegramModalOpen,
    openBookingForService,
    services,
    siteContent,
    setRole,
    setActiveNav,
  } = useApp();

  // Instant Quote Estimator widget inside hero
  const [calcServiceId, setCalcServiceId] = useState<string>(services[0]?.id || 'srv-prefab');
  const [calcQuantity, setCalcQuantity] = useState<number>(1);
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);

  const selectedService = services.find((s) => s.id === calcServiceId) || services[0];
  const calculatedEstimate = (selectedService?.basePrice || 1000) * calcQuantity;

  return (
    <div className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Background architectural pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 relative z-10">
        {/* Top announcement pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-900/50 border border-blue-500/40 px-3.5 py-1.5 rounded-full text-xs text-blue-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold">{siteContent?.announcementBar || 'Mitaksh Infra (OPC) Pvt Ltd • ISO Certified'}</span>
          </div>

          {/* Video Animation trigger */}
          <button
            onClick={() => setShowVideoModal(true)}
            className="inline-flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 text-xs text-sky-300 hover:text-white px-3 py-1.5 rounded-full border border-slate-700 transition-all cursor-pointer"
          >
            <Video className="w-3.5 h-3.5 text-rose-400" />
            <span>Watch Brand Story</span>
          </button>
        </div>

        {/* Hero Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left 7 cols: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-rose-500 font-extrabold tracking-widest text-xs uppercase block">
                {siteContent?.heroTagline || 'NO FIKAR • JUST CLICK KAR'}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                {siteContent?.heroHeadline || 'Turnkey Prefabrication, Heavy Fabrication & Smart Automation'}
              </h1>
            </div>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              {siteContent?.heroSubheadline || 'Factory-direct engineering solutions for porta cabins, container offices, MS/SS gates, automated boom barriers, CCTV surveillance, and civil renovation across Noida, Greater Noida, and Delhi NCR.'}
            </p>

            {/* Service badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {[
                'Prefab Porta Cabins',
                'MS/SS Gates & Railings',
                'Smart Gate Motors',
                'Boom Barriers & RFID',
                'Commercial Renovation',
                'GST Invoices (100% Tax Input)',
              ].map((badge, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 bg-slate-800/60 border border-slate-700/60 px-3 py-2 rounded-lg text-slate-200"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">{badge}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-6 py-3.5 rounded-xl text-sm shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Request Free Site Quotation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setRole('customer');
                  setActiveNav('customer-portal');
                }}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-3.5 rounded-xl text-sm border border-slate-600 shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className="text-blue-400">👤</span>
                <span>Open Customer Portal</span>
              </button>

              <button
                onClick={() => setIsTelegramModalOpen(true)}
                className="bg-[#229ED9] hover:bg-[#1E88E5] text-white font-bold px-5 py-3.5 rounded-xl text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Telegram Bot</span>
              </button>

              <a
                href={`tel:${OFFICIAL_COMPANY_DETAILS.phone.replace(/\s+/g, '')}`}
                className="bg-slate-900/90 hover:bg-slate-800 text-slate-300 font-semibold px-4 py-3.5 rounded-xl text-sm border border-slate-700 flex items-center gap-2 transition-all"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Call {OFFICIAL_COMPANY_DETAILS.phone}</span>
              </a>
            </div>

            {/* Trust line */}
            <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>MSME Registered: {OFFICIAL_COMPANY_DETAILS.msme}</span>
              </div>
              <span>•</span>
              <div className="font-mono text-slate-300">
                GSTIN: 09AATCM1473H1Z0
              </div>
            </div>
          </div>

          {/* Right 5 cols: Mascot & Instant Cost Estimator Card */}
          <div className="lg:col-span-5 space-y-4">
            {/* Mascot Banner Card */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-2xl backdrop-blur-md relative overflow-hidden">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={ASSETS.mascotTools}
                  alt="KlickKar Engineering Mascot"
                  className="w-20 h-20 rounded-xl object-contain bg-white/10 p-1 border border-slate-600"
                />
                <div>
                  <div className="text-xs text-sky-400 font-mono font-bold">
                    INSTANT RATE CALCULATOR
                  </div>
                  <h3 className="text-base font-bold text-white">
                    Get Preliminary Estimates in Seconds
                  </h3>
                  <div className="text-xs text-slate-400">
                    Transparent rates with HSN/SAC code
                  </div>
                </div>
              </div>

              {/* Calculator inputs */}
              <div className="space-y-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1.5">Select Service Category:</label>
                  <select
                    value={calcServiceId}
                    onChange={(e) => setCalcServiceId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 text-white rounded-xl h-11 px-3 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-blue-500"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({formatINR(s.basePrice)} {s.unit})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-slate-300 font-semibold block mb-1.5">Quantity / Scope ({selectedService.unit}):</label>
                    <input
                      type="number"
                      min={1}
                      max={1000}
                      value={calcQuantity}
                      onChange={(e) => setCalcQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-slate-800 border border-slate-600 text-white rounded-xl h-11 px-3 text-sm font-mono text-center font-bold focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <div className="text-right">
                    <div className="text-slate-400 text-[11px]">Estimated Price</div>
                    <div className="text-lg font-bold font-mono text-emerald-400">
                      {formatINR(calculatedEstimate)}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    + 18% GST input credit eligible
                  </span>
                  <button
                    onClick={() => openBookingForService(selectedService.id)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <span>Lock Estimate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Direct Bank Verification Seal */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-700/50">
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-blue-400" />
                  <span>Kotak Mahindra Bank Verified</span>
                </span>
                <span className="text-amber-400 font-mono">Noida Sec-18 Branch</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Intro Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-4 relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-rose-500" />
                <span>KlickKar Official Brand Assembly</span>
              </h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
              <video
                src={ASSETS.introVideo}
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
