import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Search,
  Users,
  HeartHandshake,
  MapPin,
  CalendarDays,
  Trophy,
  Quote,
  Lightbulb,
  ArrowLeft,
} from "lucide-react";

// ⚠️ Datos de ejemplo para mostrar la sección. Reemplazar con los distritos,
// clubes y eventos reales cuando EZER los tenga capturados.

type Evento = {
  nombre: string;
  fecha: string;
  asociacion: string;
  beneficiarios: number;
  voluntarios: number;
  impacto: string;
  fotos: string[];
};

type Club = {
  id: string;
  nombre: string;
  ciudad: string;
  socios: number;
  eventos: Evento[];
};

type Distrito = {
  id: string;
  nombre: string;
  region: string;
  clubes: Club[];
};

const foto = (n: number) => `/curso-${((n - 1) % 9) + 1}.jpg`;

const DISTRITOS: Distrito[] = [
  {
    id: "4130",
    nombre: "Distrito 4130",
    region: "Nuevo León y Tamaulipas",
    clubes: [
      {
        id: "mty-centro",
        nombre: "Club Rotario Monterrey Centro",
        ciudad: "Monterrey, N.L.",
        socios: 42,
        eventos: [
          {
            nombre: "Posada navideña con adultos mayores",
            fecha: "Dic 2025",
            asociacion: "Casa Hogar San José",
            beneficiarios: 65,
            voluntarios: 28,
            impacto: "Convivencia, regalos y cena para todas las personas residentes.",
            fotos: [foto(1), foto(2), foto(3)],
          },
          {
            nombre: "Rehabilitación de comedor comunitario",
            fecha: "Mar 2026",
            asociacion: "Comedor Nueva Esperanza",
            beneficiarios: 120,
            voluntarios: 35,
            impacto: "Pintura, mobiliario nuevo y cocina equipada para servir 120 comidas diarias.",
            fotos: [foto(4), foto(5)],
          },
        ],
      },
      {
        id: "spgg",
        nombre: "Club Rotario San Pedro Garza García",
        ciudad: "San Pedro, N.L.",
        socios: 55,
        eventos: [
          {
            nombre: "Feria de salud visual",
            fecha: "May 2026",
            asociacion: "Fundación Ver Bien",
            beneficiarios: 210,
            voluntarios: 22,
            impacto: "Exámenes de la vista y 140 lentes entregados a niñas y niños.",
            fotos: [foto(6), foto(7), foto(8)],
          },
        ],
      },
      {
        id: "apodaca",
        nombre: "Club Rotario Apodaca",
        ciudad: "Apodaca, N.L.",
        socios: 24,
        eventos: [
          {
            nombre: "Huerto escolar",
            fecha: "Ago 2026",
            asociacion: "Escuela Especial Amanecer",
            beneficiarios: 80,
            voluntarios: 18,
            impacto: "Huerto de 12 camas de cultivo y taller de nutrición para familias.",
            fotos: [foto(9), foto(1)],
          },
        ],
      },
    ],
  },
  {
    id: "4110",
    nombre: "Distrito 4110",
    region: "Chihuahua y Coahuila",
    clubes: [
      {
        id: "saltillo",
        nombre: "Club Rotario Saltillo",
        ciudad: "Saltillo, Coah.",
        socios: 38,
        eventos: [
          {
            nombre: "Colecta de invierno",
            fecha: "Ene 2026",
            asociacion: "Albergue Manos Abiertas",
            beneficiarios: 150,
            voluntarios: 30,
            impacto: "300 cobijas y chamarras repartidas en temporada de frío.",
            fotos: [foto(2), foto(4)],
          },
        ],
      },
      {
        id: "torreon",
        nombre: "Club Rotario Torreón Oriente",
        ciudad: "Torreón, Coah.",
        socios: 29,
        eventos: [
          {
            nombre: "Taller de oficios para mujeres",
            fecha: "Jun 2026",
            asociacion: "Mujeres que Transforman A.C.",
            beneficiarios: 45,
            voluntarios: 12,
            impacto: "45 mujeres certificadas en repostería y costura; 10 iniciaron su negocio.",
            fotos: [foto(5), foto(6)],
          },
        ],
      },
    ],
  },
  {
    id: "4140",
    nombre: "Distrito 4140",
    region: "Centro de México",
    clubes: [
      {
        id: "queretaro",
        nombre: "Club Rotario Querétaro",
        ciudad: "Querétaro, Qro.",
        socios: 47,
        eventos: [
          {
            nombre: "Día deportivo incluyente",
            fecha: "Abr 2026",
            asociacion: "Deporte Sin Límites A.C.",
            beneficiarios: 95,
            voluntarios: 40,
            impacto: "Jornada de deporte adaptado con 95 jóvenes con discapacidad.",
            fotos: [foto(7), foto(3), foto(9)],
          },
        ],
      },
    ],
  },
];

