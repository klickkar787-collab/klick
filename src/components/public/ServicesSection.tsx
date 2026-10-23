import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/gstHelper';
import {
  FileText,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Layers,
  Wrench,
  Cpu,
  Camera,
  Hammer,
  Clock,
  Building,
  Paintbrush,
} from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const { services, openBookingForService } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(services.map((s) => s.category)))];

  const filteredServices =
    selectedCategory === 'All'
      ? services
      : services.filter((s) => s.category === selectedCategory);

  const getIconForCategory = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'prefabrication':
        return <Layers className="w-5 h-5 text-blue-500" />;
      case 'fabrication':
        return <Wrench className="w-5 h-5 text-amber-500" />;
      case 'automation':
        return <Cpu className="w-5 h-5 text-indigo-500" />;
      case 'security':
        return <Camera className="w-5 h-5 text-rose-500" />;
      case 'renovation':
        return <Hammer className="w-5 h-5 text-emerald-500" />;
      case 'maintenance':
        return <Clock className="w-5 h-5 text-purple-500" />;
      case 'klickkar property':
        return <Building className="w-5 h-5 text-sky-500" />;
      default:
        return <Paintbrush className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <section id="services-section" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full">
            <span>Direct Factory Solutions</span>
            <span>•</span>
            <span>Noida & NCR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Our Core Industrial & Engineering Services
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Backed by Mitaksh Infra (OPC) Pvt Ltd. All solutions come with certified CAD designs,
            100% genuine raw materials, strict timeline SLA, and GST input credit compliance.
          </p>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
            >
              {/* Image banner */}
              <div className="relative h-48 overflow-hidden bg-slate-900">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-900 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-xs">
                  {getIconForCategory(service.category)}
                  <span>{service.category}</span>
                </div>
                <div className="absolute bottom-3 left-3 text-white">
                  <span className="text-[10px] text-slate-300 block font-mono">HSN / SAC: {service.hsnSac}</span>
                  <div className="font-extrabold text-lg text-white leading-tight">
                    {service.name}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  {service.description}
                </p>

                {/* Features list */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  {service.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing & CTA */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">
                      Starting At
                    </span>
                    <div className="font-extrabold text-base text-slate-900 font-mono">
                      {formatINR(service.basePrice)}{' '}
                      <span className="text-[11px] font-normal text-slate-500">{service.unit}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => openBookingForService(service.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Request Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
