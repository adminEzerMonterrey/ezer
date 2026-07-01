import { useState } from "react";
import { Building2, Package, CircleDollarSign, HeartHandshake, Send, ClipboardEdit } from "lucide-react";

export function EmpresasAliadasPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    
    // Obteniendo los checkboxes múltiples
    const supportTypes: string[] = [];
    if (formData.get('support_especie')) supportTypes.push('Especie');
    if (formData.get('support_monetario')) supportTypes.push('Monetario');
    if (formData.get('support_servicios')) supportTypes.push('Servicios');
    if (formData.get('support_otro')) supportTypes.push('Otro');

    const data = {
      nombre_representante: formData.get('name'),
      empresa: formData.get('company'),
      telefono: formData.get('phone'),
      correo: formData.get('email'),
      tipos_apoyo: supportTypes,
      descripcion: formData.get('description'),
    };

    try {
      // Simulación temporal hasta conectar webhook
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Datos de Empresa Aliada:", data);
      
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="bg-white">
      {/* HERO SECTION */}
      <section className="relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1A2E6C] to-[#0f1b40] overflow-hidden text-white">
        {/* Decoraciones de fondo */}
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
            Una Empresa Aliada es aquella organización que suma esfuerzos mediante donativos para hacer posibles nuestros eventos de impacto social. Tu apoyo es el motor que nos permite llegar más lejos y beneficiar a más comunidades.
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
              Cada donativo, sin importar su tipo, nos ayuda a construir un entorno mejor. Estas son las formas en que puedes colaborar:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Donativo en Especie */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg shadow-gray-200/50 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mb-6">
                <Package size={32} className="text-[#E8401C]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A2E6C] mb-3">Donativos en Especie</h3>
              <p className="text-gray-600 leading-relaxed">
                Apoya con alimentos, materiales, herramientas o equipo necesario para llevar a cabo nuestros eventos y talleres en la comunidad.
              </p>
            </div>

            {/* Aportaciones Monetarias */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg shadow-gray-200/50 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mb-6">
                <CircleDollarSign size={32} className="text-green-700" />
              </div>
              <h3 className="text-xl font-bold text-[#1A2E6C] mb-3">Aportaciones Monetarias</h3>
              <p className="text-gray-600 leading-relaxed">
                Fondos financieros para cubrir la logística, transportación e impacto directo de nuestras actividades de voluntariado.
              </p>
            </div>

            {/* Servicios Pro Bono */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg shadow-gray-200/50 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
                <HeartHandshake size={32} className="text-[#1A2E6C]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A2E6C] mb-3">Servicios Pro Bono</h3>
              <p className="text-gray-600 leading-relaxed">
                Presta un servicio profesional, logístico, publicitario o de infraestructura que tu empresa domina para potenciar nuestro alcance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULARIO CORPORATIVO */}
      <section id="registro" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-blue-900/10 border border-gray-100 relative overflow-hidden">
            
            {/* Línea decorativa */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#F5C200] via-[#E8401C] to-[#1A2E6C]" />

            {status === 'success' ? (
              <div className="text-center py-16 animate-in fade-in zoom-in duration-500">
                <div className="text-7xl mb-6">🤝</div>
                <h3 className="text-3xl font-extrabold text-[#1A2E6C] mb-4">¡Gracias por su apoyo!</h3>
                <p className="text-lg text-gray-600 max-w-lg mx-auto mb-8">
                  Hemos recibido la información de su empresa. Nuestro equipo de vinculación se pondrá en contacto pronto para coordinar los siguientes pasos.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="bg-[#1A2E6C] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#2a4393] transition-colors"
                >
                  Registrar otra colaboración
                </button>
              </div>
            ) : (
              <>
                <div className="mb-10 text-center">
                  <h2 className="text-3xl font-extrabold text-[#1A2E6C] mb-3">Registro de Empresa Aliada</h2>
                  <p className="text-gray-500">Déjenos sus datos y cuéntenos cómo les gustaría sumarse.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Datos de Contacto */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Representante *</label>
                      <input required name="name" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A2E6C]/20 focus:border-[#1A2E6C] transition-all bg-gray-50 focus:bg-white" placeholder="Ej. Ana Martínez" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre de la Empresa *</label>
                      <input required name="company" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A2E6C]/20 focus:border-[#1A2E6C] transition-all bg-gray-50 focus:bg-white" placeholder="Ej. Grupo X" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono *</label>
                      <input required name="phone" type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A2E6C]/20 focus:border-[#1A2E6C] transition-all bg-gray-50 focus:bg-white" placeholder="Teléfono de contacto" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Correo Corporativo *</label>
                      <input required name="email" type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A2E6C]/20 focus:border-[#1A2E6C] transition-all bg-gray-50 focus:bg-white" placeholder="ana@grupox.com" />
                    </div>
                  </div>

                  <hr className="border-gray-100 my-8" />

                  {/* Tipos de Apoyo */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1A2E6C] mb-4">¿De qué manera les gustaría apoyar? (Selecciona una o varias) *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:border-[#1A2E6C] hover:bg-blue-50/30 transition-all">
                        <input type="checkbox" name="support_especie" value="yes" className="w-5 h-5 text-[#1A2E6C] focus:ring-[#1A2E6C] rounded" />
                        <span className="font-medium text-gray-700">Donativo en Especie</span>
                      </label>
                      <label className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:border-[#1A2E6C] hover:bg-blue-50/30 transition-all">
                        <input type="checkbox" name="support_monetario" value="yes" className="w-5 h-5 text-[#1A2E6C] focus:ring-[#1A2E6C] rounded" />
                        <span className="font-medium text-gray-700">Aportación Monetaria</span>
                      </label>
                      <label className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:border-[#1A2E6C] hover:bg-blue-50/30 transition-all">
                        <input type="checkbox" name="support_servicios" value="yes" className="w-5 h-5 text-[#1A2E6C] focus:ring-[#1A2E6C] rounded" />
                        <span className="font-medium text-gray-700">Servicios Pro Bono</span>
                      </label>
                      <label className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:border-[#1A2E6C] hover:bg-blue-50/30 transition-all">
                        <input type="checkbox" name="support_otro" value="yes" className="w-5 h-5 text-[#1A2E6C] focus:ring-[#1A2E6C] rounded" />
                        <span className="font-medium text-gray-700">Otro</span>
                      </label>
                    </div>
                  </div>

                  {/* Detalles del Donativo */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Detalles del Apoyo *</label>
                    <p className="text-xs text-gray-500 mb-3">Por favor describa brevemente el tipo de producto, servicio o aportación que desean realizar.</p>
                    <textarea required name="description" rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A2E6C]/20 focus:border-[#1A2E6C] transition-all bg-gray-50 focus:bg-white resize-y" placeholder="Nos gustaría donar 50 paquetes de botellas de agua..." />
                  </div>

                  {status === 'error' && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
                      Ocurrió un error al enviar la información. Por favor, intente de nuevo.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className={`w-full mt-4 py-4 px-6 rounded-xl font-bold text-lg text-white flex items-center justify-center gap-2 transition-all duration-200 
                      ${status === 'loading' ? 'bg-[#1A2E6C]/70 cursor-not-allowed' : 'bg-[#1A2E6C] hover:bg-[#2a4393] shadow-lg shadow-blue-900/20 active:scale-[0.98]'}`}
                  >
                    {status === 'loading' ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={20} />
                        Enviar Propuesta
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
