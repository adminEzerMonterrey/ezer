import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { Download, FileSpreadsheet, X } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { EVENT_CATEGORIES } from '../eventCategories';
import { NUEVO_LEON_MUNICIPALITIES } from '../municipalities';

type ImportError = {
  row: number;
  column: string;
  expected: string;
  value: string;
};

type EventImportDraft = {
  sourceRow: number;
  name: string;
  company: string;
  date: string;
  target_audience: string;
  description: string;
  objective: string;
  municipio: string;
  cost: string;
  coordinador: string;
  is_annual: boolean;
  spots_min: number;
  spots_max: number;
};

const TEMPLATE_COLUMNS = [
  'Titulo',
  'Fecha de cierre',
  'Sector beneficiado',
  'Municipio',
  'Espacios minimos',
  'Espacios maximos',
  'Cuota de recuperacion',
  'Coordinador',
  'Evento anual',
  'Descripcion',
];

const EXAMPLE_ROW = [
  'Limpieza de parque',
  '2026-08-15',
  'Medio Ambiente',
  'Monterrey',
  10,
  25,
  'Gratuito',
  'Nombre del coordinador',
  'No',
  'Describe el evento con claridad.',
];

const normalizeText = (value: unknown) => String(value ?? '').trim();

const normalizeComparable = (value: unknown) =>
  normalizeText(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const findOption = (value: unknown, options: string[]) => {
  const normalized = normalizeComparable(value);
  return options.find((option) => normalizeComparable(option) === normalized) || '';
};

const parseBoolean = (value: unknown) => {
  const normalized = normalizeComparable(value);
  if (['si', 'sí', 'true', 'verdadero', '1', 'x'].includes(normalized)) return true;
  if (['no', 'false', 'falso', '0', ''].includes(normalized)) return false;
  return null;
};

const excelSerialDateToISO = (serial: number) => {
  const utcDays = Math.floor(serial - 25569);
  const utcValue = utcDays * 86400;
  const dateInfo = new Date(utcValue * 1000);
  return dateInfo.toISOString().slice(0, 10);
};

const parseDate = (value: unknown) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return excelSerialDateToISO(value);
  }

  const raw = normalizeText(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  const slashMatch = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const [, day, month, year] = slashMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  return '';
};

const parseNonNegativeInteger = (value: unknown) => {
  const numeric = typeof value === 'number' ? value : Number(normalizeText(value));
  if (!Number.isInteger(numeric) || numeric < 0) return null;
  return numeric;
};

