import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { navItems } from "../navigation";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav style={{ backgroundColor: "#1A2E6C", fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="sticky top-0 z-50 w-full shadow-lg">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 md:h-28 relative">
          <div className="flex items-center gap-3 z-10">
            <Link to="/" className="flex items-center transition-transform duration-200 hover:scale-105 active:scale-95" style={{ textDecoration: "none" }}>
              <img
                src="/logo-ezer-sin-fondo.png"
                alt="Logo oficial Asociación EZER ABP"
                style={{ height: 80, width: "auto", objectFit: "contain" }}
                className="md:h-24"
              />
            </Link>
          </div>

          <div className="hidden lg:flex flex-1 items-center justify-center gap-3 xl:gap-5 px-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-white font-semibold transition-all duration-200 hover:text-[#F5C200] relative group text-[11px] xl:text-[13px] text-center whitespace-nowrap"
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
            className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors z-10"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          style={{ backgroundColor: "#162560", borderTop: "1px solid rgba(245,194,0,0.2)" }}
          className="lg:hidden px-4 pb-6 pt-3"
        >
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className="text-white font-semibold py-3 px-4 rounded-lg hover:bg-white/10 transition-colors text-base"
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
