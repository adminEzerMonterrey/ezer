import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { ImpactStats } from "./components/ImpactStats";
import { Partners } from "./components/Partners";
import { EventCatalog } from "./components/EventCatalog";
import { HowItWorks } from "./components/HowItWorks";
import { CollaborationForm } from "./components/CollaborationForm";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { Admin } from "./pages/Admin";
import { CompanyRegistration } from "./components/CompanyRegistration";

function ScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null;
}

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: "100vh", overflowX: "hidden" }}
      className="bg-white"
    >
      <ScrollToTop />
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

function HomePage() {
  return (
    <AppShell>
      <Hero />
      <ImpactStats />
      <Partners />
    </AppShell>
  );
}

function RegistrationPage() {
  return (
    <AppShell>
      <HowItWorks />
      <CollaborationForm />
    </AppShell>
  );
}

function CompanyPage() {
  return (
    <AppShell>
      <CompanyRegistration />
    </AppShell>
  );
}

function EventCatalogPage() {
  return (
    <AppShell>
      <EventCatalog />
    </AppShell>
  );
}

function ContactPage() {
  return (
    <AppShell>
      <ContactSection />
    </AppShell>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/registro" element={<RegistrationPage />} />
        <Route path="/empresas" element={<CompanyPage />} />
        <Route path="/catalogo-eventos" element={<EventCatalogPage />} />
        <Route path="/contactanos" element={<ContactPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
