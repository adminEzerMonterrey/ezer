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
              className="flex items-center"
              style={{ textDecoration: "none" }}
            >
              <img
                src="/LOGO EZER ABP.jpg"
                alt="Logo oficial Asociación EZER ABP"
                style={{ height: 52, width: "auto", objectFit: "contain" }}
              />
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


