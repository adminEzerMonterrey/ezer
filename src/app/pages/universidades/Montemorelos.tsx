import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart, BookOpen, Leaf, Music, Utensils, Dumbbell,
  Paintbrush, Brain, Stethoscope, Apple,
  Lightbulb, X, Send, ChevronLeft,
} from "lucide-react";

// Eventos reales del catálogo de Ezer (tabla events de Supabase),
// seleccionados por su afinidad con las carreras de la Universidad de Montemorelos.
const EVENTS = [
  {
    id: 104,
    title: "Jornada de Salud y Bienestar para Mayores",
    area: "Adultos Mayores",
    icon: Stethoscope,
    color: "#E8401C",
    desc: "Valoraciones básicas de salud, activación física suave y orientación de bienestar integral para adultos mayores en casas hogar y centros comunitarios.",
    carrera: "Medicina · Enfermería · Fisioterapia",
  },
  {
    id: 107,
    title: "Jornada de Salud y Autocuidado de la Mujer",
    area: "Mujeres",
    icon: Heart,
    color: "#1A2E6C",
    desc: "Jornada de salud preventiva y autocuidado dirigida a mujeres en situación vulnerable: orientación médica, talleres de bienestar y acompañamiento emocional.",
    carrera: "Medicina · Enfermería · Psicología",
  },
  {
    id: 101,
    title: "Festival de Lectura Infantil",
    area: "Niños",
    icon: BookOpen,
    color: "#F5C200",
    desc: "Festival para fomentar el hábito de la lectura en niñas y niños con cuentacuentos, dinámicas lúdicas y actividades didácticas.",
    carrera: "Educación · Pedagogía",
  },
  {
    id: 102,
    title: "Jornada Deportiva y de Valores",
    area: "Niños",
    icon: Dumbbell,
    color: "#E8401C",
    desc: "Juegos, torneos amistosos y activación física para niñas y niños, integrando dinámicas de valores y trabajo en equipo.",
    carrera: "Educación Física · Psicología",
  },
  {
    id: 116,
    title: "Día de Cocina Solidaria",
    area: "Comedores",
    icon: Utensils,
    color: "#1A2E6C",
    desc: "Preparación y servicio de alimentos en comedores comunitarios que atienden a niños, adultos mayores y personas en situación vulnerable.",
    carrera: "Nutrición · Gastronomía · Cualquier carrera",
  },
  {
    id: 119,
    title: "Desayunos Calientes para la Infancia",
    area: "Comedores",
    icon: Apple,
    color: "#F5C200",
    desc: "Elaboración y entrega de desayunos nutritivos para niñas y niños, con orientación sobre alimentación saludable para las familias.",
    carrera: "Nutrición · Enfermería",
  },
  {
    id: 97,
    title: "Pintemos la Escuela",
    area: "Educación",
    icon: Paintbrush,
    color: "#E8401C",
    desc: "Jornada de pintura y mejora de espacios en escuelas públicas: aulas, patios y muros renovados por brigadas de estudiantes voluntarios.",
    carrera: "Cualquier carrera",
  },
  {
    id: 113,
    title: "Huerto Comunitario Sustentable",
    area: "Medio Ambiente",
    icon: Leaf,
    color: "#1A2E6C",
    desc: "Instalación y mantenimiento de huertos comunitarios con talleres de compostaje, siembra y hábitos sustentables.",
    carrera: "Agronomía · Biología · Nutrición",
  },
  {
    id: 110,
    title: "Taller de Arte-Terapia Inclusivo",
    area: "Discapacidad",
    icon: Brain,
    color: "#F5C200",
    desc: "Sesiones de arte-terapia para personas con discapacidad: expresión creativa, desarrollo emocional y convivencia inclusiva.",
    carrera: "Psicología · Arte · Trabajo Social",
  },
  {
    id: 105,
    title: "Tarde Musical y de Memorias",
    area: "Adultos Mayores",
    icon: Music,
    color: "#E8401C",
    desc: "Convivencia musical con adultos mayores: interpretación en vivo, canto y dinámicas de reminiscencia que estimulan la memoria y alegran el corazón.",
    carrera: "Música · Psicología · Gerontología",
  },
];

