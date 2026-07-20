import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import { escapeHtml, applyCors, validateFields } from './_utils.js';

// Tipos de archivo permitidos como adjunto (documentos e imágenes de apoyo).
const ALLOWED_FILE_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/webp',
]);
// Límite de ~6 MB de archivo real (el base64 pesa ~33% más).
const MAX_FILE_BASE64_LENGTH = 8 * 1024 * 1024;

export default async function handler(req, res) {
  if (applyCors(req, res, 'POST,OPTIONS')) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const validation = validateFields(req.body || {}, {
    org: { required: true, max: 200 },
    email: { required: true, email: true, max: 254 },
    phone: { max: 50 },
    fileName: { max: 260 },
  });
  if (!validation.ok) {
    return res.status(400).json({ message: validation.error });
  }
  const { org, email, phone, fileName } = validation.values;
  const { hasFile, fileData, fileType } = req.body;

  // Validación del adjunto: tamaño y tipo permitido.
  if (hasFile && fileData) {
    if (typeof fileData !== 'string' || fileData.length > MAX_FILE_BASE64_LENGTH) {
      return res.status(400).json({ message: 'El archivo adjunto excede el tamaño máximo permitido (6 MB).' });
    }
    if (fileType && !ALLOWED_FILE_TYPES.has(fileType)) {
      return res.status(400).json({ message: 'Tipo de archivo no permitido. Usa PDF, Word o imagen.' });
    }
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    if (!process.env.SMTP_USER) {
      console.log('--- NEW COLLABORATION REQUEST ---');
      console.log(`Org: ${org}`);
      console.log(`Email: ${email}`);
      console.log(`Phone: ${phone}`);
      console.log(`File: ${hasFile ? fileName : 'None'}`);
      console.log('---------------------------------');
      return res.status(200).json({ message: 'Logged (DEV MODE)' });
    }

    // Obtener el correo del administrador desde Supabase
    let adminEmail = 'voluntariadocorporativo@ezer.org.mx';
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
        const { data, error } = await supabase.from('hero_stats').select('value').eq('key', 'admin_email').single();
        if (!error && data && data.value) {
          adminEmail = data.value;
        }
      } catch (err) {
        console.error('Error fetching admin email config:', err);
      }
    }

    // Un solo correo al solicitante, con copia a voluntariado, para que la
    // respuesta quede en el mismo hilo y no en dos conversaciones separadas.
    await transporter.sendMail({
      from: `"Ezer Colaboraciones" <${process.env.SMTP_USER}>`,
      to: email,
      cc: adminEmail,
      replyTo: adminEmail,
      subject: `Confirmación de solicitud de colaboración – EZER`,
      text: `Hola,\n\nHemos recibido tu solicitud de colaboración de parte de "${org}".\n\nNuestro equipo revisará tu información y se pondrá en contacto contigo en las próximas 48 horas.\n\nGracias por tu interés en colaborar con EZER.\n\nAtentamente,\nEquipo EZER`,
      html: `
        <h2>¡Gracias por querer colaborar con EZER!</h2>
        <p>Hemos recibido correctamente tu solicitud de colaboración.</p>
        <p><strong>Resumen:</strong></p>
        <ul>
          <li><strong>Organización:</strong> ${escapeHtml(org)}</li>
          <li><strong>Correo:</strong> ${escapeHtml(email)}</li>
          <li><strong>Teléfono:</strong> ${escapeHtml(phone || 'No proporcionado')}</li>
          <li><strong>Documento adjunto:</strong> ${hasFile ? 'Sí (' + escapeHtml(fileName) + ')' : 'No'}</li>
        </ul>
        <p>Nuestro equipo revisará tu información y se pondrá en contacto contigo en las próximas <strong>48 horas</strong>.</p>
        <br>
        <p>Atentamente,<br><strong>Equipo EZER</strong></p>
      `,
      attachments: (hasFile && fileData && fileName) ? [
        {
          filename: fileName,
          content: fileData,
          encoding: 'base64',
          contentType: fileType || 'application/octet-stream'
        }
      ] : []
    });

    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending collaboration email:', error);
    return res.status(500).json({ message: 'Error sending email' });
  }
}
