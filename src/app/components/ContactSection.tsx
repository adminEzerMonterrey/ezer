"use client";

import { useState } from "react";
import { Clock3, Landmark, Mail, MapPin, Phone, Send } from "lucide-react";

export function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  return (
    <section id="contacto" className="pt-8 pb-12 md:pt-10 md:pb-16" style={{ backgroundColor: "#FFFFFF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 style={{ color: "#1A2E6C", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.2, marginTop: 8 }}>
            Contáctanos
          </h2>
          <p style={{ color: "#6B7280", marginTop: 16, maxWidth: 600, fontSize: "1.1rem" }} className="mx-auto">
            ¿Tienes alguna duda o quieres saber más sobre cómo podemos colaborar? Estamos listos para escucharte y resolver todas tus inquietudes.
          </p>
        </div>

        <div style={{ backgroundColor: "#FAFAFA", borderRadius: 16, padding: "40px 24px", border: "1px solid #E5E7EB", marginBottom: 48 }}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h3 style={{ color: "#1A2E6C", fontWeight: 800, fontSize: "clamp(1.5rem, 3vw, 2rem)", marginBottom: 12 }}>
                Envíanos un mensaje
              </h3>
              <p style={{ color: "#6B7280", fontSize: "1.1rem" }}>
                Llena el siguiente formulario y nos pondremos en contacto contigo lo más pronto posible.
              </p>
            </div>
            
            {status === 'success' ? (
              <div className="text-center py-8">
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>✨</div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1A2E6C', marginBottom: '8px' }}>¡Mensaje Enviado!</h3>
                <p style={{ color: '#4B5563', fontSize: '14px', marginBottom: '24px' }}>
                  Nos pondremos en contacto contigo pronto. ¡Gracias por comunicarte con Ezer!
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  style={{ backgroundColor: '#1A2E6C', color: 'white', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#162560'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1A2E6C'}
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={async (e) => { 
                e.preventDefault();
                setStatus('loading');
                const form = e.target as HTMLFormElement;
                const data = {
                  name: (form.elements.namedItem('name') as HTMLInputElement).value,
                  email: (form.elements.namedItem('email') as HTMLInputElement).value,
                  subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
                  message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
                };
                
                try {
                  await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                  });
                  setStatus('success');
                  form.reset();
                } catch (err) {
                  setStatus('error');
                }
              }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" style={{ display: "block", color: "#374151", fontWeight: 700, fontSize: 14, marginBottom: 8 }}>
                    Nombre completo <span style={{ color: "#E8401C" }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "1px solid #D1D5DB", outline: "none", fontSize: 15, transition: "border-color 0.2s" }}
                    placeholder="Tu nombre"
                    onFocus={(e) => e.target.style.borderColor = "#1A2E6C"}
                    onBlur={(e) => e.target.style.borderColor = "#D1D5DB"}
                  />
                </div>
                <div>
                  <label htmlFor="email" style={{ display: "block", color: "#374151", fontWeight: 700, fontSize: 14, marginBottom: 8 }}>
                    Correo electrónico <span style={{ color: "#E8401C" }}>*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "1px solid #D1D5DB", outline: "none", fontSize: 15, transition: "border-color 0.2s" }}
                    placeholder="tu@correo.com"
                    onFocus={(e) => e.target.style.borderColor = "#1A2E6C"}
                    onBlur={(e) => e.target.style.borderColor = "#D1D5DB"}
                  />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="subject" style={{ display: "block", color: "#374151", fontWeight: 700, fontSize: 14, marginBottom: 8 }}>
                  Asunto <span style={{ color: "#E8401C" }}>*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "1px solid #D1D5DB", outline: "none", fontSize: 15, transition: "border-color 0.2s" }}
                  placeholder="¿En qué podemos ayudarte?"
                  onFocus={(e) => e.target.style.borderColor = "#1A2E6C"}
                  onBlur={(e) => e.target.style.borderColor = "#D1D5DB"}
                />
              </div>
              <div className="mb-8">
                <label htmlFor="message" style={{ display: "block", color: "#374151", fontWeight: 700, fontSize: 14, marginBottom: 8 }}>
                  Mensaje <span style={{ color: "#E8401C" }}>*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "1px solid #D1D5DB", outline: "none", fontSize: 15, resize: "vertical", transition: "border-color 0.2s" }}
                  placeholder="Escribe tu mensaje aquí..."
                  onFocus={(e) => e.target.style.borderColor = "#1A2E6C"}
                  onBlur={(e) => e.target.style.borderColor = "#D1D5DB"}
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  style={{
                    backgroundColor: "#1A2E6C",
                    color: "#FFFFFF",
                    fontWeight: 800,
                    padding: "16px 36px",
                    borderRadius: 12,
                    fontSize: 16,
                    border: "none",
                    cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                    opacity: status === 'loading' ? 0.7 : 1,
                    transition: "all 0.2s",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 4px 6px -1px rgba(26, 46, 108, 0.2)"
                  }}
                  onMouseOver={(e) => {
                    if (status !== 'loading') {
                      e.currentTarget.style.backgroundColor = "#2a4393";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(26, 46, 108, 0.3)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (status !== 'loading') {
                      e.currentTarget.style.backgroundColor = "#1A2E6C";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(26, 46, 108, 0.2)";
                    }
                  }}
                >
                  <Send size={20} />
                  {status === 'loading' ? 'Enviando...' : 'Enviar Mensaje'}
                </button>
              </div>
            </form>
            )}
          </div>
        </div>

        <div className="text-center mb-8">
          <h3 style={{ color: "#1A2E6C", fontWeight: 800, fontSize: "clamp(1.7rem, 4vw, 2.4rem)", lineHeight: 1.2 }}>
            Información
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          <div style={{ backgroundColor: "#FAFAFA", borderRadius: 16, padding: "40px 24px", border: "1px solid #E5E7EB", textAlign: "center", transition: "transform 0.2s" }} className="hover:-translate-y-2">
            <div style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <Clock3 size={36} style={{ color: "#1A2E6C" }} />
            </div>
            <h3 style={{ color: "#1A2E6C", fontWeight: 700, fontSize: 22, marginBottom: 12 }}>Horario</h3>
            <p style={{ color: "#6B7280", fontSize: 15, marginBottom: 16 }}>Nuestro equipo está disponible para atenderte dentro de este horario.</p>
            <p style={{ color: "#1A2E6C", fontWeight: 800, fontSize: 20, lineHeight: 1.4, margin: 0 }}>
              9 a.m. a 1 p.m.<br />
              Lunes a viernes
            </p>
          </div>

          <div style={{ backgroundColor: "#FAFAFA", borderRadius: 16, padding: "40px 24px", border: "1px solid #E5E7EB", textAlign: "center", transition: "transform 0.2s" }} className="hover:-translate-y-2">
            <div style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <Phone size={36} style={{ color: "#E8401C" }} />
            </div>
            <h3 style={{ color: "#1A2E6C", fontWeight: 700, fontSize: 22, marginBottom: 12 }}>Teléfono</h3>
            <p style={{ color: "#6B7280", fontSize: 15, marginBottom: 16 }}>Llámanos directamente para recibir atención personalizada de nuestro equipo.</p>
            <a href="tel:+528112572544" style={{ color: "#E8401C", fontWeight: 800, fontSize: 24, textDecoration: "none" }} className="hover:underline">
              +52 81 1257 2544
            </a>
          </div>

          <div style={{ backgroundColor: "#FAFAFA", borderRadius: 16, padding: "40px 24px", border: "1px solid #E5E7EB", textAlign: "center", transition: "transform 0.2s" }} className="hover:-translate-y-2">
            <div style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <Mail size={36} style={{ color: "#1A2E6C" }} />
            </div>
            <h3 style={{ color: "#1A2E6C", fontWeight: 700, fontSize: 22, marginBottom: 12 }}>Correo Electrónico</h3>
            <p style={{ color: "#6B7280", fontSize: 15, marginBottom: 16 }}>Escríbenos y te responderemos a la brevedad con toda la información necesaria.</p>
            <a href="mailto:voluntariadocorporativo@ezer.org.mx" style={{ color: "#1A2E6C", fontWeight: 800, fontSize: 18, lineHeight: 1.35, textDecoration: "none", overflowWrap: "anywhere" }} className="hover:underline">
              voluntariadocorporativo@ezer.org.mx
            </a>
          </div>

          <div style={{ backgroundColor: "#FAFAFA", borderRadius: 16, padding: "40px 24px", border: "1px solid #E5E7EB", textAlign: "center", transition: "transform 0.2s" }} className="hover:-translate-y-2">
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

        {/* The form was moved to the top of the component */}

        <div
          style={{
            marginTop: 32,
            backgroundColor: "#FAFAFA",
            borderRadius: 16,
            padding: "32px 24px",
            border: "1px solid #E5E7EB",
            transition: "transform 0.2s",
          }}
          className="hover:-translate-y-1"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            <div className="lg:max-w-sm">
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  backgroundColor: "#EEF2FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 24,
                }}
              >
                <Landmark size={36} style={{ color: "#1A2E6C" }} />
              </div>
              <h3 style={{ color: "#1A2E6C", fontWeight: 700, fontSize: 26, marginBottom: 12 }}>
                ¿Te gustaría apoyar con un donativo?
              </h3>
              <p style={{ color: "#6B7280", fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                Si deseas sumarte a nuestra labor, puedes realizar una transferencia bancaria a la siguiente cuenta de EZER.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
              <div style={{ backgroundColor: "#FFFFFF", borderRadius: 12, border: "1px solid #E5E7EB", padding: "18px 20px" }}>
                <p style={{ color: "#6B7280", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
                  Titular
                </p>
                <p style={{ color: "#1A2E6C", fontSize: 22, fontWeight: 800, lineHeight: 1.25, margin: 0 }}>
                  EZER ABP
                </p>
              </div>

              <div style={{ backgroundColor: "#FFFFFF", borderRadius: 12, border: "1px solid #E5E7EB", padding: "18px 20px" }}>
                <p style={{ color: "#6B7280", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
                  Cuenta
                </p>
                <p style={{ color: "#1A2E6C", fontSize: 22, fontWeight: 800, lineHeight: 1.25, margin: 0 }}>
                  0198974066
                </p>
              </div>

              <div style={{ backgroundColor: "#FFFFFF", borderRadius: 12, border: "1px solid #E5E7EB", padding: "18px 20px" }}>
                <p style={{ color: "#6B7280", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
                  CLABE
                </p>
                <p style={{ color: "#1A2E6C", fontSize: 20, fontWeight: 800, lineHeight: 1.35, margin: 0, wordBreak: "break-word" }}>
                  072 580 00198974066 6
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
