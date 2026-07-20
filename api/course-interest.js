import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import { escapeHtml, applyCors, isValidEmail } from './_utils.js';

export default async function handler(req, res) {
  if (applyCors(req, res, 'POST,OPTIONS')) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, phone, company, email, cursoArea, cursoCategory, eventosSeleccionados, eventos, comments, flyerUrl } = req.body;

  if (!name || !email || !cursoArea) {
    return res.status(400).json({ message: 'Name, email, and cursoArea are required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'El correo electrónico no es válido.' });
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
      console.log('--- NEW COURSE INTEREST ---');
      console.log(`Course: ${cursoArea} (${cursoCategory})`);
      console.log(`Name: ${name}`);
      console.log(`Company: ${company}`);
      console.log(`Email: ${email}`);
      console.log(`Events: ${eventosSeleccionados}`);
      console.log(`Comments: ${comments}`);
      console.log('---------------------------');
      return res.status(200).json({ message: 'Email sent implicitly (DEV MODE)' });
    }

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

    const subject = `Confirmación de interés en Curso: ${cursoArea}`;

    const safeUrl = (value) => (typeof value === 'string' && /^https?:\/\//i.test(value.trim()) ? value.trim() : '');
    const safeFlyerUrl = safeUrl(flyerUrl);

    // Botón para ver el flyer (material del curso)
    const flyerHtml = safeFlyerUrl ? `
      <div style="margin-top:20px; padding:16px; background:#F8FAFC; border-radius:8px; border:1px solid #E5E7EB;">
        <p style="margin:0 0 10px; font-weight:700; color:#1A2E6C;">Material del curso / Flyer:</p>
        <a href="${escapeHtml(safeFlyerUrl)}" target="_blank" style="display:inline-block; padding:8px 16px; background:#E8401C; color:#FFFFFF; border-radius:6px; text-decoration:none; font-weight:600; font-size:14px;">📄 Ver/Descargar Flyer</a>
      </div>` : '';

    // Preferimos el arreglo estructurado de eventos; la cadena solo queda como respaldo
    let selectedEvents = Array.isArray(eventos)
      ? eventos.filter((e) => e && e.name)
      : [];
    if (selectedEvents.length === 0 && eventosSeleccionados) {
      selectedEvents = eventosSeleccionados.split(', ').map((n) => ({ name: n }));
    }
    // Eliminar repetidos (mismo nombre)
    const seenEvents = new Set();
    selectedEvents = selectedEvents.filter((e) => {
      if (seenEvents.has(e.name)) return false;
      seenEvents.add(e.name);
      return true;
    });

    const eventsHtml = selectedEvents.length > 0
      ? `<ul>${selectedEvents.map((e) => {
          const url = safeUrl(e.flyerUrl);
          return `<li>${escapeHtml(e.name)}${url ? ` · <a href="${escapeHtml(url)}" target="_blank">Ver flyer</a>` : ''}</li>`;
        }).join('')}</ul>`
      : '<p>No seleccionó eventos específicos.</p>';

    // Botones con el flyer de cada evento seleccionado
    const eventFlyers = selectedEvents
      .map((e) => ({ name: e.name, url: safeUrl(e.flyerUrl) }))
      .filter((e) => e.url);
    const eventFlyersHtml = eventFlyers.length > 0 ? `
      <div style="margin-top:20px; padding:16px; background:#F8FAFC; border-radius:8px; border:1px solid #E5E7EB;">
        <p style="margin:0 0 10px; font-weight:700; color:#1A2E6C;">Flyers de los eventos seleccionados:</p>
        ${eventFlyers.map((e) => `<a href="${escapeHtml(e.url)}" target="_blank" style="display:inline-block; margin:0 12px 8px 0; padding:8px 16px; background:#1E3A8A; color:#FFFFFF; border-radius:6px; text-decoration:none; font-weight:600; font-size:14px;">📄 ${escapeHtml(e.name)}</a>`).join('')}
      </div>` : '';

    // Un solo correo al interesado, con copia a voluntariado, para que la
    // respuesta quede en el mismo hilo y no en dos conversaciones separadas.
    const html = `
      <h2>¡Gracias por tu interés, ${escapeHtml(name)}!</h2>
      <p>Hemos recibido correctamente tu solicitud para el curso de <strong>${escapeHtml(cursoArea)}</strong>.</p>
      <p><strong>Resumen de tu solicitud:</strong></p>
      <ul>
        <li><strong>Teléfono:</strong> ${escapeHtml(phone || 'N/A')}</li>
        <li><strong>Empresa/Organización:</strong> ${escapeHtml(company || 'N/A')}</li>
      </ul>
      <p><strong>Eventos en los que mostraste interés:</strong></p>
      ${eventsHtml}
      ${comments ? `<p><strong>Tus comentarios:</strong><br>${escapeHtml(comments)}</p>` : ''}

      ${flyerHtml}
      ${eventFlyersHtml}

      <p>Nos pondremos en contacto contigo lo más pronto posible para darte más detalles y coordinar la participación.</p>
      <br>
      <p>Atentamente,<br><strong>Equipo EZER</strong></p>
    `;

    const info = await transporter.sendMail({
      from: `"Ezer Cursos" <${process.env.SMTP_USER}>`,
      to: email,
      cc: adminEmail,
      replyTo: adminEmail,
      subject,
      html,
    });

    console.log('Message sent: %s', info.messageId);

    // Mandamos también Webhook si es necesario (similar a interest.js)
    try {
      await fetch("https://hook.us2.make.com/gk3msgktwdcxack4cb718h5d6a5ntfsd", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              nombre: name,
              correo: email,
              telefono: phone || '',
              empresa: company || '',
              evento: `Curso: ${cursoArea}`,
              comentarios: `Eventos seleccionados: ${eventosSeleccionados || 'Ninguno'}. Comentarios extra: ${comments || 'Ninguno'}`
          })
      });
    } catch (webhookErr) {
      console.error('Error sending webhook to Make:', webhookErr);
    }

    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Error sending email' });
  }
}
