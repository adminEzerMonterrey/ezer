import pool from './db.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-do-not-use-in-prod';

// Middleware para verificar token en rutas nativas de serverless
const authenticate = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
};

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const [rows] = await pool.query('SELECT * FROM events ORDER BY event_date ASC');
      // Aseguramos que tengan el formato correcto para el frontend
      const events = rows.map(event => {
        const d = new Date(event.event_date);
        return {
          id: event.id,
          title: event.title,
          company: event.company,
          date: event.event_date,
          // Convertimos la fecha a mes corto y día, p.ej 'ABR' y '15'
          month: d.toLocaleString('es-ES', { month: 'short' }).toUpperCase(),
          day: d.getDate().toString().padStart(2, '0'),
          category: event.category,
          audience: event.audience,
          description: event.description,
          image: event.image_url,
          spots: event.spots
        };
      });
      return res.status(200).json(events);
    } 
    
    else if (req.method === 'POST') {
      // Proteger POST
      const user = authenticate(req);
      if (!user) return res.status(401).json({ message: 'No autorizado' });

      const { title, company, event_date, category, audience, description, image_url, spots } = req.body;
      const [result] = await pool.query(
        'INSERT INTO events (title, company, event_date, category, audience, description, image_url, spots) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [title, company, event_date, category, audience, description, image_url, spots]
      );
      return res.status(201).json({ message: 'Evento insertado', id: result.insertId });
    }

    else if (req.method === 'DELETE') {
       // Proteger DELETE
       const user = authenticate(req);
       if (!user) return res.status(401).json({ message: 'No autorizado' });
 
       const { id } = req.query; // e.g. /api/events?id=5
       if (!id) return res.status(400).json({ message: 'ID no especificado' });
 
       await pool.query('DELETE FROM events WHERE id = ?', [id]);
       return res.status(200).json({ message: 'Evento eliminado exitosamente' });
    } 
    
    else {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('API /events error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
