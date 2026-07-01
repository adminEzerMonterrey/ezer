import { useState } from "react";
import { X, BookOpen } from "lucide-react";

interface Curso {
  id: number;
  area: string;
  descripcion: string;
  flyerUrl: string;
  icono: string;
  color: string;
  colorLight: string;
}

const CURSOS: Curso[] = [
  {
    id: 1,
    area: "Infancia Vulnerable",
    descripcion: "Conoce los riesgos que enfrentan niñas y niños en situación de vulnerabilidad y aprende cómo ser un agente de cambio en su entorno. Un curso que transforma la mirada y activa la acción.",
    flyerUrl: "https://drive.google.com/file/d/1cp6HlrKl_hl5sRDglyoi4lrgvKzpnH7j/preview",
    icono: "🧒",
    color: "#E8401C",
    colorLight: "#FEF2EE",
  },
  {
    id: 2,
    area: "Dignidad en la Vejez",
    descripcion: "Reflexiona sobre el envejecimiento digno y aprende a acompañar a adultos mayores desde la empatía y el respeto. Porque cada etapa de la vida merece ser vivida con plenitud.",
    flyerUrl: "https://drive.google.com/file/d/1lkY59RtgUO25gfDzLE31nO2SFa5x4ZaI/preview",
    icono: "👴",
    color: "#7C3AED",
    colorLight: "#F5F3FF",
  },
  {
    id: 3,
    area: "Mujeres y Empoderamiento",
    descripcion: "Explora la importancia de la equidad de género y el empoderamiento femenino como base del desarrollo social. Un espacio para reconocer y eliminar barreras que limitan el potencial de las mujeres.",
    flyerUrl: "https://drive.google.com/file/d/13ePrkegUy7luXj65VdGRdsN9IAHkdYkR/preview",
    icono: "👩",
    color: "#DB2777",
    colorLight: "#FDF2F8",
  },
  {
    id: 4,
    area: "Inclusión y Discapacidad",
    descripcion: "Descubre cómo construir entornos verdaderamente inclusivos para personas con discapacidad, eliminando barreras físicas, sociales y actitudinales desde la comunidad.",
    flyerUrl: "https://drive.google.com/file/d/1KlShnCQFEQ89E7OfHfrYF4bdqsEUZ-Bc/preview",
    icono: "♿",
    color: "#0D9488",
    colorLight: "#F0FDFA",
  },
  {
    id: 5,
    area: "Conciencia Ambiental",
    descripcion: "Sensibilízate sobre el impacto ambiental de nuestras acciones cotidianas y aprende a promover hábitos sostenibles en tu empresa y comunidad para preservar el planeta.",
    flyerUrl: "https://drive.google.com/file/d/1yoXKgbYTg8miDjzVtNmYeNAXx9hc822/preview",
    icono: "🌿",
    color: "#16A34A",
    colorLight: "#F0FDF4",
  },
  {
    id: 6,
    area: "Hambre y Solidaridad",
    descripcion: "Comprende la realidad de la inseguridad alimentaria en nuestra región y cómo la solidaridad organizada puede convertirse en una respuesta efectiva contra el hambre.",
    flyerUrl: "https://drive.google.com/file/d/1ZdLzciJI7c0vEHzMvoROj6uuAqrgccoN/preview",
    icono: "🍽️",
    color: "#D97706",
    colorLight: "#FFFBEB",
  },
  {
    id: 7,
    area: "Migración y Hospitalidad",
    descripcion: "Conoce la situación de las personas migrantes y refugiadas, y aprende cómo desde la hospitalidad podemos ser agentes de integración, apoyo y dignidad humana.",
    flyerUrl: "https://drive.google.com/file/d/1dG9qGrKGKI56whSPLNRvHG8ZddywbDwg/preview",
    icono: "🌍",
    color: "#2563EB",
    colorLight: "#EFF6FF",
  },
  {
    id: 8,
    area: "Derecho a la Educación",
    descripcion: "Explora la educación como derecho humano fundamental y aprende cómo contribuir a la igualdad de oportunidades para que ningún niño, joven o adulto quede fuera del sistema.",
    flyerUrl: "https://drive.google.com/file/d/19n2tar4FL4vyyNKqqChWqOnEhEnQEy3n/preview",
    icono: "📚",
    color: "#4338CA",
    colorLight: "#EEF2FF",
  },
  {
    id: 9,
    area: "Derecho a la Vivienda",
    descripcion: "Reflexiona sobre el acceso digno a la vivienda como derecho básico y el papel que juegan las empresas y comunidades en la construcción de un hogar para todos.",
    flyerUrl: "https://drive.google.com/file/d/1sUn97VgckRbQX5-MFmP-JymayOZHeexl/preview",
    icono: "🏠",
    color: "#1A2E6C",
    colorLight: "#EEF2FF",
  },
];

