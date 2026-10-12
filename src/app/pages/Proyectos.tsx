import { ArrowRight, Building2, GraduationCap, HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";
import { proyectos } from "../navigation";

const ICONS: Record<string, { icon: typeof Building2; color: string }> = {
  "/catalogo-eventos": { icon: Building2, color: "#E8401C" },
  "/universidades": { icon: GraduationCap, color: "#1A2E6C" },
  "/aliados": { icon: HeartHandshake, color: "#F5C200" },
};

export function ProyectosPage() {
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="bg-white">
      <section style={{ backgroundColor: "#1A2E6C" }} className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest" style={{ color: "#F5C200" }}>
            Proyectos EZER
          </p>
          <h1 className="text-3xl font-extrabold text-white sm:text-5xl">Tres formas de sumar tu tiempo</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/80 sm:text-lg">
            Conectamos a empresas, universidades y voluntarios con asociaciones de Nuevo León que necesitan manos y talento.
          </p>
        </div>
      </section>

      <section className="px-4 py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {proyectos.map((p) => {
            const { icon: Icon, color } = ICONS[p.path] ?? { icon: Building2, color: "#1A2E6C" };
            return (
              <Link
                key={p.path}
                to={p.path}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                style={{ textDecoration: "none" }}
              >
                <span
                  className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${color}1A`, color }}
                >
                  <Icon size={28} />
                </span>
                <h2 className="text-xl font-extrabold" style={{ color: "#1A2E6C" }}>
                  {p.label}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{p.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold" style={{ color: "#E8401C" }}>
                  Conocer más
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
