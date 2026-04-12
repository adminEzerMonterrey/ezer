import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Partners } from "./components/Partners";
import { EventCatalog } from "./components/EventCatalog";
import { HowItWorks } from "./components/HowItWorks";
import { CollaborationForm } from "./components/CollaborationForm";
import { Footer } from "./components/Footer";
import { Admin } from "./pages/Admin";

function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      // Small delay to let the DOM render before scrolling
      const timer = setTimeout(() => {
        const target = document.querySelector(location.hash);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // No hash — scroll to top
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: "100vh", overflowX: "hidden" }}
    >
      <Navbar />
      <Hero />
      <Partners />
      <EventCatalog />
      <HowItWorks />
      <CollaborationForm />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
