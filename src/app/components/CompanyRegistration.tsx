import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { NUEVO_LEON_MUNICIPALITIES } from "../municipalities";

export function CompanyRegistration() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [projects, setProjects] = useState<string[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('name')
          .order('name', { ascending: true });

        if (!error && data) {
          const uniqueNames = Array.from(new Set(data.map((e: any) => e.name).filter(Boolean)));
          setProjects(uniqueNames as string[]);
        }
      } catch (e) {
        console.error('Error fetching projects:', e);
      }
    };
    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    const selectedProjects = formData.getAll('projects') as string[];
    const municipio = (formData.get('municipio') as string) || '';
    const baseDescription = (formData.get('description') as string) || '';

    const projectsLabel = selectedProjects.length > 0 ? selectedProjects.join(', ') : 'No especificado';
    const eventName = selectedProjects.length > 0
      ? `Registro — ${selectedProjects.join(', ')}`
      : 'Registro general';
    const description = `${baseDescription}\n\nMunicipio: ${municipio || 'No especificado'}\nProyectos de interés: ${projectsLabel}`;

    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      company: formData.get('company'),
      email: formData.get('email'),
      description,
      wantsTraining: formData.get('wants_training') === 'on',
      eventName,
      municipio: municipio || 'No especificado',
      projects: selectedProjects,
      comments: baseDescription
    };

    try {
      const { error: dbError } = await supabase
        .from('interest_leads')
        .insert([{
          name: data.name,
          phone: data.phone,
          company: data.company,
          email: data.email,
          event_name: data.eventName,
          description: data.description,
          wants_training: data.wantsTraining,
        }]);

      if (dbError) {
        console.error('Error saving lead to Supabase:', dbError);
      }

      try {
        await fetch('/api/interest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } catch (emailErr) {
        console.error('Email API call failed (lead was saved to DB):', emailErr);
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <section className="pt-8 pb-12 md:pt-16 md:pb-24 bg-white font-['Plus_Jakarta_Sans']">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-[#1A2E6C] font-extrabold text-[clamp(1.75rem,4vw,2.75rem)] leading-tight">
            Registro
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-base">
            Regístrate, elige los proyectos que te interesan y tu municipio. Nos pondremos en contacto contigo.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1A2E6C] via-[#E8401C] to-[#F5C200]" />

          {status === 'success' ? (
            <div className="text-center py-16">
              <div className="text-7xl mb-6">✨</div>
              <h3 className="text-2xl font-extrabold text-[#1A2E6C] mb-4">¡Solicitud Enviada!</h3>
              <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
                Nos pondremos en contacto contigo pronto. ¡Gracias por tu interés en Ezer!
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="bg-[#1A2E6C] hover:bg-[#2a4393] text-white font-bold py-3 px-8 rounded-xl transition-all"
              >
                Enviar otra solicitud
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold text-sm mb-2">Tu Nombre completo *</label>
                  <input required name="name" type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#1A2E6C]/20 focus:border-[#1A2E6C] transition-all outline-none" placeholder="Tu nombre" />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold text-sm mb-2">Empresa / Grupo / Organización</label>
                  <input name="company" type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#1A2E6C]/20 focus:border-[#1A2E6C] transition-all outline-none" placeholder="Opcional" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold text-sm mb-2">Teléfono *</label>
                  <input required name="phone" type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#1A2E6C]/20 focus:border-[#1A2E6C] transition-all outline-none" placeholder="Tu celular" />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold text-sm mb-2">Correo Electrónico *</label>
                  <input required name="email" type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#1A2E6C]/20 focus:border-[#1A2E6C] transition-all outline-none" placeholder="correo@ejemplo.com" />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold text-sm mb-2">Municipio *</label>
                <select required name="municipio" defaultValue="" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#1A2E6C]/20 focus:border-[#1A2E6C] transition-all outline-none bg-white">
                  <option value="" disabled>Selecciona tu municipio</option>
                  {NUEVO_LEON_MUNICIPALITIES.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#1A2E6C] font-semibold text-sm mb-3">Proyectos de interés (puedes elegir varios)</label>
                {projects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    {projects.map((project) => (
                      <label key={project} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg cursor-pointer hover:border-[#1A2E6C] transition-all">
                        <input
                          type="checkbox"
                          name="projects"
                          value={project}
                          className="w-5 h-5 accent-[#E8401C] flex-shrink-0 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">{project}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm p-4 border border-dashed border-gray-300 rounded-xl bg-gray-50">
                    Por ahora no hay proyectos disponibles. Puedes contarnos tu interés en el siguiente campo.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-bold text-sm mb-2">Descripción / Comentarios *</label>
                <textarea required name="description" rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#1A2E6C]/20 focus:border-[#1A2E6C] transition-all outline-none resize-y" placeholder="Cuéntanos por qué te interesa participar..."></textarea>
              </div>

              <label className="flex items-center gap-3 p-5 bg-blue-50/50 border border-blue-100 rounded-xl cursor-pointer hover:border-[#1A2E6C] transition-all">
                <input
                  name="wants_training"
                  type="checkbox"
                  className="w-5 h-5 accent-[#E8401C] rounded flex-shrink-0"
                />
                <span className="text-[#1A2E6C] font-semibold text-sm">¿Te gustaría recibir un curso de sensibilización?</span>
              </label>

              {status === 'error' && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
                  Hubo un error al enviar tu solicitud. Por favor intenta de nuevo.
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-gradient-to-r from-[#E8401C] to-[#c73212] text-white font-extrabold py-4 px-6 rounded-xl hover:shadow-lg hover:shadow-red-900/20 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {status === 'loading' ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Enviando...</span>
                  </div>
                ) : (
                  'Enviar Registro'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
