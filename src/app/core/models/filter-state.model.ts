import { Gender, PerfumeCategoryId } from './perfume.model';

export type SortOption = 'curation' | 'popular' | 'price' | 'newest';

export interface FilterState {
  readonly search: string;
  /** Colección única seleccionada (o `null` para todas). */
  readonly category: PerfumeCategoryId | null;
  readonly profiles: readonly string[];
  readonly occasions: readonly string[];
  readonly intensity: string | null;
  readonly genders: readonly Gender[];
  readonly brands: readonly string[];
  /** Formato (ml) usado para precios, orden por precio y disponibilidad. */
  readonly sizeMl: number;
  readonly onlyInStock: boolean;
  readonly sort: SortOption;
}

/** Opciones disponibles para construir el panel de filtros a partir de los datos. */
export interface FilterOptions {
  readonly brands: readonly string[];
  readonly occasions: readonly string[];
  readonly intensities: readonly string[];
  readonly genders: readonly Gender[];
  readonly sizes: readonly number[];
}
