import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { Download, FileSpreadsheet, X } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { EVENT_CATEGORIES } from '../eventCategories';
import { NUEVO_LEON_MUNICIPALITIES } from '../municipalities';

type ImportError = {
  row: number;
  column: string;
  message: string;
  steps: string[];
};

const buildError = (row: number, column: string, message: string, steps: string[]): ImportError => ({
  row,
  column,
  message,
  steps,
});

type EventImportDraft = {
  sourceRow: number;
  name: string;
  company: string;
  date: string | null;
  target_audience: string;
  description: string;
  objective: string;
  municipio: string;
  cost: string;
  coordinador: string;
  is_annual: boolean;
  spots_min: number;
  spots_max: number;
  asociacion: string;
  asociacion_municipio: string;
  image_url: string;
  flyer_url: string;
  sensibilization_course_url: string;
};

const TEMPLATE_COLUMNS = [
  'Titulo',
  'Sector beneficiado',
  'Municipio',
  'Coordinador',
  'Evento anual',
  'Descripcion',
  'Asociacion',
  'Municipio de la asociacion',
  'URL Imagen',
  'URL Flyer (Drive)',
  'URL Curso Sensibilizacion (Drive)',


const normalizeText = (value: unknown) => String(value ?? '').trim();

const normalizeComparable = (value: unknown) =>
  normalizeText(value)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

const findOption = (value: unknown, options: string[]) => {
  const normalized = normalizeComparable(value);
  return options.find((option) => normalizeComparable(option) === normalized) || '';
};

const MUNICIPALITY_ALIASES: Record<string, string> = {
  mty: 'Monterrey',
  monterey: 'Monterrey',
  gpe: 'Guadalupe',
  apo: 'Apodaca',
  spgg: 'San Pedro Garza García',
  escobedo: 'General Escobedo',
  zuazua: 'General Zuazua',
  bravo: 'General Bravo',
  teran: 'General Terán',
  trevino: 'General Treviño',
  zaragoza: 'General Zaragoza',
  'dr arroyo': 'Doctor Arroyo',
  'dr. arroyo': 'Doctor Arroyo',
  'doctor arroyo': 'Doctor Arroyo',
  'dr coss': 'Doctor Coss',
  'dr. coss': 'Doctor Coss',
  'doctor coss': 'Doctor Coss',
  'dr gonzalez': 'Doctor González',
  'dr. gonzalez': 'Doctor González',
  'doctor gonzalez': 'Doctor González',
  aldamas: 'Los Aldamas',
  herreras: 'Los Herreras',
  ramones: 'Los Ramones',
  carmen: 'El Carmen',
  'san nicolas': 'San Nicolás de los Garza',
  'san pedro': 'San Pedro Garza García',
  cadereyta: 'Cadereyta Jiménez',
  santa: 'Santa Catarina',
  sabinas: 'Sabinas Hidalgo',
  salinas: 'Salinas Victoria',
  cienega: 'Ciénega de Flores',
  lampazos: 'Lampazos de Naranjo',
};

const NORMALIZED_MUNICIPALITY_ALIASES = Object.fromEntries(
  Object.entries(MUNICIPALITY_ALIASES).map(([alias, official]) => [normalizeComparable(alias), official]),
);

const resolveSingleMunicipio = (value: unknown) => {
  const normalized = normalizeComparable(value);
  if (!normalized) return '';
  if (NORMALIZED_MUNICIPALITY_ALIASES[normalized]) {
    return NORMALIZED_MUNICIPALITY_ALIASES[normalized];
  }
  return findOption(value, NUEVO_LEON_MUNICIPALITIES);
};

const resolveMunicipio = (value: unknown) => {
  if (typeof value !== 'string') {
    if (!value) return '';
    return resolveSingleMunicipio(String(value));
  }
  const parts = value.split(',').map(s => s.trim()).filter(Boolean);
  if (parts.length === 0) return '';
  const resolvedParts = parts.map(resolveSingleMunicipio);
  if (resolvedParts.some(r => !r)) return '';
  return Array.from(new Set(resolvedParts)).join(', ');
};

const parseBoolean = (value: unknown) => {
  const normalized = normalizeComparable(value);
  if (['si', 'sí', 'true', 'verdadero', '1', 'x'].includes(normalized)) return true;
  if (['no', 'false', 'falso', '0', ''].includes(normalized)) return false;
  return null;
};

const parseDate = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    const utcDays = Math.floor(value - 25569);
    const utcValue = utcDays * 86400;
    const dateInfo = new Date(utcValue * 1000);
    return dateInfo.toISOString().slice(0, 10);
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
  const [eventImages, setEventImages] = useState<Record<number, File>>({});

  const downloadTemplate = () => {
    const workbook = XLSX.utils.book_new();
    const eventsSheet = XLSX.utils.aoa_to_sheet([TEMPLATE_COLUMNS]);
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
        const objective = findOption(row['Sector beneficiado'], EVENT_CATEGORIES);
        const municipio = resolveMunicipio(row['Municipio']);
        const coordinador = normalizeText(row['Coordinador']);
        const isAnnual = parseBoolean(row['Evento anual']);
        const description = normalizeText(row['Descripcion']);
        const asociacion = normalizeText(row['Asociacion']);
        const asociacionMunicipio = resolveMunicipio(row['Municipio de la asociacion']);
        const imageUrl = normalizeText(row['URL Imagen']) || normalizeText(row['URL Imagen (Drive)']);
        const flyerUrl = normalizeText(row['URL Flyer (Drive)']);
        const sensibilizationCourseUrl = normalizeText(row['URL Curso Sensibilizacion (Drive)']);

        if (!title) {
          validationErrors.push(buildError(excelRow, 'Titulo', 'La celda está vacía. Cada evento debe tener un título.', [
            `Ve a la fila ${excelRow}, columna "Titulo".`,
            'Escribe el nombre del evento (ejemplo: "Limpieza de parque").',
            'Guarda el archivo y vuelve a importarlo.',
          ]));
        }

        if (!objective) {
          const raw = normalizeText(row['Sector beneficiado']);
          validationErrors.push(buildError(excelRow, 'Sector beneficiado', raw ? `"${raw}" no es un sector reconocido.` : 'La celda está vacía.', [
            'Abre la hoja "Opciones" dentro de este mismo archivo Excel: ahí están los sectores válidos.',
            `Copia y pega exactamente uno de esos valores en la columna "Sector beneficiado" (ejemplo: "${EVENT_CATEGORIES[0] ?? ''}").`,
            'Guarda el archivo y vuelve a importarlo.',
          ]));
        }

        if (!municipio) {
          const raw = normalizeText(row['Municipio']);
          validationErrors.push(buildError(excelRow, 'Municipio', raw ? `"${raw}" contiene uno o más municipios no reconocidos.` : 'La celda está vacía.', [
            'Revisa que los municipios existan en Nuevo León.',
            'Si vas a ingresar varios, sepáralos con comas (ejemplo: Monterrey, Apodaca).',
            'Guarda el archivo y vuelve a importarlo.',
          ]));
        }

        if (!coordinador) {
          validationErrors.push(buildError(excelRow, 'Coordinador', 'La celda está vacía.', [
            `Ve a la fila ${excelRow}, columna "Coordinador".`,
            'Escribe el nombre del coordinador.',
            'Guarda el archivo y vuelve a importarlo.',
          ]));
        }

        if (isAnnual == null) {
          validationErrors.push(buildError(excelRow, 'Evento anual', 'Valor no reconocido.', [
            `Ve a la fila ${excelRow}, columna "Evento anual".`,
            'Escribe "Si" o "No".',
            'Guarda el archivo y vuelve a importarlo.',
          ]));
        }

        if (!description) {
          validationErrors.push(buildError(excelRow, 'Descripcion', 'La celda está vacía.', [
            `Ve a la fila ${excelRow}, columna "Descripcion".`,
            'Escribe una descripción del evento.',
            'Guarda el archivo y vuelve a importarlo.',
          ]));
        }

        return {
          sourceRow: excelRow,
          name: title,
          company: 'EZER',
          date: null,
          target_audience: 'Público General',
          description,
          objective,
          municipio,
          cost: 'Gratuito',
          coordinador,
          is_annual: isAnnual === true,
          spots_min: 0,
          spots_max: 0,
          asociacion,
          asociacion_municipio: asociacionMunicipio,
          image_url: imageUrl,
          flyer_url: flyerUrl,
          sensibilization_course_url: sensibilizationCourseUrl,
        };
      });

    return { events, validationErrors };
  };

  const handleImport = async (file: File) => {
    setLoading(true);
    setErrors([]);
    setSummary('');
    setPendingEvents([]);
    setEventImages({});

    try {
      const workbook = XLSX.read(await file.arrayBuffer(), { cellDates: true });
      const worksheet = workbook.Sheets.Eventos || workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });

      if (rows.length === 0) {
        setErrors([buildError(0, 'Archivo', 'El archivo no contiene ninguna fila de eventos.', [
          'Abre la plantilla y llena al menos una fila debajo de los encabezados.',
          'Guarda el archivo y vuelve a importarlo.',
        ])]);
        return;
      }

      const { events, validationErrors } = validateRows(rows);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      setPendingEvents(events);
    } catch (error: any) {
      setErrors([buildError(0, 'Archivo', `No se pudo leer el archivo. ${error?.message || ''}`.trim(), [
        'Verifica que el archivo sea un Excel válido (.xlsx o .xls).',
        'Descarga una plantilla nueva y copia tus datos ahí.',
      ])]);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const importPendingEvents = async () => {
    setLoading(true);
    setErrors([]);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        setErrors([buildError(0, 'Sesión', 'Tu sesión expiró.', ['Cierra sesión y vuelve a iniciar sesión.'])]);
        return;
      }

      const eventsWithImages = [...pendingEvents];

      for (let i = 0; i < eventsWithImages.length; i++) {
        const file = eventImages[i];
        if (file) {
          const fileName = `events/${crypto.randomUUID()}-${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from('event-images')
            .upload(fileName, file);

          if (!uploadError) {
            const { data } = supabase.storage
              .from('event-images')
              .getPublicUrl(fileName);
            eventsWithImages[i].image_url = data.publicUrl;
          } else {
            console.error('Error uploading image for event', i, uploadError);
          }
        }
      }

      const events = eventsWithImages.map(({ sourceRow, ...event }) => event);

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
        setErrors([buildError(0, 'Importación', responseData.message || `Error ${response.status}.`, ['Intenta de nuevo.'])]);
        return;
      }

      setSummary(`✅ Se importaron ${events.length} eventos correctamente.`);
      setPendingEvents([]);
      setEventImages({});
      onEventsImported();
    } catch (error: any) {
      setErrors([buildError(0, 'Importación', error?.message || 'Error inesperado.', ['Intenta de nuevo.'])]);
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
        <input ref={fileInputRef} type="file" accept=".xlsx,.xls" style={{ display: 'none' }} onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleImport(file);
        }} />
      </div>

      {pendingEvents.length > 0 && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9998, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ backgroundColor: '#FFFFFF', width: '100%', maxWidth: 600, maxHeight: '84vh', overflowY: 'auto', borderRadius: 14, padding: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.25)', position: 'relative' }}>
            <button type="button" onClick={() => { setPendingEvents([]); setEventImages({}); }} style={{ position: 'absolute', top: 16, right: 16, border: 'none', background: 'transparent', color: '#6B7280', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h3 style={{ color: '#1A2E6C', fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Confirmar importación</h3>
            <p style={{ color: '#4B5563', fontSize: 14, marginBottom: 18 }}>
              Se van a importar <strong>{pendingEvents.length}</strong> evento{pendingEvents.length !== 1 ? 's' : ''}. Si lo deseas, puedes asignarles una imagen ahora.
            </p>

            <div style={{ maxHeight: '40vh', overflowY: 'auto', marginBottom: '20px', borderTop: '1px solid #E5E7EB', paddingTop: '10px' }}>
              {pendingEvents.map((event, index) => (
                <div key={index} style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '12px', marginBottom: '12px' }}>
                  <p style={{ fontWeight: 600, fontSize: 14, margin: '0 0 6px', color: '#1F2937' }}>{event.name}</p>
                  <label style={{ fontSize: 12, color: '#4B5563', display: 'block', marginBottom: 4 }}>Imagen del evento (opcional):</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setEventImages(prev => ({ ...prev, [index]: e.target.files![0] }));
                      } else {
                        setEventImages(prev => {
                          const newImages = { ...prev };
                          delete newImages[index];
                          return newImages;
                        });
                      }
                    }} 
                    style={{ fontSize: 12, color: '#4B5563' }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button type="button" onClick={() => { setPendingEvents([]); setEventImages({}); }} disabled={loading} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #D1D5DB', backgroundColor: '#FFFFFF', color: '#4B5563', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
                Cancelar
              </button>
              <button type="button" onClick={importPendingEvents} disabled={loading} style={{ padding: '10px 16px', borderRadius: 8, border: 'none', backgroundColor: loading ? '#CBD5E1' : '#1A2E6C', color: '#FFFFFF', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Importando...' : 'Importar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {errors.length > 0 && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ backgroundColor: '#FFFFFF', width: '100%', maxWidth: 600, maxHeight: '80vh', overflowY: 'auto', borderRadius: 14, padding: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.25)', position: 'relative' }}>
            <button type="button" onClick={() => setErrors([])} style={{ position: 'absolute', top: 16, right: 16, border: 'none', background: 'transparent', color: '#6B7280', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h3 style={{ color: '#B91C1C', fontSize: 20, fontWeight: 800, marginBottom: 8 }}>No se pudo importar el archivo</h3>
            <p style={{ color: '#4B5563', fontSize: 14, marginBottom: 18 }}>Corrige estos errores y vuelve a importar.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {errors.map((error, index) => (
                <div key={`${error.row}-${error.column}-${index}`} style={{ border: '1px solid #FCA5A5', backgroundColor: '#FEF2F2', borderRadius: 8, padding: '12px 14px' }}>
                  <p style={{ color: '#7F1D1D', fontSize: 13, fontWeight: 800, margin: 0 }}>
                    {error.row > 0 ? `Línea ${error.row} · ` : ''}Columna "{error.column}"
                  </p>
                  <p style={{ color: '#991B1B', fontSize: 13, margin: '4px 0 8px' }}>{error.message}</p>
                  {error.steps.length > 0 && (
                    <>
                      <p style={{ color: '#7F1D1D', fontSize: 12, fontWeight: 700, margin: '0 0 4px' }}>Cómo corregirlo:</p>
                      <ol style={{ margin: 0, paddingLeft: 18, color: '#991B1B', fontSize: 12, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {error.steps.map((step, stepIndex) => (
                          <li key={stepIndex}>{step}</li>
                        ))}
                      </ol>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
