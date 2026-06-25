import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { EVENT_CATEGORIES } from '../eventCategories';
import { NUEVO_LEON_MUNICIPALITIES } from '../municipalities';

export function AddEventForm({ onEventAdded }: { onEventAdded: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [hasFlyer, setHasFlyer] = useState(false);
  const [flyer, setFlyer] = useState<File | null>(null);
  const [hasFicha, setHasFicha] = useState(false);
  const [ficha, setFicha] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('title') as string;
    const date = formData.get('event_date') as string;
    const description = formData.get('description') as string;
    const objective = formData.get('category') as string;
    const municipio = formData.get('municipio') as string;
    const cost = formData.get('cost') as string;
    const coordinador = formData.get('coordinador') as string;
    const isAnnual = formData.get('is_annual') === 'on';
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

    try {
      if (!image) {
        throw new Error('La imagen es obligatoria');
      }

      const fileName = `events/${crypto.randomUUID()}-${image.name}`;

      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(fileName, image);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('event-images')
        .getPublicUrl(fileName);

      const imageUrl = data.publicUrl;
      let flyerUrl = null;

      if (hasFlyer && flyer) {
        const flyerFileName = `flyers/${crypto.randomUUID()}-${flyer.name}`;
        const { error: flyerUploadError } = await supabase.storage
          .from('event-images')
          .upload(flyerFileName, flyer);

        if (flyerUploadError) {
          throw flyerUploadError;
        }

        const { data: flyerData } = supabase.storage
          .from('event-images')
          .getPublicUrl(flyerFileName);
          
        flyerUrl = flyerData.publicUrl;
      }

      let fichaUrl = null;

      if (hasFicha && ficha) {
        const fichaFileName = `fichas/${crypto.randomUUID()}-${ficha.name}`;
        const { error: fichaUploadError } = await supabase.storage
          .from('event-images')
          .upload(fichaFileName, ficha);

        if (fichaUploadError) {
          throw fichaUploadError;
        }

        const { data: fichaData } = supabase.storage
          .from('event-images')
          .getPublicUrl(fichaFileName);
          
        fichaUrl = fichaData.publicUrl;
      }

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('No autenticado');
      }

      const { error: insertError } = await supabase
        .from('events')
        .insert([
          {
            name,
            company: 'EZER',
            date,
            target_audience: 'Público General',
            description,
            objective,
            municipio,
            cost,
            coordinador,
            is_annual: isAnnual,
            spots_min: spotsMin,
            spots_max: spotsMax,
            image_url: imageUrl,
            flyer_url: flyerUrl,
            ficha_tecnica_url: fichaUrl,
            user_id: user.id,
          }
        ]);

      if (insertError) {
        throw insertError;
      }

      alert('Evento creado correctamente.');
      (e.target as HTMLFormElement).reset();
      setImage(null);
      setHasFlyer(false);
      setFlyer(null);
      setHasFicha(false);
      setFicha(null);
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
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Título</label>
          <input required name="title" type="text" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} placeholder="Ej. Limpieza Costera" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Fecha de cierre de convocatoria</label>
          <input required name="event_date" type="date" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Sector beneficiado</label>
          <select required name="category" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: 'white' }}>
            {EVENT_CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Municipio</label>
          <select required name="municipio" defaultValue="Monterrey" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: 'white' }}>
            {NUEVO_LEON_MUNICIPALITIES.map((municipality) => (
              <option key={municipality} value={municipality}>{municipality}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Espacios mínimos</label>
            <input required name="spots_min" type="number" min="0" step="1" defaultValue="10" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Espacios máximos</label>
            <input required name="spots_max" type="number" min="0" step="1" defaultValue="20" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Cuota de recuperación</label>
          <input name="cost" type="text" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} placeholder="Ej. 500 MXN o Gratuito" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
          <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
            Captura un rango sencillo. Si el evento tiene una cantidad fija, escribe el mismo número en ambos campos.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Coordinador (Solo visible para administrador)</label>
          <input required name="coordinador" type="text" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} placeholder="Nombre del coordinador" />
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
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#4B5563', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={hasFlyer}
              onChange={(e) => setHasFlyer(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#E8401C' }} 
            />
            ¿Este evento tiene un flyer con más información?
          </label>
        </div>

        {hasFlyer && (
          <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Archivo de Flyer (PDF o Imagen) *</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setFlyer(e.target.files ? e.target.files[0] : null)}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
              required={hasFlyer}
            />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#4B5563', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={hasFicha}
              onChange={(e) => setHasFicha(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#E8401C' }} 
            />
            ¿Este evento tiene una Ficha Técnica?
          </label>
        </div>

        {hasFicha && (
          <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Archivo de Ficha Técnica (PDF o Imagen) *</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setFicha(e.target.files ? e.target.files[0] : null)}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
              required={hasFicha}
            />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Descripción</label>
          <textarea required name="description" rows={3} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', resize: 'vertical' }} placeholder="Describe el evento..."></textarea>
        </div>

        <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#E8401C',
              color: 'white',
              padding: '10px 24px',
              borderRadius: '8px',
              fontWeight: 600,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Guardando...' : 'Crear Evento'}
          </button>
        </div>
      </form>
    </div>
  );
}
