-- Tabla para registrar el interés en cursos de sensibilización
CREATE TABLE IF NOT EXISTS course_interests (
  id              BIGSERIAL PRIMARY KEY,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  curso_id        INTEGER NOT NULL,
  curso_area      TEXT NOT NULL,
  categoria       TEXT NOT NULL,
  nombre          TEXT NOT NULL,
  correo          TEXT NOT NULL,
  telefono        TEXT,
  empresa         TEXT
);

-- Habilitar RLS
ALTER TABLE course_interests ENABLE ROW LEVEL SECURITY;

-- Política: cualquiera puede insertar (formulario público)
CREATE POLICY "insert_course_interests"
  ON course_interests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Política: solo usuarios autenticados (admin) pueden leer
CREATE POLICY "read_course_interests"
  ON course_interests
  FOR SELECT
  TO authenticated
  USING (true);
