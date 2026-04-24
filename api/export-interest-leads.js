import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';

const EXCEL_COLUMNS = [
  { key: 'name', header: 'Nombre' },
  { key: 'company', header: 'Empresa / Organización' },
  { key: 'email', header: 'Correo electrónico' },
  { key: 'event_name', header: 'Nombre del evento' },
  { key: 'description', header: 'Descripción' },
  {
    key: 'created_at',
    header: 'Fecha de creación',
    formatter: (value) => formatDateInSpanish(value),
  },
];

function getSupabaseAdminClient(authorizationHeader = '') {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const supabaseKey = serviceRoleKey || anonKey;
  const shouldForwardUserAuth = !serviceRoleKey && Boolean(authorizationHeader);

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Faltan variables de entorno de Supabase. Se recomienda SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY para esta API.',
    );
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
    global: shouldForwardUserAuth
      ? {
          headers: {
            Authorization: authorizationHeader,
          },
        }
      : undefined,
  });
}

function normalizeCellValue(value) {
  if (value === undefined || value === null) {
    return '';
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }

  return JSON.stringify(value);
}

function formatDateInSpanish(value) {
  if (!value) {
    return '';
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return normalizeCellValue(value);
  }

  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(date);
}

function buildExportFileName() {
  const formattedDate = new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(new Date())
    .replace(/\//g, '-');

  return `Voluntarios - ${formattedDate}.xlsx`;
}

async function fetchInterestLeads(authorizationHeader = '') {
  const supabase = getSupabaseAdminClient(authorizationHeader);
  const hasServiceRoleKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  // TEMP DEBUG: confirma si esta API está consultando como service role o como cliente degradado.
  console.log('[TEMP DEBUG][API] fetchInterestLeads auth mode:', {
    hasServiceRoleKey,
    forwardedUserAuth: !hasServiceRoleKey && Boolean(authorizationHeader),
  });

  const { data, error } = await supabase
    .from('interest_leads')
    .select(EXCEL_COLUMNS.map((column) => column.key).join(', '))
    .order('created_at', { ascending: false });

  // TEMP DEBUG: deja visible si Supabase devuelve filas o una lista vacía.
  console.log('[TEMP DEBUG][API] interest_leads query result:', {
    error: error ? error.message : null,
    rows: data?.length ?? 0,
    sample: data?.[0] ?? null,
  });

  if (error) {
    throw new Error(`No se pudieron obtener los registros de interest_leads: ${error.message}`);
  }

  return data ?? [];
}

function buildExcelRows(rows) {
  return rows.map((row) => {
    const formattedRow = {};

    for (const column of EXCEL_COLUMNS) {
      const value = column.formatter
        ? column.formatter(row[column.key], row)
        : normalizeCellValue(row[column.key]);

      formattedRow[column.header] = value;
    }

    return formattedRow;
  });
}

function buildWorkbookBuffer(rows) {
  const headers = EXCEL_COLUMNS.map((column) => column.header);
  const dataRows = rows.map((row) =>
    EXCEL_COLUMNS.map((column) => row[column.header] ?? ''),
  );
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...dataRows]);

  worksheet['!cols'] = headers.map((header) => ({ wch: Math.max(header.length + 4, 20) }));
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Voluntarios');

  return XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'buffer',
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const rawAuthorizationHeader = req.headers.authorization || '';
    const authorizationHeader = rawAuthorizationHeader.startsWith('Bearer ')
      ? rawAuthorizationHeader
      : rawAuthorizationHeader
        ? `Bearer ${rawAuthorizationHeader}`
        : '';

    // TEMP DEBUG: confirma que el request llegó al endpoint correcto.
    console.log('[TEMP DEBUG][API] /api/export-interest-leads request:', {
      method: req.method,
      hasAuthorizationHeader: Boolean(authorizationHeader),
    });

    const rows = await fetchInterestLeads(authorizationHeader);

    const excelRows = buildExcelRows(rows);
    const workbookBuffer = buildWorkbookBuffer(excelRows);
    const fileName = buildExportFileName();

    // TEMP DEBUG: ayuda a detectar archivos corruptos o vacíos antes de enviarlos.
    console.log('[TEMP DEBUG][API] workbook generated:', {
      fileName,
      sourceRows: rows.length,
      excelRows: excelRows.length,
      bufferBytes: workbookBuffer?.length ?? 0,
    });

    if (rows.length === 0) {
      console.warn('API /export-interest-leads: no se encontraron registros en interest_leads.');
    }

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${fileName}"`,
    );

    return res.status(200).send(workbookBuffer);
  } catch (error) {
    console.error('API /export-interest-leads error:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
}
