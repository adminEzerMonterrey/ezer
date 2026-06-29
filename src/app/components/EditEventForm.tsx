import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { EVENT_CATEGORIES } from '../eventCategories';
import { NUEVO_LEON_MUNICIPALITIES } from '../municipalities';

export function EditEventForm({
  initialData,
  onEventUpdated,
  onCancel
}: {
  initialData: any;
  onEventUpdated: () => void;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [municipios, setMunicipios] = useState<string[]>(
    initialData.municipio ? initialData.municipio.split(',').map((s: string) => s.trim()) : ['Monterrey']
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const titleVal = formData.get('title_input');

    if (municipios.length === 0) {
      setError('Debes seleccionar al menos un municipio.');
      setLoading(false);
      return;
    }

    let finalImageUrl = initialData.image_url || null;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Tu sesión de administrador expiró. Cierra sesión, vuelve a iniciar sesión e intenta guardar otra vez.');

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

      const updatePayload: any = {
        company: 'EZER',
        objective: formData.get('category'),
        municipio: municipios.join(', '),
        target_audience: initialData.target_audience || 'Público General',
        description: formData.get('description'),
        coordinador: formData.get('coordinador'),
        asociacion: formData.get('asociacion'),
        asociacion_municipio: formData.get('asociacion_municipio'),
        image_url: finalImageUrl,
        flyer_url: formData.get('flyer_url') || null,
        sensibilization_course_url: formData.get('sensibilization_course_url') || null,
        is_annual: formData.get('is_annual') === 'on',
      };

      if (initialData.hasOwnProperty('name')) updatePayload.name = titleVal;
      if (initialData.hasOwnProperty('title')) updatePayload.title = titleVal;
      if (!initialData.hasOwnProperty('name') && !initialData.hasOwnProperty('title')) {
        updatePayload.name = titleVal;
      }

      // Intentamos usar la API primero para saltar las reglas RLS en producción
      let apiSuccess = false;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const response = await fetch('/api/admin-events', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(session ? { Authorization: `Bearer ${session.access_token}` } : {})
          },
          body: JSON.stringify({ id: initialData.id, event: updatePayload }),
        });

        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            apiSuccess = true;
          }
        }
      } catch (e) {
        console.warn("Error usando API de actualización:", e);
      }

      // Si la API falló (ej. desarrollo local Vite), usamos actualización directa
      if (!apiSuccess) {
        const { data, error: updateError } = await supabase
          .from('events')
          .update(updatePayload)
          .eq('id', initialData.id)
          .select('*');

        if (updateError) throw updateError;
        
        if (!data || data.length === 0) {
          throw new Error("No se pudo actualizar. La seguridad (RLS) bloquea la actualización directa y la API falló (¿Estás en desarrollo local?).");
        }
      }

      alert('¡Evento actualizado exitosamente!');
      onEventUpdated();
    } catch (err: any) {
      alert(`No se pudo actualizar el evento:\n${err.message}`);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'white' }}>
      {error && <div style={{ color: '#E8401C', marginBottom: '10px' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Título</label>
          <input required defaultValue={initialData.name || initialData.title} name="title_input" type="text" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Sector beneficiado</label>
          <select required defaultValue={initialData.objective} name="category" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: 'white' }}>
            {EVENT_CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '8px' }}>Municipios</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px', maxHeight: '200px', overflowY: 'auto', padding: '12px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: 'white' }}>
            {NUEVO_LEON_MUNICIPALITIES.map((municipality) => (
              <label key={municipality} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                <input type="checkbox" checked={municipios.includes(municipality)} onChange={(e) => {
                  if (e.target.checked) setMunicipios([...municipios, municipality]);
                  else setMunicipios(municipios.filter(m => m !== municipality));
                }} style={{ accentColor: '#E8401C' }} />
                {municipality}
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Coordinador (Solo visible para administrador)</label>
          <input required defaultValue={initialData.coordinador} name="coordinador" type="text" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} placeholder="Nombre del coordinador" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Asociación responsable (opcional)</label>
          <input defaultValue={initialData.asociacion || ''} name="asociacion" type="text" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} placeholder="Nombre de la asociación" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Municipio de la asociación</label>
          <select defaultValue={initialData.asociacion_municipio || ''} name="asociacion_municipio" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: 'white' }}>
            <option value="">— Selecciona —</option>
            {NUEVO_LEON_MUNICIPALITIES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#4B5563', cursor: 'pointer' }}>
            <input name="is_annual" type="checkbox" defaultChecked={!!initialData.is_annual} style={{ width: '16px', height: '16px', accentColor: '#E8401C' }} />
            Este es un evento anual (Se repite cada año, ej: Día del niño)
          </label>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Imagen del evento (opcional)</label>
          {initialData.image_url && (
            <div style={{ marginBottom: '8px' }}>
              <img src={initialData.image_url} alt="Actual" style={{ height: '100px', borderRadius: '4px', objectFit: 'cover' }} />
            </div>
          )}
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} 
          />
          <p style={{ fontSize: '11px', color: '#9CA3AF', margin: '4px 0 0' }}>Sube un nuevo archivo para reemplazar la imagen actual</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>URL del Flyer en Google Drive (opcional)</label>
          <input defaultValue={initialData.flyer_url || ''} name="flyer_url" type="url" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} placeholder="https://drive.google.com/file/d/..." />
          <p style={{ fontSize: '11px', color: '#9CA3AF', margin: '4px 0 0' }}>Link directo del PDF en Google Drive</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>URL del Curso de Sensibilización en Google Drive (opcional)</label>
          <input defaultValue={initialData.sensibilization_course_url || ''} name="sensibilization_course_url" type="url" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} placeholder="https://drive.google.com/file/d/..." />
          <p style={{ fontSize: '11px', color: '#9CA3AF', margin: '4px 0 0' }}>Link directo del PDF en Google Drive</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Descripción</label>
          <textarea required defaultValue={initialData.description} name="description" rows={3} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', resize: 'vertical' }}></textarea>
        </div>

        <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button type="button" onClick={onCancel} disabled={loading} style={{ backgroundColor: 'white', color: '#4B5563', border: '1px solid #D1D5DB', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
            Cancelar
          </button>
          <button type="submit" disabled={loading} style={{ backgroundColor: '#1A2E6C', color: 'white', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Guardando...' : 'Actualizar'}
          </button>
        </div>
      </form>
    </div>
  );
}
