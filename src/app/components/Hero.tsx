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
          fetchPriority="high"
          decoding="async"
          className="w-full h-[60vh] lg:h-[70vh] object-cover object-center block"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-5xl mt-6">

            {/* Empresas */}
            <Link
              to="/catalogo-eventos"
              className="group flex flex-col rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(26,46,108,0.10)] hover:shadow-[0_24px_56px_rgba(26,46,108,0.18)] hover:-translate-y-2 transition-all duration-300"
              style={{ textDecoration: "none", border: "1.5px solid #E0E7FF" }}
            >
              {/* Colored header */}
              <div className="bg-[#1A2E6C] px-7 pt-7 pb-6 flex flex-col gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
                  <Building2 size={28} className="text-white" />
                </div>
                <div>
                  <span className="text-white font-extrabold text-xl leading-tight block">Empresas</span>
                  <span className="text-blue-200 text-xs font-semibold">Voluntariado Corporativo</span>
                </div>
              </div>

              {/* Steps body */}
              <div className="bg-white flex flex-col gap-5 px-7 py-6 flex-1">
                {[
                  { n: "1", title: "Elige", desc: "Selecciona uno de nuestros 45 proyectos listos para ejecutarse." },
                  { n: "2", title: "Vive", desc: "Tus colaboradores participan en un evento con sensibilización incluida." },
                  { n: "3", title: "Impacta", desc: "Fortaleces tu cultura interna mientras una asociación recibe apoyo real." },
                ].map((step) => (
                  <div key={step.n} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#EEF2FF] text-[#1A2E6C] text-sm font-extrabold flex items-center justify-center mt-0.5">{step.n}</span>
                    <div>
                      <p className="text-[#1A2E6C] font-bold text-sm">{step.title}</p>
                      <p className="text-gray-500 text-xs leading-relaxed mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
                <div className="mt-auto pt-2">
                  <span className="inline-flex items-center gap-1.5 text-[#1A2E6C] font-extrabold text-sm group-hover:gap-3 transition-all duration-200">
                    Explorar proyectos <span>→</span>
                  </span>
                </div>
              </div>
            </Link>

            {/* Aliados Voluntarios */}
            <Link
              to="/aliados"
              className="group flex flex-col rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(245,194,0,0.15)] hover:shadow-[0_24px_56px_rgba(245,194,0,0.25)] hover:-translate-y-2 transition-all duration-300"
              style={{ textDecoration: "none", border: "1.5px solid #FEF3C7" }}
            >
              <div className="bg-[#F5C200] px-7 pt-7 pb-6 flex flex-col gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#1A2E6C]/15 flex items-center justify-center">
                  <UserPlus size={28} className="text-[#1A2E6C]" />
                </div>
                <div>
                  <span className="text-[#1A2E6C] font-extrabold text-xl leading-tight block">Aliados Voluntarios</span>
                  <span className="text-[#78560a] text-xs font-semibold">Comparte tu Talento</span>
                </div>
              </div>

              <div className="bg-white flex flex-col gap-4 px-7 py-6 flex-1">
                <p className="text-gray-500 text-xs leading-relaxed">
                  ¿Tienes una habilidad que te apasiona? Acompaña un evento de voluntariado corporativo y ponla al servicio de los demás.
                </p>
                {[
                  { n: "1", title: "Regístrate", desc: "Cuéntanos qué sabes hacer: música, cocina, fotografía, oficios, lo que sea." },
                  { n: "2", title: "Acompaña", desc: "Te integramos al evento donde tu talento suma más." },
                  { n: "3", title: "Transforma", desc: "Tu habilidad se convierte en una experiencia memorable para todos." },
                ].map((step) => (
                  <div key={step.n} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FEFCE8] text-[#92400E] text-sm font-extrabold flex items-center justify-center mt-0.5">{step.n}</span>
                    <div>
                      <p className="text-[#1A2E6C] font-bold text-sm">{step.title}</p>
                      <p className="text-gray-500 text-xs leading-relaxed mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
                <div className="mt-auto pt-2">
                  <span className="inline-flex items-center gap-1.5 text-[#92400E] font-extrabold text-sm group-hover:gap-3 transition-all duration-200">
                    Únete como aliado <span>→</span>
                  </span>
                </div>
              </div>
            </Link>

            {/* Empresas Aliadas */}
            <Link
              to="/empresas-aliadas"
              className="group flex flex-col rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(232,64,28,0.10)] hover:shadow-[0_24px_56px_rgba(232,64,28,0.18)] hover:-translate-y-2 transition-all duration-300"
              style={{ textDecoration: "none", border: "1.5px solid #FEE2E2" }}
            >
              <div className="bg-[#E8401C] px-7 pt-7 pb-6 flex flex-col gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
                  <HeartHandshake size={28} className="text-white" />
                </div>
                <div>
                  <span className="text-white font-extrabold text-xl leading-tight block">Empresas Aliadas</span>
                  <span className="text-red-200 text-xs font-semibold">Apoya con un Donativo</span>
                </div>
              </div>

              <div className="bg-white flex flex-col gap-5 px-7 py-6 flex-1">
                {[
                  { n: "1", title: "Dona", desc: "Aporta productos que enriquecen los eventos de voluntariado." },
                  { n: "2", title: "Conecta", desc: "Tu marca se hace presente en causas de alto impacto social." },
                  { n: "3", title: "Suma", desc: "Cada producto donado multiplica el alcance de cada evento." },
                ].map((step) => (
                  <div key={step.n} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FEF2F2] text-[#E8401C] text-sm font-extrabold flex items-center justify-center mt-0.5">{step.n}</span>
                    <div>
                      <p className="text-[#1A2E6C] font-bold text-sm">{step.title}</p>
                      <p className="text-gray-500 text-xs leading-relaxed mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
                <div className="mt-auto pt-2">
                  <span className="inline-flex items-center gap-1.5 text-[#E8401C] font-extrabold text-sm group-hover:gap-3 transition-all duration-200">
                    Sumar mi empresa <span>→</span>
                  </span>
                </div>
              </div>
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
