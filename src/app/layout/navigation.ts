export interface NavLink {
  readonly label: string;
  /** Ruta de destino. */
  readonly path: string;
  /** Ancla dentro de la página (secciones del inicio). */
  readonly fragment?: string;
}

/** Navegación principal del diseño: apunta a las secciones del inicio. */
export const NAV_LINKS: readonly NavLink[] = [
  { label: 'Explorar', path: '/', fragment: 'explorar' },
  { label: 'Arma tu set', path: '/', fragment: 'crea' },
  { label: 'Cómo funciona', path: '/', fragment: 'formatos' },
  { label: 'Comunidad', path: '/', fragment: 'comunidad' },
];

export const HELP_LINKS: readonly NavLink[] = [
  { label: 'Preguntas frecuentes', path: '/nosotros', fragment: 'preguntas' },
  { label: 'Mi selección', path: '/mi-seleccion' },
  { label: 'Favoritos', path: '/favoritos' },
  { label: 'Catálogo completo', path: '/catalogo' },
];
