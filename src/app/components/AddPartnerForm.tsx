import { useState } from 'react';
import { supabase } from '../../supabaseClient';

export function AddPartnerForm({ onPartnerAdded }: { onPartnerAdded: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;

    try {
      if (!image) throw new Error("El logo es obligatorio");

      const fileName = `partners/${crypto.randomUUID()}-${image.name}`;

      // Asegúrate de que el bucket 'partner-images' exista en Supabase
      const { error: uploadError } = await supabase.storage
        .from('partner-images')
        .upload(fileName, image);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('partner-images')
        .getPublicUrl(fileName);

      const imageUrl = data.publicUrl;

      const { error: insertError } = await supabase
        .from('partners')
        .insert([{ name, logo_url: imageUrl }]);

      if (insertError) throw insertError;

      alert("Empresa aliada agregada ✅");
      (e.target as HTMLFormElement).reset();
      setImage(null);
      onPartnerAdded();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al guardar la empresa aliada');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#FAFAFA', borderRadius: '8px', border: '1px solid #E5E7EB', marginBottom: '30px' }}>
      <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#1A2E6C', marginBottom: '20px' }}>Agregar Nueva Empresa Aliada</h3>
      {error && <div style={{ color: '#E8401C', marginBottom: '10px' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px', display: 'block' }}>Nombre de la Empresa</label>
          <input required name="name" type="text" style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} placeholder="Ej. Fundación DeAcero" />
        </div>

        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', marginBottom: '4px', display: 'block' }}>Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
            required
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
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
            {loading ? 'Guardando...' : 'Agregar Empresa'}
          </button>
        </div>
      </form>
    </div>
  );
}
