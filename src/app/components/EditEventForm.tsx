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
  const [hasFlyer, setHasFlyer] = useState(!!initialData.flyer_url);
  const [flyer, setFlyer] = useState<File | null>(null);
  const [removeFlyer, setRemoveFlyer] = useState(false);
  const [hasFicha, setHasFicha] = useState(!!initialData.ficha_tecnica_url);
  const [ficha, setFicha] = useState<File | null>(null);
  const [removeFicha, setRemoveFicha] = useState(false);

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

    if (municipios.length === 0) {
      setError('Debes seleccionar al menos un municipio.');
      setLoading(false);
      return;
    }

    const updatePayload: any = {
      company: 'EZER',
      date: formData.get('event_date'),
      objective: formData.get('category'),
      municipio: municipios.join(', '),
      target_audience: initialData.target_audience || 'Público General',
      description: formData.get('description'),
      cost: formData.get('cost'),
      coordinador: formData.get('coordinador'),
      is_annual: formData.get('is_annual') === 'on',
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

      let flyerUrl = initialData.flyer_url;

      if (removeFlyer && !flyer) {
        flyerUrl = null;
      } else if (flyer) {
        const flyerFileName = `flyers/${crypto.randomUUID()}-${flyer.name}`;
        const { error: flyerUploadError } = await supabase.storage
          .from('event-images')
          .upload(flyerFileName, flyer);

        if (flyerUploadError) throw flyerUploadError;

        const { data: flyerData } = supabase.storage
          .from('event-images')
          .getPublicUrl(flyerFileName);
          
        flyerUrl = flyerData.publicUrl;
      }

      let fichaUrl = initialData.ficha_tecnica_url;

      if (removeFicha && !ficha) {
        fichaUrl = null;
      } else if (ficha) {
        const fichaFileName = `fichas/${crypto.randomUUID()}-${ficha.name}`;
        const { error: fichaUploadError } = await supabase.storage
          .from('event-images')
          .upload(fichaFileName, ficha);

        if (fichaUploadError) throw fichaUploadError;

        const { data: fichaData } = supabase.storage
          .from('event-images')
          .getPublicUrl(fichaFileName);
          
        fichaUrl = fichaData.publicUrl;
      }

      const finalDataToUpdate = { ...updatePayload, image_url: imageUrl, flyer_url: flyerUrl, ficha_tecnica_url: fichaUrl };
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error('Tu sesión de administrador expiró. Cierra sesión, vuelve a iniciar sesión e intenta guardar otra vez.');
      }

      const response = await fetch('/api/admin-events', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          id: initialData.id,
          event: finalDataToUpdate,
        }),
      });

      let responseData: any = {};
      try {
        responseData = await response.json();
      } catch {
        // La API deberia responder JSON, pero evitamos ocultar el status real.
      }

      if (!response.ok) {
        throw new Error(responseData.message || `No se pudo actualizar el evento. Status ${response.status}`);
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
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Fecha de cierre de convocatoria</label>
          <input required defaultValue={formattedDate} name="event_date" type="date" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
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
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
            gap: '8px',
            maxHeight: '200px',
            overflowY: 'auto',
            padding: '12px',
            borderRadius: '6px', 
            border: '1px solid #D1D5DB', 
            backgroundColor: 'white' 
          }}>
            {NUEVO_LEON_MUNICIPALITIES.map((municipality) => (
              <label key={municipality} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={municipios.includes(municipality)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setMunicipios([...municipios, municipality]);
                    } else {
                      setMunicipios(municipios.filter(m => m !== municipality));
                    }
                  }}
                  style={{ accentColor: '#E8401C' }} 
                />
                {municipality}
              </label>
            ))}
          </div>
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
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Cuota de recuperación</label>
          <input defaultValue={initialData.cost} name="cost" type="text" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} placeholder="Ej. 500 MXN o Gratuito" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
          <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
            Si el evento maneja una cantidad fija, usa el mismo valor como mínimo y máximo.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Coordinador (Solo visible para administrador)</label>
          <input required defaultValue={initialData.coordinador} name="coordinador" type="text" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} placeholder="Nombre del coordinador" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#4B5563', cursor: 'pointer' }}>
            <input name="is_annual" type="checkbox" defaultChecked={!!initialData.is_annual} style={{ width: '16px', height: '16px', accentColor: '#E8401C' }} />
            Este es un evento anual (Se repite cada año, ej: Día del niño)
          </label>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Imagen del evento (Dejar en blanco para mantener la actual)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#4B5563', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={hasFlyer}
              onChange={(e) => {
                setHasFlyer(e.target.checked);
                if (!e.target.checked) setRemoveFlyer(true);
                else setRemoveFlyer(false);
              }}
              style={{ width: '16px', height: '16px', accentColor: '#E8401C' }} 
            />
            ¿Este evento tiene un flyer con más información?
          </label>
        </div>

        {hasFlyer && (
          <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>
              Archivo de Flyer (PDF o Imagen) {initialData.flyer_url && !removeFlyer ? '(Dejar en blanco para mantener el actual)' : '*'}
            </label>
            {initialData.flyer_url && !removeFlyer && !flyer && (
              <div style={{ marginBottom: '8px', fontSize: '13px' }}>
                <a href={initialData.flyer_url} target="_blank" rel="noopener noreferrer" style={{ color: '#3B82F6', textDecoration: 'underline' }}>
                  Ver Flyer actual
                </a>
              </div>
            )}
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => {
                setFlyer(e.target.files ? e.target.files[0] : null);
                if (e.target.files && e.target.files[0]) setRemoveFlyer(false);
              }}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
              required={hasFlyer && (!initialData.flyer_url || removeFlyer)}
            />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#4B5563', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={hasFicha}
              onChange={(e) => {
                setHasFicha(e.target.checked);
                if (!e.target.checked) setRemoveFicha(true);
                else setRemoveFicha(false);
              }}
              style={{ width: '16px', height: '16px', accentColor: '#E8401C' }} 
            />
            ¿Este evento tiene una Ficha Técnica?
          </label>
        </div>

        {hasFicha && (
          <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>
              Archivo de Ficha Técnica (PDF o Imagen) {initialData.ficha_tecnica_url && !removeFicha ? '(Dejar en blanco para mantener el actual)' : '*'}
            </label>
            {initialData.ficha_tecnica_url && !removeFicha && !ficha && (
              <div style={{ marginBottom: '8px', fontSize: '13px' }}>
                <a href={initialData.ficha_tecnica_url} target="_blank" rel="noopener noreferrer" style={{ color: '#3B82F6', textDecoration: 'underline' }}>
                  Ver Ficha Técnica actual
                </a>
              </div>
            )}
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => {
                setFicha(e.target.files ? e.target.files[0] : null);
                if (e.target.files && e.target.files[0]) setRemoveFicha(false);
              }}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
              required={hasFicha && (!initialData.ficha_tecnica_url || removeFicha)}
            />
          </div>
        )}

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
