import { useState } from "react";
import { Star, CheckCircle2, ClipboardEdit, Send, CalendarCheck, X } from "lucide-react";

export function AliadosPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    // Mapear los datos del formulario
    const formData = new FormData(e.currentTarget);
    const data = {
      nombre: formData.get('name'),
      correo: formData.get('email'),
      telefono: formData.get('phone'),
      habilidades: formData.get('skills'),
      ofreceCurso: formData.get('offers_course') === 'yes',
      comentarios: formData.get('comments'),
    };

    try {
      // Por ahora mandaremos al endpoint de contacto o de aliados
      // Como el usuario no confirmó, enviaremos al endpoint general o simularemos éxito.
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulando carga
      console.log("Datos de Aliado Voluntario:", data);
      
      // TODO: Conectar a Supabase / webhook real cuando se defina
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="bg-white">
      {/* HERO SECTION */}
      <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#F8FAFC] to-[#EEF2FF] overflow-hidden">
        {/* Decoraciones de fondo */}
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
            En EZER creemos que cada talento suma. Si eres DJ, fotógrafo, payaso, ofreces algún curso, o tienes habilidades que quieras compartir para generar impacto social, ¡te estamos buscando! Tu servicio puede hacer la diferencia en nuestros próximos eventos.
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
            {/* Línea conectora (visible en desktop) */}
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent -z-10" />

            {/* Paso 1 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl shadow-gray-200/40 text-center relative z-10 transition-transform duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-6 rotate-3">
                <ClipboardEdit size={32} className="text-[#E8401C]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A2E6C] mb-3">1. Regístrate</h3>
              <p className="text-gray-500 leading-relaxed">
                Llena el formulario con tus datos y cuéntanos sobre tus habilidades, servicios especiales o los cursos que puedes impartir.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl shadow-gray-200/40 text-center relative z-10 transition-transform duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-6 -rotate-3">
                <CheckCircle2 size={32} className="text-[#1A2E6C]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A2E6C] mb-3">2. Revisión</h3>
              <p className="text-gray-500 leading-relaxed">
                Nuestro equipo revisará tu perfil detalladamente para encontrar las mejores oportunidades donde tu talento destaque.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl shadow-gray-200/40 text-center relative z-10 transition-transform duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center mx-auto mb-6 rotate-3">
                <CalendarCheck size={32} className="text-[#D97706]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A2E6C] mb-3">3. Participa</h3>
              <p className="text-gray-500 leading-relaxed">
                Te enviaremos un correo de invitación cuando tengamos un evento en puerta que necesite de tu magia y habilidades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULARIO */}
      <section id="registro" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-blue-900/5 border border-gray-100 relative overflow-hidden">
            
            {/* Decors */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1A2E6C] via-[#E8401C] to-[#F5C200]" />

            {status === 'success' ? (
              <div className="text-center py-16 animate-in fade-in zoom-in duration-500">
                <div className="text-7xl mb-6">🎉</div>
                <h3 className="text-3xl font-extrabold text-[#1A2E6C] mb-4">¡Gracias por querer sumar!</h3>
                <p className="text-lg text-gray-600 max-w-lg mx-auto mb-8">
                  Hemos recibido tu información. Nuestro equipo revisará tu perfil y te contactaremos en cuanto tengamos el evento perfecto para tus habilidades.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="bg-[#1A2E6C] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#2a4393] transition-colors"
                >
                  Enviar otro registro
                </button>
              </div>
            ) : (
              <>
                <div className="mb-10">
                  <h2 className="text-3xl font-extrabold text-[#1A2E6C] mb-3">Registro de Aliado Voluntario</h2>
                  <p className="text-gray-500">Completa el formulario para formar parte de nuestra base de talentos.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Datos Básicos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre completo *</label>
                      <input required name="name" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A2E6C]/20 focus:border-[#1A2E6C] transition-all bg-gray-50 focus:bg-white" placeholder="Ej. Juan Pérez" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono *</label>
                      <input required name="phone" type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A2E6C]/20 focus:border-[#1A2E6C] transition-all bg-gray-50 focus:bg-white" placeholder="Tu celular" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Correo electrónico *</label>
                    <input required name="email" type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A2E6C]/20 focus:border-[#1A2E6C] transition-all bg-gray-50 focus:bg-white" placeholder="juan@ejemplo.com" />
                  </div>

                  <hr className="border-gray-100 my-8" />

                  {/* Habilidades y Servicios */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">¿Qué habilidades o servicios ofreces? *</label>
                    <p className="text-xs text-gray-500 mb-3">Ej: Fotografía, DJ, Payaso, Terapia, Consultoría, etc. Sé lo más descriptivo posible.</p>
                    <textarea required name="skills" rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A2E6C]/20 focus:border-[#1A2E6C] transition-all bg-gray-50 focus:bg-white resize-y" placeholder="Cuento con equipo de sonido y luces..." />
                  </div>

                  {/* Cursos */}
                  <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                    <label className="block text-sm font-semibold text-[#1A2E6C] mb-4">¿Tienes conocimientos o material para impartir algún curso o taller? *</label>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <label className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-[#1A2E6C] transition-colors flex-1">
                        <input type="radio" name="offers_course" value="yes" className="w-5 h-5 text-[#1A2E6C] focus:ring-[#1A2E6C]" required />
                        <span className="font-medium text-gray-700">Sí, puedo impartir cursos</span>
                      </label>
                      <label className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-[#1A2E6C] transition-colors flex-1">
                        <input type="radio" name="offers_course" value="no" className="w-5 h-5 text-[#1A2E6C] focus:ring-[#1A2E6C]" required />
                        <span className="font-medium text-gray-700">No, solo ofrezco mis servicios</span>
                      </label>
                    </div>
                  </div>

                  {/* Comentarios Adicionales */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Comentarios adicionales</label>
                    <textarea name="comments" rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A2E6C]/20 focus:border-[#1A2E6C] transition-all bg-gray-50 focus:bg-white resize-y" placeholder="Horarios disponibles, zonas donde te mueves, etc." />
                  </div>

                  {status === 'error' && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
                      Ocurrió un error al enviar tu información. Por favor, intenta de nuevo.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg text-white flex items-center justify-center gap-2 transition-all duration-200 
                      ${status === 'loading' ? 'bg-[#1A2E6C]/70 cursor-not-allowed' : 'bg-[#1A2E6C] hover:bg-[#2a4393] shadow-lg shadow-blue-900/20 active:scale-[0.98]'}`}
                  >
                    {status === 'loading' ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={20} />
                        Enviar Registro
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
