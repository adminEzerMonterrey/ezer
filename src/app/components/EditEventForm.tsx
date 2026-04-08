import { useState } from 'react';

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

  // Formatear la fecha a YYYY-MM-DD para el input type="date"
  const formattedDate = initialData.event_date 
    ? new Date(initialData.event_date).toISOString().split('T')[0]
    : initialData.date 
      ? new Date(initialData.date).toISOString().split('T')[0]
      : '';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      id: initialData.id,
      title: formData.get('title'),
      company: formData.get('company'),
      event_date: formData.get('event_date'),
      category: formData.get('category'),
      audience: formData.get('audience'),
      description: formData.get('description'),
      image_url: formData.get('image_url'),
      spots: parseInt(formData.get('spots') as string, 10)
    };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/events', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        throw new Error('No se pudo actualizar el evento');
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
          <input required defaultValue={initialData.title} name="title" type="text" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Empresa/Organizador</label>
          <input required defaultValue={initialData.company} name="company" type="text" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Fecha (YYYY-MM-DD)</label>
          <input required defaultValue={formattedDate} name="event_date" type="date" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Categoría</label>
          <select required defaultValue={initialData.category} name="category" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: 'white' }}>
            <option value="Medio Ambiente">Medio Ambiente</option>
            <option value="Educación">Educación</option>
            <option value="Alimentación">Alimentación</option>
            <option value="Salud">Salud</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Audiencia</label>
          <input required defaultValue={initialData.audience} name="audience" type="text" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Espacios Disponibles</label>
          <input required defaultValue={initialData.spots} name="spots" type="number" min="1" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>URL de la Imagen</label>
          <input required defaultValue={initialData.image || initialData.image_url} name="image_url" type="url" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
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
