import { PerfumeCategoryId } from './perfume.model';

export interface Category {
  readonly id: PerfumeCategoryId;
  readonly name: string;
  readonly description: string;
  readonly order: number;
  readonly image?: string;
}

export interface OlfactoryProfile {
  readonly id: string;
  readonly name: string;
  /** Color del punto que identifica el perfil en los filtros. */
  readonly color: string;
  /** Palabras de "sensación" usadas por la búsqueda (p. ej. "fresco limpio"). */
  readonly mood: string;
}
