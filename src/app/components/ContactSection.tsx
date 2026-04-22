import { Phone, Mail, MapPin } from "lucide-react";

export function ContactSection() {
  return (
    <section id="contacto" className="py-20" style={{ backgroundColor: "#FFFFFF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span style={{ color: "#E8401C", fontWeight: 700, fontSize: 13, letterSpacing: "0.12em" }} className="uppercase">
            ✦ Hablemos
          </span>
          <h2 style={{ color: "#1A2E6C", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.2, marginTop: 8 }}>
            Contáctanos
          </h2>
          <p style={{ color: "#6B7280", marginTop: 16, maxWidth: 600, fontSize: "1.1rem" }} className="mx-auto">
            ¿Tienes alguna duda o quieres saber más sobre cómo podemos colaborar? Estamos listos para escucharte y resolver todas tus inquietudes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Phone Card */}
          <div style={{ backgroundColor: "#FAFAFA", borderRadius: 16, padding: "40px 24px", border: "1px solid #E5E7EB", textAlign: "center", transition: "transform 0.2s" }} className="hover:-translate-y-2">
            <div style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <Phone size={36} style={{ color: "#E8401C" }} />
            </div>
            <h3 style={{ color: "#1A2E6C", fontWeight: 700, fontSize: 22, marginBottom: 12 }}>Teléfono</h3>
            <p style={{ color: "#6B7280", fontSize: 15, marginBottom: 16 }}>Llámanos directamente para recibir atención personalizada de nuestro equipo.</p>
            <a href="tel:+528181512400" style={{ color: "#E8401C", fontWeight: 800, fontSize: 24, textDecoration: "none" }} className="hover:underline">
              +52 (81) 8151 2400
            </a>
          </div>

          {/* Email Card */}
          <div style={{ backgroundColor: "#FAFAFA", borderRadius: 16, padding: "40px 24px", border: "1px solid #E5E7EB", textAlign: "center", transition: "transform 0.2s" }} className="hover:-translate-y-2">
            <div style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <Mail size={36} style={{ color: "#1A2E6C" }} />
            </div>
            <h3 style={{ color: "#1A2E6C", fontWeight: 700, fontSize: 22, marginBottom: 12 }}>Correo Electrónico</h3>
            <p style={{ color: "#6B7280", fontSize: 15, marginBottom: 16 }}>Escríbenos y te responderemos a la brevedad con toda la información necesaria.</p>
            <a href="mailto:info@ezer.org.mx" style={{ color: "#1A2E6C", fontWeight: 800, fontSize: 24, textDecoration: "none" }} className="hover:underline">
              info@ezer.org.mx
            </a>
          </div>

          {/* Location Card */}
          <div style={{ backgroundColor: "#FAFAFA", borderRadius: 16, padding: "40px 24px", border: "1px solid #E5E7EB", textAlign: "center", transition: "transform 0.2s" }} className="hover:-translate-y-2 lg:col-span-1 md:col-span-2">
            <div style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: "#FEFCE8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <MapPin size={36} style={{ color: "#F5C200" }} />
            </div>
            <h3 style={{ color: "#1A2E6C", fontWeight: 700, fontSize: 22, marginBottom: 12 }}>Ubicación</h3>
            <p style={{ color: "#6B7280", fontSize: 15, marginBottom: 16 }}>Visítanos en nuestras oficinas centrales y conoce más de nuestro trabajo.</p>
            <p style={{ color: "#1A2E6C", fontWeight: 800, fontSize: 18, lineHeight: 1.4 }}>
              Francisco Zarco 911, Piso 3<br />
              Centro, 64000 Monterrey, N.L.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
