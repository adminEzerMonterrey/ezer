import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';


export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, phone, company, email, eventName, description, wantsTraining, municipio, projects, comments } = req.body;

  if (!name || !phone || !email || !eventName) {
    return res.status(400).json({ message: 'Name, phone, email, and eventName are required' });
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
    const adminSubject = isRegistration 
      ? `Nuevo Registro de Empresa: ${eventName}`
      : `Nuevo Interesado en Evento del Catálogo: ${eventName}`;
      
    const userSubject = isRegistration
      ? `Recibimos tu interés — te buscaremos muy pronto`
      : `Confirmación de solicitud para evento: ${eventName}`;

    const projectsHtml = (projects && projects.length > 0)
      ? `<li><strong>Programas de interés:</strong><ul>${projects.map(p => `<li>${p}</li>`).join('')}</ul></li>`
      : '';
    
    const municipioHtml = municipio ? `<li><strong>Municipio:</strong> ${municipio}</li>` : '';
    const finalComments = comments ? comments : description;

    // 1. Mensaje para el administrador
    const adminInfo = await transporter.sendMail({
      from: `"Ezer Eventos" <${process.env.SMTP_USER}>`,
      to: adminEmail, 
      subject: adminSubject,
      text: `Tienes un nuevo prospecto interesado en el evento "${eventName}".\n\nNombre: ${name}\nEmpresa: ${company}\nCorreo: ${email}\nMunicipio: ${municipio || 'No especificado'}\nProgramas de interés: ${projects ? projects.join(', ') : 'N/A'}\n¿Quiere capacitación?: ${wantsTraining ? 'Sí' : 'No'}\nComentarios: ${finalComments}`,
      html: `
        <h2>Nuevo Prospecto de Voluntariado</h2>
        <p><strong>Evento seleccionado:</strong> ${eventName}</p>
        <ul>
          <li><strong>Nombre:</strong> ${name}</li>
          <li><strong>Teléfono:</strong> ${phone}</li>
          <li><strong>Organización / Empresa:</strong> ${company || 'N/A'}</li>
          <li><strong>Correo Electrónico:</strong> <a href="mailto:${email}">${email}</a></li>
          ${municipioHtml}
          ${projectsHtml}
          <li><strong>¿Quiere capacitación?:</strong> ${wantsTraining ? 'Sí' : 'No'}</li>
        </ul>
        <p><strong>Comentarios adicionales:</strong></p>
        <p>${finalComments}</p>
      `,
    });

    const userTextRegistration = `Estimada/o ${name}:
¡Gracias por su interés en el programa de Voluntariado Corporativo de EZER! Nos alegra mucho saber que ${company || 'su empresa/asociación'} quiere participar.
Queremos confirmarle que ya recibimos su mensaje. En breve, una persona de nuestro equipo le buscará para dar seguimiento, resolver cualquier duda y comenzar a coordinar los detalles.
Mientras tanto, no necesita hacer nada más: nosotros le contactaremos muy pronto.
Agradecemos su confianza y sus ganas de generar impacto en la comunidad. ¡Estamos por construir algo muy valioso juntos!

Saludos cordiales,
Equipo EZER
EZER A.B.P. · La Casa del Voluntario
voluntariadocorporativo@ezer.org.mx
ezer-eventos.vercel.app`;

    const userHtmlRegistration = `
      <p>Estimada/o ${name}:</p>
      <p>¡Gracias por su interés en el programa de Voluntariado Corporativo de EZER! Nos alegra mucho saber que <strong>${company || 'su empresa/asociación'}</strong> quiere participar.</p>
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

    const userTextCatalog = `Hola ${name},\n\nHemos recibido tu solicitud de interés para el evento "${eventName}".\nEstos son los datos que nos enviaste:\n\nTeléfono: ${phone}\nEmpresa: ${company}\n¿Quieres capacitación?: ${wantsTraining ? 'Sí' : 'No'}\nDescripción y Motivo: ${description}\n\nPronto nos pondremos en contacto contigo.\n\nSaludos,\nEquipo Ezer`;

    const userHtmlCatalog = `
      <h2>¡Gracias por tu interés, ${name}!</h2>
      <p>Hemos recibido correctamente tus datos para participar en el evento <strong>${eventName}</strong>.</p>
      <p><strong>Resumen de tu solicitud:</strong></p>
      <ul>
        <li><strong>Teléfono:</strong> ${phone}</li>
        <li><strong>Organización / Empresa:</strong> ${company || 'N/A'}</li>
        <li><strong>¿Quieres capacitación?:</strong> ${wantsTraining ? 'Sí' : 'No'}</li>
        <li><strong>Tus comentarios:</strong> ${description}</li>
      </ul>
      <p>Nos pondremos en contacto contigo lo más pronto posible para darte más detalles.</p>
      <br>
      <p>Atentamente,<br><strong>Equipo EZER</strong></p>
    `;

    // 2. Mensaje de confirmación para el usuario que llenó el formulario
    const userInfo = await transporter.sendMail({
      from: `"Ezer Eventos" <${process.env.SMTP_USER}>`,
      to: email, 
      subject: userSubject,
      text: isRegistration ? userTextRegistration : userTextCatalog,
      html: isRegistration ? userHtmlRegistration : userHtmlCatalog,
    });

    console.log('Message sent to admin: %s', adminInfo.messageId);
    console.log('Message sent to user: %s', userInfo.messageId);

    if (!isRegistration) {
      try {
        await fetch("https://hook.us2.make.com/gk3msgktwdcxack4cb718h5d6a5ntfsd", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
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
    }

    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Error sending email' });
  }
}
