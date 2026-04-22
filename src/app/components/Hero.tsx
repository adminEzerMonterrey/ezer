import { ArrowRight, PlayCircle } from "lucide-react";

const HERO_IMAGE = "https://images.unsplash.com/photo-1769837230054-7f3a7356dde1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjB2b2x1bnRlZXJpbmclMjB0ZWFtd29yayUyMG91dGRvb3J8ZW58MXx8fHwxNzc1NTA1NDI0fDA&ixlib=rb-4.1.0&q=80&w=1080";

export function Hero() {
  return (
    <section
      id="inicio"
      style={{ background: "linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="relative overflow-hidden"
    >
      {/* Star pattern background */}
      <StarPattern />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6">
              {/* remove badge entirely */}
            </div>

            {/* Headline */}
            <h1
              style={{ color: "#1A2E6C", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.02em" }}
              className="mb-6"
            >
              Conectando empresas con{" "}
              <span style={{ color: "#E8401C" }}>causas que importan</span>
            </h1>

            {/* Subtext */}
            <p
              style={{ color: "#4B5563", fontSize: "clamp(1rem, 2vw, 1.2rem)", lineHeight: 1.7 }}
              className="mb-10 max-w-xl mx-auto lg:mx-0"
            >
              EZER conecta empresas comprometidas con ONGs que transforman comunidades.
              Participa en eventos de voluntariado que generan impacto real.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#eventos"
                style={{ backgroundColor: "#F5C200", color: "#1A2E6C", borderRadius: 8 }}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-bold text-sm hover:brightness-105 active:scale-95 transition-all duration-200 shadow-lg shadow-yellow-400/40 text-center"
              >
                ¿Eres empresa y quieres colaborar?
                <ArrowRight size={18} className="flex-shrink-0" />
              </a>
              <a
                href="#registro"
                style={{ color: "#1A2E6C", border: "2px solid rgba(26,46,108,0.35)", borderRadius: 8, backgroundColor: "rgba(26,46,108,0.04)" }}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-bold text-sm hover:bg-[rgba(26,46,108,0.08)] active:scale-95 transition-all duration-200 text-center"
              >
                ¿Eres una Asociación y quieres colaborar?
              </a>
            </div>

            {/* Stats */}
            <div className="mt-12 flex flex-wrap gap-8 justify-center lg:justify-start">
              {[
                { value: "120+", label: "Eventos realizados" },
                { value: "18", label: "Empresas aliadas" },
                { value: "3,200+", label: "Voluntarios activos" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div style={{ color: "#E8401C", fontWeight: 800, fontSize: "1.75rem", lineHeight: 1 }}>
                    {stat.value}
                  </div>
                  <div style={{ color: "#6B7280", fontSize: "0.8rem" }} className="mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative hidden lg:block">
            <div
              style={{ borderRadius: 20, overflow: "hidden", border: "3px solid rgba(26,46,108,0.12)", boxShadow: "0 24px 60px rgba(26,46,108,0.15)" }}
              className="relative"
            >
              <img
                src={HERO_IMAGE}
                alt="Voluntarios trabajando juntos"
                className="w-full h-[480px] object-cover"
              />
              {/* Overlay gradient */}
              <div
                style={{ background: "linear-gradient(to top, rgba(26,46,108,0.45) 0%, transparent 60%)" }}
                className="absolute inset-0"
              />
            </div>

            {/* Floating badges */}
            <div
              style={{ backgroundColor: "#FFFFFF", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", border: "1px solid #E5E7EB" }}
              className="absolute -left-8 top-10 px-4 py-3 hidden xl:flex items-center gap-3"
            >
              <div
                style={{ width: 44, height: 44, backgroundColor: "#FEF3C7", borderRadius: 10 }}
                className="flex items-center justify-center text-2xl flex-shrink-0"
              >
                🤝
              </div>
              <div>
                <div style={{ color: "#1A2E6C", fontWeight: 700, fontSize: 14 }}>Nuevo evento</div>
                <div style={{ color: "#6B7280", fontSize: 12 }}>Disponible esta semana</div>
              </div>
            </div>

            <div
              style={{ backgroundColor: "#1A2E6C", borderRadius: 12, border: "1px solid rgba(245,194,0,0.4)", boxShadow: "0 8px 32px rgba(26,46,108,0.3)" }}
              className="absolute -right-4 bottom-12 px-4 py-3 hidden xl:flex items-center gap-3"
            >
              <div style={{ color: "#F5C200", fontSize: 24 }}>⭐</div>
              <div>
                <div style={{ color: "#FFFFFF", fontWeight: 700, fontSize: 14 }}>Impacto verificado</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>Por ONGs aliadas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none rotate-180">
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{ height: 60 }}>
          <path
            d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    </section>
  );
}

function StarPattern() {
  const stars = [
    { x: "5%", y: "15%", size: 4, opacity: 0.18 },
    { x: "12%", y: "45%", size: 2, opacity: 0.12 },
    { x: "20%", y: "75%", size: 3, opacity: 0.1 },
    { x: "30%", y: "20%", size: 5, opacity: 0.15 },
    { x: "45%", y: "60%", size: 2, opacity: 0.1 },
    { x: "55%", y: "10%", size: 3, opacity: 0.14 },
    { x: "65%", y: "80%", size: 4, opacity: 0.12 },
    { x: "72%", y: "30%", size: 2, opacity: 0.18 },
    { x: "80%", y: "55%", size: 5, opacity: 0.1 },
    { x: "88%", y: "15%", size: 3, opacity: 0.15 },
    { x: "93%", y: "70%", size: 2, opacity: 0.12 },
    { x: "8%", y: "85%", size: 3, opacity: 0.1 },
    { x: "38%", y: "88%", size: 2, opacity: 0.1 },
    { x: "60%", y: "50%", size: 1.5, opacity: 0.12 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute"
          style={{ left: star.x, top: star.y }}
        >
          <svg width={star.size * 4} height={star.size * 4} viewBox="0 0 20 20">
            <path
              d="M10 2 L11.5 7.5 L17 7.5 L12.5 11 L14 16.5 L10 13.5 L6 16.5 L7.5 11 L3 7.5 L8.5 7.5 Z"
              fill="#1A2E6C"
              opacity={star.opacity}
            />
          </svg>
        </div>
      ))}
      {/* Subtle accent blobs */}
      <div
        className="absolute"
        style={{
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,64,28,0.05) 0%, transparent 70%)",
          top: "-10%",
          right: "10%",
          pointerEvents: "none",
        }}
      />
      <div
        className="absolute"
        style={{
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,194,0,0.07) 0%, transparent 70%)",
          bottom: "0%",
          left: "5%",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}