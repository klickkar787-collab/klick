import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ASSETS } from '../../data/companyDetails';
import { AIChatMessage, AIChatSession } from '../../types';
import {
  Bot,
  Sparkles,
  X,
  Send,
  User,
  Phone,
  MessageCircle,
  Calendar,
  CheckCircle2,
  RefreshCw,
  HelpCircle,
  ShieldCheck,
  Building2,
} from 'lucide-react';

export const AIChatbotWidget: React.FC = () => {
  const { settings, saveAiChatSession, setIsBookingModalOpen } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [sessionId] = useState(() => `ai-${Date.now()}`);
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      role: 'model',
      text: settings.aiChatbot?.welcomeMessage ||
        'Namaste! Welcome to KlickKar.com (Mitaksh Infra). I am your AI engineering assistant. How can I help you with Porta Cabins, Gate Fabrication, Automation, or CCTV today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [capturedLeadData, setCapturedLeadData] = useState<{
    name?: string;
    phone?: string;
    serviceRequired?: string;
    location?: string;
    budget?: string;
  }>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!settings.aiChatbot?.enabled) return null;

  const quickPrompts = [
    'Porta Cabin sizes & pricing',
    'Automatic sliding gate motor cost',
    'MS boundary railing fabrication',
    'Do you provide free site inspection in Noida?',
    'How does GST tax invoicing work for B2B?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    setInput('');
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMessages: AIChatMessage[] = [
      ...messages,
      { role: 'user', text, timestamp: timeStr },
    ];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: newMessages.slice(0, -1).map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      const data = await res.json();
      const replyText = data.reply || 'Thank you for reaching out. Our engineering team is available at +91 96546 10640.';

      const updatedLead = data.extractedLead
        ? { ...capturedLeadData, ...data.extractedLead }
        : capturedLeadData;

      if (data.extractedLead) {
        setCapturedLeadData(updatedLead);
      }

      const finalMessages: AIChatMessage[] = [
        ...newMessages,
        {
          role: 'model',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ];

      setMessages(finalMessages);

      // Save to AppContext and Admin Dashboard
      const sessionObj: AIChatSession = {
        id: sessionId,
        startTime: new Date().toISOString(),
        messages: finalMessages,
        leadCaptured: Object.keys(updatedLead).length > 0 ? updatedLead : undefined,
        status: updatedLead?.phone ? 'Lead Captured' : 'Active',
      };
      saveAiChatSession(sessionObj);
    } catch (err) {
      console.error('Failed to call AI chat endpoint:', err);
      const fallbackReply = 'Namaste! We are glad to help. Please feel free to call our Noida engineering desk at +91 96546 10640 or request a free site visit.';
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start font-sans">
      {/* Expanded Chatbot Modal */}
      {isOpen && (
        <div className="mb-4 w-84 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 flex flex-col h-[520px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-blue-700"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm tracking-wide">
                    {settings.aiChatbot?.botName || 'KlickKar AI Assistant'}
                  </h3>
                  <span className="bg-blue-900/60 text-[10px] text-blue-200 px-1.5 py-0.5 rounded-sm font-semibold uppercase">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-blue-100 flex items-center gap-1">
                  <span>Powered by Gemini • 24/7 Smart Desk</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-blue-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* AI Disclosure Bar */}
          <div className="bg-blue-50 border-b border-blue-100 px-3 py-1.5 text-[11px] text-blue-800 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>Official KlickKar AI • Mitaksh Infra Noida</span>
            </span>
            <button
              onClick={() => {
                setMessages([
                  {
                    role: 'model',
                    text: 'Namaste! Conversation reset. How can we help your project today?',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ]);
              }}
              className="text-blue-600 hover:underline flex items-center gap-0.5 cursor-pointer text-[10px]"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 bg-slate-50/70 p-4 overflow-y-auto space-y-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2 ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.role === 'model' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.text}</div>
                  <div
                    className={`text-[10px] mt-1 text-right ${
                      m.role === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>
                {m.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 italic">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <span>KlickKar AI is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ Chips */}
          <div className="bg-white border-t border-slate-100 p-2 overflow-x-auto flex gap-1.5 no-scrollbar">
            {quickPrompts.slice(0, 3).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="shrink-0 text-[11px] bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-2.5 py-1 rounded-md border border-slate-200 transition-all cursor-pointer truncate max-w-[200px]"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder="Ask anything (English / हिंदी)..."
              disabled={loading}
              className="flex-1 text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:border-blue-600 placeholder:text-slate-400 disabled:opacity-50"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Escalation Action Bar */}
          <div className="bg-slate-900 text-slate-300 px-3 py-2 text-[11px] flex items-center justify-between border-t border-slate-800">
            <span className="text-slate-400">Need human engineer?</span>
            <div className="flex items-center gap-3">
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <Phone className="w-3 h-3" />
                <span>Call Desk</span>
              </a>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsBookingModalOpen(true);
                }}
                className="text-sky-300 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Calendar className="w-3 h-3" />
                <span>Book Visit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border border-blue-400/30"
        aria-label="Open AI Assistant"
      >
        <div className="relative">
          <Bot className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>
        </div>
        <div className="text-left hidden sm:block">
          <div className="font-bold text-xs leading-none">AI Support</div>
          <div className="text-[10px] text-blue-200">24/7 Smart Helper</div>
        </div>
      </button>
    </div>
  );
};
