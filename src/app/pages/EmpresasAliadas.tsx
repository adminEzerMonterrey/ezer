import { useEffect } from "react";
import { Building2, Package, CircleDollarSign, HeartHandshake, ClipboardEdit } from "lucide-react";

export function EmpresasAliadasPage() {
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
      <section className="relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1A2E6C] to-[#0f1b40] overflow-hidden text-white">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#E8401C]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#F5C200]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white font-bold text-sm mb-6 border border-white/20 backdrop-blur-sm">
            <Building2 size={16} className="text-[#F5C200]" />
            Alianzas Estratégicas
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
            Únete como <span className="text-[#F5C200]">Empresa Aliada</span>
          </h1>

          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-10">
            Una Empresa Aliada es aquella organización que suma esfuerzos mediante donativos para hacer posibles nuestros eventos de impacto social. Tu apoyo es el motor que nos permite llegar más lejos.
          </p>

          <a href="#registro" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#E8401C] text-white rounded-xl font-bold text-lg hover:brightness-110 active:scale-95 transition-all duration-200 shadow-xl shadow-red-900/30">
            <ClipboardEdit size={20} />
            Quiero sumar a mi empresa
          </a>
        </div>
      </section>

      {/* FORMAS DE APOYAR */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A2E6C] mb-4">Formas de Apoyar</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Cada donativo, sin importar su tipo, nos ayuda a construir un entorno mejor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg shadow-gray-200/50 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mb-6">
                <Package size={32} className="text-[#E8401C]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A2E6C] mb-3">Donativos en Especie</h3>
              <p className="text-gray-600 leading-relaxed">Alimentos, materiales, herramientas o equipo necesario para llevar a cabo nuestros eventos y talleres.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg shadow-gray-200/50 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mb-6">
                <CircleDollarSign size={32} className="text-green-700" />
              </div>
              <h3 className="text-xl font-bold text-[#1A2E6C] mb-3">Aportaciones Monetarias</h3>
              <p className="text-gray-600 leading-relaxed">Fondos para cubrir la logística, transportación e impacto directo de nuestras actividades de voluntariado.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg shadow-gray-200/50 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
                <HeartHandshake size={32} className="text-[#1A2E6C]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A2E6C] mb-3">Servicios Pro Bono</h3>
              <p className="text-gray-600 leading-relaxed">Servicios profesionales, logísticos, publicitarios o de infraestructura que potencien nuestro alcance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULARIO */}
      <section id="registro" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-4 md:p-8 shadow-2xl shadow-blue-900/10 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#F5C200] via-[#E8401C] to-[#1A2E6C]" />

            <div 
              style={{ width: "100%", height: "800px" }} 
              data-fillout-id="5oyXgmpgcrus" 
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
