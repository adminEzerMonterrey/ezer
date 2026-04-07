import { useState } from "react";
import { Calendar, Building2, Users, ArrowRight, Filter, ChevronDown } from "lucide-react";

const EVENT_IMG_1 = "https://images.unsplash.com/photo-1758599667717-27c61bcdd14b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbnZpcm9ubWVudGFsJTIwY2xlYW51cCUyMHZvbHVudGVlcnMlMjBuYXR1cmV8ZW58MXx8fHwxNzc1NTA1NDI0fDA&ixlib=rb-4.1.0&q=80&w=400";
const EVENT_IMG_2 = "https://images.unsplash.com/photo-1763310225230-6e15b125935a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGVkdWNhdGlvbiUyMHdvcmtzaG9wJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc3NTUwNTQyNXww&ixlib=rb-4.1.0&q=80&w=400";
const EVENT_IMG_3 = "https://images.unsplash.com/photo-1593113630400-ea4288922497?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwYmFuayUyMGRvbmF0aW9uJTIwY2hhcml0eSUyMHBlb3BsZXxlbnwxfHx8fDE3NzU1MDU0MjV8MA&ixlib=rb-4.1.0&q=80&w=400";
const EVENT_IMG_4 = "https://images.unsplash.com/photo-1656311879551-562fe942a8ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBzb2NpYWwlMjByZXNwb25zaWJpbGl0eSUyMHRlYW0lMjBldmVudHxlbnwxfHx8fDE3NzU1MDU0MjV8MA&ixlib=rb-4.1.0&q=80&w=400";
const EVENT_IMG_5 = "https://images.unsplash.com/photo-1694286080661-f44117e019ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub25wcm9maXQlMjBjb21tdW5pdHklMjBnYXRoZXJpbmclMjBwZW9wbGUlMjBzbWlsaW5nfGVufDF8fHx8MTc3NTUwNTQyNXww&ixlib=rb-4.1.0&q=80&w=400";
const EVENT_IMG_6 = "https://images.unsplash.com/photo-1774334136160-1825daf3ce16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwcGVvcGxlJTIwaGFuZHMlMjB0b2dldGhlciUyMGNvbW11bml0eSUyMHVuaXR5fGVufDF8fHx8MTc3NTUwNTQzM3ww&ixlib=rb-4.1.0&q=80&w=400";

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
  spots: number;
}

const ALL_EVENTS: Event[] = [
  {
    id: 1,
    title: "Jornada de Limpieza Costera",
    company: "GreenEnergy S.A.",
    date: "15 Abr 2026",
    month: "ABR",
    day: "15",
    category: "Medio Ambiente",
    audience: "Familias",
    description: "Únete a nosotros para limpiar 5km de playa y contribuir a la preservación de ecosistemas marinos.",
    image: EVENT_IMG_1,
    spots: 40,
  },
  {
    id: 2,
    title: "Taller de Programación Infantil",
    company: "InnovateTech Corp.",
    date: "22 Abr 2026",
    month: "ABR",
    day: "22",
    category: "Educación",
    audience: "Niños 8–12",
    description: "Voluntarios enseñan conceptos básicos de programación a niños de comunidades vulnerables.",
    image: EVENT_IMG_2,
    spots: 25,
  },
  {
    id: 3,
    title: "Banco de Alimentos Comunitario",
    company: "NutriCorp Foods",
    date: "10 May 2026",
    month: "MAY",
    day: "10",
    category: "Alimentación",
    audience: "Todos",
    description: "Clasificación y distribución de alimentos para más de 500 familias en situación vulnerable.",
    image: EVENT_IMG_3,
    spots: 60,
  },
  {
    id: 4,
    title: "Reforestación Urbana",
    company: "EcoBuilders S.A.",
    date: "05 Jun 2026",
    month: "JUN",
    day: "05",
    category: "Medio Ambiente",
    audience: "Adultos",
    description: "Plantación de 500 árboles nativos en parques y avenidas del área metropolitana.",
    image: EVENT_IMG_4,
    spots: 35,
  },
  {
    id: 5,
    title: "Mentorías Profesionales",
    company: "ConsultaPro Group",
    date: "18 Jun 2026",
    month: "JUN",
    day: "18",
    category: "Educación",
    audience: "Jóvenes",
    description: "Profesionales senior brindan orientación de carrera a jóvenes de primer empleo.",
    image: EVENT_IMG_5,
    spots: 20,
  },
  {
    id: 6,
    title: "Brigada Médica Rural",
    company: "MedGroup Internacional",
    date: "08 Jul 2026",
    month: "JUL",
    day: "08",
    category: "Salud",
    audience: "Adultos mayores",
    description: "Atención médica gratuita a comunidades rurales: consultas, vacunación y chequeos preventivos.",
    image: EVENT_IMG_6,
    spots: 30,
  },
];

