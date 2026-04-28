import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const IMPACT_STATS = [
  { key: "impact_years", value: "27", label: "Años de trayectoria", unit: "años", featured: true },
  { key: "impact_institutions", value: "155", label: "Instituciones apoyadas", unit: "instituciones", featured: true },
  { key: "impact_municipalities", value: "14", label: "Municipios apoyados", unit: "municipios" },
  { key: "impact_volunteers_historical", value: "9,184", label: "Voluntarios (historico)", unit: "voluntarios" },
  { key: "impact_volunteers_annual", value: "150", label: "Voluntarios activos anualmente", unit: "voluntarios" },
];

export function ImpactStats() {
  const [stats, setStats] = useState(IMPACT_STATS);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase.from("hero_stats").select("*");
      if (!error && data && data.length > 0) {
        setStats(
          IMPACT_STATS.map((stat) => {
            const row = data.find((item: any) => item.key === stat.key);
            return row ? { ...stat, value: row.value } : stat;
          })
        );
      }
    };

    fetchStats();
  }, []);

  return (
    <section style={{ backgroundColor: "#FFFFFF", fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <span
            style={{ color: "#E8401C", backgroundColor: "rgba(232,64,28,0.08)", borderRadius: 999, fontWeight: 800, fontSize: 12, letterSpacing: "0.08em" }}
            className="inline-flex px-4 py-2 uppercase"
          >
            Nuestro Impacto
          </span>
          <h2 style={{ color: "#1A2E6C", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 800, lineHeight: 1.1 }} className="mt-4">
            Impacto Social
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-5">
          {stats.map((stat) => (
            <article
              key={stat.key}
              style={{
                backgroundColor: "#F4F6FA",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                minHeight: stat.featured ? 244 : 220,
              }}
              className={`p-6 md:p-7 flex flex-col justify-between ${stat.featured ? "md:col-span-3" : "md:col-span-2"}`}
            >
              <h3 style={{ color: "#252A33", fontSize: "clamp(1rem, 1.7vw, 1.35rem)", fontWeight: 800, lineHeight: 1.25 }}>
                {stat.label}
              </h3>
              <div>
                <div style={{ color: "#252A33", fontSize: "clamp(4rem, 10vw, 7.5rem)", fontWeight: 800, lineHeight: 0.95 }}>
                  {stat.value}
                </div>
                <p style={{ color: "#6B7280", fontSize: "clamp(1rem, 1.8vw, 1.35rem)", fontWeight: 800 }} className="mt-6">
                  {stat.unit}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
