export type NavLink = { label: string; path: string; description?: string };
export type NavItem = NavLink & { children?: readonly NavLink[] };

// Los tres proyectos que EZER desarrolla hoy. Se muestran en /proyectos.
export const proyectos: readonly NavLink[] = [
  {
    label: "Empresas Voluntarias",
    path: "/catalogo-eventos",
    description: "Jornadas de voluntariado corporativo: tu empresa elige un evento y EZER la conecta con una asociación.",
  },
  {
    label: "Universidades",
    path: "/universidades",
    description: "Programas para que estudiantes y universidades sumen horas de servicio con causas reales.",
  },
  {
    label: "Aliados Voluntarios",
    path: "/aliados",
    description: "Artistas, talleristas y profesionales que comparten su talento con las asociaciones.",
  },
];

// Menú plano: "Proyectos" lleva a los eventos y los tres proyectos van enumerados a la vista.
export const navItems: readonly NavItem[] = [
  { label: "Quiénes Somos", path: "/" },
  { label: "Proyectos", path: "/catalogo-eventos" },
  { label: "1. Empresas Voluntarias", path: "/catalogo-eventos" },
  { label: "2. Universidades", path: "/universidades" },
  { label: "3. Aliados Voluntarios", path: "/aliados" },
  { label: "Empresas Aliadas", path: "/empresas-aliadas" },
  { label: "Cursos de Sensibilización", path: "/cursos" },
  { label: "Contáctanos", path: "/contactanos" },
];
