import { createClient } from '@supabase/supabase-js';

const ALLOWED_EVENT_FIELDS = [
  'name',
  'title',
  'company',
  'date',
  'event_date',
  'target_audience',
  'audience',
  'description',
  'objective',
  'category',
  'image_url',
  'image',
  'flyer_url',
  'cost',
  'spots_min',
  'spots_max',
  'spots',
  'is_annual',
  'coordinador',
  'municipio',
  'asociacion',
  'asociacion_municipio',
  'sensibilization_course_url',
];

const getSupabaseConfig = () => {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey || !serviceRoleKey) {
    throw new Error('Faltan SUPABASE_URL, SUPABASE_ANON_KEY/VITE_SUPABASE_ANON_KEY o SUPABASE_SERVICE_ROLE_KEY en el servidor.');
  }

  return { url, anonKey, serviceRoleKey };
};

const getBearerToken = (req) => {
  const authHeader = req.headers.authorization || '';
  return authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : '';
};

const sanitizeEventPayload = (payload = {}) => {
  return Object.fromEntries(
    Object.entries(payload).filter(([key, value]) => ALLOWED_EVENT_FIELDS.includes(key) && value !== undefined)
  );
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'PATCH' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({ message: 'No autorizado: falta token de sesión.' });
    }

    const { url, anonKey, serviceRoleKey } = getSupabaseConfig();
    const authClient = createClient(url, anonKey, { auth: { persistSession: false } });
    const { data: userData, error: userError } = await authClient.auth.getUser(token);

    if (userError || !userData?.user) {
      return res.status(401).json({ message: 'No autorizado: sesión inválida o expirada.' });
    }

    const adminClient = createClient(url, serviceRoleKey, { auth: { persistSession: false } });

    if (req.method === 'POST') {
      const events = Array.isArray(req.body?.events) ? req.body.events : [];

      if (events.length === 0) {
        return res.status(400).json({ message: 'No hay eventos para importar.' });
      }

      if (events.length > 200) {
        return res.status(400).json({ message: 'Puedes importar hasta 200 eventos por archivo.' });
      }

      const rows = events.map((event) => ({
        ...sanitizeEventPayload(event),
        company: 'EZER',
        target_audience: 'Público General',
        user_id: userData.user.id,
      }));

      const { data, error } = await adminClient
        .from('events')
        .insert(rows)
        .select('*');

      if (error) {
        return res.status(500).json({ message: error.message });
      }

      return res.status(201).json({ message: 'Eventos importados correctamente.', events: data ?? [] });
    }

    const { id, event } = req.body || {};
    if (!id) {
      return res.status(400).json({ message: 'ID del evento requerido.' });
    }

    const updatePayload = sanitizeEventPayload(event);
    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json({ message: 'No hay campos válidos para actualizar.' });
    }

    const { data, error } = await adminClient
      .from('events')
      .update(updatePayload)
      .eq('id', id)
      .select('*');

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'No se encontró el evento para actualizar.' });
    }

    return res.status(200).json({ message: 'Evento actualizado correctamente.', event: data[0] });
  } catch (error) {
    console.error('API /admin-events error:', error);
    return res.status(500).json({ message: error.message || 'No se pudo actualizar el evento.' });
  }
}
