import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { navItems } from "../navigation";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const location = useLocation();
  const isActivePath = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

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
              const isActive = isActivePath(item.path) || !!item.children?.some((c) => isActivePath(c.path));
              const underline = (
                <span
                  style={{ backgroundColor: "#F5C200" }}
                  className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                />
              );
              if (!item.children) {
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className="text-white font-semibold transition-all duration-200 hover:text-[#F5C200] relative group text-[11px] xl:text-[13px] text-center whitespace-nowrap"
                  >
                    {item.label}
                    {underline}
                  </Link>
                );
              }
              const open = openGroup === item.path;
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenGroup(item.path)}
                  onMouseLeave={() => setOpenGroup(null)}
                  onKeyDown={(e) => e.key === "Escape" && setOpenGroup(null)}
                >
                  <Link
                    to={item.path}
                    aria-haspopup="true"
                    aria-expanded={open}
                    onFocus={() => setOpenGroup(item.path)}
                    className="text-white font-semibold transition-all duration-200 hover:text-[#F5C200] relative group text-[11px] xl:text-[13px] text-center whitespace-nowrap inline-flex items-center gap-1"
                  >
                    {item.label}
                    <ChevronDown size={14} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                    {underline}
                  </Link>
                  {open && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3">
                      <div
                        role="menu"
                        className="w-80 rounded-xl bg-white p-2 shadow-2xl"
                        style={{ border: "1px solid rgba(26,46,108,0.12)" }}
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            role="menuitem"
                            onClick={() => setOpenGroup(null)}
                            onBlur={(e) => {
                              if (!e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) setOpenGroup(null);
                            }}
                            className="block rounded-lg px-4 py-3 transition-colors hover:bg-[#F1F5F9] focus:bg-[#F1F5F9] focus:outline-none"
                          >
                            <span className="block text-sm font-bold" style={{ color: "#1A2E6C" }}>{child.label}</span>
                            {child.description && (
                              <span className="mt-0.5 block text-xs leading-snug text-slate-500">{child.description}</span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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
              <div key={item.label}>
                <Link
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className="block text-white font-semibold py-3 px-4 rounded-lg hover:bg-white/10 transition-colors text-base"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-4 flex flex-col border-l border-white/20 pl-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        onClick={() => setMenuOpen(false)}
                        className="text-white/85 font-medium py-2 px-4 rounded-lg hover:bg-white/10 transition-colors text-sm"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
