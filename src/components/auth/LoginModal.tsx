import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  ShieldCheck,
  Building2,
  Wrench,
  User,
  KeyRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  X,
  Phone,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTargetRole,
    login,
    registerCustomer,
    setActiveNav,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'admin' | 'provider' | 'customer' | 'register'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Registration fields
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('+91 ');
  const [regCompany, setRegCompany] = useState('');
  const [regGstin, setRegGstin] = useState('');
  const [regAddress, setRegAddress] = useState('Noida, Uttar Pradesh');

  useEffect(() => {
    if (authModalTargetRole) {
      setActiveTab(authModalTargetRole);
    }
  }, [authModalTargetRole, isAuthModalOpen]);

  useEffect(() => {
    setErrorMessage('');
    setSuccessMessage('');
  }, [activeTab]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    const targetRole: UserRole = activeTab === 'admin' ? 'admin' : activeTab === 'provider' ? 'provider' : 'customer';
    const result = login(email, password, targetRole);

    if (result.success && result.user) {
      setSuccessMessage(`Welcome back, ${result.user.name}!`);
      setTimeout(() => {
        setIsAuthModalOpen(false);
        if (result.user?.role === 'admin') {
          setActiveNav('portal');
        } else if (result.user?.role === 'provider') {
          setActiveNav('portal');
        } else {
          setActiveNav('customer-portal');
        }
      }, 400);
    } else {
      setErrorMessage(result.message || 'Authentication failed. Please verify your credentials.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regName || !email || !password || !regPhone) {
      setErrorMessage('Please fill in all mandatory fields (Name, Phone, Email, Password).');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    const result = registerCustomer({
      name: regName,
      email,
      password,
      phone: regPhone,
      companyName: regCompany,
      gstin: regGstin,
      address: regAddress,
    });

    if (result.success) {
      setSuccessMessage('Customer account created successfully! Logging you in...');
      setTimeout(() => {
        setIsAuthModalOpen(false);
        setActiveNav('customer-portal');
      }, 500);
    } else {
      setErrorMessage(result.message || 'Registration failed.');
    }
  };

  const fillQuickCredentials = (role: 'admin' | 'provider' | 'customer') => {
    setActiveTab(role);
    setErrorMessage('');
    setSuccessMessage('');
    if (role === 'admin') {
      setEmail('admin@klickkar.com');
      setPassword('Admin@KlickKar2026');
    } else if (role === 'provider') {
      setEmail('rajesh.fab@klickkar.com');
      setPassword('Vendor@123');
    } else {
      setEmail('anil.gupta@sharmaenterprises.in');
      setPassword('Customer@123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header with security badge */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white p-6 relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2 text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
            <KeyRound className="w-4 h-4 text-sky-400" />
            <span>Secure Role-Based Authentication</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {activeTab === 'admin'
              ? 'Admin Control Center Login'
              : activeTab === 'provider'
              ? 'Vendor & Field Technician Login'
              : activeTab === 'register'
              ? 'New Customer Registration'
              : 'Customer Account Login'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {activeTab === 'admin'
              ? 'Full management authority over services, bookings, GST invoices, and settings.'
              : activeTab === 'provider'
              ? 'Access assigned work orders, update milestone progress, and track payouts.'
              : activeTab === 'register'
              ? 'Create an account to manage your bookings, quotations, and official GST tax invoices.'
              : 'Access your personal bookings, approve quotations, and download GST tax invoices.'}
          </p>
        </div>

        {/* Role Tabs */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('provider')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'provider'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Vendor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('customer')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'customer'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Customer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'register'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>
        </div>

        {/* Demo Credentials Quick-Select Pill Bar */}
        <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between text-[11px] gap-2">
          <span className="text-slate-500 font-semibold">Quick Demo Login:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => fillQuickCredentials('admin')}
              className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-md font-bold hover:bg-rose-100 cursor-pointer"
            >
              Demo Admin
            </button>
            <button
              type="button"
              onClick={() => fillQuickCredentials('provider')}
              className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md font-bold hover:bg-amber-100 cursor-pointer"
            >
              Demo Vendor
            </button>
            <button
              type="button"
              onClick={() => fillQuickCredentials('customer')}
              className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md font-bold hover:bg-blue-100 cursor-pointer"
            >
              Demo Customer
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {activeTab !== 'register' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={
                      activeTab === 'admin'
                        ? 'admin@klickkar.com'
                        : activeTab === 'provider'
                        ? 'rajesh.fab@klickkar.com'
                        : 'anil.gupta@sharmaenterprises.in'
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {activeTab === 'admin' ? 'Admin@KlickKar2026' : activeTab === 'provider' ? 'Vendor@123' : 'Customer@123'}
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter password"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {activeTab === 'admin' && (
                <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-3 text-[11px] text-rose-800 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                    <span>Strict Administrative Security</span>
                  </div>
                  <p>
                    Admin access authorizes service catalog editing, live pricing, customer data inspection, and financial ledger control.
                  </p>
                </div>
              )}

              <button
                type="submit"
                className={`w-full py-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : activeTab === 'provider'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <span>Log In to {activeTab === 'admin' ? 'Admin Center' : activeTab === 'provider' ? 'Vendor Desk' : 'Customer Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    required
                    placeholder="+91 98110 00000"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="ramesh@example.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password * (Min 6 characters)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create a secure password"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Company / Firm Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={regCompany}
                    onChange={(e) => setRegCompany(e.target.value)}
                    placeholder="For B2B GST billing"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    GSTIN (Optional)
                  </label>
                  <input
                    type="text"
                    value={regGstin}
                    onChange={(e) => setRegGstin(e.target.value)}
                    placeholder="e.g. 09AATCM1473H1Z0"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Project Site Address
                </label>
                <input
                  type="text"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder="e.g. Sector 62, Noida, Uttar Pradesh"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>Register & Access Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="mt-4 pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
            Need urgent assistance? Call our corporate helpline{' '}
            <a href="tel:+919654610640" className="text-blue-600 font-bold hover:underline">
              +91 96546 10640
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
