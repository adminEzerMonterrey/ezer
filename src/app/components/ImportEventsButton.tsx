import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { Download, FileSpreadsheet, X, ImagePlus, CheckCircle2 } from 'lucide-react';
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
  date: string;
  target_audience: string;
  description: string;
  objective: string;
  municipio: string;
  cost: string;
  coordinador: string;
  is_annual: boolean;
  has_flyer: boolean;
  has_ficha_tecnica: boolean;
  spots_min: number;
  spots_max: number;
  asociacion: string;
  asociacion_municipio: string;
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
  'Tiene flyer',
  'Tiene ficha tecnica',
  'Descripcion',
  'Asociacion',
  'Municipio de la asociacion',
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
  'No',
  'No',
  'Describe el evento con claridad.',
  'Asociación Civil Ejemplo (opcional)',
  'Monterrey',
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

// Alias comunes / abreviaciones de municipios de Nuevo León que los administradores
// suelen escribir en el Excel, mapeados al nombre oficial usado en NUEVO_LEON_MUNICIPALITIES.
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
  // If any part fails to resolve, return empty to trigger the existing validation error
  if (resolvedParts.some(r => !r)) return '';
  // Join uniquely
  return Array.from(new Set(resolvedParts)).join(', ');
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
  const imageInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const flyerInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ImportError[]>([]);
  const [summary, setSummary] = useState('');
  const [pendingEvents, setPendingEvents] = useState<EventImportDraft[]>([]);
  const [imageFiles, setImageFiles] = useState<Record<number, File | null>>({});
  const [flyerFiles, setFlyerFiles] = useState<Record<number, File | null>>({});
  const [fichaFiles, setFichaFiles] = useState<Record<number, File | null>>({});

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
        const municipio = resolveMunicipio(row['Municipio']);
        const spotsMin = parseNonNegativeInteger(row['Espacios minimos']);
        const spotsMax = parseNonNegativeInteger(row['Espacios maximos']);
        const cost = normalizeText(row['Cuota de recuperacion']) || 'Gratuito';
        const coordinador = normalizeText(row['Coordinador']);
        const isAnnual = parseBoolean(row['Evento anual']);
        const hasFlyer = parseBoolean(row['Tiene flyer']);
        const hasFichaTecnica = parseBoolean(row['Tiene ficha tecnica']);
        const description = normalizeText(row['Descripcion']);
        const asociacion = normalizeText(row['Asociacion']);
        const asociacionMunicipio = resolveMunicipio(row['Municipio de la asociacion']);

        if (!title) {
          validationErrors.push(buildError(
            excelRow,
            'Titulo',
            'La celda está vacía. Cada evento debe tener un título.',
            [
              `Ve a la fila ${excelRow}, columna "Titulo".`,
              'Escribe el nombre del evento (ejemplo: "Limpieza de parque").',
              'Guarda el archivo y vuelve a importarlo.',
            ],
          ));
        }

        if (!date) {
          const raw = normalizeText(row['Fecha de cierre']);
          validationErrors.push(buildError(
            excelRow,
            'Fecha de cierre',
            raw ? `"${raw}" no es una fecha válida.` : 'La celda está vacía.',
            [
              `Ve a la fila ${excelRow}, columna "Fecha de cierre".`,
              'Escribe la fecha en formato AAAA-MM-DD (ejemplo: 2026-08-15) o DD/MM/AAAA (ejemplo: 15/08/2026).',
              'No uses texto como "próximamente", solo el mes, o dejes la celda vacía.',
              'Guarda el archivo y vuelve a importarlo.',
            ],
          ));
        }

        if (!objective) {
          const raw = normalizeText(row['Sector beneficiado']);
          validationErrors.push(buildError(
            excelRow,
            'Sector beneficiado',
            raw ? `"${raw}" no es un sector reconocido.` : 'La celda está vacía.',
            [
              'Abre la hoja "Opciones" dentro de este mismo archivo Excel: ahí están los sectores válidos.',
              `Copia y pega exactamente uno de esos valores en la columna "Sector beneficiado" (ejemplo: "${EVENT_CATEGORIES[0] ?? ''}").`,
              'Guarda el archivo y vuelve a importarlo.',
            ],
          ));
        }

        if (!municipio) {
          const raw = normalizeText(row['Municipio']);
          validationErrors.push(buildError(
            excelRow,
            'Municipio',
            raw ? `"${raw}" no se reconoce como un municipio de Nuevo León.` : 'La celda está vacía.',
            [
              'Revisa que el municipio exista en Nuevo León (ejemplo: Monterrey, Guadalupe, San Pedro Garza García, General Escobedo).',
              'También se aceptan abreviaciones comunes como "MTY", "GPE", "Escobedo", "San Pedro" o "San Nicolás": el sistema las reconoce automáticamente.',
              'Verifica que no haya errores de escritura ni espacios extra.',
              'Guarda el archivo y vuelve a importarlo.',
            ],
          ));
        }

        if (spotsMin == null) {
          const raw = normalizeText(row['Espacios minimos']);
          validationErrors.push(buildError(
            excelRow,
            'Espacios minimos',
            raw ? `"${raw}" no es un número entero válido (0 o mayor).` : 'La celda está vacía.',
            [
              `Ve a la fila ${excelRow}, columna "Espacios minimos".`,
              'Escribe solo un número entero, sin letras ni símbolos (ejemplo: 10).',
              'El número no puede ser negativo.',
              'Guarda el archivo y vuelve a importarlo.',
            ],
          ));
        }

        if (spotsMax == null) {
          const raw = normalizeText(row['Espacios maximos']);
          validationErrors.push(buildError(
            excelRow,
            'Espacios maximos',
            raw ? `"${raw}" no es un número entero válido (0 o mayor).` : 'La celda está vacía.',
            [
              `Ve a la fila ${excelRow}, columna "Espacios maximos".`,
              'Escribe solo un número entero, sin letras ni símbolos (ejemplo: 25).',
              'El número no puede ser negativo.',
              'Guarda el archivo y vuelve a importarlo.',
            ],
          ));
        }

        if (spotsMin != null && spotsMax != null && spotsMin > spotsMax) {
          validationErrors.push(buildError(
            excelRow,
            'Espacios maximos',
            `"Espacios maximos" (${spotsMax}) es menor que "Espacios minimos" (${spotsMin}). El máximo no puede ser menor que el mínimo.`,
            [
              `Revisa las columnas "Espacios minimos" y "Espacios maximos" en la fila ${excelRow}.`,
              '"Espacios maximos" debe ser igual o mayor que "Espacios minimos".',
              'Si el evento tiene un cupo fijo, usa el mismo número en ambas columnas.',
              'Guarda el archivo y vuelve a importarlo.',
            ],
          ));
        }

        if (!coordinador) {
          validationErrors.push(buildError(
            excelRow,
            'Coordinador',
            'La celda está vacía. Cada evento debe tener un coordinador asignado.',
            [
              `Ve a la fila ${excelRow}, columna "Coordinador".`,
              'Escribe el nombre completo de la persona responsable del evento.',
              'Guarda el archivo y vuelve a importarlo.',
            ],
          ));
        }

        if (isAnnual == null) {
          const raw = normalizeText(row['Evento anual']);
          validationErrors.push(buildError(
            excelRow,
            'Evento anual',
            raw ? `"${raw}" no es un valor reconocido.` : 'La celda está vacía.',
            [
              `Ve a la fila ${excelRow}, columna "Evento anual".`,
              'Escribe únicamente "Si" o "No" (sin acentos también funciona).',
              'Guarda el archivo y vuelve a importarlo.',
            ],
          ));
        }

        if (hasFlyer == null) {
          const raw = normalizeText(row['Tiene flyer']);
          validationErrors.push(buildError(
            excelRow,
            'Tiene flyer',
            raw ? `"${raw}" no es un valor reconocido.` : 'La celda está vacía.',
            [
              `Ve a la fila ${excelRow}, columna "Tiene flyer".`,
              'Escribe únicamente "Si" o "No" (sin acentos también funciona).',
              'Guarda el archivo y vuelve a importarlo.',
            ],
          ));
        }

        if (hasFichaTecnica == null) {
          const raw = normalizeText(row['Tiene ficha tecnica']);
          validationErrors.push(buildError(
            excelRow,
            'Tiene ficha tecnica',
            raw ? `"${raw}" no es un valor reconocido.` : 'La celda está vacía.',
            [
              `Ve a la fila ${excelRow}, columna "Tiene ficha tecnica".`,
              'Escribe únicamente "Si" o "No" (sin acentos también funciona).',
              'Guarda el archivo y vuelve a importarlo.',
            ],
          ));
        }

        if (!description) {
          validationErrors.push(buildError(
            excelRow,
            'Descripcion',
            'La celda está vacía. Cada evento debe tener una descripción.',
            [
              `Ve a la fila ${excelRow}, columna "Descripcion".`,
              'Escribe una breve descripción del evento.',
              'Guarda el archivo y vuelve a importarlo.',
            ],
          ));
        }

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
          has_flyer: hasFlyer === true,
          has_ficha_tecnica: hasFichaTecnica === true,
          spots_min: spotsMin ?? 0,
          spots_max: spotsMax ?? 0,
          asociacion,
          asociacion_municipio: asociacionMunicipio,
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
    setFlyerFiles({});
    setFichaFiles({});

    try {
      const workbook = XLSX.read(await file.arrayBuffer(), { cellDates: true });
      const worksheet = workbook.Sheets.Eventos || workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });

      if (rows.length === 0) {
        setErrors([buildError(
          0,
          'Archivo',
          'El archivo no contiene ninguna fila de eventos.',
          [
            'Abre la plantilla y llena al menos una fila debajo de los encabezados, en la hoja "Eventos".',
            'No borres ni renombres la primera fila (los nombres de columna).',
            'Guarda el archivo y vuelve a importarlo.',
          ],
        )]);
        return;
      }

      const { events, validationErrors } = validateRows(rows);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      setPendingEvents(events);
    } catch (error: any) {
      setErrors([buildError(
        0,
        'Archivo',
        `No se pudo leer el archivo. ${error?.message ? `Detalle: ${error.message}` : ''}`.trim(),
        [
          'Verifica que el archivo sea un Excel válido con extensión .xlsx o .xls.',
          'No cambies los nombres de las columnas de la plantilla original.',
          'Si el problema persiste, descarga una plantilla nueva con el botón "Descargar plantilla" y copia tus datos ahí.',
        ],
      )]);
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
        .map((event) => buildError(
          event.sourceRow,
          'Imagen',
          `No se eligió ninguna imagen para el evento "${event.name}".`,
          [
            `Busca el evento "${event.name}" en la lista de abajo.`,
            'Haz clic en el botón "Elegir imagen" junto a ese evento.',
            'Selecciona una foto desde tu computadora (JPG, PNG o similar).',
            'Vuelve a hacer clic en "Importar con imágenes".',
          ],
        ));

      const missingFlyers = pendingEvents
        .filter((event, index) => event.has_flyer && !flyerFiles[index])
        .map((event) => buildError(
          event.sourceRow,
          'Flyer',
          `No se eligió ningún flyer para el evento "${event.name}".`,
          [
            `El evento "${event.name}" indicó "Si" en "Tiene flyer".`,
            'Haz clic en "Elegir flyer" y selecciona un PDF o imagen.',
          ],
        ));

      const missingFichas = pendingEvents
        .filter((event, index) => event.has_ficha_tecnica && !fichaFiles[index])
        .map((event) => buildError(
          event.sourceRow,
          'Ficha Técnica',
          `No se eligió ninguna ficha técnica para el evento "${event.name}".`,
          [
            `El evento "${event.name}" indicó "Si" en "Tiene ficha tecnica".`,
            'Haz clic en "Elegir ficha técnica" y selecciona un PDF o imagen.',
          ],
        ));

      if (missingImages.length > 0 || missingFlyers.length > 0 || missingFichas.length > 0) {
        setErrors([...missingImages, ...missingFlyers, ...missingFichas]);
        return;
      }

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        setErrors([buildError(
          0,
          'Sesión',
          'Tu sesión de administrador ya no está activa.',
          [
            'Cierra sesión y vuelve a iniciar sesión como administrador.',
            'Repite la importación del archivo desde el inicio.',
          ],
        )]);
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
          setErrors([buildError(
            pendingEvents[index].sourceRow,
            'Imagen',
            `No se pudo subir la imagen de "${pendingEvents[index].name}". Detalle: ${uploadError.message}`,
            [
              'Verifica tu conexión a internet.',
              'Intenta con una imagen más pequeña (idealmente menos de 5 MB) en formato JPG o PNG.',
              'Vuelve a hacer clic en "Importar con imágenes".',
            ],
          )]);
          return;
        }

        const { data } = supabase.storage
          .from('event-images')
          .getPublicUrl(fileName);

        let flyerUrl = null;
        if (pendingEvents[index].has_flyer) {
          const flyerFile = flyerFiles[index];
          if (flyerFile) {
            const flyerName = `flyers/${crypto.randomUUID()}-${flyerFile.name}`;
            const { error: fErr } = await supabase.storage.from('event-images').upload(flyerName, flyerFile);
            if (fErr) {
              setErrors([buildError(
                pendingEvents[index].sourceRow,
                'Flyer',
                `Error subiendo flyer de "${pendingEvents[index].name}": ${fErr.message}`,
                []
              )]);
              return;
            }
            const { data: fData } = supabase.storage.from('event-images').getPublicUrl(flyerName);
            flyerUrl = fData.publicUrl;
          }
        }

        let fichaUrl = null;
        if (pendingEvents[index].has_ficha_tecnica) {
          const fichaFile = fichaFiles[index];
          if (fichaFile) {
            const fichaName = `fichas/${crypto.randomUUID()}-${fichaFile.name}`;
            const { error: fErr } = await supabase.storage.from('event-images').upload(fichaName, fichaFile);
            if (fErr) {
              setErrors([buildError(
                pendingEvents[index].sourceRow,
                'Ficha Técnica',
                `Error subiendo ficha técnica de "${pendingEvents[index].name}": ${fErr.message}`,
                []
              )]);
              return;
            }
            const { data: fData } = supabase.storage.from('event-images').getPublicUrl(fichaName);
            fichaUrl = fData.publicUrl;
          }
        }

        const { sourceRow, has_flyer, has_ficha_tecnica, ...event } = pendingEvents[index];
        events.push({ ...event, image_url: data.publicUrl, flyer_url: flyerUrl, ficha_tecnica_url: fichaUrl });
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
        setErrors([buildError(
          0,
          'Importación',
          responseData.message || `El servidor respondió con un error (código ${response.status}).`,
          [
            'Verifica tu conexión a internet y que tu sesión no haya expirado.',
            'Vuelve a intentar la importación.',
            'Si el problema continúa, contacta a soporte técnico.',
          ],
        )]);
        return;
      }

      setSummary(`Se importaron ${events.length} eventos correctamente.`);
      setPendingEvents([]);
      setImageFiles({});
      setFlyerFiles({});
      setFichaFiles({});
      onEventsImported();
    } catch (error: any) {
      setErrors([buildError(
        0,
        'Importación',
        error?.message || 'Ocurrió un error inesperado al importar los eventos.',
        [
          'Verifica tu conexión a internet.',
          'Vuelve a intentar la importación.',
          'Si el problema continúa, contacta a soporte técnico.',
        ],
      )]);
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
                setFlyerFiles({});
                setFichaFiles({});
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <input
                      ref={(el) => { imageInputRefs.current[index] = el; }}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(inputEvent) => {
                        const file = inputEvent.target.files?.[0] ?? null;
                        setImageFiles((current) => ({ ...current, [index]: file }));
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => imageInputRefs.current[index]?.click()}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 6, border: '1px solid #D1D5DB', backgroundColor: '#FFFFFF', color: '#1A2E6C', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                    >
                      <ImagePlus size={14} />
                      {imageFiles[index] ? 'Cambiar imagen' : 'Elegir imagen'}
                    </button>
                    {imageFiles[index] ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#16A34A', fontWeight: 700 }}>
                        <CheckCircle2 size={14} />
                        {imageFiles[index]!.name}
                      </span>
                    ) : (
                      <span style={{ fontSize: 12, color: '#9CA3AF' }}>Ningún archivo seleccionado</span>
                    )}
                    
                    {event.has_flyer && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', borderLeft: '2px solid #E5E7EB', paddingLeft: 12, marginLeft: 4 }}>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          style={{ display: 'none' }}
                          id={`flyer-input-${index}`}
                          onChange={(inputEvent) => {
                            const file = inputEvent.target.files?.[0] ?? null;
                            setFlyerFiles((current) => ({ ...current, [index]: file }));
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById(`flyer-input-${index}`)?.click()}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 6, border: '1px solid #D1D5DB', backgroundColor: '#FFFFFF', color: '#1A2E6C', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                        >
                          <FileSpreadsheet size={14} />
                          {flyerFiles[index] ? 'Cambiar flyer' : 'Elegir flyer'}
                        </button>
                        {flyerFiles[index] ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#16A34A', fontWeight: 700 }}>
                            <CheckCircle2 size={14} />
                            {flyerFiles[index]!.name}
                          </span>
                        ) : (
                          <span style={{ fontSize: 12, color: '#E8401C' }}>Falta flyer</span>
                        )}
                      </div>
                    )}
                    
                    {event.has_ficha_tecnica && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', borderLeft: '2px solid #E5E7EB', paddingLeft: 12, marginLeft: 4 }}>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          style={{ display: 'none' }}
                          id={`ficha-input-${index}`}
                          onChange={(inputEvent) => {
                            const file = inputEvent.target.files?.[0] ?? null;
                            setFichaFiles((current) => ({ ...current, [index]: file }));
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById(`ficha-input-${index}`)?.click()}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 6, border: '1px solid #D1D5DB', backgroundColor: '#FFFFFF', color: '#1A2E6C', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                        >
                          <FileSpreadsheet size={14} />
                          {fichaFiles[index] ? 'Cambiar ficha' : 'Elegir ficha'}
                        </button>
                        {fichaFiles[index] ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#16A34A', fontWeight: 700 }}>
                            <CheckCircle2 size={14} />
                            {fichaFiles[index]!.name}
                          </span>
                        ) : (
                          <span style={{ fontSize: 12, color: '#E8401C' }}>Falta ficha técnica</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <button
                type="button"
                onClick={() => {
                  setPendingEvents([]);
                  setImageFiles({});
                  setFlyerFiles({});
                  setFichaFiles({});
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {errors.map((error, index) => (
                <div key={`${error.row}-${error.column}-${index}`} style={{ border: '1px solid #FCA5A5', backgroundColor: '#FEF2F2', borderRadius: 8, padding: '12px 14px' }}>
                  <p style={{ color: '#7F1D1D', fontSize: 13, fontWeight: 800, margin: 0 }}>
                    {error.row > 0 ? `Línea ${error.row} · ` : ''}Columna "{error.column}"
                  </p>
                  <p style={{ color: '#991B1B', fontSize: 13, margin: '4px 0 8px' }}>
                    {error.message}
                  </p>
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
