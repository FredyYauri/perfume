/** Claves centralizadas de localStorage. Cambia la versión si cambia el formato guardado. */
export const STORAGE_KEYS = {
  selection: 'esencialab.selection.v1',
  format: 'esencialab.format.v1',
  sheetNumber: 'esencialab.sheet-number.v1',
  favorites: 'esencialab.favorites.v1',
} as const;
