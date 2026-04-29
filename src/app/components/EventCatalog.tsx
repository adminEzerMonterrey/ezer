import { useEffect, useState } from "react";
import { Building2, Users, ArrowRight, Filter, ChevronDown, X } from "lucide-react";
import { supabase } from "../../supabaseClient";
import { EVENT_CATEGORY_FILTERS } from "../eventCategories";
import { formatSpotsRange } from "../eventSpots";

interface Event {
  id: number;
  title: string;
  company: string;
  date: string;
  month: string;
  day: string;
  category: string;
  audience: string;
  description: string;
  image: string;
  spotsMin: number;
  spotsMax: number;
  cost: string | number;
  isAnnual: boolean;
}

const DATE_FILTERS = ["Todos", "Próximos 3 meses", "Próximos 6 meses", "Permanente"];

const parseLocalDate = (dateValue: string | null | undefined) => {
  if (!dateValue) return null;

  const match = dateValue.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [, year, month, day] = match;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const parsedDate = new Date(dateValue);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const getCurrentMonthRange = (monthsAhead: number) => {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  const end = new Date(today.getFullYear(), today.getMonth() + monthsAhead, 1);

  return { start, end };
};

const isPermanentEvent = (event: Event) => {
  const normalizedDate = event.date?.toString().trim().toLowerCase();
  return !normalizedDate || normalizedDate.includes("permanente");
};

const isEventInNextMonths = (event: Event, monthsAhead: number) => {
  const eventDate = parseLocalDate(event.date);
  if (!eventDate) return false;

  const eventMonth = new Date(eventDate.getFullYear(), eventDate.getMonth(), 1);
  const { start, end } = getCurrentMonthRange(monthsAhead);

  return eventMonth >= start && eventMonth < end;
};

const formatCost = (costValue: string | number | null | undefined) => {
  if (costValue == null || costValue === '') return "Gratuito";
  const strCost = costValue.toString();

  if (strCost.toLowerCase().includes('grat')) {
    return strCost;
  }

  const cleanStr = strCost.replace(/\$/g, '').replace(/,/g, '').trim();
  const numericValue = parseFloat(cleanStr);

  if (!isNaN(numericValue)) {
    return `$${numericValue.toLocaleString('en-US')}`;
  }

  return strCost.includes('$') ? strCost : `$${strCost}`;
};

export function EventCatalog() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Todos");
  const [dateFilter, setDateFilter] = useState("Todos");
  const [onlyAnnual, setOnlyAnnual] = useState(false);

  const [categories, setCategories] = useState<string[]>(EVENT_CATEGORY_FILTERS);
  const [dates] = useState<string[]>(DATE_FILTERS);
  const [selectedEventName, setSelectedEventName] = useState<string | null>(null);

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
          const spotsMin = e.spots_min ?? e.spots ?? 0;
          const spotsMax = e.spots_max ?? e.spots ?? 0;

          return {
            id: e.id,
            title: e.name,
            company: e.company,
            date: e.date,
            month: dateObj.toLocaleString('es-MX', { month: 'short' }).toUpperCase(),
            day: dateObj.getDate().toString(),
            category: e.objective,
            audience: e.target_audience,
            description: e.description,
            image: e.image_url,
            spotsMin,
            spotsMax,
            cost: e.cost || "Gratuito",
            isAnnual: !!e.is_annual
          };
        });

        setEvents(formattedEvents);

        const dbCats = Array.from(new Set(formattedEvents.map(e => e.category)));
        const allCats = Array.from(new Set([...EVENT_CATEGORY_FILTERS, ...dbCats]));
        setCategories(allCats);
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

    const dateOk =
      dateFilter === "Todos" ||
      (dateFilter === "Próximos 3 meses" && isEventInNextMonths(e, 3)) ||
      (dateFilter === "Próximos 6 meses" && isEventInNextMonths(e, 6)) ||
      (dateFilter === "Permanente" && isPermanentEvent(e));

    const annualOk = !onlyAnnual || e.isAnnual;

    return catOk && dateOk && annualOk;
  });

  return (
    <>
      <section
        id="eventos"
        className="pt-8 pb-12 md:pt-10 md:pb-16"
        style={{ backgroundColor: "#FFFFFF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2
              style={{ color: "#1A2E6C", fontWeight: 800, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", lineHeight: 1.2 }}
            >
              ¿Eres empresa/grupo y quieres hacer voluntariado corporativo/grupal?
            </h2>
            <p style={{ color: "#6B7280", marginTop: 12, maxWidth: 520 }} className="mx-auto text-base">
              Explora las oportunidades de voluntariado y elige el que más impacte en tu comunidad.
            </p>
          </div>

          <div
            style={{ backgroundColor: "#F5F5F5", borderRadius: 12, border: "1px solid #E5E7EB" }}
            className="flex flex-col sm:flex-row gap-3 p-4 mb-8 flex-wrap"
          >
            <div className="flex items-center gap-2 flex-shrink-0">
              <Filter size={16} style={{ color: "#1A2E6C" }} />
              <span style={{ color: "#1A2E6C", fontWeight: 700, fontSize: 14 }}>Filtrar:</span>
            </div>
            <FilterSelect label="Categoría" value={category} options={categories} onChange={setCategory} />
            <FilterSelect label="Cierre de convocatoria" value={dateFilter} options={dates} onChange={setDateFilter} />
            
            <label
              style={{
                display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
                padding: "8px 16px", backgroundColor: "#FFFFFF", borderRadius: 8, border: "1.5px solid #E5E7EB",
                alignSelf: "flex-end", height: "42px"
              }}
            >
              <input
                type="checkbox"
                checked={onlyAnnual}
                onChange={(e) => setOnlyAnnual(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: "#E8401C", cursor: "pointer" }}
              />
              <span style={{ fontSize: 14, fontWeight: 600, color: "#4B5563" }}>Eventos Anuales</span>
            </label>

            {(category !== "Todos" || dateFilter !== "Todos" || onlyAnnual) && (
              <button
                onClick={() => { setCategory("Todos"); setDateFilter("Todos"); setOnlyAnnual(false); }}
                style={{ color: "#E8401C", fontWeight: 600, fontSize: 13, alignSelf: "flex-end", marginBottom: "12px" }}
                className="ml-auto hover:underline cursor-pointer"
              >
                Limpiar filtros ✕
              </button>
            )}
          </div>

          <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 24 }}>
            Mostrando <strong style={{ color: "#1A2E6C" }}>{filtered.length}</strong> evento{filtered.length !== 1 ? "s" : ""}
          </p>

          {loading ? (
            <div className="text-center py-16" style={{ color: "#6B7280" }}>Cargando eventos...</div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((event) => (
                <div
                  key={event.id}
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 12,
                    border: "1px solid #E5E7EB",
                    overflow: "hidden",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  className="group hover:-translate-y-1 hover:shadow-xl"
                >
                  <div style={{ height: 4, backgroundColor: "#E8401C", flexShrink: 0 }} />

                  <div style={{ position: "relative", height: 180, overflow: "hidden", flexShrink: 0 }}>
                    <img
                      src={event.image}
                      alt={event.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                      className="group-hover:scale-105"
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        backgroundColor: "#F5C200",
                        borderRadius: 8,
                        padding: "6px 10px",
                        textAlign: "center",
                        minWidth: 52,
                      }}
                    >
                      <div style={{ color: "#1A2E6C", fontWeight: 800, fontSize: 10, marginBottom: 2 }}>CIERRE</div>
                      <div style={{ color: "#1A2E6C", fontWeight: 800, fontSize: 20, lineHeight: 1 }}>{event.day}</div>
                      <div style={{ color: "#1A2E6C", fontWeight: 700, fontSize: 10, letterSpacing: "0.1em" }}>{event.month}</div>
                    </div>
                  </div>

                  <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        style={{
                          backgroundColor: "#EEF2FF",
                          color: "#1A2E6C",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "3px 10px",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {event.audience}
                      </span>
                      <span
                        style={{
                          backgroundColor: "#FFF7ED",
                          color: "#E8401C",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "3px 10px",
                        }}
                      >
                        {event.category}
                      </span>
                    </div>

                    <h3 style={{ color: "#1A2E6C", fontWeight: 800, fontSize: 16, lineHeight: 1.3, marginBottom: 6 }}>
                      {event.title}
                      {event.isAnnual && (
                        <span style={{ marginLeft: 8, backgroundColor: "#FEF3C7", color: "#D97706", fontSize: 11, padding: "2px 6px", borderRadius: 12, verticalAlign: "middle", display: "inline-block" }}>
                          ⭐ Anual
                        </span>
                      )}
                    </h3>

                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Building2 size={13} style={{ color: "#9CA3AF", flexShrink: 0 }} />
                        <span style={{ color: "#6B7280", fontSize: 13, fontWeight: 500 }}>{event.company}</span>
                      </div>
                      <span style={{ color: "#16A34A", fontSize: 12, fontWeight: 700, backgroundColor: "#DCFCE7", padding: "2px 8px", borderRadius: "12px" }}>
                        Costo Aproximado: {formatCost(event.cost)}
                      </span>
                    </div>

                    <p style={{ color: "#4B5563", fontSize: 13, lineHeight: 1.6, marginBottom: 12 }} className="line-clamp-2 flex-1">
                      {event.description}
                    </p>

                    <div style={{ backgroundColor: "#F9FAFB", padding: "8px 12px", borderRadius: 8, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14 }}>📅</span>
                      <span style={{ color: "#374151", fontSize: 12, fontWeight: 600 }}>
                        Cierre de convocatoria: <span style={{ color: "#E8401C", fontWeight: 800 }}>{event.day} {event.month}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: "1px solid #F3F4F6" }}>
                      <div className="flex items-center gap-1.5">
                        <Users size={13} style={{ color: "#9CA3AF" }} />
                        <span style={{ color: "#6B7280", fontSize: 12 }}>{formatSpotsRange(event.spotsMin, event.spotsMax)}</span>
                      </div>
                      <button
                        onClick={() => setSelectedEventName(event.title)}
                        style={{
                          color: "#E8401C",
                          border: "1.5px solid #E8401C",
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 700,
                          padding: "7px 14px",
                          backgroundColor: "transparent",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#E8401C";
                          (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                          (e.currentTarget as HTMLButtonElement).style.color = "#E8401C";
                        }}
                      >
                        Me interesa <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <p style={{ color: "#6B7280" }}>No se encontraron eventos con los filtros seleccionados.</p>
            </div>
          )}
        </div>
      </section>

      {selectedEventName && (
        <InterestModal
          eventName={selectedEventName}
          onClose={() => setSelectedEventName(null)}
        />
      )}
    </>
  );
}

function InterestModal({ eventName, onClose }: { eventName: string, onClose: () => void }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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
      eventName
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
        position: 'relative'
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
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1A2E6C', marginBottom: '8px' }}>Unirse / Me Interesa</h3>
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
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Teléfono *</label>
                <input required name="phone" type="tel" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB' }} placeholder="Tu teléfono o celular" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Empresa / Organización (Opcional)</label>
                <input name="company" type="text" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB' }} placeholder="Representas a alguien?" />
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
                  style={{ width: '16px', height: '16px', accentColor: '#E8401C', cursor: 'pointer' }}
                />
                ¿Quieres capacitación?
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
    <div className="relative flex-1 min-w-[160px]">
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6B7280", marginBottom: 4, paddingLeft: 2, letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          appearance: "none",
          backgroundColor: "#FFFFFF",
          border: "1.5px solid #E5E7EB",
          borderRadius: 8,
          color: "#2C2C2A",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 500,
          fontSize: 14,
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 12,
          paddingRight: 36,
          width: "100%",
          cursor: "pointer",
        }}
        className="focus:outline-none focus:ring-2"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        size={15}
        style={{ color: "#1A2E6C", position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
      />
    </div>
  );
}
