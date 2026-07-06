import { CheckCircle2 } from "lucide-react";

const FEATURES = [
  {
    title: "47 proyectos listos",
    description: "Eventos con ficha técnica, logística y materiales resueltos.",
  },
  {
    title: "Alianzas ya establecidas",
    description: "EZER ya tiene la vinculación con las asociaciones de beneficencia.",
  },
  {
    title: "Sensibilización incluida",
    description: "Preparamos a los voluntarios para que la experiencia deje huella.",
  },
  {
    title: "Coordinación integral",
    description: "EZER opera todo el evento: tú solo llegas a servir.",
  },
  {
    title: "Sin costo para la asociación",
    description: "La beneficencia recibe el evento totalmente gratis.",
  },
  {
    title: "Triple impacto",
    description: "Empresas, talento y productos se suman en un mismo evento.",
  },
];

export function WhyEzer() {
  return (
    <section
      style={{
        background: "linear-gradient(135deg, #EEF2FF 0%, #F8FAFC 50%, #FFF7ED 100%)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        borderTop: "1px solid #E5E7EB",
      }}
      className="py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            style={{
              color: "#1A2E6C",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              lineHeight: 1.2,
            }}
          >
            ¿Por qué con <span style={{ color: "#E8401C" }}>EZER</span>?
          </h2>
          <p style={{ color: "#6B7280", maxWidth: 560, margin: "12px auto 0", fontSize: 16, lineHeight: 1.7 }}>
            Todo lo que necesitas para vivir el voluntariado corporativo ya está resuelto.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: 16,
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                transition: "transform 0.25s, box-shadow 0.25s",
              }}
              className="p-6 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-start gap-4">
                <CheckCircle2
                  size={26}
                  style={{ color: "#1A2E6C", flexShrink: 0, marginTop: 2 }}
                />
                <div>
                  <h3
                    style={{
                      color: "#1A2E6C",
                      fontWeight: 800,
                      fontSize: 16,
                      marginBottom: 6,
                      lineHeight: 1.3,
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.65 }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
