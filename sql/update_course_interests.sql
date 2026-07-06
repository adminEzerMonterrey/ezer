-- Script para actualizar la tabla course_interests
-- Agrega soporte para múltiples eventos y comentarios
-- Ejecuta esto en tu panel de Supabase (SQL Editor)

ALTER TABLE course_interests 
ADD COLUMN IF NOT EXISTS eventos_seleccionados TEXT,
ADD COLUMN IF NOT EXISTS comentarios TEXT;
