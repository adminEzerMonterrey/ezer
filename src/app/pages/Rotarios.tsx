import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Search,
  MapPin,
  CalendarDays,
  Lightbulb,
  ArrowLeft,
  X,
  CheckCircle2,
  Users,
  HeartHandshake,
  BarChart3,
  MessageCircle,
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
    imagen: "/banco/rampas.jpg",
    categoria: "Infraestructura",
    descripcion: "Construir rampas, barandales y baños accesibles en una casa hogar para personas con discapacidad motriz.",
    necesidad: "Material de construcción y 15 voluntarios por 2 sábados",
    asociacion: "Casa hogar para personas con discapacidad motriz",
    beneficiarios: "35 residentes",
    duracion: "2 fines de semana",
    presupuesto: "$85,000 MXN",
    impactoEsperado: "Que las 35 personas residentes se muevan solas y con seguridad por toda la casa.",
    pasos: ["Diagnóstico de accesibilidad con un arquitecto", "Compra de material", "Construcción de rampas y barandales", "Adaptación de 2 baños"],
    color: "#1A2E6C",
  },
  {
    titulo: "Paneles solares para albergue",
    imagen: "/banco/solar.jpg",
    categoria: "Medio ambiente",
    descripcion: "Instalar un sistema solar que reduzca el gasto de luz de un albergue y libere recursos para alimentos.",
    necesidad: "Donativo para equipo e instaladores certificados",
    asociacion: "Albergue para personas migrantes",
    beneficiarios: "60 personas por noche",
    duracion: "3 meses",
    presupuesto: "$180,000 MXN",
    impactoEsperado: "Ahorro de hasta 70% en luz, que se destina a alimentos.",
    pasos: ["Estudio de consumo eléctrico", "Compra de paneles e inversor", "Instalación certificada", "Capacitación al personal"],
    color: "#F5C200",
  },
  {
    titulo: "Becas de transporte escolar",
    imagen: "/banco/transporte.jpg",
    categoria: "Educación",
    descripcion: "Cubrir el transporte de 30 estudiantes de zonas rurales que hoy abandonan la escuela por la distancia.",
    necesidad: "Patrocinio anual por estudiante",
    asociacion: "Escuela secundaria rural",
    beneficiarios: "30 estudiantes",
    duracion: "1 ciclo escolar",
    presupuesto: "$4,500 MXN por estudiante",
    impactoEsperado: "Cero abandono escolar por distancia durante el ciclo.",
    pasos: ["Selección de estudiantes con la escuela", "Convenio con transportista local", "Seguimiento mensual de asistencia", "Informe de cierre de ciclo"],
    color: "#E8401C",
  },
  {
    titulo: "Consultorio dental móvil",
    imagen: "/banco/dental.jpg",
    categoria: "Salud",
    descripcion: "Jornadas mensuales de limpieza y revisión dental para niñas y niños de casas hogar.",
    necesidad: "Dentistas voluntarios y material de curación",
    asociacion: "Red de casas hogar infantiles",
    beneficiarios: "150 niñas y niños",
    duracion: "12 meses",
    presupuesto: "$60,000 MXN",
    impactoEsperado: "Que cada niña y niño tenga al menos 2 revisiones dentales al año.",
    pasos: ["Convocatoria a dentistas rotarios", "Calendario de visitas por casa hogar", "Jornadas mensuales", "Reporte de salud bucal"],
    color: "#1A2E6C",
  },
  {
    titulo: "Alfabetización digital de adultos mayores",
    imagen: "/banco/digital.jpg",
    categoria: "Tecnología",
    descripcion: "Enseñar uso de celular, videollamadas y trámites en línea a adultos mayores en estancias de día.",
    necesidad: "Tabletas en donación y voluntarios 1 vez por semana",
    asociacion: "Estancia de día para adultos mayores",
    beneficiarios: "40 adultos mayores",
    duracion: "4 meses",
    presupuesto: "$50,000 MXN",
    impactoEsperado: "Que puedan hacer videollamadas con su familia y trámites en línea sin ayuda.",
    pasos: ["Donación de 20 tabletas", "Diseño de clases sencillas", "16 sesiones semanales", "Graduación con las familias"],
    color: "#F5C200",
  },
  {
    titulo: "Pozo y filtro de agua potable",
    imagen: "/banco/agua.jpg",
    categoria: "Agua y saneamiento",
    descripcion: "Garantizar agua limpia en una comunidad que hoy depende de pipas para su escuela y centro comunitario.",
    necesidad: "Estudio técnico, perforación y filtro",
    asociacion: "Comunidad rural con escuela y centro comunitario",
    beneficiarios: "420 habitantes",
    duracion: "6 meses",
    presupuesto: "$350,000 MXN",
    impactoEsperado: "Agua potable todo el año, sin depender de pipas.",
    pasos: ["Estudio hidrológico", "Perforación del pozo", "Instalación de bomba y filtro", "Comité comunitario de mantenimiento"],
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

// Áreas de interés de Rotary International, asignadas a cada evento de ejemplo.
const AREA_POR_EVENTO: Record<string, string> = {
  "Posada navideña con adultos mayores": "Desarrollo comunitario",
  "Rehabilitación de comedor comunitario": "Desarrollo comunitario",
  "Feria de salud visual": "Prevención de enfermedades",
  "Huerto escolar": "Medio ambiente",
  "Colecta de invierno": "Desarrollo comunitario",
  "Taller de oficios para mujeres": "Desarrollo económico",
  "Día deportivo incluyente": "Educación básica",
};
// Resultado contable de cada evento (lo que se puede contar).
const RESULTADO_POR_EVENTO: Record<string, string> = {
  "Posada navideña con adultos mayores": "65 cenas y regalos",
  "Rehabilitación de comedor comunitario": "120 comidas diarias",
  "Feria de salud visual": "140 lentes entregados",
  "Huerto escolar": "12 camas de cultivo",
  "Colecta de invierno": "300 cobijas",
  "Taller de oficios para mujeres": "10 negocios nuevos",
  "Día deportivo incluyente": "95 jóvenes en deporte",
};
const HORAS_POR_VOLUNTARIO = 4;

function totales(clubes: Club[]) {
  const eventos = clubes.flatMap((c) => c.eventos);
  return {
    eventos: eventos.length,
    beneficiarios: eventos.reduce((s, e) => s + e.beneficiarios, 0),
    voluntarios: eventos.reduce((s, e) => s + e.voluntarios, 0),
    horas: eventos.reduce((s, e) => s + e.voluntarios * HORAS_POR_VOLUNTARIO, 0),
    asociaciones: new Set(eventos.map((e) => e.asociacion)).size,
  };
}

const MEDICION = [
  {
    etiqueta: "Participación",
    titulo: "Voluntarios y horas",
    texto: "Quiénes asistieron y cuántas horas de servicio dio cada uno.",
    icon: Users,
    color: "#E8401C",
  },
  {
    etiqueta: "Alcance",
    titulo: "Beneficiarios",
    texto: "Personas atendidas y la asociación que las recibe.",
    icon: HeartHandshake,
    color: "#F5C200",
  },
  {
    etiqueta: "Resultado",
    titulo: "Algo que se puede contar",
    texto: "Árboles plantados, comidas servidas, viviendas mejoradas.",
    icon: BarChart3,
    color: "#1A2E6C",
  },
  {
    etiqueta: "Testimonio",
    titulo: "La voz de la comunidad",
    texto: "Un comentario breve de la asociación o de un beneficiario.",
    icon: MessageCircle,
    color: "#E8401C",
  },
];

function MedicionImpacto() {
  return (
    <section id="impacto" className="py-20 px-4 sm:px-6 lg:px-8 bg-white scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm font-bold tracking-widest uppercase text-[#E8401C]">Medición de impacto</p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#1A2E6C] mt-3 leading-tight tracking-tight">
            Medimos el impacto, no solo la actividad
          </h2>
          <div className="w-20 h-1.5 bg-[#F5C200] rounded-full mx-auto mt-6" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          {MEDICION.map(({ etiqueta, titulo, texto, icon: Icon, color }) => (
            <div
              key={etiqueta}
              className="group bg-white rounded-2xl p-7 border border-gray-100 shadow-lg shadow-[#1A2E6C]/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: `${color}1A` }}
              >
                <Icon size={28} style={{ color: color === "#F5C200" ? "#C99A00" : color }} />
              </div>
              <p className="text-xs font-bold tracking-widest uppercase" style={{ color: color === "#F5C200" ? "#C99A00" : color }}>
                {etiqueta}
              </p>
              <h3 className="text-xl font-extrabold text-[#1A2E6C] mt-1">{titulo}</h3>
              <p className="text-gray-600 mt-2 leading-relaxed">{texto}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

type Proyecto = (typeof BANCO_PROYECTOS)[number];

function AdoptarModal({ proyecto, onClose }: { proyecto: Proyecto; onClose: () => void }) {
  const clubes = DISTRITOS.flatMap((d) => d.clubes.map((c) => `${c.nombre} (${d.nombre})`));
  const [f, setF] = useState({
    nombre: "", cargo: "", email: "", telefono: "", club: "", otroClub: "",
    participacion: "Voluntarios y donativo", voluntarios: "", fecha: "", comentarios: "",
  });
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">("idle");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.value });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEstado("enviando");
    const club = f.club === "otro" ? f.otroClub : f.club;
    const message = [
      `Proyecto: ${proyecto.titulo} (${proyecto.categoria})`,
      `Club: ${club}`,
      `Nombre: ${f.nombre}`,
      `Cargo en el club: ${f.cargo || "-"}`,
      `Correo: ${f.email}`,
      `Teléfono: ${f.telefono || "-"}`,
      `Forma de participar: ${f.participacion}`,
      `Voluntarios estimados: ${f.voluntarios || "-"}`,
      `Fecha tentativa: ${f.fecha || "-"}`,
      `Comentarios: ${f.comentarios || "-"}`,
    ].join("\n");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: f.nombre, email: f.email, subject: `Rotarios · Adoptar proyecto: ${proyecto.titulo}`, message }),
      });
      setEstado(r.ok ? "ok" : "error");
    } catch {
      setEstado("error");
    }
  };

  const input = "w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2E6C]";
  const label = "block text-sm font-semibold text-gray-700 mb-1";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" onClick={onClose} role="dialog" aria-modal="true" aria-label={`Adoptar ${proyecto.titulo}`}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <img src={proyecto.imagen} alt="" className="w-full h-32 object-cover rounded-t-2xl" />
          <button onClick={onClose} aria-label="Cerrar" className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">
          <div className="text-xs font-bold uppercase tracking-wide text-[#E8401C]">Adoptar proyecto · {proyecto.categoria}</div>
          <h3 className="text-xl font-extrabold text-[#1A2E6C] mt-1">{proyecto.titulo}</h3>
          <p className="text-sm text-gray-600 mt-1"><strong>Se necesita:</strong> {proyecto.necesidad}</p>

          {estado === "ok" ? (
            <div className="text-center py-8">
              <CheckCircle2 className="mx-auto text-green-600 mb-3" size={48} />
              <p className="font-bold text-[#1A2E6C] text-lg">¡Gracias por sumarte!</p>
              <p className="text-sm text-gray-600 mt-1">El equipo de EZER te contactará para conectar a tu club con la asociación.</p>
              <button onClick={onClose} className="mt-5 px-5 py-2 rounded-lg bg-[#1A2E6C] text-white font-semibold">Cerrar</button>
            </div>
          ) : (
            <form onSubmit={enviar} className="mt-5 space-y-4">
              <div>
                <label className={label}>Club rotario *</label>
                <select required value={f.club} onChange={set("club")} className={input}>
                  <option value="">Selecciona tu club</option>
                  {clubes.map((c) => <option key={c} value={c}>{c}</option>)}
                  <option value="otro">Otro club</option>
                </select>
                {f.club === "otro" && (
                  <input required value={f.otroClub} onChange={set("otroClub")} placeholder="Nombre del club y distrito" className={`${input} mt-2`} />
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className={label}>Nombre *</label>
                  <input required value={f.nombre} onChange={set("nombre")} className={input} />
                </div>
                <div>
                  <label className={label}>Cargo en el club</label>
                  <input value={f.cargo} onChange={set("cargo")} placeholder="Ej. Presidente" className={input} />
                </div>
                <div>
                  <label className={label}>Correo *</label>
                  <input required type="email" value={f.email} onChange={set("email")} className={input} />
                </div>
                <div>
                  <label className={label}>Teléfono</label>
                  <input type="tel" value={f.telefono} onChange={set("telefono")} className={input} />
                </div>
              </div>
              <div>
                <label className={label}>¿Cómo quiere participar el club? *</label>
                <select required value={f.participacion} onChange={set("participacion")} className={input}>
                  <option>Voluntarios y donativo</option>
                  <option>Solo voluntarios</option>
                  <option>Solo donativo / patrocinio</option>
                  <option>Solicitar subvención a la Fundación Rotaria</option>
                </select>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className={label}>Voluntarios estimados</label>
                  <input type="number" min={0} value={f.voluntarios} onChange={set("voluntarios")} className={input} />
                </div>
                <div>
                  <label className={label}>Fecha tentativa</label>
                  <input type="month" value={f.fecha} onChange={set("fecha")} className={input} />
                </div>
              </div>
              <div>
                <label className={label}>Comentarios</label>
                <textarea rows={3} value={f.comentarios} onChange={set("comentarios")} className={input} />
              </div>
              {estado === "error" && <p className="text-sm text-red-600">No se pudo enviar. Intenta de nuevo o escríbenos a voluntariadocorporativo@ezer.org.mx.</p>}
              <button type="submit" disabled={estado === "enviando"} className="w-full py-3 rounded-lg bg-[#E8401C] text-white font-bold hover:brightness-110 disabled:opacity-60">
                {estado === "enviando" ? "Enviando…" : "Enviar solicitud"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function ProyectoDetalle({ proyecto: p, onClose, onAdoptar }: { proyecto: Proyecto; onClose: () => void; onAdoptar: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  const datos = [
    { l: "Asociación", v: p.asociacion },
    { l: "Beneficiarios", v: p.beneficiarios },
    { l: "Duración", v: p.duracion },
    { l: "Presupuesto estimado", v: p.presupuesto },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 animate-[fadeIn_.2s_ease-out]" onClick={onClose} role="dialog" aria-modal="true" aria-label={p.titulo}>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes popIn{from{opacity:0;transform:scale(.95) translateY(12px)}to{opacity:1;transform:none}}`}</style>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto animate-[popIn_.25s_ease-out]" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <img src={p.imagen} alt={p.titulo} className="w-full h-56 md:h-72 object-cover rounded-t-2xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent rounded-t-2xl" />
          <button onClick={onClose} aria-label="Cerrar" className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white">
            <X size={20} />
          </button>
          <div className="absolute bottom-5 left-6 right-6">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/90" style={{ color: p.color === "#F5C200" ? "#8A6D00" : p.color }}>
              {p.categoria}
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-2">{p.titulo}</h3>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <p className="text-gray-700 text-lg leading-relaxed">{p.descripcion}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {datos.map((d) => (
              <div key={d.l} className="rounded-xl bg-[#EEF2FF] p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-500">{d.l}</p>
                <p className="text-sm font-bold text-[#1A2E6C] mt-1">{d.v}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div>
              <h4 className="font-extrabold text-[#1A2E6C]">¿Cómo se realizaría?</h4>
              <ol className="mt-3 space-y-2">
                {p.pasos.map((paso, i) => (
                  <li key={paso} className="flex gap-3 text-sm text-gray-700">
                    <span className="w-6 h-6 shrink-0 rounded-full bg-[#1A2E6C] text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                    {paso}
                  </li>
                ))}
              </ol>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl border-l-4 border-[#F5C200] bg-[#FFFBEB] p-4">
                <h4 className="font-extrabold text-[#1A2E6C] text-sm">Impacto esperado</h4>
                <p className="text-sm text-gray-700 mt-1">{p.impactoEsperado}</p>
              </div>
              <div className="rounded-xl border-l-4 border-[#E8401C] bg-[#FFF4F0] p-4">
                <h4 className="font-extrabold text-[#1A2E6C] text-sm">Se necesita</h4>
                <p className="text-sm text-gray-700 mt-1">{p.necesidad}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button onClick={onAdoptar} className="flex-1 py-3 rounded-xl bg-[#E8401C] text-white font-bold hover:brightness-110 active:scale-[.98] transition">
              Quiero adoptar este proyecto
            </button>
            <button onClick={onClose} className="sm:w-40 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50">
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RotariosPage() {
  const [adoptar, setAdoptar] = useState<Proyecto | null>(null);
  const [detalle, setDetalle] = useState<Proyecto | null>(null);
  const [abierto, setAbierto] = useState<string | null>(DISTRITOS[0].id);
  const [seleccion, setSeleccion] = useState<{ d: string; c: string } | null>(null);
  const [busqueda, setBusqueda] = useState("");


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
      <MedicionImpacto />

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
              <article
                key={p.titulo}
                onClick={() => setDetalle(p)}
                className="group cursor-pointer text-left rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A2E6C]"
              >
                <div className="overflow-hidden">
                  <img src={p.imagen} alt={p.titulo} loading="lazy" className="w-full aspect-[16/9] object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="p-6 flex flex-col flex-1">
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
                  <div className="mt-5 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setAdoptar(p); }}
                      className="flex-1 px-4 py-2.5 rounded-lg bg-[#E8401C] text-white text-sm font-bold hover:brightness-110 active:scale-95 transition"
                    >
                      Quiero adoptar este proyecto
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      {detalle && (
        <ProyectoDetalle
          proyecto={detalle}
          onClose={() => setDetalle(null)}
          onAdoptar={() => { setAdoptar(detalle); setDetalle(null); }}
        />
      )}
      {adoptar && <AdoptarModal proyecto={adoptar} onClose={() => setAdoptar(null)} />}
    </div>
  );
}
