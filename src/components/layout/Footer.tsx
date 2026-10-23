import React from 'react';
import { useApp } from '../../context/AppContext';
import { ASSETS, SERVICE_AREAS } from '../../data/companyDetails';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Landmark,
  ShieldAlert,
  ExternalLink,
  CheckCircle2,
  FileCheck,
  Send,
  ShieldCheck,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setActiveNav, setIsTelegramModalOpen, siteContent } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: About & Logo */}
          <div className="space-y-4">
            <div className="bg-white p-2 rounded-lg inline-block">
              <img
                src={ASSETS.logo}
                alt="KlickKar.com"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-200">KlickKar.com</strong> is the premier engineering, prefabrication, fabrication, and facility automation business platform operated by{' '}
              <strong className="text-white">{settings.legalEntity}</strong>.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1 border-t border-slate-800">
              <div className="flex items-center gap-1.5 text-white font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>ISO & MSME Verified Platform</span>
              </div>
              <div className="text-slate-400">Direct Factory Fabrication • Noida, UP</div>
            </div>
          </div>

          {/* Col 2: Core Services */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2">
              Engineering Services
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { name: 'Prefabrication & Porta Cabins', id: 'services' },
                { name: 'Heavy MS & SS Fabrication', id: 'services' },
                { name: 'Smart Gate Automation & Boom Barriers', id: 'services' },
                { name: 'CCTV & Integrated Security Systems', id: 'services' },
                { name: 'Turnkey Civil Renovation & Construction', id: 'services' },
                { name: 'Facility Maintenance & AMC Contracts', id: 'services' },
                { name: 'KlickKar Commercial Property Services', id: 'services' },
                { name: 'Interior, Electrical & Plumbing MEP', id: 'services' },
              ].map((s, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => setActiveNav(s.id)}
                    className="hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer text-slate-300"
                  >
                    <span className="text-blue-500 text-[10px]">▸</span>
                    <span>{s.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Legal & Registration Credentials */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-red-500 pl-2">
              Statutory & Tax Details
            </h4>
            <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 text-xs space-y-2 font-mono">
              <div>
                <span className="text-slate-400 font-sans">GSTIN: </span>
                <span className="text-amber-300 font-bold">{settings.gstin}</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans">CIN: </span>
                <span className="text-slate-200">{settings.cin}</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans">PAN: </span>
                <span className="text-slate-200">{settings.pan}</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans">TAN: </span>
                <span className="text-slate-200">{settings.tan}</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans">MSME: </span>
                <span className="text-emerald-400">{settings.msme}</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans">Shop Code: </span>
                <span className="text-sky-300">{settings.shopCode}</span>
              </div>
            </div>

            <div className="mt-3">
              <a
                href={settings.googleProfileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-sky-400 hover:text-sky-300 inline-flex items-center gap-1"
              >
                <span>Google Business Profile</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Col 4: Bank Details & Direct Contact */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
              Official Bank Details
            </h4>
            <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 text-xs space-y-1.5 text-slate-300">
              <div className="flex items-center gap-1.5 text-white font-semibold">
                <Landmark className="w-3.5 h-3.5 text-amber-400" />
                <span>{settings.bankAccount.bankName}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Holder: {settings.bankAccount.accountHolder}
              </div>
              <div className="font-mono text-emerald-300 font-bold">
                A/C: {settings.bankAccount.accountNumber}
              </div>
              <div className="font-mono text-slate-300 text-[11px]">
                IFSC: <span className="text-amber-300">{settings.bankAccount.ifsc}</span> | {settings.bankAccount.branch}
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="text-slate-400 leading-tight">{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="text-slate-200 hover:text-white font-semibold">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="text-slate-200 hover:text-white">
                  {settings.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Service Areas Band */}
        <div className="py-6 border-b border-slate-800">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider">Service Coverage:</span>
            {SERVICE_AREAS.map((area, idx) => (
              <span
                key={idx}
                className="bg-slate-900 text-slate-300 px-2.5 py-1 rounded border border-slate-800 flex items-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3 text-blue-400" />
                <span>{area}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <div>
              © {new Date().getFullYear()} <strong className="text-slate-300">KlickKar.com</strong>. All rights reserved. Powered by {settings.legalEntity}.
            </div>
            {siteContent?.footerNotice && (
              <p className="text-[11px] text-slate-500 mt-1 max-w-xl">{siteContent.footerNotice}</p>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setIsTelegramModalOpen(true)}
              className="text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram Lead Bot</span>
            </button>
            <span>•</span>
            <span className="text-slate-400">GST-Compliant B2B & B2C Billing</span>
            <span>•</span>
            <span className="text-slate-400">Noida, UP, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
