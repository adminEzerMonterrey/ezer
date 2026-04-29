import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const IMPACT_STATS = [
  { key: "impact_years", value: "27", label: "Años de trayectoria", unit: "años", featured: true },
  { key: "impact_institutions", value: "155", label: "Instituciones apoyadas", unit: "instituciones", featured: true },
  { key: "impact_municipalities", value: "14", label: "Municipios apoyados", unit: "municipios" },
  { key: "impact_volunteers_historical", value: "9,184", label: "Voluntarios (histórico)", unit: "voluntarios" },
  { key: "impact_volunteers_annual", value: "150", label: "Voluntarios activos anualmente", unit: "voluntarios" },
];

const STAT_STYLES = [
  {
    cardBackground: "#FFF7ED",
    accentColor: "#E8401C",
    numberColor: "#C2410C",
  },
  {
    cardBackground: "#EEF2FF",
    accentColor: "#1A2E6C",
    numberColor: "#1E3A8A",
  },
  {
    cardBackground: "#FEFCE8",
    accentColor: "#F5C200",
    numberColor: "#A16207",
  },
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
    <section
      style={{
        background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 52%, #FFFFFF 100%)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
      className="py-16 md:py-24"
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 12% 18%, rgba(232,64,28,0.06) 0%, transparent 24%), radial-gradient(circle at 86% 14%, rgba(26,46,108,0.08) 0%, transparent 22%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-10 md:mb-14">
          <h2
            style={{ color: "#1A2E6C", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 800, lineHeight: 1.1 }}
            className="mt-0"
          >
            Nuestro impacto
          </h2>
          <p style={{ color: "#6B7280", maxWidth: 620, margin: "14px auto 0", fontSize: 16, lineHeight: 1.7 }}>
            Resultados que reflejan la fuerza de nuestras alianzas, el compromiso del voluntariado y el alcance de cada iniciativa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-5">
          {stats.map((stat, index) => {
            const style = STAT_STYLES[index % STAT_STYLES.length];

            return (
              <article
                key={stat.key}
                style={{
                  backgroundColor: style.cardBackground,
                  border: "1px solid #E5E7EB",
                  borderRadius: 16,
                  minHeight: stat.featured ? 206 : 186,
                  position: "relative",
                  overflow: "hidden",
                }}
                className={`p-5 md:p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform ${stat.featured ? "md:col-span-3" : "md:col-span-2"}`}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 6,
                    backgroundColor: style.accentColor,
                  }}
                />

                <div>
                  <h3 style={{ color: "#252A33", fontSize: "clamp(1rem, 1.7vw, 1.35rem)", fontWeight: 800, lineHeight: 1.25 }}>
                    {stat.label}
                  </h3>
                </div>

                <div style={{ marginTop: 18 }}>
                  <div style={{ color: style.numberColor, fontSize: "clamp(4rem, 10vw, 7.5rem)", fontWeight: 800, lineHeight: 0.95 }}>
                    {stat.value}
                  </div>
                  <p style={{ color: "#6B7280", fontSize: "clamp(1rem, 1.8vw, 1.35rem)", fontWeight: 800 }} className="mt-4">
                    {stat.unit}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
