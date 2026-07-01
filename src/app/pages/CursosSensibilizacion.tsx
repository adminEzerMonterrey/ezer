import { useState } from "react";
import { X, BookOpen, GraduationCap } from "lucide-react";

interface Curso {
  id: number;
  area: string;
  descripcion: string;
  flyerUrl: string;
  imagen: string;
}

const CURSOS: Curso[] = [
  {
    id: 1,
    area: "Infancia Vulnerable",
    descripcion: "Conoce los riesgos que enfrentan niñas y niños en situación de vulnerabilidad y aprende cómo ser un agente de cambio en su entorno.",
    flyerUrl: "https://drive.google.com/file/d/1cp6HlrKl_hl5sRDglyoi4lrgvKzpnH7j/preview",
    imagen: "/curso-1.png",
  },
  {
    id: 2,
    area: "Dignidad en la Vejez",
    descripcion: "Reflexiona sobre el envejecimiento digno y aprende a acompañar a adultos mayores desde la empatía y el respeto.",
    flyerUrl: "https://drive.google.com/file/d/1lkY59RtgUO25gfDzLE31nO2SFa5x4ZaI/preview",
    imagen: "/curso-2.png",
  },
  {
    id: 3,
    area: "Mujeres y Empoderamiento",
    descripcion: "Explora la importancia de la equidad de género y el empoderamiento femenino como base del desarrollo social.",
    flyerUrl: "https://drive.google.com/file/d/13ePrkegUy7luXj65VdGRdsN9IAHkdYkR/preview",
    imagen: "/curso-3.png",
  },
  {
    id: 4,
    area: "Inclusión y Discapacidad",
    descripcion: "Descubre cómo construir entornos verdaderamente inclusivos eliminando barreras físicas, sociales y actitudinales.",
    flyerUrl: "https://drive.google.com/file/d/1KlShnCQFEQ89E7OfHfrYF4bdqsEUZ-Bc/preview",
    imagen: "/curso-4.png",
  },
  {
    id: 5,
    area: "Conciencia Ambiental",
    descripcion: "Sensibilízate sobre el impacto ambiental y aprende a promover hábitos sostenibles en tu empresa y comunidad.",
    flyerUrl: "https://drive.google.com/file/d/1yoXKgbYTg8miDjzVtNmYeNAXx9hc822/preview",
    imagen: "/curso-5.png",
  },
  {
    id: 6,
    area: "Hambre y Solidaridad",
    descripcion: "Comprende la realidad de la inseguridad alimentaria y cómo la solidaridad organizada puede ser una respuesta efectiva.",
    flyerUrl: "https://drive.google.com/file/d/1ZdLzciJI7c0vEHzMvoROj6uuAqrgccoN/preview",
    imagen: "/curso-6.png",
  },
  {
    id: 7,
    area: "Migración y Hospitalidad",
    descripcion: "Conoce la situación de personas migrantes y refugiadas, y aprende cómo ser agente de integración y dignidad humana.",
    flyerUrl: "https://drive.google.com/file/d/1dG9qGrKGKI56whSPLNRvHG8ZddywbDwg/preview",
    imagen: "/curso-7.png",
  },
  {
    id: 8,
    area: "Derecho a la Educación",
    descripcion: "Explora la educación como derecho fundamental y aprende a contribuir para que ningún niño, joven o adulto quede fuera.",
    flyerUrl: "https://drive.google.com/file/d/19n2tar4FL4vyyNKqqChWqOnEhEnQEy3n/preview",
    imagen: "/curso-8.png",
  },
  {
    id: 9,
    area: "Derecho a la Vivienda",
    descripcion: "Reflexiona sobre el acceso digno a la vivienda y el papel que juegan empresas y comunidades en la construcción de un hogar.",
    flyerUrl: "https://drive.google.com/file/d/1sUn97VgckRbQX5-MFmP-JymayOZHeexl/preview",
    imagen: "/curso-9.png",
  },
];

export function CursosSensibilizacionPage() {
  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="bg-white">
      {/* HERO */}
      <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#F8FAFC] to-[#EEF2FF] overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-[#E8401C]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#1A2E6C]/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 text-[#1A2E6C] font-bold text-sm mb-6 border border-blue-200">
            <GraduationCap size={16} className="text-[#E8401C]" />
            Formación para el voluntariado
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1A2E6C] mb-6 leading-tight tracking-tight">
            Cursos de <span className="text-[#E8401C]">Sensibilización</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Antes de participar en un evento de voluntariado, te invitamos a conocer más sobre cada área de impacto. Explora los cursos y descarga el flyer de tu interés.
          </p>
        </div>
      </section>

      {/* GRID DE CURSOS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CURSOS.map((curso) => (
              <div
                key={curso.id}
                onClick={() => setSelectedCurso(curso)}
                className="group bg-white rounded-2xl border border-gray-100 shadow-md shadow-gray-200/40 overflow-hidden cursor-pointer flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/60 hover:border-gray-200"
              >
                {/* Franja superior de marca */}
                <div className="h-1 w-full bg-gradient-to-r from-[#1A2E6C] via-[#E8401C] to-[#F5C200]" />

                <div className="p-6 flex flex-col flex-1 gap-4">
                  {/* Cabecera de la tarjeta */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] overflow-hidden flex-shrink-0">
                      <img src={curso.imagen} alt={curso.area} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#E8401C] uppercase tracking-widest mb-1">
                        Curso #{curso.id}
                      </p>
                      <h3 className="text-base font-extrabold text-[#1A2E6C] leading-snug">
                        {curso.area}
                      </h3>
                    </div>
                  </div>

                  {/* Separador */}
                  <hr className="border-gray-100" />

                  {/* Descripción */}
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">
                    {curso.descripcion}
                  </p>

                  {/* Botón */}
                  <button
                    className="w-full mt-auto flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#1A2E6C] text-white text-sm font-bold transition-all duration-200 group-hover:bg-[#2a4393]"
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
    </div>
  );
}

function FlyerModal({ curso, onClose }: { curso: Curso; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-5"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full overflow-hidden flex flex-col"
        style={{ maxWidth: 780, maxHeight: "92vh", boxShadow: "0 32px 64px -12px rgba(0,0,0,0.4)" }}
      >
        {/* Header del modal */}
        <div className="flex-shrink-0">
          <div className="h-1 w-full bg-gradient-to-r from-[#1A2E6C] via-[#E8401C] to-[#F5C200]" />
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] overflow-hidden">
                <img src={curso.imagen} alt={curso.area} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#E8401C] uppercase tracking-widest">
                  Curso de Sensibilización #{curso.id}
                </p>
                <h3 className="text-base font-extrabold text-[#1A2E6C] leading-tight">
                  {curso.area}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <X size={17} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Iframe */}
        <div className="flex-1 overflow-hidden">
          <iframe
            src={curso.flyerUrl}
            title={`Flyer — ${curso.area}`}
            className="w-full border-0 block"
            style={{ height: "70vh" }}
            allow="autoplay"
          />
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <a
            href={curso.flyerUrl.replace("/preview", "/view")}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-[#1A2E6C] text-white text-sm font-bold hover:bg-[#2a4393] transition-colors"
          >
            Abrir en pestaña nueva
          </a>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
