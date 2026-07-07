import { useState, useEffect, useRef } from "react";
import { X, BookOpen, Send, MapPin, CheckCircle2 } from "lucide-react";
import { supabase } from "../../supabaseClient";

interface Curso {
  id: number;
  area: string;
  category: string;
  descripcion: string;
  flyerUrl: string;
  imagen: string;
}

interface Event {
  id: number;
  title: string;
  municipio: string;
  flyerUrl: string;
}

const CURSOS: Curso[] = [
  {
    id: 1,
    area: "Infancia Vulnerable",
    category: "Niños",
    descripcion: "Conoce los riesgos que enfrentan niñas y niños en situación de vulnerabilidad y aprende cómo ser un agente de cambio en su entorno.",
    flyerUrl: "https://drive.google.com/file/d/1cp6HlrKl_hl5sRDgIyoi4IrgvKzpnH7j/preview",
    imagen: "/curso-1.jpg",
  },
  {
    id: 2,
    area: "Dignidad en la Vejez",
    category: "Adultos Mayores",
    descripcion: "Reflexiona sobre el envejecimiento digno y aprende a acompañar a adultos mayores desde la empatía y el respeto.",
    flyerUrl: "https://drive.google.com/file/d/1lkY59RtgUO25gfDzLE31nO2SFa5x4ZaI/preview",
    imagen: "/curso-2.jpg",
  },
  {
    id: 3,
    area: "Mujeres y Empoderamiento",
    category: "Mujeres",
    descripcion: "Explora la importancia de la equidad de género y el empoderamiento femenino como base del desarrollo social.",
    flyerUrl: "https://drive.google.com/file/d/13ePrkegUy7luXj65VdGRdsN9lAHkdYkR/preview",
    imagen: "/curso-3.jpg",
  },
  {
    id: 4,
    area: "Inclusión y Discapacidad",
    category: "Discapacidad",
    descripcion: "Descubre cómo construir entornos verdaderamente inclusivos eliminando barreras físicas, sociales y actitudinales.",
    flyerUrl: "https://drive.google.com/file/d/1KIShnCQfEQ89E7OfHfrYF4bdqsEUZ-Bc/preview",
    imagen: "/curso-4.jpg",
  },
  {
    id: 5,
    area: "Conciencia Ambiental",
    category: "Medio Ambiente",
    descripcion: "Sensibilízate sobre el impacto ambiental y aprende a promover hábitos sostenibles en tu empresa y comunidad.",
    flyerUrl: "https://drive.google.com/file/d/1yyoXKgbYTg8miDjzVtNmYeNAXx9hc822/preview",
    imagen: "/curso-5.jpg",
  },
  {
    id: 6,
    area: "Hambre y Solidaridad",
    category: "Comedores",
    descripcion: "Comprende la realidad de la inseguridad alimentaria y cómo la solidaridad organizada puede ser una respuesta efectiva.",
    flyerUrl: "https://drive.google.com/file/d/1ZdLzciJI7c0vEHzMvoROj6uuAqrgccoN/preview",
    imagen: "/curso-6.jpg",
  },
  {
    id: 7,
    area: "Migración y Hospitalidad",
    category: "Migrantes",
    descripcion: "Conoce la situación de personas migrantes y refugiadas, y aprende cómo ser agente de integración y dignidad humana.",
    flyerUrl: "https://drive.google.com/file/d/1dG9qGrKGKi56whSPLNRvHG8ZddywbDwg/preview",
    imagen: "/curso-7.jpg",
  },
  {
    id: 8,
    area: "Derecho a la Educación",
    category: "Educación",
    descripcion: "Explora la educación como derecho fundamental y aprende a contribuir para que ningún niño, joven o adulto quede fuera.",
    flyerUrl: "https://drive.google.com/file/d/19n2tar4FL4vyyNKqqChWqOnEhEnQEy3n/preview",
    imagen: "/curso-8.jpg",
  },
  {
    id: 9,
    area: "Derecho a la Vivienda",
    category: "Vivienda Digna",
    descripcion: "Reflexiona sobre el acceso digno a la vivienda y el papel que juegan empresas y comunidades en la construcción de un hogar.",
    flyerUrl: "https://drive.google.com/file/d/1sUn97VgckRbQX5-MFmP-JymayOZHeexJ/preview",
    imagen: "/curso-9.jpg",
  },
];

