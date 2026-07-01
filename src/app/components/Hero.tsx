import { Link } from "react-router-dom";

const HERO_IMAGE = "/hero.png";

export function Hero() {
  return (
    <section id="inicio" className="w-full flex flex-col bg-white">
      {/* Imagen completa a todo el ancho */}
      <div className="w-full relative bg-[#F8FAFC]">
        <img
          src={HERO_IMAGE}
          alt="Voluntarios trabajando juntos"
          className="w-full max-h-[45vh] lg:max-h-[50vh] object-contain block mx-auto"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC]/50 to-transparent pointer-events-none" />
      </div>

      {/* Título, párrafo y Call to Action */}
      <div 
        style={{ 
          background: "linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)", 
          fontFamily: "'Plus Jakarta Sans', sans-serif" 
        }} 
        className="relative w-full py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center overflow-hidden"
      >
        <StarPattern />
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <h1
            style={{ 
              color: "#1A2E6C", 
              fontSize: "clamp(2rem, 5vw, 4rem)", 
              fontWeight: 800, 
              lineHeight: 1.15, 
              letterSpacing: "-0.02em" 
            }}
            className="mb-6"
          >
            Conectando empresas y grupos con <span style={{ color: "#E8401C" }}>causas que importan</span>
          </h1>

          <p
            style={{ 
              color: "#4B5563", 
              fontSize: "clamp(1.125rem, 2vw, 1.25rem)", 
              lineHeight: 1.7 
            }}
            className="mb-10 max-w-3xl"
          >
            Nuestra misión es enlazar y capacitar a voluntarios que deseen servir a la comunidad, con los programas y organizaciones de beneficio social, de una manera profesional, permanente y con una visión sistémica y comunitaria.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 w-full max-w-3xl justify-center">
            <Link
              to="/empresas"
              style={{
                background: "linear-gradient(135deg, #1A2E6C 0%, #243d8f 100%)",
                color: "#FFFFFF",
                borderRadius: 14,
                boxShadow: "0 8px 24px rgba(26,46,108,0.35)",
                textDecoration: "none",
              }}
              className="flex-1 flex flex-col items-center justify-center gap-1 px-6 py-5 font-bold active:scale-95 transition-all duration-200 hover:brightness-110"
            >
              <span style={{ fontSize: 28 }}>🏢</span>
              <span style={{ fontSize: 16, fontWeight: 800 }}>Empresas</span>
              <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.8, marginTop: 2 }}>Voluntariado corporativo</span>
            </Link>

            <Link
              to="/aliados"
              style={{
                background: "linear-gradient(135deg, #F5C200 0%, #e6b400 100%)",
                color: "#1A2E6C",
                borderRadius: 14,
                boxShadow: "0 8px 24px rgba(245,194,0,0.4)",
                textDecoration: "none",
              }}
              className="flex-1 flex flex-col items-center justify-center gap-1 px-6 py-5 font-bold active:scale-95 transition-all duration-200 hover:brightness-105"
            >
              <span style={{ fontSize: 28 }}>🤝</span>
              <span style={{ fontSize: 16, fontWeight: 800 }}>Aliados Voluntarios</span>
              <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.75, marginTop: 2 }}>Únete como aliado</span>
            </Link>

            <Link
              to="/empresas-aliadas"
              style={{
                background: "linear-gradient(135deg, #E8401C 0%, #c53010 100%)",
                color: "#FFFFFF",
                borderRadius: 14,
                boxShadow: "0 8px 24px rgba(232,64,28,0.35)",
                textDecoration: "none",
              }}
              className="flex-1 flex flex-col items-center justify-center gap-1 px-6 py-5 font-bold active:scale-95 transition-all duration-200 hover:brightness-110"
            >
              <span style={{ fontSize: 28 }}>💝</span>
              <span style={{ fontSize: 16, fontWeight: 800 }}>Empresas Aliadas</span>
              <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.85, marginTop: 2 }}>Donativo</span>
            </Link>
          </div>
        </div>
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
