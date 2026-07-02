import { useEffect } from "react";
import { Star, CheckCircle2, ClipboardEdit, CalendarCheck } from "lucide-react";

export function AliadosPage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://server.fillout.com/embed/v1/";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    }
  }, []);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="bg-white">
      {/* HERO */}
      <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#F8FAFC] to-[#EEF2FF] overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-[#E8401C]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#1A2E6C]/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 text-[#1A2E6C] font-bold text-sm mb-6 border border-blue-200">
            <Star size={16} fill="#F5C200" color="#F5C200" />
            Únete a nuestra red de talentos
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1A2E6C] mb-6 leading-tight tracking-tight">
            Conviértete en un <span className="text-[#E8401C]">Aliado Voluntario</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
            En EZER creemos que cada talento suma. Si eres DJ, fotógrafo, payaso, ofreces algún curso, o tienes habilidades que quieras compartir para generar impacto social, ¡te estamos buscando!
          </p>

          <a href="#registro" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#F5C200] text-[#1A2E6C] rounded-xl font-bold text-lg hover:brightness-105 active:scale-95 transition-all duration-200 shadow-xl shadow-yellow-400/20">
            <ClipboardEdit size={20} />
            Quiero ser Aliado
          </a>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A2E6C] mb-4">¿Cómo funciona?</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">En tres sencillos pasos estarás listo para compartir tu talento con quienes más lo necesitan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent -z-10" />

            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl shadow-gray-200/40 text-center relative z-10 transition-transform duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-6 rotate-3">
                <ClipboardEdit size={32} className="text-[#E8401C]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A2E6C] mb-3">1. Regístrate</h3>
              <p className="text-gray-500 leading-relaxed">Llena el formulario con tus datos y cuéntanos sobre tus habilidades, servicios especiales o los cursos que puedes impartir.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl shadow-gray-200/40 text-center relative z-10 transition-transform duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-6 -rotate-3">
                <CheckCircle2 size={32} className="text-[#1A2E6C]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A2E6C] mb-3">2. Revisión</h3>
              <p className="text-gray-500 leading-relaxed">Nuestro equipo revisará tu perfil para encontrar las mejores oportunidades donde tu talento destaque.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl shadow-gray-200/40 text-center relative z-10 transition-transform duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center mx-auto mb-6 rotate-3">
                <CalendarCheck size={32} className="text-[#D97706]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A2E6C] mb-3">3. Participa</h3>
              <p className="text-gray-500 leading-relaxed">Te enviaremos un correo de invitación cuando tengamos un evento que necesite de tu magia y habilidades.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULARIO */}
      <section id="registro" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-4 md:p-8 shadow-2xl shadow-blue-900/5 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1A2E6C] via-[#E8401C] to-[#F5C200]" />

            <div 
              style={{ width: "100%", height: "800px" }} 
              data-fillout-id="9pWgQz5oRfus" 
              data-fillout-embed-type="standard" 
              data-fillout-inherit-parameters 
              data-fillout-dynamic-resize
            ></div>
          </div>
        </div>
      </section>
    </div>
  );
}
