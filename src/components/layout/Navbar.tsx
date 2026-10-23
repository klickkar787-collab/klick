import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ASSETS } from '../../data/companyDetails';
import { UserRole } from '../../types';
import {
  Phone,
  ShieldCheck,
  User,
  Wrench,
  Building2,
  Menu,
  X,
  FileText,
  Send,
  Calendar,
  ChevronDown,
  LogOut,
  LogIn,
  KeyRound,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    activeNav,
    setActiveNav,
    currentUser,
    logout,
    openAuthModal,
    setIsBookingModalOpen,
    setIsTelegramModalOpen,
    settings,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPortalDropdown, setShowPortalDropdown] = useState(false);

  // Exact Customer Interface Navigation specified by user:
  // Home | About Us | Prefabrication | Fabrication | Automation | Security | Renovation | Construction | Maintenance | KlickKar Property | Contact us
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'prefabrication', label: 'Prefabrication' },
    { id: 'fabrication', label: 'Fabrication' },
    { id: 'automation', label: 'Automation' },
    { id: 'security', label: 'Security' },
    { id: 'renovation', label: 'Renovation' },
    { id: 'construction', label: 'Construction' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'klickkar-property', label: 'KlickKar Property' },
    { id: 'contact', label: 'Contact us' },
  ];

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackOrCustomerPortal = () => {
    if (currentUser) {
      if (currentUser.role === 'customer') {
        setActiveNav('customer-portal');
      } else {
        setActiveNav('portal');
      }
    } else {
      openAuthModal('customer');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top corporate & auth banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Mitaksh Infra (OPC) Pvt Ltd</span>
              <span className="text-slate-500">|</span>
              <span className="font-mono text-slate-300">GSTIN: {settings.gstin}</span>
            </span>
            <span className="hidden xl:inline text-slate-400">
              Noida, Greater Noida, Ghaziabad & Delhi NCR
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Customer Tracking Shortcut */}
            <button
              onClick={handleTrackOrCustomerPortal}
              className="text-sky-300 hover:text-white font-medium flex items-center gap-1 cursor-pointer transition-colors"
              title="Track existing booking, quotation or GST invoice"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Track Orders / GST Invoices</span>
            </button>

            <span className="text-slate-700">|</span>

            {/* Telegram Shortcut */}
            <button
              onClick={() => setIsTelegramModalOpen(true)}
              className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium cursor-pointer transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram Bot</span>
            </button>

            <span className="text-slate-700">|</span>

            {/* Phone */}
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-semibold transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{settings.phone}</span>
            </a>

            <span className="text-slate-700">|</span>

            {/* Authenticated User Session or Login Triggers */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (currentUser.role === 'customer') {
                      setActiveNav('customer-portal');
                    } else {
                      setActiveNav('portal');
                    }
                  }}
                  className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-all border ${
                    currentUser.role === 'admin'
                      ? 'bg-rose-950 text-rose-300 border-rose-800 hover:bg-rose-900'
                      : currentUser.role === 'provider'
                      ? 'bg-amber-950 text-amber-300 border-amber-800 hover:bg-amber-900'
                      : 'bg-blue-950 text-blue-300 border-blue-800 hover:bg-blue-900'
                  }`}
                  title={`Logged in as ${currentUser.name}`}
                >
                  {currentUser.role === 'admin' && <Building2 className="w-3 h-3 text-rose-400" />}
                  {currentUser.role === 'provider' && <Wrench className="w-3 h-3 text-amber-400" />}
                  {currentUser.role === 'customer' && <User className="w-3 h-3 text-blue-400" />}
                  <span className="max-w-[120px] truncate">{currentUser.name}</span>
                  <span className="text-[10px] opacity-75 uppercase">
                    ({currentUser.role === 'provider' ? 'Vendor' : currentUser.role})
                  </span>
                </button>

                <button
                  onClick={logout}
                  className="text-slate-400 hover:text-rose-400 text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                  title="Log out of current session"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowPortalDropdown(!showPortalDropdown)}
                  className="bg-blue-700 hover:bg-blue-600 text-white px-2.5 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>Portal Login</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {showPortalDropdown && (
                  <div className="absolute right-0 mt-1.5 w-48 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 p-1.5 z-50 text-xs animate-fade-in">
                    <button
                      onClick={() => {
                        setShowPortalDropdown(false);
                        openAuthModal('admin');
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-50 hover:text-rose-700 flex items-center gap-2 cursor-pointer font-bold"
                    >
                      <Building2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>Admin Control Panel</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowPortalDropdown(false);
                        openAuthModal('provider');
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-amber-50 hover:text-amber-700 flex items-center gap-2 cursor-pointer font-bold"
                    >
                      <Wrench className="w-3.5 h-3.5 text-amber-600" />
                      <span>Vendor / Tech Desk</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowPortalDropdown(false);
                        openAuthModal('customer');
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 cursor-pointer font-bold"
                    >
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      <span>Customer Portal Login</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Bar with Logo & Customer Navigation */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Official Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center shrink-0 cursor-pointer select-none"
          >
            <img
              src={ASSETS.logo}
              alt="KlickKar.com - No Fikar Just Click Kar"
              className="h-12 sm:h-14 w-auto object-contain"
            />
          </div>

          {/* Customer Interface Navigation:
              Home | About Us | Prefabrication | Fabrication | Automation | Security | Renovation | Construction | Maintenance | KlickKar Property | Contact us */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 overflow-x-auto no-scrollbar py-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-xs xl:text-sm font-semibold transition-all px-2 xl:px-2.5 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${
                  activeNav === item.id
                    ? 'text-blue-700 bg-blue-50 font-bold border-b-2 border-blue-600'
                    : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action: Instant Booking Button */}
          <div className="hidden md:flex items-center shrink-0 gap-2">
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book / Get Quote</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl space-y-2 max-h-[80vh] overflow-y-auto">
          {/* User Status in Mobile */}
          {currentUser ? (
            <div className="bg-slate-100 p-3 rounded-xl flex items-center justify-between mb-2">
              <div>
                <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                <div className="text-[10px] text-slate-500 uppercase">{currentUser.role} Account</div>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-rose-600 font-bold flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('customer');
                }}
                className="flex-1 bg-blue-50 text-blue-700 text-xs font-bold py-2 rounded-lg text-center"
              >
                Customer Login
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('admin');
                }}
                className="flex-1 bg-rose-50 text-rose-700 text-xs font-bold py-2 rounded-lg text-center"
              >
                Admin Login
              </button>
            </div>
          )}

          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Navigation Menu (Information & Booking):
          </div>

          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 text-xs font-semibold rounded-lg cursor-pointer flex items-center justify-between ${
                  activeNav === item.id
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                <span className="text-[10px] opacity-70">▸</span>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleTrackOrCustomerPortal();
              }}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 rounded-xl text-xs text-center cursor-pointer flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Track Orders & GST Invoices</span>
            </button>

            <button
              onClick={() => {
                setIsBookingModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs text-center shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Service / Request Quotation</span>
            </button>
          </div>

          <div className="pt-2 text-center text-[11px] text-slate-500">
            Helpline: <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="font-bold text-blue-600">{settings.phone}</a>
          </div>
        </div>
      )}
    </header>
  );
};
