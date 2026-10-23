import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OFFICIAL_COMPANY_DETAILS, ASSETS } from '../../data/companyDetails';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  ExternalLink,
  Send,
  CheckCircle,
  Clock,
  Building,
  ShieldCheck,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { addTelegramLead, settings } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [service, setService] = useState('Prefabrication (Porta Cabin)');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTelegramLead({
      name: name || 'Contact Form Inquiry',
      phone: phone || '+91 96546 10640',
      serviceRequired: service,
      location: 'Noida / Delhi NCR',
      budget: 'Standard',
      initialMessage: message,
    });
    setSubmitted(true);
  };

  return (
    <section id="contact-section" className="py-20 bg-slate-100 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
            Connect With Our Engineering Team
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Contact KlickKar.com
          </h2>
          <p className="text-sm text-slate-600">
            Headquartered in Noida, serving Delhi NCR with dedicated factory fabrication and on-site engineering crews.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Info & Map Card */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {OFFICIAL_COMPANY_DETAILS.companyName}
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                {OFFICIAL_COMPANY_DETAILS.legalEntity}
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Registered Corporate Office:</div>
                  <div className="text-slate-600 mt-0.5 leading-relaxed">
                    {OFFICIAL_COMPANY_DETAILS.address}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Phone & WhatsApp:</div>
                  <a
                    href={`tel:${OFFICIAL_COMPANY_DETAILS.phone.replace(/\s+/g, '')}`}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    {OFFICIAL_COMPANY_DETAILS.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Official Email:</div>
                  <a
                    href={`mailto:${OFFICIAL_COMPANY_DETAILS.email}`}
                    className="text-slate-700 hover:text-blue-600 font-semibold"
                  >
                    {OFFICIAL_COMPANY_DETAILS.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Working Hours:</div>
                  <div className="text-slate-600">
                    Monday to Saturday: 09:00 AM – 07:00 PM (Emergency 24x7)
                  </div>
                </div>
              </div>
            </div>

            {/* Google Business Profile & Shop Code */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Official Shop Code:</span>
                <span className="font-mono font-bold text-blue-800">{OFFICIAL_COMPANY_DETAILS.shopCode}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="text-slate-500">Google Business:</span>
                <a
                  href={OFFICIAL_COMPANY_DETAILS.googleProfileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Verified Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Right: Instant Direct Message Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Send a Direct Message to Noida Site Manager
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Inquiries are immediately reviewed by our structural engineers. Expect a callback within 30 minutes.
            </p>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-3">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900 text-base">
                  Thank You! Your Message is Dispatched
                </h4>
                <p className="text-xs text-emerald-700">
                  Our project team has recorded your inquiry. An engineer will reach out to{' '}
                  <strong className="font-mono">{phone}</strong> shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-emerald-800 underline font-semibold cursor-pointer pt-2"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sunil Narang"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+91 96546 10640"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:border-blue-600 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Select Required Work
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:border-blue-600 bg-white"
                  >
                    <option value="Prefabrication (Porta Cabin / Container Office)">
                      Prefabrication (Porta Cabin / Container Office)
                    </option>
                    <option value="Fabrication (MS/SS Gate, Railings, Tin Shed)">
                      Fabrication (MS/SS Gate, Railings, Tin Shed)
                    </option>
                    <option value="Smart Gate Automation / Boom Barrier">
                      Smart Gate Automation / Boom Barrier
                    </option>
                    <option value="CCTV Surveillance / Security Systems">
                      CCTV Surveillance / Security Systems
                    </option>
                    <option value="Renovation & Civil Turnkey Work">
                      Renovation & Civil Turnkey Work
                    </option>
                    <option value="Annual Maintenance Contract (AMC)">
                      Annual Maintenance Contract (AMC)
                    </option>
                    <option value="KlickKar Industrial Property">
                      KlickKar Industrial Property
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Describe Project Details & Location
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Enter site location, dimensions, timeline..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl p-3 focus:outline-hidden focus:border-blue-600 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Direct Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
