import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';

const EXPORT_FILE_NAME = 'interes-voluntariado.xlsx';

const EXCEL_COLUMNS = [
  { key: 'name', header: 'Nombre' },
  { key: 'company', header: 'Organizacion / Empresa' },
  { key: 'phone', header: 'Telefono' },
  { key: 'email', header: 'Correo electronico' },
  { key: 'event_name', header: 'Evento de interes' },
  { key: 'description', header: 'Comentarios' },
  { key: 'created_at', header: 'Fecha de registro' },
];

function getSupabaseAdminClient() {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Faltan variables de entorno de Supabase. Se recomienda SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY para esta API.',
    );
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
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

async function fetchInterestLeads() {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from('interest_leads')
    .select(EXCEL_COLUMNS.map((column) => column.key).join(', '))
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`No se pudieron obtener los registros de interest_leads: ${error.message}`);
  }

  return data ?? [];
}

function buildExcelRows(rows) {
  return rows.map((row) => {
    const formattedRow = {};

    for (const column of EXCEL_COLUMNS) {
      formattedRow[column.header] = normalizeCellValue(row[column.key]);
    }

    return formattedRow;
  });
}

function buildWorkbookBuffer(rows) {
  const worksheet = XLSX.utils.json_to_sheet(rows);
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
    const rows = await fetchInterestLeads();
    const excelRows = buildExcelRows(rows);
    const workbookBuffer = buildWorkbookBuffer(excelRows);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${EXPORT_FILE_NAME}"`,
    );

    return res.status(200).send(workbookBuffer);
  } catch (error) {
    console.error('API /export-interest-leads error:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
}
