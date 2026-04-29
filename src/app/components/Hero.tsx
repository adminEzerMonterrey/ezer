import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HERO_IMAGE = "/hero-landing.jpg";
const HERO_PHRASES = [
  "Que nadie se prive, de lo que es destino y vocación de todos: SERVIR.",
  "Experimenta la felicidad de compartir.",
  "Poner el yo a la disposición del tú, para la plenitud de nosotros: AMAR.",
  "BELLEZA, VERDAD y BONDAD",
];

export function Hero() {
  return (
    <section
      id="inicio"
      style={{ background: "linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="relative overflow-hidden"
    >
      <StarPattern />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 md:pt-10 md:pb-16 lg:pt-14 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 mb-4" />

            <h1
              style={{ color: "#1A2E6C", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.02em" }}
              className="mb-5"
            >
              Conectando empresas / grupos con <span style={{ color: "#E8401C" }}>causas que importan</span>
            </h1>

            <p
              style={{ color: "#4B5563", fontSize: "clamp(1rem, 2vw, 1.2rem)", lineHeight: 1.7 }}
              className="mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              Nuestra misión es enlazar y capacitar a voluntarios que deseen servir a la comunidad, con los programas y organizaciones de beneficio social, de una manera profesional, permanente y con una visión sistémica y comunitaria.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/catalogo-eventos"
                style={{ backgroundColor: "#F5C200", color: "#1A2E6C", borderRadius: 8 }}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-bold text-sm hover:brightness-105 active:scale-95 transition-all duration-200 shadow-lg shadow-yellow-400/40 text-center"
              >
                ¿Eres empresa y quieres colaborar?
                <ArrowRight size={18} className="flex-shrink-0" />
              </Link>
              <Link
                to="/registro"
                style={{ color: "#1A2E6C", border: "2px solid rgba(26,46,108,0.35)", borderRadius: 8, backgroundColor: "rgba(26,46,108,0.04)" }}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-bold text-sm hover:bg-[rgba(26,46,108,0.08)] active:scale-95 transition-all duration-200 text-center"
              >
                ¿Eres una Asociación y quieres colaborar?
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:hidden">
              {HERO_PHRASES.map((phrase) => (
                <div
                  key={phrase}
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid rgba(26,46,108,0.12)",
                    borderRadius: 12,
                    boxShadow: "0 10px 24px rgba(26,46,108,0.08)",
                  }}
                  className="px-4 py-4 text-left"
                >
                  <p style={{ color: "#1A2E6C", fontSize: 13, fontWeight: 700, lineHeight: 1.6 }}>{phrase}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div
              style={{ borderRadius: 20, overflow: "hidden", border: "3px solid rgba(26,46,108,0.12)", boxShadow: "0 24px 60px rgba(26,46,108,0.15)" }}
              className="relative"
            >
              <img src={HERO_IMAGE} alt="Voluntarios trabajando juntos" className="w-full h-[480px] object-cover" />
              <div style={{ background: "linear-gradient(to top, rgba(26,46,108,0.45) 0%, transparent 60%)" }} className="absolute inset-0" />
            </div>

            <div
              style={{ backgroundColor: "rgba(255,255,255,0.92)", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", border: "1px solid rgba(229,231,235,0.9)" }}
              className="absolute -left-4 top-6 max-w-[180px] px-3 py-3 hidden xl:block"
            >
              <p style={{ color: "#1A2E6C", fontSize: 12, fontWeight: 700, lineHeight: 1.5 }}>{HERO_PHRASES[0]}</p>
            </div>

            <div
              style={{ backgroundColor: "rgba(26,46,108,0.92)", borderRadius: 12, border: "1px solid rgba(245,194,0,0.3)", boxShadow: "0 8px 24px rgba(26,46,108,0.22)" }}
              className="absolute -right-3 top-16 max-w-[180px] px-3 py-3 hidden xl:block"
            >
              <p style={{ color: "#FFFFFF", fontSize: 12, fontWeight: 700, lineHeight: 1.5 }}>{HERO_PHRASES[1]}</p>
            </div>

            <div
              style={{ backgroundColor: "rgba(255,255,255,0.9)", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", border: "1px solid rgba(229,231,235,0.9)" }}
              className="absolute -left-2 bottom-6 max-w-[200px] px-3 py-3 hidden xl:block"
            >
              <p style={{ color: "#1A2E6C", fontSize: 12, fontWeight: 700, lineHeight: 1.5 }}>{HERO_PHRASES[2]}</p>
            </div>

            <div
              style={{ backgroundColor: "rgba(245,194,0,0.94)", borderRadius: 12, border: "1px solid rgba(26,46,108,0.1)", boxShadow: "0 8px 24px rgba(245,194,0,0.24)" }}
              className="absolute right-5 -bottom-3 max-w-[165px] px-3 py-3 hidden xl:block"
            >
              <p style={{ color: "#1A2E6C", fontSize: 12, fontWeight: 800, lineHeight: 1.45 }}>{HERO_PHRASES[3]}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none rotate-180">
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{ height: 60 }}>
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#FFFFFF" />
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
        <div key={i} className="absolute" style={{ left: star.x, top: star.y }}>
          <svg width={star.size * 4} height={star.size * 4} viewBox="0 0 20 20">
            <path
              d="M10 2 L11.5 7.5 L17 7.5 L12.5 11 L14 16.5 L10 13.5 L6 16.5 L7.5 11 L3 7.5 L8.5 7.5 Z"
              fill="#1A2E6C"
              opacity={star.opacity}
            />
          </svg>
        </div>
      ))}
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
