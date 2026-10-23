import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/public/Hero';
import { ServicesSection } from './components/public/ServicesSection';
import { HowItWorks } from './components/public/HowItWorks';
import { WhyChooseUs } from './components/public/WhyChooseUs';
import { ContactSection } from './components/public/ContactSection';
import { AboutSection } from './components/public/AboutSection';
import { ServiceDetailView } from './components/public/ServiceDetailView';
import { CustomerPortal } from './components/customer/CustomerPortal';
import { ProviderPortal } from './components/provider/ProviderPortal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { WhatsAppWidget } from './components/common/WhatsAppWidget';
import { TelegramBotModal } from './components/common/TelegramBotModal';
import { AIChatbotWidget } from './components/common/AIChatbotWidget';
import { GSTInvoiceModal } from './components/invoicing/GSTInvoiceModal';
import { QuotationModal } from './components/invoicing/QuotationModal';
import { BookingModal } from './components/public/BookingModal';
import { LoginModal } from './components/auth/LoginModal';

const AppContent: React.FC = () => {
  const { activeNav, role } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-blue-600 selection:text-white">
      {/* Navigation: Strictly Home | About Us | Prefabrication | Fabrication | Automation | Security | Renovation | Construction | Maintenance | KlickKar Property | Contact us */}
      <Navbar />

      {/* Main Content routing based on activeNav */}
      <main className="flex-1">
        {activeNav === 'customer-portal' ? (
          <CustomerPortal />
        ) : activeNav === 'portal' ? (
          role === 'admin' ? (
            <AdminDashboard />
          ) : role === 'provider' ? (
            <ProviderPortal />
          ) : (
            <CustomerPortal />
          )
        ) : activeNav === 'about' ? (
          <>
            <AboutSection />
            <WhyChooseUs />
            <ContactSection />
          </>
        ) : activeNav === 'prefabrication' ? (
          <ServiceDetailView categoryKey="prefabrication" />
        ) : activeNav === 'fabrication' ? (
          <ServiceDetailView categoryKey="fabrication" />
        ) : activeNav === 'automation' ? (
          <ServiceDetailView categoryKey="automation" />
        ) : activeNav === 'security' ? (
          <ServiceDetailView categoryKey="security" />
        ) : activeNav === 'renovation' ? (
          <ServiceDetailView categoryKey="renovation" />
        ) : activeNav === 'construction' ? (
          <ServiceDetailView categoryKey="construction" />
        ) : activeNav === 'maintenance' ? (
          <ServiceDetailView categoryKey="maintenance" />
        ) : activeNav === 'klickkar-property' ? (
          <ServiceDetailView categoryKey="property" />
        ) : activeNav === 'contact' ? (
          <>
            <ContactSection />
            <WhyChooseUs />
          </>
        ) : (
          /* Default: Home View */
          <>
            <Hero />
            <ServicesSection />
            <HowItWorks />
            <WhyChooseUs />
            <AboutSection />
            <ContactSection />
          </>
        )}
      </main>

      {/* Corporate Statutory Footer */}
      <Footer />

      {/* Modals & Floating Widgets */}
      <WhatsAppWidget />
      <AIChatbotWidget />
      <TelegramBotModal />
      <GSTInvoiceModal />
      <QuotationModal />
      <BookingModal />
      <LoginModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
