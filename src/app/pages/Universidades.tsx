import { useEffect } from "react";
import { ClipboardEdit, Mail, Globe, Lightbulb } from "lucide-react";

const AREAS = [
  {
    title: "Servicio social y práctica profesional",
    items: "Horas de servicio social · Proyectos de vinculación comunitaria · Prácticas con impacto social",
    color: "#1A2E6C",
  },
  {
    title: "Liderazgo y desarrollo estudiantil",
    items: "Sociedades de alumnos · Grupos de liderazgo juvenil · Organizaciones estudiantiles",
    color: "#E8401C",
  },
  {
    title: "Salud y bienestar",
    items: "Estudiantes de medicina, enfermería y nutrición · Brigadas de salud · Promotores de bienestar",
    color: "#F5C200",
  },
  {
    title: "Arte, música y cultura",
    items: "Grupos corales y bandas universitarias · Talleres de arte y pintura · Grupos de danza y teatro",
    color: "#1A2E6C",
  },
  {
    title: "Ingeniería y tecnología",
    items: "Proyectos de robótica e innovación · Talleres de programación · Soluciones tecnológicas para la comunidad",
    color: "#E8401C",
  },
  {
    title: "Administración y negocios",
    items: "Asesoría a microempresarios · Talleres de finanzas personales · Proyectos de emprendimiento social",
    color: "#F5C200",
  },
  {
    title: "Educación y pedagogía",
    items: "Tutorías y refuerzo académico · Talleres para niños y adultos mayores · Alfabetización y lectura",
    color: "#1A2E6C",
  },
  {
    title: "Medio ambiente y sustentabilidad",
    items: "Campañas ecológicas · Huertos universitarios · Proyectos de reciclaje y concientización",
    color: "#E8401C",
  },
  {
    title: "Comunicación y diseño",
    items: "Fotografía y video documental · Diseño gráfico para causas sociales · Comunicación y redes",
    color: "#F5C200",
  },
  {
    title: "Psicología y trabajo social",
    items: "Acompañamiento emocional · Talleres de habilidades socioemocionales · Trabajo comunitario",
    color: "#1A2E6C",
  },
  {
    title: "Deporte e integración",
    items: "Actividades deportivas incluyentes · Torneos con causa social · Deporte adaptado",
    color: "#E8401C",
  },
  {
    title: "Cocina y gastronomía",
    items: "Brigadas de alimentación · Talleres de nutrición y cocina saludable · Preparación de alimentos para eventos",
    color: "#F5C200",
  },
];

const STEPS = [
  { n: "1", text: "Elige cómo quieres participar: como aliado voluntario o proponiendo tu propio evento" },
  { n: "2", text: "Regístrate con tu universidad y cuéntanos qué pueden aportar tus estudiantes" },
  { n: "3", text: "EZER te conecta con el evento o la asociación ideal para tu proyecto" },
  { n: "4", text: "¡Viváis el impacto juntos y suman horas de servicio social reales!" },
];

export function UniversidadesPage() {
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
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-[#1A2E6C]/6 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#E8401C]/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A2E6C]/10 text-[#1A2E6C] text-sm font-bold mb-6 uppercase tracking-wider">
            Universidades
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1A2E6C] mb-6 leading-tight tracking-tight">
            Forma líderes que<br />
            <span className="text-[#E8401C]">sirven a su comunidad</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
            ¿Tu universidad quiere que sus estudiantes vivan el voluntariado de verdad? Conectamos a las universidades con eventos de impacto social donde el talento estudiantil hace la diferencia. Y si tienes una idea propia, nosotros encontramos la asociación para hacerla realidad.
          </p>

          <a
            href="#registro"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1A2E6C] text-white rounded-xl font-bold text-lg hover:brightness-110 active:scale-95 transition-all duration-200 shadow-xl shadow-blue-900/20"
          >
            <ClipboardEdit size={20} />
            Quiero sumar a mi universidad
          </a>
        </div>
      </section>

      {/* PASOS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STEPS.map((step, i) => {
              const colors = ["#1A2E6C", "#E8401C", "#F5C200", "#1A2E6C"];
              const textColors = ["#FFFFFF", "#FFFFFF", "#1A2E6C", "#FFFFFF"];
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
            En cada evento de voluntariado hay espacio para que los estudiantes pongan en práctica lo que aprenden en el aula. No necesitas experiencia previa: basta con las ganas de servir y el talento que tu carrera ya te dio.
          </p>
        </div>
      </section>

      {/* PROPÓN TU EVENTO */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div
            style={{
              background: "linear-gradient(135deg, #EEF2FF 0%, #F8FAFC 100%)",
              border: "1px solid #C7D2FE",
              borderRadius: 20,
              padding: "40px 36px",
            }}
            className="flex flex-col md:flex-row items-center gap-8"
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                backgroundColor: "#1A2E6C",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Lightbulb size={36} style={{ color: "#F5C200" }} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A2E6C] mb-3">
                ¿Tu universidad tiene una idea? <span className="text-[#E8401C]">Nosotros la hacemos realidad.</span>
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                Si tienes un proyecto de voluntariado en mente — una brigada de salud, una jornada cultural, un taller comunitario — dinos qué quieres hacer y EZER se encarga de encontrar la asociación beneficiaria ideal para que el evento suceda. Tus estudiantes ponen el talento, nosotros ponemos la logística y la vinculación.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* UNIVERSIDADES EJEMPLO */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] border-t border-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-8">
            Universidades que ya forman parte
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { abbr: "UDEM", name: "Universidad de Monterrey" },
              { abbr: "TEC", name: "Tecnológico de Monterrey" },
              { abbr: "UR", name: "Universidad Regiomontana" },
              { abbr: "UM", name: "Universidad de Montemorelos" },
            ].map((u) => (
              <div
                key={u.abbr}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: 14,
                  padding: "24px 16px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                className="flex flex-col items-center gap-3 hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    backgroundColor: "#EEF2FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ color: "#1A2E6C", fontWeight: 900, fontSize: 14 }}>{u.abbr}</span>
                </div>
                <p style={{ color: "#374151", fontWeight: 700, fontSize: 13, lineHeight: 1.4, textAlign: "center" }}>
                  {u.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ÁREAS */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A2E6C] mb-2">
              ¿Qué pueden aportar <span className="text-[#E8401C]">tus estudiantes?</span>
            </h2>
            <p className="text-gray-500 text-base">Inscríbete en el área que más va con tu universidad:</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {AREAS.map((area) => (
              <div
                key={area.title}
                style={{
                  border: "1px solid #E5E7EB",
                  borderRadius: 12,
                  borderLeft: `4px solid ${area.color}`,
                  backgroundColor: "#FAFAFA",
                  padding: "16px 20px",
                  transition: "box-shadow 0.2s",
                }}
                className="hover:shadow-md"
              >
                <h3 style={{ color: area.color, fontWeight: 800, fontSize: 15, marginBottom: 6 }}>
                  {area.title}
                </h3>
                <p style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.6 }}>{area.items}</p>
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
              ¿Tu universidad quiere sumarse?
            </h2>
            <p className="text-blue-200 text-base leading-relaxed max-w-lg">
              Escríbenos y cuéntanos qué pueden aportar tus estudiantes. Te avisamos cuando haya un evento donde su talento sea bienvenido — o creamos uno juntos.
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
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-[#1A2E6C] mb-3">Regístra tu universidad</h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              Cuéntanos sobre tu universidad y cómo quieren participar. Nos pondremos en contacto para coordinar los siguientes pasos.
            </p>
          </div>
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
