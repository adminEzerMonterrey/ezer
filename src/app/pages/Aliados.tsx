import { useState, type FormEvent } from "react";
import { Star, CheckCircle2, ClipboardEdit, Send, CalendarCheck } from "lucide-react";
import { NUEVO_LEON_MUNICIPALITIES } from "../municipalities";

export function AliadosPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);

    const disponibilidad: string[] = [];
    if (formData.get('disp_mananas')) disponibilidad.push('Mañanas entre semana');
    if (formData.get('disp_tardes')) disponibilidad.push('Tardes entre semana');
    if (formData.get('disp_sabados')) disponibilidad.push('Sábados');
    if (formData.get('disp_domingos')) disponibilidad.push('Domingos');

    const talentos: string[] = [
      ['talento_dj', 'DJ / Música'],
      ['talento_musico', 'Músico / Banda'],
      ['talento_payaso', 'Payaso / Animador'],
      ['talento_chef', 'Chef / Cocina'],
      ['talento_foto', 'Fotógrafo / Video'],
      ['talento_medico', 'Médico / Salud'],
      ['talento_psicologo', 'Psicólogo / Terapeuta'],
      ['talento_magia', 'Mago / Show'],
      ['talento_deporte', 'Deportes / Activación'],
      ['talento_arte', 'Arte / Manualidades'],
      ['talento_belleza', 'Estética / Belleza'],
      ['talento_otro', 'Otro talento'],
    ].filter(([name]) => formData.get(name)).map(([, label]) => label);

    const data = {
      nombre: formData.get('name'),
      correo: formData.get('email'),
      telefono: formData.get('phone'),
      municipio: formData.get('municipio'),
      habilidades: formData.get('skills'),
      ofreceCurso: formData.get('offers_course') === 'yes',
      grupoSize: formData.get('group_size'),
      talentos,
      disponibilidad,
      experienciaPrevia: formData.get('experiencia'),
      comoNosConocio: formData.get('referido'),
      comentarios: formData.get('comments'),
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Datos de Aliado Voluntario:", data);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A2E6C]/20 focus:border-[#1A2E6C] transition-all bg-gray-50 focus:bg-white text-sm";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

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
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-blue-900/5 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1A2E6C] via-[#E8401C] to-[#F5C200]" />

            {status === 'success' ? (
              <div className="text-center py-16">
                <div className="text-7xl mb-6">🎉</div>
                <h3 className="text-3xl font-extrabold text-[#1A2E6C] mb-4">¡Gracias por querer sumar!</h3>
                <p className="text-lg text-gray-600 max-w-lg mx-auto mb-8">
                  Hemos recibido tu información. Nuestro equipo revisará tu perfil y te contactaremos cuando tengamos el evento perfecto para tus habilidades.
                </p>
                <button onClick={() => setStatus('idle')} className="bg-[#1A2E6C] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#2a4393] transition-colors">
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

                  {/* SECCIÓN 1 — Datos personales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Nombre completo *</label>
                      <input required name="name" type="text" className={inputClass} placeholder="Ej. Juan Pérez" />
                    </div>
                    <div>
                      <label className={labelClass}>Teléfono *</label>
                      <input required name="phone" type="tel" className={inputClass} placeholder="Tu celular" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Correo electrónico *</label>
                      <input required name="email" type="email" className={inputClass} placeholder="juan@ejemplo.com" />
                    </div>
                    <div>
                      <label className={labelClass}>Municipio donde te encuentras *</label>
                      <select required name="municipio" defaultValue="" className={inputClass} style={{ backgroundColor: 'white' }}>
                        <option value="" disabled>Selecciona tu municipio</option>
                        {NUEVO_LEON_MUNICIPALITIES.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  {/* SECCIÓN 2 — Talento */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1A2E6C] mb-2">¿Tienes algún talento especial que quieras compartir?</label>
                    <p className="text-xs text-gray-500 mb-4">Selecciona todas las que apliquen. Esto nos ayuda a conectarte con los eventos que más se adaptan a lo que haces.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { name: "talento_dj", label: "DJ / Música", icon: "🎧" },
                        { name: "talento_musico", label: "Músico / Banda", icon: "🎸" },
                        { name: "talento_payaso", label: "Payaso / Animador", icon: "🎪" },
                        { name: "talento_chef", label: "Chef / Cocina", icon: "👨‍🍳" },
                        { name: "talento_foto", label: "Fotógrafo / Video", icon: "📷" },
                        { name: "talento_medico", label: "Médico / Salud", icon: "🏥" },
                        { name: "talento_psicologo", label: "Psicólogo / Terapeuta", icon: "🧠" },
                        { name: "talento_magia", label: "Mago / Show", icon: "🎩" },
                        { name: "talento_deporte", label: "Deportes / Activación", icon: "⚽" },
                        { name: "talento_arte", label: "Arte / Manualidades", icon: "🎨" },
                        { name: "talento_belleza", label: "Estética / Belleza", icon: "💇" },
                        { name: "talento_otro", label: "Otro talento", icon: "✨" },
                      ].map(({ name, label, icon }) => (
                        <label key={name} className="flex items-center gap-2.5 p-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:border-[#1A2E6C] hover:bg-blue-50/30 transition-all">
                          <input type="checkbox" name={name} className="w-4 h-4 accent-[#1A2E6C] rounded flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-700 leading-tight">{icon} {label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>¿Qué habilidades o servicios ofreces? *</label>
                    <p className="text-xs text-gray-500 mb-3">Descríbenos con más detalle lo que haces. Cuanto más específico, mejor podemos conectarte.</p>
                    <textarea required name="skills" rows={3} className={inputClass + " resize-y"} placeholder="Cuento con equipo de sonido y luces, puedo tocar 3 horas seguidas..." />
                  </div>

                  <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                    <label className="block text-sm font-semibold text-[#1A2E6C] mb-4">¿Tienes conocimientos o material para impartir algún curso o taller? *</label>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <label className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-[#1A2E6C] transition-colors flex-1">
                        <input type="radio" name="offers_course" value="yes" className="w-5 h-5 accent-[#1A2E6C]" required />
                        <span className="font-medium text-gray-700 text-sm">Sí, puedo impartir cursos</span>
                      </label>
                      <label className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-[#1A2E6C] transition-colors flex-1">
                        <input type="radio" name="offers_course" value="no" className="w-5 h-5 accent-[#1A2E6C]" required />
                        <span className="font-medium text-gray-700 text-sm">No, solo ofrezco mis servicios</span>
                      </label>
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  {/* SECCIÓN 3 — Logística */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#1A2E6C] mb-4">¿Con cuántas personas puedes participar? *</label>
                      <div className="space-y-3">
                        {["Solo (1 persona)", "Pequeño grupo (2–5)", "Grupo mediano (6–15)", "Grupo grande (16+)"].map((opt) => (
                          <label key={opt} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:border-[#1A2E6C] transition-colors">
                            <input type="radio" name="group_size" value={opt} className="w-4 h-4 accent-[#1A2E6C]" required />
                            <span className="text-sm font-medium text-gray-700">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#1A2E6C] mb-4">¿Cuándo tienes disponibilidad? (Selecciona los que apliquen)</label>
                      <div className="space-y-3">
                        {[
                          { name: "disp_mananas", label: "Mañanas entre semana" },
                          { name: "disp_tardes", label: "Tardes entre semana" },
                          { name: "disp_sabados", label: "Sábados" },
                          { name: "disp_domingos", label: "Domingos" },
                        ].map(({ name, label }) => (
                          <label key={name} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:border-[#1A2E6C] hover:bg-blue-50/30 transition-all">
                            <input type="checkbox" name={name} className="w-4 h-4 accent-[#1A2E6C] rounded" />
                            <span className="text-sm font-medium text-gray-700">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  {/* SECCIÓN 4 — Contexto */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>¿Tienes experiencia previa en voluntariado? *</label>
                      <select required name="experiencia" defaultValue="" className={inputClass} style={{ backgroundColor: 'white' }}>
                        <option value="" disabled>Selecciona una opción</option>
                        <option>Sí, he participado varias veces</option>
                        <option>Sí, pero pocas veces</option>
                        <option>No, sería mi primera vez</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>¿Cómo nos conociste? *</label>
                      <select required name="referido" defaultValue="" className={inputClass} style={{ backgroundColor: 'white' }}>
                        <option value="" disabled>Selecciona una opción</option>
                        <option>Redes sociales</option>
                        <option>Recomendación de un amigo</option>
                        <option>Mi empresa me invitó</option>
                        <option>Evento previo de EZER</option>
                        <option>Google / Búsqueda web</option>
                        <option>Otro</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Comentarios adicionales</label>
                    <p className="text-xs text-gray-500 mb-3">Horarios disponibles, zonas donde te mueves, etc.</p>
                    <textarea name="comments" rows={3} className={inputClass + " resize-y"} placeholder="Puedo moverme dentro de la ZMM los fines de semana..." />
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
