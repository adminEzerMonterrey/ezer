import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Partners } from "./components/Partners";
import { EventCatalog } from "./components/EventCatalog";
import { HowItWorks } from "./components/HowItWorks";
import { CollaborationForm } from "./components/CollaborationForm";
import { Footer } from "./components/Footer";
import { Admin } from "./pages/Admin";

function Home() {
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
