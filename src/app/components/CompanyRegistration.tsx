import { useState } from "react";
import { supabase } from "../../supabaseClient";

export function CompanyRegistration() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      company: formData.get('company'),
      email: formData.get('email'),
      description: formData.get('description'),
      wantsTraining: formData.get('wants_training') === 'on',
      eventName: 'Registro General de Empresas'
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
    <section className="pt-8 pb-12 md:pt-16 md:pb-24" style={{ backgroundColor: "#FFFFFF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 style={{ color: "#1A2E6C", fontWeight: 800, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", lineHeight: 1.2 }}>
            Registro para Empresas
          </h2>
          <p style={{ color: "#6B7280", marginTop: 12 }} className="mx-auto text-base">
            Únete como empresa y participa en voluntariados corporativos. Completa los datos y nos pondremos en contacto.
          </p>
        </div>

        <div style={{ backgroundColor: '#F9FAFB', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '30px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
          {status === 'success' ? (
            <div className="text-center py-8">
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>✨</div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1A2E6C', marginBottom: '8px' }}>¡Solicitud Enviada!</h3>
              <p style={{ color: '#4B5563', fontSize: '14px', marginBottom: '24px' }}>
                Nos pondremos en contacto contigo pronto. ¡Gracias por tu interés en Ezer!
              </p>
              <button
                onClick={() => setStatus('idle')}
                style={{ backgroundColor: '#1A2E6C', color: 'white', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#162560'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1A2E6C'}
              >
                Enviar otra solicitud
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Tu Nombre completo *</label>
                <input required name="name" type="text" style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '15px' }} placeholder="Tu nombre" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Nombre de la Empresa *</label>
                <input required name="company" type="text" style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '15px' }} placeholder="Tu empresa" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Teléfono *</label>
                  <input required name="phone" type="tel" style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '15px' }} placeholder="Tu teléfono o celular" />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Correo Electrónico *</label>
                  <input required name="email" type="email" style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '15px' }} placeholder="correo@ejemplo.com" />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Descripción / Comentarios *</label>
                <textarea required name="description" rows={4} style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', resize: 'vertical', fontSize: '15px' }} placeholder="Cuenta por qué te interesa participar..."></textarea>
              </div>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#FFFFFF',
                  color: '#1A2E6C',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                className="hover:bg-gray-50"
              >
                <input
                  name="wants_training"
                  type="checkbox"
                  style={{ width: '18px', height: '18px', accentColor: '#E8401C', cursor: 'pointer' }}
                />
                ¿Quieres capacitación para tu empresa?
              </label>

              {status === 'error' && <p style={{ color: '#E8401C', fontSize: '14px', fontWeight: 500 }}>Hubo un error al enviar tu solicitud. Por favor intenta de nuevo.</p>}

              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  backgroundColor: '#E8401C',
                  color: 'white',
                  padding: '16px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '16px',
                  border: 'none',
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  opacity: status === 'loading' ? 0.7 : 1,
                  marginTop: '12px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => !status && (e.currentTarget.style.backgroundColor = '#C73212')}
                onMouseLeave={(e) => !status && (e.currentTarget.style.backgroundColor = '#E8401C')}
              >
                {status === 'loading' ? 'Enviando...' : 'Enviar Solicitud de Empresa'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