export function ImportEventsButton({ onEventsImported }: { onEventsImported: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ImportError[]>([]);
  const [summary, setSummary] = useState('');
  const [pendingEvents, setPendingEvents] = useState<EventImportDraft[]>([]);
  const [imageFiles, setImageFiles] = useState<Record<number, File | null>>({});

  const downloadTemplate = () => {
    const workbook = XLSX.utils.book_new();
    const eventsSheet = XLSX.utils.aoa_to_sheet([TEMPLATE_COLUMNS, EXAMPLE_ROW]);
    const optionsSheet = XLSX.utils.aoa_to_sheet([
      ['Sectores beneficiados', 'Municipios', 'Evento anual'],
      ...Array.from({ length: Math.max(EVENT_CATEGORIES.length, NUEVO_LEON_MUNICIPALITIES.length) }).map((_, index) => [
        EVENT_CATEGORIES[index] ?? '',
        NUEVO_LEON_MUNICIPALITIES[index] ?? '',
        index === 0 ? 'Si' : index === 1 ? 'No' : '',
      ]),
    ]);

    XLSX.utils.book_append_sheet(workbook, eventsSheet, 'Eventos');
    XLSX.utils.book_append_sheet(workbook, optionsSheet, 'Opciones');
    XLSX.writeFile(workbook, 'plantilla_eventos_ezer.xlsx');
  };

  const validateRows = (rows: Record<string, unknown>[]) => {
    const validationErrors: ImportError[] = [];
    const events = rows
      .map((row, index) => {
        const excelRow = index + 2;
        const title = normalizeText(row['Titulo']);
        const date = parseDate(row['Fecha de cierre']);
        const objective = findOption(row['Sector beneficiado'], EVENT_CATEGORIES);
        const municipio = findOption(row['Municipio'], NUEVO_LEON_MUNICIPALITIES);
        const spotsMin = parseNonNegativeInteger(row['Espacios minimos']);
        const spotsMax = parseNonNegativeInteger(row['Espacios maximos']);
        const cost = normalizeText(row['Cuota de recuperacion']) || 'Gratuito';
        const coordinador = normalizeText(row['Coordinador']);
        const isAnnual = parseBoolean(row['Evento anual']);
        const description = normalizeText(row['Descripcion']);

        if (!title) validationErrors.push({ row: excelRow, column: 'Titulo', expected: 'texto requerido', value: normalizeText(row['Titulo']) });
        if (!date) validationErrors.push({ row: excelRow, column: 'Fecha de cierre', expected: 'fecha en formato YYYY-MM-DD o DD/MM/YYYY', value: normalizeText(row['Fecha de cierre']) });
        if (!objective) validationErrors.push({ row: excelRow, column: 'Sector beneficiado', expected: `una opción válida: ${EVENT_CATEGORIES.join(', ')}`, value: normalizeText(row['Sector beneficiado']) });
        if (!municipio) validationErrors.push({ row: excelRow, column: 'Municipio', expected: 'un municipio válido de Nuevo León', value: normalizeText(row['Municipio']) });
        if (spotsMin == null) validationErrors.push({ row: excelRow, column: 'Espacios minimos', expected: 'número entero mayor o igual a 0', value: normalizeText(row['Espacios minimos']) });
        if (spotsMax == null) validationErrors.push({ row: excelRow, column: 'Espacios maximos', expected: 'número entero mayor o igual a 0', value: normalizeText(row['Espacios maximos']) });
        if (spotsMin != null && spotsMax != null && spotsMin > spotsMax) {
          validationErrors.push({ row: excelRow, column: 'Espacios maximos', expected: 'número mayor o igual a Espacios minimos', value: normalizeText(row['Espacios maximos']) });
        }
        if (!coordinador) validationErrors.push({ row: excelRow, column: 'Coordinador', expected: 'texto requerido', value: normalizeText(row['Coordinador']) });
        if (isAnnual == null) validationErrors.push({ row: excelRow, column: 'Evento anual', expected: 'Si o No', value: normalizeText(row['Evento anual']) });
        if (!description) validationErrors.push({ row: excelRow, column: 'Descripcion', expected: 'texto requerido', value: normalizeText(row['Descripcion']) });

        return {
          sourceRow: excelRow,
          name: title,
          company: 'EZER',
          date,
          target_audience: 'Público General',
          description,
          objective,
          municipio,
          cost,
          coordinador,
          is_annual: isAnnual === true,
          spots_min: spotsMin ?? 0,
          spots_max: spotsMax ?? 0,
        };
      });

    return { events, validationErrors };
  };

  const handleImport = async (file: File) => {
    setLoading(true);
    setErrors([]);
    setSummary('');
    setPendingEvents([]);
    setImageFiles({});

    try {
      const workbook = XLSX.read(await file.arrayBuffer(), { cellDates: true });
      const worksheet = workbook.Sheets.Eventos || workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });

      if (rows.length === 0) {
        setErrors([{ row: 1, column: 'Archivo', expected: 'al menos una fila de eventos', value: 'archivo vacío' }]);
        return;
      }

      const { events, validationErrors } = validateRows(rows);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      setPendingEvents(events);
    } catch (error: any) {
      setErrors([{ row: 0, column: 'Archivo', expected: 'Excel válido .xlsx o .xls', value: error.message || 'No se pudo leer el archivo' }]);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const importPendingEvents = async () => {
    setLoading(true);
    setErrors([]);
    setSummary('');

    try {
      const missingImages = pendingEvents
        .filter((_, index) => !imageFiles[index])
        .map((event) => ({
          row: event.sourceRow,
          column: 'Imagen',
          expected: 'archivo de imagen cargado desde el dispositivo',
          value: 'vacío',
        }));

      if (missingImages.length > 0) {
        setErrors(missingImages);
        return;
      }

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        setErrors([{ row: 0, column: 'Sesión', expected: 'sesión de administrador activa', value: 'sesión expirada' }]);
        return;
      }

      const events = [];

      for (let index = 0; index < pendingEvents.length; index += 1) {
        const file = imageFiles[index];
        if (!file) continue;

        const fileName = `events/${crypto.randomUUID()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(fileName, file);

        if (uploadError) {
          setErrors([{
            row: pendingEvents[index].sourceRow,
            column: 'Imagen',
            expected: 'imagen válida para subir a Supabase Storage',
            value: uploadError.message,
          }]);
          return;
        }

        const { data } = supabase.storage
          .from('event-images')
          .getPublicUrl(fileName);

        const { sourceRow, ...event } = pendingEvents[index];
        events.push({ ...event, image_url: data.publicUrl });
      }

      const response = await fetch('/api/admin-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ events }),
      });

      const responseData = await response.json().catch(() => ({}));
      if (!response.ok) {
        setErrors([{ row: 0, column: 'Importación', expected: 'respuesta exitosa del servidor', value: responseData.message || `Status ${response.status}` }]);
        return;
      }

      setSummary(`Se importaron ${events.length} eventos correctamente.`);
      setPendingEvents([]);
      setImageFiles({});
      onEventsImported();
    } catch (error: any) {
      setErrors([{ row: 0, column: 'Importación', expected: 'importación completada', value: error.message || 'No se pudo importar' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap' }}>
        {summary && <span style={{ color: '#16A34A', fontSize: 13, fontWeight: 700 }}>{summary}</span>}
        <button
          type="button"
          onClick={downloadTemplate}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 8, border: '1px solid #D1D5DB', backgroundColor: '#FFFFFF', color: '#1A2E6C', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
        >
          <Download size={16} />
          Descargar plantilla
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 8, border: 'none', backgroundColor: loading ? '#CBD5E1' : '#1A2E6C', color: '#FFFFFF', fontWeight: 700, fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          <FileSpreadsheet size={16} />
          {loading ? 'Importando...' : 'Importar eventos'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          style={{ display: 'none' }}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) handleImport(file);
          }}
        />
      </div>

      {pendingEvents.length > 0 && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9998, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ backgroundColor: '#FFFFFF', width: '100%', maxWidth: 780, maxHeight: '84vh', overflowY: 'auto', borderRadius: 14, padding: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.25)', position: 'relative' }}>
            <button
              type="button"
              onClick={() => {
                setPendingEvents([]);
                setImageFiles({});
              }}
              style={{ position: 'absolute', top: 16, right: 16, border: 'none', background: 'transparent', color: '#6B7280', cursor: 'pointer' }}
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
            <h3 style={{ color: '#1A2E6C', fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Selecciona imágenes para los eventos</h3>
            <p style={{ color: '#4B5563', fontSize: 14, marginBottom: 18 }}>
              El Excel ya fue validado. Elige una imagen local para cada evento antes de importar.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pendingEvents.map((event, index) => (
                <div key={`${event.sourceRow}-${event.name}`} style={{ border: '1px solid #E5E7EB', borderRadius: 10, padding: 14, display: 'grid', gap: 10 }}>
                  <div>
                    <p style={{ color: '#1A2E6C', fontSize: 14, fontWeight: 800, margin: 0 }}>{event.name}</p>
                    <p style={{ color: '#6B7280', fontSize: 12, margin: '4px 0 0' }}>Línea {event.sourceRow} · {event.municipio} · {event.objective}</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(inputEvent) => {
                      const file = inputEvent.target.files?.[0] ?? null;
                      setImageFiles((current) => ({ ...current, [index]: file }));
                    }}
                    style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #D1D5DB' }}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <button
                type="button"
                onClick={() => {
                  setPendingEvents([]);
                  setImageFiles({});
                }}
                disabled={loading}
                style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #D1D5DB', backgroundColor: '#FFFFFF', color: '#4B5563', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={importPendingEvents}
                disabled={loading}
                style={{ padding: '10px 16px', borderRadius: 8, border: 'none', backgroundColor: loading ? '#CBD5E1' : '#1A2E6C', color: '#FFFFFF', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? 'Importando...' : 'Importar con imágenes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {errors.length > 0 && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ backgroundColor: '#FFFFFF', width: '100%', maxWidth: 720, maxHeight: '80vh', overflowY: 'auto', borderRadius: 14, padding: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.25)', position: 'relative' }}>
            <button
              type="button"
              onClick={() => setErrors([])}
              style={{ position: 'absolute', top: 16, right: 16, border: 'none', background: 'transparent', color: '#6B7280', cursor: 'pointer' }}
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
            <h3 style={{ color: '#B91C1C', fontSize: 20, fontWeight: 800, marginBottom: 8 }}>No se pudo importar el archivo</h3>
            <p style={{ color: '#4B5563', fontSize: 14, marginBottom: 18 }}>Corrige estos errores en la plantilla y vuelve a importar.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {errors.map((error, index) => (
                <div key={`${error.row}-${error.column}-${index}`} style={{ border: '1px solid #FCA5A5', backgroundColor: '#FEF2F2', borderRadius: 8, padding: '10px 12px' }}>
                  <p style={{ color: '#7F1D1D', fontSize: 13, fontWeight: 700, margin: 0 }}>
                    Línea {error.row || '-'}: error en columna "{error.column}".
                  </p>
                  <p style={{ color: '#991B1B', fontSize: 13, margin: '4px 0 0' }}>
                    Se espera {error.expected}. Valor recibido: {error.value || 'vacío'}.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