const CATEGORIES = ["Todos", "Medio Ambiente", "Educación", "Alimentación", "Salud"];
const DATES = ["Todos", "Abril 2026", "Mayo 2026", "Junio 2026", "Julio 2026"];
const COMPANIES = ["Todas", "GreenEnergy S.A.", "InnovateTech Corp.", "NutriCorp Foods", "EcoBuilders S.A.", "ConsultaPro Group", "MedGroup Internacional"];

export function EventCatalog() {
  const [category, setCategory] = useState("Todos");
  const [dateFilter, setDateFilter] = useState("Todos");
  const [company, setCompany] = useState("Todas");

  const filtered = ALL_EVENTS.filter((e) => {
    const catOk = category === "Todos" || e.category === category;
    const compOk = company === "Todas" || e.company === company;
    const dateOk =
      dateFilter === "Todos" ||
      (dateFilter === "Abril 2026" && e.month === "ABR") ||
      (dateFilter === "Mayo 2026" && e.month === "MAY") ||
      (dateFilter === "Junio 2026" && e.month === "JUN") ||
      (dateFilter === "Julio 2026" && e.month === "JUL");
    return catOk && compOk && dateOk;
  });

  return (
    <section
      id="eventos"
      className="py-16 md:py-24"
      style={{ backgroundColor: "#FFFFFF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span
            style={{ color: "#E8401C", fontWeight: 700, fontSize: 13, letterSpacing: "0.12em" }}
            className="uppercase"
          >
            ✦ Oportunidades de impacto
          </span>
          <h2
            style={{ color: "#1A2E6C", fontWeight: 800, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", lineHeight: 1.2, marginTop: 8 }}
          >
            Eventos disponibles
          </h2>
          <p style={{ color: "#6B7280", marginTop: 12, maxWidth: 520 }} className="mx-auto text-base">
            Explora las oportunidades de voluntariado y elige el que más impacte en tu comunidad.
          </p>
        </div>

        {/* Filter Bar */}
        <div
          style={{ backgroundColor: "#F5F5F5", borderRadius: 12, border: "1px solid #E5E7EB" }}
          className="flex flex-col sm:flex-row gap-3 p-4 mb-10 flex-wrap"
        >
          <div className="flex items-center gap-2 flex-shrink-0">
            <Filter size={16} style={{ color: "#1A2E6C" }} />
            <span style={{ color: "#1A2E6C", fontWeight: 700, fontSize: 14 }}>Filtrar:</span>
          </div>
          <FilterSelect label="Categoría" value={category} options={CATEGORIES} onChange={setCategory} />
          <FilterSelect label="Fecha" value={dateFilter} options={DATES} onChange={setDateFilter} />
          <FilterSelect label="Empresa" value={company} options={COMPANIES} onChange={setCompany} />
          {(category !== "Todos" || dateFilter !== "Todos" || company !== "Todas") && (
            <button
              onClick={() => { setCategory("Todos"); setDateFilter("Todos"); setCompany("Todas"); }}
              style={{ color: "#E8401C", fontWeight: 600, fontSize: 13 }}
              className="ml-auto hover:underline"
            >
              Limpiar filtros ✕
            </button>
          )}
        </div>

        {/* Results count */}
        <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 24 }}>
          Mostrando <strong style={{ color: "#1A2E6C" }}>{filtered.length}</strong> evento{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Cards Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
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
            {label}: {opt}
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

function EventCard({ event }: { event: Event }) {
  return (
    <div
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
      {/* Top accent bar */}
      <div style={{ height: 4, backgroundColor: "#E8401C", flexShrink: 0 }} />

      {/* Image */}
      <div style={{ position: "relative", height: 180, overflow: "hidden", flexShrink: 0 }}>
        <img
          src={event.image}
          alt={event.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
          className="group-hover:scale-105"
        />
        {/* Date badge */}
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
          <div style={{ color: "#1A2E6C", fontWeight: 800, fontSize: 20, lineHeight: 1 }}>{event.day}</div>
          <div style={{ color: "#1A2E6C", fontWeight: 700, fontSize: 10, letterSpacing: "0.1em" }}>{event.month}</div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Audience tag */}
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

        {/* Title */}
        <h3
          style={{ color: "#1A2E6C", fontWeight: 800, fontSize: 16, lineHeight: 1.3, marginBottom: 6 }}
        >
          {event.title}
        </h3>

        {/* Company */}
        <div className="flex items-center gap-1.5 mb-3">
          <Building2 size={13} style={{ color: "#9CA3AF", flexShrink: 0 }} />
          <span style={{ color: "#6B7280", fontSize: 13, fontWeight: 500 }}>{event.company}</span>
        </div>

        {/* Description */}
        <p
          style={{ color: "#4B5563", fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}
          className="line-clamp-2 flex-1"
        >
          {event.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: "1px solid #F3F4F6" }}>
          <div className="flex items-center gap-1.5">
            <Users size={13} style={{ color: "#9CA3AF" }} />
            <span style={{ color: "#6B7280", fontSize: 12 }}>{event.spots} lugares</span>
          </div>
          <button
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
  );
}