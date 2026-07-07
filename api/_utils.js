// Utilidades compartidas por las funciones serverless.
// Los archivos que empiezan con "_" no se exponen como rutas en Vercel.

// Escapa texto controlado por el usuario antes de insertarlo en HTML de correos,
// para evitar inyección de HTML / enlaces de phishing en la bandeja del admin.
export function escapeHtml(value) {
  if (value === undefined || value === null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Deriva el origen del propio sitio a partir de las cabeceras de la petición.
function selfOrigin(req) {
  const proto = (req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
  const host = req.headers['x-forwarded-host'] || req.headers.host || '';
  return host ? `${proto}://${host}` : '';
}

// Lista blanca de orígenes permitidos: el propio sitio, los definidos en
// ALLOWED_ORIGINS (separados por coma) y cualquier despliegue *.vercel.app.
function isAllowedOrigin(origin, req) {
  if (!origin) return false;
  if (origin === selfOrigin(req)) return true;
  const configured = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  if (configured.includes(origin)) return true;
  try {
    const { hostname } = new URL(origin);
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true;
    if (hostname.endsWith('.vercel.app')) return true;
  } catch {
    return false;
  }
  return false;
}

// Aplica CORS restringido a orígenes conocidos (en lugar de "*"), lo que impide
// que sitios de terceros invoquen estos endpoints desde el navegador de un usuario.
// Devuelve true si la petición ya fue respondida (preflight OPTIONS).
export function applyCors(req, res, methods = 'POST,OPTIONS') {
  const origin = req.headers.origin;
  if (isAllowedOrigin(origin, req)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}

// Validación de correo (formato razonable, longitud acotada).
export function isValidEmail(value) {
  return typeof value === 'string' && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Normaliza y recorta un texto a un máximo de caracteres.
export function clampText(value, max) {
  if (value === undefined || value === null) return '';
  return String(value).slice(0, max);
}

// Valida un conjunto de campos según reglas simples { max, required, email }.
// Devuelve { ok, error, values } con los valores ya recortados.
export function validateFields(body = {}, rules = {}) {
  const values = {};
  for (const [field, rule] of Object.entries(rules)) {
    const raw = body[field];
    if (rule.required && (raw === undefined || raw === null || String(raw).trim() === '')) {
      return { ok: false, error: `El campo "${field}" es obligatorio.` };
    }
    if (rule.email && raw && !isValidEmail(String(raw))) {
      return { ok: false, error: `El campo "${field}" no es un correo válido.` };
    }
    values[field] = rule.max ? clampText(raw, rule.max) : raw;
  }
  return { ok: true, values };
}
