-- Script de creación de base de datos e inserción de datos de eventos para Ezer
CREATE DATABASE IF NOT EXISTS ezer_db;
USE ezer_db;

CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(150) NOT NULL,
    event_date DATE NOT NULL,
    category VARCHAR(100) NOT NULL,
    audience VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    spots INT NOT NULL
);

-- Insertando los datos extraídos de EventCatalog.tsx
INSERT INTO events (title, company, event_date, category, audience, description, image_url, spots) 
VALUES
(
    'Jornada de Limpieza Costera', 
    'GreenEnergy S.A.', 
    '2026-04-15', 
    'Medio Ambiente', 
    'Familias', 
    'Únete a nosotros para limpiar 5km de playa y contribuir a la preservación de ecosistemas marinos.', 
    'https://images.unsplash.com/photo-1758599667717-27c61bcdd14b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbnZpcm9ubWVudGFsJTIwY2xlYW51cCUyMHZvbHVudGVlcnMlMjBuYXR1cmV8ZW58MXx8fHwxNzc1NTA1NDI0fDA&ixlib=rb-4.1.0&q=80&w=400', 
    40
),
(
    'Taller de Programación Infantil', 
    'InnovateTech Corp.', 
    '2026-04-22', 
    'Educación', 
    'Niños 8–12', 
    'Voluntarios enseñan conceptos básicos de programación a niños de comunidades vulnerables.', 
    'https://images.unsplash.com/photo-1763310225230-6e15b125935a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGVkdWNhdGlvbiUyMHdvcmtzaG9wJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc3NTUwNTQyNXww&ixlib=rb-4.1.0&q=80&w=400', 
    25
),
(
    'Banco de Alimentos Comunitario', 
    'NutriCorp Foods', 
    '2026-05-10', 
    'Alimentación', 
    'Todos', 
    'Clasificación y distribución de alimentos para más de 500 familias en situación vulnerable.', 
    'https://images.unsplash.com/photo-1593113630400-ea4288922497?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwYmFuayUyMGRvbmF0aW9uJTIwY2hhcml0eSUyMHBlb3BsZXxlbnwxfHx8fDE3NzU1MDU0MjV8MA&ixlib=rb-4.1.0&q=80&w=400', 
    60
),
(
    'Reforestación Urbana', 
    'EcoBuilders S.A.', 
    '2026-06-05', 
    'Medio Ambiente', 
    'Adultos', 
    'Plantación de 500 árboles nativos en parques y avenidas del área metropolitana.', 
    'https://images.unsplash.com/photo-1656311879551-562fe942a8ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBzb2NpYWwlMjByZXNwb25zaWJpbGl0eSUyMHRlYW0lMjBldmVudHxlbnwxfHx8fDE3NzU1MDU0MjV8MA&ixlib=rb-4.1.0&q=80&w=400', 
    35
),
(
    'Mentorías Profesionales', 
    'ConsultaPro Group', 
    '2026-06-18', 
    'Educación', 
    'Jóvenes', 
    'Profesionales senior brindan orientación de carrera a jóvenes de primer empleo.', 
    'https://images.unsplash.com/photo-1694286080661-f44117e019ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub25wcm9maXQlMjBjb21tdW5pdHklMjBnYXRoZXJpbmclMjBwZW9wbGUlMjBzbWlsaW5nfGVufDF8fHx8MTc3NTUwNTQyNXww&ixlib=rb-4.1.0&q=80&w=400', 
    20
),
(
    'Brigada Médica Rural', 
    'MedGroup Internacional', 
    '2026-07-08', 
    'Salud', 
    'Adultos mayores', 
    'Atención médica gratuita a comunidades rurales: consultas, vacunación y chequeos preventivos.', 
    'https://images.unsplash.com/photo-1774334136160-1825daf3ce16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwcGVvcGxlJTIwaGFuZHMlMjB0b2dldGhlciUyMGNvbW11bml0eSUyMHVuaXR5fGVufDF8fHx8MTc3NTUwNTQzM3ww&ixlib=rb-4.1.0&q=80&w=400', 
    30
);