export function MontemorelosPage() {
  const [proposalOpen, setProposalOpen] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://server.fillout.com/embed/v1/";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);
  const [form, setForm] = useState({ nombre: "", correo: "", evento: "", area: "", descripcion: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      const apiBase = window.location.hostname === "localhost" ? "http://localhost:3000" : "";
      const res = await fetch(`${apiBase}/api/university-proposal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.nombre,
          email: form.correo,
          universidad: "Universidad de Montemorelos",
          evento: form.evento,
          area: form.area,
          descripcion: form.descripcion,
        }),
      });

      if (!res.ok) throw new Error("Error enviando la propuesta");
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitError("Hubo un error al enviar tu propuesta. Por favor intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="bg-white">

      {/* HEADER UNIVERSIDAD */}
      <section className="relative w-full py-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#F8FAFC] to-[#EEF2FF] overflow-hidden border-b border-gray-100">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-[#1A2E6C]/5 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto">
          <Link
            to="/universidades"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-[#1A2E6C] transition-colors mb-8"
          >
            <ChevronLeft size={16} />
            Volver a Universidades
          </Link>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            <div
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: 16,
                padding: "20px 24px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                flexShrink: 0,
              }}
            >
              <img
                src="/montemorelos.webp"
                alt="Universidad de Montemorelos"
                style={{ height: 72, width: "auto", objectFit: "contain", display: "block" }}
              />
            </div>
            <div>
              <p className="text-xs font-bold text-[#E8401C] uppercase tracking-widest mb-1">Alianza universitaria</p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#1A2E6C] leading-tight mb-3">
                Universidad de Montemorelos
              </h1>
              <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
                En alianza con EZER, los estudiantes de Montemorelos pueden vivir experiencias reales de servicio comunitario, acumular horas de servicio social y poner en práctica el conocimiento de su carrera donde más se necesita.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EVENTOS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A2E6C] mb-2">
              Elige tu evento
            </h2>
            <p className="text-gray-500 text-base">
              10 proyectos listos para que los estudiantes de Montemorelos participen. Dale clic al que más te interese.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {EVENTS.map((ev) => {
              const Icon = ev.icon;
              return (
                <a
                  key={ev.id}
                  href="#registro"
                  style={{
                    border: "1px solid #E5E7EB",
                    borderRadius: 16,
                    borderTop: `4px solid ${ev.color}`,
                    backgroundColor: "#FAFAFA",
                    padding: "20px 22px",
                    textDecoration: "none",
                    display: "block",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  className="hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        backgroundColor: `${ev.color}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      <Icon size={22} style={{ color: ev.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          style={{
                            backgroundColor: `${ev.color}18`,
                            color: ev.color,
                            fontSize: 10,
                            fontWeight: 800,
                            padding: "2px 8px",
                            borderRadius: 999,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          }}
                        >
                          {ev.area}
                        </span>
                      </div>
                      <h3 style={{ color: "#1A2E6C", fontWeight: 800, fontSize: 15, lineHeight: 1.3, marginBottom: 6 }}>
                        {ev.title}
                      </h3>
                      <p style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.6, marginBottom: 8 }}>
                        {ev.desc}
                      </p>
                      <p style={{ color: "#9CA3AF", fontSize: 11, fontWeight: 700 }}>
                        Carrera: {ev.carrera}
                      </p>
                    </div>
                  </div>
                </a>
              );
            })}

            {/* Card propón tu evento */}
            <button
              onClick={() => setProposalOpen(true)}
              style={{
                border: "2px dashed #C7D2FE",
                borderRadius: 16,
                backgroundColor: "#EEF2FF",
                padding: "20px 22px",
                cursor: "pointer",
                width: "100%",
                textAlign: "left",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              className="hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    backgroundColor: "#1A2E6C",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  <Lightbulb size={22} style={{ color: "#F5C200" }} />
                </div>
                <div>
                  <p style={{ color: "#1A2E6C", fontWeight: 800, fontSize: 15, lineHeight: 1.3, marginBottom: 6 }}>
                    ¿Tienes otra idea? Propon tu propio evento
                  </p>
                  <p style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.6 }}>
                    Cuéntanos qué quieren hacer y EZER se encarga de encontrar la asociación beneficiaria ideal para hacerlo realidad.
                  </p>
                  <span
                    style={{
                      display: "inline-block",
                      marginTop: 10,
                      color: "#1A2E6C",
                      fontWeight: 800,
                      fontSize: 13,
                    }}
                  >
                    Proponer evento →
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* FORMULARIO REGISTRO */}
      <section id="registro" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A2E6C] mb-3">
              Regístrate para participar
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              Llena el formulario y coordinaremos tu participación en el evento que elegiste.
            </p>
          </div>
          <div className="bg-white rounded-3xl p-4 md:p-8 shadow-2xl shadow-blue-900/5 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1A2E6C] via-[#E8401C] to-[#F5C200]" />
            <div
              style={{ width: "100%", height: "800px" }}
              data-fillout-id="vW3WKuVysxus"
              data-fillout-embed-type="standard"
              data-fillout-inherit-parameters
              data-fillout-dynamic-resize
            ></div>
          </div>
        </div>
      </section>

      {/* MODAL PROPUESTA */}
      {proposalOpen && (
        <div
          onClick={() => setProposalOpen(false)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full overflow-hidden flex flex-col"
            style={{ maxWidth: 560, maxHeight: "92vh", boxShadow: "0 32px 64px -12px rgba(0,0,0,0.4)" }}
          >
            <div className="flex-shrink-0">
              <div className="h-1 w-full bg-gradient-to-r from-[#1A2E6C] via-[#E8401C] to-[#F5C200]" />
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div>
                  <p className="text-xs font-bold text-[#E8401C] uppercase tracking-widest">Universidad de Montemorelos</p>
                  <h3 className="text-lg font-extrabold text-[#1A2E6C] mt-0.5">Propón tu evento</h3>
                </div>
                <button
                  onClick={() => setProposalOpen(false)}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X size={17} className="text-gray-600" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                    <Send size={28} className="text-green-500" />
                  </div>
                  <h4 className="text-xl font-extrabold text-[#1A2E6C]">¡Propuesta recibida!</h4>
                  <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                    Nos pondremos en contacto contigo para buscar la asociación ideal y hacer realidad tu evento.
                  </p>
                  <button
                    onClick={() => setProposalOpen(false)}
                    className="mt-2 px-6 py-2.5 rounded-xl bg-[#1A2E6C] text-white text-sm font-bold hover:brightness-110 transition-all"
                  >
                    Cerrar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Cuéntanos qué evento quieren organizar desde Montemorelos. EZER buscará la asociación beneficiaria perfecta para hacerlo realidad.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-600">Nombre completo *</label>
                      <input
                        type="text" required
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        placeholder="Tu nombre"
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1A2E6C] focus:ring-2 focus:ring-[#1A2E6C]/10 transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-600">Correo electrónico *</label>
                      <input
                        type="email" required
                        value={form.correo}
                        onChange={(e) => setForm({ ...form, correo: e.target.value })}
                        placeholder="tu@um.edu.mx"
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1A2E6C] focus:ring-2 focus:ring-[#1A2E6C]/10 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-600">Nombre del evento propuesto *</label>
                    <input
                      type="text" required
                      value={form.evento}
                      onChange={(e) => setForm({ ...form, evento: e.target.value })}
                      placeholder="Ej: Brigada de Salud Visual"
                      className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1A2E6C] focus:ring-2 focus:ring-[#1A2E6C]/10 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-600">Área o sector beneficiado</label>
                    <select
                      value={form.area}
                      onChange={(e) => setForm({ ...form, area: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1A2E6C] focus:ring-2 focus:ring-[#1A2E6C]/10 transition-all bg-white"
                    >
                      <option value="">Selecciona una opción</option>
                      <option>Niños y juventud</option>
                      <option>Adultos mayores</option>
                      <option>Salud y bienestar</option>
                      <option>Educación</option>
                      <option>Alimentación</option>
                      <option>Medio ambiente</option>
                      <option>Discapacidad e inclusión</option>
                      <option>Migración</option>
                      <option>Vivienda digna</option>
                      <option>Otra</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-600">Describe tu idea *</label>
                    <textarea
                      required rows={4}
                      value={form.descripcion}
                      onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                      placeholder="¿Qué actividades harían? ¿Cuántos estudiantes participarían? ¿Tienen fecha en mente?"
                      className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1A2E6C] focus:ring-2 focus:ring-[#1A2E6C]/10 transition-all resize-none"
                    />
                  </div>

                  {submitError && <p className="text-xs text-red-500 font-semibold">{submitError}</p>}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1A2E6C] text-white text-sm font-bold hover:brightness-110 active:scale-95 transition-all duration-200 shadow-md disabled:opacity-60"
                  >
                    <Send size={15} />
                    {submitting ? "Enviando..." : "Enviar propuesta"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
