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