export function CursosSensibilizacionPage() {
  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
  const [interestCurso, setInterestCurso] = useState<Curso | null>(null);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="bg-white">
      {/* HERO */}
      <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#F8FAFC] to-[#EEF2FF] overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-[#E8401C]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#1A2E6C]/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1A2E6C] mb-6 leading-tight tracking-tight">
            Cursos de <span className="text-[#E8401C]">Sensibilización</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Los Cursos de Sensibilización son módulos breves diseñados para concientizar y preparar a nuestros voluntarios sobre diversas realidades sociales. Nuestro objetivo es que cada intervención se realice con empatía, respeto y el conocimiento necesario para generar un verdadero impacto positivo.
            <br /><br />
            Te invitamos a explorar las diferentes áreas y consultar el material de tu interés antes de participar en nuestros eventos.
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
                className="group bg-white rounded-2xl border border-gray-100 shadow-md shadow-gray-200/40 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/60 hover:border-gray-200"
              >
                <div
                  className="w-full h-48 relative overflow-hidden cursor-pointer"
                  onClick={() => setSelectedCurso(curso)}
                >
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#1A2E6C] via-[#E8401C] to-[#F5C200] z-10" />
                  <img
                    src={curso.imagen}
                    alt={curso.area}
                    loading="lazy"
                    decoding="async"
                    width={1000}
                    height={667}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-6 flex flex-col flex-1 gap-4">
                  <div>
                    <p className="text-xs font-bold text-[#E8401C] uppercase tracking-widest mb-1">
                      Curso #{curso.id}
                    </p>
                    <h3 className="text-xl font-extrabold text-[#1A2E6C] leading-snug">
                      {curso.area}
                    </h3>
                  </div>

                  <hr className="border-gray-100" />

                  <p className="text-sm text-gray-500 leading-relaxed flex-1">
                    {curso.descripcion}
                  </p>

                  {/* Two buttons */}
                  <div className="flex flex-col gap-2 mt-auto">
                    <button
                      onClick={() => setSelectedCurso(curso)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#1A2E6C] text-[#1A2E6C] text-sm font-bold transition-all duration-200 hover:bg-[#1A2E6C] hover:text-white"
                    >
                      <BookOpen size={15} />
                      Ver flyer del curso
                    </button>
                    <button
                      onClick={() => setInterestCurso(curso)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#E8401C] text-white text-sm font-bold transition-all duration-200 hover:bg-[#c73418] hover:shadow-lg hover:shadow-red-200"
                    >
                      <Send size={15} />
                      Me interesa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedCurso && (
        <FlyerModal curso={selectedCurso} onClose={() => setSelectedCurso(null)} />
      )}
      {interestCurso && (
        <InterestModal curso={interestCurso} onClose={() => setInterestCurso(null)} />
      )}
    </div>
  );
}

/* ── Flyer modal (existing) ────────────────────────────────── */
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
        <div className="flex-shrink-0">
          <div className="h-1 w-full bg-gradient-to-r from-[#1A2E6C] via-[#E8401C] to-[#F5C200]" />
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <p className="text-xs font-bold text-[#E8401C] uppercase tracking-widest">
                Curso de Sensibilización #{curso.id}
              </p>
              <h3 className="text-lg font-extrabold text-[#1A2E6C] leading-tight mt-1">
                {curso.area}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <X size={17} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <iframe
            src={curso.flyerUrl}
            title={`Flyer — ${curso.area}`}
            className="w-full border-0 block"
            style={{ height: "70vh" }}
            allow="autoplay"
          />
        </div>

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

