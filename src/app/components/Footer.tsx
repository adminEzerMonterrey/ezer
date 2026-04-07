import { Mail, Phone, MapPin, Facebook, Instagram, Globe, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer
      style={{ backgroundColor: "#1A2E6C", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="w-full"
    >
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  border: "2px solid #F5C200",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(245,194,0,0.08)",
                }}
              >
                <EzerIcon />
              </div>
              <div>
                <div style={{ color: "#FFFFFF", fontWeight: 800, fontSize: 20, letterSpacing: "0.1em" }}>EZER</div>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>
              "Que nadie se prive de lo que es destino y vocación de todos, Servir."
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {[
                { icon: <Facebook size={16} />, href: "https://www.facebook.com/ezerabp/", label: "Facebook" },
                { icon: <Instagram size={16} />, href: "https://www.instagram.com/ezerabp/", label: "Instagram" },
                { icon: <Globe size={16} />, href: "https://www.ezer.org.mx/", label: "Sitio web" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
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
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#F5C200";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#1A2E6C";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.1)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#FFFFFF";
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: "#F5C200", fontWeight: 700, fontSize: 13, letterSpacing: "0.1em", marginBottom: 16 }} className="uppercase">
              Navegación
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Inicio", href: "#inicio" },
                { label: "Eventos disponibles", href: "#eventos" },
                { label: "¿Cómo funciona?", href: "#como-funciona" },
                { label: "Contáctanos", href: "#contacto" },
                { label: "Registrar colaboración", href: "#contacto" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, transition: "color 0.2s" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#F5C200")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.65)")}
                    className="flex items-center gap-2 group"
                  >
                    <span style={{ color: "#E8401C", fontSize: 10 }}>▶</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ color: "#F5C200", fontWeight: 700, fontSize: 13, letterSpacing: "0.1em", marginBottom: 16 }} className="uppercase">
              Categorías
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Medio Ambiente", emoji: "🌿" },
                { label: "Educación", emoji: "📚" },
                { label: "Alimentación", emoji: "🍎" },
                { label: "Salud", emoji: "💊" },
                { label: "Desarrollo comunitario", emoji: "🏘️" },
              ].map((cat) => (
                <li key={cat.label}>
                  <a
                    href="#eventos"
                    style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, transition: "color 0.2s", display: "flex", alignItems: "center", gap: 8 }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#F5C200")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.65)")}
                  >
                    <span style={{ fontSize: 15 }}>{cat.emoji}</span>
                    {cat.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
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
                  <a href="mailto:info@ezer.org.mx" style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>
                    info@ezer.org.mx
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
                  <a href="https://www.ezer.org.mx/" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>
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

        {/* Divider */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 40, paddingTop: 24 }} className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, textAlign: "center" }}>
            © 2026 EZER – Enabling Excellence. Todos los derechos reservados.
          </p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, textAlign: "center" }} className="flex items-center gap-1.5">
            Hecho con <Heart size={12} style={{ color: "#E8401C" }} fill="#E8401C" /> para comunidades que importan
          </p>
          <div className="flex items-center gap-4">
            {["Privacidad", "Términos", "Cookies"].map((link) => (
              <a
                key={link}
                href="#"
                style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, transition: "color 0.2s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#F5C200")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.4)")}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function EzerIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="7.5" r="3.5" fill="#E8401C" />
      <path d="M7 21 Q7 15 13 14 Q19 15 19 21" fill="#E8401C" />
      <path d="M5 6.5 L5.5 8.2 L7.2 8.2 L5.8 9.3 L6.3 11 L5 10 L3.7 11 L4.2 9.3 L2.8 8.2 L4.5 8.2 Z" fill="#F5C200" />
      <path d="M20 4 L20.4 5.4 L21.8 5.4 L20.7 6.3 L21.1 7.7 L20 6.9 L18.9 7.7 L19.3 6.3 L18.2 5.4 L19.6 5.4 Z" fill="#F5C200" />
    </svg>
  );
}