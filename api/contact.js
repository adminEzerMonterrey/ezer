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
    subject: { required: true, max: 300 },
    message: { required: true, max: 5000 },
  });
  if (!validation.ok) {
    return res.status(400).json({ message: validation.error });
  }
  const { name, email, subject, message } = validation.values;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    if (!process.env.SMTP_USER) {
      console.log('--- NEW CONTACT MESSAGE ---');
      console.log(`Name: ${name}`);
      console.log(`Email: ${email}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);
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

    const adminSubjectStr = `Nuevo Mensaje de Contacto: ${subject}`;
    const userSubjectStr = `Confirmación de mensaje recibido: ${subject}`;

    const adminInfo = await transporter.sendMail({
      from: `"Ezer Contacto" <${process.env.SMTP_USER}>`,
      to: adminEmail, 
      subject: adminSubjectStr,
      text: `Tienes un nuevo mensaje de contacto.\n\nNombre: ${name}\nCorreo: ${email}\nAsunto: ${subject}\nMensaje:\n${message}`,
      html: `
        <h2>Nuevo Mensaje de Contacto</h2>
        <ul>
          <li><strong>Nombre:</strong> ${escapeHtml(name)}</li>
          <li><strong>Correo Electrónico:</strong> <a href="mailto:${encodeURIComponent(email)}">${escapeHtml(email)}</a></li>
          <li><strong>Asunto:</strong> ${escapeHtml(subject)}</li>
        </ul>
        <p><strong>Mensaje:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      `,
    });

    const userTextContact = `Estimada/o ${name}:
¡Gracias por su interés en el programa de Voluntariado Corporativo de EZER! Nos alegra mucho saber que usted quiere participar.
Queremos confirmarle que ya recibimos su mensaje. En breve, una persona de nuestro equipo le buscará para dar seguimiento, resolver cualquier duda y comenzar a coordinar los detalles.
Mientras tanto, no necesita hacer nada más: nosotros le contactaremos muy pronto.
Agradecemos su confianza y sus ganas de generar impacto en la comunidad. ¡Estamos por construir algo muy valioso juntos!

Saludos cordiales,
Equipo EZER
EZER A.B.P. · La Casa del Voluntario
voluntariadocorporativo@ezer.org.mx
ezer-eventos.vercel.app`;

    const userHtmlContact = `
      <p>Estimada/o ${escapeHtml(name)}:</p>
      <p>¡Gracias por su interés en el programa de Voluntariado Corporativo de EZER! Nos alegra mucho saber que <strong>usted</strong> quiere participar.</p>
      <p>Queremos confirmarle que ya recibimos su mensaje. En breve, una persona de nuestro equipo le buscará para dar seguimiento, resolver cualquier duda y comenzar a coordinar los detalles.</p>
      <p>Mientras tanto, no necesita hacer nada más: nosotros le contactaremos muy pronto.</p>
      <p>Agradecemos su confianza y sus ganas de generar impacto en la comunidad. ¡Estamos por construir algo muy valioso juntos!</p>
      <br>
      <p>Saludos cordiales,<br>
      <strong>Equipo EZER</strong><br>
      EZER A.B.P. · La Casa del Voluntario<br>
      <a href="mailto:voluntariadocorporativo@ezer.org.mx">voluntariadocorporativo@ezer.org.mx</a><br>
      <a href="https://ezer-eventos.vercel.app">ezer-eventos.vercel.app</a></p>
    `;

    const userInfo = await transporter.sendMail({
      from: `"Ezer Contacto" <${process.env.SMTP_USER}>`,
      to: email, 
      subject: `Recibimos tu interés — te buscaremos muy pronto`,
      text: userTextContact,
      html: userHtmlContact,
    });

    return res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Error sending email' });
  }
}
