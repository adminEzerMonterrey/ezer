import { useState, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
      e.preventDefault();
      if (location.pathname !== "/") {
        // Navigate to home first, then scroll to the section
        navigate("/" + hash);
      } else {
        // Already on home, just scroll to the section
        const target = document.querySelector(hash);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        } else {
          window.location.hash = hash;
        }
      }
    },
    [location.pathname, navigate]
  );

  return (
    <nav style={{ backgroundColor: "#1A2E6C", fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="sticky top-0 z-50 w-full shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <a
              href="/"
              onClick={(e) => handleNavClick(e, "#inicio")}
              className="flex items-center gap-3"
              style={{ textDecoration: "none" }}
            >
              <div
                className="flex items-center justify-center rounded-xl"
                style={{ width: 44, height: 44, backgroundColor: "#1A2E6C", border: "2px solid #F5C200" }}
              >
                <EzerLogoIcon />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-extrabold tracking-widest text-xl">EZER</span>
                <span style={{ color: "#F5C200", fontSize: 10 }} className="tracking-wider font-medium uppercase">
                  Enabling Excellence
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#inicio"
              onClick={(e) => handleNavClick(e, "#inicio")}
              className="text-white font-medium hover:opacity-80 transition-opacity relative group text-sm"
            >
              Inicio
              <span
                style={{ backgroundColor: "#F5C200" }}
                className="absolute -bottom-1 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300"
              />
            </a>
            <a
              href="#registro"
              onClick={(e) => handleNavClick(e, "#registro")}
              className="text-white font-medium hover:opacity-80 transition-opacity relative group text-sm"
            >
              Registro
              <span
                style={{ backgroundColor: "#F5C200" }}
                className="absolute -bottom-1 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300"
              />
            </a>
            <a
              href="#eventos"
              onClick={(e) => handleNavClick(e, "#eventos")}
              className="text-white font-medium hover:opacity-80 transition-opacity relative group text-sm"
            >
              Catálogo de Eventos
              <span
                style={{ backgroundColor: "#F5C200" }}
                className="absolute -bottom-1 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300"
              />
            </a>
            <a
              href="#contacto"
              onClick={(e) => handleNavClick(e, "#contacto")}
              className="text-white font-medium hover:opacity-80 transition-opacity relative group text-sm"
            >
              Contáctanos
              <span
                style={{ backgroundColor: "#F5C200" }}
                className="absolute -bottom-1 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300"
              />
            </a>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="#registro"
              onClick={(e) => handleNavClick(e, "#registro")}
              style={{ backgroundColor: "#F5C200", color: "#1A2E6C", borderRadius: 8 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 font-bold text-sm hover:brightness-105 active:scale-95 transition-all duration-200 shadow-md"
            >
              Registrar colaboración
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{ backgroundColor: "#162560", borderTop: "1px solid rgba(245,194,0,0.2)" }}
          className="md:hidden px-4 pb-4 pt-2"
        >
          <div className="flex flex-col gap-1">
            <a
              href="#inicio"
              onClick={(e) => { handleNavClick(e, "#inicio"); setMenuOpen(false); }}
              className="text-white font-medium py-3 px-3 rounded-lg hover:bg-white/10 transition-colors text-sm"
            >
              Inicio
            </a>
            <a
              href="#registro"
              onClick={(e) => { handleNavClick(e, "#registro"); setMenuOpen(false); }}
              className="text-white font-medium py-3 px-3 rounded-lg hover:bg-white/10 transition-colors text-sm"
            >
              Registro
            </a>
            <a
              href="#eventos"
              onClick={(e) => { handleNavClick(e, "#eventos"); setMenuOpen(false); }}
              className="text-white font-medium py-3 px-3 rounded-lg hover:bg-white/10 transition-colors text-sm"
            >
              Catálogo de Eventos
            </a>
            <a
              href="#contacto"
              onClick={(e) => { handleNavClick(e, "#contacto"); setMenuOpen(false); }}
              className="text-white font-medium py-3 px-3 rounded-lg hover:bg-white/10 transition-colors text-sm"
            >
              Contáctanos
            </a>
            <a
              href="#registro"
              onClick={(e) => { handleNavClick(e, "#registro"); setMenuOpen(false); }}
              style={{ backgroundColor: "#F5C200", color: "#1A2E6C", borderRadius: 8 }}
              className="mt-2 text-center font-bold py-3 px-4 text-sm"
            >
              Registrar colaboración
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

function EzerLogoIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Human figure */}
      <circle cx="14" cy="8" r="3.5" fill="#E8401C" />
      <path d="M8 22 Q8 16 14 15 Q20 16 20 22" fill="#E8401C" />
      {/* Stars */}
      <path d="M6 7 L6.5 8.5 L8 8.5 L6.8 9.5 L7.3 11 L6 10 L4.7 11 L5.2 9.5 L4 8.5 L5.5 8.5 Z" fill="#F5C200" />
      <path d="M21 5 L21.4 6.2 L22.6 6.2 L21.6 7 L22 8.2 L21 7.4 L20 8.2 L20.4 7 L19.4 6.2 L20.6 6.2 Z" fill="#F5C200" />
      <path d="M22 14 L22.3 15 L23.3 15 L22.5 15.6 L22.8 16.6 L22 16 L21.2 16.6 L21.5 15.6 L20.7 15 L21.7 15 Z" fill="#F5C200" />
    </svg>
  );
}
