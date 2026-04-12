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

  const { name, company, email, eventName, description } = req.body;

  if (!name || !email || !eventName) {
    return res.status(400).json({ message: 'Name, email, and eventName are required' });
  }

  try {
    // Si no hay configuración real de SMTP, usamos uno de prueba de ethereal (o console.log en entorno dev)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
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
      console.log(`Email: ${email}`);
      console.log(`Description: ${description}`);
      console.log('-------------------------');
      // Aún así respondemos ok para que la Demo funcione sin trabarse.
      return res.status(200).json({ message: 'Email sent implicitly (DEV MODE)' });
    }

    const info = await transporter.sendMail({
      from: `"Ezer Eventos" <${process.env.SMTP_USER}>`,
      to: 'ethan.rivera@udem.edu', 
      subject: `Nuevo Interesado en Evento: ${eventName}`,
      text: `Tienes un nuevo prospecto interesado en el evento "${eventName}".\n\nNombre: ${name}\nEmpresa: ${company}\nCorreo: ${email}\nDescripción y Motivo: ${description}`,
      html: `
        <h2>Nuevo Prospecto de Voluntariado</h2>
        <p><strong>Evento seleccionado:</strong> ${eventName}</p>
        <ul>
          <li><strong>Nombre:</strong> ${name}</li>
          <li><strong>Organización / Empresa:</strong> ${company || 'N/A'}</li>
          <li><strong>Correo Electrónico:</strong> <a href="mailto:${email}">${email}</a></li>
        </ul>
        <p><strong>Comentarios adicionales:</strong></p>
        <p>${description}</p>
      `,
    });

    console.log('Message sent: %s', info.messageId);
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Error sending email' });
  }
}
