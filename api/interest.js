import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import { escapeHtml, applyCors, isValidEmail } from './_utils.js';


export default async function handler(req, res) {
  if (applyCors(req, res, 'POST,OPTIONS')) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, phone, company, email, eventName, description, wantsTraining, municipio, projects, comments, flyerUrl, courseUrl, requestType } = req.body;

  if (!name || !phone || !email || !eventName) {
    return res.status(400).json({ message: 'Name, phone, email, and eventName are required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'El correo electrónico no es válido.' });
  }

  try {
    // Si no hay configuración real de SMTP, usamos uno de prueba de ethereal (o console.log en entorno dev)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Validar si tenemos las credenciales en producción
    if (!process.env.SMTP_USER) {
      console.log('--- NEW INTEREST LEAD ---');
      console.log(`Event: ${eventName}`);
      console.log(`Name: ${name}`);
      console.log(`Company: ${company}`);
      console.log(`Phone: ${phone}`);
      console.log(`Email: ${email}`);
      console.log(`Wants training: ${wantsTraining ? 'Sí' : 'No'}`);
      console.log(`Description: ${description}`);
      console.log('-------------------------');
      // Aún así respondemos ok para que la Demo funcione sin trabarse.
      return res.status(200).json({ message: 'Email sent implicitly (DEV MODE)' });
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

    const isRegistration = eventName.startsWith('Registro');
    const isMunicipioRequest = requestType === 'municipio' || eventName.startsWith('Solicitud de evento en municipio');
    const municipioName = municipio || 'No especificado';

    const userSubject = isRegistration
      ? `Recibimos tu interés — te buscaremos muy pronto`
      : isMunicipioRequest
        ? `Recibimos tu solicitud de evento en ${municipioName} — Ezer Voluntariado`
        : `Confirmación de solicitud para evento: ${eventName}`;

    // Solo permitimos URLs http/https en los enlaces de archivos (evita javascript:, data:, etc.)
    const safeUrl = (value) => (typeof value === 'string' && /^https?:\/\//i.test(value.trim()) ? value.trim() : '');
    const safeFlyerUrl = safeUrl(flyerUrl);
    const safeCourseUrl = safeUrl(courseUrl);

    const projectsHtml = (projects && projects.length > 0)
      ? `<li><strong>Programas de interés:</strong><ul>${projects.map(p => `<li>${escapeHtml(p)}</li>`).join('')}</ul></li>`
      : '';

    const municipioHtml = municipio ? `<li><strong>Municipio:</strong> ${escapeHtml(municipio)}</li>` : '';
    const finalComments = comments ? comments : description;

    const eventFilesHtml = (safeFlyerUrl || safeCourseUrl) ? `
      <div style="margin-top:20px; padding:16px; background:#F8FAFC; border-radius:8px; border:1px solid #E5E7EB;">
        <p style="margin:0 0 10px; font-weight:700; color:#1A2E6C;">Archivos del evento:</p>
        ${safeFlyerUrl ? `<a href="${escapeHtml(safeFlyerUrl)}" target="_blank" style="display:inline-block; margin-right:12px; padding:8px 16px; background:#1E3A8A; color:#FFFFFF; border-radius:6px; text-decoration:none; font-weight:600; font-size:14px;">📄 Ver Flyer</a>` : ''}
        ${safeCourseUrl ? `<a href="${escapeHtml(safeCourseUrl)}" target="_blank" style="display:inline-block; padding:8px 16px; background:#15803D; color:#FFFFFF; border-radius:6px; text-decoration:none; font-weight:600; font-size:14px;">📚 Curso de Sensibilización</a>` : ''}
      </div>` : '';

    // TODO: reemplazar por el link real de Calendly del equipo de voluntariado.
    const calendlyUrl = 'https://calendly.com/ezer-voluntariado/reunion';
    const calendlyText = `Agenda una reunión con nuestro equipo aquí: ${calendlyUrl}`;
    const calendlyHtml = `
      <div style="margin-top:20px; padding:16px; background:#F8FAFC; border-radius:8px; border:1px solid #E5E7EB;">
        <p style="margin:0 0 10px; font-weight:700; color:#1A2E6C;">Agenda una reunión con nuestro equipo:</p>
        <a href="${calendlyUrl}" target="_blank" style="display:inline-block; padding:8px 16px; background:#E8401C; color:#FFFFFF; border-radius:6px; text-decoration:none; font-weight:600; font-size:14px;">📅 Agendar en Calendly</a>
      </div>`;

    const userTextRegistration = `Estimada/o ${name}:
¡Gracias por su interés en el programa de Voluntariado Corporativo de EZER! Nos alegra mucho saber que ${company || 'su empresa/asociación'} quiere participar.
Queremos confirmarle que ya recibimos su mensaje. En breve, una persona de nuestro equipo le buscará para dar seguimiento, resolver cualquier duda y comenzar a coordinar los detalles.
Mientras tanto, no necesita hacer nada más: nosotros le contactaremos muy pronto.
Agradecemos su confianza y sus ganas de generar impacto en la comunidad. ¡Estamos por construir algo muy valioso juntos!

Resumen de su registro:
Teléfono: ${phone}
Empresa/Organización: ${company || 'N/A'}
Municipio: ${municipio || 'No especificado'}
Programas de interés: ${projects && projects.length > 0 ? projects.join(', ') : 'N/A'}
¿Quiere capacitación?: ${wantsTraining ? 'Sí' : 'No'}
Comentarios: ${finalComments}

${calendlyText}

Saludos cordiales,
Equipo EZER
EZER A.B.P. · La Casa del Voluntario
voluntariadocorporativo@ezer.org.mx
ezer-eventos.vercel.app`;

    const userHtmlRegistration = `
      <p>Estimada/o ${escapeHtml(name)}:</p>
      <p>¡Gracias por su interés en el programa de Voluntariado Corporativo de EZER! Nos alegra mucho saber que <strong>${escapeHtml(company || 'su empresa/asociación')}</strong> quiere participar.</p>
      <p>Queremos confirmarle que ya recibimos su mensaje. En breve, una persona de nuestro equipo le buscará para dar seguimiento, resolver cualquier duda y comenzar a coordinar los detalles.</p>
      <p>Mientras tanto, no necesita hacer nada más: nosotros le contactaremos muy pronto.</p>
      <p>Agradecemos su confianza y sus ganas de generar impacto en la comunidad. ¡Estamos por construir algo muy valioso juntos!</p>
      <p><strong>Resumen de su registro:</strong></p>
      <ul>
        <li><strong>Teléfono:</strong> ${escapeHtml(phone)}</li>
        <li><strong>Empresa/Organización:</strong> ${escapeHtml(company || 'N/A')}</li>
        ${municipioHtml}
        ${projectsHtml}
        <li><strong>¿Quiere capacitación?:</strong> ${wantsTraining ? 'Sí' : 'No'}</li>
      </ul>
      <p><strong>Comentarios:</strong> ${escapeHtml(finalComments).replace(/\n/g, '<br>')}</p>
      ${calendlyHtml}
      <br>
      <p>Saludos cordiales,<br>
      <strong>Equipo EZER</strong><br>
      EZER A.B.P. · La Casa del Voluntario<br>
      <a href="mailto:voluntariadocorporativo@ezer.org.mx">voluntariadocorporativo@ezer.org.mx</a><br>
      <a href="https://ezer-eventos.vercel.app">ezer-eventos.vercel.app</a></p>
    `;

    const userTextMunicipio = `Hola ${name},

Recibimos tu solicitud para que Ezer organice un evento de voluntariado en ${municipioName}.

Resumen de tu solicitud:
Municipio: ${municipioName}
Empresa / Organización: ${company || 'N/A'}
Teléfono: ${phone}
Lo que te gustaría hacer: ${finalComments}

Nos pondremos en contacto contigo muy pronto para coordinar la organización de un evento de voluntariado en ${municipioName}.

¡Gracias por tu interés en generar impacto en tu comunidad!

Saludos cordiales,
Equipo EZER
EZER A.B.P. · La Casa del Voluntario
voluntariadocorporativo@ezer.org.mx
ezer-eventos.vercel.app`;

    const userHtmlMunicipio = `
      <h2>¡Gracias por tu interés, ${escapeHtml(name)}!</h2>
      <p>Recibimos tu solicitud para que Ezer organice un evento de voluntariado en <strong>${escapeHtml(municipioName)}</strong>.</p>
      <p><strong>Resumen de tu solicitud:</strong></p>
      <ul>
        <li><strong>Municipio:</strong> ${escapeHtml(municipioName)}</li>
        <li><strong>Empresa / Organización:</strong> ${escapeHtml(company || 'N/A')}</li>
        <li><strong>Teléfono:</strong> ${escapeHtml(phone)}</li>
        <li><strong>Lo que te gustaría hacer:</strong> ${escapeHtml(finalComments).replace(/\n/g, '<br>')}</li>
      </ul>
      <p><strong>Nos pondremos en contacto contigo muy pronto para coordinar la organización de un evento de voluntariado en ${escapeHtml(municipioName)}.</strong></p>
      <p>¡Gracias por tu interés en generar impacto en tu comunidad!</p>
      <br>
      <p>Saludos cordiales,<br>
      <strong>Equipo EZER</strong><br>
      EZER A.B.P. · La Casa del Voluntario<br>
      <a href="mailto:voluntariadocorporativo@ezer.org.mx">voluntariadocorporativo@ezer.org.mx</a><br>
      <a href="https://ezer-eventos.vercel.app">ezer-eventos.vercel.app</a></p>
    `;

    const userTextCatalog = `Hola ${name},\n\nHemos recibido tu solicitud de interés para el evento "${eventName}".\nEstos son los datos que nos enviaste:\n\nTeléfono: ${phone}\nEmpresa: ${company}\nMunicipio: ${municipio || 'No especificado'}\nProgramas de interés: ${projects && projects.length > 0 ? projects.join(', ') : 'N/A'}\n¿Quieres capacitación?: ${wantsTraining ? 'Sí' : 'No'}\nDescripción y Motivo: ${description}\n\n${calendlyText}\n\nPronto nos pondremos en contacto contigo.\n\nSaludos,\nEquipo Ezer`;

    const userHtmlCatalog = `
      <h2>¡Gracias por tu interés, ${escapeHtml(name)}!</h2>
      <p>Hemos recibido correctamente tus datos para participar en el evento <strong>${escapeHtml(eventName)}</strong>.</p>
      <p><strong>Resumen de tu solicitud:</strong></p>
      <ul>
        <li><strong>Teléfono:</strong> ${escapeHtml(phone)}</li>
        <li><strong>Organización / Empresa:</strong> ${escapeHtml(company || 'N/A')}</li>
        ${municipioHtml}
        ${projectsHtml}
        <li><strong>¿Quieres capacitación?:</strong> ${wantsTraining ? 'Sí' : 'No'}</li>
        <li><strong>Tus comentarios:</strong> ${escapeHtml(description)}</li>
      </ul>
      <p>Nos pondremos en contacto contigo lo más pronto posible para darte más detalles.</p>
      ${eventFilesHtml}
      ${calendlyHtml}
      <br>
      <p>Atentamente,<br><strong>Equipo EZER</strong></p>
    `;

    // Un solo correo al interesado, con copia a voluntariado, para que la
    // respuesta quede en el mismo hilo y no en dos conversaciones separadas.
    const info = await transporter.sendMail({
      from: `"Ezer Eventos" <${process.env.SMTP_USER}>`,
      to: email,
      cc: adminEmail,
      replyTo: adminEmail,
      subject: userSubject,
      text: isRegistration ? userTextRegistration : isMunicipioRequest ? userTextMunicipio : userTextCatalog,
      html: isRegistration ? userHtmlRegistration : isMunicipioRequest ? userHtmlMunicipio : userHtmlCatalog,
    });

    console.log('Message sent: %s', info.messageId);

    try {
      await fetch("https://hook.us2.make.com/gk3msgktwdcxack4cb718h5d6a5ntfsd", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              tipo: isRegistration ? "registro_empresa" : "evento",
              nombre: name,
              correo: email,
              telefono: phone,
              empresa: company || '',
              evento: eventName,
              comentarios: finalComments,
              capacitacion: wantsTraining ? 'Sí' : 'No'
          })
      });
      console.log('Webhook sent to Make.com');
    } catch (webhookErr) {
      console.error('Error sending webhook to Make:', webhookErr);
    }

    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Error sending email' });
  }
}
