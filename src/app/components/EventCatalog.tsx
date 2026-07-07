import { useEffect, useState } from "react";
import { Users, ArrowRight, Filter, ChevronDown, X, Heart, FileText, BookOpen } from "lucide-react";
import { supabase } from "../../supabaseClient";
import { EVENT_CATEGORY_FILTERS, CATEGORY_COURSE_URLS } from "../eventCategories";
import { formatSpotsRange } from "../eventSpots";
import { NUEVO_LEON_MUNICIPALITIES } from "../municipalities";

interface Event {
  id: number;
  title: string;
  company: string;
  date: string;
  month: string;
  day: string;
  category: string;
  audience: string;
  municipio: string;
  description: string;
  image: string;
  spotsMin: number;
  spotsMax: number;
  cost: string | number;
  isAnnual: boolean;
  flyer_url?: string;
  sensibilization_course_url?: string;
}

export function EventCatalog() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Todos");
  const [municipality, setMunicipality] = useState("Todos");

  const [categories, setCategories] = useState<string[]>(EVENT_CATEGORY_FILTERS);
  const [municipalities, setMunicipalities] = useState<string[]>(["Todos"]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [fullDescEvent, setFullDescEvent] = useState<Event | null>(null);
  const [flyerEvent, setFlyerEvent] = useState<Event | null>(null);
  const [courseEvent, setCourseEvent] = useState<Event | null>(null);
  const [detailsEvent, setDetailsEvent] = useState<Event | null>(null);
  const [requestOpen, setRequestOpen] = useState(false);
  const [courseInterest, setCourseInterest] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });

        if (error) {
          console.error(error);
          return;
        }

        const formattedEvents = data.map((e: any) => {
          const dateObj = new Date(e.date);
          const spotsMin = e.spots_min ?? 0;
          const spotsMax = e.spots_max ?? 0;

          return {
            id: e.id,
            title: e.name,
            company: e.company,
            date: e.date,
            month: dateObj.toLocaleString('es-MX', { month: 'short' }).toUpperCase(),
            day: dateObj.getDate().toString(),
            category: e.objective,
            audience: e.target_audience,
            municipio: e.municipio || "Monterrey",
            description: e.description,
            image: e.image_url,
            spotsMin,
            spotsMax,
            cost: e.cost || "Gratuito",
            isAnnual: !!e.is_annual,
            flyer_url: e.flyer_url,
            sensibilization_course_url: CATEGORY_COURSE_URLS[e.objective] ?? e.sensibilization_course_url,
          };
        });

        setEvents(formattedEvents);

        const dbCats = Array.from(new Set(formattedEvents.map(e => e.category)));
        const allCats = Array.from(new Set([...EVENT_CATEGORY_FILTERS, ...dbCats]));
        setCategories(allCats);

        const dbMuns = Array.from(new Set(formattedEvents.flatMap((e: any) => e.municipio ? e.municipio.split(',').map((m: string) => m.trim()) : [])));
        const allMuns = Array.from(new Set(["Todos", ...dbMuns]));
        setMunicipalities(allMuns);
      } catch (fetchError) {
        console.error('Cant load events', fetchError);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filtered = events.filter((e) => {
    const catOk = category === "Todos" || e.category === category;
    const eventMunicipios = e.municipio ? e.municipio.split(',').map(m => m.trim()) : [];
    const municipalityOk = municipality === "Todos" || eventMunicipios.includes(municipality);

    return catOk && municipalityOk;
  });

  return (
    <>
      <section
        id="eventos"
        className="pt-8 pb-12 md:pt-10 md:pb-16"
        style={{ backgroundColor: "#FFFFFF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 flex flex-col items-center">
            <h2
              style={{ color: "#1A2E6C", fontWeight: 800, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", lineHeight: 1.2 }}
            >
              Voluntariado con<br />tus colaboradores
            </h2>
            <a
              href="/empresas"
              className="mt-6 inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#E8401C] text-white rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-red-900/20"
            >
              Registrar mi empresa
            </a>
            <p style={{ color: "#6B7280", marginTop: 16, maxWidth: 520 }} className="mx-auto text-base">
              Tu empresa quiere que su equipo viva la experiencia de servir. Nosotros lo hacemos fácil.
            </p>
          </div>

          <div
            className="flex flex-col sm:flex-row items-center gap-4 p-4 mb-8 flex-wrap bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <div className="flex items-center gap-2 flex-shrink-0 sm:pl-2">
              <Filter size={20} className="text-[#1A2E6C]" />
              <span className="text-[#1A2E6C] font-extrabold text-sm uppercase tracking-wider">Filtros</span>
            </div>

            <div className="hidden sm:block w-px h-8 bg-gray-100" />

            <FilterSelect label="Sector" value={category} options={categories} onChange={setCategory} />
            <FilterSelect label="Municipio" value={municipality} options={municipalities} onChange={setMunicipality} />
            
            {(category !== "Todos" || municipality !== "Todos") && (
              <button
                onClick={() => { setCategory("Todos"); setMunicipality("Todos"); }}
                className="sm:ml-auto text-[#E8401C] font-bold text-sm hover:bg-red-50 px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                Limpiar <X size={16} />
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
            <p style={{ color: "#6B7280", fontSize: 14, margin: 0 }}>
              Mostrando <strong style={{ color: "#1A2E6C" }}>{filtered.length}</strong> evento{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="text-center mb-8">
            <button
              onClick={() => setRequestOpen(true)}
              style={{ color: "#E8401C", fontWeight: 800, fontSize: 17, background: "none", border: "none", cursor: "pointer", transition: "transform 0.2s" }}
              className="hover:underline hover:scale-105"
            >
              ¿No encuentras evento en tu municipio? Escríbenos →
            </button>
          </div>

          {loading ? (
            <div className="text-center py-16" style={{ color: "#6B7280" }}>Cargando eventos...</div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((event, index) => (
                <div
                  key={event.id}
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 16,
                    border: "1px solid #E5E7EB",
                    overflow: "hidden",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                  }}
                  className="group hover:-translate-y-1 hover:shadow-xl"
                  onClick={() => setDetailsEvent(event)}
                >
                  {/* Card top gradient */}
                  <div className="h-1 w-full flex-shrink-0 bg-gradient-to-r from-[#1A2E6C] via-[#E8401C] to-[#F5C200]" />
                  
                  {/* Image with overlays */}
                  <div style={{ position: "relative", height: 210, overflow: "hidden", flexShrink: 0 }}>
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        loading="lazy"
                        decoding="async"
                        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                        className="group-hover:scale-105"
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", backgroundColor: "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "#9CA3AF", fontSize: 40 }}>📸</span>
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)" }} />
                    {/* Annual badge */}
                    {event.isAnnual && (
                      <div style={{ position: "absolute", top: 12, right: 12, backgroundColor: "#FEF3C7", color: "#D97706", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 20 }}>
                        ⭐ Anual
                      </div>
                    )}
                    {/* Category badge on image bottom */}
                    <div style={{ position: "absolute", bottom: 12, left: 12 }}>
                      <span style={{ backgroundColor: "#E8401C", color: "#FFFFFF", borderRadius: 20, fontSize: 11, fontWeight: 700, padding: "4px 10px" }}>
                        {event.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: "18px 18px 0", display: "flex", flexDirection: "column", flex: 1 }}>
                    <h3 style={{ color: "#1A2E6C", fontWeight: 800, fontSize: 16, lineHeight: 1.35, marginBottom: 8 }}>
                      <span style={{ color: "#E8401C", marginRight: 6 }}>{index + 1}.</span>{event.title}
                    </h3>

                    <p style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.6, margin: "0 0 12px" }} className="line-clamp-4">
                      {event.description}
                    </p>

                  </div>

                  {/* Buttons */}
                  <div style={{ padding: "0 18px 18px", display: "flex", flexDirection: "column", gap: 8, marginTop: "auto" }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); setCourseInterest(false); }}
                      style={{ width: "100%", padding: "11px 16px", background: "linear-gradient(135deg, #E8401C 0%, #C53010 100%)", color: "#FFFFFF", borderRadius: 10, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", transition: "transform 0.18s ease, box-shadow 0.18s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(232,64,28,0.4)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                    >
                      <Heart size={14} />
                      Me interesa
                    </button>
                    {(event.flyer_url || event.sensibilization_course_url) && (
                      <div style={{ display: "flex", gap: 8 }}>
                        {event.flyer_url && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setFlyerEvent(event); }}
                            style={{ flex: 1, padding: "9px 8px", backgroundColor: "transparent", color: "#1E3A8A", borderRadius: 10, fontWeight: 700, fontSize: 13, border: "1.5px solid #BFDBFE", cursor: "pointer", transition: "all 0.18s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#1E3A8A"; e.currentTarget.style.color = "#FFFFFF"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(30,58,138,0.3)"; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#1E3A8A"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                          >
                            <FileText size={13} />
                            Flyer
                          </button>
                        )}
                        {event.sensibilization_course_url && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setCourseEvent(event); }}
                            style={{ flex: 1, padding: "9px 8px", backgroundColor: "transparent", color: "#15803D", borderRadius: 10, fontWeight: 700, fontSize: 13, border: "1.5px solid #BBF7D0", cursor: "pointer", transition: "all 0.18s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#15803D"; e.currentTarget.style.color = "#FFFFFF"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(21,128,61,0.3)"; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#15803D"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                          >
                            <BookOpen size={13} />
                            Curso de Sensibilización
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <p style={{ color: "#6B7280", marginBottom: 20 }}>No se encontraron eventos con los filtros seleccionados.</p>
              <button
                onClick={() => setRequestOpen(true)}
                style={{ backgroundColor: "#1A2E6C", color: "#FFFFFF", padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}
              >
                ¿No hay evento en tu municipio? Escríbenos
              </button>
            </div>
          )}
        </div>
      </section>

      {selectedEvent && (
        <InterestModal
          event={selectedEvent}
          defaultWantsTraining={courseInterest}
          onClose={() => { setSelectedEvent(null); setCourseInterest(false); }}
        />
      )}

      {detailsEvent && (
        <EventDetailsModal
          event={detailsEvent}
          onClose={() => setDetailsEvent(null)}
          onAction={(action) => {
            setDetailsEvent(null);
            if (action === 'interest') setSelectedEvent(detailsEvent);
            if (action === 'flyer') setFlyerEvent(detailsEvent);
            if (action === 'course') {
              setCourseEvent(detailsEvent);
              setCourseInterest(true);
            }
          }}
        />
      )}

      {fullDescEvent && (
        <DescriptionModal
          event={fullDescEvent}
          onClose={() => setFullDescEvent(null)}
        />
      )}

      {flyerEvent && (
        <FlyerModal
          event={flyerEvent}
          onClose={() => setFlyerEvent(null)}
        />
      )}

      {courseEvent && (
        <CourseModal
          event={courseEvent}
          onClose={() => setCourseEvent(null)}
        />
      )}

      {requestOpen && (
        <RequestEventModal
          defaultMunicipio={municipality !== "Todos" ? municipality : ""}
          onClose={() => setRequestOpen(false)}
        />
      )}
    </>
  );
}

function RequestEventModal({ defaultMunicipio, onClose }: { defaultMunicipio: string, onClose: () => void }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    const municipio = (formData.get('municipio') as string) || '';
    const baseDescription = (formData.get('description') as string) || '';
    const description = `${baseDescription}\n\nMunicipio solicitado: ${municipio}`;

    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      company: formData.get('company'),
      email: formData.get('email'),
      description,
      wantsTraining: false,
      eventName: `Solicitud de evento en municipio: ${municipio}`,
      municipio: municipio,
      comments: baseDescription
    };

    try {
      const { error: dbError } = await supabase
        .from('interest_leads')
        .insert([{
          name: data.name,
          phone: data.phone,
          company: data.company,
          email: data.email,
          event_name: data.eventName,
          description: data.description,
          wants_training: data.wantsTraining,
        }]);

      if (dbError) {
        console.error('Error saving lead to Supabase:', dbError);
      }

      try {
        await fetch('/api/interest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } catch (emailErr) {
        console.error('Email API call failed (lead was saved to DB):', emailErr);
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        maxWidth: '500px',
        width: '100%',
        padding: '30px',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
        >
          <X size={20} />
        </button>

        {status === 'success' ? (
          <div className="text-center py-8">
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>✨</div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1A2E6C', marginBottom: '8px' }}>¡Mensaje Enviado!</h3>
            <p style={{ color: '#4B5563', fontSize: '14px', marginBottom: '24px' }}>
              Recibimos tu solicitud. Te avisaremos cuando haya un evento en tu municipio. ¡Gracias!
            </p>
            <button
              onClick={onClose}
              style={{ backgroundColor: '#1A2E6C', color: 'white', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1A2E6C', marginBottom: '8px' }}>¿No hay evento en tu municipio?</h3>
            <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '20px' }}>
              Déjanos tus datos y el municipio en el que te gustaría participar. Te contactaremos cuando tengamos un evento ahí.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Municipio que te interesa *</label>
                <select required name="municipio" defaultValue={defaultMunicipio} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: 'white' }}>
                  <option value="" disabled>Selecciona tu municipio</option>
                  {NUEVO_LEON_MUNICIPALITIES.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Tu Nombre completo *</label>
                <input required name="name" type="text" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB' }} placeholder="Tu nombre" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Empresa / Organización *</label>
                <input required name="company" type="text" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB' }} placeholder="Nombre de tu empresa" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Teléfono *</label>
                <input required name="phone" type="tel" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB' }} placeholder="Tu teléfono o celular" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Correo Electrónico *</label>
                <input required name="email" type="email" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB' }} placeholder="correo@ejemplo.com" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>¿Qué te gustaría hacer? *</label>
                <textarea required name="description" rows={3} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', resize: 'vertical' }} placeholder="Cuéntanos qué tipo de evento o proyecto te interesa..."></textarea>
              </div>

              {status === 'error' && <p style={{ color: '#E8401C', fontSize: '13px' }}>Hubo un error al enviar tu solicitud. Por favor intenta de nuevo.</p>}

              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  backgroundColor: '#E8401C',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  opacity: status === 'loading' ? 0.7 : 1,
                  marginTop: '4px'
                }}
              >
                {status === 'loading' ? 'Enviando...' : 'Enviar Solicitud'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function FlyerModal({ event, onClose }: { event: Event, onClose: () => void }) {
  const url = event.flyer_url || '';
  const isPdf = url.toLowerCase().split('?')[0].endsWith('.pdf') || url.includes('drive.google.com');
  const embedUrl = url.replace('/view', '/preview');

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.6)',
        zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          maxWidth: '760px',
          width: '100%',
          padding: '24px',
          position: 'relative',
          maxHeight: '92vh',
          overflowY: 'auto'
        }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
        >
          <X size={22} />
        </button>

        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1A2E6C', marginBottom: '16px', paddingRight: '32px', lineHeight: 1.3 }}>
          {event.title}
        </h3>

        {isPdf ? (
          <iframe
            src={embedUrl}
            title={`Flyer ${event.title}`}
            style={{ width: '100%', height: '70vh', border: '1px solid #E5E7EB', borderRadius: 8 }}
          />
        ) : (
          <img
            src={url}
            alt={`Flyer ${event.title}`}
            style={{ width: '100%', height: 'auto', borderRadius: 8, display: 'block' }}
          />
        )}

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: '#EBF5FF', color: '#1E3A8A', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: 14 }}
          >
            Abrir en pestaña nueva
          </a>
          <button
            onClick={onClose}
            style={{ backgroundColor: '#F3F4F6', color: '#4B5563', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function CourseModal({ event, onClose }: { event: Event, onClose: () => void }) {
  const url = event.sensibilization_course_url || '';
  const isPdf = url.toLowerCase().split('?')[0].endsWith('.pdf') || url.includes('drive.google.com');
  const embedUrl = url.replace('/view', '/preview');

  return (
    <div onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', maxWidth: '760px', width: '100%', padding: '24px', position: 'relative', maxHeight: '92vh', overflowY: 'auto' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
          <X size={22} />
        </button>
        <p style={{ fontSize: '13px', fontWeight: 700, color: '#15803D', marginBottom: '4px', paddingRight: '32px' }}>Curso de Sensibilización</p>
        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1A2E6C', marginBottom: '16px', paddingRight: '32px', lineHeight: 1.3 }}>
          {event.title}
        </h3>
        {isPdf ? (
          <iframe src={embedUrl} title={`Curso ${event.title}`} style={{ width: '100%', height: '70vh', border: '1px solid #E5E7EB', borderRadius: 8 }} />
        ) : (
          <img src={url} alt={`Curso ${event.title}`} style={{ width: '100%', height: 'auto', borderRadius: 8, display: 'block' }} />
        )}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <a href={url} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#F0FDF4', color: '#15803D', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
            Abrir en pestaña nueva
          </a>
          <button onClick={onClose} style={{ backgroundColor: '#F3F4F6', color: '#4B5563', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function DescriptionModal({ event, onClose }: { event: Event, onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        maxWidth: '500px',
        width: '100%',
        padding: '30px',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
        >
          <X size={20} />
        </button>

        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1A2E6C', marginBottom: '16px', paddingRight: '24px', lineHeight: 1.3 }}>
          {event.title}
        </h3>

        <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>Descripción completa</h4>
        <p style={{ color: '#4B5563', fontSize: '14px', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
          {event.description}
        </p>

        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{ backgroundColor: '#F3F4F6', color: '#4B5563', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E5E7EB'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function InterestModal({ event, defaultWantsTraining = false, onClose }: { event: Event, defaultWantsTraining?: boolean, onClose: () => void }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const eventName = event.title;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      company: formData.get('company'),
      email: formData.get('email'),
      description: formData.get('description'),
      wantsTraining: formData.get('wants_training') === 'on',
      eventName,
      flyerUrl: event.flyer_url || null,
      courseUrl: event.sensibilization_course_url || null,
    };

    try {
      const { error: dbError } = await supabase
        .from('interest_leads')
        .insert([{
          name: data.name,
          phone: data.phone,
          company: data.company,
          email: data.email,
          event_name: data.eventName,
          description: data.description,
          wants_training: data.wantsTraining,
        }]);

      if (dbError) {
        console.error('Error saving lead to Supabase:', dbError);
      }

      try {
        await fetch('/api/interest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } catch (emailErr) {
        console.error('Email API call failed (lead was saved to DB):', emailErr);
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        maxWidth: '480px',
        width: '100%',
        maxHeight: 'min(88vh, 700px)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <button
          onClick={onClose}
          aria-label="Cerrar"
          style={{ position: 'absolute', top: '12px', right: '12px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '50%', cursor: 'pointer', color: '#374151', zIndex: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}
        >
          <X size={20} />
        </button>

        <div style={{ overflowY: 'auto', padding: 'clamp(20px, 5vw, 28px)' }}>
        {status === 'success' ? (
          <div className="text-center py-8">
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>✨</div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1A2E6C', marginBottom: '8px' }}>¡Correo Enviado!</h3>
            <p style={{ color: '#4B5563', fontSize: '14px', marginBottom: '24px' }}>
              Nos pondremos en contacto contigo pronto. ¡Gracias por tu interés en Ezer!
            </p>
            <button
              onClick={onClose}
              style={{ backgroundColor: '#1A2E6C', color: 'white', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1A2E6C', marginBottom: '8px', paddingRight: '36px' }}>Unirse / Me Interesa</h3>
            <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '20px' }}>
              Completa estos datos y la organización de Ezer se pondrá en contacto contigo.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Evento seleccionado</label>
                <input type="text" value={eventName} readOnly disabled style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: '#F3F4F6', color: '#6B7280' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Tu Nombre completo *</label>
                <input required name="name" type="text" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB' }} placeholder="Tu nombre" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Empresa / Organización *</label>
                <input required name="company" type="text" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB' }} placeholder="Nombre de tu empresa" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Teléfono *</label>
                <input required name="phone" type="tel" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB' }} placeholder="Tu teléfono o celular" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Correo Electrónico *</label>
                <input required name="email" type="email" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB' }} placeholder="correo@ejemplo.com" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Descripción / Comentarios *</label>
                <textarea required name="description" rows={3} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', resize: 'vertical' }} placeholder="Cuenta por qué te interesa participar..."></textarea>
              </div>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid #D1D5DB',
                  backgroundColor: '#F9FAFB',
                  color: '#1A2E6C',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <input
                  name="wants_training"
                  type="checkbox"
                  defaultChecked={defaultWantsTraining}
                  style={{ width: '16px', height: '16px', accentColor: '#E8401C', cursor: 'pointer' }}
                />
                ¿Te gustaría recibir un curso de sensibilización?
              </label>

              {status === 'error' && <p style={{ color: '#E8401C', fontSize: '13px' }}>Hubo un error al enviar tu interés. Por favor intenta de nuevo.</p>}

              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  backgroundColor: '#E8401C',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  opacity: status === 'loading' ? 0.7 : 1,
                  marginTop: '4px'
                }}
              >
                {status === 'loading' ? 'Enviando...' : 'Enviar Solicitud'}
              </button>
            </form>
          </>
        )}
        </div>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex-1 min-w-[200px] relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-sm font-semibold text-[#1A2E6C] w-full cursor-pointer hover:bg-gray-100 hover:border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#1A2E6C]/20 transition-all duration-200"
      >
        <option value="Todos">{label}: Todos</option>
        {options.filter(o => o !== "Todos").map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        size={18}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );
}

function EventDetailsModal({ event, onClose, onAction }: { event: Event, onClose: () => void, onAction: (type: string) => void }) {
  return (
    <div
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
      onClick={onClose}
    >
      <div
        style={{ backgroundColor: '#FFFFFF', borderRadius: 20, maxWidth: 680, width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '92vh', boxShadow: '0 32px 64px -12px rgba(0,0,0,0.4)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Image header */}
        <div style={{ position: 'relative', height: 260, flexShrink: 0, overflow: 'hidden' }}>
          {event.image ? (
            <img src={event.image} alt={event.title} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 56, color: '#9CA3AF' }}>📸</span>
            </div>
          )}
          {/* Dark gradient */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)' }} />
          {/* Close */}
          <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(0,0,0,0.45)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
            <X size={18} style={{ color: '#FFFFFF' }} />
          </button>
          {/* Category + annual on image */}
          <div style={{ position: 'absolute', bottom: 16, left: 20, display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ backgroundColor: '#E8401C', color: '#FFFFFF', borderRadius: 20, fontSize: 12, fontWeight: 700, padding: '4px 12px' }}>{event.category}</span>
            {event.isAnnual && <span style={{ backgroundColor: '#FEF3C7', color: '#D97706', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>⭐ Anual</span>}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 28px 0', overflowY: 'auto', flex: 1 }}>
          <h3 style={{ fontSize: 24, fontWeight: 800, color: '#1A2E6C', marginBottom: 8, lineHeight: 1.25 }}>{event.title}</h3>


          <p style={{ color: '#4B5563', fontSize: 14, lineHeight: 1.75, margin: 0, whiteSpace: 'pre-wrap' }}>{event.description}</p>
        </div>

        {/* Actions */}
        <div style={{ padding: '20px 28px 28px', display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
          <button
            onClick={() => onAction('interest')}
            style={{ width: '100%', padding: '14px 20px', background: 'linear-gradient(135deg, #E8401C 0%, #C53010 100%)', color: '#FFFFFF', borderRadius: 12, fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', transition: 'transform 0.18s ease, box-shadow 0.18s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 24px rgba(232,64,28,0.45)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <Heart size={16} />
            Me interesa
          </button>

          {(event.flyer_url || event.sensibilization_course_url) && (
            <div style={{ display: 'flex', gap: 10 }}>
              {event.flyer_url && (
                <button
                  onClick={() => onAction('flyer')}
                  style={{ flex: 1, padding: '13px 16px', backgroundColor: 'transparent', color: '#1E3A8A', borderRadius: 12, fontWeight: 700, fontSize: 14, border: '1.5px solid #BFDBFE', cursor: 'pointer', transition: 'all 0.18s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1E3A8A'; e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(30,58,138,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#1E3A8A'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <FileText size={15} />
                  Ver Flyer
                </button>
              )}
              {event.sensibilization_course_url && (
                <button
                  onClick={() => onAction('course')}
                  style={{ flex: 1, padding: '13px 16px', backgroundColor: 'transparent', color: '#15803D', borderRadius: 12, fontWeight: 700, fontSize: 14, border: '1.5px solid #BBF7D0', cursor: 'pointer', transition: 'all 0.18s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#15803D'; e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(21,128,61,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#15803D'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <BookOpen size={15} />
                  Curso de sensibilización
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

