import { Link } from "react-router-dom";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: "🏢",
      title: "Asociación se registra",
      description: "1. Llenar datos en el formulario.\n2. Descargar el formato oficial.\n3. Subir el formato contestado.",
      color: "#E8401C",
    },
    {
      number: "02",
      icon: "🤝",
      title: "EZER se pondrá en contacto",
      description: "EZER te contactará vía mail o vía teléfono.",
      color: "#F5C200",
    },
    {
      number: "03",
      icon: "📅",
      title: "Se agenda el evento",
      description: "Se coordina fecha, logística, número de voluntarios y la cuota de recuperación para el evento de impacto social.",
      color: "#E8401C",
    },
    {
      number: "04",
      icon: "🌟",
      title: "Impacto medido",
      description: "Tras el evento, EZER entrega un reporte de impacto verificado por la ONG aliada.",
      color: "#F5C200",
    },
  ];

  return (
    <section
      id="registro"
      style={{
        backgroundColor: "#F8FAFC",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        borderTop: "1px solid #E5E7EB",
        borderBottom: "1px solid #E5E7EB",
      }}
      className="pt-8 pb-12 md:pt-10 md:pb-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2
            style={{ color: "#1A2E6C", fontWeight: 800, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", lineHeight: 1.2, marginTop: 8 }}
          >
            ¿Cómo funciona?
          </h2>
          <p style={{ color: "#6B7280", marginTop: 12, maxWidth: 480 }} className="mx-auto text-base">
            En cuatro pasos sencillos, tu asociación puede generar un impacto real en la comunidad.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 relative">
          <div
            className="hidden lg:block absolute top-14 left-0 right-0"
            style={{ height: 2, background: "linear-gradient(to right, #E8401C, #F5C200, #E8401C, #F5C200)", zIndex: 0, opacity: 0.3, margin: "0 12%" }}
          />

          {steps.map((step) => (
            <div key={step.number} className="relative z-10 flex flex-col items-center text-center">
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  backgroundColor: step.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                  boxShadow: `0 6px 20px ${step.color}40`,
                  flexShrink: 0,
                }}
              >
                <span style={{ color: "#FFFFFF", fontWeight: 800, fontSize: 18 }}>{step.number}</span>
              </div>

              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 12,
                  padding: "20px 18px",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  width: "100%",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>{step.icon}</div>
                <h3 style={{ color: "#1A2E6C", fontWeight: 700, fontSize: 16, marginBottom: 8, lineHeight: 1.3 }}>
                  {step.title}
                </h3>
                <p style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-line" }}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/contactanos"
            style={{ backgroundColor: "#1A2E6C", color: "#FFFFFF", borderRadius: 8 }}
            className="inline-flex items-center gap-2 px-8 py-3.5 font-bold text-sm hover:brightness-110 active:scale-95 transition-all duration-200 shadow-lg"
          >
            Comenzar ahora →
          </Link>
        </div>
      </div>
    </section>
  );
}
