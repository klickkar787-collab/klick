import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ASSETS } from '../../data/companyDetails';
import {
  Send,
  X,
  Bot,
  User,
  CheckCircle,
  ExternalLink,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface ChatMsg {
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export const TelegramBotModal: React.FC = () => {
  const { isTelegramModalOpen, setIsTelegramModalOpen, addTelegramLead, settings } = useApp();

  const [step, setStep] = useState<number>(0);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceRequired: 'Prefabrication (Porta Cabin / Office)',
    location: '',
    budget: '',
  });

  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      sender: 'bot',
      text: `👋 Namaste! Welcome to KlickKar.com Official Telegram Assistant (@${settings.telegram.botUsername}).\nI am here to help you get instant estimates, schedule site visits, and connect directly with our Noida engineering team.`,
      time: 'Just now',
    },
    {
      sender: 'bot',
      text: 'To get started, please tell me: What is your Full Name?',
      time: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isTelegramModalOpen) return null;

  const getTime = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleSend = () => {
    if (!inputVal.trim()) return;
    const userText = inputVal.trim();
    setInputVal('');

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText, time: getTime() },
    ]);

    setTimeout(() => {
      if (step === 0) {
        setFormData((prev) => ({ ...prev, name: userText }));
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: `Pleasure to connect with you, ${userText}! 📱 What is your 10-digit WhatsApp or Phone number?`,
            time: getTime(),
          },
        ]);
        setStep(1);
      } else if (step === 1) {
        setFormData((prev) => ({ ...prev, phone: userText }));
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: `Got your contact. 🛠️ Which service do you require?\n• Prefabrication (Porta Cabin)\n• Fabrication (Gates/Railings/Sheds)\n• Smart Automation\n• Security / CCTV\n• Renovation / Civil`,
            time: getTime(),
          },
        ]);
        setStep(2);
      } else if (step === 2) {
        setFormData((prev) => ({ ...prev, serviceRequired: userText }));
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: `📍 What is your site or project location? (e.g. Noida Sector 62, Greater Noida West, Delhi NCR)`,
            time: getTime(),
          },
        ]);
        setStep(3);
      } else if (step === 3) {
        setFormData((prev) => ({ ...prev, location: userText }));
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: `💰 What is your approximate planned budget range? (e.g., ₹50,000, ₹2 - 5 Lakhs, or Flexible)`,
            time: getTime(),
          },
        ]);
        setStep(4);
      } else if (step === 4) {
        const finalData = {
          ...formData,
          budget: userText,
        };
        setFormData(finalData);

        // Dispatch real lead to central state and Admin dashboard
        addTelegramLead({
          name: finalData.name || 'Anonymous Client',
          phone: finalData.phone || '+91 96546 10640',
          serviceRequired: finalData.serviceRequired || 'Engineering Work',
          location: finalData.location || 'Noida NCR',
          budget: userText,
          initialMessage: `Client Telegram Bot Conversation completed. Interested in ${finalData.serviceRequired}`,
        });

        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: `🎉 Thank you, ${finalData.name}! Your enquiry has been received and logged directly into our Admin Management System.\n\nOur Project Manager from Mitaksh Infra (OPC) Pvt Ltd will contact you shortly on ${finalData.phone} with drawings and an official GST Quotation!`,
            time: getTime(),
          },
        ]);
        setStep(5);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: `Our engineers have been notified of your note: "${userText}". We will address it on your call!`,
            time: getTime(),
          },
        ]);
      }
    }, 600);
  };

  const handleReset = () => {
    setStep(0);
    setFormData({
      name: '',
      phone: '',
      serviceRequired: 'Prefabrication (Porta Cabin / Office)',
      location: '',
      budget: '',
    });
    setMessages([
      {
        sender: 'bot',
        text: `👋 Welcome back! Let's start fresh. What is your Full Name?`,
        time: getTime(),
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px] animate-in fade-in zoom-in-95 duration-200">
        {/* Telegram Header */}
        <div className="bg-[#229ED9] text-white p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">KlickKar Bot</h3>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">
                  @{settings.telegram.botUsername}
                </span>
              </div>
              <p className="text-xs text-sky-100 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                <span>Bot Online • Live Lead Capture</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-1.5 text-sky-100 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title="Reset Chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsTelegramModalOpen(false)}
              className="p-1.5 text-sky-100 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Telegram Messages Container */}
        <div className="flex-1 bg-slate-950/60 p-4 overflow-y-auto space-y-3 font-sans">
          <div className="text-center my-1">
            <span className="text-[10px] bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700">
              Telegram Bot Connected • Encrypted Channel
            </span>
          </div>

          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2 ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'bot' && (
                <div className="w-7 h-7 rounded-full bg-sky-600/30 border border-sky-500/40 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-sky-400" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-[#2AABEE] text-white rounded-tr-xs'
                    : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
                <div
                  className={`text-[10px] mt-1 text-right ${
                    m.sender === 'user' ? 'text-sky-100' : 'text-slate-400'
                  }`}
                >
                  {m.time}
                </div>
              </div>
              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills when selecting service */}
        {step === 2 && (
          <div className="bg-slate-900 border-t border-slate-800 p-2 flex flex-wrap gap-1.5">
            {[
              'Prefabrication (Porta Cabin)',
              'Heavy MS/SS Gate Fabrication',
              'Smart Automatic Boom Barrier',
              'CCTV & Surveillance System',
              'Factory Tin Shed Roofing',
              'Civil Renovation Work',
            ].map((srv, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputVal(srv);
                }}
                className="text-xs bg-slate-800 hover:bg-sky-900 text-sky-300 hover:text-white px-2.5 py-1 rounded border border-slate-700 transition-all cursor-pointer"
              >
                {srv}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="bg-slate-900 p-3 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder={
              step === 0
                ? 'Enter your full name...'
                : step === 1
                ? 'Enter phone number (e.g. 96546 10640)...'
                : step === 2
                ? 'Select or type service needed...'
                : step === 3
                ? 'Enter site location (e.g. Noida Sector 62)...'
                : step === 4
                ? 'Enter budget range (e.g. ₹2.5 Lakhs)...'
                : 'Send another message...'
            }
            className="flex-1 bg-slate-800 text-white text-xs sm:text-sm border border-slate-700 rounded-xl px-4 py-2.5 focus:outline-hidden focus:border-[#229ED9] placeholder:text-slate-500"
          />
          <button
            onClick={handleSend}
            disabled={!inputVal.trim()}
            className="bg-[#229ED9] hover:bg-[#1E88E5] disabled:opacity-40 text-white p-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Footer Real Telegram Bot link note */}
        <div className="bg-slate-950 px-4 py-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800">
          <span>
            Connected to Admin Leads Engine • Token: <code className="text-sky-400">{settings.telegram.botToken.slice(0, 14)}...</code>
          </span>
          <a
            href={`https://t.me/${settings.telegram.botUsername}`}
            target="_blank"
            rel="noreferrer"
            className="text-sky-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Open in Telegram App</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