/* ── Interest modal (new) ──────────────────────────────────── */
function InterestModal({ curso, onClose }: { curso: Curso; onClose: () => void }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [selectedEventIds, setSelectedEventIds] = useState<number[]>([]);
  
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", comments: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
    const fetchEvents = async () => {
      const { data } = await supabase
        .from("events")
        .select("id, name, municipio, flyer_url")
        .eq("objective", curso.category)
        .order("date", { ascending: true })
        .limit(10);

      if (data) {
        // Evitar eventos repetidos (mismo nombre y municipio) en la lista y en el correo
        const seen = new Set<string>();
        setEvents(
          data
            .map((e: any) => ({
              id: e.id,
              title: e.name,
              municipio: e.municipio,
              flyerUrl: e.flyer_url || "",
            }))
            .filter((e) => {
              const key = `${e.title}__${e.municipio || ""}`;
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            })
        );
      }
      setLoadingEvents(false);
    };
    fetchEvents();
  }, [curso.category]);

  const handleToggleEvent = (id: number) => {
    setSelectedEventIds((prev) =>
      prev.includes(id) ? prev.filter((eventId) => eventId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name || !form.email) { setError("Por favor completa tu nombre y correo."); return; }
    if (events.length > 0 && selectedEventIds.length === 0) {
      setError("Por favor selecciona al menos un evento de tu interés.");
      return;
    }
    setSubmitting(true);
    setError("");

    const selectedEvents = events.filter((ev) => selectedEventIds.includes(ev.id));
    const selectedEventsNames = [...new Set(selectedEvents.map((ev) => ev.title))].join(", ");

    // Guardar en Supabase
    // Si la tabla no tiene las nuevas columnas y falla, podemos atraparlo y continuar
    const { error: dbErr } = await supabase.from("course_interests").insert({
      curso_id: curso.id,
      curso_area: curso.area,
      categoria: curso.category,
      nombre: form.name,
      correo: form.email,
      telefono: form.phone,
      empresa: form.company,
      eventos_seleccionados: selectedEventsNames,
      comentarios: form.comments
    });

    if (dbErr) {
      console.error("Error al guardar en BD (asegúrate de haber ejecutado el update_course_interests.sql):", dbErr);
      // No bloquearemos el envío de correo si la inserción a BD falla por esquema viejo
    }

    // Enviar correo llamando a nuestra API Serverless
    try {
      const apiBase = window.location.hostname === "localhost" ? "http://localhost:3000" : "";
      const res = await fetch(`${apiBase}/api/course-interest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          cursoArea: curso.area,
          cursoCategory: curso.category,
          eventosSeleccionados: selectedEventsNames,
          eventos: selectedEvents.map((ev) => ({
            name: ev.title,
            municipio: ev.municipio,
            flyerUrl: ev.flyerUrl,
          })),
          comments: form.comments,
          flyerUrl: curso.flyerUrl
        }),
      });

      if (!res.ok) {
        throw new Error("Error enviando el correo");
      }
    } catch (err) {
      console.error(err);
      setError("Hubo un error al enviar el correo. Sin embargo tu registro pudo haber sido guardado.");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setSubmitted(true);
  };


  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full overflow-hidden flex flex-col"
        style={{ maxWidth: 700, maxHeight: "93vh", boxShadow: "0 32px 64px -12px rgba(0,0,0,0.4)" }}
      >
        {/* Header */}
        <div className="flex-shrink-0">
          <div className="h-1 w-full bg-gradient-to-r from-[#1A2E6C] via-[#E8401C] to-[#F5C200]" />
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <p className="text-xs font-bold text-[#E8401C] uppercase tracking-widest">Me interesa</p>
              <h3 className="text-lg font-extrabold text-[#1A2E6C] leading-tight mt-0.5">{curso.area}</h3>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <X size={17} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">

          {submitted ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle2 size={36} className="text-green-500" />
              </div>
              <h4 className="text-xl font-extrabold text-[#1A2E6C]">¡Gracias por tu interés!</h4>
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                Nos pondremos en contacto contigo pronto para coordinar tu participación en los eventos seleccionados.
                <br /><br />
                Acabamos de enviarte un correo con el material del curso.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2.5 rounded-xl bg-[#1A2E6C] text-white text-sm font-bold hover:brightness-110 transition-all"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              
              {/* Events list */}
              <div>
                <h4 className="text-sm font-extrabold text-[#1A2E6C] uppercase tracking-wide mb-3">
                  1. Elige los eventos de tu interés *
                </h4>
                <p className="text-xs text-gray-500 mb-4">Selecciona al menos un evento próximo para este curso.</p>

                {loadingEvents ? (
                  <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
                    <div className="w-4 h-4 border-2 border-gray-200 border-t-[#1A2E6C] rounded-full animate-spin" />
                    Cargando eventos...
                  </div>
                ) : events.length === 0 ? (
                  <div className="text-center py-6 rounded-xl bg-gray-50 border border-gray-100">
                    <p className="text-gray-400 text-sm">No hay eventos próximos para esta área por el momento.</p>
                    <p className="text-gray-400 text-xs mt-1">De todos modos puedes enviar tu interés para considerarte.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {events.map((ev) => (
                      <label
                        key={ev.id}
                        className={`cursor-pointer flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 ${
                          selectedEventIds.includes(ev.id)
                            ? "border-[#1A2E6C] bg-blue-50/50 shadow-sm"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="pt-1">
                          <input
                            type="checkbox"
                            checked={selectedEventIds.includes(ev.id)}
                            onChange={() => handleToggleEvent(ev.id)}
                            className="w-5 h-5 rounded text-[#1A2E6C] focus:ring-[#1A2E6C] border-gray-300"
                          />
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-bold leading-snug ${selectedEventIds.includes(ev.id) ? "text-[#1A2E6C]" : "text-gray-700"}`}>
                            {ev.title}
                          </p>
                          {ev.municipio && (
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin size={11} className="text-gray-400" />
                              <span className="text-xs text-gray-500">{ev.municipio}</span>
                            </div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Tus Datos */}
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-extrabold text-[#1A2E6C] uppercase tracking-wide">2. Tus datos</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-600">Nombre completo *</label>
                    <input
                      ref={firstInputRef}
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Tu nombre"
                      className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1A2E6C] focus:ring-2 focus:ring-[#1A2E6C]/10 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-600">Correo electrónico *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="tu@correo.com"
                      className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1A2E6C] focus:ring-2 focus:ring-[#1A2E6C]/10 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-600">Teléfono</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="81 1234 5678"
                      className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1A2E6C] focus:ring-2 focus:ring-[#1A2E6C]/10 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-600">Empresa / Organización</label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Nombre de tu empresa"
                      className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1A2E6C] focus:ring-2 focus:ring-[#1A2E6C]/10 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <label className="text-xs font-bold text-gray-600">Comentarios adicionales</label>
                    <textarea
                      value={form.comments}
                      onChange={(e) => setForm({ ...form, comments: e.target.value })}
                      placeholder="¿Tienes alguna duda o detalle que quieras mencionar?"
                      rows={3}
                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1A2E6C] focus:ring-2 focus:ring-[#1A2E6C]/10 transition-all resize-none"
                    />
                  </div>
                </div>

                {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#E8401C] text-white text-sm font-bold hover:bg-[#c73418] active:scale-95 transition-all duration-200 shadow-md disabled:opacity-60 mt-2"
                >
                  <Send size={15} />
                  {submitting ? "Enviando e insertando..." : "Enviar mi interés y eventos"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

