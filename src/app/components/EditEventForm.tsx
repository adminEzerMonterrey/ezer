import { useState } from 'react';
import { supabase } from '../../supabaseClient';

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

  const formattedDate = initialData.event_date
    ? new Date(initialData.event_date).toISOString().split('T')[0]
    : initialData.date
      ? new Date(initialData.date).toISOString().split('T')[0]
      : '';

  const initialSpotsMin = initialData.spots_min ?? initialData.spots ?? 0;
  const initialSpotsMax = initialData.spots_max ?? initialData.spots ?? 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const titleVal = formData.get('title_input');
    const spotsMin = parseInt(formData.get('spots_min') as string, 10);
    const spotsMax = parseInt(formData.get('spots_max') as string, 10);

    if (!Number.isFinite(spotsMin) || !Number.isFinite(spotsMax)) {
      setError('Debes capturar un rango válido de espacios disponibles.');
      setLoading(false);
      return;
    }

    if (spotsMin < 0 || spotsMax < 0) {
      setError('Los espacios disponibles no pueden ser negativos.');
      setLoading(false);
      return;
    }

    if (spotsMin > spotsMax) {
      setError('El mínimo de espacios no puede ser mayor que el máximo.');
      setLoading(false);
      return;
    }

    const updatePayload: any = {
      company: formData.get('company'),
      date: formData.get('event_date'),
      objective: formData.get('category'),
      target_audience: formData.get('audience'),
      description: formData.get('description'),
      cost: formData.get('cost'),
      spots_min: spotsMin,
      spots_max: spotsMax,
    };

    if (initialData.hasOwnProperty('name')) updatePayload.name = titleVal;
    if (initialData.hasOwnProperty('title')) updatePayload.title = titleVal;
    if (!initialData.hasOwnProperty('name') && !initialData.hasOwnProperty('title')) {
      updatePayload.name = titleVal;
    }

    try {
      let imageUrl = initialData.image_url || initialData.image;

      if (image) {
        const fileName = `events/${crypto.randomUUID()}-${image.name}`;
        const { error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(fileName, image);

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from('event-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      const finalDataToUpdate = { ...updatePayload, image_url: imageUrl };

      const { error: updateError } = await supabase
        .from('events')
        .update(finalDataToUpdate)
        .eq('id', initialData.id);

      if (updateError) {
        throw new Error(updateError.message || 'No se pudo actualizar el evento');
      }

      onEventUpdated();
    } catch (err: any) {
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
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Empresa/Organizador</label>
          <input required name="company" type="text" value="EZER" readOnly style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#F3F4F6', color: '#6B7280' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Fecha de cierre de convocatoria</label>
          <input required defaultValue={formattedDate} name="event_date" type="date" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Categoría</label>
          <select required defaultValue={initialData.objective} name="category" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: 'white' }}>
            <option value="Niños">Niños</option>
            <option value="Mujeres">Mujeres</option>
            <option value="Adultos Mayores">Adultos Mayores</option>
            <option value="Educación">Educación</option>
            <option value="Salud">Salud</option>
            <option value="Discapacidad">Discapacidad</option>
            <option value="Medio Ambiente">Medio Ambiente</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Audiencia</label>
          <select required defaultValue={initialData.target_audience} name="audience" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: 'white' }}>
            <option value="Público General">Público General</option>
            <option value="Estudiantes">Estudiantes</option>
            <option value="Profesionistas">Profesionistas</option>
            <option value="Familias">Familias</option>
            <option value="Voluntarios Corporativos">Voluntarios Corporativos</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Espacios mínimos</label>
            <input required name="spots_min" type="number" min="0" step="1" defaultValue={initialSpotsMin} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Espacios máximos</label>
            <input required name="spots_max" type="number" min="0" step="1" defaultValue={initialSpotsMax} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Costo (Aproximado)</label>
          <input defaultValue={initialData.cost} name="cost" type="text" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} placeholder="Ej. 500 MXN o Gratuito" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
          <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
            Si el evento maneja una cantidad fija, usa el mismo valor como mínimo y máximo.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Imagen (Dejar en blanco para mantener la actual)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Descripción</label>
          <textarea required defaultValue={initialData.description} name="description" rows={3} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', resize: 'vertical' }}></textarea>
        </div>

        <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              backgroundColor: 'white',
              color: '#4B5563',
              border: '1px solid #D1D5DB',
              padding: '10px 24px',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#1A2E6C',
              color: 'white',
              padding: '10px 24px',
              borderRadius: '8px',
              fontWeight: 600,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Guardando...' : 'Actualizar'}
          </button>
        </div>
      </form>
    </div>
  );
}
