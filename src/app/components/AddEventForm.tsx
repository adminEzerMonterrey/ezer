import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { EVENT_CATEGORIES } from '../eventCategories';
import { NUEVO_LEON_MUNICIPALITIES } from '../municipalities';

export function AddEventForm({ onEventAdded }: { onEventAdded: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('title') as string;
    const description = formData.get('description') as string;
    const objective = formData.get('category') as string;
    const municipios = formData.getAll('municipios') as string[];

    if (municipios.length === 0) {
      setError('Debes seleccionar al menos un municipio.');
      setLoading(false);
      return;
    }

    if (!image) {
      setError('Debes subir una imagen para el evento.');
      setLoading(false);
      return;
    }

    const municipio = municipios.join(', ');
    const coordinador = formData.get('coordinador') as string;
    const asociacion = formData.get('asociacion') as string;
    const asociacionMunicipio = formData.get('asociacion_municipio') as string;
    const flyerUrl = formData.get('flyer_url') as string;
    const sensibilizationCourseUrl = formData.get('sensibilization_course_url') as string;
    const isAnnual = formData.get('is_annual') === 'on';

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      let finalImageUrl = null;
      if (image) {
        const sanitizeFileName = (name: string) => {
          return name
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-zA-Z0-9.\-_]/g, '_')
            .toLowerCase();
        };
        const fileName = `events/${crypto.randomUUID()}-${sanitizeFileName(image.name)}`;
        const { error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('event-images')
          .getPublicUrl(fileName);
        
        finalImageUrl = data.publicUrl;
      }

      const { error: insertError } = await supabase
        .from('events')
        .insert([{
          name,
          company: 'EZER',
          target_audience: 'Público General',
          description,
          objective,
          municipio,
          coordinador,
          asociacion,
          asociacion_municipio: asociacionMunicipio,
          is_annual: isAnnual,
          image_url: finalImageUrl,
          flyer_url: flyerUrl || null,
          sensibilization_course_url: sensibilizationCourseUrl || null,
          user_id: user.id,
        }]);

      if (insertError) throw insertError;

      alert('Evento creado correctamente.');
      (e.target as HTMLFormElement).reset();
      setImage(null);
      onEventAdded();
    } catch (submitError: any) {
      console.error('ERROR:', submitError);
      alert(submitError.message);
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#FAFAFA', borderRadius: '8px', border: '1px solid #E5E7EB', marginBottom: '30px' }}>
      <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#1A2E6C', marginBottom: '20px' }}>Agregar Nuevo Evento</h3>
      {error && <div style={{ color: '#E8401C', marginBottom: '10px' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Título *</label>
          <input required name="title" type="text" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} placeholder="Ej. Limpieza Costera" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Sector beneficiado *</label>
          <select required name="category" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: 'white' }}>
            {EVENT_CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '8px' }}>Municipios *</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px', maxHeight: '200px', overflowY: 'auto', padding: '12px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: 'white' }}>
            {NUEVO_LEON_MUNICIPALITIES.map((municipality) => (
              <label key={municipality} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                <input type="checkbox" name="municipios" value={municipality} defaultChecked={municipality === 'Monterrey'} style={{ accentColor: '#E8401C' }} />
                {municipality}
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Coordinador (Solo visible para administrador) *</label>
          <input required name="coordinador" type="text" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} placeholder="Nombre del coordinador" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Asociación responsable (opcional)</label>
          <input name="asociacion" type="text" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} placeholder="Nombre de la asociación" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Municipio de la asociación</label>
          <select name="asociacion_municipio" defaultValue="" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: 'white' }}>
            <option value="">— Selecciona —</option>
            {NUEVO_LEON_MUNICIPALITIES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#4B5563', cursor: 'pointer' }}>
            <input name="is_annual" type="checkbox" style={{ width: '16px', height: '16px', accentColor: '#E8401C' }} />
            Este es un evento anual (Se repite cada año, ej: Día del niño)
          </label>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Imagen del evento *</label>
          <input 
            required
            type="file" 
            accept="image/*"
            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} 
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>URL del Flyer en Google Drive (opcional)</label>
          <input name="flyer_url" type="url" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} placeholder="https://drive.google.com/file/d/..." />
          <p style={{ fontSize: '11px', color: '#9CA3AF', margin: '4px 0 0' }}>Link directo del PDF en Google Drive</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>URL del Curso de Sensibilización en Google Drive (opcional)</label>
          <input name="sensibilization_course_url" type="url" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} placeholder="https://drive.google.com/file/d/..." />
          <p style={{ fontSize: '11px', color: '#9CA3AF', margin: '4px 0 0' }}>Link directo del PDF en Google Drive</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Descripción *</label>
          <textarea required name="description" rows={3} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', resize: 'vertical' }} placeholder="Describe el evento..."></textarea>
        </div>

        <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button type="submit" disabled={loading} style={{ backgroundColor: '#E8401C', color: 'white', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Guardando...' : 'Crear Evento'}
          </button>
        </div>
      </form>
    </div>
  );
}
