import { Gender, SortOption } from '../models';

export const GENDER_LABELS: Readonly<Record<Gender, string>> = {
  male: 'Masculino',
  female: 'Femenino',
  unisex: 'Unisex',
};

export const SORT_OPTIONS: readonly { readonly value: SortOption; readonly label: string }[] = [
  { value: 'curation', label: 'Curaduría' },
  { value: 'popular', label: 'Más populares' },
  { value: 'price', label: 'Precio' },
  { value: 'newest', label: 'Novedades' },
];

export interface FormatOption {
  readonly ml: number;
  readonly label: string;
}

/** Formatos del paso "Elige tu formato". */
export const FORMAT_OPTIONS: readonly FormatOption[] = [
  { ml: 3, label: 'Descubrimiento' },
  { ml: 5, label: 'Uso diario' },
  { ml: 10, label: 'Favorito personal' },
];

/** Niveles de intensidad, en orden, con el número de barras que se iluminan. */
export const INTENSITY_LEVELS: Readonly<Record<string, number>> = {
  Suave: 1,
  Equilibrada: 2,
  Intensa: 3,
};

/** Estilo visual de cada etiqueta destacada de las tarjetas. */
export const TAG_STYLES: Readonly<Record<string, 'hot' | 'new' | 'night'>> = {
  'Más elegido': 'hot',
  Nuevo: 'new',
  'Para la noche': 'night',
};

export const CATALOG_CONFIG = {
  defaultFormatMl: 5,
  /** Casillas que muestra el visor del set en "Tu selección". */
  selectionSlots: 5,
  /** `true` para mostrar las fotos (`image` del JSON) en lugar de la ilustración del frasco. */
  useProductPhotos: false,
  relatedLimit: 4,
  skeletonCount: 6,
  searchDebounceMs: 200,
} as const;
