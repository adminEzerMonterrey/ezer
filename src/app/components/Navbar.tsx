import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { navItems } from "../navigation";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav style={{ backgroundColor: "#1A2E6C", fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="sticky top-0 z-50 w-full shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[auto_1fr_auto] items-center h-20 md:h-24">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center" style={{ textDecoration: "none" }}>
              <img
                src="/logo-ezer-sin-fondo.png"
                alt="Logo oficial Asociación EZER ABP"
                style={{ height: 72, width: "auto", objectFit: "contain" }}
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center justify-center gap-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-white font-medium hover:opacity-80 transition-opacity relative group text-sm"
                >
                  {item.label}
                  <span
                    style={{ backgroundColor: "#F5C200" }}
                    className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                  />
                </Link>
              );
            })}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors justify-self-end"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          style={{ backgroundColor: "#162560", borderTop: "1px solid rgba(245,194,0,0.2)" }}
          className="md:hidden px-4 pb-4 pt-2"
        >
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className="text-white font-medium py-3 px-3 rounded-lg hover:bg-white/10 transition-colors text-sm"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