const BANCO_PROYECTOS = [
  {
    titulo: "Rampas y accesibilidad",
    categoria: "Infraestructura",
    descripcion: "Construir rampas, barandales y baños accesibles en una casa hogar para personas con discapacidad motriz.",
    necesidad: "Material de construcción y 15 voluntarios por 2 sábados",
    color: "#1A2E6C",
  },
  {
    titulo: "Paneles solares para albergue",
    categoria: "Medio ambiente",
    descripcion: "Instalar un sistema solar que reduzca el gasto de luz de un albergue y libere recursos para alimentos.",
    necesidad: "Donativo para equipo e instaladores certificados",
    color: "#F5C200",
  },
  {
    titulo: "Becas de transporte escolar",
    categoria: "Educación",
    descripcion: "Cubrir el transporte de 30 estudiantes de zonas rurales que hoy abandonan la escuela por la distancia.",
    necesidad: "Patrocinio anual por estudiante",
    color: "#E8401C",
  },
  {
    titulo: "Consultorio dental móvil",
    categoria: "Salud",
    descripcion: "Jornadas mensuales de limpieza y revisión dental para niñas y niños de casas hogar.",
    necesidad: "Dentistas voluntarios y material de curación",
    color: "#1A2E6C",
  },
  {
    titulo: "Alfabetización digital de adultos mayores",
    categoria: "Tecnología",
    descripcion: "Enseñar uso de celular, videollamadas y trámites en línea a adultos mayores en estancias de día.",
    necesidad: "Tabletas en donación y voluntarios 1 vez por semana",
    color: "#F5C200",
  },
  {
    titulo: "Pozo y filtro de agua potable",
    categoria: "Agua y saneamiento",
    descripcion: "Garantizar agua limpia en una comunidad que hoy depende de pipas para su escuela y centro comunitario.",
    necesidad: "Estudio técnico, perforación y filtro",
    color: "#E8401C",
  },
];

const TESTIMONIOS = [
  {
    texto: "EZER nos conectó con una asociación que no conocíamos y en un solo día cambiamos el comedor de 120 personas.",
    autor: "Presidente, Club Rotario Monterrey Centro",
  },
  {
    texto: "Los niños volvieron a ver el pizarrón. Eso no tiene precio para nuestra fundación.",
    autor: "Directora, Fundación Ver Bien",
  },
  {
    texto: "Por fin podemos mostrar a nuestros socios, con números y fotos, lo que logramos juntos.",
    autor: "Gobernador de Distrito 4130",
  },
];

function totales(clubes: Club[]) {
  const eventos = clubes.flatMap((c) => c.eventos);
  return {
    eventos: eventos.length,
    beneficiarios: eventos.reduce((s, e) => s + e.beneficiarios, 0),
    voluntarios: eventos.reduce((s, e) => s + e.voluntarios, 0),
  };
}

