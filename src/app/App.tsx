import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { ImpactStats } from "./components/ImpactStats";
import { WhyEzer } from "./components/WhyEzer";
import { VideoSection } from "./components/VideoSection";
import { Footer } from "./components/Footer";

// Rutas pesadas / secundarias se cargan bajo demanda (code-splitting).
const EventCatalog = lazy(() => import("./components/EventCatalog").then((m) => ({ default: m.EventCatalog })));
const HowItWorks = lazy(() => import("./components/HowItWorks").then((m) => ({ default: m.HowItWorks })));
const CollaborationForm = lazy(() => import("./components/CollaborationForm").then((m) => ({ default: m.CollaborationForm })));
const ContactSection = lazy(() => import("./components/ContactSection").then((m) => ({ default: m.ContactSection })));
const CompanyRegistration = lazy(() => import("./components/CompanyRegistration").then((m) => ({ default: m.CompanyRegistration })));
const Admin = lazy(() => import("./pages/Admin").then((m) => ({ default: m.Admin })));
const AliadosPage = lazy(() => import("./pages/Aliados").then((m) => ({ default: m.AliadosPage })));
const EmpresasAliadasPage = lazy(() => import("./pages/EmpresasAliadas").then((m) => ({ default: m.EmpresasAliadasPage })));
const CursosSensibilizacionPage = lazy(() => import("./pages/CursosSensibilizacion").then((m) => ({ default: m.CursosSensibilizacionPage })));
const UniversidadesPage = lazy(() => import("./pages/Universidades").then((m) => ({ default: m.UniversidadesPage })));
const MontemorelosPage = lazy(() => import("./pages/universidades/Montemorelos").then((m) => ({ default: m.MontemorelosPage })));

function ScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null;
}

function RouteFallback() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div
        aria-label="Cargando"
        style={{
          width: 44,
          height: 44,
          border: "4px solid #E5E7EB",
          borderTopColor: "#1A2E6C",
          borderRadius: "50%",
          animation: "ezer-spin 0.7s linear infinite",
        }}
      />
      <style>{`@keyframes ezer-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: "100vh", overflowX: "hidden" }}
      className="bg-white"
    >
      <ScrollToTop />
      <Navbar />
      <Suspense fallback={<RouteFallback />}>{children}</Suspense>
      <Footer />
    </div>
  );
}

function HomePage() {
  return (
    <AppShell>
      <Hero />
      <VideoSection />
      <ImpactStats />
      <WhyEzer />
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

function AliadosPageWrapper() {
  return (
    <AppShell>
      <AliadosPage />
    </AppShell>
  );
}

function EmpresasAliadasPageWrapper() {
  return (
    <AppShell>
      <EmpresasAliadasPage />
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
        <Route path="/cursos" element={
          <AppShell>
            <CursosSensibilizacionPage />
          </AppShell>
        } />
        <Route path="/aliados" element={<AliadosPageWrapper />} />
        <Route path="/empresas-aliadas" element={<EmpresasAliadasPageWrapper />} />
        <Route path="/universidades" element={
          <AppShell>
            <UniversidadesPage />
          </AppShell>
        } />
        <Route path="/universidades/montemorelos" element={
          <AppShell>
            <MontemorelosPage />
          </AppShell>
        } />
        <Route path="/admin" element={
          <Suspense fallback={<RouteFallback />}>
            <Admin />
          </Suspense>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
