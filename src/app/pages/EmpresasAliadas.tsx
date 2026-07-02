import { useState, type FormEvent } from "react";
import { Building2, Package, CircleDollarSign, HeartHandshake, Send, ClipboardEdit } from "lucide-react";
import { NUEVO_LEON_MUNICIPALITIES } from "../municipalities";

const AREAS_IMPACTO = [
  "Infancia Vulnerable",
  "Dignidad en la Vejez",
  "Mujeres y Empoderamiento",
  "Inclusión y Discapacidad",
  "Conciencia Ambiental",
  "Hambre y Solidaridad",
  "Migración y Hospitalidad",
  "Derecho a la Educación",
  "Derecho a la Vivienda",
];

export function EmpresasAliadasPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);

    const tiposApoyo: string[] = [];
    if (formData.get('support_especie')) tiposApoyo.push('Donativo en Especie');
    if (formData.get('support_monetario')) tiposApoyo.push('Aportación Monetaria');
    if (formData.get('support_servicios')) tiposApoyo.push('Servicios Pro Bono');
    if (formData.get('support_otro')) tiposApoyo.push('Otro');

    const areasInteres = AREAS_IMPACTO.filter((_, i) => formData.get(`area_${i}`));

    const data = {
      nombre_representante: formData.get('name'),
      puesto: formData.get('puesto'),
      empresa: formData.get('company'),
      sector: formData.get('sector'),
      tamano: formData.get('tamano'),
      telefono: formData.get('phone'),
      correo: formData.get('email'),
      municipio: formData.get('municipio'),
      tipos_apoyo: tiposApoyo,
      descripcion: formData.get('description'),
      areas_interes: areasInteres,
      experiencia_rse: formData.get('rse'),
      referido: formData.get('referido'),
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Datos de Empresa Aliada:", data);
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
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-blue-900/10 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#F5C200] via-[#E8401C] to-[#1A2E6C]" />

            {status === 'success' ? (
              <div className="text-center py-16">
                <div className="text-7xl mb-6">🤝</div>
                <h3 className="text-3xl font-extrabold text-[#1A2E6C] mb-4">¡Gracias por su apoyo!</h3>
                <p className="text-lg text-gray-600 max-w-lg mx-auto mb-8">
                  Hemos recibido la información de su empresa. Nuestro equipo de vinculación se pondrá en contacto pronto para coordinar los siguientes pasos.
                </p>
                <button onClick={() => setStatus('idle')} className="bg-[#1A2E6C] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#2a4393] transition-colors">
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

                  {/* SECCIÓN 1 — Datos del representante */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Nombre del Representante *</label>
                      <input required name="name" type="text" className={inputClass} placeholder="Ej. Ana Martínez" />
                    </div>
                    <div>
                      <label className={labelClass}>Puesto / Cargo</label>
                      <input name="puesto" type="text" className={inputClass} placeholder="Ej. Directora de RSE" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Teléfono de contacto *</label>
                      <input required name="phone" type="tel" className={inputClass} placeholder="Teléfono directo" />
                    </div>
                    <div>
                      <label className={labelClass}>Correo Corporativo *</label>
                      <input required name="email" type="email" className={inputClass} placeholder="ana@grupox.com" />
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  {/* SECCIÓN 2 — Datos de la empresa */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Nombre de la Empresa *</label>
                      <input required name="company" type="text" className={inputClass} placeholder="Ej. Grupo Industrial X" />
                    </div>
                    <div>
                      <label className={labelClass}>Sector / Industria *</label>
                      <select required name="sector" defaultValue="" className={inputClass} style={{ backgroundColor: 'white' }}>
                        <option value="" disabled>Selecciona un sector</option>
                        <option>Manufactura e Industria</option>
                        <option>Comercio y Retail</option>
                        <option>Servicios Profesionales</option>
                        <option>Tecnología</option>
                        <option>Salud y Farmacéutica</option>
                        <option>Educación</option>
                        <option>Construcción e Inmobiliaria</option>
                        <option>Alimentos y Bebidas</option>
                        <option>Logística y Transporte</option>
                        <option>Otro</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Municipio donde operan *</label>
                      <select required name="municipio" defaultValue="" className={inputClass} style={{ backgroundColor: 'white' }}>
                        <option value="" disabled>Selecciona un municipio</option>
                        {NUEVO_LEON_MUNICIPALITIES.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1A2E6C] mb-3">Número de empleados *</label>
                      <div className="space-y-2">
                        {["1–10", "11–50", "51–200", "201–500", "500+"].map((opt) => (
                          <label key={opt} className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:border-[#1A2E6C] transition-colors">
                            <input type="radio" name="tamano" value={opt} className="w-4 h-4 accent-[#1A2E6C]" required />
                            <span className="text-sm font-medium text-gray-700">{opt} empleados</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  {/* SECCIÓN 3 — Tipo de apoyo */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1A2E6C] mb-4">¿De qué manera les gustaría apoyar? (Selecciona una o varias) *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { name: "support_especie", label: "Donativo en Especie" },
                        { name: "support_monetario", label: "Aportación Monetaria" },
                        { name: "support_servicios", label: "Servicios Pro Bono" },
                        { name: "support_otro", label: "Otro" },
                      ].map(({ name, label }) => (
                        <label key={name} className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:border-[#1A2E6C] hover:bg-blue-50/30 transition-all">
                          <input type="checkbox" name={name} className="w-5 h-5 accent-[#1A2E6C] rounded" />
                          <span className="font-medium text-gray-700 text-sm">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Detalles del Apoyo *</label>
                    <p className="text-xs text-gray-500 mb-3">Por favor describa brevemente el tipo de producto, servicio o aportación que desean realizar.</p>
                    <textarea required name="description" rows={4} className={inputClass + " resize-y"} placeholder="Nos gustaría donar 50 paquetes de botellas de agua..." />
                  </div>

                  <hr className="border-gray-100" />

                  {/* SECCIÓN 4 — Preferencias e impacto */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1A2E6C] mb-2">¿En qué áreas de impacto les gustaría colaborar?</label>
                    <p className="text-xs text-gray-500 mb-4">Esto nos ayuda a conectarlos con los eventos más afines a sus valores.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {AREAS_IMPACTO.map((area, i) => (
                        <label key={area} className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:border-[#1A2E6C] hover:bg-blue-50/30 transition-all">
                          <input type="checkbox" name={`area_${i}`} className="w-4 h-4 accent-[#1A2E6C] rounded" />
                          <span className="text-sm font-medium text-gray-700">{area}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#1A2E6C] mb-3">¿Han realizado actividades de RSE anteriormente? *</label>
                      <div className="space-y-2">
                        {[
                          "Sí, tenemos programa de RSE activo",
                          "Sí, pero de forma esporádica",
                          "No, sería nuestra primera vez",
                        ].map((opt) => (
                          <label key={opt} className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:border-[#1A2E6C] transition-colors">
                            <input type="radio" name="rse" value={opt} className="w-4 h-4 accent-[#1A2E6C]" required />
                            <span className="text-sm font-medium text-gray-700">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>¿Cómo nos conocieron? *</label>
                      <select required name="referido" defaultValue="" className={inputClass} style={{ backgroundColor: 'white' }}>
                        <option value="" disabled>Selecciona una opción</option>
                        <option>Redes sociales</option>
                        <option>Recomendación de otra empresa</option>
                        <option>Un colaborador nos invitó</option>
                        <option>Evento previo de EZER</option>
                        <option>Google / Búsqueda web</option>
                        <option>Medios de comunicación</option>
                        <option>Otro</option>
                      </select>
                    </div>
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