export function CursosSensibilizacionPage() {
  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);

  return (
    <>
      <section
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", backgroundColor: "#FFFFFF" }}
        className="pt-10 pb-16 md:pt-14 md:pb-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1
              style={{ color: "#1A2E6C", fontWeight: 800, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", lineHeight: 1.2 }}
            >
              Cursos de Sensibilización
            </h1>
            <p style={{ color: "#6B7280", marginTop: 12, maxWidth: 560, fontSize: 16, lineHeight: 1.7 }} className="mx-auto">
              Antes de participar en un evento de voluntariado, te invitamos a conocer más sobre cada área de impacto. Haz clic en cualquier curso para ver el flyer completo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CURSOS.map((curso) => (
              <div
                key={curso.id}
                onClick={() => setSelectedCurso(curso)}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 16,
                  border: "1px solid #E5E7EB",
                  overflow: "hidden",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                className="group hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Color header */}
                <div
                  style={{
                    backgroundColor: curso.colorLight,
                    borderBottom: `3px solid ${curso.color}`,
                    padding: "28px 24px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 12,
                      backgroundColor: curso.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 26,
                      flexShrink: 0,
                    }}
                  >
                    {curso.icono}
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: curso.color, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 3 }}>
                      Curso #{curso.id}
                    </p>
                    <h3 style={{ color: "#1A2E6C", fontWeight: 800, fontSize: 16, lineHeight: 1.3, margin: 0 }}>
                      {curso.area}
                    </h3>
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: "18px 22px", flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                  <p style={{ color: "#4B5563", fontSize: 13.5, lineHeight: 1.7, margin: 0 }}>
                    {curso.descripcion}
                  </p>

                  <button
                    style={{
                      marginTop: "auto",
                      width: "100%",
                      padding: "11px 16px",
                      backgroundColor: curso.color,
                      color: "#FFFFFF",
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: 13.5,
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 7,
                      transition: "filter 0.18s",
                    }}
                    className="group-hover:brightness-110"
                  >
                    <BookOpen size={15} />
                    Ver flyer del curso
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedCurso && (
        <FlyerModal curso={selectedCurso} onClose={() => setSelectedCurso(null)} />
      )}
    </>
  );
}

function FlyerModal({ curso, onClose }: { curso: Curso; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0, left: 0, width: "100%", height: "100%",
        backgroundColor: "rgba(0,0,0,0.65)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 20,
          maxWidth: 780,
          width: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxHeight: "92vh",
          boxShadow: "0 32px 64px -12px rgba(0,0,0,0.45)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: `3px solid ${curso.color}`,
            backgroundColor: curso.colorLight,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24 }}>{curso.icono}</span>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: curso.color, letterSpacing: "0.06em", textTransform: "uppercase", margin: 0 }}>
                Curso de Sensibilización #{curso.id}
              </p>
              <h3 style={{ color: "#1A2E6C", fontWeight: 800, fontSize: 18, margin: 0, lineHeight: 1.3 }}>
                {curso.area}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "rgba(0,0,0,0.08)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
          >
            <X size={18} style={{ color: "#374151" }} />
          </button>
        </div>

        {/* Iframe */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          <iframe
            src={curso.flyerUrl}
            title={`Flyer — ${curso.area}`}
            style={{ width: "100%", height: "70vh", border: "none", display: "block" }}
            allow="autoplay"
          />
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #E5E7EB", display: "flex", justifyContent: "flex-end", gap: 10, flexShrink: 0 }}>
          <a
            href={curso.flyerUrl.replace("/preview", "/view")}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: curso.color, color: "#FFFFFF", padding: "10px 20px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 14 }}
          >
            Abrir en pestaña nueva
          </a>
          <button
            onClick={onClose}
            style={{ backgroundColor: "#F3F4F6", color: "#4B5563", padding: "10px 20px", borderRadius: 8, fontWeight: 600, border: "none", cursor: "pointer", fontSize: 14 }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