function ClubDetalle({ club, distrito, onBack }: { club: Club; distrito: Distrito; onBack: () => void }) {
  const t = totales([club]);
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-8">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-sm font-semibold text-[#1A2E6C] hover:text-[#E8401C] mb-4">
        <ArrowLeft size={16} /> Volver a {distrito.nombre}
      </button>
      <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1A2E6C]">{club.nombre}</h3>
      <p className="text-gray-500 flex items-center gap-1 mt-1">
        <MapPin size={16} /> {club.ciudad} · {club.socios} socios · {distrito.nombre}
      </p>

      <div className="grid grid-cols-3 gap-3 my-6">
        {[
          { v: t.eventos, l: "Eventos" },
          { v: t.beneficiarios, l: "Beneficiarios" },
          { v: t.voluntarios, l: "Voluntarios" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl bg-[#EEF2FF] p-3 text-center">
            <div className="text-2xl font-extrabold text-[#1A2E6C]">{s.v.toLocaleString("es-MX")}</div>
            <div className="text-xs sm:text-sm text-gray-600">{s.l}</div>
          </div>
        ))}
      </div>

      <h4 className="font-bold text-[#1A2E6C] mb-3">Eventos realizados con EZER</h4>
      <div className="space-y-5">
        {club.eventos.map((e) => (
          <article key={e.nombre} className="rounded-xl border border-gray-200 p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h5 className="font-bold text-lg text-gray-900">{e.nombre}</h5>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <CalendarDays size={14} /> {e.fecha}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Con <strong>{e.asociacion}</strong> · {e.beneficiarios} beneficiarios · {e.voluntarios} voluntarios
            </p>
            <p className="text-sm text-gray-800 mt-2">
              <span className="font-semibold text-[#E8401C]">Impacto:</span> {e.impacto}
            </p>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {e.fotos.map((src, i) => (
                <img key={i} src={src} alt={`${e.nombre} foto ${i + 1}`} loading="lazy" className="w-full aspect-[4/3] object-cover rounded-lg" />
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function RotariosPage() {
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState<string | null>(DISTRITOS[0].id);
  const [seleccion, setSeleccion] = useState<{ d: string; c: string } | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const global = useMemo(() => totales(DISTRITOS.flatMap((d) => d.clubes)), []);
  const totalClubes = DISTRITOS.reduce((s, d) => s + d.clubes.length, 0);

  const q = busqueda.trim().toLowerCase();
  const distritosFiltrados = useMemo(
    () =>
      DISTRITOS.map((d) => ({
        ...d,
        clubes: q
          ? d.clubes.filter((c) => `${c.nombre} ${c.ciudad} ${d.nombre}`.toLowerCase().includes(q))
          : d.clubes,
      })).filter((d) => d.clubes.length > 0),
    [q],
  );

  const sel = seleccion && DISTRITOS.find((d) => d.id === seleccion.d);
  const selClub = sel && sel.clubes.find((c) => c.id === seleccion!.c);

  const abrirClub = (d: string, c: string) => {
    setSeleccion({ d, c });
    document.getElementById("clubes")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="bg-white">
      {/* HERO */}
      <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#F8FAFC] to-[#EEF2FF] overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1A2E6C] mb-6 leading-tight tracking-tight">
            Rotarios que <span className="text-[#E8401C]">transforman</span> comunidades
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
            Encuentra el impacto de cada distrito y club rotario que ha trabajado con EZER, y descubre en el Banco de Proyectos
            las causas que hoy esperan a un club que las haga realidad.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="#clubes" className="px-7 py-3 bg-[#1A2E6C] text-white rounded-xl font-bold hover:brightness-110">
              Buscar mi club
            </a>
            <a href="#banco" className="px-7 py-3 bg-[#F5C200] text-[#1A2E6C] rounded-xl font-bold hover:brightness-105">
              Banco de proyectos
            </a>
          </div>
        </div>
      </section>

      {/* IMPACTO */}
      <section id="impacto" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A2E6C] text-center mb-10">Nuestro impacto juntos</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Users, titulo: "Participación", valor: global.voluntarios, texto: "rotarios voluntarios" },
              { icon: MapPin, titulo: "Alcance", valor: totalClubes, texto: `clubes en ${DISTRITOS.length} distritos` },
              { icon: Trophy, titulo: "Resultados", valor: global.eventos, texto: "eventos realizados" },
              { icon: HeartHandshake, titulo: "Impacto", valor: global.beneficiarios, texto: "personas beneficiadas" },
            ].map(({ icon: Icon, titulo, valor, texto }) => (
              <div key={titulo} className="rounded-2xl border border-gray-200 p-5 text-center shadow-sm">
                <Icon className="mx-auto text-[#E8401C] mb-2" size={28} />
                <div className="text-xs font-bold uppercase tracking-wide text-gray-500">{titulo}</div>
                <div className="text-3xl md:text-4xl font-extrabold text-[#1A2E6C] my-1">{valor.toLocaleString("es-MX")}</div>
                <div className="text-sm text-gray-600">{texto}</div>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-extrabold text-[#1A2E6C] text-center mt-14 mb-6">Testimonios</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {TESTIMONIOS.map((t) => (
              <figure key={t.autor} className="rounded-2xl bg-[#F8FAFC] p-6 border border-gray-100">
                <Quote className="text-[#F5C200] mb-2" size={28} />
                <blockquote className="text-gray-800 italic">"{t.texto}"</blockquote>
                <figcaption className="text-sm font-semibold text-[#1A2E6C] mt-3">— {t.autor}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* DISTRITOS Y CLUBES */}
      <section id="clubes" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A2E6C] text-center mb-3">Distritos y clubes</h2>
          <p className="text-center text-gray-600 mb-8">Abre un distrito para ver sus clubes y los eventos que han realizado con EZER.</p>

          {selClub && sel ? (
            <ClubDetalle club={selClub} distrito={sel} onBack={() => setSeleccion(null)} />
          ) : (
            <>
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Busca tu club, ciudad o distrito…"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1A2E6C]"
                />
              </div>

              {distritosFiltrados.length === 0 && (
                <p className="text-center text-gray-500 py-8">No encontramos clubes con "{busqueda}".</p>
              )}

              <div className="space-y-3">
                {distritosFiltrados.map((d) => {
                  const open = q !== "" || abierto === d.id;
                  const t = totales(d.clubes);
                  return (
                    <div key={d.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                      <button
                        onClick={() => setAbierto(open && q === "" ? null : d.id)}
                        className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-gray-50"
                        aria-expanded={open}
                      >
                        <div>
                          <div className="text-xl font-extrabold text-[#1A2E6C]">{d.nombre}</div>
                          <div className="text-sm text-gray-500">
                            {d.region} · {d.clubes.length} clubes · {t.beneficiarios.toLocaleString("es-MX")} beneficiarios
                          </div>
                        </div>
                        <ChevronDown className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
                      </button>
                      {open && (
                        <div className="border-t border-gray-100 divide-y divide-gray-100">
                          {d.clubes.map((c) => {
                            const tc = totales([c]);
                            return (
                              <div key={c.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:px-5">
                                <div>
                                  <div className="font-bold text-gray-900">{c.nombre}</div>
                                  <div className="text-sm text-gray-500">
                                    {c.ciudad} · {tc.eventos} eventos · {tc.beneficiarios} beneficiarios
                                  </div>
                                </div>
                                <button
                                  onClick={() => abrirClub(d.id, c.id)}
                                  className="inline-flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-[#1A2E6C] text-white text-sm font-semibold hover:brightness-110"
                                >
                                  Ver eventos e impacto <ChevronRight size={16} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* BANCO DE PROYECTOS */}
      <section id="banco" className="py-16 px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A2E6C] text-center mb-3">Banco de proyectos</h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10">
            Necesidades que nos han compartido las asociaciones y que van más allá de nuestro catálogo de eventos. Si tu club
            quiere adoptar alguno, te conectamos con la asociación.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BANCO_PROYECTOS.map((p) => (
              <article key={p.titulo} className="rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col">
                <span
                  className="self-start text-xs font-bold px-3 py-1 rounded-full mb-3"
                  style={{ background: `${p.color}1A`, color: p.color === "#F5C200" ? "#8A6D00" : p.color }}
                >
                  {p.categoria}
                </span>
                <h3 className="text-lg font-extrabold text-[#1A2E6C] flex items-start gap-2">
                  <Lightbulb size={20} className="text-[#F5C200] shrink-0 mt-0.5" /> {p.titulo}
                </h3>
                <p className="text-sm text-gray-700 mt-2 flex-1">{p.descripcion}</p>
                <p className="text-sm text-gray-500 mt-3">
                  <strong>Se necesita:</strong> {p.necesidad}
                </p>
                <button
                  onClick={() => navigate("/contactanos")}
                  className="mt-4 px-4 py-2 rounded-lg bg-[#E8401C] text-white text-sm font-semibold hover:brightness-110"
                >
                  Quiero adoptar este proyecto
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
