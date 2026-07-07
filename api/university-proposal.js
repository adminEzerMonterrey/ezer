import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import { escapeHtml, applyCors, validateFields } from './_utils.js';

export default async function handler(req, res) {
  if (applyCors(req, res, 'POST,OPTIONS')) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const validation = validateFields(req.body || {}, {
    name: { required: true, max: 200 },
    email: { required: true, email: true, max: 254 },
    universidad: { max: 200 },
    evento: { required: true, max: 300 },
    area: { max: 200 },
    descripcion: { required: true, max: 5000 },
  });
  if (!validation.ok) {
    return res.status(400).json({ message: validation.error });
  }
  const { name, email, universidad, evento, area, descripcion } = validation.values;

  const uni = universidad || 'Universidad de Montemorelos';

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    if (!process.env.SMTP_USER) {
      console.log('--- NEW UNIVERSITY PROPOSAL ---');
      console.log(`Universidad: ${uni}`);
      console.log(`Evento propuesto: ${evento}`);
      console.log(`Área beneficiada: ${area || 'No especificada'}`);
      console.log(`Name: ${name}`);
      console.log(`Email: ${email}`);
      console.log(`Descripción: ${descripcion}`);
      console.log('-------------------------------');
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

    const adminSubject = `Nueva propuesta de evento universitario (${uni}): ${evento}`;
    const userSubject = `Recibimos tu propuesta de evento "${evento}" — Ezer Voluntariado`;

    const adminText = `Nueva propuesta de evento de voluntariado universitario.\n\nUniversidad: ${uni}\nEvento propuesto: ${evento}\nÁrea o sector beneficiado: ${area || 'No especificada'}\n\nNombre: ${name}\nCorreo: ${email}\n\nDescripción de la idea:\n${descripcion}`;

    const adminHtml = `
      <h2>Nueva propuesta de evento universitario</h2>
      <p>Una persona de <strong>${escapeHtml(uni)}</strong> propuso organizar un nuevo evento de voluntariado.</p>
      <ul>
        <li><strong>Universidad:</strong> ${escapeHtml(uni)}</li>
        <li><strong>Evento propuesto:</strong> ${escapeHtml(evento)}</li>
        <li><strong>Área o sector beneficiado:</strong> ${escapeHtml(area || 'No especificada')}</li>
        <li><strong>Nombre:</strong> ${escapeHtml(name)}</li>
        <li><strong>Correo:</strong> <a href="mailto:${encodeURIComponent(email)}">${escapeHtml(email)}</a></li>
      </ul>
      <p><strong>Descripción de la idea:</strong></p>
      <p>${escapeHtml(descripcion).replace(/\n/g, '<br>')}</p>
    `;

    const adminInfo = await transporter.sendMail({
      from: `"Ezer Universidades" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: adminSubject,
      text: adminText,
      html: adminHtml,
    });

    const userText = `Hola ${name},

¡Gracias por proponer un evento de voluntariado desde ${uni}!

Recibimos tu propuesta con estos datos:
Evento propuesto: ${evento}
Área o sector beneficiado: ${area || 'No especificada'}
Tu idea: ${descripcion}

Nos pondremos en contacto contigo muy pronto para buscar la asociación beneficiaria ideal y hacer realidad tu evento.

Saludos cordiales,
Equipo EZER
EZER A.B.P. · La Casa del Voluntario
voluntariadocorporativo@ezer.org.mx
ezer-eventos.vercel.app`;

    const userHtml = `
      <h2>¡Gracias por tu propuesta, ${escapeHtml(name)}!</h2>
      <p>Recibimos tu idea para organizar un evento de voluntariado desde <strong>${escapeHtml(uni)}</strong>.</p>
      <p><strong>Resumen de tu propuesta:</strong></p>
      <ul>
        <li><strong>Evento propuesto:</strong> ${escapeHtml(evento)}</li>
        <li><strong>Área o sector beneficiado:</strong> ${escapeHtml(area || 'No especificada')}</li>
        <li><strong>Tu idea:</strong> ${escapeHtml(descripcion).replace(/\n/g, '<br>')}</li>
      </ul>
      <p><strong>Nos pondremos en contacto contigo muy pronto para buscar la asociación beneficiaria ideal y hacer realidad tu evento.</strong></p>
      <br>
      <p>Saludos cordiales,<br>
      <strong>Equipo EZER</strong><br>
      EZER A.B.P. · La Casa del Voluntario<br>
      <a href="mailto:voluntariadocorporativo@ezer.org.mx">voluntariadocorporativo@ezer.org.mx</a><br>
      <a href="https://ezer-eventos.vercel.app">ezer-eventos.vercel.app</a></p>
    `;

    const userInfo = await transporter.sendMail({
      from: `"Ezer Universidades" <${process.env.SMTP_USER}>`,
      to: email,
      subject: userSubject,
      text: userText,
      html: userHtml,
    });

    console.log('Message sent to admin: %s', adminInfo.messageId);
    console.log('Message sent to user: %s', userInfo.messageId);

    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Error sending email' });
  }
}
