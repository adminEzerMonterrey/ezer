import nodemailer from 'nodemailer';

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

  const { org, email, phone, hasFile, fileName } = req.body;

  if (!org || !email) {
    return res.status(400).json({ message: 'Organization and email are required' });
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

    // 1. Correo al administrador
    await transporter.sendMail({
      from: `"Ezer Colaboraciones" <${process.env.SMTP_USER}>`,
      to: 'ethan.rivera@udem.edu',
      subject: `Nueva Solicitud de Colaboración: ${org}`,
      text: `Nueva solicitud de colaboración recibida.\n\nOrganización: ${org}\nCorreo: ${email}\nTeléfono: ${phone || 'No proporcionado'}\nDocumento adjunto: ${hasFile ? fileName : 'No'}`,
      html: `
        <h2>Nueva Solicitud de Colaboración</h2>
        <p>Se ha recibido una nueva solicitud para colaborar con EZER.</p>
        <ul>
          <li><strong>Organización:</strong> ${org}</li>
          <li><strong>Correo Electrónico:</strong> <a href="mailto:${email}">${email}</a></li>
          <li><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</li>
          <li><strong>Documento adjunto:</strong> ${hasFile ? fileName : 'No se adjuntó archivo'}</li>
        </ul>
        <p><em>Revisa el panel de Supabase para ver todos los detalles.</em></p>
      `,
    });

    // 2. Correo de confirmación al usuario
    await transporter.sendMail({
      from: `"Ezer Colaboraciones" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Confirmación de solicitud de colaboración – EZER`,
      text: `Hola,\n\nHemos recibido tu solicitud de colaboración de parte de "${org}".\n\nNuestro equipo revisará tu información y se pondrá en contacto contigo en las próximas 48 horas.\n\nGracias por tu interés en colaborar con EZER.\n\nAtentamente,\nEquipo EZER`,
      html: `
        <h2>¡Gracias por querer colaborar con EZER!</h2>
        <p>Hemos recibido correctamente tu solicitud de colaboración.</p>
        <p><strong>Resumen:</strong></p>
        <ul>
          <li><strong>Organización:</strong> ${org}</li>
          <li><strong>Correo:</strong> ${email}</li>
          <li><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</li>
          <li><strong>Documento adjunto:</strong> ${hasFile ? 'Sí (' + fileName + ')' : 'No'}</li>
        </ul>
        <p>Nuestro equipo revisará tu información y se pondrá en contacto contigo en las próximas <strong>48 horas</strong>.</p>
        <br>
        <p>Atentamente,<br><strong>Equipo EZER</strong></p>
      `,
    });

    return res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending collaboration email:', error);
    return res.status(500).json({ message: 'Error sending email' });
  }
}
