import { Link } from "react-router-dom";
import { Building2, UserPlus, HeartHandshake } from "lucide-react";

const HERO_IMAGE = "/hero.png";

export function Hero() {
  return (
    <section id="inicio" className="w-full flex flex-col bg-white">
      {/* Imagen completa a todo el ancho */}
      <div className="w-full relative">
        <img
          src={HERO_IMAGE}
          alt="Voluntarios trabajando juntos"
          className="w-full h-[45vh] lg:h-[50vh] object-cover object-[center_30%] block"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl justify-center mt-4">
            <Link
              to="/empresas"
              className="group flex flex-col items-center text-center p-8 bg-white border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(26,46,108,0.1)] hover:-translate-y-2 hover:border-blue-100 transition-all duration-300 relative overflow-hidden"
              style={{ textDecoration: "none" }}
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#1A2E6C]" />
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#1A2E6C] flex items-center justify-center mb-5 group-hover:bg-[#1A2E6C] group-hover:text-white transition-colors duration-300">
                <Building2 size={32} />
              </div>
              <span className="text-[#1A2E6C] font-extrabold text-xl mb-2">Empresas</span>
              <span className="text-gray-500 text-sm font-medium leading-relaxed">Voluntariado Corporativo</span>
            </Link>

            <Link
              to="/aliados"
              className="group flex flex-col items-center text-center p-8 bg-white border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(245,194,0,0.15)] hover:-translate-y-2 hover:border-yellow-100 transition-all duration-300 relative overflow-hidden"
              style={{ textDecoration: "none" }}
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#F5C200]" />
              <div className="w-16 h-16 rounded-2xl bg-yellow-50 text-[#D97706] flex items-center justify-center mb-5 group-hover:bg-[#F5C200] group-hover:text-[#1A2E6C] transition-colors duration-300">
                <UserPlus size={32} />
              </div>
              <span className="text-[#1A2E6C] font-extrabold text-xl mb-2">Aliados Voluntarios</span>
              <span className="text-gray-500 text-sm font-medium leading-relaxed">Comparte tu Talento</span>
            </Link>

            <Link
              to="/empresas-aliadas"
              className="group flex flex-col items-center text-center p-8 bg-white border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(232,64,28,0.1)] hover:-translate-y-2 hover:border-red-100 transition-all duration-300 relative overflow-hidden"
              style={{ textDecoration: "none" }}
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#E8401C]" />
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#E8401C] flex items-center justify-center mb-5 group-hover:bg-[#E8401C] group-hover:text-white transition-colors duration-300">
                <HeartHandshake size={32} />
              </div>
              <span className="text-[#1A2E6C] font-extrabold text-xl mb-2">Empresas Aliadas</span>
              <span className="text-gray-500 text-sm font-medium leading-relaxed">Apoya con un Donativo</span>
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
