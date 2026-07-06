import { useEffect } from "react";
import { ClipboardEdit, Mail, Globe } from "lucide-react";

const CATEGORIES = [
  {
    title: "Música y canto",
    items: "Cantantes y músicos solistas · Tríos, grupos o bandas locales · Coros (villancicos, música del recuerdo)",
    color: "#E8401C",
  },
  {
    title: "Baile y movimiento",
    items: "Academias de baile · Maestros de baile de salón · Grupos de danza folclórica o moderna",
    color: "#F5C200",
  },
  {
    title: "Arte y manualidades",
    items: "Artistas plásticos y pintores · Talleristas de manualidades · Ilustradores y caricaturistas",
    color: "#E8401C",
  },
  {
    title: "Espectáculo y animación",
    items: "Magos y show infantil · Cuentacuentos y narradores · Titiriteros y teatro",
    color: "#F5C200",
  },
  {
    title: "Bienestar y salud",
    items: "Maestros de yoga y relajación · Profesionales de la salud (enfermería, medicina) · Nutriólogos y promotores de salud",
    color: "#1A2E6C",
  },
  {
    title: "Terapias alternativas",
    items: "Terapia con animales de asistencia · Musicoterapeutas · Terapeutas ocupacionales",
    color: "#E8401C",
  },
  {
    title: "Educación y oficios",
    items: "Docentes y pedagogos · Maestros de un oficio (repostería, costura, belleza) · Orientadores vocacionales",
    color: "#F5C200",
  },
  {
    title: "Tecnología",
    items: "Ingenieros en sistemas y técnicos · Promotores de robótica y programación · Especialistas en inclusión digital",
    color: "#1A2E6C",
  },
  {
    title: "Oficios y construcción",
    items: "Albañiles, carpinteros y maestros de obra · Plomeros e instaladores · Pintores y muralistas",
    color: "#E8401C",
  },
  {
    title: "Deporte",
    items: "Entrenadores y profesores de educación física · Equipos y clubes deportivos · Promotores de deporte adaptado",
    color: "#F5C200",
  },
  {
    title: "Cocina y alimentación",
    items: "Chefs y cocineros voluntarios · Reposteros · Nutriólogos",
    color: "#1A2E6C",
  },
  {
    title: "Comunicación y registro",
    items: "Fotógrafos y videógrafos · Diseñadores gráficos · Creadores de contenido",
    color: "#E8401C",
  },
  {
    title: "Medio ambiente",
    items: "Biólogos e ingenieros ambientales · Promotores ecológicos · Viveros y expertos en huertos",
    color: "#F5C200",
  },
  {
    title: "Acompañamiento y logística",
    items: "Trabajadores sociales · Voluntarios con transporte de carga · Brigadas comunitarias",
    color: "#1A2E6C",
  },
];

const STEPS = [
  { n: "1", text: "Elige tu talento o actividad favorita" },
  { n: "2", text: "Inscríbete como Aliado Voluntario" },
  { n: "3", text: "Te invitamos al evento donde tu talento suma" },
  { n: "4", text: "¡Donas tu don y vives el impacto!" },
];

export function AliadosPage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://server.fillout.com/embed/v1/";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="bg-white">

      {/* HERO */}
      <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#F8FAFC] to-[#EEF2FF] overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-[#E8401C]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#1A2E6C]/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5C200]/20 text-[#1A2E6C] text-sm font-bold mb-6 uppercase tracking-wider">
            Aliados Voluntarios
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1A2E6C] mb-6 leading-tight tracking-tight">
            Sé parte del impacto<br />
            haciendo <span className="text-[#E8401C]">lo que más te gusta</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
            ¿Tienes un talento, un oficio o una pasión? Únete al programa de Aliados Voluntarios. Tú eliges en qué actividad participar y te invitamos a los eventos donde tu talento suma. ¡Haz algo increíble con lo que ya amas hacer!
          </p>

          <a
            href="#registro"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#F5C200] text-[#1A2E6C] rounded-xl font-bold text-lg hover:brightness-105 active:scale-95 transition-all duration-200 shadow-xl shadow-yellow-400/20"
          >
            <ClipboardEdit size={20} />
            Quiero ser Aliado
          </a>
        </div>
      </section>

      {/* PASOS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STEPS.map((step, i) => {
              const colors = ["#E8401C", "#F5C200", "#1A2E6C", "#E8401C"];
              const textColors = ["#FFFFFF", "#1A2E6C", "#FFFFFF", "#FFFFFF"];
              return (
                <div key={step.n} className="flex flex-col items-center text-center gap-4">
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      backgroundColor: colors[i],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      boxShadow: `0 6px 20px ${colors[i]}40`,
                    }}
                  >
                    <span style={{ color: textColors[i], fontWeight: 800, fontSize: 20 }}>{step.n}</span>
                  </div>
                  <p className="text-[#1A2E6C] font-bold text-sm leading-snug">{step.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] border-t border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg text-gray-600 leading-relaxed">
            En cada evento de voluntariado hay espacio para aliados que le ponen chispa a la experiencia. No necesitas ser experto ni dedicar mucho tiempo: basta con tus ganas de servir y compartir eso que sabes hacer.
          </p>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A2E6C] mb-2">
              ¿Qué onda buscamos? <span className="text-[#E8401C]">¡Tu talento!</span>
            </h2>
            <p className="text-gray-500 text-base">Inscríbete en la categoría que más va contigo:</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.title}
                style={{
                  border: "1px solid #E5E7EB",
                  borderRadius: 12,
                  borderLeft: `4px solid ${cat.color}`,
                  backgroundColor: "#FAFAFA",
                  padding: "16px 20px",
                  transition: "box-shadow 0.2s",
                }}
                className="hover:shadow-md"
              >
                <h3 style={{ color: cat.color, fontWeight: 800, fontSize: 15, marginBottom: 6 }}>
                  {cat.title}
                </h3>
                <p style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.6 }}>{cat.items}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-[#1A2E6C]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
              ¿Te animas a ser Aliado Voluntario?
            </h2>
            <p className="text-blue-200 text-base leading-relaxed max-w-lg">
              Escríbenos y dinos qué te late hacer. Te avisamos cuando haya un evento donde tu talento sea bienvenido.
            </p>
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <div className="flex items-center gap-2 text-[#F5C200] font-semibold text-sm">
              <Mail size={16} />
              voluntariadocorporativo@ezer.org.mx
            </div>
            <div className="flex items-center gap-2 text-[#F5C200] font-semibold text-sm">
              <Globe size={16} />
              ezer-eventos.vercel.app
            </div>
            <a
              href="#registro"
              className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#F5C200] text-[#1A2E6C] rounded-xl font-bold text-sm hover:brightness-105 active:scale-95 transition-all duration-200 shadow-lg"
            >
              <ClipboardEdit size={16} />
              Inscríbete ahora
            </a>
          </div>
        </div>
      </section>

      {/* FORMULARIO */}
      <section id="registro" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-4 md:p-8 shadow-2xl shadow-blue-900/5 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1A2E6C] via-[#E8401C] to-[#F5C200]" />
            <div
              style={{ width: "100%", height: "800px" }}
              data-fillout-id="9pWgQz5oRfus"
              data-fillout-embed-type="standard"
              data-fillout-inherit-parameters
              data-fillout-dynamic-resize
            ></div>
          </div>
        </div>
      </section>
    </div>
  );
}
