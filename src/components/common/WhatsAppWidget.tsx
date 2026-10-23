import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ASSETS } from '../../data/companyDetails';
import { MessageCircle, X, Send, CheckCheck, Clock } from 'lucide-react';

export const WhatsAppWidget: React.FC = () => {
  const { settings } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messageText, setMessageText] = useState('');

  if (!settings.whatsapp.enabled) return null;

  const quickPrompts = [
    'Hi KlickKar, I need a quotation for Prefabrication / Porta Cabin.',
    'Hi, I need emergency Fabrication or Gate Automation in Noida.',
    'I want to speak with your Noida Project Manager for site inspection.',
    'Need custom MS/SS railing and gate fabrication pricing.',
  ];

  const handleSend = (text: string) => {
    const cleanPhone = settings.whatsapp.phoneNumber.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(text || settings.whatsapp.defaultMessage);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Popover */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={ASSETS.mascotBadge}
                  alt="KlickKar Support"
                  className="w-10 h-10 rounded-full bg-white object-cover border-2 border-white shadow-xs"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-300 border-2 border-emerald-600 rounded-full"></span>
              </div>
              <div>
                <h3 className="font-bold text-sm">KlickKar.com WhatsApp</h3>
                <div className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Typically replies in 5 minutes</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-100 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-emerald-50/40 max-h-72 overflow-y-auto space-y-3">
            <div className="bg-white rounded-xl p-3 shadow-xs border border-emerald-100 text-xs text-slate-700 space-y-1">
              <div className="font-bold text-emerald-800 flex items-center justify-between">
                <span>Mitaksh Infra Desk</span>
                <span className="text-[10px] text-slate-400">Just now</span>
              </div>
              <p>
                Namaste! Welcome to KlickKar.com. How can our engineering and fabrication team help you today?
              </p>
              <div className="flex justify-end">
                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>

            {/* Quick Suggestions */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Quick Inquiries:
              </span>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setMessageText(prompt);
                    handleSend(prompt);
                  }}
                  className="w-full text-left text-xs bg-white hover:bg-emerald-50 text-slate-800 p-2 rounded-lg border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Input */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend(messageText);
              }}
              className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-hidden focus:border-emerald-600"
            />
            <button
              onClick={() => handleSend(messageText)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-lg transition-colors cursor-pointer"
              title="Open WhatsApp"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer whatsapp-widget"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="hidden sm:inline font-bold text-sm tracking-wide">
          {isOpen ? 'Close Chat' : 'Chat on WhatsApp'}
        </span>
      </button>
    </div>
  );
};
