import { useState } from 'react';
import { supabase } from '../../supabaseClient';

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
    const company = formData.get('company') as string;
    const date = formData.get('event_date') as string;
    const target_audience = formData.get('audience') as string;
    const description = formData.get('description') as string;
    const objective = formData.get('category') as string;

    try {
      // 1. Obtener usuario
      // 1. Obtener usuario (moved to step 4)
      console.log("STEP 1: omitted user fetch here");

      // 2. Subir imagen
      console.log("STEP 2: uploading image");
      let imageUrl = null;

      if (image) {
        const fileName = `${Date.now()}-${image.name}`;

        const { error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(fileName, image);

        if (uploadError) {
          throw uploadError;
        }

        // 3. Obtener URL pública
        console.log("STEP 3: getting url");
        const { data } = supabase.storage
          .from('event-images')
          .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
      }

      // 4. Insertar evento
      console.log("STEP 4: inserting");
      const { data: { user } } = await supabase.auth.getUser();
      console.log("USER:", user);

      if (!user) {
        throw new Error("No autenticado");
      }

      const { error: insertError } = await supabase
        .from('events')
        .insert([
          {
            name,
            company,
            date,
            target_audience,
            description,
            objective,
            image_url: imageUrl,
            user_id: user.id
          }
        ]);

      if (insertError) {
        throw insertError;
      }

      alert("Evento creado ✅");
      (e.target as HTMLFormElement).reset();
      onEventAdded();

    } catch (error: any) {
      console.error("ERROR:", error);
      alert(error.message);
      setError(error.message);
    } finally {
      setLoading(false); // 🔥 CLAVE
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
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Empresa/Organizador</label>
          <input required name="company" type="text" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} placeholder="Ej. Ezer S.A." />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Fecha (YYYY-MM-DD)</label>
          <input required name="event_date" type="date" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Categoría</label>
          <select required name="category" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: 'white' }}>
            <option value="Medio Ambiente">Medio Ambiente</option>
            <option value="Educación">Educación</option>
            <option value="Alimentación">Alimentación</option>
            <option value="Salud">Salud</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Audiencia</label>
          <input required name="audience" type="text" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} placeholder="Ej. Todo público, Familias" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Espacios Disponibles</label>
          <input required name="spots" type="number" min="1" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} placeholder="Ej. 40" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Imagen</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} 
            required 
          />
        </div>

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
