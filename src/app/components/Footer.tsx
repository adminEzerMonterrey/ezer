import { Mail, MapPin, Facebook, Instagram, Globe, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { navItems } from "../navigation";

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer
      style={{ backgroundColor: "#1A2E6C", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="w-full"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          <div>
            <div className="mb-4">
              <img
                src="/logo-ezer-sin-fondo.png"
                alt="Logo oficial Asociación EZER ABP"
                style={{ height: 80, width: "auto", objectFit: "contain" }}
              />
            </div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>
              "Que nadie se prive de lo que es destino y vocación de todos, Servir."
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: <Facebook size={16} />, href: "https://www.facebook.com/ezerabp/", label: "Facebook" },
                { icon: <Instagram size={16} />, href: "https://www.instagram.com/ezerabp/", label: "Instagram" },
                { icon: <Globe size={16} />, href: "https://www.ezer.org.mx/", label: "Sitio web" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    backgroundColor: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#F5C200";
                    e.currentTarget.style.color = "#1A2E6C";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.color = "#FFFFFF";
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ color: "#F5C200", fontWeight: 700, fontSize: 13, letterSpacing: "0.1em", marginBottom: 16 }} className="uppercase">
              Navegación
            </h4>
            <ul className="flex flex-col gap-3">
              {[...navItems, { label: "Acceso Administrador", path: "/admin" }].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#F5C200")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
                    className="flex items-center gap-2 group"
                  >
                    <span style={{ color: "#E8401C", fontSize: 10 }}>▶</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ color: "#F5C200", fontWeight: 700, fontSize: 13, letterSpacing: "0.1em", marginBottom: 16 }} className="uppercase">
              Contacto
            </h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <div
                  style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "rgba(245,194,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                >
                  <Mail size={14} style={{ color: "#F5C200" }} />
                </div>
                <div>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginBottom: 2 }}>Email</p>
                  <a
                    href="mailto:voluntariadocorporativo@ezer.org.mx"
                    style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, overflowWrap: "anywhere", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#F5C200")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
                  >
                    voluntariadocorporativo@ezer.org.mx
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div
                  style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "rgba(245,194,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                >
                  <Globe size={14} style={{ color: "#F5C200" }} />
                </div>
                <div>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginBottom: 2 }}>Sitio web</p>
                  <a
                    href="https://www.ezer.org.mx/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#F5C200")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
                  >
                    www.ezer.org.mx
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div
                  style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "rgba(245,194,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                >
                  <MapPin size={14} style={{ color: "#F5C200" }} />
                </div>
                <div>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginBottom: 2 }}>Ubicación</p>
                  <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>
                    Francisco Zarco 911, Piso 3<br />
                    Centro, 64000 Monterrey, N.L.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 40, paddingTop: 24 }} className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, textAlign: "center" }}>
            © 2026 EZER - Enabling Excellence. Todos los derechos reservados.
          </p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, textAlign: "center" }} className="flex items-center gap-1.5">
            Hecho con <Heart size={12} style={{ color: "#E8401C" }} fill="#E8401C" /> para comunidades que importan
          </p>
          <div className="flex items-center gap-4">
            {["Privacidad", "Términos", "Cookies"].map((link) => (
              <button
                key={link}
                type="button"
                onClick={() => navigate("/contactanos")}
                style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, transition: "color 0.2s", background: "transparent", border: "none", cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#F5C200")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
