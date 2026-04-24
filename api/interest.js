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

  const { name, phone, company, email, eventName, description } = req.body;

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
      console.log(`Description: ${description}`);
      console.log('-------------------------');
      // Aún así respondemos ok para que la Demo funcione sin trabarse.
      return res.status(200).json({ message: 'Email sent implicitly (DEV MODE)' });
    }

    // 1. Mensaje para el administrador (Ethan)
    const adminInfo = await transporter.sendMail({
      from: `"Ezer Eventos" <${process.env.SMTP_USER}>`,
      to: 'ethan.rivera@udem.edu', 
      subject: `Nuevo Interesado en Evento: ${eventName}`,
      text: `Tienes un nuevo prospecto interesado en el evento "${eventName}".\n\nNombre: ${name}\nEmpresa: ${company}\nCorreo: ${email}\nDescripción y Motivo: ${description}`,
      html: `
        <h2>Nuevo Prospecto de Voluntariado</h2>
        <p><strong>Evento seleccionado:</strong> ${eventName}</p>
        <ul>
          <li><strong>Nombre:</strong> ${name}</li>
          <li><strong>Teléfono:</strong> ${phone}</li>
          <li><strong>Organización / Empresa:</strong> ${company || 'N/A'}</li>
          <li><strong>Correo Electrónico:</strong> <a href="mailto:${email}">${email}</a></li>
        </ul>
        <p><strong>Comentarios adicionales:</strong></p>
        <p>${description}</p>
      `,
    });

    // 2. Mensaje de confirmación para el usuario que llenó el formulario
    const userInfo = await transporter.sendMail({
      from: `"Ezer Eventos" <${process.env.SMTP_USER}>`,
      to: email, 
      subject: `Confirmación de solicitud para evento: ${eventName}`,
      text: `Hola ${name},\n\nHemos recibido tu solicitud de interés para el evento "${eventName}".\nEstos son los datos que nos enviaste:\n\nTeléfono: ${phone}\nEmpresa: ${company}\nDescripción y Motivo: ${description}\n\nPronto nos pondremos en contacto contigo.\n\nSaludos,\nEquipo Ezer`,
      html: `
        <h2>¡Gracias por tu interés, ${name}!</h2>
        <p>Hemos recibido correctamente tus datos para participar en el evento <strong>${eventName}</strong>.</p>
        <p><strong>Resumen de tu solicitud:</strong></p>
        <ul>
          <li><strong>Teléfono:</strong> ${phone}</li>
          <li><strong>Organización / Empresa:</strong> ${company || 'N/A'}</li>
          <li><strong>Tus comentarios:</strong> ${description}</li>
        </ul>
        <p>Nos pondremos en contacto contigo lo más pronto posible para darte más detalles.</p>
        <br>
        <p>Atentamente,<br><strong>Equipo EZER</strong></p>
      `,
    });

    console.log('Message sent to admin: %s', adminInfo.messageId);
    console.log('Message sent to user: %s', userInfo.messageId);
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Error sending email' });
  }
}
